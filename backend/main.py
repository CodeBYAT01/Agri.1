import os
import uuid
import json
from fastapi import FastAPI, File, UploadFile, Request, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from celery.result import AsyncResult
import redis

# We import the celery task from worker.py
from worker import celery_app, process_image_task

limiter = Limiter(key_func=get_remote_address)
app = FastAPI(title="Plant Disease Detection API")
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # for dev
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

@app.post("/predict")
@limiter.limit("10/minute")
async def predict_image(request: Request, file: UploadFile = File(...)):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File provided is not an image.")

    content = await file.read()
    
    # Normally we'd use a hash of the image for Redis caching to avoid redundant processing
    import hashlib
    img_hash = hashlib.md5(content).hexdigest()
    
    cached_result = redis_client.get(img_hash)
    if cached_result:
        return json.loads(cached_result)

    # Save temp file for celery to process
    temp_filename = f"temp_{uuid.uuid4().hex}_{file.filename}"
    temp_filepath = os.path.join("temp_images", temp_filename)
    
    os.makedirs("temp_images", exist_ok=True)
    with open(temp_filepath, "wb") as f:
        f.write(content)

    # Enqueue task
    task = process_image_task.delay(temp_filepath, img_hash)
    
    return {"task_id": task.id, "status": "processing"}


@app.get("/predict/status/{task_id}")
async def get_predict_status(task_id: str):
    task_result = AsyncResult(task_id, app=celery_app)
    if task_result.state == 'PENDING':
        return {"status": "processing"}
    elif task_result.state == 'SUCCESS':
        return task_result.result
    elif task_result.state == 'FAILURE':
        return {"status": "error", "detail": str(task_result.info)}
    return {"status": task_result.state}
