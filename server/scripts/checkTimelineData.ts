import mongoose from 'mongoose';
import { Timeline } from '../src/models/Timeline';
import { TimelineEvent } from '../src/models/TimelineEvent';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const check = async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gundam-wiki');

    const timelines = await Timeline.find({}).sort({ order: 1 });
    console.log('--- Timeline Event Counts ---');
    for (const t of timelines) {
        const count = await TimelineEvent.countDocuments({ timeline: t._id });
        console.log(`${t.name}: ${count} events`);
    }
    process.exit();
};

check();
