def test_dashboard_empty_state(client, auth_headers):
    response = client.get("/api/analytics/dashboard", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["total_interviews"] == 0
    assert data["average_score"] == 0.0
    assert data["best_score"] == 0.0
    assert data["total_questions_answered"] == 0
    assert data["recent_interviews"] == []


def test_progress_empty_state(client, auth_headers):
    response = client.get("/api/analytics/progress", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["overall_trend"] == []
    assert data["dimension_averages"]["Clarity"] == 0.0
    assert len(data["recommendations"]) > 0


def test_dashboard_and_progress_after_completed_interview(client, auth_headers):
    # 1. Create interview
    create_resp = client.post(
        "/api/interviews",
        json={
            "category": "Operating Systems",
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
            "answer_text": "A process has its own address space, whereas threads share the memory of their parent process. Threads have lower context switching overhead.",
            "question_order": 1
        },
        headers=auth_headers
    )

    # 3. Complete interview
    client.post(f"/api/interviews/{interview_id}/complete", headers=auth_headers)

    # 4. Check dashboard
    dash_resp = client.get("/api/analytics/dashboard", headers=auth_headers)
    assert dash_resp.status_code == 200
    dash_data = dash_resp.json()
    assert dash_data["total_interviews"] == 1
    assert dash_data["average_score"] > 0
    assert dash_data["total_questions_answered"] == 1

    # 5. Check progress
    prog_resp = client.get("/api/analytics/progress", headers=auth_headers)
    assert prog_resp.status_code == 200
    prog_data = prog_resp.json()
    assert len(prog_data["overall_trend"]) == 1
    assert prog_data["dimension_averages"]["Clarity"] > 0
    assert prog_data["strongest_skill"] == "Operating Systems"
