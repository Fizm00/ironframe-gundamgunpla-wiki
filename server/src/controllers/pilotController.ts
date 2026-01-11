import { Request, Response, NextFunction } from 'express';
import { Pilot } from '../models/Pilot';
import redis from '../config/redis';
import { logActivity } from '../utils/activityLogger';

// @desc    Get all pilots
// @route   GET /api/pilots
// @access  Public
export const getPilots = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cacheKey = 'pilots:all';
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const pilots = await Pilot.find().populate('mobileSuits', 'name modelNumber');

        await redis.setex(cacheKey, 3600, JSON.stringify(pilots));

        res.json(pilots);
    } catch (error) {
        next(error);
    }
};

// @desc    Get single pilot
// @route   GET /api/pilots/:id
// @access  Public
export const getPilotById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const cacheKey = `pilots:${id}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const pilot = await Pilot.findById(id).populate('mobileSuits', 'name modelNumber');

        if (pilot) {
            await redis.setex(cacheKey, 3600, JSON.stringify(pilot));
            res.json(pilot);
        } else {
            res.status(404);
            throw new Error('Pilot not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Create a pilot
// @route   POST /api/pilots
// @access  Private/Admin
export const createPilot = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const pilot = await Pilot.create(req.body);

        await redis.del('pilots:all');

        // Log Activity
        await logActivity('Created', 'Pilot', pilot.name, req.user ? req.user.username : 'System');

        res.status(201).json(pilot);
    } catch (error) {
        next(error);
    }
};

// @desc    Update a pilot
// @route   PUT /api/pilots/:id
// @access  Private/Admin
export const updatePilot = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const pilot = await Pilot.findById(req.params.id);

        if (pilot) {
            const updatedPilot = await Pilot.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            await redis.del('pilots:all');
            await redis.del(`pilots:${req.params.id}`);

            // Log Activity
            await logActivity('Updated', 'Pilot', pilot.name, req.user ? req.user.username : 'System');

            res.json(updatedPilot);
        } else {
            res.status(404);
            throw new Error('Pilot not found');
        }
    } catch (error) {
        next(error);
    }
};

// @desc    Delete a pilot
// @route   DELETE /api/pilots/:id
// @access  Private/Admin
export const deletePilot = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const pilot = await Pilot.findById(req.params.id);

        if (pilot) {
            await pilot.deleteOne();

            await redis.del('pilots:all');
            await redis.del(`pilots:${req.params.id}`);

            // Log Activity
            await logActivity('Deleted', 'Pilot', pilot.name, req.user ? req.user.username : 'System');

            res.json({ message: 'Pilot removed' });
        } else {
            res.status(404);
            throw new Error('Pilot not found');
        }
    } catch (error) {
        next(error);
    }
};
