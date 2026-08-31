from PIL import Image
import torchvision.transforms as transforms
import random
import time


def preprocess_image(image_path: str):
    image = Image.open(image_path).convert('RGB')
    transform = transforms.Compose([
        transforms.Resize((224, 224)),
        transforms.ToTensor(),
        transforms.Normalize(
            mean=[0.485, 0.456, 0.406],
            std=[0.229, 0.224, 0.225],
        ),
    ])
    return transform(image)


def predict_image_model(image_path: str):
    # This simulates inference latency
    time.sleep(2)

    # Preprocess the image to verify the pipeline (even if we mock the output)
    preprocess_image(image_path)

    # Simulated model output classes
    classes = ["Tomato_Early_blight", "Potato_Late_blight", "Healthy_Leaf", "Apple_scab"]

    # Mocking prediction logic
    selected_class = random.choice(classes)
    confidence_score = round(random.uniform(0.75, 0.99), 2)
    severity = "High" if confidence_score > 0.9 and "Healthy" not in selected_class else "Medium"
    if "Healthy" in selected_class:
        severity = "None"

    return selected_class, confidence_score, severity
