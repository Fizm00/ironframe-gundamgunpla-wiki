import mongoose from 'mongoose';
import * as cheerio from 'cheerio';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const FactionSchema = new mongoose.Schema({
    name: String,
    url: String,
    imageUrl: String,
    activeEra: String,
    forces: [{
        name: String,
        url: String,
        imageUrl: String,
        teams: [String],
    }]
}, { strict: false });

const Faction = mongoose.model('Faction', FactionSchema);

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/gundam-wiki';

const fetchImage = async (url: string): Promise<string | null> => {
    try {
        const { data } = await axios.get(url, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' },
            timeout: 10000
        });
        const $ = cheerio.load(data);

        let img = $('meta[property="og:image"]').attr('content');
        if (img) return img.split('/revision')[0];

        img = $('.portable-infobox .pi-image-thumbnail').attr('src');
        if (img) return img;

        img = $('.infobox img').first().attr('src');
        if (img) return img;

        return null;
    } catch (e: any) {
        return null;
    }
};

const patchImages = async () => {
    try {
        console.log('Connecting to DB...');
        await mongoose.connect(MONGO_URI);
        console.log('Connected.');

        const factions = await Faction.find({});
        console.log(`Found ${factions.length} factions.`);

        let totalUpdated = 0;

        for (const faction of factions) {
            let factionUpdated = false;
            console.log(`Checking Faction: ${faction.name} (${faction.forces.length} forces)`);

            // --- PATCH MAIN FACTION URL & IMAGE ---
            let factionUrl = faction.url;
            if (!factionUrl && faction.name) {
                const guessedUrl = `https://gundam.fandom.com/wiki/${encodeURIComponent(faction.name.replace(/ /g, '_'))}`;
                try {
                    const { status } = await axios.head(guessedUrl, { timeout: 5000 });
                    if (status === 200) {
                        factionUrl = guessedUrl;
                        faction.url = factionUrl;
                        factionUpdated = true;
                        console.log(`    > RESTORED MAIN FACTION URL`);
                    }
                } catch (e) {
                    // console.log('    X Main Faction Guess failed.');
                }
            }

            if (factionUrl && !faction.imageUrl) {
                console.log(`  > Fetching MAIN image for: ${faction.name}`);
                const newImage = await fetchImage(factionUrl);
                if (newImage) {
                    faction.imageUrl = newImage;
                    factionUpdated = true;
                    console.log(`    + Found Main Image: ${newImage.substring(0, 50)}...`);
                }
            }
            // -------------------------------------

            for (const force of faction.forces) {
                let targetUrl = force.url;

                // 1. Try to guess URL if missing
                if (!targetUrl && force.name) {
                    const guessedUrl = `https://gundam.fandom.com/wiki/${encodeURIComponent(force.name.replace(/ /g, '_'))}`;
                    console.log(`  ? Missing URL for ${force.name}, guessing: ${guessedUrl}`);
                    try {
                        const { status } = await axios.head(guessedUrl, { timeout: 5000 });
                        if (status === 200) {
                            targetUrl = guessedUrl;
                            force.url = targetUrl;
                            factionUpdated = true;
                            console.log(`    > RESTORED URL`);
                        }
                    } catch (e) {
                        console.log('    X Guess failed, skipping.');
                    }
                }

                // 2. Fetch Image if we have a URL (existing or restored)
                if (targetUrl && !force.imageUrl) {
                    console.log(`  > Fetching image for Force: ${force.name}`);
                    const newImage = await fetchImage(targetUrl);
                    if (newImage) {
                        force.imageUrl = newImage;
                        factionUpdated = true;
                        console.log(`    + Found: ${newImage.substring(0, 50)}...`);
                    } else {
                        console.log(`    - No image found.`);
                    }
                    await new Promise(r => setTimeout(r, 500));
                }
            }

            if (factionUpdated) {
                faction.markModified('forces');
                await faction.save();
                totalUpdated++;
                console.log(`  [SAVED] Faction ${faction.name} updated.`);
            }
        }

        console.log(`Done! Updated ${totalUpdated} factions.`);
        process.exit(0);
    } catch (error) {
        console.error('Script Failed:', error);
        process.exit(1);
    }
};

patchImages();
