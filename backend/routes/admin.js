const express = require('express');
const { getAdminStats, getUsers, updateUserRole, deleteUser } = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

const router = express.Router();

router.use(protect);
router.use(authorize('admin')); // Protect all admin routes with admin authorization checks

router.get('/stats', getAdminStats);
router.get('/users', getUsers);
router.put('/users/:id/role', updateUserRole);
router.delete('/users/:id', deleteUser);

module.exports = router;
