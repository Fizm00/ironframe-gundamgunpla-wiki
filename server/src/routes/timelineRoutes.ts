import express from 'express';
import { getTimelines, getTimelineById } from '../controllers/timelineController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .get(getTimelines);

router.route('/:id')
    .get(getTimelineById);

// Keep existing admin routes for event management if they existed, or migrate them?
// The user has existing "TimelineList.ts" (Admin), which likely used the old route logic.
// We should check what the old timeline routes were doing.
// Assuming "GET /" was fetching all events for admin table.
// We might need to separate "Public API" (Eras) vs "Admin API" (Events Table).
// For now, let's keep it simple: GET / = List Eras.
// If Admin needs list of EVENTS, maybe GET /events?

export default router;
