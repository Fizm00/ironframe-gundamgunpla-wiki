import express from 'express';
import { createTicket, getTickets } from '../controllers/supportController';
import { protect, adminOnly } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
    .post(protect, createTicket)
    .get(protect, adminOnly, getTickets);

export default router;
