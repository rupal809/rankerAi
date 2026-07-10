const express = require('express');
const { startInterview, evaluateInterview, getInterviewHistory, getInterviewById } = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all interview routes

router.post('/start', startInterview);
router.post('/evaluate', evaluateInterview);
router.get('/history', getInterviewHistory);
router.get('/:id', getInterviewById);

module.exports = router;
