# AI Insights

AI Insights is an AI-powered application designed to provide comprehensive data analysis and predictions. It offers insights through data analysis, machine learning predictions, conversational AI, and dynamic data visualization, targeting sectors such as business, healthcare, and policy making to support informed decision-making.

## Table of Contents
1. [Overview](#overview)
2. [Technical Stack](#technical-stack)
3. [Setup Instructions](#setup-instructions)
4. [Usage](#usage)
5. [Features](#features)
6. [Documentation](#documentation)
7. [Demo Video](#demo-video)
8. [Presentation](#presentation)

## Overview
AI Insights empowers decisions through AI-driven analytics and predictions. The platform is built to help users make data-informed decisions by analyzing trends, predicting outcomes, and visualizing data in a user-friendly manner.

## Technical Stack
- **Frontend:** React
- **Backend:** Python
- **Machine Learning:** PyTorch, Scikit-learn, Numpy, Pandas, LangChain
- **API Integration:** Gemini API

## Usage Instructions
To use AI Insights, follow these steps:
1. Visit the [AI Insights website](https://analysis-chi.vercel.app/).
2. Upload your CSV file for data analysis.
3. Follow the on-screen instructions to explore data insights and predictions.

## Running locally
### Setting up backend
1. ```git clone https://github.com/yj-shrest/AnalysisServer.git```
2. ```cd AnalysisServer```
3. Make a dot env file with ```API_KEY = your_gemini_api_key```
4. ```pip install -r requirements.txt```
5. ```python server.py```
### Setting up frontend
1. ```git clone https://github.com/yj-shrest/Analysis.git```
2. ```cd Analysis```
3. ```npm install ```
4. ```npm run dev```
5. Usage same as deployment

## Usage
1. **Data Upload:** Start by uploading a CSV file containing your data.
2. **Trend Identification:** The system will apply clustering and association algorithms to identify significant trends.
3. **Machine Learning Predictions:** Select variables and key parameters for prediction, and the model will provide analytics.
4. **Conversational Insights:** Interact with the system using natural language queries to obtain business insights.
5. **Data Visualization:** View generated graphs and charts for easy interpretation of your data.

## Features
### Data Analysis and Trend Identification
- Upload a CSV file, and the system applies the Apriori algorithm to identify trends.
- Trends are interpreted in plain language using a Gemini API.

### Machine Learning Predictions
- Utilizes a Multi-Layer Perceptron for predictive analytics.
- Users select variables and key parameters for prediction.
- The model trains on the provided data and offers predictions.

### Conversational Business Insights
- Natural language interaction enables users to ask questions about the data and receive insights.
- Enhances user understanding through conversational AI.

### Dynamic Data Visualization
- Generates graphs, pie charts, and performs correlation and regression analysis.
- Provides visual representation of data for better comprehension.

## Documentation
For detailed documentation on AI Insights, please refer to our [Documentation](https://docs.google.com/document/d/1bhkKomL8517-Hb5M0MqSDFTNt5GItM8lib-1_5cRkE8/edit#heading=h.fuceht2iwcwc).

## Demo Video
Watch our [Demo Video](https://drive.google.com/file/d/1Q1tmOU-UQUziJ-YpMXMJUsus0DvRWy_t/view) to see AI Insights in action.

## Presentation
View our [Presentation](https://www.canva.com/design/DAGIHnbuA0k/DjPO-FG2o6CIei-xDMW3_w/edit) for a comprehensive overview of AI Insights.
