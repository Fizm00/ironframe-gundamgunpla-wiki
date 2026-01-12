import express from 'express';
import { getTimelines, getTimelineById } from '../controllers/timelineController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(getTimelines);

router.route('/:id')
    .get(getTimelineById);

export default router;
