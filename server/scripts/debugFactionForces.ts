import mongoose from 'mongoose';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const FactionSchema = new mongoose.Schema({ name: String }, { strict: false });
const Faction = mongoose.model('Faction', FactionSchema);

const debug = async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gundam-wiki');
    const f: any = await Faction.findOne({ name: 'Earth Federation' });
    if (!f) console.log('Not found');
    else {
        console.log('Faction:', f.name);
        console.log('URL:', f.url);
        console.log('Main Image:', f.imageUrl);
        console.log('Mobile Weapons Count:', f.mobileWeapons?.length);
        if (f.mobileWeapons) {
            console.log('Sample MWs:', f.mobileWeapons.slice(0, 50));
        }
        console.log('Forces count:', f.forces?.length);
        if (f.forces) {
            f.forces.forEach((force: any) => {
                console.log(`- ${force.name}`);
                console.log(`  URL: ${force.url}`);
                console.log(`  Image: ${force.imageUrl}`);
            });
        }
    }
    process.exit();
};
debug();
