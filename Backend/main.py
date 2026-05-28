from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.auth_api import router as auth_router
from api.admin_api import router as admin_router
#from api.letan_api import router as letan_router

app = FastAPI(title="Clinic Chain Appointment & Medical Service API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(admin_router, prefix="/admin", tags=["Admin"])
#app.include_router(letan_router, prefix="/letan", tags=["LeTan"])


@app.get("/")
async def root():
    return {"success": True, "message": "Clinic Chain API is running"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

