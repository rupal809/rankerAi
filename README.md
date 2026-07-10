# Smart Resume Screening & Candidate Ranking Tool 🚀

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
 └── README.md
```

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
