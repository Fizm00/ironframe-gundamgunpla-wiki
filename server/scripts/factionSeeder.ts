import path from 'path';
import dotenv from 'dotenv';
dotenv.config({ path: path.join(__dirname, '../.env') });
import mongoose from 'mongoose';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { Faction } from '../src/models/Faction';

const BASE_URL = 'https://gundam.fandom.com';
const TARGET_URL = 'https://gundam.fandom.com/wiki/Gundam_Wiki:Factions';

const connectDB = async () => {
    try {
        console.log('Connecting to MongoDB...');
        const uri = process.env.MONGO_URI || '';
        console.log('URI Prefix:', uri.substring(0, 15) + '...');
        console.log('URI Length:', uri.length);

        await mongoose.connect(uri);
        console.log('MongoDB Connected Successfully');
    } catch (err: any) {
        console.error('MongoDB Connection Error:', err.message);
        process.exit(1);
    }
};

interface FactionData {
    name: string;
    url?: string;
    activeEra: string;
    forces: {
        name: string;
        teams: string[];
    }[];
}

async function scrapeFactions() {
    await connectDB();
    console.log(`Fetching ${TARGET_URL}...`);

    try {
        const { data } = await axios.get(TARGET_URL);
        const $ = cheerio.load(data);
        const factions: FactionData[] = [];

        // Iterate over headers (Eras)
        $('.mw-parser-output > h2').each((i, header) => {
            const eraName = $(header).find('.mw-headline').text().trim();
            if (!eraName) return;

            console.log(`Processing Era: ${eraName}`);

            // The list follows the header. It might be immediately next or separated by p
            let nextElement = $(header).next();
            while (nextElement.length && !nextElement.is('ul') && !nextElement.is('h2')) {
                nextElement = nextElement.next();
            }

            if (nextElement.is('ul')) {
                // Determine hierarchy level
                // Level 1: Faction
                nextElement.children('li').each((j, factionLi) => {
                    const $factionLi = $(factionLi);

                    // Extract Faction Name (first link or direct text)
                    // Be careful not to grab Force names from nested ULs immediately
                    const directLink = $factionLi.children('a').first();
                    let factionName = directLink.length ? directLink.text().trim() : $factionLi.clone().children('ul').remove().end().text().trim();
                    const factionUrl = directLink.attr('href'); // Relative URL

                    // Handle "Earth Federation (Earth Federation (Origin))" - strip parens if needed or keep both
                    // Cleanup: Remove trailing newlines/dashes
                    factionName = factionName.replace(/^-\s*/, '').trim();

                    if (!factionName) return;

                    const factionData: FactionData = {
                        name: factionName,
                        url: factionUrl ? BASE_URL + factionUrl : undefined,
                        activeEra: eraName,
                        forces: []
                    };

                    // Level 2: Forces (UL inside Label 1 LI)
                    const forcesUl = $factionLi.children('ul');
                    if (forcesUl.length) {
                        forcesUl.children('li').each((k, forceLi) => {
                            const $forceLi = $(forceLi);
                            const forceLink = $forceLi.children('a').first();
                            let forceName = forceLink.length ? forceLink.text().trim() : $forceLi.clone().children('ul').remove().end().text().trim();
                            forceName = forceName.replace(/^-\s*/, '').trim();

                            if (!forceName) return;

                            const teams: string[] = [];

                            // Level 3: Teams (UL inside Level 2 LI)
                            const teamsUl = $forceLi.children('ul');
                            if (teamsUl.length) {
                                teamsUl.children('li').each((l, teamLi) => {
                                    const $teamLi = $(teamLi);
                                    let teamName = $teamLi.text().trim();
                                    teamName = teamName.replace(/^-\s*/, '').trim();
                                    if (teamName) teams.push(teamName);
                                });
                            }

                            factionData.forces.push({
                                name: forceName,
                                teams: teams
                            });
                        });
                    }

                    // Special case: If no forces found, check if the "Faction" might actually be just a top level grouping 
                    // and contained flat items, but standard Wiki structure usually nests properly.
                    // The wiki provided by user shows: 
                    // - Earth Federation (Origin)
                    //   [Earth Federation Forces] 
                    //     [08th Team]
                    // It seems indentation implies hierarchy.

                    factions.push(factionData);
                });
            }
        });

        console.log(`Found ${factions.length} base factions. Enriching data...`);

        // Process sequentially to avoid rate limits
        for (const faction of factions) {
            console.log(`Upserting: [${faction.activeEra}] ${faction.name}`);

            let description = '';
            let imageUrl = '';
            let leaders: string[] = [];

            // Fetch Detail Page if URL exists
            if (faction.url) {
                try {
                    const { data: detailData } = await axios.get(faction.url);
                    const $detail = cheerio.load(detailData);

                    // Get Main Image (Infobox)
                    const infoboxImage = $('.infobox img').first();
                    if (infoboxImage.length) {
                        imageUrl = infoboxImage.attr('src') || '';
                        // Cleanup /revision/latest... suffix?
                        if (imageUrl.includes('/revision/latest')) {
                            // imageUrl = imageUrl.split('/revision/latest')[0]; // Sometimes breaks loading, keep original usually safer unless huge
                        }
                    }

                    // Get Description (First paragraphs)
                    $('.mw-parser-output > p').each((idx, el) => {
                        if (!description && $(el).text().trim().length > 50) {
                            description = $(el).text().trim();
                        }
                    });

                    // Try to find Leaders in Infobox
                    // Label: "Leader(s)" or "Commander"
                    $('.infobox tr').each((idx, row) => {
                        const label = $(row).find('th').text().trim();
                        if (label.includes('Leader') || label.includes('Commander')) {
                            $(row).find('td a').each((i, link) => {
                                leaders.push($(link).text().trim());
                            });
                            // If no links, try text split
                            if (leaders.length === 0) {
                                const text = $(row).find('td').text().trim();
                                // simple split by comma
                                text.split(',').forEach(t => leaders.push(t.trim()));
                            }
                        }
                    });

                    // Remove duplicates and empty
                    leaders = [...new Set(leaders)].filter(l => l.length > 0);

                } catch (err: any) {
                    console.error(`Failed to fetch details for ${faction.name}:`, err.message);
                }
            }

            // Upsert into DB
            await Faction.findOneAndUpdate(
                { name: faction.name, activeEra: faction.activeEra },
                {
                    name: faction.name,
                    activeEra: faction.activeEra,
                    description,
                    imageUrl,
                    leaders,
                    forces: faction.forces
                },
                { upsert: true, new: true }
            );
        }

        console.log('Seeding Complete!');
        process.exit(0);

    } catch (error) {
        console.error('Scraper Error:', error);
        process.exit(1);
    }
}

scrapeFactions();
