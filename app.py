import pickle
from pathlib import Path

import pandas as pd
from flask import Flask, jsonify, render_template, request

BASE_DIR = Path(__file__).parent
MODEL_PATH = BASE_DIR / "sales_prediction.pkl"
DATA_PATH = BASE_DIR / "Advertising.csv"

app = Flask(__name__)

with open(MODEL_PATH, "rb") as file:
    model = pickle.load(file)

df = pd.read_csv(DATA_PATH)

FEATURES = ["TV", "Radio", "Newspaper"]
RANGES = {
    "TV": [float(df["TV"].min()), float(df["TV"].max())],
    "Radio": [float(df["Radio"].min()), float(df["Radio"].max())],
    "Newspaper": [float(df["Newspaper"].min()), float(df["Newspaper"].max())],
}

MODEL_INFO = {
    "intercept": float(model.intercept_),
    "coefficients": {
        "TV": float(model.coef_[0]),
        "Radio": float(model.coef_[1]),
        "Newspaper": float(model.coef_[2]),
    },
    "dataset": {
        "records": len(df),
        "avg_sales": round(float(df["Sales"].mean()), 2),
        "max_sales": round(float(df["Sales"].max()), 2),
    },
}


def predict_sales(tv: float, radio: float, newspaper: float) -> float:
    features = pd.DataFrame([[tv, radio, newspaper]], columns=FEATURES)
    return float(model.predict(features)[0])


@app.route("/")
def index():
    return render_template("index.html", model_info=MODEL_INFO, ranges=RANGES)


@app.route("/api/predict", methods=["POST"])
def predict():
    data = request.get_json(silent=True) or {}
    try:
        tv = float(data.get("TV", 0))
        radio = float(data.get("Radio", 0))
        newspaper = float(data.get("Newspaper", 0))
    except (TypeError, ValueError):
        return jsonify({"error": "Invalid input values."}), 400

    prediction = predict_sales(tv, radio, newspaper)
    total_spend = tv + radio + newspaper
    avg_sales = MODEL_INFO["dataset"]["avg_sales"]
    coef = MODEL_INFO["coefficients"]

    return jsonify(
        {
            "prediction": round(prediction, 2),
            "total_spend": round(total_spend, 2),
            "vs_average": round(prediction - avg_sales, 2),
            "sales_per_dollar": round(prediction / total_spend, 3) if total_spend > 0 else 0,
            "contributions": {
                "TV": round(coef["TV"] * tv, 2),
                "Radio": round(coef["Radio"] * radio, 2),
                "Newspaper": round(coef["Newspaper"] * newspaper, 2),
            },
        }
    )


if __name__ == "__main__":
    app.run(debug=True, port=5000)
