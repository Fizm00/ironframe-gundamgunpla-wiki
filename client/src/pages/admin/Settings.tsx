
import { useState, useEffect } from 'react';
import { authService } from '@/services/auth';
import { User, Lock, Mail, Save, AlertCircle, CheckCircle, Camera } from 'lucide-react';
import api from '@/lib/api';
import { useLocation } from 'react-router-dom';

export function Settings() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'profile';

    const [activeTab, setActiveTab] = useState(initialTab);
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null);
    const user = authService.getCurrentUser();

    const [profileData, setProfileData] = useState({
        username: user?.username || '',
        email: user?.email || '',
        avatar: user?.avatar || null as File | string | null,
        avatarPreview: user?.avatar && !user.avatar.startsWith('http') ? `http://localhost:5000${user.avatar}` : (user?.avatar || '/images/user/user-01.png')
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
    });

    const [supportTicket, setSupportTicket] = useState({
        subject: '',
        message: '',
    });

    useEffect(() => {
        const tab = queryParams.get('tab');
        if (tab && ['profile', 'account', 'support'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

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

    const handleProfileUpdate = async (e: React.FormEvent) => {
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

    const handlePasswordUpdate = async (e: React.FormEvent) => {
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

    const handleSupportSubmit = async (e: React.FormEvent) => {
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
    }

    const tabs = [
        { id: 'profile', label: 'Edit Profile', icon: User },
        { id: 'account', label: 'Account Settings', icon: Lock },
        { id: 'support', label: 'Support', icon: Mail },
    ];

    return (
        <div className="mx-auto max-w-4xl p-4 md:p-6 2xl:p-10">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-gray-900 dark:text-white">
                    Settings
                </h2>
            </div>

            {message && (
                <div className={`mb-6 flex items-center gap-2 rounded-lg p-4 ${message.type === 'success' ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400' : 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400'
                    }`}>
                    {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    {message.text}
                </div>
            )}

            <div className="flex flex-col gap-8">
                <div className="flex border-b border-gray-200 dark:border-gray-800 overflow-x-auto">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        return (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`flex items-center gap-2 py-4 px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap hover:text-brand-500 dark:hover:text-brand-400 ${activeTab === tab.id
                                    ? 'border-brand-500 text-brand-500'
                                    : 'border-transparent text-gray-500 hover:border-gray-300 dark:text-gray-400 dark:hover:border-gray-700'
                                    }`}
                            >
                                <Icon className="w-4 h-4" />
                                {tab.label}
                            </button>
                        );
                    })}
                </div>

                <div className="mt-4">
                    {activeTab === 'profile' && (
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="border-b border-gray-200 py-4 px-6 dark:border-gray-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Profile Information
                                </h3>
                            </div>
                            <form onSubmit={handleProfileUpdate} className="p-6">
                                <div className="mb-6 flex items-center gap-3">
                                    <div className="relative h-16 w-16 rounded-full">
                                        <img
                                            src={profileData.avatarPreview as string}
                                            alt="User Avatar"
                                            className="h-full w-full rounded-full object-cover border border-gray-200 dark:border-gray-700"
                                        />
                                        <label
                                            htmlFor="profile"
                                            className="absolute bottom-0 right-0 z-10 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-brand-500 text-white shadow-md hover:bg-brand-600 transition-all duration-200"
                                        >
                                            <Camera className="h-4 w-4" />
                                            <input
                                                type="file"
                                                name="profile"
                                                id="profile"
                                                className="sr-only"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                            />
                                        </label>
                                    </div>
                                    <div>
                                        <span className="mb-1.5 text-black dark:text-white font-medium">Edit Photo</span>
                                        <span className="block text-xs text-gray-500 dark:text-gray-400">Accepted: .png, .jpg, .jpeg</span>
                                    </div>
                                </div>

                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">Username</label>
                                    <input
                                        type="text"
                                        value={profileData.username}
                                        onChange={(e) => setProfileData({ ...profileData, username: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-transparent py-3 px-5 font-normal outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500"
                                    />
                                </div>
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">Email Address</label>
                                    <input
                                        type="email"
                                        value={profileData.email}
                                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-transparent py-3 px-5 font-normal outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500"
                                    />
                                </div>
                                <button disabled={isLoading} className="flex w-full items-center justify-center rounded-lg bg-brand-500 p-3 font-medium text-white hover:bg-brand-600 hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                                    <Save className="w-4 h-4 mr-2" /> Save Profile
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'account' && (
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="border-b border-gray-200 py-4 px-6 dark:border-gray-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Change Password
                                </h3>
                            </div>
                            <form onSubmit={handlePasswordUpdate} className="p-6">
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">Current Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-transparent py-3 px-5 font-normal outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500"
                                    />
                                </div>
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-transparent py-3 px-5 font-normal outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500"
                                    />
                                </div>
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">Confirm New Password</label>
                                    <input
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-transparent py-3 px-5 font-normal outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500"
                                    />
                                </div>
                                <button disabled={isLoading} className="flex w-full items-center justify-center rounded-lg bg-brand-500 p-3 font-medium text-white hover:bg-brand-600 hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                                    <Save className="w-4 h-4 mr-2" /> Update Password
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'support' && (
                        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
                            <div className="border-b border-gray-200 py-4 px-6 dark:border-gray-800">
                                <h3 className="font-semibold text-gray-900 dark:text-white">
                                    Submit a Ticket
                                </h3>
                            </div>
                            <form onSubmit={handleSupportSubmit} className="p-6">
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">Ticket Subject</label>
                                    <input
                                        type="text"
                                        placeholder="e.g., Feature Request, Bug Report"
                                        value={supportTicket.subject}
                                        onChange={(e) => setSupportTicket({ ...supportTicket, subject: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-transparent py-3 px-5 font-normal outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500"
                                    />
                                </div>
                                <div className="mb-4.5">
                                    <label className="mb-2.5 block text-black dark:text-white">Message</label>
                                    <textarea
                                        rows={4}
                                        placeholder="Describe your issue or request..."
                                        value={supportTicket.message}
                                        onChange={(e) => setSupportTicket({ ...supportTicket, message: e.target.value })}
                                        className="w-full rounded-lg border border-gray-300 bg-transparent py-3 px-5 font-normal outline-none transition focus:border-brand-500 active:border-brand-500 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:border-brand-500"
                                    ></textarea>
                                </div>
                                <button disabled={isLoading} className="flex w-full items-center justify-center rounded-lg bg-brand-500 p-3 font-medium text-white hover:bg-brand-600 hover:shadow-lg transition-all duration-300 disabled:opacity-50">
                                    <Mail className="w-4 h-4 mr-2" /> Submit Ticket
                                </button>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
