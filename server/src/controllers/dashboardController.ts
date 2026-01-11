
import os from 'os';
import { Request, Response, NextFunction } from 'express';
import { MobileSuit } from '../models/MobileSuit'; // Gunpla Kits
import { Pilot } from '../models/Pilot';
import { Faction } from '../models/Faction';
import { LoreMobileSuit } from '../models/LoreMobileSuit'; // Total Units
import { LoreCharacter } from '../models/LoreCharacter';
import { ActivityLog } from '../models/ActivityLog';
import redis from '../config/redis';
// @route   GET /api/dashboard/stats
// @access  Private/Admin
import mongoose from 'mongoose';

// @route   GET /api/dashboard/stats
// @access  Private/Admin
export const getDashboardStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const cacheKey = 'dashboard:stats:v4'; // Increment version to force refresh
        const cachedData = await redis.get(cacheKey);

        if (cachedData) {
            return res.json(JSON.parse(cachedData));
        }

        // Calculate 30 days ago date for "vs last month" comparison
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        // Get Real-time Database Stats
        const dbStats = await mongoose.connection.db?.stats();
        const dbSizeMB = dbStats ? (dbStats.dataSize / 1024 / 1024).toFixed(2) : '0';

        // Get Real-time Redis Stats
        const redisInfo = await redis.info();
        // Parse Redis Info for Hit Rate
        const hitsMatch = redisInfo.match(/keyspace_hits:(\d+)/);
        const missesMatch = redisInfo.match(/keyspace_misses:(\d+)/);
        const hits = hitsMatch ? parseInt(hitsMatch[1]) : 0;
        const misses = missesMatch ? parseInt(missesMatch[1]) : 0;
        const totalOps = hits + misses;
        // Default to 100% if no ops yet (fresh server)
        const cacheEfficiency = totalOps > 0 ? ((hits / totalOps) * 100).toFixed(1) : '100';

        // Parallel execution for performance
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
            // Current Totals
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

        // Helper to calculate percentage change
        const calculateTrend = (current: number, previous: number) => {
            if (previous === 0) return current > 0 ? 100 : 0;
            return Number((((current - previous) / previous) * 100).toFixed(1));
        };

        const unitTrend = calculateTrend(totalUnits, unitsLastMonth);
        const gunplaTrend = calculateTrend(totalGunpla, gunplaLastMonth);
        const pilotTrend = calculateTrend(totalPilots, pilotsLastMonth);

        // Calculate Real System Load (Memory Usage)
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
                memoryUsage,      // % of RAM used
                dbSizeMB,         // MongoDB Data Size in MB
                cacheEfficiency   // Redis Hit Rate %
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
                ] // Mocked for historical demo
            },
            trends: {
                units: unitTrend,
                gunpla: gunplaTrend,
                pilots: pilotTrend
            }
        };

        // Cache for 60 seconds (Real-time stats need faster refresh)
        await redis.setex(cacheKey, 60, JSON.stringify(stats));

        res.json(stats);
    } catch (error) {
        next(error);
    }
};
