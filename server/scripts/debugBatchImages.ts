import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const LoreMobileSuitSchema = new mongoose.Schema({ name: String, imageUrl: String }, { strict: false });
const LoreMobileSuit = mongoose.model('LoreMobileSuit', LoreMobileSuitSchema);

const debugBatch = async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gundam-wiki');

    const testNames = ["GM", "Gundam", "Zaku II", "RGM-79 GM", "RX-78-2 Gundam"];

    console.log(`Testing matches for: ${testNames.join(', ')}`);

    const queries = testNames.map(name => ({
        name: { $regex: name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
    }));

    const suits = await LoreMobileSuit.find({ $or: queries }).select('name imageUrl url').lean();
    console.log(`Found ${suits.length} matches.`);

    testNames.forEach(n => {
        const regex = new RegExp(n.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
        const match = suits.find(s => s.name && regex.test(s.name));
        const m: any = match;
        console.log(`Query "${n}": MATCH (${m?.name}) - URL: ${m?.url} - Img: ${m?.imageUrl ? 'YES' : 'NO'}`);
    });

    process.exit();
};

debugBatch();
