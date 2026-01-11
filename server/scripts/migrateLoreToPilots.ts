// @ts-nocheck
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LoreCharacter } from '../src/models/LoreCharacter';
import { Pilot } from '../src/models/Pilot';
import { Faction } from '../src/models/Faction';

dotenv.config();

const migrateLoreToPilots = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to MongoDB');

        // Load Factions
        const factions = await Faction.find();
        console.log(`Loaded ${factions.length} Factions for matching.`);

        // Find all characters with profile data
        const characters = await LoreCharacter.find({
            $or: [
                { "profile.Affiliation": { $exists: true } },
                { "profile.Allegiance": { $exists: true } },
            ]
        });
        console.log(`Found ${characters.length} LoreCharacters with potential faction data.`);

        await Pilot.deleteMany({});
        console.log('Cleared existing Pilots.');

        let createdCount = 0;

        for (const char of characters) {
            // @ts-ignore
            const profile = Object.fromEntries(char.profile);
            const affiliation = profile['Affiliation'] || profile['Allegiance'];

            if (!affiliation) continue;

            // Fuzzy Match
            const potentialFactions = affiliation.split(/,|;|\//).map(s => s.trim());
            let matchedFactionId = null;
            let matchedFactionName = '';

            for (const pot of potentialFactions) {
                const match = factions.find(f =>
                    f.name.toLowerCase() === pot.toLowerCase() ||
                    f.name.toLowerCase().includes(pot.toLowerCase()) ||
                    pot.toLowerCase().includes(f.name.toLowerCase())
                );
                if (match) {
                    matchedFactionId = match._id;
                    matchedFactionName = match.name;
                    break;
                }
            }

            if (matchedFactionId) {
                // Determine Status from Profile
                let status: 'Active' | 'KIA' | 'MIA' | 'Retired' = 'Active';
                const statusRaw = profile['Status'] || '';
                if (/Killed|Deceased|Dead/i.test(statusRaw)) status = 'KIA';
                else if (/Missing/i.test(statusRaw)) status = 'MIA';
                else if (/Retired/i.test(statusRaw)) status = 'Retired';

                await Pilot.create({
                    name: char.name,
                    callsign: profile['Callsign'] || 'Unknown',
                    age: parseInt(profile['Age']) || 20,
                    rank: profile['Rank'] || 'Unknown',
                    faction: matchedFactionId,
                    mobileSuits: [], // Could theoretically link this too if scraped
                    status: status,
                    description: char.description || `Pilot affiliated with ${matchedFactionName}`,
                    imageUrl: char.imageUrl || 'https://placehold.co/150'
                });
                createdCount++;
                if (createdCount % 50 === 0) process.stdout.write('.');
            }
        }

        console.log(`\nMigration Completed. Created ${createdCount} Real Pilots from Lore Database.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        await mongoose.disconnect();
    }
};

migrateLoreToPilots();
