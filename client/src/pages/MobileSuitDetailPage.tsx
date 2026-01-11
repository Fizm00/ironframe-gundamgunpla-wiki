import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useMobileSuitDetail } from '@/hooks/useMobileSuitDetail';
import { SuitHeader } from '@/components/public/mobile-suit/SuitHeader';
import { SuitSystemOverview } from '@/components/public/mobile-suit/SuitSystemOverview';
import { SuitTabs } from '@/components/public/mobile-suit/SuitTabs';
import { LoadingState } from '@/components/common/LoadingState';
import { ErrorState } from '@/components/common/ErrorState';

export function MobileSuitDetailPage() {
    const {
        suit,
        isLoading,
        isError,
        activeTab,
        setActiveTab,
        isUploading,
        handleImageUpload
    } = useMobileSuitDetail();

    if (isLoading) {
        return <LoadingState message="ACCESSING ARCHIVES..." iconClassName="text-neon-blue" className="min-h-screen bg-cyber-black" />;
    }

    if (isError || !suit) {
        return (
            <div className="min-h-screen bg-cyber-black flex items-center justify-center">
                <div className="text-center">
                    <ErrorState title="DATA CORRUPTED" message="UNIT NOT FOUND" className="border-none bg-transparent" />
                    <Link to="/mobile-suits" className="text-white mt-4 inline-block hover:underline font-mono">
                        RETURN TO ARCHIVES
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12 transition-colors duration-300">
            <div className="container mx-auto px-4">
                <Link to="/mobile-suits" className="inline-flex items-center text-neon-blue hover:text-foreground transition-colors mb-8 font-mono text-xs tracking-widest group">
                    <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                    BACK TO ARCHIVES
                </Link>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                    <SuitHeader
                        suit={suit}
                        isUploading={isUploading}
                        handleImageUpload={handleImageUpload}
                    />

                    <div className="space-y-6">
                        <SuitSystemOverview suit={suit} />
                    </div>
                </div>

                <SuitTabs
                    suit={suit}
                    activeTab={activeTab}
                    setActiveTab={setActiveTab}
                />
            </div>
        </div>
    );
}
