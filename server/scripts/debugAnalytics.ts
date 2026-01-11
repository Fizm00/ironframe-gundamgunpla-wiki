import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Pilot } from '../src/models/Pilot';
import { Faction } from '../src/models/Faction';
import { TimelineEvent } from '../src/models/TimelineEvent';

dotenv.config();

const debugAnalytics = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        const pilotCount = await Pilot.countDocuments();
        console.log(`Total Pilots: ${pilotCount}`);

        const pilotWithFaction = await Pilot.countDocuments({ faction: { $exists: true, $ne: null } });
        console.log(`Pilots with Faction: ${pilotWithFaction}`);

        // Sample a pilot to see structure
        const samplePilot = await Pilot.findOne({ faction: { $exists: true } });
        console.log('Sample Pilot:', samplePilot);

        // Run Aggregation
        const aggregationResult = await Pilot.aggregate([
            { $group: { _id: "$faction", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "factions",
                    localField: "_id",
                    foreignField: "_id",
                    as: "factionInfo"
                }
            },
            { $unwind: "$factionInfo" },
            {
                $project: {
                    name: "$factionInfo.name",
                    count: 1
                }
            }
        ]);

        console.log('Aggregation Result (Factions):', JSON.stringify(aggregationResult, null, 2));

        // Key: Check Timeline Events
        const eventCount = await TimelineEvent.countDocuments();
        console.log(`Total Timeline Events: ${eventCount}`);

        const eventAggregation = await TimelineEvent.aggregate([
            { $group: { _id: "$timeline", count: { $sum: 1 } } },
            {
                $lookup: {
                    from: "timelines",
                    localField: "_id",
                    foreignField: "_id",
                    as: "timelineInfo"
                }
            },
            { $unwind: "$timelineInfo" },
            { $sort: { "timelineInfo.order": 1 } },
            {
                $project: {
                    name: "$timelineInfo.name",
                    count: 1
                }
            }
        ]);
        console.log('Aggregation Result (Timeline):', JSON.stringify(eventAggregation, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

debugAnalytics();
