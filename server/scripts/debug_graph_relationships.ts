import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LoreCharacter } from '../src/models/LoreCharacter';
import { LoreMobileSuit } from '../src/models/LoreMobileSuit';
import { Faction } from '../src/models/Faction';

dotenv.config();

const verifyData = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI as string);
        console.log('Connected to DB');

        console.log('\n--- 1. CHAR AZNABLE CHECK ---');
        const char = await LoreCharacter.findOne({ name: { $regex: /Char Aznable/i } });
        if (char) {
            console.log(`Name: ${char.name}`);
            console.log(`Series: ${char.series}`);
            console.log(`Mecha List:`, char.mecha);

            // Check if his mecha exist in DB
            if (char.mecha && char.mecha.length > 0) {
                const mechaDocs = await LoreMobileSuit.find({ name: { $in: char.mecha } });
                console.log(`Found ${mechaDocs.length} / ${char.mecha.length} Mobile Suits in DB.`);
                mechaDocs.forEach(m => console.log(`   - [${m.name}] Series: ${m.series} | Faction: ${m.faction}`));
            }
        } else {
            console.log('Char NOT FOUND');
        }

        console.log('\n--- 2. AMURO RAY CHECK ---');
        const amuro = await LoreCharacter.findOne({ name: { $regex: /Amuro Ray/i } });
        if (amuro) {
            console.log(`Name: ${amuro.name}`);
            console.log(`Series: ${amuro.series}`);
            console.log(`Mecha List:`, amuro.mecha);

            if (amuro.mecha && amuro.mecha.length > 0) {
                const mechaDocs = await LoreMobileSuit.find({ name: { $in: amuro.mecha } });
                console.log(`Found ${mechaDocs.length} / ${amuro.mecha.length} Mobile Suits in DB.`);
                mechaDocs.forEach(m => console.log(`   - [${m.name}] Series: ${m.series}`));
            }
        } else {
            console.log('Amuro NOT FOUND');
        }

        // Check Mobile Suit Reverse Links
        console.log('\n--- 3. MOBILE SUIT CHECK ---');
        const msList = await LoreMobileSuit.find({ name: { $in: [/RX-78-2/i, /Zaku II/i] } });
        msList.forEach(ms => {
            console.log(`MS: ${ms.name}`);
            console.log(`Known Pilots:`, ms.knownPilots);
        });

        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

verifyData();
