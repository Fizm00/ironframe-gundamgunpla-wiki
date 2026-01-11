import { useState, useEffect } from 'react';
import { loreService } from '@/services/lore';
import type { Faction } from '@/services/factions';

export function useFactionImages(faction: Faction | undefined, activeTab: string) {
    const [weaponImages, setWeaponImages] = useState<Record<string, string>>({});

    useEffect(() => {
        if (activeTab === 'tech' && faction?.mobileWeapons?.length) {
            const missing = faction.mobileWeapons.filter(mw => !weaponImages[mw]);
            if (missing.length > 0) {
                loreService.getBatchImages(missing)
                    .then(map => {
                        setWeaponImages(prev => ({ ...prev, ...map }));
                    })
                    .catch(err => console.error('Failed to load weapon images', err));
            }
        }
    }, [activeTab, faction?.mobileWeapons]); // Removed weaponImages from deps to avoid loop

    return weaponImages;
}
