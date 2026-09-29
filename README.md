# 📊 Smart Resume Screening & Candidate Ranking Tool

> An NLP-powered data analytics application that automates resume screening, calculates candidate–job-description similarity, identifies skill gaps, ranks candidates, and visualizes recruitment insights.

🔗 **Live Demo:** https://ranker-ai-ten.vercel.app/

---

## 🎯 Project Overview

Recruiters often spend significant time manually reviewing resumes against job descriptions. This project addresses that problem using **Natural Language Processing (NLP), data preprocessing, similarity analysis, and data visualization**.

The system accepts a Job Description (JD) and multiple candidate resumes, processes the text, extracts relevant information, calculates candidate-to-JD similarity scores, identifies matched and missing skills, and presents the results through an interactive dashboard.

### Core Analytics Pipeline

**Job Description + Resumes**
→ **Text Extraction**
→ **Data Cleaning & Preprocessing**
→ **TF-IDF Feature Extraction**
→ **Cosine Similarity Analysis**
→ **Candidate Ranking**
→ **Skill Gap Analysis**
→ **Data Visualization**

---

## 🚀 Key Features

### 1. 📄 Bulk Resume Processing

- Recruiters can provide a Job Description.
- Up to 15 PDF resumes can be uploaded simultaneously.
- Resume text is extracted programmatically.
- The system processes multiple candidates in a single screening run.

### 2. 🧹 Data Preprocessing

Resume and Job Description text undergo preprocessing including:

- Lowercase conversion
- Punctuation removal
- Tokenization
- Stop-word removal
- Text normalization

This helps reduce irrelevant textual information before analysis.

### 3. 📐 TF-IDF Feature Extraction

The project uses **TF-IDF (Term Frequency–Inverse Document Frequency)** to transform textual data into numerical feature vectors.

This allows the system to identify terms that are more relevant to a particular Job Description or resume.

### 4. 📊 Cosine Similarity Analysis

Candidate resumes are compared with the Job Description using **Cosine Similarity**.

The similarity value is converted into a percentage for easier interpretation:

**Similarity Score (%) = Cosine Similarity × 100**

Candidates are then ranked according to their calculated similarity scores.

### 5. 🏆 Candidate Ranking

The dashboard provides a ranked candidate leaderboard containing:

- Candidate ranking
- Match percentage
- Matched skills
- Missing skills
- Candidate details

This converts raw resume data into an easy-to-understand analytical output.

### 6. 📈 Data Visualization

Interactive charts are provided using **Recharts** to compare candidate match scores.

The visualization helps recruiters quickly identify differences between candidates without manually comparing raw data.

### 7. 🔍 Skill Gap Analysis

The system highlights:

🟢 **Matched Skills**

🔴 **Missing Skills**

This provides an additional layer of insight beyond the overall similarity score.

### 8. 🗂️ Historical Screening Analysis

Screening runs can be stored in **MongoDB Atlas**, allowing recruiters to access previous screening results and candidate lists.

---

# 📊 Data Analytics Methodology

The project follows a structured data-processing workflow:

### Step 1 — Data Collection

Inputs:

- Job Description
- Candidate resumes in PDF format

### Step 2 — Data Extraction

PDF documents are converted into machine-readable text.

### Step 3 — Data Cleaning

The extracted text is cleaned using NLP preprocessing techniques.

### Step 4 — Feature Engineering

TF-IDF is used to convert textual information into numerical vectors.

### Step 5 — Similarity Analysis

Cosine Similarity measures the similarity between the Job Description and each candidate resume.

### Step 6 — Candidate Ranking

Candidates are sorted based on their calculated similarity scores.

### Step 7 — Insight Generation

The system identifies:

- Candidate match scores
- Relevant skills
- Missing skills
- Relative candidate performance

### Step 8 — Visualization

The analytical results are presented through:

- Candidate leaderboard
- Bar charts
- Skill indicators
- Candidate comparison views

---

# 💡 Problem Solved

### Traditional Process

Recruiter receives hundreds of resumes  
↓  
Manually reads resumes  
↓  
Compares skills with JD  
↓  
Creates shortlist  
↓  
Manually compares candidates

This process can be repetitive and time-consuming.

### Proposed Solution

Job Description + Multiple Resumes  
↓  
Automated Text Extraction  
↓  
NLP Preprocessing  
↓  
TF-IDF Analysis  
↓  
Cosine Similarity  
↓  
Candidate Ranking  
↓  
Skill Gap Analysis  
↓  
Visual Dashboard

The system converts unstructured resume documents into structured analytical results.

---

# 🛠️ Tech Stack

## Frontend

- React.js
- Vite
- Tailwind CSS
- Recharts
- Lucide React
- React Hot Toast

## Backend

- Node.js
- Express.js
- Mongoose
- Multer
- PDF-Parse

## Data / NLP Analytics

- Python
- Flask
- NLTK
- Scikit-learn
- TF-IDF
- Cosine Similarity

## Database

- MongoDB Atlas

## Deployment

- Vercel
- Render
- MongoDB Atlas

---

# 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │   Recruiter / User  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │  Dashboard & Charts  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │ Node.js / Express   │
                    │    API Gateway      │
                    └──────────┬──────────┘
                               │
                ┌──────────────┴──────────────┐
                ▼                             ▼
       ┌─────────────────┐          ┌─────────────────┐
       │   MongoDB Atlas │          │ Python Flask    │
       │ Screening Data  │          │   NLP Service   │
       └─────────────────┘          └────────┬────────┘
                                             │
                                             ▼
                                   ┌─────────────────────┐
                                   │ NLTK Preprocessing  │
                                   │ TF-IDF              │
                                   │ Cosine Similarity   │
                                   └─────────────────────┘


---



## *Project Structure*
smart-resume-screening/
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   └── App.jsx
│   │
│   ├── package.json
│   └── ...
│
├── backend/
│   ├── config/
│   ├── controllers/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   └── server.js
│
├── python-backend/
│   ├── app.py
│   ├── requirements.txt
│   └── ...
│
├── verify_project.js
├── .gitignore
└── README.md
