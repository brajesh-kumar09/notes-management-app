const express = require('express');
const { registerUser, loginUser, deleteUserAccount } = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware')

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/delete-account', authMiddleware, deleteUserAccount);

module.exports = router;