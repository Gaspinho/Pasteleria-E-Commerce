import pytest
from fastapi.testclient import TestClient
from users import router
from unittest.mock import patch, MagicMock

# Create a TestClient instance for the router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router, prefix="/users")
access_token_test = "test_access_token"
refresh_token_test = "test_refresh_token"
user_id_test = "test_user_id"



client = TestClient(app)

@pytest.fixture
def mock_supabase():
    with patch("users.create_client") as mock_create_client:
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
        "message": "User registered successfully"
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
        "detail": "Supabase error during registration"
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
    global access_token_test
    access_token_test = response.json()["access_token"]
    global refresh_token_test
    refresh_token_test = response.json()["refresh_token"]
    global user_id_test
    user_id_test = response.json()["user_id"]
    # Assert the response
    assert response.status_code == 200

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
    assert response.status_code == 400
    assert response.json() == {
        "detail": "Supabase error during login"
    }


def test_update_user_success(mock_supabase):
    # Mock the response for a successful user update
    mock_supabase.auth.update_user.return_value = None

    # Define the payload and token for the test
    payload = {
        "phone": "1234567890",
        "house_number": "123",
        "street_number": "456",
        "area": "Test Area",
        "city": "Test City"
    }
    headers = {
        "Authorization": f"Bearer {access_token_test}",
        "X-Refresh-Token": refresh_token_test  
    }

    # Send the POST request to the /update_user endpoint
    response = client.post("/users/update_user", json=payload, headers=headers)

    # Assert the response
    assert response.status_code == 200
    assert response.json() == {
        "message": "User data updated successfully"
    }

def test_update_user_failure(mock_supabase):
    # Mock the response for a failed user update
    mock_supabase.auth.update_user.side_effect = Exception("Unexpected error during user update")

    # Define the payload and token for the test
    payload = {
        "phone": "1234567890",
        "house_number": "123",
        "street_number": "456",
        "area": "Test Area",
        "city": "Test City"
    }
    headers = {
        "Authorization": f"Bearer {refresh_token_test}",
        "X-Refresh-Token": access_token_test
    }

    # Send the POST request to the /update_user endpoint
    response = client.post("/users/update_user", json=payload, headers=headers)

    # Assert the response
    assert response.status_code == 500
    assert response.json() == {
        "detail": "Supabase error during deletion"
    }

def test_get_user_success(mock_supabase):
    # Mock the response for a successful user retrieval
    mock_response = MagicMock()
    mock_response.user = MagicMock()
    mock_response.user.email = "test@example.com"
    mock_response.user.phone = "1234567890"
    mock_response.user.user_metadata = {
        "house_number": "123",
        "street_number": "456",
        "area": "Test Area",
        "city": "Test City"
    }
    mock_supabase.auth.get_user.return_value = mock_response

    # Define the token for the test
    headers = {
        "Authorization": f"Bearer {access_token_test}"
    }

    # Send the GET request to the /get_user endpoint
    response = client.get("/users/get_user", headers=headers)
    response_json = response.json()
    response_json.pop("created_at", None)
    response_json.pop("last_login_at", None)

    # Assert the response
    assert response.status_code == 200
    assert response_json == {
        "email": "test@example.com",
        "phone": "1234567890",
        "house_number": "123",
        "street_number": "456",
        "area": "Test Area",
        "city": "Test City"
    }

def test_get_user_failure(mock_supabase):
    # Mock the response for a failed user retrieval
    mock_supabase.auth.get_user.side_effect = Exception("Unexpected error during user retrieval")

    # Define the token for the test
    headers = {
        "Authorization": "Bearer wrongtoken"
    }

    # Send the GET request to the /get_user endpoint
    response = client.get("/users/get_user", headers=headers)

    # Assert the response
    assert response.status_code == 500
    assert response.json() == {
        "detail": "Supabase error during deletion"
    }

def test_logout_success(mock_supabase):
    # Mock the response for a successful logout
    mock_supabase.auth.admin.sign_out.return_value = None

    # Define the token for the test
    headers = {
        "Authorization": f"Bearer {access_token_test}"
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
        "Authorization": f"Bearer {access_token_test}"
    }

    # Send the POST request to the /logout endpoint
    response = client.post("/users/logout", headers=headers)

    # Assert the response
    assert response.status_code == 500
    assert response.json() == {
        "detail": "Supabase error during logout"
    }

def test_delete_success(mock_supabase):
    # Mock the response for a successful deletion
    mock_supabase.auth.admin.delete_user.return_value = None

    # Define the payload for the test
    # payload = {"userid": f"{user_id_test}"}
    headers = {
        "Authorization": f"Bearer {user_id_test}"
    }

    # Send the POST request to the /delete endpoint
    response = client.post("/users/delete", headers=headers)

    # Assert the response
    assert response.status_code == 200
    assert response.json() == {
        "message": "User deleted successfully"
    }

def test_delete_failure(mock_supabase):
    # Mock the response for a failed deletion
    mock_supabase.auth.admin.delete_user.side_effect = Exception("Unexpected error during deletion")

    # Define the payload for the test
    payload = {"userid": "test_user_id"}

    # Send the POST request to the /delete endpoint
    response = client.post("/users/delete", json=payload)

    # Assert the response
    assert response.status_code == 401
    assert response.json() == {
        "detail": "Not authenticated"
    }