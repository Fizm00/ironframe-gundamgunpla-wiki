import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { SettingsTabs } from '@/components/admin/settings/SettingsTabs';
import { SettingsProfile } from '@/components/admin/settings/SettingsProfile';
import { SettingsAccount } from '@/components/admin/settings/SettingsAccount';
import { SettingsSupport } from '@/components/admin/settings/SettingsSupport';

export function Settings() {
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const initialTab = queryParams.get('tab') || 'profile';

    const [activeTab, setActiveTab] = useState(initialTab);

    useEffect(() => {
        const tab = queryParams.get('tab');
        if (tab && ['profile', 'account', 'support'].includes(tab)) {
            setActiveTab(tab);
        }
    }, [location.search]);

    return (
        <div className="mx-auto max-w-4xl p-4 md:p-6 2xl:p-10">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <h2 className="text-title-md2 font-semibold text-gray-900 dark:text-white">
                    Settings
                </h2>
            </div>

            <div className="flex flex-col gap-8">
                <SettingsTabs activeTab={activeTab} setActiveTab={setActiveTab} />

                <div className="mt-4">
                    {activeTab === 'profile' && <SettingsProfile />}
                    {activeTab === 'account' && <SettingsAccount />}
                    {activeTab === 'support' && <SettingsSupport />}
                </div>
            </div>
        </div>
    );
}
