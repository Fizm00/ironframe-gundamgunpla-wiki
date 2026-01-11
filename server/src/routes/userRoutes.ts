import express from 'express';
import { getUsers, updateUserRole, deleteUser } from '../controllers/userController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.route('/')
    .get(getUsers);

router.route('/:id/role')
    .put(updateUserRole);

router.route('/:id')
    .delete(deleteUser);

export default router;
