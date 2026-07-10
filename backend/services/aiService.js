const Groq = require('groq-sdk');

let groq = null;
const isMockMode = !process.env.GROQ_API_KEY;

if (!isMockMode) {
  groq = new Groq({ apiKey: process.env.GROQ_API_KEY });
} else {
  console.warn('WARNING: GROQ_API_KEY is not defined. Smart CareerSphere AI is running in MOCK MODE for all AI features.');
}

// Helper: Call Groq or return Mock
const callGroqAPI = async (systemPrompt, userPrompt, model = 'llama-3.3-70b-versatile') => {
  if (isMockMode) {
    throw new Error('Running in Mock Mode'); // Will be caught and fall back to mock data
  }

  try {
    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      model: model,
      response_format: { type: "json_object" }, // Enforce JSON
      temperature: 0.3,
    });

    const responseText = chatCompletion.choices[0].message.content;
    return JSON.parse(responseText);
  } catch (error) {
    console.error('Groq AI API Call Error:', error.message);
    throw error;
  }
};

/**
 * 1. Resume Analyzer
 */
const analyzeResume = async (resumeText) => {
  const systemPrompt = `You are an expert ATS (Applicant Tracking System) parser and professional recruiter.
Parse the resume text and return a JSON object with the following fields:
{
  "atsScore": 0-100 (integer representation of how ATS friendly the formatting and content is),
  "skills": ["skill1", "skill2"],
  "education": [{"degree": "...", "institution": "...", "year": "..."}],
  "projects": [{"title": "...", "description": "...", "technologies": ["...", "..."]}],
  "strengths": ["strength1", "strength2"],
  "weaknesses": ["weakness1", "weakness2"],
  "suggestions": ["suggestion1", "suggestion2"]
}
Only return the valid JSON object. Do not include markdown code block syntax.`;

  const userPrompt = `Analyze this resume text:
${resumeText}`;

  try {
    return await callGroqAPI(systemPrompt, userPrompt);
  } catch (error) {
    console.log('Using Mock Data for Resume Analysis...');
    // Mock Fallback
    const words = resumeText.toLowerCase();
    const detectedSkills = [];
    if (words.includes('react')) detectedSkills.push('React');
    if (words.includes('node')) detectedSkills.push('Node.js');
    if (words.includes('express')) detectedSkills.push('Express.js');
    if (words.includes('mongo')) detectedSkills.push('MongoDB');
    if (words.includes('javascript') || words.includes('js')) detectedSkills.push('JavaScript');
    if (words.includes('python')) detectedSkills.push('Python');
    if (words.includes('java') && !words.includes('javascript')) detectedSkills.push('Java');
    if (words.includes('html')) detectedSkills.push('HTML');
    if (words.includes('css')) detectedSkills.push('CSS');
    if (words.includes('git')) detectedSkills.push('Git');
    if (words.includes('docker')) detectedSkills.push('Docker');
    if (words.includes('aws')) detectedSkills.push('AWS');
    if (words.includes('typescript')) detectedSkills.push('TypeScript');

    if (detectedSkills.length === 0) {
      detectedSkills.push('JavaScript', 'HTML', 'CSS', 'React', 'Node.js');
    }

    return {
      atsScore: Math.floor(Math.random() * 20) + 65, // 65-85
      skills: detectedSkills,
      education: [
        {
          degree: words.includes('btech') || words.includes('b.tech') || words.includes('bachelor') ? 'Bachelor of Technology in Computer Science' : 'Bachelor of Science',
          institution: 'State University',
          year: '2025'
        }
      ],
      projects: [
        {
          title: 'Smart E-Commerce Portal',
          description: 'Designed and built a responsive e-commerce web application featuring user registration, shopping cart, and payments gateway.',
          technologies: detectedSkills.slice(0, 3)
        },
        {
          title: 'Collaborative Workspace Application',
          description: 'Created a collaborative workspace utility incorporating real-time communications and sharing boards.',
          technologies: detectedSkills.slice(0, 4)
        }
      ],
      strengths: [
        'Excellent foundational skills listed for web development.',
        'Hands-on project work detailing practical implementations.',
        'Well-formatted contact and education details.'
      ],
      weaknesses: [
        'Lacks metrics or quantitative descriptions of project accomplishments.',
        'No cloud platform deployment or containerization mentioned.',
        'Formatting could be optimized with more action verbs.'
      ],
      suggestions: [
        'Integrate quantifiable metrics in project bullet points (e.g., "improved load time by 20%").',
        'Add cloud deployment keywords like AWS, GCP, or Azure if you have experience.',
        'Keep the resume strictly to a single page for readability.'
      ]
    };
  }
};

/**
 * 2. Job Description Matcher
 */
const matchJobDescription = async (resumeText, jobDescription) => {
  const systemPrompt = `You are an AI recruiter. Match the resume text against the job description.
Return a JSON object with:
{
  "matchScore": 0-100 (integer representing similarity/suitability score),
  "matchedSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "suggestions": "Detailed suggestions on what changes or additions should be made to better match the JD"
}
Only return the valid JSON object. Do not include markdown code block syntax.`;

  const userPrompt = `RESUME TEXT:
${resumeText}

JOB DESCRIPTION:
${jobDescription}`;

  try {
    return await callGroqAPI(systemPrompt, userPrompt);
  } catch (error) {
    console.log('Using Mock Data for Job Description Matching...');
    // Mock Fallback
    const resumeWords = resumeText.toLowerCase();
    const jdWords = jobDescription.toLowerCase();

    const jdSkills = ['react', 'node', 'mongodb', 'express', 'docker', 'aws', 'kubernetes', 'typescript', 'python', 'sql', 'redux', 'tailwind'];
    const matched = [];
    const missing = [];

    jdSkills.forEach(skill => {
      if (jdWords.includes(skill)) {
        if (resumeWords.includes(skill)) {
          matched.push(skill.charAt(0).toUpperCase() + skill.slice(1));
        } else {
          missing.push(skill.charAt(0).toUpperCase() + skill.slice(1));
        }
      }
    });

    if (matched.length === 0 && missing.length === 0) {
      matched.push('React', 'JavaScript');
      missing.push('Docker', 'AWS');
    }

    const matchScore = Math.floor((matched.length / (matched.length + missing.length || 1)) * 40) + 50; // 50-90

    return {
      matchScore: Math.min(matchScore, 100),
      matchedSkills: matched,
      missingSkills: missing,
      suggestions: missing.length > 0
        ? `To improve your score, consider gaining familiarity with and adding the following missing skills to your resume: ${missing.join(', ')}. Tailor your experience sections to emphasize projects that utilized these technologies.`
        : "Your resume is an excellent match for this job description. Focus on brushing up your core concepts for the interview."
    };
  }
};

/**
 * 3. AI Mock Interview Question Generator
 */
const generateMockInterview = async (resumeText, jobTitle, jobDescription) => {
  const systemPrompt = `You are an elite technical interviewer. Generate 10 interview questions based on the candidate's resume, target job title, and job description.
The questions must span the following categories:
- Technical (conceptual & coding logic)
- HR (career goals, alignment, culture)
- Behavioral (situational, star method)
- Project Based (details on resume projects)

Return a JSON object structured exactly like this:
{
  "questions": [
    {
      "questionText": "Question text here...",
      "type": "Technical" // Must be one of: "Technical", "HR", "Behavioral", "Project Based"
    }
  ]
}
Generate exactly 10 questions. Only return the valid JSON object.`;

  const userPrompt = `JOB TITLE: ${jobTitle}
JOB DESCRIPTION: ${jobDescription}
RESUME: ${resumeText}`;

  try {
    return await callGroqAPI(systemPrompt, userPrompt);
  } catch (error) {
    console.log('Using Mock Data for Interview Questions...');
    // Mock Fallback
    return {
      questions: [
        {
          questionText: `Explain JWT Authentication and how it differs from Session-based authentication in a ${jobTitle} architecture.`,
          type: 'Technical'
        },
        {
          questionText: 'What is the Virtual DOM in React and how does it optimize performance?',
          type: 'Technical'
        },
        {
          questionText: 'How does Node.js handle asynchronous operations despite being single-threaded?',
          type: 'Technical'
        },
        {
          questionText: 'Tell me about the architecture of your MERN stack project listed on your resume. What databases and schemas did you design?',
          type: 'Project Based'
        },
        {
          questionText: 'Describe a challenging bug you encountered in one of your projects and the steps you took to resolve it.',
          type: 'Project Based'
        },
        {
          questionText: 'Walk me through a situation where you had to work with a team member who had a very different perspective on project design. How did you resolve it?',
          type: 'Behavioral'
        },
        {
          questionText: 'Describe a time when you had to learn a brand-new technology quickly for a project. What was your process?',
          type: 'Behavioral'
        },
        {
          questionText: `Why are you interested in this ${jobTitle} position and what do you hope to accomplish in your first 90 days?`,
          type: 'HR'
        },
        {
          questionText: 'What do you consider your greatest professional achievement and how does it prepare you for this role?',
          type: 'HR'
        },
        {
          questionText: 'Do you have any questions for us regarding the engineering culture or the scope of this role?',
          type: 'HR'
        }
      ]
    };
  }
};

/**
 * 4. Interview Evaluation
 */
const evaluateInterview = async (questionsAnswersList) => {
  const systemPrompt = `You are an AI interviewer and communications coach.
Evaluate the candidate's answers to the interview questions.
Return a JSON response evaluating:
- Technical Knowledge (1-10)
- Communication (1-10)
- Problem Solving (1-10)
- Confidence (1-10)
And calculate the overall average. Also, provide individual score & feedback for each answer, and general feedback.

Return a JSON object structured exactly like:
{
  "technical": 8,
  "communication": 7.5,
  "problemSolving": 8,
  "confidence": 7,
  "overall": 7.6,
  "answers": [
    {
      "questionText": "...",
      "answerText": "...",
      "score": 8,
      "feedback": "..."
    }
  ],
  "feedback": "Overall constructive review of the interview..."
}
Only return the valid JSON object.`;

  const userPrompt = `Evaluate this interview transcript:
${JSON.stringify(questionsAnswersList, null, 2)}`;

  try {
    return await callGroqAPI(systemPrompt, userPrompt);
  } catch (error) {
    console.log('Using Mock Data for Interview Evaluation...');
    // Mock Fallback
    const evaluatedAnswers = questionsAnswersList.map(item => {
      const length = item.answerText ? item.answerText.trim().split(/\s+/).length : 0;
      let score = 5;
      let feedback = '';

      if (length < 5) {
        score = 3;
        feedback = 'The response was too short. Try to elaborate on details, provide background context, and use structural frameworks like the STAR method.';
      } else if (length < 20) {
        score = 6;
        feedback = 'Good initial response, but could benefit from deeper technical examples or mentioning libraries and code architecture details.';
      } else {
        score = 8;
        feedback = 'Solid response with clear examples and technical details. Demonstrates experience and core understanding.';
      }

      return {
        questionText: item.questionText,
        answerText: item.answerText,
        score: score,
        feedback: feedback
      };
    });

    const sum = evaluatedAnswers.reduce((acc, curr) => acc + curr.score, 0);
    const overall = parseFloat((sum / (evaluatedAnswers.length || 1)).toFixed(1));

    return {
      technical: Math.round(overall + (Math.random() * 1.5 - 0.7)),
      communication: Math.round(overall + (Math.random() * 1.2 - 0.6)),
      problemSolving: Math.round(overall + (Math.random() * 1.4 - 0.7)),
      confidence: Math.round(overall + (Math.random() * 1.6 - 0.8)),
      overall: overall,
      answers: evaluatedAnswers,
      feedback: 'You showed good foundational knowledge. To take your interviews to the next level, practice articulating architectural tradeoffs, state management alternatives, and database indexing strategies. Your pacing and structural answers were professional.'
    };
  }
};

/**
 * 5. Career Recommendation Engine
 */
const suggestCareerPaths = async (resumeText, skills, education) => {
  const systemPrompt = `You are an AI Career Coach. Suggest suitable career paths, job roles, and learning recommendations.
Based on the candidate's details, generate 3 suitable job roles, a career roadmap, and learning recommendations.

Return a JSON object structured exactly like:
{
  "roles": [
    {
      "title": "MERN Stack Developer",
      "suitability": "Highly Suitable (90%)",
      "description": "...",
      "skillsToAcquire": ["Docker", "TypeScript"]
    }
  ],
  "roadmap": [
    {
      "phase": "Phase 1: Short Term (0-6 months)",
      "milestones": ["...", "..."]
    }
  ],
  "learningRecommendations": [
    {
      "topic": "Containerization & DevOps",
      "resources": [
        {"name": "Docker and Kubernetes Complete Course", "platform": "Udemy/FreeCodeCamp"}
      ]
    }
  ]
}
Only return the valid JSON object.`;

  const userPrompt = `SKILLS: ${JSON.stringify(skills)}
EDUCATION: ${JSON.stringify(education)}
RESUME EXCERPT:
${resumeText.substring(0, 3000)}`;

  try {
    return await callGroqAPI(systemPrompt, userPrompt);
  } catch (error) {
    console.log('Using Mock Data for Career Recommendation...');
    // Mock Fallback
    return {
      roles: [
        {
          title: 'Full Stack JavaScript Engineer',
          suitability: 'Highly Suitable (88%)',
          description: 'Leverage your existing frontend (React) and backend (Node.js/Express) capabilities to design end-to-end full stack web applications.',
          skillsToAcquire: ['TypeScript', 'GraphQL', 'Next.js']
        },
        {
          title: 'Frontend Developer (React Specialist)',
          suitability: 'Very Suitable (82%)',
          description: 'Focus heavily on building premium customer-facing user interfaces, designing micro-animations, and managing application state.',
          skillsToAcquire: ['Redux Toolkit', 'Tailwind CSS v4', 'Framer Motion']
        },
        {
          title: 'DevOps / Backend Engineer',
          suitability: 'Suitable (70%)',
          description: 'Bridge the gap between server side logic and server administration. Help configure cloud environments and serverless architectures.',
          skillsToAcquire: ['Docker', 'AWS ECS/EC2', 'CI/CD Pipelines (GitHub Actions)']
        }
      ],
      roadmap: [
        {
          phase: 'Phase 1: Short Term (0-3 Months)',
          milestones: [
            'Deepen understanding of TypeScript and transition React projects to TypeScript.',
            'Acquire core backend deployment experience on cloud providers like Render or AWS.'
          ]
        },
        {
          phase: 'Phase 2: Medium Term (3-6 Months)',
          milestones: [
            'Learn Next.js for server-side rendering and static site generation.',
            'Build full stack applications implementing microservices and event-driven architectures.'
          ]
        }
      ],
      learningRecommendations: [
        {
          topic: 'TypeScript Core & Advanced Concepts',
          resources: [
            { name: 'TypeScript Deep Dive Guide', platform: 'GitBook (Free)' },
            { name: 'React with TypeScript', platform: 'Frontend Masters' }
          ]
        },
        {
          topic: 'DevOps and Cloud Deployments',
          resources: [
            { name: 'Docker & Kubernetes Fundamentals', platform: 'FreeCodeCamp (YouTube)' },
            { name: 'AWS Cloud Practitioner Prep', platform: 'Coursera / AWS Training' }
          ]
        }
      ]
    };
  }
};

module.exports = {
  analyzeResume,
  matchJobDescription,
  generateMockInterview,
  evaluateInterview,
  suggestCareerPaths
};
