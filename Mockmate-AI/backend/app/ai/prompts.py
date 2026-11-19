"""
Evaluation prompts and JSON schemas for Mockmate AI.
"""

SYSTEM_PROMPT = """You are Mockmate AI, an expert, objective, and supportive technical interview evaluator.
Your role is to rigorously evaluate candidate interview answers according to a formal 4-dimension rubric.

RUBRIC DIMENSIONS (Each dimension is scored from 1 to 5 as an integer or half-integer):
1. CLARITY (1 to 5):
   - 1: Incoherent, highly confusing, or contradictory.
   - 2: Vague or hard to follow; struggles to explain concepts simply.
   - 3: Understandable but lacks crisp precision; basic communication.
   - 4: Clear, articulate, and accessible with accurate terminology.
   - 5: Exceptionally lucid, precise, and easily comprehensible.

2. RELEVANCE (1 to 5):
   - 1: Off-topic or fails to answer the core technical question.
   - 2: Only touches peripheral topics; misses the primary question.
   - 3: Answers the general question but misses key technical subtleties.
   - 4: Directly addresses the question with sound technical accuracy.
   - 5: Comprehensively answers all aspects with depth and exact technical relevance.

3. STRUCTURE (1 to 5):
   - 1: Disorganized stream of consciousness with no logical progression.
   - 2: Weak sequencing; jumps between points abruptly.
   - 3: Adequate organization (e.g. definition -> brief explanation).
   - 4: Well-structured with logical progression, headings, or step-by-step reasoning.
   - 5: Masterfully structured (e.g., high-level overview -> architectural detail -> tradeoffs -> concrete example).

4. CONFIDENCE (1 to 5 - Linguistic Indicators Only):
   - Note: Evaluate linguistic assertiveness and directness only. Do NOT claim psychological measurements.
   - 1: Extremely timid, filled with uncertainty ("I guess maybe", "I could be totally wrong").
   - 2: Frequent hedging and hesitation.
   - 3: Neutral, modest tone.
   - 4: Direct, professional, and assertively phrased technical communication.
   - 5: Decisive, authoritative, professional tone without arrogance.

CRITICAL RULES:
- Semantic correctness over keyword matching: Do not penalize candidates simply for using different words than a reference answer.
- Answer length != quality: Do not reward fluff or penalize concise, accurate answers.
- Evidence requirement: For each dimension, provide an exact short excerpt from the candidate's answer if available, or state clearly: "[Observation: ...]" if pointing out an absence or structural pattern. Do NOT fabricate quotes.
- Suggested answer: Provide an illustrative, polished answer that highlights best practices, not claiming it is the sole correct response.
- Missing concepts: Identify important technical concepts that were omitted or misrepresented.
"""

EVALUATION_JSON_SCHEMA = {
    "name": "mockmate_interview_evaluation",
    "strict": True,
    "schema": {
        "type": "object",
        "properties": {
            "scores": {
                "type": "object",
                "properties": {
                    "clarity": {"type": "number", "description": "Score from 1.0 to 5.0"},
                    "relevance": {"type": "number", "description": "Score from 1.0 to 5.0"},
                    "structure": {"type": "number", "description": "Score from 1.0 to 5.0"},
                    "confidence": {"type": "number", "description": "Score from 1.0 to 5.0"}
                },
                "required": ["clarity", "relevance", "structure", "confidence"],
                "additionalProperties": False
            },
            "explanations": {
                "type": "object",
                "properties": {
                    "clarity": {"type": "string", "description": "Detailed justification for clarity score"},
                    "relevance": {"type": "string", "description": "Detailed justification for relevance score"},
                    "structure": {"type": "string", "description": "Detailed justification for structure score"},
                    "confidence": {"type": "string", "description": "Detailed justification for linguistic confidence score"}
                },
                "required": ["clarity", "relevance", "structure", "confidence"],
                "additionalProperties": False
            },
            "evidence": {
                "type": "object",
                "properties": {
                    "clarity": {"type": "string", "description": "Direct excerpt or [Observation] from candidate answer"},
                    "relevance": {"type": "string", "description": "Direct excerpt or [Observation] from candidate answer"},
                    "structure": {"type": "string", "description": "Direct excerpt or [Observation] from candidate answer"},
                    "confidence": {"type": "string", "description": "Direct excerpt or [Observation] from candidate answer"}
                },
                "required": ["clarity", "relevance", "structure", "confidence"],
                "additionalProperties": False
            },
            "strengths": {
                "type": "array",
                "items": {"type": "string"},
                "description": "2-4 key technical and communication strengths"
            },
            "weaknesses": {
                "type": "array",
                "items": {"type": "string"},
                "description": "1-3 specific technical gaps or weaknesses"
            },
            "improvement_suggestions": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Actionable, concrete suggestions to improve this answer"
            },
            "missing_concepts": {
                "type": "array",
                "items": {"type": "string"},
                "description": "Expected technical concepts that were missing or insufficiently explained"
            },
            "suggested_answer": {
                "type": "string",
                "description": "An illustrative, high-scoring exemplary answer"
            }
        },
        "required": [
            "scores",
            "explanations",
            "evidence",
            "strengths",
            "weaknesses",
            "improvement_suggestions",
            "missing_concepts",
            "suggested_answer"
        ],
        "additionalProperties": False
    }
}


def build_evaluation_user_prompt(
    question_text: str,
    category: str,
    difficulty: str,
    expected_concepts: list,
    candidate_answer: str,
) -> str:
    concepts_formatted = "\n- ".join(expected_concepts) if expected_concepts else "None specified"
    return f"""Please evaluate the following technical interview response:

INTERVIEW METADATA:
Category: {category}
Difficulty Level: {difficulty}

INTERVIEW QUESTION:
{question_text}

EXPECTED TECHNICAL CONCEPTS / BENCHMARKS:
- {concepts_formatted}

CANDIDATE'S SUBMITTED ANSWER:
\"\"\"
{candidate_answer}
\"\"\"

Provide your evaluation following the required JSON schema strictly. Ensure evidence contains direct excerpts or '[Observation: ...]' annotations.
"""
