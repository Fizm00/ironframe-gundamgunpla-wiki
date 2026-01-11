import axios from 'axios';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LoreMobileSuit } from '../src/models/LoreMobileSuit';

dotenv.config();

const SERIES_URL = 'https://gundam.fandom.com/wiki/Gundam_Wiki:Series';
const BASE_URL = 'https://gundam.fandom.com';

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

async function scrapeSeriesReverse() {
    await connectDB();
    console.log('--- STARTING REVERSE SERIES SEEDER ---');

    console.log(`Fetching Canonical Series List from ${SERIES_URL}...`);
    const canonicalSeries: { name: string, url: string }[] = [];

    try {
        const { data: seriesHtml } = await axios.get(SERIES_URL);
        const $series = cheerio.load(seriesHtml);

        $series('.mw-parser-output ul li a').each((_, el) => {
            const $el = $series(el);
            // Same filters as before
            if ($el.closest('#toc').length > 0) return;
            if ($el.closest('.navbox').length > 0) return;

            const txt = $el.text().trim();
            const href = $el.attr('href');

            if (txt && href && href.startsWith('/wiki/') &&
                !txt.includes('User:') && !txt.includes('Talk:') && txt.length > 2) {

                // Exclude some obviously non-series pages if any remain (though the page is pretty clean)
                if (!canonicalSeries.find(s => s.name === txt)) {
                    canonicalSeries.push({ name: txt, url: BASE_URL + href });
                }
            }
        });
        console.log(`Loaded ${canonicalSeries.length} canonical series pages.`);
    } catch (e) {
        console.error('Failed to load series list.');
        process.exit(1);
    }

    let totalUpdated = 0;

    for (const [index, series] of canonicalSeries.entries()) {
        console.log(`\n[${index + 1}/${canonicalSeries.length}] Processing Series: ${series.name}`);

        try {
            const { data: pageHtml } = await axios.get(series.url);
            const $ = cheerio.load(pageHtml);

            // Find lists of Mobile Suits
            // Typically under headers like "Mobile Weapons", "Mecha", "Mobile Suit", "Gundam"
            const suitsToUpdate: string[] = [];

            $('h2, h3').each((_, el) => {
                const $header = $(el);
                const headerText = $header.text().trim();

                if (/Mobile Weapons|Mecha|Mobile Suit|Gundam|Machines|Units/i.test(headerText) &&
                    !headerText.includes('Contents') && !headerText.includes('Gallery') && !headerText.includes('Model')) {

                    const tagName = $header.prop('tagName')?.toLowerCase() || '';
                    const stopSelector = tagName === 'h3' ? 'h2, h3' : 'h2';

                    let next = $header.next();
                    while (next.length && !next.is(stopSelector)) {

                        const extractFromList = ($list: cheerio.Cheerio<any>) => {
                            $list.find('li').each((_, li) => {
                                // Extract text, remove any bracketed notes like [1] or (Gundam Name)
                                // We want the Primary Name. Sometimes it is "GAT-X105 Strike Gundam"
                                // Sometimes "Strike Gundam".
                                const $li = $(li);
                                let text = $li.text().replace(/\[.*?\]/g, '').trim();

                                // Sometimes the link is the best source of the "Full Name"
                                const $a = $li.find('a').first();
                                if ($a.length) {
                                    // Use the link title if available as it's often the full name
                                    // But sometimes the text is better.
                                    // Let's rely on the text content first, as it usually lists the specific unit.
                                    // However, clean up " - some description"
                                    text = text.split(' - ')[0].trim();
                                    text = text.split(' – ')[0].trim(); // en-dash
                                }

                                if (text.length > 3) suitsToUpdate.push(text);
                            });
                        };

                        if (next.is('ul')) {
                            extractFromList(next);
                        } else if (next.find('.tabbertab').length) {
                            next.find('.tabbertab').each((_, tab) => {
                                extractFromList($(tab).find('ul'));
                            });
                        } else if (next.is('table')) {
                            // Sometimes they are in tables? Rare for main lists, but possible.
                            // Sticking to lists for now as per "List of Gundams"
                        }

                        next = next.next();
                    }
                }
            });

            console.log(`   Found ${suitsToUpdate.length} potential suits/mecha.`);

            if (suitsToUpdate.length > 0) {
                // Batch Update DB
                // We need to match these names against the DB 'name' or alias.
                // Using regex for flexibility.

                let updatedCount = 0;
                for (const suitName of suitsToUpdate) {
                    // Escape regex special chars
                    const safeName = suitName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

                    // Match Exact or "Contains" if long enough?
                    // Be careful not to match "Strike Gundam" to "Strike Freedom Gundam" indiscriminately.
                    // Strict match on name is safest.

                    const pattern = new RegExp(`^${safeName}$`, 'i');

                    // 1. Exact Match
                    let match = await LoreMobileSuit.findOne({ name: pattern });

                    // 2. Suffix Match (e.g. DB: "ZGMF-X20A Strike Freedom" vs List: "Strike Freedom")
                    if (!match) {
                        const suffixPattern = new RegExp(`${safeName}$`, 'i');
                        match = await LoreMobileSuit.findOne({ name: suffixPattern });
                    }

                    // 3. Contains Match (Broad fallback for "Gundam Exia" -> "GN-001 Gundam Exia")
                    if (!match) {
                        if (suitName.split(' ').length >= 2) {
                            const containsPattern = new RegExp(safeName, 'i');
                            match = await LoreMobileSuit.findOne({ name: containsPattern });
                        }
                    }

                    if (match) {
                        if (match.series !== series.name) {
                            match.series = series.name;
                            await match.save();
                            console.log(`   -> UPDATED: ${match.name} => ${series.name}`);
                            updatedCount++;
                        }
                    }
                }
                console.log(`   Updated ${updatedCount} entries.`);
                totalUpdated += updatedCount;
            }

        } catch (err: any) {
            console.error(`   Failed to process series page: ${err.message}`);
        }

        await delay(500); // polite delay
    }

    console.log('--- REVERSE SEEDING COMPLETED ---');
    console.log(`Total Updates: ${totalUpdated}`);
    process.exit();
}

scrapeSeriesReverse();
