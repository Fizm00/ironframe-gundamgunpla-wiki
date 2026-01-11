import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User';

const generateToken = (id: string, role: string) => {
    return jwt.sign({ id, role }, process.env.JWT_SECRET || 'fallback_secret', {
        expiresIn: '30d'
    });
};

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { username, email, password } = req.body;

        const userExists = await User.findOne({ $or: [{ email }, { username }] });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        const user = await User.create({
            username,
            email,
            passwordHash: password,
            role: 'user'
        });

        if (user) {
            res.status(201).json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id as unknown as string, user.role)
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });

        if (user && (await user.comparePassword(password))) {
            res.json({
                _id: user._id,
                username: user.username,
                email: user.email,
                role: user.role,
                avatar: user.avatar,
                token: generateToken(user._id as unknown as string, user.role)
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        next(error);
    }
};

export const updateUserProfile = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.username = req.body.username || user.username;
            user.email = req.body.email || user.email;

            if (req.file) {
                // Format path to be accessible via static route (e.g. /uploads/filename)
                user.avatar = `/uploads/${req.file.filename}`;
            }

            const updatedUser = await user.save();

            res.json({
                _id: updatedUser._id,
                username: updatedUser.username,
                email: updatedUser.email,
                role: updatedUser.role,
                avatar: updatedUser.avatar,
                token: generateToken(updatedUser._id as unknown as string, updatedUser.role)
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};

export const updateUserPassword = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            const { currentPassword, newPassword } = req.body;

            // Check if current password matches
            if (await user.comparePassword(currentPassword)) {
                user.passwordHash = newPassword; // Pre-save hook will hash it
                await user.save();
                res.json({ message: 'Password updated successfully' });
            } else {
                res.status(401);
                throw new Error('Invalid current password');
            }
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        next(error);
    }
};
