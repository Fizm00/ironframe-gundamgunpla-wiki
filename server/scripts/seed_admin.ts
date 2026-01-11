
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from './models/User';

dotenv.config();

const seedAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        const existingAdmin = await User.findOne({ email: 'admin@example.com' });
        if (existingAdmin) {
            console.log('Admin already exists.');
            return;
        }

        const admin = new User({
            username: 'Commander',
            email: 'admin@example.com',
            passwordHash: '123456', // Pre-save hook will hash this
            role: 'admin'
        });

        await admin.save();
        console.log('Admin user seeded successfully.');
        console.log('Email: admin@example.com');
        console.log('Password: 123456');

    } catch (error) {
        console.error('Error seeding admin:', error);
    } finally {
        await mongoose.disconnect();
    }
};

seedAdmin();
