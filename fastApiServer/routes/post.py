from fastapi import APIRouter
from tensorflow.keras.preprocessing.image import img_to_array
from tensorflow.keras.applications.resnet50 import preprocess_input
from tensorflow.keras.preprocessing.sequence import pad_sequences
from tensorflow.keras.models import load_model
import pickle
import numpy as np
import re
import requests
from io import BytesIO
from PIL import Image
from fastapi import Path, Body, BackgroundTasks
from fastapi.exceptions import FastAPIError
import asyncio
from config.db import postCollection, reportCollection
from bson import ObjectId
from schemas.post import postEntity
from datetime import datetime


router = APIRouter()


# Load the pre-trained model and tokenizer
with open("tokenizer.pkl", "rb") as handle:
    tokenizer = pickle.load(handle)

print("Tokenizer loaded successfully!")

multimodal_model = load_model("multimodel_model.h5")

print("Model loaded successfully!")


def preprocess_text(text):
    text = text.lower()
    text = re.sub(r"http\S+|www\S+|https\S+", "", text, flags=re.MULTILINE)
    text = re.sub(r"\@\w+|\#", "", text)
    text = re.sub(r"\d+", "", text)
    text = re.sub(r"[^\w\s]", "", text)
    # Remove all emoji and icon symbols using Unicode ranges
    text = re.sub(
        r"[\U0001F600-\U0001F64F"  # emoticons
        r"\U0001F300-\U0001F5FF"  # symbols & pictographs
        r"\U0001F680-\U0001F6FF"  # transport & map symbols
        r"\U0001F1E0-\U0001F1FF"  # flags (iOS)
        r"\U00002702-\U000027B0"
        r"\U000024C2-\U0001F251"
        r"\U0001F900-\U0001F9FF"
        r"\U0001FA70-\U0001FAFF"
        r"\U00002600-\U000026FF"
        r"\U00002300-\U000023FF"
        r"]+",
        "",
        text,
        flags=re.UNICODE,
    )
    return text


def proprocess_image(image_path, target_size=(224, 224)):
    try:
        response = requests.get(image_path)
        if response.status_code != 200:
            return np.zeros((target_size[0], target_size[1], 3))
        image_data = BytesIO(response.content)

        image = Image.open(image_data)
        if image.mode != "RGB":
            image = image.convert("RGB")
        image = image.resize(target_size)
        image = img_to_array(image) / 255.0

        return image
    except Exception as e:
        return np.zeros((target_size[0], target_size[1], 3))


def model_predict(post, report_id):
    img_arrays = []

    for image in post["images"]:
        img_array = proprocess_image(image["url"])
        img_array = np.expand_dims(
            img_array, axis=0
        )  # Add batch dimension (1, 224, 224, 3)
        img_array = preprocess_input(img_array)  # Preprocessing for ResNet50
        img_arrays.append(img_array)

    # Preprocess the text using the tokenizer (convert text to sequence)
    cleaned_text = preprocess_text(post["content"])

    text_sequence = tokenizer.texts_to_sequences([cleaned_text])
    text_padded = pad_sequences(
        text_sequence, maxlen=100
    )  # Adjust `maxlen` based on your model's input length
    predict_data = [[img_array, text_padded] for img_array in img_arrays]

    # Aggregate predictions for all images
    multimodal_predictions = []
    for img_array, text_padded in predict_data:
        prediction = multimodal_model.predict([img_array, text_padded])
        multimodal_predictions.append(prediction[0])

    # Find the prediction with the highest confidence at report_id index
    # report_id is assumed to be an integer index for the label
    highest_confidence = -1
    best_prediction = None
    for prediction in multimodal_predictions:
        if prediction[report_id] > highest_confidence:
            highest_confidence = prediction[report_id]
            best_prediction = prediction

    multimodal_prediction = best_prediction if best_prediction is not None else multimodal_predictions[0]
    
    # multimodal_predicted_label = np.argmax(multimodal_prediction, axis=1)  # Multi-class classification
    # multimodal_predicted_label = multimodal_predicted_label[0]  # Get the single predicted label

    return multimodal_prediction


multimodal_label_mapping = {
    0: "NotHate",
    1: "Racist",
    2: "Sexist",
    3: "Homophobe",
    4: "Religion",
    5: "OtherHate",
}


def background_task(post, report):
    post_data = postEntity(post)

    # Filter out videos from the post data
    for image in post_data.get("images", []):
        if image.get("type", "") == "video":
            post_data["images"].remove(image)

    # Model prediction
    try:
        predictions = model_predict(post_data, report.get("id", 0))
    except Exception as e:
        raise FastAPIError(
            status_code=500,
            detail=f"Error during model prediction: {str(e)}",
        )

    # Convert predictions to labels
    prediction_mapping = [
        {
            "id": i,
            "label": multimodal_label_mapping.get(i, "Unknown"),
            "probability": round(float(predictions[i]) * 100, 2),
        }
        for i in range(len(predictions))
    ]

    report = reportCollection.insert_one(
        {
            "id": post.get("_id"),
            "report_id": report.get("id"),
            "label": report.get("label"),
            "content": report.get("content"),
            "type": "post",
            "status": "pending",
            "reporter": report.get("reporter"),
            "createdAt": datetime.now(),
            "updatedAt": datetime.now(),
            "predictions": prediction_mapping,
        }
    )

    response = requests.get(
        f"http://localhost:5000/api/post/report/{report.inserted_id}"
    )

    print("Report handling response:", response.status_code, response.text)

    response.close()
    return {}


@router.post("/post/report/{post_id}")
def report_handling(
    post_id: str = Path(),
    report: dict = Body(),
    background_tasks: BackgroundTasks = BackgroundTasks(),
):

    post = postCollection.find_one({"_id": ObjectId(post_id)})

    if post is None:
        raise FastAPIError(
            status_code=404,
            detail="Post not found",
        )

    background_tasks.add_task(background_task, post, report)

    return {
        "status": "ok",
    }
