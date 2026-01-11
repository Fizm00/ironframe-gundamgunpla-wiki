import mongoose from 'mongoose';
import * as cheerio from 'cheerio';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const LoreMobileSuitSchema = new mongoose.Schema({
    name: String,
    url: String,
    imageUrl: String
}, { strict: false });

const LoreMobileSuit = mongoose.model('LoreMobileSuit', LoreMobileSuitSchema);

const fetchImage = async (url: string): Promise<string | null> => {
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $ = cheerio.load(data);

        let img = $('meta[property="og:image"]').attr('content');
        if (img) return img.split('/revision')[0];

        img = $('.portable-infobox .pi-image-thumbnail').attr('src');
        if (img) return img;

        img = $('.portable-infobox figure.pi-image img').attr('src');
        if (img) return img;

        img = $('.infobox img').first().attr('src');
        if (img) return img;

        return null;
    } catch (e: any) {
        return null;
    }
};

const patchLoreImages = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gundam-wiki');

        // Find documents that need patching: Legacy URL or No Image
        const targets = await LoreMobileSuit.find({
            $or: [
                { url: { $regex: 'mechabay', $options: 'i' } },
                { imageUrl: { $exists: false } },
                { imageUrl: '' },
                { imageUrl: null }
            ]
        });

        console.log(`Found ${targets.length} LoreMobileSuit entries to check/patch.`);

        let updated = 0;
        let skipped = 0;

        for (const suit of targets) {
            // Construct Fandom URL
            const cleanName = suit.name
                ?.replace(/ \(.*?\)/, '') // Remove (Thunderbolt Ver)
                .replace(/ - .*/, '')      // Remove - Description
                .trim()
                .replace(/ /g, '_');

            if (!cleanName) continue;

            const fandomUrl = `https://gundam.fandom.com/wiki/${encodeURIComponent(cleanName)}`;

            // console.log(`Checking ${suit.name} -> ${fandomUrl}`);

            let newImage = null;
            let finalUrl = null;

            // Check if URL works
            try {
                // Try fetching image directly from constructed URL
                newImage = await fetchImage(fandomUrl);
                if (newImage) {
                    finalUrl = fandomUrl;
                } else {
                    // Try with original full name if clean name failed?
                    const rawName = suit.name?.trim().replace(/ /g, '_');
                    const rawUrl = `https://gundam.fandom.com/wiki/${encodeURIComponent(rawName || '')}`;
                    newImage = await fetchImage(rawUrl);
                    if (newImage) finalUrl = rawUrl;
                }
            } catch (e) {
                // Ignore
            }

            if (newImage) {
                suit.imageUrl = newImage;
                if (finalUrl) suit.url = finalUrl;
                try {
                    await suit.save();
                    updated++;
                    console.log(`[FIXED] ${suit.name} -> Img: ${newImage.substring(0, 30)}...`);
                } catch (err: any) {
                    if (err.code === 11000) {
                        console.log(`[DUPLICATE] ${suit.name} conflicts with existing entry. Deleting legacy entry.`);
                        await LoreMobileSuit.deleteOne({ _id: suit._id });
                    }
                }
            } else {
                skipped++;
                // console.log(`[SKIP] Could not find image for ${suit.name}`);
            }

            await new Promise(r => setTimeout(r, 200)); // Rate limit
        }

        console.log(`Done. Updated: ${updated}, Skipped: ${skipped}`);
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

patchLoreImages();
