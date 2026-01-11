import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LoreMobileSuit } from '../src/models/LoreMobileSuit';
import { Pilot } from '../src/models/Pilot';
import { Faction } from '../src/models/Faction';

dotenv.config();

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('MongoDB Connected');
    } catch (err) {
        console.error('Connection Error:', err);
        process.exit(1);
    }
};

const fixIndexes = async () => {
    await connectDB();

    console.log('Syncing Indexes...');

    try {
        console.log('LoreMobileSuit Indexes...');
        await LoreMobileSuit.syncIndexes();

        console.log('Pilot Indexes...');
        await Pilot.syncIndexes();

        console.log('Faction Indexes...');
        await Faction.syncIndexes();

        console.log('All indexes synced successfully.');
    } catch (error) {
        console.error('Index Sync Error:', error);
    } finally {
        await mongoose.connection.close();
        process.exit();
    }
};

fixIndexes();
