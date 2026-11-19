def test_register_success(client):
    response = client.post(
        "/api/auth/register",
        json={
            "full_name": "Jordan Smith",
            "email": "jordan@example.com",
            "password": "SecurePassword123"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert "access_token" in data
    assert data["user"]["email"] == "jordan@example.com"
    assert data["user"]["full_name"] == "Jordan Smith"


def test_register_duplicate_email(client, test_user):
    response = client.post(
        "/api/auth/register",
        json={
            "full_name": "Duplicate User",
            "email": test_user.email,
            "password": "Password123!"
        }
    )
    assert response.status_code == 409
    assert "already exists" in response.json()["detail"]


def test_login_success(client, test_user):
    response = client.post(
        "/api/auth/login",
        json={
            "email": test_user.email,
            "password": "Password123!"
        }
    )
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["user"]["id"] == test_user.id


def test_login_invalid_password(client, test_user):
    response = client.post(
        "/api/auth/login",
        json={
            "email": test_user.email,
            "password": "WrongPassword!"
        }
    )
    assert response.status_code == 401


def test_get_current_user_me(client, auth_headers, test_user):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["id"] == test_user.id
    assert data["email"] == test_user.email


def test_update_user_profile(client, auth_headers):
    response = client.patch(
        "/api/users/me",
        json={"full_name": "Alexander Rivera Updated"},
        headers=auth_headers,
    )
    assert response.status_code == 200
    assert response.json()["full_name"] == "Alexander Rivera Updated"


def test_change_password_success(client, auth_headers, test_user):
    # Change password
    patch_resp = client.patch(
        "/api/users/me",
        json={
            "current_password": "Password123!",
            "new_password": "NewSecretPassword456!",
        },
        headers=auth_headers,
    )
    assert patch_resp.status_code == 200

    # Test login with new password
    login_resp = client.post(
        "/api/auth/login",
        json={"email": test_user.email, "password": "NewSecretPassword456!"},
    )
    assert login_resp.status_code == 200
    assert "access_token" in login_resp.json()


def test_change_password_invalid_current(client, auth_headers):
    patch_resp = client.patch(
        "/api/users/me",
        json={
            "current_password": "IncorrectPassword!",
            "new_password": "NewSecretPassword456!",
        },
        headers=auth_headers,
    )
    assert patch_resp.status_code == 400
    assert "Current password is incorrect" in patch_resp.json()["detail"]