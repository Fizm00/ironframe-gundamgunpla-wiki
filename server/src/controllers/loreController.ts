import { Request, Response } from 'express';
import { LoreMobileSuit } from '../models/LoreMobileSuit';

export const getLoreMobileSuits = async (req: Request, res: Response) => {
    try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 20;
        const search = req.query.search as string;
        const series = req.query.series as string;

        const query: any = {};
        if (search) {
            query.$text = { $search: search };
        }
        if (series) {
            query.series = series;
        }

        const skip = (page - 1) * limit;

        const [suits, total] = await Promise.all([
            LoreMobileSuit.find(query)
                .sort(search ? { score: { $meta: 'textScore' } } : { name: 1 })
                .skip(skip)
                .limit(limit),
            LoreMobileSuit.countDocuments(query)
        ]);

        res.json({
            mobileSuits: suits,
            page,
            pages: Math.ceil(total / limit),
            total
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getLoreMobileSuitById = async (req: Request, res: Response) => {
    try {
        const suit = await LoreMobileSuit.findById(req.params.id);
        if (!suit) {
            return res.status(404).json({ message: 'Lore Mobile Suit not found' });
        }
        res.json(suit);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getLoreSeriesList = async (req: Request, res: Response) => {
    try {
        const series = await LoreMobileSuit.distinct('series');
        res.json(series);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const uploadMobileSuitImage = async (req: Request, res: Response) => {
    try {
        if (!req.file) {
            return res.status(400).json({ message: 'No image file provided' });
        }

        const suit = await LoreMobileSuit.findById(req.params.id);
        if (!suit) {
            return res.status(404).json({ message: 'Lore Mobile Suit not found' });
        }

        const protocol = req.protocol;
        const host = req.get('host');
        const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`;

        suit.imageUrl = imageUrl;
        await suit.save();

        res.json({
            message: 'Image uploaded successfully',
            imageUrl: suit.imageUrl
        });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------------------------------
// Create Logic
// ------------------------------------------------------------------
export const createLoreMobileSuit = async (req: Request, res: Response) => {
    try {
        const { name, url } = req.body;

        // Basic validation
        if (!name || !url) {
            return res.status(400).json({ message: 'Name and URL are required' });
        }

        const existingSuit = await LoreMobileSuit.findOne({ url });
        if (existingSuit) {
            return res.status(400).json({ message: 'Mobile Suit with this URL already exists' });
        }

        const suit = await LoreMobileSuit.create(req.body);
        res.status(201).json(suit);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------------------------------
// Update Logic
// ------------------------------------------------------------------
export const updateLoreMobileSuit = async (req: Request, res: Response) => {
    try {
        const suit = await LoreMobileSuit.findById(req.params.id);

        if (!suit) {
            return res.status(404).json({ message: 'Lore Mobile Suit not found' });
        }

        const updatedSuit = await LoreMobileSuit.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        res.json(updatedSuit);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

// ------------------------------------------------------------------
// Delete Logic
// ------------------------------------------------------------------
export const deleteLoreMobileSuit = async (req: Request, res: Response) => {
    try {
        const suit = await LoreMobileSuit.findById(req.params.id);

        if (!suit) {
            return res.status(404).json({ message: 'Lore Mobile Suit not found' });
        }

        await suit.deleteOne();
        res.json({ message: 'Lore Mobile Suit removed' });
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};

export const getLoreMobileSuitsBatch = async (req: Request, res: Response) => {
    try {
        const { names } = req.body;
        if (!names || !Array.isArray(names) || names.length === 0) {
            return res.json({});
        }

        // Create expanded query set
        const cleanNames = names.map(n => {
            // Remove citations [1], [2]
            let clean = n.replace(/\[\d+\]/g, '').trim();
            // Remove (variants) for fallback
            const base = clean.replace(/\s*\(.*?\)/g, '').trim();
            // Extract Model Number (e.g. RGM-79, MS-06, RX-78-2)
            // Pattern: start of string, letters-numbers, maybe punctuation
            const modelMatch = n.match(/^([A-Z]+-[A-Z0-9]+(?:-[A-Z0-9]+)?)/i);
            const model = modelMatch ? modelMatch[1] : '';

            return { original: n, clean, base, model };
        });

        // Collect all potential terms to search
        const searchTerms = new Set<string>();
        cleanNames.forEach(x => {
            if (x.clean.length > 2) searchTerms.add(x.clean);
            if (x.base.length > 2) searchTerms.add(x.base);
            if (x.model.length > 3) searchTerms.add(x.model);
        });

        // Search for any documents matching these terms (contains match)
        // We use $or with regex for each term
        const regexQueries = Array.from(searchTerms).map(term => ({
            name: { $regex: term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), $options: 'i' }
        }));

        if (regexQueries.length === 0) return res.json({});

        const suits = await LoreMobileSuit.find({ $or: regexQueries })
            .select('name imageUrl')
            .lean();

        const imageMap: Record<string, string> = {};

        // Match them back
        names.forEach(originalName => {
            // 1. Try Specific Match (Original or Clean)
            // We want the DB name to CONTAIN the search term? 
            // No, usually we want the DB name to BE the search term, or close.
            // But here we are doing Reverse: List has "GM", DB has "RGM-79 GM". -> DB contains Name.
            // List has "GM (RFV)", DB has "RGM-79 GM". -> Name contains DB? 

            // Strategy:
            // Find a suit where suit.name contains baseName OR baseName contains suit.name

            let clean = originalName.replace(/\[\d+\]/g, '').trim();
            let base = clean.replace(/\s*\(.*?\)/g, '').trim();
            const modelMatch = originalName.match(/^([A-Z]+-[A-Z0-9]+(?:-[A-Z0-9]+)?)/i);
            const model = modelMatch ? modelMatch[1] : '';

            const cleanRegex = new RegExp(clean.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');

            // 1. Try Specific Match
            let match = suits.find(s => cleanRegex.test(s.name) || (s.name.includes(clean)));

            // 2. Base Name Fallback
            if (!match && base.length > 2) {
                match = suits.find(s => s.name.includes(base) || base.includes(s.name));
            }

            // 3. Model Number Fallback (High Confidence)
            if (!match && model.length > 3) {
                // Strict start match for model number to avoid false positives?
                // or contains. "RGM-79" should match "RGM-79 GM".
                match = suits.find(s => s.name.includes(model));
            }

            if (match && match.imageUrl) {
                imageMap[originalName] = match.imageUrl;
            }
        });

        res.json(imageMap);
    } catch (error: any) {
        res.status(500).json({ message: error.message });
    }
};
