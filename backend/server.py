from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users, products, reviews, custom_orders
import uvicorn
import os

app = FastAPI(
    title="Pasteleria E-Commerce API",
    description="API para gestión de pastelería con productos, reviews y usuarios",
    version="2.0.0"
)

PORT = 8000

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "http://localhost:3001",
    "http://127.0.0.1:3001",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,             
    allow_credentials=True,            
    allow_methods=["*"],               
    allow_headers=["*"],               
)

# Incluir routers
app.include_router(
    users.router,
    prefix="/api/users",
    tags=["users"]
)

app.include_router(
    products.router,
    prefix="/api/products",
    tags=["products"]
)

app.include_router(
    reviews.router,
    prefix="/api/feedback",
    tags=["feedback"]
)

app.include_router(
    custom_orders.router,
    prefix="/customizeorder",
    tags=["custom-orders"]
)

@app.get("/")
def read_root():
    return {
        "status": "ok",
        "message": "Pasteleria E-Commerce API",
        "version": "2.0.0",
        "endpoints": {
            "users": "/api/users",
            "products": "/api/products",
            "reviews": "/api/feedback",
            "custom_orders": "/customizeorder"
        }
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "pasteleria-api"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT) 