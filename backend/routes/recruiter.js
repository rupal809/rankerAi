const express = require('express');
const multer = require('multer');
const { protect } = require('../middleware/auth');
const {
  screenResumes,
  getScreeningHistory,
  getScreeningRunById,
} = require('../controllers/recruiterController');

const router = express.Router();

// Multer memory storage configuration for PDF files
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // limit size to 10MB per file
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF resumes are allowed.'), false);
    }
  },
});

router.use(protect); // Protect all recruiter screening routes

// POST endpoint for bulk uploading and screening (max 15 resumes at once)
router.post('/screen', upload.array('resumes', 15), screenResumes);

// GET endpoint to get past screening logs
router.get('/history', getScreeningHistory);

// GET endpoint to retrieve details of a specific screening run
router.get('/run/:id', getScreeningRunById);

module.exports = router;
