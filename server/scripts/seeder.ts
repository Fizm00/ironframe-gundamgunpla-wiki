import mongoose from 'mongoose';
import dotenv from 'dotenv';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { connectDB } from './config/db';
import { MobileSuit } from './models/MobileSuit';
import { Pilot } from './models/Pilot';
import redis from './config/redis';

dotenv.config();

const scrapeGunplaDB = async () => {
    try {
        await connectDB();

        console.log('Clearing existing data...');
        await MobileSuit.deleteMany();
        await Pilot.deleteMany();

        console.log('Clearing Redis Cache...');
        const keys = await redis.keys('mobile-suits:*');
        if (keys.length > 0) await redis.del(keys);
        await redis.del('mobile-suits:all');

        const maxPages = 50;
        console.log(`Mulai Scraping dari gunpladb.net (Halaman Maks: ${maxPages})...`);

        const genericPilot = await Pilot.create({
            name: "Unknown Pilot",
            status: "Active",
            description: "Standard generic pilot assigned to this unit."
        });

        for (let page = 1; page <= maxPages; page++) {
            const url = `https://gunpladb.net/database.html?page=${page}`;
            console.log(`Fetching Page ${page}: ${url}`);

            const { data: html } = await axios.get(url, {
                headers: {
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
                }
            });

            const $ = cheerio.load(html);
            const items = $('.gunpla__item');

            if (items.length === 0) {
                console.log("No items found on this page. Stopping.");
                break;
            }

            console.log(`Found ${items.length} items on page ${page}. Processing...`);

            for (const element of items) {
                const $el = $(element);

                // Extract Data
                // Name: h4 inside .gunpla__content-top
                const rawName = $el.find('.gunpla__content-top h4').text().trim();

                // Description: paragraph immediately after .gunpla__content-top
                const description = $el.find('.gunpla__content-top').next('p').text().trim();

                // Release Date: .gunpla__meta-date span
                // Format usually: "Release : December 2025"
                let releaseDate = $el.find('.gunpla__meta-date span').text().replace('Release :', '').trim();

                // Grade: Find the col containing "Grade" text, then get the sibling col's strong text
                let grade = "";
                // Try finding the row that has "Grade" in it
                const gradeRow = $el.find('.row').filter((_, row) => $(row).text().includes('Grade'));
                if (gradeRow.length > 0) {
                    grade = gradeRow.find('strong').text().trim();
                }
                // Fallback: Check if name starts with grade like "MG ", "RG "
                if (!grade) {
                    if (rawName.startsWith('MG ')) grade = 'MG';
                    else if (rawName.startsWith('RG ')) grade = 'RG';
                    else if (rawName.startsWith('HG ')) grade = 'HG';
                    else if (rawName.startsWith('PG ')) grade = 'PG';
                    else if (rawName.startsWith('EG ')) grade = 'EG';
                    else if (rawName.includes('SD')) grade = 'SD';
                }

                let imgUrl = $el.find('.gunpla__thumb img').attr('src');
                if (imgUrl && !imgUrl.startsWith('http')) {
                    imgUrl = `https://gunpladb.net${imgUrl}`;
                }

                let cleanName = rawName;
                let modelNumber = `GUNPLA-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

                let manufacturer = "Bandai";

                try {
                    const count = await MobileSuit.countDocuments({ modelNumber });
                    if (count > 0) modelNumber += `-${count}`;

                    await MobileSuit.create({
                        name: rawName || "Unknown Unit",
                        modelNumber: modelNumber,
                        manufacturer: manufacturer,
                        description: description || `Imported from GunplaDB. ${rawName}`,
                        imageUrl: imgUrl || "",
                        grade: grade || "Unknown",
                        releaseDate: releaseDate || "Unknown",
                        pilots: [genericPilot._id],
                        height: parseFloat((16 + Math.random() * 8).toFixed(1)),
                        weight: parseFloat((30 + Math.random() * 40).toFixed(1)),
                        powerOutput: Math.floor(1000 + Math.random() * 3000),
                        armor: "Plastic Model Kit (Polystyrene)"
                    } as any);
                } catch (err) {
                    console.warn(`Skipping duplicate or error: ${rawName}`);
                }
            }
        }

        console.log('Scraping Completed Successfully!');
        await redis.quit();
        process.exit();
    } catch (error) {
        console.error(`Fatal error: ${error}`);
        await redis.quit();
        process.exit(1);
    }
};

scrapeGunplaDB();
