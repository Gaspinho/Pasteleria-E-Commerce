
from transbank_route import router
from fastapi import FastAPI
app = FastAPI()
app.include_router(router)
print([route.path for route in app.routes])