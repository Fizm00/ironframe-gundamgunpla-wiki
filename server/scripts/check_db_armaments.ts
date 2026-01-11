
import mongoose from 'mongoose';
import { LoreMobileSuit } from './models/LoreMobileSuit';
import dotenv from 'dotenv';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/gunpladb');

        const suit = await LoreMobileSuit.findOne({ name: 'RX-78-2 Gundam' });
        if (!suit) {
            console.log("Suit NOT FOUND");
        } else {
            console.log("Suit Found:", suit.name);
            console.log("Armaments Length:", suit.armaments ? suit.armaments.length : 0);
            console.log("Armaments Data:", JSON.stringify(suit.armaments, null, 2));
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
};

run();
