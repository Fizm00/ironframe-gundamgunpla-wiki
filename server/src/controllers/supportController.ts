import { Request, Response, NextFunction } from 'express';
import { SupportTicket } from '../models/SupportTicket';

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

export const getTickets = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const tickets = await SupportTicket.find().populate('user', 'username email');
        res.json(tickets);
    } catch (error) {
        next(error);
    }
};
