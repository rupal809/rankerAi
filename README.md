# Smart Resume Screening & Candidate Ranking Tool 🚀

### **Developer: RUPAL AGARWAL**
### **Batch: AI Batch 5**

---

The **Smart Resume Screening & Candidate Ranking Tool** is a production-grade, full-stack B2B web application designed for recruiters and HR managers to automate candidate screening. Powered by a **MERN Stack** portal and a specialized **Python NLP Microservice** (NLTK & Scikit-learn), the tool processes resumes in bulk, parses text, extracts key skills, and ranks candidates based on TF-IDF Cosine Similarity.

---

## 🌟 Key Features

1. **Recruiter Bulk Uploads**:
   - Recruiter can paste a Job Description (JD) and upload up to 15 PDF resumes at once.
   - Handled securely via `multer.array()` memory storage buffers to ensure high efficiency.

2. **NLTK Text Preprocessing**:
   - Python-based text processing including lowercasing, punctuation filtering, NLTK word tokenization, and stop-words removal.

3. **TF-IDF & Cosine Similarity Ranking**:
   - Uses Scikit-learn's `TfidfVectorizer` to convert cleaned job descriptions and resumes into numerical vector spaces.
   - Computes mathematical `cosine_similarity` scores (0% to 100%) to rank candidates in descending order.

4. **Candidate Leaderboard & Charts**:
   - Features a glassmorphic ranking leaderboard sorting candidates from 1st to Nth rank.
   - Displays matched skills (green pills) and missing skill gaps (red pills) side-by-side.
   - Integrates interactive **Recharts Bar Charts** comparing the top candidates' match scores.

5. **Individual Candidate Profiles**:
   - Recruiter can click to expand candidate details to inspect NLTK match statistics and detailed suggestions.

6. **Historical Screening Runs Log**:
   - Save screening history in **MongoDB Atlas** so HR can load and check past candidate lists instantly.

---

## 🛠️ Tech Stack

- **Frontend**: React.js, Vite, Tailwind CSS (v3), Recharts, Lucide React, React Hot Toast
- **Backend (Gateway)**: Node.js, Express.js, Mongoose, Multer, PDF-Parse
- **Python NLP Backend**: Flask, Flask-CORS, NLTK, Scikit-Learn (TF-IDF & Cosine Similarity)
- **Database**: MongoDB Atlas

---

## 📂 Folder Structure

```text
smart-resume-screening/
 ├── python-backend/     # Python NLP Microservice (Flask, NLTK, Scikit-learn)
 ├── backend/            # Gateway Node.js server
 │    ├── config/        # Database connectivity config
 │    ├── controllers/   # Route handlers (auth, recruiter, stats, etc.)
 │    ├── middleware/    # Auth protect & error handler middlewares
 │    ├── models/        # User, Resume, and ScreeningRun Mongoose Schemas
 │    ├── routes/        # Router configuration endpoints
 │    └── server.js      # Server entry point
 ├── frontend/           # React App
 │    ├── src/
 │    │    ├── components/ # Sidebar, Header, ProtectedRoute
 │    │    ├── pages/      # RecruiterDashboard, Dashboard, Landing, Login, Profile
 │    │    ├── services/   # Fetch client API handler
 │    │    └── App.jsx     # Frontend Router Setup
```

## 🛠️ My Development Journey (How I Built This Project)

I conceptualized and built this project from scratch to solve a real-world HR bottleneck: manually screening hundreds of candidate resumes for a specific role is tedious and error-prone. Here is my step-by-step implementation process:

### Step 1: Architecting the Multi-Language System
I chose a **decoupled architecture** using two backends to leverage the best of both worlds:
* **Node.js/Express**: Perfect for handling database operations, secure user authentication (JWT), and file upload streams.
* **Python/Flask**: Selected because Python has industry-standard scientific libraries (`nltk` and `scikit-learn`) for natural language processing, making similarity calculations highly accurate.

### Step 2: Creating the Python NLP Core
I started by writing the core text processing scripts in Python:
* I configured NLTK's tokenizers and stop-words to clean the uploaded resume text and job description (removing grammar, punctuation, and generic words).
* I implemented `TfidfVectorizer` to convert cleaned text strings into numerical vectors.
* I used the mathematical `cosine_similarity` equation to compute the exact angle/distance between the Job Description vector and each resume vector to calculate the final match score (0% to 100%).

### Step 3: Setting Up Express Gateway & Mongoose
Next, I built the database and gateway layer:
* I designed the `ScreeningRun` schema to store recruiter run sessions (metadata, JDs, ranks, and matched/missing skill gaps).
* I integrated `multer` to intercept PDF uploads as memory buffers (preventing disk clutter) and used `pdf-parse` to convert the PDF stream into strings.
* I wrote an API route in Express that forwards the extracted texts to the Flask server, receives the calculated scores, saves them to MongoDB, and returns them to the user.

### Step 4: Crafting the React Dashboard & Visuals
Finally, I built a premium dashboard for recruiters:
* Used Tailwind CSS to create a glassmorphic dark-theme card layout.
* Integrated `recharts` to render interactive comparison bar charts showing match scores.
* Added filter and search bars in the leaderboard table to query candidates by specific keywords or matched skills dynamically.
* Designed a details modal showing matched/missing skill pills to make candidate comparison extremely fast.

---

## 🚀 Quick Start Guide

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) (v16+), [Python](https://www.python.org/) (v3.8+), and a [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) cluster ready.

### 1. Configure and Run Python NLP Backend
1. Open a terminal and navigate to the `python-backend/` directory:
   ```bash
   cd python-backend
   ```
2. Install Python requirements:
   ```bash
   pip install -r requirements.txt
   ```
3. Run the Flask server:
   ```bash
   python app.py
   ```
   *The Python server will run on port `8000` (`http://localhost:8000`). It downloads the NLTK resources automatically on first run.*

### 2. Configure and Run Node.js Backend
1. Open a separate terminal and navigate to the `backend/` directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Create your `.env` configuration file and verify your `MONGODB_URI` and `JWT_SECRET`.
4. Run the Express server:
   ```bash
   npm run dev
   ```
   *The gateway server will run on port `5000`.*

### 3. Run React Frontend
1. Open a third terminal and navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Run the Vite development server:
   ```bash
   npm run dev
   ```
   *Open `http://localhost:3000` in your browser.*

---

## ☁️ Cloud Deployment Steps (Production Setup)



### 1. Deploy Python NLP Backend (Render)
1. Go to [Render](https://render.com/) and created a new **Web Service**.
2. Link your GitHub repository.
3. Configure settings:
   - **Name**: `smart-screener-nlp`
   - **Root Directory**: `python-backend`
   - **Environment/Runtime**: `Python`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
4. Click **Deploy Web Service**. Render will generate a public URL (e.g., `https://smart-screener-nlp.onrender.com`).

### 2. Deploy Node.js Backend Gateway (Render)
1. In Render, created another **Web Service** linking your repository.
2. Configure settings:
   - **Name**: `smart-screener-backend`
   - **Root Directory**: `backend`
   - **Environment/Runtime**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `node server.js`
3. Under the **Environment** tab, add these variables:
   - `MONGODB_URI` = `your_mongodb_connection_string`
   - `JWT_SECRET` = `your_secret_jwt_key`
   - `PYTHON_NLP_URL` = `https://smart-screener-nlp.onrender.com/rank` (The URL of your deployed Python service + `/rank`)
4. Click **Deploy Web Service**. It will generate a backend API URL (e.g., `https://smart-screener-backend.onrender.com`).

### 3. Deploy React Frontend (Vercel)
1. Go to [Vercel](https://vercel.com/) and import your GitHub repository.
2. In the configuration settings:
   - **Framework Preset**: `Vite`
   - **Root Directory**: `frontend`
   - **Environment Variables**:
     - `VITE_API_URL` = `https://smart-screener-backend.onrender.com/api` (The URL of your deployed Node.js backend + `/api`)
3. Click **Deploy**. Vercel will give you the live URL of your website!

---

