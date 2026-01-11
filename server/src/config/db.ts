import mongoose from 'mongoose';

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/ironframe');
        console.log(`[DATABASE] MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`[DATABASE] Error: ${error instanceof Error ? error.message : 'Unknown Error'}`);
        process.exit(1);
    }
};
