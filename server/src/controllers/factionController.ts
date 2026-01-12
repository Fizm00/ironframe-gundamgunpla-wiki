import { Request, Response, NextFunction } from 'express';
import { Faction } from '../models/Faction';
import redis from '../config/redis';
import { logActivity } from '../utils/activityLogger';
import axios from 'axios';
import * as cheerio from 'cheerio';

export const getFactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const search = (req.query.search as string) || '';

        const cacheKey = `factions:search=${search}`;
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const query: any = {};
        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        const factions = await Faction.find(query).sort({ activeEra: 1, name: 1 });

        await redis.setex(cacheKey, 3600, JSON.stringify(factions));

        res.json(factions);
    } catch (error) {
        next(error);
    }
};

export const getFactionById = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const faction = await Faction.findById(req.params.id);
        if (!faction) {
            res.status(404);
            throw new Error('Faction not found');
        }
        res.json(faction);
    } catch (error) {
        next(error);
    }
};

export const createFaction = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const faction = await Faction.create(req.body);

        const keys = await redis.keys('factions:*');
        if (keys.length > 0) await redis.del(keys);

        await logActivity('Created', 'Faction', faction.name, req.user ? req.user.username : 'System');

        res.status(201).json(faction);
    } catch (error) {
        next(error);
    }
};

export const updateFaction = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const faction = await Faction.findById(req.params.id);

        if (faction) {
            const updatedFaction = await Faction.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true
            });

            const keys = await redis.keys('factions:*');
            if (keys.length > 0) await redis.del(keys);

            await logActivity('Updated', 'Faction', faction.name, req.user ? req.user.username : 'System');

            res.json(updatedFaction);
        } else {
            res.status(404);
            throw new Error('Faction not found');
        }
    } catch (error) {
        next(error);
    }
};

export const deleteFaction = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        const faction = await Faction.findById(req.params.id);

        if (faction) {
            await faction.deleteOne();

            const keys = await redis.keys('factions:*');
            if (keys.length > 0) await redis.del(keys);

            await logActivity('Deleted', 'Faction', faction.name, req.user ? req.user.username : 'System');

            res.json({ message: 'Faction removed' });
        } else {
            res.status(404);
            throw new Error('Faction not found');
        }
    } catch (error) {
        next(error);
    }
};

export const uploadFactionImage = async (req: Request | any, res: Response, next: NextFunction) => {
    try {
        if (!req.file) {
            res.status(400);
            throw new Error('No image file provided');
        }

        const faction = await Faction.findById(req.params.id);
        if (!faction) {
            res.status(404);
            throw new Error('Faction not found');
        }

        const protocol = req.protocol;
        const host = req.get('host');
        const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        faction.imageUrl = imageUrl;
        await faction.save();

        const keys = await redis.keys('factions:*');
        if (keys.length > 0) await redis.del(keys);

        await logActivity('Updated Image', 'Faction', faction.name, req.user ? req.user.username : 'System');

        res.json({
            message: 'Image uploaded successfully',
            imageUrl: faction.imageUrl
        });
    } catch (error) {
        next(error);
    }
};


const BASE_URL = 'https://gundam.fandom.com';
const TARGET_URL = 'https://gundam.fandom.com/wiki/Gundam_Wiki:Factions';

const extractSection = ($page: any, headerKeywords: string[]): string => {
    let content = '';
    $page('.mw-parser-output h2, .mw-parser-output h3').each((i: any, el: any) => {
        const text = $page(el).text().trim().toLowerCase();
        if (headerKeywords.some(kw => text.includes(kw.toLowerCase()))) {
            let next = $page(el).next();
            while (next.length && !next.is('h2') && !next.is('h3')) {
                if (next.is('p') || next.is('ul') || next.is('dl')) {
                    const text = next.text().trim();
                    content += text.replace(/\[\d+\]/g, '') + '\n\n';
                }
                next = next.next();
            }
        }
    });
    return content.trim();
};

const extractList = ($page: any, headerKeyword: string): string[] => {
    let items: string[] = [];
    $page('.mw-parser-output h2, .mw-parser-output h3').each((i: any, el: any) => {
        if ($page(el).text().trim().toLowerCase().includes(headerKeyword.toLowerCase())) {
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
            const html = $val.html() || '';
            if (html.includes('<br')) {
                return html.split(/<br\s*\/?>/i).map((s: string) => $page('<div>' + s + '</div>').text().trim().replace(/\[\d+\]/g, '')).filter((s: string) => s.length > 0);
            }
            return $val.text().trim().replace(/\[\d+\]/g, '');
        };

        const value = extractValue($value);

        if (label.includes('purpose') || label.includes('manufacturer')) data.purpose = Array.isArray(value) ? value.join(', ') : value;
        if (label.includes('sphere') || label.includes('influence')) data.sphereOfInfluence = Array.isArray(value) ? value.join(', ') : value;
        if (label.includes('led by') || label.includes('leader') || label.includes('commander')) data.leaders = Array.isArray(value) ? value : [value];
        if (label.includes('alliance') || label.includes('allies')) data.allies = Array.isArray(value) ? value : [value];
        if (label.includes('enemy') || label.includes('enemies')) data.enemies = Array.isArray(value) ? value : [value];
        if (label.includes('first seen') || label.includes('developed from') || label.includes('founded')) data.firstSeen = Array.isArray(value) ? value[0] : value;
        if (label.includes('last seen') || label.includes('dissolved')) data.lastSeen = Array.isArray(value) ? value[0] : value;
        if (label.includes('parent') || label.includes('allegiance')) data.parent = Array.isArray(value) ? value[0] : value;
        if (label.includes('sub-division') || label.includes('subdivision')) data.subdivisions = Array.isArray(value) ? value : [value];
        if (label.includes('rank')) data.militaryRanks = Array.isArray(value) ? value : [value];
        if (label.includes('base') || label.includes('headquarters')) data.headquarters = Array.isArray(value) ? value[0] : value;
    });

    $infobox.find('.pi-header').each((i: any, el: any) => {
        const headerText = $page(el).text().trim().toLowerCase();
        let next = $page(el).next();
        const items: string[] = [];

        while (next.length && !next.hasClass('pi-header')) {
            if (next.hasClass('pi-data') || next.hasClass('pi-group')) {
                next.find('li').each((j: any, li: any) => {
                    items.push($page(li).text().trim().replace(/\[\d+\]/g, ''));
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
}


export const seedFactions = async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('Starting Deep Faction Seed (Sprint 2)...');
        const { data } = await axios.get(TARGET_URL);
        const $ = cheerio.load(data);
        const factions: any[] = [];

        $('.mw-parser-output > h2').each((i, header) => {
            const eraName = $(header).find('.mw-headline').text().trim();
            if (!eraName || ['Contents', 'See Also', 'References'].some(s => eraName.includes(s))) return;

            let nextElement = $(header).next();

            while (nextElement.length && !nextElement.is('h2')) {

                if (nextElement.is('ul')) {
                    nextElement.children('li').each((j, factionLi) => {
                        processFactionLi($, factionLi, eraName, factions);
                    });
                }
                nextElement = nextElement.next();
            }
        });

        console.log(`Found ${factions.length} factions from directory. Starting Deep Dive...`);

        let count = 0;
        for (const faction of factions) {

            let description = '';
            let imageUrl = '';
            let infoboxData: any = {};
            let history = '';
            let government = '';
            let military = '';
            let behindTheScenes = '';
            let technologies = '';

            let information = '';

            if (faction.url) {
                try {
                    const { data: detailData } = await axios.get(faction.url);
                    const $detail = cheerio.load(detailData);

                    infoboxData = extractInfoboxData($detail);

                    const infoboxImage = $detail('.infobox img').first();
                    if (infoboxImage.length) imageUrl = infoboxImage.attr('src') || '';
                    if (infoboxData.imageUrl) imageUrl = infoboxData.imageUrl;

                    $detail('.mw-parser-output > p').each((idx, el) => {
                        const text = $detail(el).text().trim();
                        if (!description && text.length > 50 && !text.includes('This article') && !text.includes('Infobox')) {
                            if ($detail(el).find('img').length === 0) {
                                description = text;
                            }
                        }
                    });

                    history = extractSection($detail, ['History']);
                    government = extractSection($detail, ['Government', 'Organization', 'Political']);
                    military = extractSection($detail, ['Military', 'Forces']);
                    behindTheScenes = extractSection($detail, ['Behind the Scenes']);
                    technologies = extractSection($detail, ['Technology', 'Mobile Weapons']);

                    faction.mobileWeapons = extractList($detail, 'Mobile Weapons');
                    if (faction.mobileWeapons.length === 0) faction.mobileWeapons = extractList($detail, 'Mobile Suit');
                    if (faction.mobileWeapons.length === 0) faction.mobileWeapons = extractList($detail, 'Mobile Armor');

                    faction.vehicles = extractList($detail, 'Vehicles');
                    faction.miscellaneous = extractList($detail, 'Miscellaneous');
                    faction.appearances = extractList($detail, 'Appearances');

                    information = extractSection($detail, ['Information']);

                } catch (e) {
                    console.error(`Failed detail fetch: ${faction.name}`);
                }
            }

            const mergedFaction = {
                ...faction,
                description,
                imageUrl,
                history,
                government,
                military,
                behindTheScenes,
                technologies,
                information,

                leaders: [...new Set([...faction.leaders, ...(infoboxData.leaders || [])])],
                purpose: infoboxData.purpose,
                sphereOfInfluence: infoboxData.sphereOfInfluence,
                allies: infoboxData.allies,
                enemies: infoboxData.enemies,
                firstSeen: infoboxData.firstSeen,
                lastSeen: infoboxData.lastSeen,

                mobileWeapons: [...new Set([...(faction.mobileWeapons || []), ...(infoboxData.mobileWeapons || [])])],
                vehicles: [...new Set([...(faction.vehicles || []), ...(infoboxData.vehicles || [])])],
            };

            for (const force of faction.forces.slice(0, 6)) {
                if (force.url) {
                    try {
                        const { data: forceData } = await axios.get(force.url);
                        const $force = cheerio.load(forceData);
                        const forceInfobox = extractInfoboxData($force);

                        $force('.mw-parser-output > p').each((idx, el) => {
                            const t = $force(el).text().trim();
                            if (!force.description && t.length > 30) force.description = t;
                        });

                        const forceImg = $force('.infobox img').first();
                        if (forceImg.length) force.imageUrl = forceImg.attr('src');

                        force.mobileWeapons = extractList($force, 'Mobile Weapons');
                        force.vehicles = extractList($force, 'Vehicles');
                        force.branches = extractList($force, 'Branches');
                        force.majorMilitaryBases = extractList($force, 'Bases');
                        if (force.majorMilitaryBases.length === 0) force.majorMilitaryBases = extractList($force, 'Major Military Bases');

                        force.members = extractList($force, 'Members');
                        if (force.members.length === 0) force.members = extractList($force, 'Notable Members');

                        force.militaryRanks = extractList($force, 'Ranks');

                        force.history = extractSection($force, ['History']);

                        force.purpose = forceInfobox.purpose;
                        force.ledBy = forceInfobox.leaders || [];
                        force.parent = forceInfobox.parent;
                        force.subdivisions = forceInfobox.subdivisions || [];
                        force.allies = forceInfobox.allies || [];
                        force.enemies = forceInfobox.enemies || [];
                        force.firstSeen = forceInfobox.firstSeen;
                        force.lastSeen = forceInfobox.lastSeen;
                        force.headquarters = forceInfobox.headquarters;

                        if (forceInfobox.mobileWeapons) {
                            force.mobileWeapons = [...new Set([...(force.mobileWeapons || []), ...forceInfobox.mobileWeapons])];
                        }
                        if (forceInfobox.vehicles) {
                            force.vehicles = [...new Set([...(force.vehicles || []), ...forceInfobox.vehicles])];
                        }

                    } catch (e) {
                    }
                }
            }

            try {
                await Faction.findOneAndUpdate(
                    { name: mergedFaction.name, activeEra: mergedFaction.activeEra },
                    mergedFaction,
                    { upsert: true, new: true }
                );
                count++;
            } catch (err: any) {
                console.error(`DB Write Error for ${mergedFaction.name}:`, err.message);
            }

            await new Promise(r => setTimeout(r, 150));
        }

        const keys = await redis.keys('factions:*');
        if (keys.length > 0) await redis.del(keys);

        console.log('Deep Seeding finished.');
        res.json({ message: `Deep Seeding Complete. Processed ${count} factions.` });
    } catch (error) {
        next(error);
    }
};

function processFactionLi($: any, li: any, eraName: string, factionsList: any[]) {
    const $factionLi = $(li);
    const directLink = $factionLi.find('a').first();
    let factionName = directLink.length ? directLink.text().trim() : $factionLi.clone().children('ul').remove().end().text().trim();
    const factionUrl = directLink.attr('href');
    factionName = factionName.replace(/^-\s*/, '').trim();

    if (!factionName) return;

    const factionData: any = {
        name: factionName,
        url: factionUrl ? BASE_URL + factionUrl : undefined,
        activeEra: eraName,
        forces: [],
        leaders: [],
        allies: [],
        enemies: [],
        appearances: [],
        vehicles: [],
        mobileWeapons: [],
        miscellaneous: []
    };

    const forcesUl = $factionLi.children('ul');
    if (forcesUl.length) {
        forcesUl.children('li').each((k: any, forceLi: any) => {
            const $forceLi = $(forceLi);
            const forceLink = $forceLi.find('a').first();
            let forceName = forceLink.length ? forceLink.text().trim() : $forceLi.clone().children('ul').remove().end().text().trim();
            forceName = forceName.replace(/^-\s*/, '').trim();
            if (!forceName) return;

            const forceUrl = forceLink.attr('href') ? BASE_URL + forceLink.attr('href') : undefined;

            const teams: string[] = [];
            const teamsUl = $forceLi.children('ul');
            if (teamsUl.length) {
                teamsUl.children('li').each((l: any, teamLi: any) => {
                    teams.push($(teamLi).text().trim().replace(/^-\s*/, ''));
                });
            }

            factionData.forces.push({
                name: forceName,
                url: forceUrl,
                teams: teams,
                mobileWeapons: [],
                vehicles: [],
                branches: [],
                members: [],
                militaryRanks: [],
                allies: [],
                enemies: [],
                subdivisions: [],
                ledBy: []
            });
        });
    }
    factionsList.push(factionData);
}
