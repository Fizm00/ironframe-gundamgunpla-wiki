import express from 'express';
import { registerUser, loginUser, updateUserProfile, updateUserPassword } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';
import { upload } from '../config/upload';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.put('/profile', protect, upload.single('avatar'), updateUserProfile);
router.put('/password', protect, updateUserPassword);

export default router;
