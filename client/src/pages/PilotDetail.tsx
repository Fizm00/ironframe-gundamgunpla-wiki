import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, User, FileText, Anchor, Shield, Calendar, Zap } from 'lucide-react';
import { LoadingState } from '../components/common/LoadingState';
import { ErrorState } from '../components/common/ErrorState';
import { usePilotDetail } from '@/hooks/public/usePilotDetail';

const PilotDetail = () => {
    const { id } = useParams<{ id: string }>();
    const { character, loading, error } = usePilotDetail(id);

    if (loading) {
        return <LoadingState message="ACCESSING PERSONNEL FILE..." iconClassName="text-neon-green" className="min-h-screen bg-background" />;
    }

    if (error || !character) {
        return (
            <div className="min-h-screen bg-background flex items-center justify-center">
                <div className="text-center">
                    <ErrorState title="FILE NOT FOUND" message="PERSONNEL RECORD MISSING OR CORRUPTED" className="border-none bg-transparent" />
                    <Link to="/pilots" className="text-foreground mt-4 inline-block hover:underline font-mono">
                        RETURN TO ROSTER
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background text-foreground pt-24 pb-12 transition-colors duration-300 relative">
            <div className="relative z-10">
                <div className="container mx-auto px-4">
                    <Link to="/pilots" className="inline-flex items-center text-neon-green hover:text-foreground transition-colors mb-8 font-mono text-xs tracking-widest group">
                        <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                        RETURN TO ROSTER
                    </Link>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-12">
                        {/* LEFT COLUMN: VISUAL ID */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="sticky top-24 rounded-lg overflow-hidden border border-border bg-black/40 group h-fit"
                        >
                            <div className="absolute inset-0 bg-cyber-grid opacity-30" />
                            {character.imageUrl ? (
                                <img src={character.imageUrl} alt={character.name} referrerPolicy="no-referrer" className="w-full h-full object-cover" />
                            ) : (
                                <div className="w-full aspect-3/4 flex items-center justify-center text-foreground/20 font-orbitron">NO VISUAL RECORD</div>
                            )}

                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-linear-to-t from-black to-transparent pointer-events-none">
                                <h1 className="text-3xl md:text-5xl font-orbitron font-bold text-white mb-2">{character.name}</h1>
                                <div className="flex flex-wrap gap-2">
                                    {character.profile?.['Rank'] && (
                                        <span className="inline-block px-3 py-1 bg-neon-green/20 border border-neon-green/50 text-neon-green font-mono text-xs">
                                            {character.profile['Rank'].toUpperCase()}
                                        </span>
                                    )}
                                    {character.profile?.['Affiliation'] && (
                                        <span className="inline-block px-3 py-1 bg-white/10 border border-white/20 text-white/80 font-mono text-xs">
                                            {character.profile['Affiliation'].toUpperCase()}
                                        </span>
                                    )}
                                </div>
                            </div>
                        </motion.div>

                        {/* RIGHT COLUMN: PERSONNEL DATA */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.1 }}
                            className="space-y-6"
                        >
                            <div className="bg-surface/50 border border-border p-6 rounded-lg backdrop-blur-sm">
                                <h3 className="flex items-center text-neon-green font-orbitron text-lg mb-6 pb-4 border-b border-border">
                                    <User className="w-5 h-5 mr-2" />
                                    PERSONNEL DATA
                                </h3>

                                <div className="space-y-6">
                                    {/* BIO */}
                                    <div>
                                        <h4 className="text-xs font-mono text-neon-green/70 mb-3 uppercase flex items-center">
                                            <FileText className="w-3 h-3 mr-2" /> Overview
                                        </h4>
                                        <p className="text-sm text-foreground/90 leading-relaxed font-light">
                                            {character.description || "No overview available."}
                                        </p>
                                    </div>

                                    {/* PERSONALITY */}
                                    {character.personality && (
                                        <div>
                                            <h4 className="text-xs font-mono text-neon-green/70 mb-3 uppercase flex items-center">
                                                <User className="w-3 h-3 mr-2" /> Personality
                                            </h4>
                                            <div className="bg-surface p-4 rounded border border-border max-h-60 overflow-y-auto custom-scrollbar">
                                                <div className="prose prose-invert prose-sm max-w-none text-foreground/80 font-light leading-relaxed whitespace-pre-line">
                                                    {character.personality}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* SKILLS */}
                                    {character.skills && (
                                        <div>
                                            <h4 className="text-xs font-mono text-neon-green/70 mb-3 uppercase flex items-center">
                                                <Zap className="w-3 h-3 mr-2" /> Capabilities
                                            </h4>
                                            <div className="bg-surface p-4 rounded border border-border">
                                                <div className="prose prose-invert prose-sm max-w-none text-foreground/80 font-light leading-relaxed whitespace-pre-line">
                                                    {character.skills}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* PROFILE STATS */}
                                    {character.profile && Object.keys(character.profile).length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-mono text-neon-green/70 mb-3 uppercase flex items-center">
                                                <Calendar className="w-3 h-3 mr-2" /> Vital Statistics
                                            </h4>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-surface p-4 rounded border border-border">
                                                {Object.entries(character.profile).map(([key, value]) => (
                                                    <div key={key} className="flex justify-between items-baseline border-b border-border pb-1 last:border-0 md:last:border-0 md:nth-last-child-2:border-0">
                                                        <span className="text-foreground-muted text-xs uppercase mr-2">{key.replace(':', '')}</span>
                                                        <span className="text-foreground text-xs font-mono text-right truncate max-w-[60%]">{value}</span>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    {/* HISTORY */}
                                    {character.history && (
                                        <div>
                                            <h4 className="text-xs font-mono text-neon-green/70 mb-3 uppercase flex items-center">
                                                <Anchor className="w-3 h-3 mr-2" /> Service History
                                            </h4>
                                            <div className="bg-surface p-4 rounded border border-border max-h-96 overflow-y-auto custom-scrollbar">
                                                <div className="prose prose-invert prose-sm max-w-none text-foreground/80 font-light leading-relaxed whitespace-pre-line">
                                                    {character.history}
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    {/* UNITS */}
                                    {character.mecha && character.mecha.length > 0 && (
                                        <div>
                                            <h4 className="text-xs font-mono text-neon-green/70 mb-3 uppercase flex items-center">
                                                <Shield className="w-3 h-3 mr-2" /> Assigned Units
                                            </h4>
                                            <div className="bg-surface p-4 rounded border border-border">
                                                <ul className="grid grid-cols-1 gap-2">
                                                    {character.mecha.map((unit, i) => (
                                                        <li key={i} className="flex items-center text-sm font-mono text-foreground hover:text-neon-green transition-colors cursor-default">
                                                            <span className="w-1.5 h-1.5 bg-neon-green rounded-full mr-3 opacity-70" />
                                                            {unit}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        </div>
                                    )}

                                    {/* NOTES */}
                                    {character.notes && (
                                        <div>
                                            <h4 className="text-xs font-mono text-neon-green/70 mb-3 uppercase flex items-center">
                                                <FileText className="w-3 h-3 mr-2" /> Additional Notes
                                            </h4>
                                            <div className="bg-surface p-4 rounded border border-border text-xs text-foreground/70 whitespace-pre-line">
                                                {character.notes}
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PilotDetail;
