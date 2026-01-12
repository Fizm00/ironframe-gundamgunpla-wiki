import mongoose from 'mongoose';
import { LoreMobileSuit } from '../src/models/LoreMobileSuit';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

async function debugSpecs() {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        // Find RX-78-2 or Zaku II to see their data structure
        const targetNames = ['RX-78-2 Gundam', 'MS-06F Zaku II', 'ASW-G-08 Gundam Barbatos'];

        for (const name of targetNames) {
            const suit = await LoreMobileSuit.findOne({ name: { $regex: name, $options: 'i' } });
            if (suit) {
                console.log(`\n=== SPECS FOR: ${suit.name} ===`);
                console.log(JSON.stringify(suit.specifications, null, 2));
                console.log('Performance Keys:', suit.performance ? Object.keys(suit.performance) : 'None');
            } else {
                console.log(`Could not find ${name}`);
            }
        }

    } catch (error) {
        console.error(error);
    } finally {
        await mongoose.disconnect();
    }
}

debugSpecs();
