// @ts-nocheck
import axios from 'axios';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Pilot } from '../src/models/Pilot';
import { Faction } from '../src/models/Faction';

dotenv.config();

const BASE_URL = 'https://gundam.fandom.com';
const START_URL = 'https://gundam.fandom.com/wiki/Category:Gundam_Pilots';

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || '');
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
};

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

async function scrapeRealPilots() {
    await connectDB();
    console.log('--- STARTING REAL PILOT SCRAPER ---');

    await Pilot.deleteMany({});
    console.log('Cleared existing/dummy pilots.');

    let nextUrl: string | null = START_URL;
    const visitedUrls = new Set<string>();
    let totalProcessed = 0;
    const MAX_PILOTS = 100; // Limit for initial run to ensure speed

    // Pre-fetch factions for matching
    const factions = await Faction.find();
    console.log(`Loaded ${factions.length} factions for matching.`);

    while (nextUrl && totalProcessed < MAX_PILOTS) {
        console.log(`\nScanning Category Page: ${nextUrl}`);

        try {
            const { data: catHtml }: { data: any } = await axios.get(nextUrl);
            const $cat = cheerio.load(catHtml);

            const characterLinks: string[] = [];
            $cat('.category-page__member-link').each((_: number, el: any) => {
                const href = $cat(el).attr('href');
                if (href && !href.includes('Category:') && !href.includes('User:') && !visitedUrls.has(href)) {
                    characterLinks.push(BASE_URL + href);
                    visitedUrls.add(href);
                }
            });

            console.log(`   Found ${characterLinks.length} potential pilots.`);

            for (const charUrl of characterLinks) {
                if (totalProcessed >= MAX_PILOTS) break;

                try {
                    const { data: charHtml }: { data: any } = await axios.get(charUrl);
                    const $ = cheerio.load(charHtml);

                    const name = $('.portable-infobox .pi-title').text().trim() || $('#firstHeading').text().trim();
                    let imageUrl = $('.portable-infobox .pi-image-thumbnail').attr('src') || '';
                    if (!imageUrl) imageUrl = $('.portable-infobox figure.pi-image img').attr('src') || '';

                    // Get Description
                    let description = '';
                    $('#mw-content-text > .mw-parser-output > p').each((i: number, el: any) => {
                        const text = $(el).text().trim();
                        if (text.length > 50 && !text.includes('Aside')) {
                            if (!description) description = text;
                        }
                    });

                    // Extract Allegiance/Faction
                    let allegianceRaw = '';
                    $('.portable-infobox .pi-data').each((_: number, el: any) => {
                        const label = $(el).find('.pi-data-label').text().trim();
                        if (/Allegiance|Affiliation|Organization|Team/i.test(label)) {
                            allegianceRaw = $(el).find('.pi-data-value').text().trim();
                        }
                    });

                    // Match Faction
                    let matchedFactionId = null;
                    if (allegianceRaw) {
                        // Simple fuzzy matching
                        const potentialFactions = allegianceRaw.split(',').map(s => s.trim());

                        for (const pot of potentialFactions) {
                            const match = factions.find(f =>
                                f.name.toLowerCase().includes(pot.toLowerCase()) ||
                                pot.toLowerCase().includes(f.name.toLowerCase())
                            );
                            if (match) {
                                matchedFactionId = match._id;
                                console.log(`   Matched Faction: "${pot}" -> ${match.name}`);
                                break;
                            }
                        }
                    }

                    if (matchedFactionId) {
                        await Pilot.findOneAndUpdate(
                            { name }, // filter
                            {
                                name,
                                description,
                                imageUrl,
                                faction: matchedFactionId,
                                status: 'Active', // Default
                                callsign: 'Unknown', // Hard to scrape robustly without specific parsing
                                age: 20 // Default/Unknown
                            },
                            { upsert: true, new: true }
                        );
                        console.log(`   [${totalProcessed + 1}] Saved Pilot: ${name}`);
                        totalProcessed++;
                    } else {
                        console.log(`   [Skip] No faction match for ${name} (Raw: ${allegianceRaw})`);
                    }

                    await delay(500);

                } catch (err: any) {
                    console.error(`   Error scraping ${charUrl}: ${err.message}`);
                }
            }

            // Next Page Pagination
            const $nextBtn = $cat('.category-page__pagination-next');
            if ($nextBtn.length) {
                nextUrl = $nextBtn.attr('href') || null;
            } else {
                nextUrl = null;
            }

        } catch (err) {
            console.error('Category page error:', err);
            nextUrl = null;
        }
    }

    console.log('--- SCRAPING COMPLETED ---');
    process.exit();
}

scrapeRealPilots();
