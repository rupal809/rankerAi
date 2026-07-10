import os
import re
from flask import Flask, request, jsonify
from flask_cors import CORS

# Import NLP and Machine Learning Libraries
import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity

# Ensure NLTK resources are downloaded
try:
    nltk.data.find('corpora/stopwords')
except LookupError:
    nltk.download('stopwords', quiet=True)

try:
    nltk.data.find('tokenizers/punkt')
except LookupError:
    nltk.download('punkt', quiet=True)

try:
    nltk.data.find('tokenizers/punkt_tab')
except LookupError:
    nltk.download('punkt_tab', quiet=True)

app = Flask(__name__)
CORS(app)  # Enable Cross-Origin Resource Sharing

# Predefined list of popular technology keywords for skill matching
COMMON_TECH_KEYWORDS = {
    'python', 'java', 'javascript', 'js', 'typescript', 'ts', 'c++', 'c#', 'ruby', 'php', 'golang', 'rust', 'swift',
    'html', 'css', 'react', 'angular', 'vue', 'next.js', 'nextjs', 'redux', 'tailwind', 'bootstrap', 'jquery',
    'node.js', 'nodejs', 'express', 'expressjs', 'django', 'flask', 'fastapi', 'spring boot', 'laravel',
    'mongodb', 'mongo', 'sql', 'mysql', 'postgresql', 'postgres', 'sqlite', 'oracle', 'redis', 'firebase',
    'aws', 'amazon web services', 'gcp', 'google cloud', 'azure', 'docker', 'kubernetes', 'jenkins', 'git', 'github',
    'ci/cd', 'machine learning', 'ml', 'deep learning', 'dl', 'nlp', 'natural language processing', 'opencv',
    'data science', 'pandas', 'numpy', 'scikit-learn', 'tensorflow', 'pytorch', 'tableau', 'powerbi'
}

def clean_text(text):
    """
    Cleans raw text by:
    1. Lowercasing
    2. Removing special characters and numbers
    3. Tokenizing into words
    4. Removing English stop words
    """
    if not text:
        return ""
    
    # Lowercase & remove non-alphabetic characters
    text = text.lower()
    text = re.sub(r'[^a-z\s]', ' ', text)
    
    # Tokenize
    words = word_tokenize(text)
    
    # Filter out stop words
    stop_words = set(stopwords.words('english'))
    cleaned_words = [word for word in words if word not in stop_words and len(word) > 1]
    
    return " ".join(cleaned_words)

def extract_skills(text):
    """
    Extracts tech skills present in the text based on a predefined vocabulary.
    """
    words = set(re.findall(r'\b[a-z0-9\.\-\#\+]+\b', text.lower()))
    
    # Clean matches (e.g. handle node.js vs nodejs, next.js vs nextjs)
    detected = []
    for skill in COMMON_TECH_KEYWORDS:
        if skill in words:
            detected.append(skill.title())
        elif skill.replace('.', '') in words:
            detected.append(skill.title())
            
    return sorted(list(set(detected)))

@app.route('/api/health', methods=['GET'])
def health():
    return jsonify({
        "success": True,
        "message": "Python NLP Screening microservice is active and healthy."
    })

@app.route('/rank', methods=['POST'])
def rank_candidates():
    """
    Expects JSON:
    {
        "jobDescription": "Full Job Description text",
        "candidates": [
            { "id": "1", "name": "John", "text": "Resume text..." },
            ...
        ]
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'jobDescription' not in data or 'candidates' not in data:
            return jsonify({
                "success": False,
                "message": "Invalid payload. Missing 'jobDescription' or 'candidates'."
            }), 400
            
        jd_text = data['jobDescription']
        candidates = data['candidates']
        
        if not candidates:
            return jsonify({
                "success": True,
                "rankedResults": []
            })
            
        # 1. Clean the Job Description
        cleaned_jd = clean_text(jd_text)
        jd_skills = set(extract_skills(jd_text))
        
        # 2. Clean candidates' resumes
        cleaned_resumes = []
        candidate_metadata = []
        
        for cand in candidates:
            cand_text = cand.get('text', '')
            cleaned_res = clean_text(cand_text)
            
            cleaned_resumes.append(cleaned_res)
            
            # Extract skills for skill gap analysis
            cand_skills = set(extract_skills(cand_text))
            matched_skills = list(jd_skills.intersection(cand_skills))
            missing_skills = list(jd_skills.difference(cand_skills))
            
            candidate_metadata.append({
                "id": cand.get('id'),
                "name": cand.get('name', 'Unnamed Candidate'),
                "fileName": cand.get('fileName', 'resume.pdf'),
                "matchedSkills": sorted(matched_skills),
                "missingSkills": sorted(missing_skills)
            })
            
        # 3. Vectorize text using TF-IDF (Term Frequency - Inverse Document Frequency)
        # We compute TF-IDF on the JD and all resumes combined
        corpus = [cleaned_jd] + cleaned_resumes
        
        vectorizer = TfidfVectorizer()
        tfidf_matrix = vectorizer.fit_transform(corpus)
        
        # 4. Compute Cosine Similarity between JD (index 0) and all Resumes (indices 1 to N)
        jd_vector = tfidf_matrix[0]
        resume_vectors = tfidf_matrix[1:]
        
        similarities = cosine_similarity(resume_vectors, jd_vector).flatten()
        
        # 5. Build ranked output
        results = []
        for idx, similarity in enumerate(similarities):
            meta = candidate_metadata[idx]
            match_percentage = int(round(similarity * 100))
            
            # Generate simple recommendation string
            if match_percentage >= 80:
                recommendation = "Highly Recommended: Excellent matching profile with core skills."
            elif match_percentage >= 60:
                recommendation = "Good Potential: Profile matches several key requirements. Suggest interviewing."
            elif match_percentage >= 40:
                recommendation = "Moderate Match: Lacks multiple core qualifications. Review manually."
            else:
                recommendation = "Not Recommended: Match score is too low. Lacks primary requirements."
                
            results.append({
                "id": meta["id"],
                "name": meta["name"],
                "fileName": meta["fileName"],
                "matchScore": match_percentage,
                "matchedSkills": meta["matchedSkills"],
                "missingSkills": meta["missingSkills"],
                "recommendation": recommendation
            })
            
        # Sort results by matchScore in descending order (highest score first)
        results = sorted(results, key=lambda x: x['matchScore'], reverse=True)
        
        return jsonify({
            "success": True,
            "rankedResults": results
        })
        
    except Exception as e:
        print("Error in Python NLP rank_candidates:", str(e))
        return jsonify({
            "success": False,
            "message": f"NLP ranking calculation failed: {str(e)}"
        }), 500

if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))
    print(f"Starting Python NLP backend on port {port}...")
    app.run(host='0.0.0.0', port=port, debug=True)
