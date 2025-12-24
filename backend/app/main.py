from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.database import engine
from models.models import Base
from routers.users import router as user_router
from routers.corporate_accounts import router as corporate_router
from routers.user_corporate import router as user_corporate_router
from routers.booking import router as booking_router
from routers.webhook import router as webhook_router
from routers.ws import router as ws_router


app = FastAPI(title="My Backend API")

# ✅ CORS CONFIG (MUST BE BEFORE ROUTERS)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # frontend
    allow_credentials=True,
    allow_methods=["*"],  # GET, POST, PUT, DELETE, OPTIONS
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)



app.include_router(webhook_router)
app.include_router(ws_router)
app.include_router(user_corporate_router)
app.include_router(booking_router)
app.include_router(user_router)
app.include_router(corporate_router)

@app.get("/")
def health_check():
    return {"status": "OK"}
