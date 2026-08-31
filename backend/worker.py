import os
import json
from celery import Celery
import redis
from ml.model import predict_image_model
from data.solutions import get_solution_for_disease

celery_app = Celery(
    "worker",
    broker="amqp://guest:guest@localhost:5672//",
    backend="redis://localhost:6379/1"
)
redis_client = redis.Redis(host='localhost', port=6379, db=0, decode_responses=True)

@celery_app.task(bind=True)
def process_image_task(self, image_path: str, img_hash: str):
    try:
        # Mock ML Inference
        disease_label, confidence, severity = predict_image_model(image_path)
        
        # Fetch solutions
        solution = get_solution_for_disease(disease_label)
        
        result = {
            "status": "completed",
            "disease": disease_label,
            "confidence": confidence,
            "severity": severity,
            "solution": solution
        }
        
        # Cache the result in Redis with an expiration (e.g., 24 hours)
        redis_client.set(img_hash, json.dumps(result), ex=86400)
        
        # Clean up temp file
        if os.path.exists(image_path):
            os.remove(image_path)
            
        return result
    except Exception as e:
        if os.path.exists(image_path):
            os.remove(image_path)
        raise self.retry(exc=e, countdown=10, max_retries=3)
