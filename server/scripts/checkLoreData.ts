import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LoreCharacter } from '../src/models/LoreCharacter';

dotenv.config();

const checkLore = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        const chars = await LoreCharacter.find({ profile: { $exists: true } }).limit(5);

        console.log('--- Sample Lore Characters ---');
        chars.forEach(c => {
            console.log(`Name: ${c.name}`);
            if (c.profile) {
                // @ts-ignore
                console.log('Allegiance/Affiliation Keys:', Object.keys(Object.fromEntries(c.profile)).filter(k => /Allegiance|Affiliation|Organization|Team/i.test(k)));
                // @ts-ignore
                console.log('Profile:', JSON.stringify(Object.fromEntries(c.profile), null, 2));
            }
            console.log('---');
        });

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

checkLore();
