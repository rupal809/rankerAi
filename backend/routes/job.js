const express = require('express');
const { matchJobDescription, getJobMatchHistory } = require('../controllers/jobController');
const { protect } = require('../middleware/auth');

const router = express.Router();

router.use(protect); // Protect all job match routes

router.post('/match', matchJobDescription);
router.get('/history', getJobMatchHistory);

module.exports = router;
