import mongoose from 'mongoose';
import * as cheerio from 'cheerio';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { Timeline } from '../src/models/Timeline';
import { TimelineEvent } from '../src/models/TimelineEvent';

dotenv.config({ path: path.join(__dirname, '../.env') });

const MAIN_URL = 'https://gundam.fandom.com/wiki/Gundam_Wiki:Timelines';
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36';

const connectDB = async () => {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gundam-wiki');
    console.log('MongoDB Connected');
};

const scrapeTimelines = async () => {
    try {
        await connectDB();

        console.log(`Fetching Main Page: ${MAIN_URL}`);
        const { data: mainData } = await axios.get(MAIN_URL, { headers: { 'User-Agent': USER_AGENT } });
        const $ = cheerio.load(mainData);

        // Map of known timelines to scrape (Name -> Order priority)
        // We can also extract this dynamically, but a list ensures we get the "Main" ones.
        const TARGET_TIMELINES = [
            { name: "Universal Century", order: 1 },
            { name: "Future Century", order: 2 },
            { name: "After Colony", order: 3 },
            { name: "After War", order: 4 },
            { name: "Correct Century", order: 5 },
            { name: "Cosmic Era", order: 6 },
            { name: "Anno Domini", order: 7 },
            { name: "Advanced Generation", order: 8 },
            { name: "Regild Century", order: 9 },
            { name: "Post Disaster", order: 10 },
            { name: "Ad Stella", order: 11 }
        ];

        for (const target of TARGET_TIMELINES) {
            console.log(`\n--- Processing ${target.name} ---`);

            // Find link
            const $link = $(`.mw-parser-output h2 span.mw-headline:contains('${target.name}')`).parent().next().find('a').first();
            let url = $link.attr('href');

            // Fallback: If structure is different or link not found immediately
            if (!url) {
                // Try finding any link with text matching the name
                const directLink = $(`a:contains('${target.name}')`).filter((i, el) => $(el).attr('title')?.includes(target.name) || false).first();
                url = directLink.attr('href');
            }

            if (!url) {
                console.log(`! Could not find URL for ${target.name}`);
                continue;
            }

            const fullUrl = url.startsWith('http') ? url : `https://gundam.fandom.com${url}`;
            console.log(`URL: ${fullUrl}`);

            // Fetch Detail Page
            const { data: detailData } = await axios.get(fullUrl, { headers: { 'User-Agent': USER_AGENT } });
            const $detail = cheerio.load(detailData);

            // 1. Scrape Description
            // Get first few paragraphs of mw-parser-output that are not empty/metadata
            let description = '';
            $detail('.mw-parser-output > p').each((i, el) => {
                const text = $detail(el).text().trim();
                if (!description && text.length > 50 && !text.includes('This article')) {
                    description = text;
                }
            });

            // 2. Scrape Image (Infobox)
            const imageUrl = $detail('.portable-infobox .pi-image-thumbnail').attr('src') || '';

            // 3. Upsert Timeline
            let timeline = await Timeline.findOneAndUpdate(
                { name: target.name },
                {
                    description,
                    imageUrl,
                    order: target.order
                },
                { upsert: true, new: true }
            );
            console.log(`> Timeline Saved: ${timeline.name}`);

            // 4. Scrape Chronology
            console.log(`> Scraping Events...`);

            // Find the Chronology/History Header
            let $chronoHeader = $detail('.mw-parser-output h2').filter((i, el) => {
                const text = $detail(el).text().trim();
                return text.includes('Chronology') || text.includes('History');
            }).first();

            if ($chronoHeader.length) {
                // Remove existing events for this timeline to avoid duplicates on re-run
                await TimelineEvent.deleteMany({ timeline: timeline._id });

                let eventCount = 0;
                let currentYear = '';

                // Traverse siblings until next h2
                let $next = $chronoHeader.next();

                // Safety depth to prevent infinite loops (though .next() should end)
                let steps = 0;

                while ($next.length && !$next.is('h2') && steps < 500) {
                    steps++;
                    const tagName = ($next.prop('tagName') || '').toLowerCase();

                    // Strategy 1: Explicit Headers (H3, H4)
                    if (tagName === 'h3' || tagName === 'h4') {
                        currentYear = $next.find('.mw-headline').text().trim() || $next.text().trim();
                    }

                    // Strategy 2: Paragraphs that look like headers
                    // e.g. <p><b>AC 195</b></p>
                    else if (tagName === 'p') {
                        const text = $next.text().trim();
                        const boldText = $next.find('b').first().text().trim();

                        // Check if the paragraph IS just a year (short, starts with Era or digits)
                        // Regex to match "AC 195" or "U.C. 0079" or "Year 123"
                        const isYearHeader = /^(?:[A-Z]\.?\s*[A-Z]\.?\s*\d+|\d{3,4}|January|February|March|April|May|June|July|August|September|October|November|December)/i.test(text);

                        if (boldText && (boldText === text || text.length < 50)) {
                            // Treat as Year Header
                            currentYear = text;
                        } else {
                            // Treat as Content/Event for the current year
                            // Only safe if we have ANY text
                            if (text.length > 5) { // Skip empty/tiny paragraphs
                                // Clean up citations
                                const cleanText = text.replace(/\[\d+\]/g, '').trim();
                                if (cleanText) {
                                    await TimelineEvent.create({
                                        title: `${target.name} Event`,
                                        description: cleanText,
                                        year: currentYear || target.name,
                                        timeline: timeline._id
                                    });
                                    eventCount++;
                                }
                            }
                        }
                    }

                    // Strategy 3: Unordered Lists (Standard)
                    else if (tagName === 'ul') {
                        const $lis = $next.find('li');
                        const eventsToSave: any[] = [];

                        $lis.each((i, li) => {
                            let text = $detail(li).text().trim();
                            text = text.replace(/\[\d+\]/g, '');
                            if (text) {
                                eventsToSave.push({
                                    title: `${target.name} Event`,
                                    description: text,
                                    year: currentYear || target.name,
                                    timeline: timeline._id
                                });
                            }
                        });

                        if (eventsToSave.length > 0) {
                            await TimelineEvent.insertMany(eventsToSave);
                            eventCount += eventsToSave.length;
                        }
                    }

                    // Strategy 4: Definition Lists (DL) - common in Wikis for Year -> Event
                    else if (tagName === 'dl') {
                        const dts = $next.find('dt').toArray();
                        const dds = $next.find('dd').toArray();

                        // Case A: Standard DT/DD pairs
                        if (dts.length > 0) {
                            for (const dt of dts) {
                                const year = $detail(dt).text().trim();
                                const event = $detail(dt).next('dd').text().trim().replace(/\[\d+\]/g, '');
                                if (year && event) {
                                    currentYear = year; // Update context just in case
                                    await TimelineEvent.create({
                                        title: `${target.name} Event`,
                                        description: event,
                                        year: year,
                                        timeline: timeline._id
                                    });
                                    eventCount++;
                                }
                            }
                        }
                        // Case B: Only DD found (sometimes used for formatting events under a previous header, or mixed)
                        else if (dds.length > 0) {
                            for (const dd of dds) {
                                let text = $detail(dd).text().trim().replace(/\[\d+\]/g, '');

                                // Check if this DD text looks like a Year Header (e.g. "A.D. 2307" or "2364")
                                // Some wikis use <dl><dd><b>Year</b></dd></dl> as a header
                                const isYear = /^(?:A\.?D\.?|P\.?D\.?|C\.?E\.?)\s*\d+/i.test(text) || /^\d{3,4}$/.test(text.replace(/[^\d]/g, ''));

                                if (isYear && text.length < 20) {
                                    currentYear = text;
                                } else if (text) {
                                    // It's an event
                                    await TimelineEvent.create({
                                        title: `${target.name} Event`,
                                        description: text,
                                        year: currentYear || target.name,
                                        timeline: timeline._id
                                    });
                                    eventCount++;
                                }
                            }
                        }
                    }

                    $next = $next.next();
                }
                console.log(`  + Saved ${eventCount} events.`);
            } else {
                console.log('  ! No Chronology/History section found.');
            }
        }

        console.log('Done.');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

scrapeTimelines();
