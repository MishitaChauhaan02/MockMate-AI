def test_create_interview(client, auth_headers):
    payload = {
        "category": "Data Structures and Algorithms",
        "difficulty": "Beginner",
        "total_questions": 2,
        "mode": "practice"
    }
    response = client.post("/api/interviews", json=payload, headers=auth_headers)
    assert response.status_code == 201
    data = response.json()
    assert data["category"] == "Data Structures and Algorithms"
    assert data["difficulty"] == "Beginner"
    assert len(data["questions"]) >= 1
    assert data["status"] == "in_progress"


def test_submit_and_evaluate_answer(client, auth_headers):
    # 1. Create interview
    create_resp = client.post(
        "/api/interviews",
        json={
            "category": "Python",
            "difficulty": "Beginner",
            "total_questions": 2,
            "mode": "practice"
        },
        headers=auth_headers
    )
    interview_data = create_resp.json()
    interview_id = interview_data["id"]
    question = interview_data["questions"][0]

    # 2. Submit answer
    answer_payload = {
        "question_id": question["id"],
        "answer_text": "In Python, mutable objects like lists and dictionaries can be changed in place, while immutable objects like tuples and strings cannot have their internal state altered.",
        "question_order": 1
    }
    submit_resp = client.post(
        f"/api/interviews/{interview_id}/submit-answer",
        json=answer_payload,
        headers=auth_headers
    )
    assert submit_resp.status_code == 200
    answer_data = submit_resp.json()
    assert answer_data["answer_text"] == answer_payload["answer_text"]
    assert answer_data["evaluation"] is not None
    eval_data = answer_data["evaluation"]
    
    # Assert rubric dimensions and backend overall score
    assert 1.0 <= eval_data["clarity_score"] <= 5.0
    assert 1.0 <= eval_data["relevance_score"] <= 5.0
    assert 1.0 <= eval_data["structure_score"] <= 5.0
    assert 1.0 <= eval_data["confidence_score"] <= 5.0
    expected_overall = round(
        (eval_data["clarity_score"] + eval_data["relevance_score"] + eval_data["structure_score"] + eval_data["confidence_score"]) / 4.0,
        2
    )
    assert eval_data["overall_score"] == expected_overall
    assert len(eval_data["strengths"]) > 0
    assert len(eval_data["suggested_answer"]) > 10


def test_complete_interview(client, auth_headers):
    # 1. Create interview
    create_resp = client.post(
        "/api/interviews",
        json={
            "category": "Database Management Systems",
            "difficulty": "Beginner",
            "total_questions": 1,
            "mode": "practice"
        },
        headers=auth_headers
    )
    interview_id = create_resp.json()["id"]
    question_id = create_resp.json()["questions"][0]["id"]

    # 2. Submit answer
    client.post(
        f"/api/interviews/{interview_id}/submit-answer",
        json={
            "question_id": question_id,
            "answer_text": "ACID stands for Atomicity, Consistency, Isolation, and Durability. Atomicity ensures all-or-nothing transactions.",
            "question_order": 1
        },
        headers=auth_headers
    )

    # 3. Complete interview
    comp_resp = client.post(f"/api/interviews/{interview_id}/complete", headers=auth_headers)
    assert comp_resp.status_code == 200
    summary = comp_resp.json()
    assert summary["status"] == "completed"
    assert summary["questions_attempted"] == 1
    assert summary["overall_score"] > 0
    assert summary["strongest_dimension"] in ["Clarity", "Relevance", "Structure", "Linguistic Confidence"]


def test_interview_questions_persistence_across_reloads(client, auth_headers):
    # Create interview
    create_resp = client.post(
        "/api/interviews",
        json={
            "category": "Operating Systems",
            "difficulty": "Intermediate",
            "total_questions": 2,
            "mode": "practice"
        },
        headers=auth_headers
    )
    assert create_resp.status_code == 201
    created_data = create_resp.json()
    interview_id = created_data["id"]
    original_q_ids = [q["id"] for q in created_data["questions"]]

    # Fetch interview (simulating a page reload)
    fetch_resp = client.get(f"/api/interviews/{interview_id}", headers=auth_headers)
    assert fetch_resp.status_code == 200
    fetched_data = fetch_resp.json()
    fetched_q_ids = [q["id"] for q in fetched_data["questions"]]

    # Assert exact deterministic preservation of assigned questions
    assert original_q_ids == fetched_q_ids

