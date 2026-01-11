import express from 'express';
import {
    getLoreMobileSuits,
    getLoreMobileSuitById,
    getLoreSeriesList,
    uploadMobileSuitImage,
    createLoreMobileSuit,
    updateLoreMobileSuit,
    deleteLoreMobileSuit,
    getLoreMobileSuitsBatch
} from '../controllers/loreController';
import { upload } from '../config/upload';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.get('/', getLoreMobileSuits);
router.get('/series', getLoreSeriesList);
router.get('/:id', getLoreMobileSuitById);

router.post('/batch', getLoreMobileSuitsBatch);

router.post('/', protect, adminOnly, createLoreMobileSuit);
router.put('/:id', protect, adminOnly, updateLoreMobileSuit);
router.delete('/:id', protect, adminOnly, deleteLoreMobileSuit);
router.post('/:id/image', protect, adminOnly, upload.single('image'), uploadMobileSuitImage); // Also protect image upload

export default router;
