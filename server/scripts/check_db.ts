
import mongoose from 'mongoose';
import { LoreMobileSuit } from './models/LoreMobileSuit';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/gunpladb');
        console.log("Connected to DB");

        const suit = await LoreMobileSuit.findOne({ name: 'RX-78-2 Gundam' });
        if (!suit) {
            console.log("Suit not found");
        } else {
            console.log("Suit found:", suit.name);
            console.log("Armaments:", JSON.stringify(suit.armaments, null, 2));
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
