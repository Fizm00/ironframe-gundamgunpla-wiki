import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import hpp from 'hpp';
const xss = require('xss-clean');
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import mobileSuitRoutes from './routes/mobileSuitRoutes';
import pilotRoutes from './routes/pilotRoutes';
import factionRoutes from './routes/factionRoutes';
import timelineRoutes from './routes/timelineRoutes';
import loreRoutes from './routes/loreRoutes';
import dashboardRoutes from './routes/dashboardRoutes';
import loreCharacterRoutes from './routes/loreCharacterRoutes';
import supportRoutes from './routes/supportRoutes';
import userRoutes from './routes/userRoutes';
import analyticsRoutes from './routes/analyticsRoutes';
import chatRoutes from './routes/chatRoutes';
import relationshipsRoutes from './routes/relationships';
import { errorHandler } from './middleware/errorMiddleware';

import { geminiService } from './services/geminiService';

dotenv.config();
connectDB();
geminiService.testConnection();


const app = express();
const PORT = process.env.PORT || 5000;

app.use(helmet({
    crossOriginResourcePolicy: { policy: "cross-origin" }
}));
app.use(cors());
app.use(express.json({ limit: '10kb' }));
const limiter = rateLimit({
    windowMs: 10 * 60 * 1000,
    max: 1000,
    message: 'Too many requests from this IP, please try again after 10 minutes'
});
app.use('/api', limiter);
app.use(mongoSanitize());
app.use(xss());
app.use(hpp());
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/', (req, res) => {
    res.json({ message: 'IRONFRAME API Operational', timestamp: new Date().toISOString() });
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', uptime: process.uptime() });
});

app.use('/api/auth', authRoutes);
app.use('/api/mobile-suits', mobileSuitRoutes);
app.use('/api/pilots', pilotRoutes);
app.use('/api/factions', factionRoutes);
app.use('/api/timeline', timelineRoutes);
app.use('/api/lore', loreRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/api/lore-characters', loreCharacterRoutes);
app.use('/api/support', supportRoutes);
app.use('/api/users', userRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/relationships', relationshipsRoutes);

app.use(errorHandler);

app.listen(PORT, () => {
    console.log(`[SYSTEM] Server running on port ${PORT}`);
});
