import express from 'express';
import {
    getFactions,
    getFactionById,
    createFaction,
    updateFaction,
    deleteFaction,
    seedFactions,
    uploadFactionImage
} from '../controllers/factionController';
import { protect, adminOnly } from '../middleware/authMiddleware';
import { upload } from '../config/upload';

const router = express.Router();

// Temp Public
router.post('/seed', seedFactions);

router.route('/')
    .get(getFactions)
    .post(protect, adminOnly, createFaction);

router.route('/:id')
    .get(getFactionById)
    .put(protect, adminOnly, updateFaction)
    .delete(protect, adminOnly, deleteFaction);

router.post('/:id/image', protect, adminOnly, upload.single('image'), uploadFactionImage);

export default router;
