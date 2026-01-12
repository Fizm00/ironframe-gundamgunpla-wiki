
import os from 'os';
import { Request, Response, NextFunction } from 'express';
import { MobileSuit } from '../models/MobileSuit';
import { Pilot } from '../models/Pilot';
import { Faction } from '../models/Faction';
import { LoreMobileSuit } from '../models/LoreMobileSuit';
import { LoreCharacter } from '../models/LoreCharacter';
import { ActivityLog } from '../models/ActivityLog';
import redis from '../config/redis';
import mongoose from 'mongoose';

export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cacheKey = 'dashboard:stats:v4';
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const dbStats = await mongoose.connection.db?.stats();
        const dbSizeMB = dbStats ? (dbStats.dataSize / 1024 / 1024).toFixed(2) : '0';

        const redisInfo = await redis.info();
        const hitsMatch = redisInfo.match(/keyspace_hits:(\d+)/);
        const missesMatch = redisInfo.match(/keyspace_misses:(\d+)/);
        const hits = hitsMatch ? parseInt(hitsMatch[1]) : 0;
        const misses = missesMatch ? parseInt(missesMatch[1]) : 0;
        const totalOps = hits + misses;
        const cacheEfficiency = totalOps > 0 ? ((hits / totalOps) * 100).toFixed(1) : '100';

        const [
            totalUnits,
            unitsLastMonth,
            totalGunpla,
            gunplaLastMonth,
            totalPilots,
            pilotsLastMonth,
            totalFactions,
            recentActivities,
            unitsPerFaction
        ] = await Promise.all([
            LoreMobileSuit.countDocuments(),
            LoreMobileSuit.countDocuments({ createdAt: { $lt: thirtyDaysAgo } }),

            MobileSuit.countDocuments(),
            MobileSuit.countDocuments({ createdAt: { $lt: thirtyDaysAgo } }),

            LoreCharacter.countDocuments(),
            LoreCharacter.countDocuments({ createdAt: { $lt: thirtyDaysAgo } }),

            Faction.countDocuments(),
            ActivityLog.find().sort({ timestamp: -1 }).limit(10),
            LoreMobileSuit.aggregate([
                { $group: { _id: "$series", count: { $sum: 1 } } },
                { $sort: { count: -1 } },
                { $limit: 20 }
            ])
        ]);

        const calculateTrend = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Number((((current - previous) / previous) * 100).toFixed(1));
        };

        const unitTrend = calculateTrend(totalUnits, unitsLastMonth);
        const gunplaTrend = calculateTrend(totalGunpla, gunplaLastMonth);
        const pilotTrend = calculateTrend(totalPilots, pilotsLastMonth);

        const totalMem = os.totalmem();
        const freeMem = os.freemem();
        const usedMem = totalMem - freeMem;
        const memoryUsage = Math.round((usedMem / totalMem) * 100);

        const stats = {
            totalUnits,
            totalGunpla,
            totalPilots,
            totalFactions,
            systemStatus: {
                memoryUsage,
                dbSizeMB,
                cacheEfficiency
            },
            recentActivities,
            chartData: {
                unitsPerFaction: unitsPerFaction.map(f => ({ name: f._id || 'Unknown', value: f.count })),
                growthTrends: [
                    { name: 'Jan', units: 30, pilots: 10 },
                    { name: 'Feb', units: 45, pilots: 25 },
                    { name: 'Mar', units: 50, pilots: 35 },
                    { name: 'Apr', units: 70, pilots: 45 },
                    { name: 'May', units: 90, pilots: 60 },
                    { name: 'Jun', units: totalUnits, pilots: totalPilots },
                ]
            },
            trends: {
                units: unitTrend,
                gunpla: gunplaTrend,
                pilots: pilotTrend
            }
        };

        await redis.setex(cacheKey, 60, JSON.stringify(stats));

        res.json(stats);
    } catch (error) {
        next(error);
    }
};
