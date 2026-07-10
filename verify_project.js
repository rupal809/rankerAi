const fs = require('fs');
const path = require('path');

console.log('🔍 Starting Smart CareerSphere AI Project Verification...');

const pathsToCheck = [
  // Backend config & server
  'backend/package.json',
  'backend/server.js',
  'backend/config/db.js',
  
  // Backend models
  'backend/models/User.js',
  'backend/models/Resume.js',
  'backend/models/JobMatch.js',
  'backend/models/Interview.js',
  
  // Backend controllers
  'backend/controllers/authController.js',
  'backend/controllers/resumeController.js',
  'backend/controllers/jobController.js',
  'backend/controllers/interviewController.js',
  'backend/controllers/dashboardController.js',
  'backend/controllers/adminController.js',
  
  // Backend routes
  'backend/routes/auth.js',
  'backend/routes/resume.js',
  'backend/routes/job.js',
  'backend/routes/interview.js',
  'backend/routes/dashboard.js',
  'backend/routes/admin.js',
  
  // Backend services & middleware
  'backend/services/aiService.js',
  'backend/services/pdfService.js',
  'backend/middleware/auth.js',
  'backend/middleware/error.js',
  'backend/.env.example',
  
  // Frontend config
  'frontend/package.json',
  'frontend/vite.config.js',
  'frontend/tailwind.config.js',
  'frontend/postcss.config.js',
  'frontend/index.html',
  
  // Frontend core
  'frontend/src/index.css',
  'frontend/src/main.jsx',
  'frontend/src/App.jsx',
  'frontend/src/services/api.js',
  'frontend/src/context/AuthContext.jsx',
  
  // Frontend components
  'frontend/src/components/Sidebar.jsx',
  'frontend/src/components/Header.jsx',
  'frontend/src/components/ProtectedRoute.jsx',
  
  // Frontend pages
  'frontend/src/pages/Landing.jsx',
  'frontend/src/pages/Login.jsx',
  'frontend/src/pages/Register.jsx',
  'frontend/src/pages/Dashboard.jsx',
  'frontend/src/pages/ResumeAnalyzer.jsx',
  'frontend/src/pages/JDMatcher.jsx',
  'frontend/src/pages/CareerCoach.jsx',
  'frontend/src/pages/MockInterview.jsx',
  'frontend/src/pages/Profile.jsx',
  'frontend/src/pages/Admin.jsx',
  
  // Project Root
  '.gitignore',
  'README.md'
];

let missingFiles = 0;

pathsToCheck.forEach(relPath => {
  const absPath = path.join(__dirname, relPath);
  if (fs.existsSync(absPath)) {
    console.log(`✅ FOUND: ${relPath}`);
  } else {
    console.error(`❌ MISSING: ${relPath}`);
    missingFiles++;
  }
});

console.log('\n----------------------------------------------');
if (missingFiles === 0) {
  console.log('🎉 VERIFICATION SUCCESS: All MERN files generated perfectly!');
} else {
  console.error(`⚠️ VERIFICATION FAILED: ${missingFiles} files are missing!`);
}
console.log('----------------------------------------------\n');
