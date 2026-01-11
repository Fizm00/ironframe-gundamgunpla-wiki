
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LoreCharacter } from '../src/models/LoreCharacter';

dotenv.config();

const checkImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('Connected to MongoDB');

        const total = await LoreCharacter.countDocuments();
        const withImage = await LoreCharacter.countDocuments({ imageUrl: { $ne: '' } });
        const withoutImage = await LoreCharacter.countDocuments({ imageUrl: '' });
        const nullImage = await LoreCharacter.countDocuments({ imageUrl: null });
        const undefinedImage = await LoreCharacter.countDocuments({ imageUrl: { $exists: false } });

        console.log(`Total Characters: ${total}`);
        console.log(`With Image: ${withImage}`);
        console.log(`Empty String Image: ${withoutImage}`);
        console.log(`Null Image: ${nullImage}`);
        console.log(`Undefined Image: ${undefinedImage}`);

        // Sample some without images
        if (withoutImage > 0) {
            const sample = await LoreCharacter.findOne({ imageUrl: '' }).select('name url');
            console.log('Sample without image:', sample);
        }

        process.exit();
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

checkImages();
