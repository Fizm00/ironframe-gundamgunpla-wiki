
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LoreCharacter } from '../src/models/LoreCharacter';

dotenv.config();

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');

        const count = await LoreCharacter.countDocuments();
        console.log(`Total Characters: ${count}`);

        const amuro = await LoreCharacter.findOne({ name: 'Amuro Ray' });
        if (amuro) {
            console.log('--- Amuro Ray Data ---');
            console.log(`Personality Length: ${amuro.personality?.length || 0}`);
            console.log(`Skills Length: ${amuro.skills?.length || 0}`);
            console.log(`Notes Length: ${amuro.notes?.length || 0}`);
        } else {
            console.log('Amuro Ray not found yet.');
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkDB();
