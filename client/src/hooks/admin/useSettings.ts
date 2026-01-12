import { useState } from 'react';
import { authService } from '@/services/auth';
import api from '@/lib/api';

export function useProfileSettings() {
    const user = authService.getCurrentUser();
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);

    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        avatar: user?.avatar || null as File | string | null,
        avatarPreview: user?.avatar && !user.avatar.startsWith('http') ? `http://localhost:5000${user.avatar}` : (user?.avatar || '/images/user/user-01.png')
    });

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setProfileData({
                ...profileData,
                avatar: file,
                avatarPreview: URL.createObjectURL(file)
            });
        }
    };

    const updateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);

        const formData = new FormData();
        formData.append('username', profileData.username);
        formData.append('email', profileData.email);
        if (profileData.avatar instanceof File) {
            formData.append('avatar', profileData.avatar);
        }

        try {
            const { data } = await api.put('/auth/profile', formData, {
                headers: { 'Content-Type': 'multipart/form-data' }
            });

            const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
            const updatedUser = { ...currentUser, ...data };
            localStorage.setItem('user', JSON.stringify(updatedUser));

            setMessage({ type: 'success', text: 'Profile updated successfully' });

        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update profile' });
        } finally {
            setIsLoading(false);
        }
    };

    return { profileData, setProfileData, handleAvatarChange, updateProfile, isLoading, message };
}

export function useAccountSettings() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const updatePassword = async (e: React.FormEvent) => {
        e.preventDefault();
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'New passwords do not match' });
            return;
        }
        setIsLoading(true);
        setMessage(null);
        try {
            await api.put('/auth/password', {
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: 'success', text: 'Password updated successfully' });
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (error: any) {
            setMessage({ type: 'error', text: error.response?.data?.message || 'Failed to update password' });
        } finally {
            setIsLoading(false);
        }
    };

    return { passwordData, setPasswordData, updatePassword, isLoading, message };
}

export function useSupportSettings() {
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const [supportTicket, setSupportTicket] = useState({
        subject: '',
        message: '',
    });

    const submitTicket = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage(null);
        try {
            const { data } = await api.post('/support', supportTicket);
            setMessage({ type: 'success', text: `Support ticket submitted successfully. Ticket ID: ${data._id}` });
            setSupportTicket({ subject: '', message: '' });
        } catch (error: any) {
            setMessage({ type: 'error', text: 'Failed to submit ticket' });
        } finally {
            setIsLoading(false);
        }
    };

    return { supportTicket, setSupportTicket, submitTicket, isLoading, message };
}
