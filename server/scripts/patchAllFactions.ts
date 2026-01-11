import mongoose from 'mongoose';
import axios from 'axios';
import * as cheerio from 'cheerio';
import path from 'path';
import dotenv from 'dotenv';
import { Faction } from '../src/models/Faction';

dotenv.config({ path: path.join(__dirname, '../.env') });

const extractInfoboxData = ($page: any): Record<string, any> => {
    const data: Record<string, any> = {};
    const $infobox = $page('.portable-infobox').first();
    if (!$infobox.length) return data;

    // Headers (Mobile Weapons / Vehicles)
    $infobox.find('.pi-header').each((i: any, el: any) => {
        const headerText = $page(el).text().trim().toLowerCase();
        let next = $page(el).next();
        const items: string[] = [];

        while (next.length && !next.hasClass('pi-header')) {
            if (next.hasClass('pi-data') || next.hasClass('pi-group')) {
                next.find('li').each((j: any, li: any) => {
                    const t = $page(li).text().trim().replace(/\[\d+\]/g, '');
                    if (t) items.push(t);
                });
                if (items.length === 0) {
                    const val = next.find('.pi-data-value');
                    if (val.length) {
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
            if (headerText.includes('mobile weapon') || headerText.includes('mobile suit') || headerText.includes('unit')) {
                data.mobileWeapons = items;
            }
            if (headerText.includes('vehicle') || headerText.includes('ship') || headerText.includes('vessel')) {
                data.vehicles = items;
            }
        }
    });
    return data;
};

const run = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI || '');
        console.log('DB Connected. Fetching all factions...');

        const factions: any[] = await Faction.find({ url: { $exists: true, $ne: '' } });
        console.log(`Found ${factions.length} factions to check.`);

        let updatedCount = 0;

        for (const faction of factions) {
            console.log(`Processing [${faction.activeEra}] ${faction.name}...`);
            try {
                const { data } = await axios.get(faction.url);
                const $ = cheerio.load(data);
                const extraData = extractInfoboxData($);

                let changed = false;

                if (extraData.mobileWeapons && extraData.mobileWeapons.length > 0) {
                    const oldLen = faction.mobileWeapons ? faction.mobileWeapons.length : 0;
                    // Merge unique
                    const combined = [...new Set([...(faction.mobileWeapons || []), ...extraData.mobileWeapons])];
                    if (combined.length > oldLen) {
                        faction.mobileWeapons = combined;
                        console.log(`  -> Updated Mobile Weapons: ${oldLen} -> ${combined.length}`);
                        changed = true;
                    }
                }

                if (extraData.vehicles && extraData.vehicles.length > 0) {
                    const oldLen = faction.vehicles ? faction.vehicles.length : 0;
                    const combined = [...new Set([...(faction.vehicles || []), ...extraData.vehicles])];
                    if (combined.length > oldLen) {
                        faction.vehicles = combined;
                        console.log(`  -> Updated Vehicles: ${oldLen} -> ${combined.length}`);
                        changed = true;
                    }
                }

                if (changed) {
                    await faction.save();
                    updatedCount++;
                } else {
                    console.log('  -> No changes.');
                }

                // Optional: Check sub-forces? 
                // That requires more deep scraping. 
                // Let's stick to main factions first as per user request flow ("Karaba", "Anaheim", etc are main entries).

            } catch (e: any) {
                console.error(`  -> Error fetching/parsing ${faction.name}: ${e.message}`);
            }

            // Short delay
            await new Promise(r => setTimeout(r, 200));
        }

        console.log(`Patch Complete. Updated ${updatedCount} factions.`);
        process.exit(0);

    } catch (e: any) {
        console.error(e);
        process.exit(1);
    }
};

run();
