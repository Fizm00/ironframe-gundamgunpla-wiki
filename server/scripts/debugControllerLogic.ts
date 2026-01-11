import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const LoreMobileSuitSchema = new mongoose.Schema({ name: String, imageUrl: String }, { strict: false });
const LoreMobileSuit = mongoose.model('LoreMobileSuit', LoreMobileSuitSchema);

const debugControllerLogic = async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gundam-wiki');

    const names = [
        "RGM-79 GM",
        "RGM-79 GM (RFV)",
        "RX-78-2 Gundam[1]",
        "Zaku II (Unidentified Variant)",
        "Gundam"
    ];

    console.log(`Testing Controller Logic for: ${names.join(', ')}`);

    const cleanNames = names.map(n => {
        let clean = n.replace(/\[\d+\]/g, '').trim();
        const base = clean.replace(/\s*\(.*?\)/g, '').trim();
        return { original: n, clean, base };
    });

    const searchTerms = new Set<string>();
    cleanNames.forEach(x => {
        if (x.clean.length > 2) searchTerms.add(x.clean);
        if (x.base.length > 2) searchTerms.add(x.base);
    });

    const regexQueries = Array.from(searchTerms).map(term => ({
        name: { $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
    }));

    const suits = await LoreMobileSuit.find({ $or: regexQueries }).select('name imageUrl').lean();
    console.log(`Found ${suits.length} potential candidates.`);

    names.forEach(originalName => {
        let clean = originalName.replace(/\[\d+\]/g, '').trim();
        let base = clean.replace(/\s*\(.*?\)/g, '').trim();

        const cleanRegex = new RegExp(clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const baseRegex = new RegExp(base.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

        const match = suits.find(s =>
            (s.name && cleanRegex.test(s.name)) || (s.name && s.name.includes(clean)) ||
            (s.name && base.length > 2 && (baseRegex.test(s.name) || s.name.includes(base) || base.includes(s.name)))
        );

        const m: any = match;
        console.log(`Input: "${originalName}" -> Found: ${m?.name} (Img: ${m?.imageUrl ? 'YES' : 'NO'})`);
    });

    process.exit();
};

debugControllerLogic();
