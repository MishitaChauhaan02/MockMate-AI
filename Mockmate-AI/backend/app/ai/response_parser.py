"""
Response parser and evidence verification module for Mockmate AI.
Verifies that quotes match the candidate's actual answer and annotates discrepancies.
"""

from typing import Dict, Any
from app.ai.scoring import validate_and_normalize_scores


def verify_evidence_against_answer(raw_evidence: str, candidate_answer: str) -> str:
    """
    Checks if raw_evidence is a verified excerpt in candidate_answer.
    If it is already an observation or not found verbatim, formats it as an observation.
    """
    if not raw_evidence or not raw_evidence.strip():
        return "[Observation: No specific textual excerpt highlighted]"
        
    text = raw_evidence.strip()
    # Check if already labeled as an observation
    if text.startswith("[Observation:") or text.startswith("Observation:"):
        return text if text.startswith("[") else f"[{text}]"
        
    # Remove quotes if wrapped in quotes
    cleaned_quote = text.strip('"\'')
    
    # Check if candidate answer contains this substring (case-insensitive substring check)
    if cleaned_quote.lower() in candidate_answer.lower():
        return f'"{cleaned_quote}"'
    else:
        # If words of quote appear, find approximate or label as observation
        return f'[Observation: {cleaned_quote}]'


def parse_and_validate_ai_response(raw_data: Dict[str, Any], candidate_answer: str) -> Dict[str, Any]:
    """
    Parses the raw AI output, validates scores independently, verifies evidence,
    and returns a clean, compliant evaluation dictionary.
    """
    scores_dict = raw_data.get("scores", {})
    clarity, relevance, structure, confidence, overall = validate_and_normalize_scores(scores_dict)

    raw_explanations = raw_data.get("explanations", {})
    explanations = {
        "clarity": str(raw_explanations.get("clarity", "Explanation not provided.")),
        "relevance": str(raw_explanations.get("relevance", "Explanation not provided.")),
        "structure": str(raw_explanations.get("structure", "Explanation not provided.")),
        "confidence": str(raw_explanations.get("confidence", "Explanation not provided.")),
    }

    raw_evidence = raw_data.get("evidence", {})
    evidence = {
        "clarity": verify_evidence_against_answer(str(raw_evidence.get("clarity", "")), candidate_answer),
        "relevance": verify_evidence_against_answer(str(raw_evidence.get("relevance", "")), candidate_answer),
        "structure": verify_evidence_against_answer(str(raw_evidence.get("structure", "")), candidate_answer),
        "confidence": verify_evidence_against_answer(str(raw_evidence.get("confidence", "")), candidate_answer),
    }

    strengths = [str(s) for s in raw_data.get("strengths", []) if str(s).strip()]
    if not strengths:
        strengths = ["Attempted to answer the prompt directly."]

    weaknesses = [str(w) for w in raw_data.get("weaknesses", []) if str(w).strip()]
    if not weaknesses:
        weaknesses = ["Could include deeper technical nuance and specific real-world examples."]

    improvement_suggestions = [str(i) for i in raw_data.get("improvement_suggestions", []) if str(i).strip()]
    if not improvement_suggestions:
        improvement_suggestions = ["Practice structuring answers with definition, mechanism, and edge cases."]

    missing_concepts = [str(m) for m in raw_data.get("missing_concepts", []) if str(m).strip()]

    suggested_answer = str(raw_data.get("suggested_answer", "Reference answer not available."))

    return {
        "scores": {
            "clarity": clarity,
            "relevance": relevance,
            "structure": structure,
            "confidence": confidence,
        },
        "overall_score": overall,
        "explanations": explanations,
        "evidence": evidence,
        "strengths": strengths,
        "weaknesses": weaknesses,
        "improvement_suggestions": improvement_suggestions,
        "missing_concepts": missing_concepts,
        "suggested_answer": suggested_answer,
    }
