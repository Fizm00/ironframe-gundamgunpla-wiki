import { Request, Response } from 'express';
import { LoreMobileSuit } from '../models/LoreMobileSuit';
import { Pilot } from '../models/Pilot';
import { Faction } from '../models/Faction';
import { geminiService } from '../services/geminiService';

export const chatController = {
    askHaro: async (req: Request, res: Response) => {
        try {
            const { query } = req.body;

            if (!query) {
                return res.status(400).json({ message: "Query is required" });
            }

            const [msResults, pilotResults, factionResults] = await Promise.all([
                LoreMobileSuit.find(
                    { $text: { $search: query } },
                    { score: { $meta: "textScore" } }
                ).sort({ score: { $meta: "textScore" } }).limit(10).lean(),

                Pilot.find(
                    { $text: { $search: query } },
                    { score: { $meta: "textScore" } }
                ).sort({ score: { $meta: "textScore" } }).limit(5).lean(),

                Faction.find(
                    { $text: { $search: query } },
                    { score: { $meta: "textScore" } }
                ).sort({ score: { $meta: "textScore" } }).limit(3).lean()
            ]);

            let contextData = "";

            msResults.forEach(ms => {
                contextData += `[Mobile Suit: ${ms.name}] Description: ${ms.description}. Specs: ${JSON.stringify(ms.specifications)}. Technology: ${JSON.stringify(ms.performance)}. \n`;
            });

            pilotResults.forEach(pilot => {
                contextData += `[Pilot: ${pilot.name}] Description: ${pilot.description}. Status: ${pilot.status}. \n`;
            });

            factionResults.forEach(faction => {
                contextData += `[Faction: ${faction.name}] Description: ${faction.description}. \n`;
            });

            if (!contextData) {
                contextData = "No specific database records found for this query.";
            }

            const answer = await geminiService.chatWithHaro(query, contextData);

            res.json({ answer, contextUsed: msResults.length + pilotResults.length + factionResults.length });

        } catch (error) {
            console.error("Chat Error:", error);
            res.status(500).json({ message: "Haro malfunctioned!" });
        }
    }
};
