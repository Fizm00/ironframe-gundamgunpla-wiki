import { Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Faction } from '../models/Faction';
import { MobileSuit } from '../models/MobileSuit';
import { Pilot } from '../models/Pilot';
import { Timeline } from '../models/Timeline';
import { TimelineEvent } from '../models/TimelineEvent';

// @desc    Get dashboard statistics
// @route   GET /api/analytics/stats
// @access  Private/Admin
export const getStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const [
            usersCount,
            factionsCount,
            mobileSuitsCount,
            pilotsCount,
            timelinesCount,
            eventsCount
        ] = await Promise.all([
            User.countDocuments(),
            Faction.countDocuments(),
            MobileSuit.countDocuments(),
            Pilot.countDocuments(),
            Timeline.countDocuments(),
            TimelineEvent.countDocuments()
        ]);

        // Mock trends for now (random between -5% and +15%)
        const getTrend = () => {
            const val = Math.floor(Math.random() * 20) - 5;
            return { value: `${val > 0 ? '+' : ''}${val}%`, direction: val >= 0 ? 'up' : 'down' };
        };

        res.json({
            users: { value: usersCount, trend: getTrend() },
            factions: { value: factionsCount, trend: getTrend() },
            mobileSuits: { value: mobileSuitsCount, trend: getTrend() },
            pilots: { value: pilotsCount, trend: getTrend() },
            timelines: { value: timelinesCount, trend: { value: '0%', direction: 'neutral' } }, // Timelines don't change often
            events: { value: eventsCount, trend: getTrend() }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get faction distribution (Pilots count per faction)
// @route   GET /api/analytics/factions
// @access  Private/Admin
export const getFactionDistribution = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const topFactions = await Pilot.aggregate([
            { $group: { _id: "$faction", count: { $sum: 1 } } },
            { $sort: { count: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: "factions",
                    localField: "_id",
                    foreignField: "_id",
                    as: "factionInfo"
                }
            },
            { $unwind: "$factionInfo" },
            {
                $project: {
                    name: "$factionInfo.name",
                    count: 1
                }
            }
        ]);

        res.json(topFactions);
    } catch (error) {
        next(error);
    }
};

// @desc    Get timeline distribution (Events per Era)
// @route   GET /api/analytics/timeline
// @access  Private/Admin
export const getTimelineDistribution = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const eventsPerTimeline = await TimelineEvent.aggregate([
            { $group: { _id: "$timeline", count: { $sum: 1 } } },
            {
                $lookup: {
                    from: "timelines",
                    localField: "_id",
                    foreignField: "_id",
                    as: "timelineInfo"
                }
            },
            { $unwind: "$timelineInfo" },
            { $sort: { "timelineInfo.order": 1 } },
            {
                $project: {
                    name: "$timelineInfo.name",
                    count: 1
                }
            }
        ]);

        res.json(eventsPerTimeline);
    } catch (error) {
        next(error);
    }
};

// @desc    Get Mobile Suit Type Distribution
// @route   GET /api/analytics/mobile-suits
// @access  Private/Admin
export const getMobileSuitStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Attempt to categorize by name if "type" field isn't reliable or present
        // Regex classification
        const gundams = await MobileSuit.countDocuments({ name: { $regex: 'Gundam', $options: 'i' } });
        const zakus = await MobileSuit.countDocuments({ name: { $regex: 'Zaku', $options: 'i' } });
        const gms = await MobileSuit.countDocuments({ name: { $regex: 'GM', $options: 'i' } });
        const others = await MobileSuit.countDocuments({
            name: { $not: { $regex: 'Gundam|Zaku|GM', $options: 'i' } }
        });

        res.json([
            { name: 'Gundam-Type', count: gundams },
            { name: 'Zaku-Type', count: zakus },
            { name: 'GM-Type', count: gms },
            { name: 'Others', count: others }
        ]);
    } catch (error) {
        next(error);
    }
};

// @desc    Get Growth Stats (Mocked for now)
// @route   GET /api/analytics/growth
// @access  Private/Admin
export const getGrowthStats = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // In a real app, we'd aggregate User.createdAt
        // Mocking last 6 months
        const months = ['Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const userGrowth = [12, 19, 30, 45, 60, 85];
        const pilotGrowth = [5, 12, 18, 25, 40, 55];

        res.json({
            categories: months,
            series: [
                { name: 'New Users', data: userGrowth },
                { name: 'New Pilots', data: pilotGrowth }
            ]
        });
    } catch (error) {
        next(error);
    }
};
