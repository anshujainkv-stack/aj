import numpy as np
from sklearn.datasets import make_classification
from sklearn.model_selection import train_test_split
from sklearn.ensemble import RandomForestClassifier
from sklearn.metrics import accuracy_score
import joblib
import os

# 1. Create a synthetic health dataset for prediction
# Features: Age, Blood Pressure, Cholesterol, BMI, Blood Sugar, Heart Rate
# Target: 0 (Low Risk), 1 (High Risk)
print("Creating dataset...")
X, y = make_classification(
    n_samples=1000, 
    n_features=6, 
    n_informative=4, 
    n_redundant=0, 
    random_state=42
)

# 2. Split the dataset
X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)

# 3. Train a scikit-learn model
print("Training RandomForest model...")
model = RandomForestClassifier(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# 4. Evaluate the model
y_pred = model.predict(X_test)
accuracy = accuracy_score(y_test, y_pred)
print(f"Model trained. Accuracy: {accuracy * 100:.2f}%")

# 5. Save the trained model
model_path = 'model.pkl'
joblib.dump(model, model_path)
print(f"Model saved to {model_path}")
