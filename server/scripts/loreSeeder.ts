import axios from 'axios';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LoreMobileSuit } from './models/LoreMobileSuit';

dotenv.config();

const BASE_URL = 'https://mechabay.com';
const LIST_URL = 'https://mechabay.com/universal-century-mecha';

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

async function scrapeLore() {
    await connectDB();

    console.log('--- STARTING MECHABAY SCRAPER ---');

    try {
        await LoreMobileSuit.deleteMany({});
        console.log('Cleared existing LoreMobileSuit collection.');
    } catch (e) {
        console.log('Cleanup error:', e);
    }

    try {
        // 1. Get the list of mecha
        console.log(`Fetching list from ${LIST_URL}...`);
        const { data: listHtml } = await axios.get(LIST_URL, {
            headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
        });
        const $list = cheerio.load(listHtml);

        const links: { name: string, url: string, series: string }[] = [];

        // Mechabay structure update check
        // Often links are just in p tags following headers
        const seriesHeaders = $list('h2');
        console.log(`Found ${seriesHeaders.length} series headers.`);

        seriesHeaders.each((_, h2) => {
            const seriesName = $list(h2).text().trim();
            // console.log(`Processing series: ${seriesName}`);

            let next = $list(h2).next();
            // Iterate siblings until the next H2
            while (next.length && !next.is('h2')) {
                // Find links ONLY within the grid (the cards)
                // This targets <div class="grid ..."> <a ...>
                next.find('.grid a').each((_, a) => {
                    const el = $list(a);
                    const name = el.text().trim();
                    const url = el.attr('href');

                    if (name && url && (url.includes('mechabay.com') || url.startsWith('/')) && !name.toLowerCase().includes('view all') && !url.includes('/category/')) {
                        const fullUrl = url.startsWith('http') ? url : `https://mechabay.com${url}`;
                        links.push({ name, url: fullUrl, series: seriesName });
                    }
                });

                next = next.next();
            }
        });

        console.log(`Found ${links.length} potential Mobile Suits.`);

        // Limit for testing? No, user wants data. But let's batch or just run it.
        // Let's do a subset first or handling one by one.
        for (const [index, link] of links.entries()) {
            // Check if exists
            const exists = await LoreMobileSuit.findOne({ url: link.url });
            if (exists) {
                console.log(`[${index + 1}/${links.length}] Skipping (Exists): ${link.name}`);
                continue;
            }

            console.log(`[${index + 1}/${links.length}] Scraping: ${link.name}`);
            try {
                const { data: detailHtml } = await axios.get(link.url, {
                    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
                });
                const $ = cheerio.load(detailHtml);

                const getSectionText = (headerText: string): string => {
                    const header = $('h1, h2, h3, h4').filter((_, el) => $(el).text().trim().includes(headerText)).first();
                    if (!header.length) return '';

                    let content = '';
                    let next = header.next();
                    while (next.length && !next.is('h1, h2, h3')) {
                        content += next.text() + '\n\n';
                        next = next.next();
                    }
                    return content.trim();
                };

                const getSidebarList = (headerText: string): string[] => {
                    // Find h3 with the text inside the sidebar container (or just generally, but sidebar is safer)
                    // The sidebar h3s are "text-base uppercase text-center mb-8" usually
                    const h3 = $('h3').filter((_, el) => $(el).text().trim().toLowerCase() === headerText.toLowerCase()).first();
                    if (!h3.length) return [];

                    const nextDl = h3.next('dl');
                    if (!nextDl.length) return [];

                    const items: string[] = [];
                    nextDl.find('dt').each((_, dt) => {
                        const key = $(dt).text().trim();
                        const dd = $(dt).next('dd');
                        let value = dd.text().trim().replace(/\s+/g, ' '); // Clean excessive whitespace
                        items.push(`${key}: ${value}`);
                    });
                    return items;
                };

                const getSectionList = (headerText: string): string[] => {
                    const header = $('h2, h3').filter((_, el) => $(el).text().trim().toLowerCase().includes(headerText.toLowerCase())).first();
                    if (!header.length) return [];

                    const list: string[] = [];
                    let next = header.next();
                    let steps = 0;
                    while (next.length && steps < 5) {
                        if (next.is('ul')) {
                            next.find('li').each((_, li) => list.push($(li).text().trim()));
                            break;
                        }
                        next = next.next();
                        steps++;
                    }
                    return list;
                };

                const getSidebarMap = (headerText: string): Record<string, string> => {
                    const h3 = $('h3').filter((_, el) => $(el).text().trim().toLowerCase() === headerText.toLowerCase()).first();
                    if (!h3.length) return {};

                    const nextDl = h3.nextAll('dl').first();
                    if (!nextDl.length) return {};

                    const map: Record<string, string> = {};
                    nextDl.find('dt').each((_, dt) => {
                        const key = $(dt).text().trim();
                        const dd = $(dt).next('dd');
                        let value = dd.text().trim().replace(/\s+/g, ' ');
                        map[key] = value;
                    });
                    return map;
                };

                const getSidebarText = (headerText: string): string => {
                    const h3 = $('h3').filter((_, el) => $(el).text().trim().toLowerCase() === headerText.toLowerCase()).first();
                    if (!h3.length) return '';

                    const nextDl = h3.nextAll('dl').first();
                    if (!nextDl.length) return '';

                    const items: string[] = [];
                    nextDl.find('dt').each((_, dt) => {
                        const key = $(dt).text().trim();
                        const dd = $(dt).next('dd');
                        let value = dd.text().trim().replace(/\s+/g, ' ');
                        items.push(`${key}: ${value}`);
                    });
                    return items.join('\n');
                };

                // Armaments specific (nested lists in sidebar sometimes?)
                // The structure for Armaments in sidebar is:
                // dt: Fixed -> dd: ul -> li
                // Let's return a structured array: { category: string, items: string[] }[]
                const getSidebarListComplex = (headerText: string): { category: string; items: string[] }[] => {
                    const headers = $('h3').filter((_, el) => $(el).text().trim().toLowerCase() === headerText.toLowerCase());
                    if (!headers.length) return [];

                    let bestResult: { category: string; items: string[] }[] = [];

                    // Iterate through all matching headers to find the one with the correct structure
                    headers.each((_, headerEl) => {
                        if (bestResult.length > 0) return false; // Stop if found

                        const h3 = $(headerEl);
                        const nextEl = h3.nextAll();
                        const result: { category: string; items: string[] }[] = [];

                        // Case 1: Structured DL (Fixed, Handheld, etc)
                        const nextDl = h3.nextAll('dl').first();
                        // Check if DL is the immediate next relevant element (ignoring spacers)
                        if (nextDl.length && h3.nextUntil('dl').length < 3) {
                            nextDl.find('dt').each((_, dt) => {
                                const category = $(dt).text().trim();
                                const dd = $(dt).next('dd');
                                const currentItems: string[] = [];

                                const ul = dd.find('ul');
                                if (ul.length) {
                                    ul.find('li').each((_, li) => currentItems.push($(li).text().trim()));
                                } else {
                                    const text = dd.text().trim();
                                    if (text) currentItems.push(text);
                                }

                                if (currentItems.length > 0) result.push({ category, items: currentItems });
                            });
                        }

                        // Case 2: Flat List (Direct UL after H3)
                        if (result.length === 0) {
                            const nextUl = h3.nextAll('ul').first();
                            if (nextUl.length && h3.nextUntil('ul').length < 3) {
                                const currentItems: string[] = [];
                                nextUl.find('li').each((_, li) => currentItems.push($(li).text().trim()));
                                if (currentItems.length > 0) {
                                    result.push({ category: 'Standard', items: currentItems });
                                }
                            }
                        }

                        if (result.length > 0) {
                            bestResult = result;
                        }
                    });

                    return bestResult;
                };

                // Image
                const imageUrl = $('figure.wp-block-image img').first().attr('src') || '';

                // Description (First paragraph usually)
                let description = '';
                const entryContent = $('.entry-content');
                if (entryContent.length) {
                    description = entryContent.find('p').first().text().trim();
                }

                // Data Object
                const loreData = {
                    name: link.name,
                    series: link.series,
                    url: link.url,
                    imageUrl,
                    description,
                    history: getSectionText('History'),
                    design: getSectionText('Design'),
                    production: getSidebarList('Production'),
                    development: getSidebarList('Development'),
                    specifications: getSidebarMap('Specifications'),
                    performance: getSidebarText('Performance'),
                    armaments: getSidebarListComplex('Armaments'),
                    variants: getSectionList('Variants'),
                    knownPilots: getSectionList('Known pilots'),
                    appearances: getSectionList('Appearances'),
                    behindTheScenes: getSectionText('Behind the scenes'),
                };

                await LoreMobileSuit.create(loreData);
                console.log(`   -> Saved!`);

            } catch (err: any) {
                console.error(`   -> Failed to scrape ${link.url}: ${err.message}`);
            }

            await delay(1000); // Be nice to the server
        }

        console.log('--- SCRAPING COMPLETED ---');
        process.exit();

    } catch (error) {
        console.error("Scraping fatal error:", error);
        process.exit(1);
    }
}

scrapeLore();
