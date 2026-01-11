import express from 'express';
import {
    getPilots,
    getPilotById,
    createPilot,
    updatePilot,
    deletePilot
} from '../controllers/pilotController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(getPilots)
    .post(protect, adminOnly, createPilot);

router.route('/:id')
    .get(getPilotById)
    .put(protect, adminOnly, updatePilot)
    .delete(protect, adminOnly, deletePilot);

export default router;
