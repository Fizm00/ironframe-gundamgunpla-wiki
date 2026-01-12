import express from 'express';

import { Faction } from '../models/Faction';
import { LoreMobileSuit } from '../models/LoreMobileSuit';
import { LoreCharacter } from '../models/LoreCharacter';

const RIVAL_MAP: Record<string, string[]> = {
    'Earth Federation': ['Zeon', 'Neo Zeon', 'Titans'],
    'Earth Federation Forces': ['Zeon', 'Neo Zeon', 'Titans'],
    'Earth Sphere Federation': ['Mafty', 'Zanscare Empire'],
    'Zeon': ['Earth Federation'],
    'Principality of Zeon': ['Earth Federation'],
    'Neo Zeon': ['Earth Federation', 'Londo Bell'],
    'Celestial Being': ['UN Forces', 'A-Laws', 'Innovators'],
    'Tekkadan': ['Gjallarhorn'],
    'Gjallarhorn': ['Tekkadan', 'McGillis Fareed Fleet'],
    'AEUG': ['Titans', 'Neo Zeon'],
    'Anti Earth Union Group': ['Titans', 'Neo Zeon'],
    'Titans': ['AEUG', 'Karaba', 'Earth Federation'],
    'Karaba': ['Titans']
};

const router = express.Router();

interface GraphNode {
    id: string;
    type: 'faction' | 'pilot' | 'mobile_suit' | 'tech';
    label: string;
    image?: string;
    description?: string;
    data?: any;
}

interface GraphEdge {
    id: string;
    source: string;
    target: string;
    label?: string;
}

interface NetworkResponse {
    nodes: GraphNode[];
    edges: GraphEdge[];
}

router.get('/network/:type/:id', async (req, res) => {
    try {
        const { type, id } = req.params;
        const nodes: GraphNode[] = [];
        const edges: GraphEdge[] = [];
        const processedIds = new Set<string>();

        const addNode = (n: GraphNode) => {
            if (!processedIds.has(n.id)) {
                nodes.push(n);
                processedIds.add(n.id);
            }
        };

        const addEdge = (source: string, target: string, label?: string) => {
            const edgeId = `${source}-${target}-${label || 'rel'}`;
            if (!edges.some(e => e.id === edgeId)) {
                edges.push({
                    id: edgeId,
                    source,
                    target,
                    label
                });
            }
        };

        if (type === 'faction') {
            const faction = await Faction.findById(id);
            if (!faction) return res.status(404).json({ message: 'Faction not found' });

            addNode({
                id: faction._id.toString(),
                type: 'faction',
                label: faction.name,
                image: faction.imageUrl,
                description: faction.description
            });

            if (faction.activeEra) {
                const eraId = `timeline-${faction.activeEra.replace(/\s+/g, '-')}`;
                addNode({
                    id: eraId,
                    type: 'faction',
                    label: faction.activeEra,
                    description: 'Timeline / Era'
                });
                addEdge(faction._id.toString(), eraId, 'Era');
            }

            const rivals = RIVAL_MAP[faction.name] || [];
            for (const rivalName of rivals) {
                const rival = await Faction.findOne({ name: { $regex: new RegExp(rivalName, 'i') } });
                if (rival) {
                    const rId = rival._id.toString();
                    addNode({
                        id: rId,
                        type: 'faction',
                        label: rival.name,
                        image: rival.imageUrl,
                        description: 'Hostile Force'
                    });
                    addEdge(faction._id.toString(), rId, 'Enemy');

                    const rQuery = {
                        $or: [
                            { name: { $in: rival.leaders || [] } },
                            { "profile.Affiliation": { $regex: new RegExp(rival.name, 'i') } },
                            { "profile.Allegiance": { $regex: new RegExp(rival.name, 'i') } }
                        ]
                    };

                    const enemyPilots = await LoreCharacter.find(rQuery).limit(5);
                    enemyPilots.forEach(ep => {
                        const epId = ep._id.toString();
                        addNode({
                            id: epId,
                            type: 'pilot',
                            label: ep.name,
                            image: ep.imageUrl,
                            description: `Hostile: ${rival.name}`
                        });
                        addEdge(rId, epId, 'Key Figure');
                    });
                }
            }

            if (faction.leaders && faction.leaders.length > 0) {
                const cleanNames = faction.leaders.map(l => l.replace(/\[.*?\]/g, '').trim());

                const leaders = await LoreCharacter.find({
                    name: { $in: [...faction.leaders, ...cleanNames] }
                });

                leaders.forEach(leader => {
                    const lId = leader._id.toString();
                    addNode({
                        id: lId,
                        type: 'pilot',
                        label: leader.name,
                        image: leader.imageUrl,
                        description: `Leader of ${faction.name}`
                    });
                    addEdge(faction._id.toString(), lId, 'Leader');
                });
            }

            const msQuery = {
                $or: [
                    { faction: faction._id },
                    { "production.Operator": faction.name },
                    { "production.Manufacturer": faction.name },
                    { "production.Affiliation": faction.name },
                    { "production.Operator": { $regex: new RegExp(faction.name, 'i') } },
                    { "production.Manufacturer": { $regex: new RegExp(faction.name, 'i') } }
                ]
            };

            const mobileSuits = await LoreMobileSuit.find(msQuery).limit(15);

            mobileSuits.forEach(ms => {
                const msId = ms._id.toString();
                addNode({
                    id: msId,
                    type: 'mobile_suit',
                    label: ms.name,
                    image: ms.imageUrl,
                    description: ms.series
                });
                addEdge(faction._id.toString(), msId, 'Developed/Used');
            });
        }

        else if (type === 'pilot') {
            const pilot = await LoreCharacter.findById(id);
            if (!pilot) return res.status(404).json({ message: 'Pilot not found' });

            const pId = pilot._id.toString();

            addNode({
                id: pId,
                type: 'pilot',
                label: pilot.name,
                image: pilot.imageUrl,
                description: pilot.series
            });

            const factionsLed = await Faction.find({
                leaders: { $in: [pilot.name, new RegExp(pilot.name, 'i')] }
            });
            const profile = pilot.profile instanceof Map ? Object.fromEntries(pilot.profile) : pilot.profile;
            const affiliation = profile?.['Affiliation'] || profile?.['Allegiance'];

            let factionsAffiliated: any[] = [];
            if (affiliation && typeof affiliation === 'string') {
                const keywords = affiliation.split(/[\s,;]+/).filter(w => w.length > 3 && !['Forces', 'Army', 'Unit', 'Group'].includes(w));

                if (keywords.length > 0) {
                    const potentialFactions = await Faction.find({
                        name: { $in: keywords.map(k => new RegExp(k, 'i')) }
                    });
                    factionsAffiliated = potentialFactions.filter(f => {
                        return new RegExp(f.name, 'i').test(affiliation) || affiliation.includes(f.name);
                    });
                }
            }

            const uniqueFactions = new Map();
            [...factionsLed, ...factionsAffiliated].forEach(f => uniqueFactions.set(f._id.toString(), f));

            for (const f of uniqueFactions.values()) {
                const fId = f._id.toString();
                addNode({
                    id: fId,
                    type: 'faction',
                    label: f.name,
                    image: f.imageUrl,
                    description: 'Affiliation'
                });

                const isLeader = factionsLed.some(led => led._id.toString() === fId);
                addEdge(pId, fId, isLeader ? 'Leader' : 'Affiliated');

                const rivalNames = RIVAL_MAP[f.name] || [];
                for (const rName of rivalNames) {
                    const rFaction = await Faction.findOne({ name: { $regex: new RegExp(rName, 'i') } });
                    if (rFaction) {
                        const rQuery = {
                            $or: [
                                { name: { $in: rFaction.leaders || [] } },
                                { "profile.Affiliation": { $regex: new RegExp(rFaction.name, 'i') } },
                                { "profile.Allegiance": { $regex: new RegExp(rFaction.name, 'i') } }
                            ]
                        };

                        const rEnemies = await LoreCharacter.find(rQuery).limit(5);

                        rEnemies.forEach(rl => {
                            const rlId = rl._id.toString();
                            if (rlId === pId) return;

                            addNode({
                                id: rlId,
                                type: 'pilot',
                                label: rl.name,
                                image: rl.imageUrl,
                                description: 'Hostile Pilot'
                            });
                            addEdge(pId, rlId, 'Enemy');
                        });
                    }
                }
            }

            if (pilot.mecha && pilot.mecha.length > 0) {
                const cleanMecha = pilot.mecha.map(m => m.replace(/\[.*?\]/g, '').trim());

                const msList = await LoreMobileSuit.find({
                    name: { $in: [...pilot.mecha, ...cleanMecha] }
                });

                msList.forEach(ms => {
                    const msId = ms._id.toString();
                    addNode({
                        id: msId,
                        type: 'mobile_suit',
                        label: ms.name,
                        image: ms.imageUrl,
                        description: ms.series
                    });
                    addEdge(pilot._id.toString(), msId, 'Piloted');
                });
            }
        }

        else if (type === 'mobile_suit') {
            const ms = await LoreMobileSuit.findById(id).populate('faction');
            if (!ms) return res.status(404).json({ message: 'Mobile Suit not found' });

            const msId = ms._id.toString();

            addNode({
                id: msId,
                type: 'mobile_suit',
                label: ms.name,
                image: ms.imageUrl,
                description: ms.series
            });

            if (ms.faction) {
                let fId: string | null = null;
                let fName: string = '';
                let fImg: string | undefined = undefined;

                if (typeof ms.faction === 'object' && '_id' in ms.faction) {
                    const f = ms.faction as any;
                    fId = f._id.toString();
                    fName = f.name;
                    fImg = f.imageUrl;
                } else if (typeof ms.faction === 'string') {
                    const f = await Faction.findOne({
                        $or: [{ _id: ms.faction }, { name: ms.faction }]
                    });
                    if (f) {
                        fId = f._id.toString();
                        fName = f.name;
                        fImg = f.imageUrl;
                    }
                }

                if (fId) {
                    addNode({
                        id: fId,
                        type: 'faction',
                        label: fName,
                        image: fImg,
                        description: 'Developer/Operator'
                    });
                    addEdge(fId, msId, 'Developed');
                }
            }

            if (ms.knownPilots && ms.knownPilots.length > 0) {
                const cleanPilots = ms.knownPilots.map(p => p.replace(/\[.*?\]/g, '').trim());

                const pilots = await LoreCharacter.find({
                    name: { $in: [...ms.knownPilots, ...cleanPilots] }
                });

                pilots.forEach(p => {
                    const pId = p._id.toString();
                    addNode({
                        id: pId,
                        type: 'pilot',
                        label: p.name,
                        image: p.imageUrl
                    });
                    addEdge(pId, msId, 'Piloted');
                });
            }
        }

        res.json({ nodes, edges });

    } catch (error) {
        console.error('Graph Error:', error);
        res.status(500).json({ message: 'Server Graph Error' });
    }
});

router.get('/roots', async (req, res) => {
    try {
        const factions = await Faction.find({
            name: { $in: [/Zeon/i, 'Earth Federation', 'Celestial Being', 'Tekkadan'] }
        });

        const nodes = factions.map(f => ({
            id: f._id.toString(),
            type: 'faction',
            label: f.name,
            image: f.imageUrl,
            description: f.activeEra
        }));

        res.json({ nodes });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching roots' });
    }
});

export default router;
