import { ComparisonTable } from '@/components/comparison/ComparisonTable';
import { useComparison } from '@/context/ComparisonContext';
import { Plus, Scale } from 'lucide-react';
import { Link } from 'react-router-dom';
import { PublicPageHeader } from '@/components/common/PublicPageHeader';

export function ComparePage() {
    const { selectedIds } = useComparison();

    return (
        <div className="min-h-screen bg-background bg-grid-faint text-foreground pt-24 pb-20 px-4 md:px-8 transition-colors duration-300">

            <PublicPageHeader
                icon={Scale}
                subtitle="TECHNICAL SPECIFICATIONS // ANALYSIS"
                titlePrefix="TACTICAL"
                titleHighlight="COMPARISON"
                highlightColorClass="from-neon-blue to-neon-cyan"
                iconColorClass="text-neon-blue"
            >
                <div className="flex items-center gap-4">
                    {selectedIds.length < 3 && (
                        <Link
                            to="/mobile-suits"
                            className="inline-flex items-center justify-center px-4 py-2 bg-slate-900/80 hover:bg-neon-blue/20 text-neon-blue border border-neon-blue/50 hover:border-neon-blue rounded-none skew-x-[-10deg] transition-all font-orbitron text-sm tracking-wide group shadow-[0_0_10px_rgba(6,182,212,0.1)] hover:shadow-[0_0_15px_rgba(6,182,212,0.4)]"
                        >
                            <span className="skew-x-10 flex items-center">
                                <Plus className="w-4 h-4 mr-2 group-hover:rotate-90 transition-transform" />
                                ADD UNIT ({selectedIds.length}/3)
                            </span>
                        </Link>
                    )}
                </div>
            </PublicPageHeader>

            <div className="max-w-7xl mx-auto space-y-8">
                {/* Comparison Table */}
                <ComparisonTable />
            </div>
        </div>
    );
}
