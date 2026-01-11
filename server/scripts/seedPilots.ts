import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Pilot } from '../src/models/Pilot';
import { Faction } from '../src/models/Faction';

dotenv.config();

const pilots = [
    { name: 'Amuro Ray', callsign: 'White Devil', age: 19, status: 'Active' },
    { name: 'Char Aznable', callsign: 'Red Comet', age: 20, status: 'Active' },
    { name: 'Kamille Bidan', callsign: 'Zeta Pilot', age: 17, status: 'Active' },
    { name: 'Judau Ashta', callsign: 'ZZ Pilot', age: 14, status: 'Active' },
    { name: 'Heero Yuy', callsign: 'Wing Zero', age: 15, status: 'Active' },
    { name: 'Kira Yamato', callsign: 'Jesus Yamato', age: 16, status: 'Active' },
    { name: 'Athrun Zala', callsign: 'Justice', age: 16, status: 'Active' },
    { name: 'Setsuna F. Seiei', callsign: 'Gundam', age: 16, status: 'Active' },
    { name: 'Mikazuki Augus', callsign: 'Devil of Tekkadan', age: 16, status: 'Active' },
    { name: 'Suletta Mercury', callsign: 'Tanuki', age: 17, status: 'Active' }
];

const seedPilots = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        // Get all factions
        const factions = await Faction.find();
        if (factions.length === 0) {
            console.log('No factions found. Run faction seeder first.');
            process.exit(1);
        }

        await Pilot.deleteMany({}); // Clear existing
        console.log('Cleared existing pilots');

        // Create 50 dummy pilots
        const dummyPilots = Array.from({ length: 50 }).map((_, i) => {
            // Weighted random selection for factions to create uneven distribution (better chart)
            // 0-3: Popular factions (receive more pilots)
            // 4+: Minor factions
            let factionIndex;
            const r = Math.random();
            if (r < 0.6) { // 60% chance to be in top 3 factions
                factionIndex = Math.floor(Math.random() * Math.min(3, factions.length));
            } else {
                factionIndex = Math.floor(Math.random() * factions.length);
            }

            return {
                name: `Pilot ${i + 1}`,
                callsign: `Callsign ${i + 1}`,
                age: 18 + Math.floor(Math.random() * 20),
                status: 'Active',
                faction: factions[factionIndex]._id,
                description: 'Generated for analytics testing',
                imageUrl: 'https://placehold.co/150'
            };
        });

        await Pilot.insertMany(dummyPilots);
        console.log(`Seeded ${dummyPilots.length} pilots with weighted distribution.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

seedPilots();
