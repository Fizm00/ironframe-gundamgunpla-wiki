import axios from 'axios';
import * as cheerio from 'cheerio';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { LoreMobileSuit } from '../src/models/LoreMobileSuit';

dotenv.config();

const SERIES_URL = 'https://gundam.fandom.com/wiki/Gundam_Wiki:Series';
const LIST_URL = 'https://gundam.fandom.com/wiki/List_of_Gundams_in_the_Gundam_franchise';
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

async function scrapeFandom() {
    await connectDB();
    console.log('--- STARTING FANDOM SCRAPER ---');

    console.log(`Fetching Canonical Series List from ${SERIES_URL}...`);
    const canonicalSeries: string[] = [];
    try {
        const { data: seriesHtml } = await axios.get(SERIES_URL);
        const $series = cheerio.load(seriesHtml);
        $series('.mw-parser-output ul li a').each((_, el) => {
            const $el = $series(el);
            if ($el.closest('#toc').length > 0) return;
            if ($el.closest('.navbox').length > 0) return;

            const txt = $el.text().trim();
            if (txt && !txt.includes('User:') && !txt.includes('Talk:') && !canonicalSeries.includes(txt) && txt.length > 2) {
                canonicalSeries.push(txt);
            }
        });
        console.log(`Loaded ${canonicalSeries.length} canonical series titles.`);
        console.log('Sample Canonical Series:', canonicalSeries.slice(0, 10));
    } catch (e) {
        console.error('Failed to load series list, continuing without validation.');
    }

    try {
        console.log(`Fetching list from ${LIST_URL}...`);
        const { data: listHtml } = await axios.get(LIST_URL);
        const $list = cheerio.load(listHtml);

        const links: { name: string, url: string, series?: string }[] = [];

        // Context-Aware List Scraper
        let currentSeries = 'Gundam Franchise';

        $list('.mw-parser-output').children().each((_: number, el: any) => {
            const $el = $list(el);

            // Detect Series Header
            if ($el.is('h2') || $el.is('h3')) {
                const $cloned = $el.clone();
                $cloned.find('.mw-editsection').remove();
                const headerText = $cloned.text().trim();

                if (headerText &&
                    !headerText.includes('Contents') &&
                    !headerText.includes('Notes') &&
                    !headerText.includes('See also')) {
                    currentSeries = headerText;
                }
            }

            // Extract Links from Lists
            if ($el.is('ul')) {
                $el.find('li a').each((_: number, a: any) => {
                    const $a = $list(a);
                    const name = $a.text().trim();
                    const href = $a.attr('href');

                    if (name && href && href.startsWith('/wiki/') && !href.includes(':') && !href.includes('Category')) {
                        links.push({
                            name,
                            url: BASE_URL + href,
                            series: currentSeries
                        });
                    }
                });
            }
        });

        console.log(`Found ${links.length} potential pages.`);

        let processed = 0;
        let skipped = 0;
        let errors = 0;

        for (const [index, link] of links.entries()) {

            // 1. DUPLICATE CHECK
            const existing = await LoreMobileSuit.findOne({
                $or: [
                    { url: link.url },
                    { name: link.name },
                    { name: new RegExp('^' + link.name.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '$', 'i') }
                ]
            });

            if (existing) {
                const specs = existing.specifications as Record<string, string> || {};

                // Force update if it's 'Gundam Franchise' OR likely a generic Timeline (to upgrade to specific show)
                const isGeneric = existing.series === 'Gundam Franchise' ||
                    ['Universal Century', 'Future Century', 'After Colony', 'After War', 'Correct Century', 'Cosmic Era', 'Anno Domini', 'Advanced Generation', 'Regild Century', 'Post Disaster', 'Ad Stella', 'Build Fighters', 'SD Gundam'].some(t => existing.series?.includes(t));

                if (isGeneric) {
                    console.log(`[${index + 1}/${links.length}] Updating (Refining Series): ${link.name}`);
                    console.log(`[${index + 1}/${links.length}] Updating Incomplete: ${link.name}`);
                } else {
                    console.log(`[${index + 1}/${links.length}] Skipping (Duplicate): ${link.name}`);
                    skipped++;
                    continue;
                }
            } else {
                console.log(`[${index + 1}/${links.length}] Scraping: ${link.name}`);
            }

            try {
                const { data: detailHtml } = await axios.get(link.url);
                const $ = cheerio.load(detailHtml);

                const getInfoboxValue = (labelPattern: string): string => {
                    let value = '';
                    $('.portable-infobox .pi-data').each((_: number, el: any) => {
                        const label = $(el).find('.pi-data-label').text().trim();
                        if (new RegExp(labelPattern, 'i').test(label)) {
                            value = $(el).find('.pi-data-value').text().trim();
                        }
                    });
                    return value;
                };

                const getInfoboxList = (labelPattern: string): string[] => {
                    let items: string[] = [];
                    $('.portable-infobox .pi-data').each((_: number, el: any) => {
                        const label = $(el).find('.pi-data-label').text().trim();
                        if (new RegExp(labelPattern, 'i').test(label)) {
                            const lis = $(el).find('.pi-data-value li');
                            if (lis.length) {
                                lis.each((_: number, li: any) => { items.push($(li).text().trim()); });
                            } else {
                                const text = $(el).find('.pi-data-value').text().trim();
                                const cleanText = text.replace(/\[.*?\]/g, '');
                                if (cleanText.includes(',')) {
                                    items = cleanText.split(',').map(s => s.trim());
                                } else {
                                    items.push(cleanText);
                                }
                            }
                        }
                    });
                    return items.filter(i => i.length > 0);
                };

                // Generic Infobox Parser
                const getInfoboxMap = (): Record<string, string> => {
                    const map: Record<string, string> = {};
                    $('.portable-infobox .pi-data').each((_: number, el: any) => {
                        const label = $(el).find('.pi-data-label').text().trim();

                        // Clone element to manipulate it for text extraction without affecting others
                        const $val = $(el).find('.pi-data-value').clone();
                        $val.find('br').replaceWith(' ');
                        $val.find('sup').remove(); // remove references [1]

                        let value = $val.text().trim();

                        const lis = $(el).find('.pi-data-value li');
                        if (lis.length) {
                            value = '';
                            lis.each((_: number, li: any) => {
                                const $li = $(li).clone();
                                $li.find('br').replaceWith(' ');
                                $li.find('sup').remove();
                                value += $li.text().trim() + ', ';
                            });
                            value = value.replace(/, $/, '');
                        }

                        // Capture everything, filter later
                        if (label && value) map[label] = value;
                    });
                    return map;
                };

                const findHeader = (textOrRegex: string | RegExp) => {
                    let $header = $('.__non_existent_selector__');
                    $('h2, h3').each((_: number, el: any) => {
                        const text = $(el).text().trim();
                        if (textOrRegex instanceof RegExp) {
                            if (textOrRegex.test(text)) $header = $(el);
                        } else {
                            if (text.toLowerCase().includes(textOrRegex.toLowerCase())) $header = $(el);
                        }
                        if (!$header.length) {
                            const id = $(el).find('span').attr('id');
                            if (id && (textOrRegex instanceof RegExp ? textOrRegex.test(id) : id?.toLowerCase().includes(String(textOrRegex).toLowerCase()))) {
                                $header = $(el);
                            }
                        }
                    });
                    return $header;
                };

                const getSectionText = (pattern: string | RegExp): string => {
                    const $header = findHeader(pattern);
                    if (!$header.length) return '';

                    const tagName = ($header.prop('tagName') || '').toLowerCase();

                    // Special Case: "Appearances" (and similar) often have H3 subsections (TV, Game, etc.)
                    // So we should NOT stop at H3, but continue until the next H2 (Main Section)
                    const isAppearances = /Appearances|Anime|Manga|Game|Novel/i.test($header.text());
                    const stopSelector = (tagName === 'h3' && !isAppearances) ? 'h2, h3' : 'h2';

                    let content = '';
                    let next = $header.next();
                    while (next.length && !next.is(stopSelector)) {
                        if (next.is('p')) {
                            content += next.text().trim() + '\n\n';
                        } else if (next.is('ul') || next.is('ol')) {
                            next.find('li').each((_: number, li: any) => {
                                content += '• ' + $(li).text().trim() + '\n';
                            });
                            content += '\n';
                        }
                        next = next.next();
                    }
                    return content.replace(/\[.*?\]/g, '').trim();
                };

                const getSectionList = (pattern: string | RegExp): string[] => {
                    const list: string[] = [];

                    $('h2, h3').each((_: number, el: any) => {
                        const $header = $(el);
                        const text = $header.text().trim();
                        let isMatch = false;
                        if (pattern instanceof RegExp) {
                            if (pattern.test(text)) isMatch = true;
                        } else {
                            if (text.toLowerCase().includes(String(pattern).toLowerCase())) isMatch = true;
                        }

                        if (isMatch) {
                            const tagName = ($header.prop('tagName') || '').toLowerCase();
                            // Special Case: "Appearances" (and similar) often have H3 subsections (TV, Game, etc.)
                            // So we should NOT stop at H3, but continue until the next H2 (Main Section)
                            const isAppearances = /Appearances|Anime|Manga|Game|Novel/i.test(text);
                            const stopSelector = (tagName === 'h3' && !isAppearances) ? 'h2, h3' : 'h2';

                            let next = $header.next();
                            while (next.length && !next.is(stopSelector)) {
                                if (next.is('ul')) {
                                    next.find('li').each((_: number, li: any) => {
                                        list.push($(li).text().replace(/\[.*?\]/g, '').trim());
                                    });
                                }
                                if (next.find('.tabbertab').length) {
                                    next.find('.tabbertab').each((_: number, tab: any) => {
                                        $(tab).find('li').each((_: number, li: any) => {
                                            list.push($(li).text().replace(/\[.*?\]/g, '').trim());
                                        });
                                    })
                                }
                                next = next.next();
                            }
                        }
                    });

                    return list;
                };

                // --- DATA EXTRACTION ---

                const name = $('.portable-infobox .pi-title').text().trim() || link.name;

                // Enhanced Image Extraction
                // 1. Try Infobox thumbnail (src or data-src)
                // 2. Try Infobox figure (src or data-src)
                // 3. Fallback: Try finding the first large image in content
                let imageUrl = $('.portable-infobox .pi-image-thumbnail').attr('src') || '';
                if (!imageUrl || imageUrl.includes('data:image')) imageUrl = $('.portable-infobox .pi-image-thumbnail').attr('data-src') || '';
                if (!imageUrl) imageUrl = $('.portable-infobox figure.pi-image img').attr('src') || '';
                if (!imageUrl || imageUrl.includes('data:image')) imageUrl = $('.portable-infobox figure.pi-image img').attr('data-src') || '';

                // Fallback: mw-parser-output image
                if (!imageUrl || imageUrl.includes('data:image')) {
                    const contentImg = $('.mw-parser-output .image img').first();
                    imageUrl = contentImg.attr('src') || contentImg.attr('data-src') || '';
                }

                let description = '';
                $('.mw-parser-output > p').each((i: number, el: any) => {
                    if (description.length > 500) return false;
                    const text = $(el).text().trim();
                    if (text && !text.includes('From the upcoming')) {
                        description += text + '\n\n';
                    }
                    if (i > 3) return false;
                });
                description = description.trim();

                const development = getInfoboxList('Developed from');

                const production: Record<string, string> = {};
                const manufacturer = getInfoboxValue('Manufacturer');
                if (manufacturer) production['Manufacturer'] = manufacturer;
                const operator = getInfoboxValue('Operator');
                if (operator) production['Operator'] = operator;
                const firstDeployment = getInfoboxValue('First deployment');
                if (firstDeployment) production['First Deployment'] = firstDeployment;


                // --- NORMALIZATION & STANDARDIZATION ---
                const rawInfobox = getInfoboxMap();

                const cleanText = (text: string): string => {
                    if (!text) return 'Unknown';
                    // Remove HTML tags loops/br with space
                    let cleaned = text.replace(/<\s*br\s*\/?>/gi, ' ').replace(/<[^>]*>/g, '');
                    return cleaned.replace(/\s+/g, ' ').trim();
                };

                const findValue = (keys: string[]): string => {
                    for (const k of keys) {
                        const actualKey = Object.keys(rawInfobox).find(rk => rk.toLowerCase() === k.toLowerCase());
                        if (actualKey && rawInfobox[actualKey]) {
                            return cleanText(rawInfobox[actualKey]);
                        }
                    }
                    return 'Unknown';
                };

                const specifications = {
                    'Crew': findValue(['Crew', 'Pilot', 'Pilots']),
                    'Cockpit': findValue(['Cockpit', 'Cockpit system']),
                    'Cockpit Location': findValue(['Cockpit Location', 'Cockpit Position', 'Cockpit Type']),
                    'Height': findValue(['Overall Height', 'Head Height', 'Height']),
                    'Weight': findValue(['Empty Weight', 'Base Weight', 'Standard Weight', 'Weight', 'Full Weight', 'Max Weight']),
                    'Armor': findValue(['Armor', 'Armor materials', 'Material']),
                    'Sensors': findValue(['Sensors', 'Sensor Range', 'Sensor Radius'])
                };

                const performance = {
                    'Power plant': findValue(['Power plant', 'Generator', 'Power Generator', 'Reactor', 'Power Source']),
                    'Power output': findValue(['Power output', 'Generator output', 'Output']),
                    'Propulsion': findValue(['Propulsion', 'Rocket Thrusters', 'Thrusters', 'Main Thrusters']),
                    'Max speed': findValue(['Max speed', 'Speed', 'Maximum speed']),
                    '180° turn time': findValue(['180° turn time', 'Turn time']),
                    'Thrust to weight': findValue(['Thrust to weight', 'Thrust-to-weight ratio'])
                };

                if (performance['Propulsion'] === 'Unknown') {
                    // Check specifically for "Total thrust" if Propulsion alias failed
                    const totalThrust = findValue(['Total thrust']);
                    if (totalThrust !== 'Unknown') performance['Propulsion'] = totalThrust;
                }

                const armaments: { category: string; items: string[] }[] = [];
                const fixed = getInfoboxList('Fixed');
                if (fixed.length) armaments.push({ category: 'Fixed', items: fixed });
                const handheld = getInfoboxList('Handheld');
                if (handheld.length) armaments.push({ category: 'Handheld', items: handheld });
                const standard = getInfoboxList('Standard');
                if (standard.length && !fixed.length && !handheld.length) {
                    armaments.push({ category: 'Standard', items: standard });
                }

                if (armaments.length === 0) {
                    const armamentsList = getSectionList('Armaments');
                    if (armamentsList.length) {
                        armaments.push({ category: 'Standard', items: armamentsList });
                    }
                }

                const variants = getSectionList('Variants');
                const history = getSectionText('History') || getSectionText('Operational History');
                const behindTheScenes = getSectionText('Behind the scenes') || getSectionText('Notes');
                const knownPilots = getInfoboxList('Known Pilots');
                const appearances = getSectionList(/Appearances|Anime|Manga|Game|Novel/i);

                // --- SERIES DEDUCTION ---
                // Priority: 
                // 1. Appearances (Specific Title) - e.g. "Mobile Suit Gundam SEED"
                // 2. Categories (Specific Logic) - e.g. "Gundam SEED mobile suits" -> "Gundam SEED"
                // 3. List Page Context (Timeline/Header) - e.g. "Universal Century"
                // 4. Default 'Gundam Franchise'

                // --- SERIES DEDUCTION ---
                let series = 'Gundam Franchise';

                // Helper to check against Canonical List
                const matchCanonical = (candidate: string): string | null => {
                    if (!candidate) return null;
                    const cleanCandidate = candidate.replace(/\s*\(.*\)/, '').trim();

                    // 1. Exact match
                    if (canonicalSeries.includes(cleanCandidate)) return cleanCandidate;

                    // 2. Specialized Gundam Matching
                    const normalize = (s: string) => s.replace(/^(Mobile Suit |Mobile |The |Advancement of )/i, '').trim();
                    const coreCandidate = normalize(cleanCandidate);

                    const bestMatch = canonicalSeries.find(s => {
                        const coreS = normalize(s.replace(/\s*\(.*\)/, '').trim());

                        // Check if one contains the other
                        if (coreS.toLowerCase().includes(coreCandidate.toLowerCase()) && coreCandidate.length > 3) return true;
                        if (coreCandidate.toLowerCase().includes(coreS.toLowerCase()) && coreS.length > 4) return true;

                        return false;
                    });

                    if (bestMatch) {
                        return bestMatch.length > cleanCandidate.length ? bestMatch : cleanCandidate;
                    }

                    return null;
                };

                // 1. Try Appearances (Contextual Exactness)
                if (appearances && appearances.length > 0) {
                    const appMatch = matchCanonical(appearances[0]);
                    if (appMatch) series = appMatch;
                }

                // 2. Try Categories (if not found in appearances)
                if (series === 'Gundam Franchise') {
                    const categories: string[] = [];
                    $('a[href*="/wiki/Category:"]').each((_: number, el: any) => {
                        const cat = $(el).text().trim();
                        if (cat && !categories.includes(cat) && !cat.includes('Category:')) {
                            categories.push(cat);
                        }
                    });

                    // Prioritize categories that look like series names
                    const seriesCat = categories.find(c =>
                        /mobile suits/i.test(c) &&
                        !/Gundam mobile suits/i.test(c) &&
                        !/Universal Century/i.test(c)
                    );

                    if (seriesCat) {
                        let cleaned = seriesCat.replace(/(\s+mobile suits.*|s$)/i, '');
                        // Check if this cleaned category matches a canonical series
                        const catMatch = matchCanonical(cleaned);
                        if (catMatch) {
                            series = catMatch;
                        } else {
                            // If no canonical match, maybe just use cleaned if it looks decent
                            cleaned = cleaned.replace(/^(Mobile Suit |Advancement of )/i, '').trim();
                            if (cleaned.length > 2) series = cleaned;
                        }
                    }
                }

                // 3. Fallback to List Context (Timeline)
                if (series === 'Gundam Franchise' && link.series && link.series !== 'Gundam Franchise') {
                    series = link.series;
                }

                const loreData = {
                    name,
                    series,
                    url: link.url,
                    imageUrl,
                    description,
                    history,
                    design: getSectionText('Design'),

                    production,
                    development: { DevelopedFrom: development.join(', ') },
                    specifications,
                    performance,
                    armaments,
                    variants,
                    knownPilots,
                    appearances,
                    behindTheScenes
                };

                if (!loreData.imageUrl) delete (loreData as any).imageUrl;

                console.log(`   -> Extracted Image: ${loreData.imageUrl ? 'YES (' + loreData.imageUrl + ')' : 'NO'}`);
                console.log(`   -> Appearances: ${appearances.length} found. First: "${appearances[0]}"`);
                console.log(`   -> Series: ${loreData.series}`);

                const filter = { url: link.url };
                await LoreMobileSuit.findOneAndUpdate(filter, loreData, { upsert: true, new: true });
                console.log(`   -> Saved/Updated!`);
                processed++;

            } catch (err: any) {
                console.error(`   -> Failed to scrape ${link.url}: ${err.message}`);
                errors++;
            }

            await delay(1000);
        }

        console.log('--- SCRAPING COMPLETED ---');
        console.log(`Processed: ${processed}`);
        console.log(`Skipped: ${skipped}`);
        console.log(`Errors: ${errors}`);
        process.exit();

    } catch (error) {
        console.error("Scraping fatal error:", error);
        process.exit(1);
    }
}

scrapeFandom();
