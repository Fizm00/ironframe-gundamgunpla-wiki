import { Request, Response, NextFunction } from 'express';
import { MobileSuit } from '../models/MobileSuit';
import redis from '../config/redis';
import { logActivity } from '../utils/activityLogger';

export const getMobileSuits = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const pageSize = Number(req.query.limit) || 30;
        const page = Number(req.query.page) || 1;


        let query: any = {};

        if (req.query.keyword) {
            query = {
                $or: [
                    { name: { $regex: req.query.keyword, $options: 'i' } },
                    { modelNumber: { $regex: req.query.keyword, $options: 'i' } },
                    { description: { $regex: req.query.keyword, $options: 'i' } }
                ]
            };
        }

        if (req.query.grade) {
            query.grade = { $regex: req.query.grade, $options: 'i' };
        }

        const cacheKey = `v2:mobile-suits:page=${page}&limit=${pageSize}&keyword=${req.query.keyword || ''}&grade=${req.query.grade || ''}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const count = await MobileSuit.countDocuments(query);
        const mobileSuits = await MobileSuit.find(query)
            .limit(pageSize)
            .skip(pageSize * (page - 1))
            .sort({ createdAt: 1 });

        const responseData = {
            mobileSuits,
            page,
            pages: Math.ceil(count / pageSize),
            total: count
        };

        await redis.setex(cacheKey, 3600, JSON.stringify(responseData));

        res.json(responseData);
    } catch (error) {
        next(error);
    }
};

export const getMobileSuitById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params;
        const cacheKey = `mobile-suits:${id}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const mobileSuit = await MobileSuit.findById(id);

        if (mobileSuit) {
            await redis.setex(cacheKey, 3600, JSON.stringify(mobileSuit));
            res.json(mobileSuit);
        } else {
            res.status(404);
            throw new Error('Mobile Suit not found');
        }
    } catch (error) {
        next(error);
    }
};

export const createMobileSuit = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const mobileSuit = await MobileSuit.create(req.body);

        // Invalidate Cache
        const keys = await redis.keys('v2:mobile-suits:*');
        if (keys.length > 0) {
            await redis.del(keys);
        }
        await redis.del('mobile-suits:all');

        // Log Activity
        await logActivity('Created', 'Gunpla', mobileSuit.name, req.user ? req.user.username : 'System');

        res.status(201).json(mobileSuit);
    } catch (error) {
        next(error);
    }
};

export const updateMobileSuit = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const mobileSuit = await MobileSuit.findById(req.params.id);

        if (mobileSuit) {
            const updatedMobileSuit = await MobileSuit.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            // Invalidate Cache
            const keys = await redis.keys('v2:mobile-suits:*');
            if (keys.length > 0) {
                await redis.del(keys);
            }
            await redis.del('mobile-suits:all');
            await redis.del(`mobile-suits:${req.params.id}`);

            // Log Activity
            await logActivity('Updated', 'Gunpla', mobileSuit.name, req.user ? req.user.username : 'System');

            res.json(updatedMobileSuit);
        } else {
            res.status(404);
            throw new Error('Mobile Suit not found');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteMobileSuit = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const mobileSuit = await MobileSuit.findById(req.params.id);

        if (mobileSuit) {
            await mobileSuit.deleteOne();

            // Invalidate Cache
            const keys = await redis.keys('v2:mobile-suits:*');
            if (keys.length > 0) {
                await redis.del(keys);
            }
            await redis.del('mobile-suits:all');
            await redis.del(`mobile-suits:${req.params.id}`);

            // Log Activity
            await logActivity('Deleted', 'Gunpla', mobileSuit.name, req.user ? req.user.username : 'System');

            res.json({ message: 'Mobile Suit removed' });
        } else {
            res.status(404);
            throw new Error('Mobile Suit not found');
        }
    } catch (error) {
        next(error);
    }
};

// @route   POST /api/mobile-suits/:id/image
// @access  Private/Admin
export const uploadImage = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('No image file uploaded');
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const mobileSuit = await MobileSuit.findByIdAndUpdate(
            req.params.id,
            { imageUrl },
            { new: true }
        );

        if (!mobileSuit) {
            res.status(404);
            throw new Error('Mobile Suit not found');
        }

        // Invalidate Cache
        const keys = await redis.keys('v2:mobile-suits:*');
        if (keys.length > 0) {
            await redis.del(keys);
        }
        await redis.del('mobile-suits:all');
        await redis.del(`mobile-suits:${req.params.id}`);

        await logActivity('Updated Image', 'Gunpla', mobileSuit.name, req.user ? req.user.username : 'System');

        res.json({
            message: 'Image uploaded successfully',
            imageUrl: mobileSuit.imageUrl
        });
    } catch (error) {
        next(error);
    }
};
