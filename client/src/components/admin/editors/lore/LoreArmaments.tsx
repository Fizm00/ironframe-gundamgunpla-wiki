import { Controller, type UseFieldArrayReturn, type UseFormReturn } from 'react-hook-form';
import type { LoreMobileSuit } from '@/services/lore';
import { Trash2 } from 'lucide-react';

interface LoreArmamentsProps {
    form: UseFormReturn<Partial<LoreMobileSuit>>;
    fieldArray: UseFieldArrayReturn<Partial<LoreMobileSuit>, "armaments", "id">;
}

export function LoreArmaments({ form, fieldArray }: LoreArmamentsProps) {
    const { register, control } = form;
    const { fields, append, remove } = fieldArray;

    return (
        <div className="bg-black/20 p-6 rounded border border-white/10">
            <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-orbitron text-white">Armaments</h2>
                <div className="space-x-2">
                    <button type="button" onClick={() => append({ category: 'Fixed', items: [''] })} className="text-xs bg-neon-cyan/20 text-neon-cyan px-3 py-1 rounded hover:bg-neon-cyan/40">+ Fixed</button>
                    <button type="button" onClick={() => append({ category: 'Handheld', items: [''] })} className="text-xs bg-neon-purple/20 text-neon-purple px-3 py-1 rounded hover:bg-neon-purple/40">+ Handheld</button>
                </div>
            </div>

            <div className="space-y-4">
                {fields.map((field, index) => (
                    <div key={field.id} className="bg-black/40 p-4 rounded border border-white/5 flex gap-4 items-start">
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-2">
                                <input
                                    {...register(`armaments.${index}.category` as const)}
                                    className="bg-transparent border-b border-white/20 text-neon-blue font-bold w-1/3 focus:border-neon-blue outline-none"
                                    placeholder="Category"
                                />
                                <button type="button" onClick={() => remove(index)} className="text-danger-red hover:text-white"><Trash2 className="w-4 h-4" /></button>
                            </div>
                            <Controller
                                control={control}
                                name={`armaments.${index}.items` as const}
                                render={({ field: { value, onChange } }) => (
                                    <textarea
                                        className="w-full bg-black/20 border border-white/10 rounded p-2 text-sm h-16 outline-none focus:border-white/30"
                                        placeholder="Items, new line separated"
                                        value={Array.isArray(value) ? value.join('\n') : value}
                                        onChange={(e) => onChange(e.target.value.split('\n').filter(s => s.trim()))}
                                    />
                                )}
                            />
                        </div>
                    </div>
                ))}
                {fields.length === 0 && <p className="text-center text-white/30 text-sm py-4 italic">No armaments recorded.</p>}
            </div>
        </div>
    );
}
