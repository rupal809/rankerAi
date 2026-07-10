const express = require('express');
const multer = require('multer');
const { uploadResume, getResumeHistory, getResumeById, deleteResume } = require('../controllers/resumeController');
const { protect } = require('../middleware/auth');

const router = express.Router();

// Multer memory storage configuration for PDFs
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024, // limit size to 5MB
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only PDF files are allowed.'), false);
    }
  },
});

router.use(protect); // Protect all resume routes

router.post('/upload', upload.single('resume'), uploadResume);
router.get('/history', getResumeHistory);
router.get('/:id', getResumeById);
router.delete('/:id', deleteResume);

module.exports = router;
