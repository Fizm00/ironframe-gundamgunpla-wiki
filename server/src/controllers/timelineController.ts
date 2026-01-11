import { Request, Response, NextFunction } from 'express';
import { Timeline } from '../models/Timeline';
import { TimelineEvent } from '../models/TimelineEvent';
import redis from '../config/redis';

// @desc    Get all timelines (eras)
// @route   GET /api/timeline
// @access  Public
export const getTimelines = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cacheKey = 'timelines:all';
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const timelines = await Timeline.find({}).sort({ order: 1 });

        // Cache for 1 hour
        await redis.setex(cacheKey, 3600, JSON.stringify(timelines));

        res.json(timelines);
    } catch (error) {
        next(error);
    }
};

// @desc    Get timeline details and events
// @route   GET /api/timeline/:id
// @access  Public
export const getTimelineById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cacheKey = `timeline:${req.params.id}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const timeline = await Timeline.findById(req.params.id);

        if (!timeline) {
            res.status(404);
            throw new Error('Timeline not found');
        }

        const events = await TimelineEvent.find({ timeline: req.params.id }).sort({ year: 1 });

        const result = { ...timeline.toObject(), events };

        // Cache for 1 hour
        await redis.setex(cacheKey, 3600, JSON.stringify(result));

        res.json(result);
    } catch (error) {
        next(error);
    }
};
