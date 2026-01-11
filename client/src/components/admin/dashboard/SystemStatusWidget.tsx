import { motion } from 'framer-motion';
import { Settings } from 'lucide-react';

export function SystemStatusWidget() {
    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="bg-surface border border-border rounded-xl p-6 flex flex-col space-y-6"
        >
            <h3 className="text-sm font-bold text-foreground uppercase tracking-wider flex items-center gap-2">
                <div className="w-1 h-4 bg-primary rounded-full" />
                System Status
            </h3>

            <div className="space-y-5 flex-1">
                {[
                    { label: 'API Latency', value: '24ms', percent: 24, color: 'emerald' },
                    { label: 'Database Load', value: '34%', percent: 34, color: 'blue' },
                    { label: 'Cache Hit Rate', value: '94%', percent: 94, color: 'emerald' },
                    { label: 'Error Rate', value: '0.02%', percent: 2, color: 'cyan' },
                ].map((metric, i) => (
                    <motion.div
                        key={metric.label}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 + i * 0.1 }}
                    >
                        <div className="flex justify-between items-center mb-2">
                            <span className="text-xs font-medium text-foreground-muted">{metric.label}</span>
                            <span className={`text-sm font-bold text-${metric.color}-600 dark:text-${metric.color}-400`}>
                                {metric.value}
                            </span>
                        </div>
                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${metric.percent}%` }}
                                transition={{ delay: 0.8 + i * 0.1, duration: 0.8, ease: "easeOut" }}
                                className={`h-full bg-${metric.color}-600 dark:bg-${metric.color}-500 rounded-full`}
                            />
                        </div>
                    </motion.div>
                ))}
            </div>

            <div className="pt-4 border-t border-border">
                <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground text-sm font-bold py-3 px-4 rounded-lg transition-colors flex items-center justify-center gap-2 group shadow-lg shadow-primary/20"
                >
                    <Settings className="w-4 h-4 group-hover:rotate-90 transition-transform duration-500" />
                    System Settings
                </motion.button>
            </div>
        </motion.div>
    );
}
