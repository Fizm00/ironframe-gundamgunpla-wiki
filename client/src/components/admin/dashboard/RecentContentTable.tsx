import { motion } from 'framer-motion';
import { Search, Filter } from 'lucide-react';
import type { MobileSuit } from '@/services/mobileSuits';
import type { LoreMobileSuit } from '@/services/lore';

interface RecentContentTableProps {
    loreData: { mobileSuits: LoreMobileSuit[] } | undefined;
    gunplaData: { mobileSuits: MobileSuit[] } | undefined;
}

export function RecentContentTable({ loreData, gunplaData }: RecentContentTableProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="lg:col-span-2 bg-surface border border-border rounded-xl flex flex-col h-[450px] overflow-hidden"
        >
            <div className="p-5 border-b border-border flex justify-between items-center bg-muted/30">
                <div className="flex gap-6">
                    <motion.button whileHover={{ y: -1 }} className="text-sm font-bold text-foreground border-b-2 border-primary pb-5 -mb-5">
                        All Updates
                    </motion.button>
                    <motion.button whileHover={{ y: -1 }} className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors pb-5 -mb-5">
                        Lore
                    </motion.button>
                    <motion.button whileHover={{ y: -1 }} className="text-sm font-medium text-foreground-muted hover:text-foreground transition-colors pb-5 -mb-5">
                        Gunpla
                    </motion.button>
                </div>
                <div className="flex gap-2">
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                        <Search className="w-4 h-4" />
                    </motion.button>
                    <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className="p-2 text-foreground-muted hover:text-foreground hover:bg-muted rounded-lg transition-colors">
                        <Filter className="w-4 h-4" />
                    </motion.button>
                </div>
            </div>

            <div className="flex-1 overflow-auto">
                <table className="w-full text-left text-sm">
                    <thead className="bg-muted/50 text-xs uppercase text-foreground-muted font-mono sticky top-0">
                        <tr>
                            <th className="px-6 py-3 font-medium">Entity</th>
                            <th className="px-6 py-3 font-medium">Type</th>
                            <th className="px-6 py-3 font-medium">Status</th>
                            <th className="px-6 py-3 font-medium text-right">Date</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                        {loreData?.mobileSuits.slice(0, 5).map((suit: LoreMobileSuit, i: number) => (
                            <motion.tr
                                key={suit._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.6 + i * 0.05 }}
                                className="group hover:bg-muted/50 transition-colors"
                            >
                                <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-muted border border-border flex items-center justify-center text-xs">
                                        MS
                                    </div>
                                    {suit.name}
                                </td>
                                <td className="px-6 py-4 text-foreground-muted text-xs">Lore Entry</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                                        PUBLISHED
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-foreground-muted font-mono text-xs">
                                    {new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </td>
                            </motion.tr>
                        ))}
                        {gunplaData?.mobileSuits.slice(0, 3).map((suit: MobileSuit, i: number) => (
                            <motion.tr
                                key={suit._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: 0.85 + i * 0.05 }}
                                className="group hover:bg-muted/50 transition-colors"
                            >
                                <td className="px-6 py-4 font-medium text-foreground flex items-center gap-3">
                                    <div className="w-9 h-9 rounded-lg bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-xs text-blue-600 dark:text-blue-400">
                                        GP
                                    </div>
                                    {suit.name}
                                </td>
                                <td className="px-6 py-4 text-foreground-muted text-xs">Gunpla Product</td>
                                <td className="px-6 py-4">
                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-medium bg-amber-500/10 text-amber-600 dark:text-amber-400">
                                        DRAFT
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right text-foreground-muted font-mono text-xs">
                                    {new Date().toLocaleDateString([], { month: 'short', day: 'numeric' })}
                                </td>
                            </motion.tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </motion.div>
    );
}
