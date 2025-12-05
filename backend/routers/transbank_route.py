from fastapi import APIRouter, HTTPException, Depends, Request
from fastapi.responses import HTMLResponse, RedirectResponse
from transbank.webpay.webpay_plus.transaction import Transaction, WebpayOptions
from transbank.common.integration_type import IntegrationType
from pydantic import BaseModel

router = APIRouter()
transaction = Transaction(WebpayOptions(
    commerce_code= "597055555532", 
    api_key="579B532A7440BB0C9079DED94D31EA1615BACEB56610332264630D42D0A36B1C",       # API Key de pruebas
    integration_type=IntegrationType.TEST 
))
class InitTransactionRequest(BaseModel):
    amount: int
    session_id: str
    buy_order: str

@router.post("/webpay/init")
async def init_transaction(request: InitTransactionRequest):
    try:
        return_url = "http://127.0.0.1:8000/webpay/return"  # URL de retorno
        response = transaction.create(request.buy_order, request.session_id, request.amount, return_url)
        html_content = f"""
        <html>
            <head>
                <title>Redireccionando a Transbank...</title>
                <script>
                    window.onload = function() {{
                        document.forms[0].submit();
                    }};
                </script>
            </head>
            <body>
                <form action="{response["url"]}" method="POST">
                    <input type="hidden" name="token_ws" value="{response["token"]}" />
                    <input type="submit" value="Continuar con el pago (Redireccionando...)" style="display:none;"/>
                </form>
            </body>
        </html>
        """
        return HTMLResponse(content=html_content)
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al iniciar la transacción: {str(e)}")

@router.post("/webpay/return")
@router.get("/webpay/return")
async def return_transaction(token_ws: str):
    try:
        response = transaction.commit(token_ws)
        if response["status"] == "AUTHORIZED":
            return {"message": "Transacción exitosa", "details": response, "status_code": 303}
        else:
            return {"message": "Transacción fallida", "details": response, "status_code": 303}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error al confirmar la transacción: {str(e)}")

# @router.post("/webpay/refund")
# async def refund_transaction(token_ws: str, amount: int):
#     try:
#         response = transaction.refund(token_ws, amount)
#         return {"message": "Reembolso exitoso", "details": response}
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Error al realizar el reembolso: {str(e)}")