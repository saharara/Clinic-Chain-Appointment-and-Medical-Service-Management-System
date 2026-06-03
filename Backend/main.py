from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.auth_api import router as auth_router
from api.admin_api import router as admin_router
from api.letan_api import router as letan_router
from api.patient_api import router as patient_router
from api.xnv_api import router as xnv_router
from api.doctor_api import router as doctor_router
from database import close_pool, get_connection

app = FastAPI(title="Clinic Chain Appointment & Medical Service API")

@app.on_event("startup")
async def startup():
    try:
        conn = await get_connection()
        cursor = await conn.execute("SELECT 1 AS Ping")
        result = await cursor.fetchone()
        print(f"Database connected successfully: {result}")
        await conn.close()
    except Exception as e:
        print(f"✗ Database connection failed: {e}")
        raise


@app.on_event("shutdown")
async def shutdown():
    await close_pool()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth_router, prefix="/auth", tags=["Auth"])
app.include_router(admin_router, prefix="/admin", tags=["Admin"])
app.include_router(letan_router, prefix="/letan", tags=["LeTan"])
app.include_router(patient_router, prefix="/patient", tags=["Patient"])
app.include_router(xnv_router, prefix="/xnv", tags=["XetNghiemVien"])
app.include_router(doctor_router, prefix="/doctor", tags=["Doctor"])


@app.get("/")
async def root():
    return {"success": True, "message": "Clinic Chain API is running"}


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("main:app", host="127.0.0.1", port=8000, reload=True)

