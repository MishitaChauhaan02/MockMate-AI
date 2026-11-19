"""
Independent scoring and validation module for Mockmate AI.
Ensures mathematical integrity and rubric boundary compliance.
"""

from typing import Tuple


def clamp_score(score: float, min_val: float = 1.0, max_val: float = 5.0) -> float:
    """Clamps a numerical score to the valid range [1.0, 5.0]."""
    try:
        val = float(score)
        return max(min_val, min(max_val, round(val, 1)))
    except (ValueError, TypeError):
        return 3.0


def calculate_overall_score(
    clarity: float,
    relevance: float,
    structure: float,
    confidence: float
) -> float:
    """
    Independently calculate overall score as the arithmetic mean of the four dimensions.
    Formula: (Clarity + Relevance + Structure + Confidence) / 4.0
    Rounds to 2 decimal places.
    """
    c = clamp_score(clarity)
    r = clamp_score(relevance)
    s = clamp_score(structure)
    conf = clamp_score(confidence)
    
    overall = (c + r + s + conf) / 4.0
    return round(overall, 2)


def validate_and_normalize_scores(
    scores_dict: dict
) -> Tuple[float, float, float, float, float]:
    """
    Validates all dimension scores and computes the authoritative overall score.
    Returns: (clarity, relevance, structure, confidence, overall_score)
    """
    clarity = clamp_score(scores_dict.get("clarity", 3.0))
    relevance = clamp_score(scores_dict.get("relevance", 3.0))
    structure = clamp_score(scores_dict.get("structure", 3.0))
    confidence = clamp_score(scores_dict.get("confidence", 3.0))
    
    overall = calculate_overall_score(clarity, relevance, structure, confidence)
    return clarity, relevance, structure, confidence, overall
