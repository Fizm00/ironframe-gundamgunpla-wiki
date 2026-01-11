import mongoose from 'mongoose';
import * as cheerio from 'cheerio';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const FactionSchema = new mongoose.Schema({
    name: String,
    url: String,
    forces: [],
    // fields we want to patch
    purpose: String,
    leaders: [String],
    sphereOfInfluence: String,
    parent: String,
    subdivisions: [String],
    allies: [String],
    enemies: [String],
    firstSeen: String,
    lastSeen: String,
    mobileWeapons: [String],
    vehicles: [String],
    miscellaneous: [String],
    history: String,
    // ... add more if needed
}, { strict: false });

const Faction = mongoose.model('Faction', FactionSchema);

const OVERRIDES: Record<string, string> = {
    "Earth Federation": "https://gundam.fandom.com/wiki/Earth_Federation_Forces",
    "Zeon": "https://gundam.fandom.com/wiki/Principality_of_Zeon",
    "Earth Alliance": "https://gundam.fandom.com/wiki/Earth_Alliance",
};

// Helper: Extract Text List
const extractList = ($page: any, headerKeyword: string): string[] => {
    let items: string[] = [];
    $page('.mw-parser-output h2, .mw-parser-output h3').each((i: any, el: any) => {
        const text = $page(el).text().trim().toLowerCase();
        // console.log('Header found:', text); // DEBUG headers on first run

        if (text.includes(headerKeyword.toLowerCase())) {
            let next = $page(el).next();
            while (next.length && !next.is('h2') && !next.is('h3')) {
                if (next.is('ul')) {
                    next.find('li').each((j: any, li: any) => {
                        let text = $page(li).text().trim().replace(/^-\s*/, '');
                        text = text.replace(/\[\d+\]/g, '');
                        if (text) items.push(text);
                    });
                }
                next = next.next();
            }
        }
    });
    return items;
};

// Helper: Parse Infobox
const extractInfoboxData = ($page: any): Record<string, any> => {
    const data: Record<string, any> = {};
    const $infobox = $page('.portable-infobox').first();
    if (!$infobox.length) return data;

    $infobox.find('.pi-data').each((i: any, el: any) => {
        const $el = $page(el);
        const label = $el.find('.pi-data-label').text().trim().toLowerCase();
        const $value = $el.find('.pi-data-value');

        const extractValue = ($val: any) => {
            const listItems = $val.find('li');
            if (listItems.length > 0) {
                const arr: string[] = [];
                listItems.each((j: any, li: any) => arr.push($page(li).text().trim().replace(/\[\d+\]/g, '')));
                return arr;
            }
            return $val.text().trim().replace(/\[\d+\]/g, '');
        };

        const value = extractValue($value);

        if (label.includes('purpose')) data.purpose = Array.isArray(value) ? value.join(', ') : value;
        if (label.includes('leader') || label.includes('led by')) data.leaders = Array.isArray(value) ? value : [value];
        if (label.includes('sphere')) data.sphereOfInfluence = Array.isArray(value) ? value.join(', ') : value;
        if (label.includes('parent')) data.parent = Array.isArray(value) ? value[0] : value;
        if (label.includes('subdivision')) data.subdivisions = Array.isArray(value) ? value : [value];
        if (label.includes('allies')) data.allies = Array.isArray(value) ? value : [value];
        if (label.includes('enemies')) data.enemies = Array.isArray(value) ? value : [value];
        if (label.includes('first seen')) data.firstSeen = Array.isArray(value) ? value[0] : value;
        if (label.includes('last seen')) data.lastSeen = Array.isArray(value) ? value[0] : value;
    });

    // Header based lists in infobox
    $infobox.find('.pi-header').each((i: any, el: any) => {
        const headerText = $page(el).text().trim().toLowerCase();
        let next = $page(el).next();

        // Capture all subsequent data items until next header
        const items: string[] = [];

        while (next.length && !next.hasClass('pi-header')) {
            if (next.hasClass('pi-data') || next.hasClass('pi-group')) {
                // Try to find list items or plain text
                next.find('li').each((j: any, li: any) => {
                    items.push($page(li).text().trim().replace(/\[\d+\]/g, ''));
                });

                if (items.length === 0) {
                    const val = next.find('.pi-data-value');
                    if (val.length) {
                        // Check for BR tags
                        const html = val.html() || '';
                        if (html.includes('<br')) {
                            html.split(/<br\s*\/?>/i).forEach((s: string) => {
                                const t = $page('<div>' + s + '</div>').text().trim().replace(/\[\d+\]/g, '');
                                if (t) items.push(t);
                            });
                        } else {
                            const t = val.text().trim().replace(/\[\d+\]/g, '');
                            if (t) items.push(t);
                        }
                    }
                }
            }
            next = next.next();
        }

        if (items.length > 0) {
            console.log(`      + Found Infobox List under '${headerText}': ${items.length} items.`);
            if (headerText.includes('mobile weapon') || headerText.includes('mobile suit') || headerText.includes('unit') || headerText.includes('armor')) {
                data.mobileWeapons = [...(data.mobileWeapons || []), ...items];
            }
            if (headerText.includes('vehicle') || headerText.includes('ship') || headerText.includes('vessel')) {
                data.vehicles = [...(data.vehicles || []), ...items];
            }
        }
    });

    return data;
};

const patchKeyFactions = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/gundam-wiki');

        for (const [factionName, url] of Object.entries(OVERRIDES)) {
            console.log(`Patching ${factionName} from ${url}...`);
            const { data } = await axios.get(url, {
                headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36' }
            });
            const $ = cheerio.load(data);

            const infoboxData = extractInfoboxData($);

            console.log('--- HEADERS FOUND ---');
            $('.mw-parser-output h2, .mw-parser-output h3').each((i: any, el: any) => {
                console.log($(el).text().trim());
            });
            console.log('---------------------');

            // Extract Main Lists
            const mobileWeapons = extractList($, 'Mobile weapon'); // Try singular/plural fuzzy
            const vehicles = extractList($, 'Vehicle');
            const miscellaneous = extractList($, 'Miscellaneous');

            console.log(`    > Extracted: Leaders: ${infoboxData.leaders?.length}, MW: ${mobileWeapons.length}, Vehicles: ${vehicles.length}`);

            const updateData: any = {
                ...infoboxData,
            };

            if (mobileWeapons.length) updateData.mobileWeapons = mobileWeapons;
            if (vehicles.length) updateData.vehicles = vehicles;
            if (miscellaneous.length) updateData.miscellaneous = miscellaneous;

            // Upsert/Update
            const res = await Faction.updateOne(
                { name: factionName },
                { $set: updateData }
            );

            console.log(`  > Result for ${factionName}: Matched ${res.matchedCount}, Modified ${res.modifiedCount}.`);
            if (res.matchedCount === 0) {
                console.log(`  ! WARNING: Could not find faction with name '${factionName}' in DB.`);
            }
        }

        console.log('Done.');
        process.exit();
    } catch (e) {
        console.error(e);
        process.exit(1);
    }
};

patchKeyFactions();
