
import { useEffect, useState } from 'react';
import { useNavigate, useParams, Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { loreService } from '@/services/lore';
import type { LoreMobileSuit } from '@/services/lore';
import { useForm, useFieldArray, Controller } from 'react-hook-form';
import { ArrowLeft, Save, Trash2, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';

const SECTION_KEYS = {
    production: [
        'Model number', 'Code name', 'Type', 'Completed',
        'First deployment', 'Manufacturer', 'Operator'
    ],
    development: [
        'Developed from', 'Developed into'
    ],
    specifications: [
        'Crew', 'Cockpit location', 'Standard weight', 'Full weight',
        'Sensors', 'Cockpit', 'Height', 'Armor materials'
    ],
    performance: [
        'Power plant', 'Power output', 'Propulsion', 'Flight system',
        'Max speed', '180° turn time', 'Thrust to weight'
    ]
};

export function LoreEditor() {
    const { id } = useParams<{ id: string }>();
    const isEditMode = !!id;
    const navigate = useNavigate();
    const queryClient = useQueryClient();
    const [selectedImage, setSelectedImage] = useState<File | null>(null);

    const { data: suit, isLoading: isFetching } = useQuery({
        queryKey: ['loreMobileSuit', id],
        queryFn: () => loreService.getById(id!),
        enabled: isEditMode
    });



    const { register, control, handleSubmit, reset } = useForm<Partial<LoreMobileSuit>>({
        defaultValues: {
            name: '',
            series: '',
            url: '',
            description: '',
            history: '',
            behindTheScenes: '',
            development: {},
            production: {},
            specifications: {},
            performance: {},
            armaments: [],
            variants: [],
            knownPilots: [],
            appearances: []
        }
    });

    const { fields: armamentFields, append: appendArmament, remove: removeArmament } = useFieldArray({
        control,
        name: "armaments" as any
    });

    // Reset form when data loads
    useEffect(() => {
        if (suit) {
            reset(suit);
        }
    }, [suit, reset]);

    const mutation = useMutation({
        mutationFn: async (data: Partial<LoreMobileSuit>) => {
            let result;
            if (isEditMode) {
                result = await loreService.update(id!, data);
            } else {
                result = await loreService.create(data);
            }

            // If there's an image selected, upload it now
            if (selectedImage && result._id) {
                await loreService.uploadImage(result._id, selectedImage);
            }

            return result;
        },
        onSuccess: (data) => {
            queryClient.invalidateQueries({ queryKey: ['loreMobileSuits'] });
            queryClient.invalidateQueries({ queryKey: ['loreMobileSuit', isEditMode ? id : data._id] });
            alert('Mobile Suit Saved Successfully!');
            navigate(isEditMode ? `/mobile-suits/${id}` : '/admin/dashboard');
        },
        onError: (error: any) => {
            alert(`Error: ${error.response?.data?.message || error.message}`);
        }
    });

    const onSubmit = (data: Partial<LoreMobileSuit>) => {
        mutation.mutate(data);
    };

    if (isEditMode && isFetching) {
        return <div className="min-h-screen bg-cyber-black flex items-center justify-center text-neon-blue font-orbitron">Loading Data...</div>;
    }

    const renderInputSection = (title: string, fieldBase: 'production' | 'development' | 'specifications' | 'performance', keys: string[]) => (
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
        <div className="min-h-screen bg-cyber-black text-white font-exo">
            <Navbar />
            <div className="container mx-auto px-4 pt-24 pb-12">
                <Link to="/admin/dashboard" className="text-neon-blue flex items-center mb-6 hover:underline">
                    <ArrowLeft className="w-4 h-4 mr-2" /> Back to Dashboard
                </Link>

                <div className="bg-cyber-dark/50 border border-white/10 rounded-lg p-6 max-w-5xl mx-auto shadow-[0_0_50px_-12px_rgba(0,255,255,0.1)]">
                    <div className="flex justify-between items-center mb-8 border-b border-white/10 pb-4">
                        <h1 className="text-3xl font-orbitron text-neon-blue">
                            {isEditMode ? `Edit: ${suit?.name}` : 'New Mobile Suit Entry'}
                        </h1>
                        <button
                            onClick={handleSubmit(onSubmit)}
                            disabled={mutation.isPending}
                            className="bg-neon-blue text-black font-bold font-orbitron px-6 py-2 rounded hover:bg-white transition flex items-center"
                        >
                            {mutation.isPending ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            SAVE
                        </button>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                        {/* 1. Core Info */}
                        <div className="bg-black/20 p-6 rounded border border-white/10">
                            <h2 className="text-xl font-orbitron text-white mb-4">Core Identification</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-mono text-white/60 mb-1">Name *</label>
                                    <input {...register('name', { required: true })} className="w-full bg-black/40 border border-white/20 rounded p-2 focus:border-neon-blue outline-none text-lg font-bold" />
                                </div>
                                <div>
                                    <label className="block text-xs font-mono text-white/60 mb-1">Series</label>
                                    <input {...register('series')} className="w-full bg-black/40 border border-white/20 rounded p-2 focus:border-neon-blue outline-none" />
                                </div>
                            </div>

                            <div className="md:col-span-2 mt-4">
                                <label className="block text-xs font-mono text-white/60 mb-1">Legacy Source URL (Unique ID) *</label>
                                <input {...register('url', { required: true })} className="w-full bg-black/40 border border-white/20 rounded p-2 focus:border-neon-blue outline-none font-mono text-xs text-neon-cyan" />
                            </div>

                            {/* Image Upload Section */}
                            <div className="md:col-span-2">
                                <label className="block text-xs font-mono text-white/60 mb-2">Display Image</label>
                                <div className="flex items-center space-x-4 bg-black/40 p-4 rounded border border-white/10">
                                    {suit?.imageUrl && !selectedImage && (
                                        <div className="relative group">
                                            <img src={suit.imageUrl} alt="Current" className="w-20 h-20 object-cover rounded border border-white/20" />
                                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity text-[10px] text-white">Current</div>
                                        </div>
                                    )}
                                    <div className="flex-1">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={(e) => {
                                                if (e.target.files?.[0]) {
                                                    setSelectedImage(e.target.files[0]);
                                                }
                                            }}
                                            className="block w-full text-sm text-slate-500
                                                    file:mr-4 file:py-2 file:px-4
                                                    file:rounded-full file:border-0
                                                    file:text-sm file:font-semibold
                                                    file:bg-neon-blue/10 file:text-neon-blue
                                                    hover:file:bg-neon-blue/20 cursour-pointer"
                                        />
                                        <p className="text-[10px] text-white/40 mt-2">
                                            Selected: {selectedImage ? selectedImage.name : 'No file selected'}
                                        </p>
                                    </div>
                                </div>
                                <div className="md:col-span-2 mt-4">
                                    <label className="block text-xs font-mono text-white/60 mb-1">Description</label>
                                    <textarea {...register('description')} className="w-full bg-black/40 border border-white/20 rounded p-2 h-24 focus:border-neon-blue outline-none" />
                                </div>
                            </div>
                        </div>

                        {/* 2. Technical Data Groups */}
                        <div>
                            <h2 className="text-xl font-orbitron text-white mb-4">Technical Specifications</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {renderInputSection('Production', 'production', SECTION_KEYS.production)}
                                {renderInputSection('Development', 'development', SECTION_KEYS.development)}
                                {renderInputSection('Specifications', 'specifications', SECTION_KEYS.specifications)}
                                {renderInputSection('Performance', 'performance', SECTION_KEYS.performance)}
                            </div>
                        </div>

                        {/* 3. Armaments */}
                        <div className="bg-black/20 p-6 rounded border border-white/10">
                            <div className="flex items-center justify-between mb-4">
                                <h2 className="text-xl font-orbitron text-white">Armaments</h2>
                                <div className="space-x-2">
                                    <button type="button" onClick={() => appendArmament({ category: 'Fixed', items: [''] })} className="text-xs bg-neon-cyan/20 text-neon-cyan px-3 py-1 rounded hover:bg-neon-cyan/40">+ Fixed</button>
                                    <button type="button" onClick={() => appendArmament({ category: 'Handheld', items: [''] })} className="text-xs bg-neon-purple/20 text-neon-purple px-3 py-1 rounded hover:bg-neon-purple/40">+ Handheld</button>
                                </div>
                            </div>

                            <div className="space-y-4">
                                {armamentFields.map((field, index) => (
                                    <div key={field.id} className="bg-black/40 p-4 rounded border border-white/5 flex gap-4 items-start">
                                        <div className="flex-1">
                                            <div className="flex justify-between items-center mb-2">
                                                <input
                                                    {...register(`armaments.${index}.category` as const)}
                                                    className="bg-transparent border-b border-white/20 text-neon-blue font-bold w-1/3 focus:border-neon-blue outline-none"
                                                    placeholder="Category"
                                                />
                                                <button type="button" onClick={() => removeArmament(index)} className="text-danger-red hover:text-white"><Trash2 className="w-4 h-4" /></button>
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
                                {armamentFields.length === 0 && <p className="text-center text-white/30 text-sm py-4 italic">No armaments recorded.</p>}
                            </div>
                        </div>

                        {/* 4. Rich Text / Lists */}
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
                        </div>

                        {/* 5. Extra */}
                        <div className="bg-black/20 p-6 rounded border border-white/10">
                            <h2 className="text-xl font-orbitron text-white mb-4">Behind The Scenes</h2>
                            <textarea {...register('behindTheScenes')} className="w-full bg-black/40 border border-white/20 rounded p-3 h-32 focus:border-neon-blue outline-none text-sm" />
                        </div>
                    </form>
                </div>
            </div >
        </div >
    );
}
