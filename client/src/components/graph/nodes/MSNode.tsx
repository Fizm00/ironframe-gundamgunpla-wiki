import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CustomNode } from '../types';
import { NodeWrapper } from '../common/NodeWrapper';
import { Database } from 'lucide-react';

export const MSNode = ({ data, selected }: NodeProps<CustomNode>) => {
    return (
        <NodeWrapper selected={selected}>
            <div className={`relative w-48 transition-all duration-300 ${selected ? 'scale-105' : ''}`}>
                <div className={`bg-slate-900/90 border rounded-lg overflow-hidden backdrop-blur-xl transition-colors duration-300 ${selected ? 'border-indigo-400 shadow-[0_0_20px_rgba(99,102,241,0.2)]' : 'border-indigo-500/20 shadow-lg'}`}>
                    <div className={`h-1 w-full ${selected ? 'bg-indigo-500' : 'bg-slate-800'}`}></div>
                    <div className="h-28 w-full bg-slate-950 relative overflow-hidden group-hover:opacity-100">
                        {data.image ? (
                            <img src={data.image} alt={data.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                        ) : (
                            <div className="w-full h-full grid place-content-center text-slate-800 font-black text-2xl tracking-tighter opacity-20">MS</div>
                        )}
                        <div className="absolute inset-0 bg-linear-to-t from-slate-900 via-transparent to-transparent opacity-80"></div>

                        <div className="absolute top-2 right-2 flex flex-col gap-0.5 items-end opacity-70">
                            <div className="w-8 h-0.5 bg-indigo-400/50"></div>
                            <div className="w-5 h-0.5 bg-indigo-400/50"></div>
                            <div className="w-3 h-0.5 bg-indigo-400/50"></div>
                        </div>
                    </div>

                    <div className="p-3 relative">
                        <div className="text-xs font-bold text-indigo-300 font-orbitron truncate tracking-wide">{data.label}</div>
                        <div className="text-[9px] text-slate-500 font-mono truncate uppercase mt-0.5">{data.description || 'Unknown Unit'}</div>

                        <div className="absolute bottom-3 right-3 opacity-20">
                            <Database className="w-4 h-4 text-indigo-500" />
                        </div>
                    </div>
                </div>


                <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full"></div>
                <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-indigo-500 rounded-full"></div>

                <Handle type="target" position={Position.Top} className="w-0 h-0 opacity-0" />
                <Handle type="source" position={Position.Bottom} className="w-0 h-0 opacity-0" />
            </div>
        </NodeWrapper>
    );
};
