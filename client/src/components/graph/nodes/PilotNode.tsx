import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CustomNode } from '../types';
import { NodeWrapper } from '../common/NodeWrapper';

export const PilotNode = ({ data, selected }: NodeProps<CustomNode>) => {
    return (
        <NodeWrapper selected={selected}>
            <div className="relative flex flex-col items-center group">
                {/* Identity Frame */}
                <div className={`w-24 h-24 relative p-1 transition-all duration-300 ${selected ? 'scale-110' : ''}`}>
                    <svg className="absolute inset-0 w-full h-full overflow-visible" viewBox="0 0 100 100">
                        <circle cx="50" cy="50" r="48" fill="none" className={`stroke-width-2 transition-colors duration-300 ${selected ? 'stroke-emerald-400' : 'stroke-slate-700'}`} strokeDasharray="20 5" />
                        <circle cx="50" cy="50" r="54" fill="none" className={`stroke-width-1 opacity-50 ${selected ? 'stroke-emerald-400 animate-pulse' : 'stroke-slate-800'}`} />
                    </svg>

                    <div className="w-full h-full rounded-full overflow-hidden bg-slate-900 relative">
                        {data.image ? (
                            <img src={data.image} alt={data.label} className="w-full h-full object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-emerald-900 font-mono text-xs">NO ID</div>
                        )}
                    </div>

                    {/* Status Indicator */}
                    <div className={`absolute top-0 right-0 w-4 h-4 rounded-full border-2 border-slate-950 ${selected ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-slate-700'}`}></div>
                </div>

                {/* Name Tag */}
                <div className={`mt-3 px-3 py-1 bg-slate-950/80 border-l-2 ${selected ? 'border-emerald-400 text-emerald-400' : 'border-slate-600 text-slate-500'} font-mono text-[10px] tracking-wider uppercase backdrop-blur-sm`}>
                    {data.label}
                </div>

                <Handle type="target" position={Position.Top} className="w-0 h-0 opacity-0" />
                <Handle type="source" position={Position.Bottom} className="w-0 h-0 opacity-0" />
            </div>
        </NodeWrapper>
    );
};
