import express from 'express';
import { protect, adminOnly as admin } from '../middleware/authMiddleware';
import { getStats, getFactionDistribution, getTimelineDistribution, getMobileSuitStats, getGrowthStats } from '../controllers/analyticsController';

const router = express.Router();

router.get('/stats', protect, admin, getStats);
router.get('/factions', protect, admin, getFactionDistribution);
router.get('/timeline', protect, admin, getTimelineDistribution);
router.get('/mobile-suits', protect, admin, getMobileSuitStats);
router.get('/growth', protect, admin, getGrowthStats);

export default router;
