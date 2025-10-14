from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import users
import uvicorn
import os

app = FastAPI()

PORT = 8000

origins = [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,             
    allow_credentials=True,            
    allow_methods=["*"],               
    allow_headers=["*"],               
)

app.include_router(
    users.router,
    prefix="/users"
)

@app.get("/")
def read_root():
    return {"status": "ok"}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=PORT) 