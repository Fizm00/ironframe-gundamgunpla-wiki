import { Request, Response, NextFunction } from 'express';
import { LoreCharacter } from '../models/LoreCharacter';
import redis from '../config/redis';
import { logActivity } from '../utils/activityLogger';

export const getCharacters = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 12;
        const search = (req.query.search as string) || '';

        const cacheKey = `lore-characters:page=${page}&limit=${limit}&search=${search}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const query: any = {};
        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { series: { $regex: search, $options: 'i' } },
                { mecha: { $regex: search, $options: 'i' } }
            ];
        }

        const characters = await LoreCharacter.find(query)
            .select('name imageUrl profile mecha series')
            .sort({ name: 1 })
            .skip((page - 1) * limit)
            .limit(limit);

        const total = await LoreCharacter.countDocuments(query);

        const responseData = {
            characters,
            total,
            page,
            pages: Math.ceil(total / limit)
        };

        await redis.setex(cacheKey, 3600, JSON.stringify(responseData));

        res.json(responseData);
    } catch (error) {
        next(error);
    }
};

export const getCharacterById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const character = await LoreCharacter.findById(req.params.id);
        if (!character) {
            return res.status(404).json({ message: 'Character not found' });
        }
        res.json(character);
    } catch (error) {
        next(error);
    }
};

export const createCharacter = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const character = await LoreCharacter.create(req.body);

        const keys = await redis.keys('lore-characters:*');
        if (keys.length > 0) {
            await redis.del(keys);
        }

        await logActivity('Created', 'Pilot', character.name, req.user ? req.user.username : 'System');

        res.status(201).json(character);
    } catch (error) {
        next(error);
    }
};

export const updateCharacter = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const character = await LoreCharacter.findById(req.params.id);

        if (character) {
            const updatedCharacter = await LoreCharacter.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            const keys = await redis.keys('lore-characters:*');
            if (keys.length > 0) {
                await redis.del(keys);
            }

            await logActivity('Updated', 'Pilot', character.name, req.user ? req.user.username : 'System');

            res.json(updatedCharacter);
        } else {
            res.status(404);
            throw new Error('Character not found');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteCharacter = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const character = await LoreCharacter.findById(req.params.id);

        if (character) {
            await character.deleteOne();

            const keys = await redis.keys('lore-characters:*');
            if (keys.length > 0) {
                await redis.del(keys);
            }

            await logActivity('Deleted', 'Pilot', character.name, req.user ? req.user.username : 'System');

            res.json({ message: 'Character removed' });
        } else {
            res.status(404);
            throw new Error('Character not found');
        }
    } catch (error) {
        next(error);
    }
};

export const uploadImage = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('No image file uploaded');
        }

        const imageUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        const character = await LoreCharacter.findByIdAndUpdate(
            req.params.id,
            { imageUrl },
            { new: true }
        );

        if (!character) {
            res.status(404);
            throw new Error('Character not found');
        }

        const keys = await redis.keys('lore-characters:*');
        if (keys.length > 0) {
            await redis.del(keys);
        }

        await logActivity('Updated Image', 'Pilot', character.name, req.user ? req.user.username : 'System');

        res.json({
            message: 'Image uploaded successfully',
            imageUrl: character.imageUrl
        });
    } catch (error) {
        next(error);
    }
};
