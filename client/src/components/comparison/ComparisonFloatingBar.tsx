import { useComparison } from '@/context/ComparisonContext';
import { Sword, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

export function ComparisonFloatingBar() {
    const { selectedIds, clearComparison } = useComparison();

    if (selectedIds.length === 0) return null;

    return (
        <AnimatePresence>
            <motion.div
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 100, opacity: 0 }}
                className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-950 text-white px-6 py-4 rounded-full shadow-2xl border border-slate-800 flex items-center gap-6"
            >
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-slate-900 rounded-full flex items-center justify-center border border-slate-800">
                        <Sword className="w-5 h-5 text-neon-blue" />
                    </div>
                    <div>
                        <p className="text-sm font-bold font-orbitron text-white tracking-wide">COMPARE UNITS</p>
                        <p className="text-[10px] font-mono text-slate-400">{selectedIds.length} UNIT{selectedIds.length > 1 ? 'S' : ''} SELECTED</p>
                    </div>
                </div>

                <div className="h-8 w-px bg-white/10"></div>

                <div className="flex items-center gap-3">
                    <button
                        onClick={clearComparison}
                        className="text-slate-500 hover:text-white transition-colors text-xs font-mono tracking-widest px-3 py-1.5 rounded-md hover:bg-white/5 uppercase"
                    >
                        Clear
                    </button>
                    <Link
                        to="/compare"
                        className="bg-transparent hover:bg-neon-blue text-neon-blue hover:text-black border border-neon-blue transition-all duration-300 text-xs font-bold font-orbitron tracking-widest px-5 py-2.5 rounded-full flex items-center gap-2 group"
                    >
                        ANALYZE
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </motion.div>
        </AnimatePresence>
    );
}
