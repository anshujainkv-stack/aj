from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import joblib
import numpy as np
import os
import subprocess

app = FastAPI(title="Lumina Health API")

# Enable CORS for all origins
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Define prediction input schema
class PredictionInput(BaseModel):
    features: list[float]

# Path to the trained model
MODEL_PATH = "model.pkl"

def check_and_train_model():
    """Checks if model exists, if not, runs training script."""
    if not os.path.exists(MODEL_PATH):
        print(f"{MODEL_PATH} not found. Running training script...")
        try:
            # Run model_train.py using subprocess
            subprocess.run(["python3", "model_train.py"], check=True)
        except Exception as e:
            print(f"Error training model: {e}")

# Call training check on startup
@app.on_event("startup")
async def startup_event():
    check_and_train_model()

@app.post("/predict")
async def predict(data: PredictionInput):
    """
    Accepts JSON body with features list and returns prediction.
    Expected features: [Age, Blood Pressure, Cholesterol, BMI, Blood Sugar, Heart Rate] (scaled/normalized equivalents)
    """
    if not os.path.exists(MODEL_PATH):
        raise HTTPException(status_code=503, detail="Model not initialized. Please try again in 30 seconds.")
    
    try:
        # Load model
        model = joblib.load(MODEL_PATH)
        
        # Prepare input for prediction
        features_array = np.array(data.features).reshape(1, -1)
        
        # Get prediction and confidence
        prediction = int(model.predict(features_array)[0])
        probabilities = model.predict_proba(features_array)[0]
        confidence = float(np.max(probabilities))
        
        result_label = "High Risk" if prediction == 1 else "Low Risk"
        
        return {
            "prediction": result_label,
            "confidence": confidence
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {str(e)}")

# Health check endpoint
@app.get("/health")
async def health():
    return {"status": "healthy", "model_loaded": os.path.exists(MODEL_PATH)}

# Optional: Serve React frontend if 'dist' folder exists
if os.path.exists("dist"):
    app.mount("/", StaticFiles(directory="dist", html=True), name="static")

if __name__ == "__main__":
    import uvicorn
    # Use port 3000 as per environment constraints
    port = int(os.getenv("PORT", 3000))
    uvicorn.run(app, host="0.0.0.0", port=port)
