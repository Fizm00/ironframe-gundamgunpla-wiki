import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

redis.on('connect', () => {
    console.log('[CACHE] Redis Connected');
});

redis.on('error', (err) => {
    console.error('[CACHE] Redis Error:', err);
});

export default redis;
