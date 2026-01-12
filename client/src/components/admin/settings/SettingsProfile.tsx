import { Camera, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useProfileSettings } from '@/hooks/admin/useSettings';

export function SettingsProfile() {
    const { profileData, setProfileData, handleAvatarChange, updateProfile, isLoading, message } = useProfileSettings();

    return (
        <div className="rounded-xl border border-gray-200 bg-white shadow-sm dark:border-gray-800 dark:bg-gray-900">
            <div className="border-b border-gray-200 py-4 px-6 dark:border-gray-800">
                <h3 className="font-semibold text-gray-900 dark:text-white">
                    Profile Information
                </h3>
            </div>

            {message && (
                <div className={`mx-6 mt-6 flex items-center gap-2 rounded-lg p-4 ${message.type === 'success' ? 'bg-success-50 text-success-700 dark:bg-success-500/10 dark:text-success-400' : 'bg-error-50 text-error-700 dark:bg-error-500/10 dark:text-error-400'}`}>
                    {message.type === 'success' ? <CheckCircle className="h-5 w-5" /> : <AlertCircle className="h-5 w-5" />}
                    {message.text}
                </div>
            )}

            <form onSubmit={updateProfile} className="p-6">
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
    );
}
