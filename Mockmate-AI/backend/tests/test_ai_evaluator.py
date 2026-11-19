from app.ai.scoring import calculate_overall_score, clamp_score, validate_and_normalize_scores
from app.ai.response_parser import verify_evidence_against_answer, parse_and_validate_ai_response
from app.ai.evaluator import _heuristic_rubric_evaluation


def test_calculate_overall_score():
    score = calculate_overall_score(4.0, 5.0, 3.0, 4.0)
    assert score == 4.0

    score2 = calculate_overall_score(4.5, 3.5, 4.0, 3.0)
    assert score2 == 3.75


def test_clamp_score_boundaries():
    assert clamp_score(0.5) == 1.0
    assert clamp_score(6.8) == 5.0
    assert clamp_score(3.4) == 3.4
    assert clamp_score("invalid") == 3.0


def test_verify_evidence_against_answer():
    answer = "TCP is connection-oriented and provides reliable data transfer through acknowledgements."
    # Direct substring matches
    valid_quote = "TCP is connection-oriented"
    result = verify_evidence_against_answer(valid_quote, answer)
    assert result == f'"{valid_quote}"'

    # Non-existent substring becomes observation
    missing_quote = "UDP has higher latency"
    obs_result = verify_evidence_against_answer(missing_quote, answer)
    assert "[Observation:" in obs_result


def test_parse_and_validate_ai_response():
    raw_ai_payload = {
        "scores": {"clarity": 4, "relevance": 5, "structure": 3, "confidence": 4},
        "overall_score": 99.9,  # Intentionally corrupted; backend must overwrite!
        "explanations": {
            "clarity": "Good clarity.",
            "relevance": "Direct answer.",
            "structure": "Clear steps.",
            "confidence": "Assertive tone."
        },
        "evidence": {
            "clarity": "lists and dicts",
            "relevance": "mutable objects",
            "structure": "For example",
            "confidence": "in place"
        },
        "strengths": ["Clear definitions"],
        "weaknesses": ["Missed memory allocation details"],
        "improvement_suggestions": ["Mention memory references"],
        "missing_concepts": ["id() function"],
        "suggested_answer": "In Python, mutability refers to whether an object's internal state can change..."
    }
    answer = "In Python, mutable objects like lists and dicts can be modified in place. For example append."
    parsed = parse_and_validate_ai_response(raw_ai_payload, answer)

    # Independent overall score check
    assert parsed["overall_score"] == 4.0  # (4 + 5 + 3 + 4) / 4 = 4.0, not 99.9!
    assert parsed["scores"]["clarity"] == 4.0
    assert len(parsed["strengths"]) == 1
    assert "lists and dicts" in parsed["evidence"]["clarity"]


def test_heuristic_rubric_evaluator():
    eval_result = _heuristic_rubric_evaluation(
        question_text="Explain Python list vs tuple.",
        category="Python",
        difficulty="Beginner",
        expected_concepts=["mutable vs immutable", "memory footprint", "syntax differences"],
        candidate_answer="A list is mutable while a tuple is immutable. Tuples generally use less memory footprint."
    )
    assert 1.0 <= eval_result["overall_score"] <= 5.0
    assert "mutable vs immutable" in eval_result["strengths"][0] or "substantive" in eval_result["strengths"][0]
    assert len(eval_result["suggested_answer"]) > 20
