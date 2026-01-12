import { User, Lock, Mail } from 'lucide-react';

interface SettingsTabsProps {
    activeTab: string;
    setActiveTab: (tab: string) => void;
}

export function SettingsTabs({ activeTab, setActiveTab }: SettingsTabsProps) {
    const tabs = [
        { id: 'profile', label: 'Edit Profile', icon: User },
        { id: 'account', label: 'Account Settings', icon: Lock },
        { id: 'support', label: 'Support', icon: Mail },
    ];

    return (
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
    );
}
