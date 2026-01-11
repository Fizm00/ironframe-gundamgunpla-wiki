import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LoreMobileSuit } from '../src/models/LoreMobileSuit';

dotenv.config();

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log("DB Connected.");

        // Check Strike
        const targets = ['Strike Gundam', 'Gundam Exia', 'Barbatos'];

        for (const t of targets) {
            const suit = await LoreMobileSuit.findOne({ name: new RegExp(t, 'i') });
            if (suit) {
                console.log(`[${suit.name}] Series: "${suit.series}"`);
            } else {
                console.log(`[${t}] Not found.`);
            }
        }
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

run();
