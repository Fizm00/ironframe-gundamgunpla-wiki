import axios from 'axios';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LoreCharacter } from '../src/models/LoreCharacter';

dotenv.config();

const BASE_URL = 'https://gundam.fandom.com';
const START_URL = 'https://gundam.fandom.com/wiki/Category:Characters';

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

async function scrapeCharacters() {
    await connectDB();
    console.log('--- STARTING CHARACTER SEEDER ---');

    let nextUrl: string | null = START_URL;
    const visitedUrls = new Set<string>();
    let totalProcessed = 0;

    const MAX_CHARACTERS = 3000;

    while (nextUrl && totalProcessed < MAX_CHARACTERS) {
        console.log(`\nScanning Category Page: ${nextUrl}`);

        try {
            const { data: catHtml } = await axios.get(nextUrl);
            const $cat = cheerio.load(catHtml);

            const characterLinks: string[] = [];

            $cat('.category-page__member-link').each((_: number, el: any) => {
                const href = $cat(el).attr('href');
                if (href && !href.includes('Category:') && !href.includes('User:') && !visitedUrls.has(href)) {
                    characterLinks.push(BASE_URL + href);
                    visitedUrls.add(href);
                }
            });

            console.log(`   Found ${characterLinks.length} new characters.`);

            for (const charUrl of characterLinks) {
                if (totalProcessed >= MAX_CHARACTERS) break;

                console.log(`   [${totalProcessed + 1}] Scraping: ${charUrl}`);

                try {
                    const { data: charHtml } = await axios.get(charUrl);
                    const $ = cheerio.load(charHtml);
                    const imageUrl = $('.portable-infobox .pi-image-thumbnail').attr('src')?.split('/revision')[0] || '';

                    $('script, style, img, figure, video, audio, .gallery, .thumb, .wikia-gallery-item, .reference, .noprint').remove();

                    const name = $('#firstHeading').text().trim();

                    let intro = '';
                    const $paragraphs = $('#mw-content-text > .mw-parser-output > p');

                    for (let i = 0; i < $paragraphs.length; i++) {
                        const text = $($paragraphs[i]).text().trim();
                        if (text.length > 50 && !text.includes('Aside')) {
                            intro = text;
                            break;
                        }
                    }
                    if (!intro) intro = $('#mw-content-text p').first().text().trim();

                    const extractSection = (regex: RegExp) => {
                        let content = '';
                        const $header = $('h2, h3').filter((_: number, el: any) => regex.test($(el).text()));
                        if ($header.length) {
                            let next = $header.next();
                            while (next.length && !['h2', 'h3'].includes((next.prop('tagName') || '').toLowerCase())) {
                                if (next.is('p')) content += next.text().trim() + '\n\n';
                                if (next.is('ul')) {
                                    next.find('li').each((_: number, li: any) => {
                                        content += '• ' + $(li).text().trim() + '\n';
                                    });
                                    content += '\n';
                                }
                                next = next.next();
                            }
                        }
                        return content.trim();
                    };

                    const history = extractSection(/History|Biography/i);
                    const personality = extractSection(/Personality|Character/i);
                    const skills = extractSection(/Skills|Abilities|Capabilities/i);
                    const notes = extractSection(/Notes|Trivia|Novelization/i);

                    const profile: Record<string, string> = {};
                    $('.portable-infobox .pi-data').each((_: number, el: any) => {
                        const label = $(el).find('.pi-data-label').text().trim();
                        const value = $(el).find('.pi-data-value').text().trim();
                        if (label && value) profile[label] = value;
                    });

                    const mecha: string[] = [];
                    const vehicles: string[] = [];

                    const extractList = (headerText: string, targetList: string[]) => {
                        const $h = $('h2, h3').filter((_: number, el: any) => $(el).text().includes(headerText));
                        if ($h.length) {
                            let next = $h.next();
                            while (next.length && !['h2', 'h3'].includes((next.prop('tagName') || '').toLowerCase())) {
                                if (next.is('ul')) {
                                    next.find('li').each((_: number, li: any) => {
                                        targetList.push($(li).text().replace(/\[.*?\]/g, '').trim());
                                    });
                                }
                                next = next.next();
                            }
                        }
                    };

                    extractList('Mecha', mecha);
                    extractList('Vehicles', vehicles);

                    await LoreCharacter.findOneAndUpdate(
                        { url: charUrl },
                        {
                            name,
                            url: charUrl,
                            description: intro,
                            history,
                            personality,
                            skills,
                            notes,
                            profile,
                            mecha,
                            vehicles,
                            imageUrl
                        },
                        { upsert: true, new: true }
                    );

                    totalProcessed++;
                    await delay(200);

                } catch (err: any) {
                    console.error(`   Failed to scrape character ${charUrl}: ${err.message}`);
                }
            }

            const $nextBtn = $cat('.category-page__pagination-next');
            if ($nextBtn.length) {
                nextUrl = $nextBtn.attr('href') || null;
            } else {
                nextUrl = null;
            }

        } catch (err: any) {
            console.error(`Failed to process category page: ${err.message}`);
            nextUrl = null;
        }
    }

    console.log('--- CHARACTER SEEDING COMPLETED ---');
    process.exit();
}

scrapeCharacters();
