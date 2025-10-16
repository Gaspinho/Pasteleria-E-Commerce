import pytest
from fastapi.testclient import TestClient
from routers.users import router
from unittest.mock import patch, MagicMock

# Create a TestClient instance for the router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router, prefix="/users")

client = TestClient(app)

@pytest.fixture
def mock_supabase():
    with patch("routers.users.create_client") as mock_create_client:
        mock_client = MagicMock()
        mock_create_client.return_value = mock_client
        yield mock_client

def test_register_success(mock_supabase):
    # Mock the response for a successful registration
    mock_response = MagicMock()
    mock_response.error = None
    mock_response.user = MagicMock()
    mock_response.user.id = "test_user_id"
    mock_supabase.auth.sign_up.return_value = mock_response

    # Define the payload for the test
    payload = {
        "email": "test@example.com",
        "password": "securepassword",
        "admin": "true"
    }

    # Send the POST request to the /register endpoint
    response = client.post("/users/register", json=payload)

    # Assert the response
    assert response.status_code == 200
    assert response.json() == {
        "message": "User registered successfully",
        "user_id": "test_user_id"
    }

def test_register_failure(mock_supabase):
    # Mock the response for a failed registration
    mock_response = MagicMock()
    mock_response.error = MagicMock()
    mock_response.error.message = "Email already exists"
    mock_response.error.status = 400
    mock_response.user = None
    mock_supabase.auth.sign_up.return_value = mock_response

    # Define the payload for the test
    payload = {
        "email": "test@example.com",
        "password": "securepassword",
        "admin": "true"
    }

    # Send the POST request to the /register endpoint
    response = client.post("/users/register", json=payload)

    # Assert the response
    assert response.status_code == 400
    assert response.json() == {
        "detail": {
            "message": "Email already exists",
            "code": 400
        }
    }

def test_register_unexpected_error(mock_supabase):
    # Mock the response for an unexpected error
    mock_supabase.auth.sign_up.side_effect = Exception("Unexpected error")

    # Define the payload for the test
    payload = {
        "email": "test@example.com",
        "password": "securepassword",
        "admin": "true"
    }

    # Send the POST request to the /register endpoint
    response = client.post("/users/register", json=payload)

    # Assert the response
    assert response.status_code == 500
    assert response.json() == {
        "detail": "Internal server error during registration."
    }

def test_login_success(mock_supabase):
    # Mock the response for a successful login
    mock_response = MagicMock()
    mock_response.error = None
    mock_response.user = MagicMock()
    mock_response.user.id = "test_user_id"
    mock_response.session = MagicMock()
    mock_response.session.access_token = "test_access_token"
    mock_response.session.refresh_token = "test_refresh_token"
    mock_supabase.auth.sign_in_with_password.return_value = mock_response

    # Define the payload for the test
    payload = {
        "email": "test@example.com",
        "password": "securepassword"
    }

    # Send the POST request to the /login endpoint
    response = client.post("/users/login", json=payload)

    # Assert the response
    assert response.status_code == 200
    assert response.json() == {
        "access_token": "test_access_token",
        "refresh_token": "test_refresh_token",
        "user_id": "test_user_id"
    }

def test_login_failure(mock_supabase):
    # Mock the response for a failed login
    mock_response = MagicMock()
    mock_response.error = MagicMock()
    mock_response.error.message = "Invalid credentials"
    mock_response.error.status = 401
    mock_response.user = None
    mock_response.session = None
    mock_supabase.auth.sign_in_with_password.return_value = mock_response

    # Define the payload for the test
    payload = {
        "email": "test@example.com",
        "password": "wrongpassword"
    }

    # Send the POST request to the /login endpoint
    response = client.post("/users/login", json=payload)

    # Assert the response
    assert response.status_code == 401
    assert response.json() == {
        "detail": {
            "message": "Invalid credentials",
            "code": 401
        }
    }

def test_logout_success(mock_supabase):
    # Mock the response for a successful logout
    mock_supabase.auth.admin.sign_out.return_value = None

    # Define the token for the test
    headers = {
        "Authorization": "Bearer test_access_token"
    }

    # Send the POST request to the /logout endpoint
    response = client.post("/users/logout", headers=headers)

    # Assert the response
    assert response.status_code == 200
    assert response.json() == {
        "message": "User logged out successfully"
    }

def test_logout_failure(mock_supabase):
    # Mock the response for a failed logout
    mock_supabase.auth.admin.sign_out.side_effect = Exception("Unexpected error during logout")

    # Define the token for the test
    headers = {
        "Authorization": "Bearer test_access_token"
    }

    # Send the POST request to the /logout endpoint
    response = client.post("/users/logout", headers=headers)

    # Assert the response
    assert response.status_code == 500
    assert response.json() == {
        "detail": "Internal server error during registration."
    }