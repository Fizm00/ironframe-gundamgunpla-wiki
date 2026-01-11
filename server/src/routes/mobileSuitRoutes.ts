import express from 'express';
import {
    getMobileSuits,
    getMobileSuitById,
    createMobileSuit,
    updateMobileSuit,
    deleteMobileSuit,
    uploadImage
} from '../controllers/mobileSuitController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../config/upload';

const router = express.Router();

router.route('/')
    .get(getMobileSuits)
    .post(protect, adminOnly, createMobileSuit);

router.route('/:id')
    .get(getMobileSuitById)
    .put(protect, adminOnly, updateMobileSuit)
    .delete(protect, adminOnly, deleteMobileSuit);

router.route('/:id/image')
    .post(protect, adminOnly, upload.single('image'), uploadImage);

export default router;
