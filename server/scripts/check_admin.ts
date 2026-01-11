
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../src/models/User';

dotenv.config();

const checkAdmin = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        const admin = await User.findOne({ email: 'admin@example.com' });

        if (admin) {
            console.log('Admin user found:', admin.email, 'Role:', admin.role);
        } else {
            console.log('Admin user NOT found');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkAdmin();
