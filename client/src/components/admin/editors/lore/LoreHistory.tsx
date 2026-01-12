import { Controller, type UseFormReturn } from 'react-hook-form';
import type { LoreMobileSuit } from '@/services/lore';

interface LoreHistoryProps {
    form: UseFormReturn<Partial<LoreMobileSuit>>;
}

export function LoreHistory({ form }: LoreHistoryProps) {
    const { register, control } = form;

    const renderListInput = (title: string, fieldName: 'variants' | 'knownPilots' | 'appearances') => (
        <div className="mb-6">
            <label className="block text-xs font-mono text-neon-purple mb-2 uppercase font-bold">{title}</label>
            <Controller
                control={control}
                name={fieldName}
                render={({ field: { value, onChange } }) => (
                    <textarea
                        className="w-full bg-black/40 border border-white/20 rounded p-3 h-32 text-sm focus:border-neon-purple outline-none font-mono"
                        placeholder={`Enter ${title.toLowerCase()}, one per line...`}
                        value={Array.isArray(value) ? value.join('\n') : value}
                        onChange={(e) => onChange(e.target.value.split('\n').filter(s => s.trim()))}
                    />
                )}
            />
            <p className="text-[10px] text-white/30 mt-1">Separate entries with new lines.</p>
        </div>
    );

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-black/20 p-6 rounded border border-white/10">
                <h2 className="text-xl font-orbitron text-white mb-4">Historical Data</h2>
                <label className="block text-xs font-mono text-white/60 mb-1 uppercase">History & Background</label>
                <textarea {...register('history')} className="w-full bg-black/40 border border-white/20 rounded p-3 h-64 focus:border-neon-blue outline-none text-sm leading-relaxed" placeholder="Write the comprehensive history..." />
            </div>

            <div className="bg-black/20 p-6 rounded border border-white/10 flex flex-col gap-4">
                <h2 className="text-xl font-orbitron text-white mb-4">Database Links</h2>
                {renderListInput('Variants', 'variants')}
                {renderListInput('Known Pilots', 'knownPilots')}
                {renderListInput('Appearances', 'appearances')}
            </div>

            <div className="col-span-1 md:col-span-2 bg-black/20 p-6 rounded border border-white/10">
                <h2 className="text-xl font-orbitron text-white mb-4">Behind The Scenes</h2>
                <textarea {...register('behindTheScenes')} className="w-full bg-black/40 border border-white/20 rounded p-3 h-32 focus:border-neon-blue outline-none text-sm" />
            </div>
        </div>
    );
}
