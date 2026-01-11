import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { usePublicGunplaDetail } from '@/hooks/usePublicGunplaDetail';
import { GunplaVisuals } from '@/components/public/gunpla/GunplaVisuals';
import { GunplaProductDetails } from '@/components/public/gunpla/GunplaProductDetails';
import { GunplaArmaments } from '@/components/public/gunpla/GunplaArmaments';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';

export function GunplaDetailPage() {
    const { mobileSuit, isLoading, error } = usePublicGunplaDetail();

    if (isLoading) {
        return <LoadingState message="ACCESSING ARCHIVES..." iconClassName="text-neon-cyan" className="h-[80vh]" />;
    }

    if (error || !mobileSuit) {
        return (
            <div className="flex h-[80vh] items-center justify-center">
                <div className="text-center">
                    <ErrorState title="DATA CORRUPTED" message="UNIT NOT FOUND OR ACCESS DENIED" className="border-none bg-transparent" />
                    <Link to="/gunpla" className="mt-8 inline-block px-6 py-2 border border-destructive hover:bg-destructive/10 transition-colors font-mono text-sm text-foreground">
                        RETURN TO DATABASE
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8 bg-background min-h-screen transition-colors duration-300">
            <Link to="/gunpla" className="inline-flex items-center text-neon-cyan hover:text-foreground transition-colors mb-8 font-mono text-xs tracking-widest group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                BACK TO LIST
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <GunplaVisuals mobileSuit={mobileSuit} />

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="space-y-8"
                >
                    <GunplaProductDetails mobileSuit={mobileSuit} />
                    <GunplaArmaments armaments={mobileSuit.armaments || []} />
                </motion.div>
            </div>
        </div>
    );
}
