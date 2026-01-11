import { useFieldArray } from 'react-hook-form';
import { Shield, Users, Trash2, Plus } from 'lucide-react';
import { AdminInput } from '@/components/admin/ui/AdminForm';

interface ForceEditorProps {
    control: any;
    index: number;
    remove: (index: number) => void;
}

export function ForceEditor({ control, index, remove }: ForceEditorProps) {
    const { fields: teamFields, append: appendTeam, remove: removeTeam } = useFieldArray({
        control,
        name: `forces.${index}.teams` as const
    });

    return (
        <div className="border border-border rounded-lg p-4 mb-4 bg-surface/30">
            <div className="flex justify-between items-start mb-4 border-b border-border pb-2">
                <div className="flex items-center gap-2">
                    <Shield className="w-4 h-4 text-neon-cyan" />
                    <span className="font-orbitron font-bold text-sm text-foreground">Military Branch / Force #{index + 1}</span>
                </div>
                <button
                    type="button"
                    onClick={() => remove(index)}
                    className="text-red-500 hover:text-red-400 p-1 rounded hover:bg-red-500/10"
                >
                    <Trash2 className="w-4 h-4" />
                </button>
            </div>

            <div className="space-y-4">
                <AdminInput<any>
                    label="Force Name"
                    name={`forces.${index}.name`}
                    register={control.register}
                    rules={{ required: "Force Name is required" }}
                    placeholder="e.g., Earth Federation Forces"
                />

                <div className="pl-4 border-l-2 border-border ml-2">
                    <label className="text-xs font-mono text-foreground-muted mb-2 uppercase flex items-center gap-2">
                        <Users className="w-3 h-3" />
                        Sub-Teams / Units
                    </label>
                    <div className="space-y-2">
                        {teamFields.map((team, tIndex) => (
                            <div key={team.id} className="flex gap-2 items-center">
                                <input
                                    {...control.register(`forces.${index}.teams.${tIndex}`)}
                                    className="grow bg-background border border-border rounded p-2 text-sm text-foreground focus:border-neon-cyan outline-none"
                                    placeholder="e.g., 08th Mobile Suit Team"
                                />
                                <button
                                    type="button"
                                    onClick={() => removeTeam(tIndex)}
                                    className="text-foreground-muted hover:text-red-500"
                                >
                                    <Trash2 className="w-3 h-3" />
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={() => appendTeam("")}
                            className="text-xs text-neon-cyan hover:text-neon-cyan/80 flex items-center gap-1 mt-2"
                        >
                            <Plus className="w-3 h-3" /> ADD TEAM
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
