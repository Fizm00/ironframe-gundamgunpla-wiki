import Redis from 'ioredis';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(__dirname, '../.env') });

const redis = new Redis({
    host: process.env.REDIS_HOST || 'localhost',
    port: parseInt(process.env.REDIS_PORT || '6379'),
    password: process.env.REDIS_PASSWORD || undefined,
});

const flush = async () => {
    console.log('Connecting to Redis...');
    const keys = await redis.keys('factions:*');
    console.log(`Found ${keys.length} faction cache keys.`);

    if (keys.length > 0) {
        await redis.del(keys);
        console.log('Deleted keys:', keys);
    } else {
        console.log('No keys to delete.');
    }

    // Also flush logs or character keys if needed, but safely just factions for now

    redis.disconnect();
    console.log('Done.');
};

flush();
