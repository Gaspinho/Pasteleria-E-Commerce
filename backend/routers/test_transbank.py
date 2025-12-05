import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
from transbank.webpay.webpay_plus.transaction import Transaction
from transbank.common.integration_type import IntegrationType
from transbank.webpay.webpay_plus.transaction import WebpayOptions
from transbank_route import router
from fastapi import FastAPI

app = FastAPI()
app.include_router(router)
print([route.path for route in app.routes])
client = TestClient(app)

@pytest.fixture
def mock_transaction():
    with patch("transbank_route.transaction") as mock_transaction_instance:
        yield mock_transaction_instance

def test_init_transaction_success(mock_transaction):
    mock_transaction.create.return_value = {
        "url": "https://webpay3g.transbank.cl/initTransaction",
        "token": "test_token"
    }

    payload = {
        "amount": 10000,
        "session_id": "test_session",
        "buy_order": "test_order"
    }

    response = client.post("/webpay/init", json=payload)

    assert response.status_code == 200
    assert "Redireccionando a Transbank" in response.text
    assert "test_token" in response.text
    assert "https://webpay3g.transbank.cl/initTransaction" in response.text

def test_init_transaction_failure(mock_transaction):
    mock_transaction.create.side_effect = Exception("Error al iniciar la transacción")

    payload = {
        "amount": 10000,
        "session_id": "test_session",
        "buy_order": "test_order"
    }

    response = client.post("/webpay/init", json=payload)

    assert response.status_code == 500
    assert response.json() == {"detail": "Error al iniciar la transacción: Error al iniciar la transacción"}

def test_return_transaction_success(mock_transaction):
    mock_transaction.commit.return_value = {
        "status": "AUTHORIZED",
        "buy_order": "test_order"
    }
    response = client.get("/webpay/return?token_ws=test_token")
    assert response.status_code == 200
    expected_response = {
        "message": "Transacción exitosa",
        "details": {
            "status": "AUTHORIZED",
            "buy_order": "test_order"
        },
        "status_code": 303
    }
    assert response.json() == expected_response


def test_return_transaction_failure(mock_transaction):
    mock_transaction.commit.return_value = {
        "status": "FAILED",
        "buy_order": "test_order"
    }
    response = client.get("/webpay/return?token_ws=test_token")
    assert response.status_code == 200
    expected_response = {
        "message": "Transacción fallida",
        "details": {
            "status": "FAILED",
            "buy_order": "test_order"
        },
        "status_code": 303
    }
    assert response.json() == expected_response


def test_return_transaction_error(mock_transaction):
    mock_transaction.commit.side_effect = Exception("Error al confirmar la transacción")
    response = client.get("/webpay/return?token_ws=test_token")
    assert response.status_code == 500
    expected_response = {
        "detail": "Error al confirmar la transacción: Error al confirmar la transacción"
    }
    assert response.json() == expected_response