import { Request, Response, NextFunction } from 'express';
import { SupportTicket } from '../models/SupportTicket';

// @desc    Create a new support ticket
// @route   POST /api/support
// @access  Private
export const createTicket = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const { subject, message } = req.body;

        const ticket = await SupportTicket.create({
            user: req.user._id,
            subject,
            message
        });

        res.status(201).json(ticket);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all tickets (Admin only)
// @route   GET /api/support
// @access  Private/Admin
export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tickets = await SupportTicket.find().populate('user', 'username email');
        res.json(tickets);
    } catch (error) {
        next(error);
    }
};
