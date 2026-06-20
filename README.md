# Sales Price Prediction 📈

An interactive Machine Learning web application that predicts product sales based on advertising investments across TV, Radio, and Newspaper channels. Built with a Multiple Linear Regression model, this project features a dynamic, slider-based UI that provides real-time sales estimations and visualizes the contribution of each advertising channel.

## 📂 Project Structure

* **`app.py`**: The Flask backend that serves the application, calculates dataset statistics, and handles prediction requests via a RESTful API endpoint (`/api/predict`).
* **`Sales Price Prediction.ipynb`**: The Jupyter Notebook used for exploratory data analysis, data visualization, and training the Linear Regression model.
* **`sales_prediction.pkl`**: The serialized scikit-learn Machine Learning model that powers the predictions.
* **`Advertising.csv`**: The dataset containing historical advertising budgets (in thousands of dollars) and the resulting sales (in thousands of units).
* **`index.html`**: The modern frontend interface featuring an interactive dashboard.
* **`style.css`**: The stylesheet providing a clean, dark-themed, and responsive design.
* **`main.js`**: The frontend JavaScript logic that handles slider interactions, makes asynchronous API calls to Flask, and updates the UI charts dynamically.
* **`requirements.txt`**: The list of Python dependencies required to run the backend.

## 🚀 Features

* **Real-time Predictions:** Adjust advertising budgets using intuitive sliders and instantly see the predicted sales impact.
* **Channel Contribution Chart:** A dynamic bar chart that visualizes exactly how much each channel (TV, Radio, Newspaper) is contributing to the final sales figure.
* **Smart Analytics:** Automatically compares your predicted sales against the historical average and calculates your "Sales per Dollar" efficiency.

## 🛠️ Tech Stack

* **Backend & ML:** Python, Flask, scikit-learn, pandas
* **Frontend:** HTML5, CSS3, JavaScript (Fetch API)

## 💻 How to Run Locally

Follow these steps to get the application running on your local machine:

**1. Clone the repository**
