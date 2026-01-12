import { Link } from 'react-router-dom';
import { ArrowLeft, Save, Loader2 } from 'lucide-react';
import { Navbar } from '@/components/layout/Navbar';
import { useLoreEditor } from '@/hooks/admin/useLoreEditor';
import { LoreCoreInfo } from '@/components/admin/editors/lore/LoreCoreInfo';
import { LoreTechSpecs } from '@/components/admin/editors/lore/LoreTechSpecs';
import { LoreArmaments } from '@/components/admin/editors/lore/LoreArmaments';
import { LoreHistory } from '@/components/admin/editors/lore/LoreHistory';

export function LoreEditor() {
    const {
        suit,
        isEditMode,
        isFetching,
        form,
        armamentArray,
        selectedImage,
        setSelectedImage,
        saveMobileSuit,
        isSaving
    } = useLoreEditor();

    if (isEditMode && isFetching) {
        return <div className="min-h-screen bg-cyber-black flex items-center justify-center text-neon-blue font-orbitron">Loading Data...</div>;
    }

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
                            onClick={saveMobileSuit}
                            disabled={isSaving}
                            className="bg-neon-blue text-black font-bold font-orbitron px-6 py-2 rounded hover:bg-white transition flex items-center"
                        >
                            {isSaving ? <Loader2 className="w-4 h-4 animate-spin mr-2" /> : <Save className="w-4 h-4 mr-2" />}
                            SAVE
                        </button>
                    </div>

                    <div className="space-y-8">
                        <LoreCoreInfo
                            form={form}
                            currentImageUrl={suit?.imageUrl}
                            selectedImage={selectedImage}
                            onImageSelect={setSelectedImage}
                        />

                        <LoreTechSpecs form={form} />

                        <LoreArmaments form={form} fieldArray={armamentArray} />

                        <LoreHistory form={form} />
                    </div>
                </div>
            </div >
        </div >
    );
}
