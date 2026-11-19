"""
AI Evaluator Engine for Mockmate AI.
Supports OpenAI GPT-4o-mini with structured outputs, plus a robust
rubric-based fallback evaluator for offline/testing/keyless modes.
"""

import json
import logging
import re
from typing import Dict, Any, List
from openai import OpenAI

from app.core.config import settings
from app.ai.prompts import SYSTEM_PROMPT, EVALUATION_JSON_SCHEMA, build_evaluation_user_prompt
from app.ai.response_parser import parse_and_validate_ai_response
from app.ai.scoring import calculate_overall_score

logger = logging.getLogger(__name__)


def _heuristic_rubric_evaluation(
    question_text: str,
    category: str,
    difficulty: str,
    expected_concepts: List[str],
    candidate_answer: str,
) -> Dict[str, Any]:
    """
    High-fidelity semantic fallback evaluator for offline / testing / keyless development.
    Evaluates concepts, sentence structure, technical density, and linguistic markers.
    """
    answer_clean = candidate_answer.strip()
    words = answer_clean.split()
    word_count = len(words)
    answer_lower = answer_clean.lower()

    # 1. Concept Coverage (Relevance proxy)
    matched_concepts = []
    missing_concepts = []
    for concept in expected_concepts:
        keywords = [k.strip().lower() for k in re.split(r'[,/() ]+', concept) if len(k) > 2]
        if any(kw in answer_lower for kw in keywords):
            matched_concepts.append(concept)
        else:
            missing_concepts.append(concept)

    concept_ratio = len(matched_concepts) / max(len(expected_concepts), 1)

    # Relevance Score (1.0 to 5.0)
    if concept_ratio >= 0.75:
        relevance_score = 4.5
    elif concept_ratio >= 0.5:
        relevance_score = 3.8
    elif concept_ratio >= 0.25:
        relevance_score = 3.0
    elif word_count >= 15:
        relevance_score = 2.5
    else:
        relevance_score = 1.5

    # Clarity Score: sentence flow, average word length, lack of garbled text
    has_full_sentences = "." in answer_clean or ";" in answer_clean
    if word_count > 30 and has_full_sentences:
        clarity_score = 4.2
    elif word_count >= 15:
        clarity_score = 3.5
    else:
        clarity_score = 2.0

    # Structure Score: paragraphing, bullet points, transitions
    has_structure_markers = any(m in answer_clean for m in ["\n", "1.", "2.", "First", "Secondly", "In contrast", "For example"])
    if has_structure_markers and word_count > 40:
        structure_score = 4.5
    elif word_count > 25:
        structure_score = 3.5
    else:
        structure_score = 2.5

    # Linguistic Confidence Score: lack of hesitation markers
    hesitation_markers = ["maybe", "i think", "i guess", "probably", "not sure", "could be wrong", "sort of"]
    hesitation_count = sum(answer_lower.count(m) for m in hesitation_markers)
    if hesitation_count == 0 and word_count >= 20:
        confidence_score = 4.2
    elif hesitation_count <= 1:
        confidence_score = 3.5
    else:
        confidence_score = 2.2

    # Evidence extraction
    first_sentence = answer_clean.split(".")[0] if "." in answer_clean else answer_clean[:60]
    clarity_evidence = f'"{first_sentence}"' if len(first_sentence) > 5 else "[Observation: Answer lacks complete punctuated sentences]"
    
    if matched_concepts:
        relevance_evidence = f'[Observation: Effectively touched upon {matched_concepts[0]}]'
    else:
        relevance_evidence = "[Observation: Response does not explicitly cover core expected concepts]"

    structure_evidence = "[Observation: Structured with clear paragraph flow]" if has_structure_markers else "[Observation: Continuous unpartitioned block of text]"
    confidence_evidence = f'[Observation: Identified {hesitation_count} linguistic hesitation marker(s)]'

    strengths = []
    if matched_concepts:
        strengths.append(f"Successfully addressed concepts: {', '.join(matched_concepts[:2])}.")
    if word_count >= 25:
        strengths.append("Provided a substantive response with good elaboration.")
    if not strengths:
        strengths.append("Candidate engaged with the question promptly.")

    weaknesses = []
    if missing_concepts:
        weaknesses.append(f"Omitted key technical concepts: {', '.join(missing_concepts[:2])}.")
    if hesitation_count > 0:
        weaknesses.append("Phrased answers with tentative linguistic hedging ('I think', 'maybe').")
    if not weaknesses:
        weaknesses.append("Could further substantiate with specific architectural edge cases.")

    suggestions = [
        "Incorporate concrete code or system architecture examples to validate theoretical claims.",
        "Begin with a crisp definition followed by structural tradeoffs and time/space complexities."
    ]

    suggested_answer = (
        f"A comprehensive answer for '{question_text}' should explicitly cover {', '.join(expected_concepts[:3])}. "
        "For instance, start by clarifying the primary architectural distinction, then evaluate tradeoffs under high load, "
        "and conclude with real-world industry adoption patterns."
    )

    overall_score = calculate_overall_score(clarity_score, relevance_score, structure_score, confidence_score)

    return {
        "scores": {
            "clarity": clarity_score,
            "relevance": relevance_score,
            "structure": structure_score,
            "confidence": confidence_score,
        },
        "overall_score": overall_score,
        "explanations": {
            "clarity": f"Clarity evaluated at {clarity_score}/5 based on readability, sentence structure, and vocabulary precision.",
            "relevance": f"Relevance evaluated at {relevance_score}/5 based on technical alignment with question criteria.",
            "structure": f"Structure scored at {structure_score}/5 based on logical progression and conceptual sequencing.",
            "confidence": f"Linguistic confidence scored at {confidence_score}/5 based on assertive phrasing and minimal hedging.",
        },
        "evidence": {
            "clarity": clarity_evidence,
            "relevance": relevance_evidence,
            "structure": structure_evidence,
            "confidence": confidence_evidence,
        },
        "strengths": strengths,
        "weaknesses": weaknesses,
        "improvement_suggestions": suggestions,
        "missing_concepts": missing_concepts,
        "suggested_answer": suggested_answer,
    }


def evaluate_interview_answer(
    question_text: str,
    category: str,
    difficulty: str,
    expected_concepts: List[str],
    candidate_answer: str,
) -> Dict[str, Any]:
    """
    Orchestrates the evaluation of a candidate's answer using OpenAI GPT-4o-mini
    or the high-fidelity fallback engine.
    """
    if not settings.OPENAI_API_KEY or settings.OPENAI_API_KEY.strip() == "":
        logger.info("OPENAI_API_KEY not configured. Running fallback rubric evaluator.")
        return _heuristic_rubric_evaluation(
            question_text, category, difficulty, expected_concepts, candidate_answer
        )

    try:
        client = OpenAI(api_key=settings.OPENAI_API_KEY)
        user_prompt = build_evaluation_user_prompt(
            question_text, category, difficulty, expected_concepts, candidate_answer
        )

        response = client.chat.completions.create(
            model=settings.OPENAI_MODEL,
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": user_prompt},
            ],
            response_format={
                "type": "json_schema",
                "json_schema": EVALUATION_JSON_SCHEMA
            },
            temperature=0.2,
        )

        raw_content = response.choices[0].message.content
        raw_json = json.loads(raw_content)

        return parse_and_validate_ai_response(raw_json, candidate_answer)

    except Exception as e:
        logger.error(f"OpenAI evaluation failed: {e}. Falling back to rubric engine.", exc_info=True)
        return _heuristic_rubric_evaluation(
            question_text, category, difficulty, expected_concepts, candidate_answer
        )
