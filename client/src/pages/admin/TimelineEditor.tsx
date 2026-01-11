
import { useNavigate, useParams } from 'react-router-dom';

export function TimelineEditor() {
    const { id } = useParams();
    const isEditing = !!id;
    const navigate = useNavigate();

    return (
        <div className="p-8 text-center">
            <h1 className="text-2xl font-orbitron text-foreground mb-4">{isEditing ? 'Edit Event' : 'New Event'}</h1>
            <p className="text-foreground-muted mb-8">This feature is under construction.</p>
            <button
                onClick={() => navigate('/admin/timeline')}
                className="px-4 py-2 bg-surface border border-border hover:bg-surface-hover rounded"
            >
                Back to List
            </button>
        </div>
    );
}
