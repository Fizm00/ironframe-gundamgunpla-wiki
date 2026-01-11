import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const FactionSchema = new mongoose.Schema({ name: String }, { strict: false });
const Faction = mongoose.model('Faction', FactionSchema);

const checkNames = async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gundam-wiki');

    const ef = await Faction.findOne({ name: 'Earth Federation' });
    console.log(`'Earth Federation' exists? ${!!ef}`);

    const zeon = await Faction.find({ name: { $regex: 'Zeon', $options: 'i' } });
    console.log(`Zeon matches:`, zeon.map(z => z.name));

    const ea = await Faction.find({ name: { $regex: 'Earth Alliance', $options: 'i' } });
    console.log(`Earth Alliance matches:`, ea.map(z => z.name));

    process.exit();
};
checkNames();
