
import { ActivityLog } from '../models/ActivityLog';

export const logActivity = async (action: string, entity: string, details: string, user: string) => {
    try {
        await ActivityLog.create({
            action,
            entity,
            details,
            user
        });
    } catch (error) {
        console.error('Failed to log activity:', error);
    }
};
