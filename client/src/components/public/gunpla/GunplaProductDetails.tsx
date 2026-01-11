
import { Zap } from 'lucide-react';
import type { MobileSuit } from '@/services/mobileSuits';

interface GunplaProductDetailsProps {
    mobileSuit: MobileSuit;
}

export function GunplaProductDetails({ mobileSuit }: GunplaProductDetailsProps) {
    return (
        <div className="bg-surface/50 border border-border p-6 backdrop-blur-sm">
            <h3 className="flex items-center text-neon-cyan font-mono tracking-widest text-sm mb-6 border-b border-border pb-2">
                <Zap className="w-4 h-4 mr-2" />
                PRODUCT_DETAILS
            </h3>

            <div className="space-y-4 font-exo text-foreground">
                <div className="flex flex-col sm:flex-row sm:items-baseline border-b border-white/5 pb-2">
                    <span className="text-foreground-muted w-40 font-mono text-xs uppercase shrink-0">Product Name:</span>
                    <span className="font-bold text-lg">{mobileSuit.name}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline border-b border-white/5 pb-2">
                    <span className="text-foreground-muted w-40 font-mono text-xs uppercase shrink-0">Model Number:</span>
                    <span className="text-neon-cyan font-mono">{mobileSuit.modelNumber}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline border-b border-white/5 pb-2">
                    <span className="text-foreground-muted w-40 font-mono text-xs uppercase shrink-0">Grade:</span>
                    <span>{mobileSuit.grade || 'N/A'}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline border-b border-white/5 pb-2">
                    <span className="text-foreground-muted w-40 font-mono text-xs uppercase shrink-0">Scale:</span>
                    <span>{mobileSuit.scale || (mobileSuit.grade === 'SD' ? 'Non-Scale' : 'N/A')}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline border-b border-white/5 pb-2">
                    <span className="text-foreground-muted w-40 font-mono text-xs uppercase shrink-0">Price (¥):</span>
                    <span className="font-mono text-neon-yellow">
                        {mobileSuit.price ? `¥${mobileSuit.price.toLocaleString()}` : '---'}
                    </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-baseline border-b border-white/5 pb-2">
                    <span className="text-foreground-muted w-40 font-mono text-xs uppercase shrink-0">Release Date:</span>
                    <span>{mobileSuit.releaseDate || 'UNKNOWN'}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-start pt-2">
                    <span className="text-foreground-muted w-40 font-mono text-xs uppercase shrink-0 mt-1">Description:</span>
                    <p className="leading-relaxed text-foreground/80 text-sm">
                        {mobileSuit.description || "No description available."}
                    </p>
                </div>
            </div>
        </div>
    );
}
