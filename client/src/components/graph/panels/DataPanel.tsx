import { motion } from 'framer-motion';
import { Crosshair, X, Info, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import type { CustomNode } from '../types';

type DataPanelProps = {
    node: CustomNode;
    onClose: () => void;
};

export const DataPanel = ({ node, onClose }: DataPanelProps) => {
    if (!node) return null;

    const themeColor =
        node.type === 'faction' ? 'text-neon-blue border-neon-blue' :
            node.type === 'pilot' ? 'text-emerald-500 border-emerald-500' :
                'text-indigo-500 border-indigo-500';

    const bgGradient =
        node.type === 'faction' ? 'from-neon-blue/10' :
            node.type === 'pilot' ? 'from-emerald-500/10' :
                'from-indigo-500/10';

    const detailRoute =
        node.type === 'faction' ? `/factions/${node.id}` :
            node.type === 'pilot' ? `/pilots/${node.id}` :
                `/mobile-suits/${node.id}`;

    return (
        <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            className="absolute top-4 right-4 w-96 bottom-4 bg-slate-900/95 border-l border-slate-700 backdrop-blur-2xl shadow-2xl overflow-hidden flex flex-col z-50 rounded-l-2xl"
        >
            <div className={`p-6 border-b border-slate-800 bg-linear-to-r ${bgGradient} to-transparent relative overflow-hidden`}>
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <Crosshair className="w-32 h-32" />
                </div>

                <div className="flex justify-between items-start relative z-10">
                    <div>
                        <div className="text-[10px] font-mono uppercase text-slate-400 tracking-widest mb-1">Target Data</div>
                        <h2 className={`text-2xl font-orbitron font-bold uppercase ${themeColor.split(' ')[0]}`}>{node.data.label}</h2>
                    </div>
                    <button onClick={onClose} className="p-2 hover:bg-slate-800 rounded-full text-slate-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-slate-700">
                <div className="aspect-video w-full bg-slate-950 rounded-lg overflow-hidden border border-slate-800 relative group">
                    {node.data.image ? (
                        <img src={node.data.image} alt="Data" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
                    ) : (
                        <div className="flex items-center justify-center h-full text-slate-700">NO VISUAL DATA</div>
                    )}
                    <div className="absolute top-2 left-2 w-2 h-2 border-t border-l border-white/30"></div>
                    <div className="absolute top-2 right-2 w-2 h-2 border-t border-r border-white/30"></div>
                    <div className="absolute bottom-2 left-2 w-2 h-2 border-b border-l border-white/30"></div>
                    <div className="absolute bottom-2 right-2 w-2 h-2 border-b border-r border-white/30"></div>
                </div>

                <div className="space-y-2">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                        <Info className="w-4 h-4 text-slate-500" />
                        DATA LOG
                    </h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-mono">
                        {node.data.description || "No additional data available for this entity. Further reconnaissance required."}
                    </p>
                </div>

                <div className="p-3 bg-slate-950 rounded border border-slate-800 font-mono text-xs text-slate-500 flex justify-between items-center">
                    <span>ID_REF</span>
                    <span className="text-slate-300">{node.id.substring(0, 12).toUpperCase()}...</span>
                </div>
            </div>

            <div className="p-4 border-t border-slate-800 bg-slate-950/50">
                <Link
                    to={detailRoute}
                    className={`flex items-center justify-center gap-2 w-full py-3 rounded font-bold uppercase tracking-wide text-sm transition-all hover:brightness-110 shadow-lg ${node.type === 'faction' ? 'bg-neon-blue text-black' :
                        node.type === 'pilot' ? 'bg-emerald-500 text-black' :
                            'bg-indigo-500 text-white'
                        }`}
                >
                    <ExternalLink className="w-4 h-4" />
                    Access Full Database
                </Link>
            </div>
        </motion.div>
    );
};
