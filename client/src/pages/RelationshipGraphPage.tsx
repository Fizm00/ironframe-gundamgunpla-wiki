import { PublicPageHeader } from '@/components/common/PublicPageHeader';
import { RelationshipGraph } from '@/components/graph/RelationshipGraph';
import { Network, Share2 } from 'lucide-react';

export function RelationshipGraphPage() {
    return (
        <div className="min-h-screen bg-background text-foreground pb-20">
            <PublicPageHeader
                icon={Network}
                titlePrefix="TACTICAL"
                titleHighlight="NETWORK"
                subtitle="FACTION & TECHNOLOGY RELATIONSHIP MATRIX"
                highlightColorClass="from-emerald-400 to-cyan-500" // Matrix-like colors
                iconColorClass="text-emerald-400"
            >
                <button className="px-4 py-2 bg-slate-900 border border-slate-700 rounded text-xs font-mono text-slate-400 hover:text-white hover:border-slate-500 transition-colors flex items-center gap-2">
                    <Share2 className="w-4 h-4" />
                    SHARE VIEW
                </button>
            </PublicPageHeader>

            <div className="container mx-auto px-4 -mt-8 relative z-10">
                <RelationshipGraph />
            </div>
        </div>
    );
}
