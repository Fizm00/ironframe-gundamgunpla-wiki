import type { UseFormReturn } from 'react-hook-form';
import type { LoreMobileSuit } from '@/services/lore';
import { SECTION_KEYS } from './constants';

interface LoreTechSpecsProps {
    form: UseFormReturn<Partial<LoreMobileSuit>>;
}

export function LoreTechSpecs({ form }: LoreTechSpecsProps) {
    const { register } = form;

    const renderInputSection = (title: string, fieldBase: 'production' | 'development' | 'specifications' | 'performance', keys: readonly string[]) => (
        <div className="bg-black/20 p-4 rounded border border-white/5 mb-6">
            <h3 className="text-sm font-bold text-neon-blue mb-4 uppercase tracking-wider">{title}</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {keys.map(key => (
                    <div key={key}>
                        <label className="block text-[10px] font-mono text-white/50 mb-1 uppercase">{key}</label>
                        <input
                            {...register(`${fieldBase}.${key}` as any)}
                            className="w-full bg-black/40 border border-white/10 rounded p-2 text-sm focus:border-neon-cyan outline-none text-white/90"
                            placeholder={key}
                        />
                    </div>
                ))}
            </div>
        </div>
    );

    return (
        <div>
            <h2 className="text-xl font-orbitron text-white mb-4">Technical Specifications</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {renderInputSection('Production', 'production', SECTION_KEYS.production)}
                {renderInputSection('Development', 'development', SECTION_KEYS.development)}
                {renderInputSection('Specifications', 'specifications', SECTION_KEYS.specifications)}
                {renderInputSection('Performance', 'performance', SECTION_KEYS.performance)}
            </div>
        </div>
    );
}
