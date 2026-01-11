import mongoose, { Document, Schema, CallbackError } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
    username: string;
    email: string;
    passwordHash: string;
    role: 'user' | 'admin';
    avatar?: string;
    createdAt: Date;
    comparePassword(password: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address']
    },
    passwordHash: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    avatar: {
        type: String,
        default: '/images/user/user-01.png'
    }
}, {
    timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function () {
    const user = this as unknown as IUser;

    if (!user.isModified('passwordHash')) {
        return;
    }

    const salt = await bcrypt.genSalt(10);
    user.passwordHash = await bcrypt.hash(user.passwordHash, salt);
});

UserSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
    const user = this as unknown as IUser;
    // Ensure we compare against the hash
    return await bcrypt.compare(password, user.passwordHash);
};

export const User = mongoose.model<IUser>('User', UserSchema);
