import { Handle, Position, type NodeProps } from '@xyflow/react';
import type { CustomNode } from '../types';
import { NodeWrapper } from '../common/NodeWrapper';

export const FactionNode = ({ data, selected }: NodeProps<CustomNode>) => {
    return (
        <NodeWrapper selected={selected}>
            <div className="relative w-64 h-64 flex flex-col items-center justify-center">
                {/* Rotating HUD Rings - Outer */}
                <div className={`absolute inset-0 rounded-full border border-neon-blue/20 border-dashed animate-[spin_10s_linear_infinite] ${selected ? 'border-neon-blue/60 shadow-[0_0_30px_rgba(6,182,212,0.3)]' : ''}`}></div>
                <div className="absolute inset-2 rounded-full border border-neon-blue/10 animate-[spin_15s_linear_infinite_reverse]"></div>

                {/* Core Container */}
                <div className={`w-40 h-40 rounded-full bg-slate-950/80 border-2 overflow-hidden flex items-center justify-center relative backdrop-blur-md transition-colors duration-300 ${selected ? 'border-neon-blue' : 'border-slate-700'}`}>
                    {data.image ? (
                        <img src={data.image} alt={data.label} className="w-full h-full object-contain p-4 opacity-90 hover:opacity-100 transition-opacity" />
                    ) : (
                        <div className="text-5xl font-bold text-slate-800 tracking-tighter">Faction</div>
                    )}

                    {/* Scanline Effect */}
                    <div className="absolute inset-0 bg-[linear-gradient(transparent_0%,rgba(6,182,212,0.1)_50%,transparent_100%)] bg-size-[100%_200%] animate-[scan_3s_linear_infinite] pointer-events-none"></div>
                </div>

                {/* Cyber Label */}
                <div className="absolute -bottom-6 flex flex-col items-center">
                    <div className="h-4 w-px bg-neon-blue/50 mb-1"></div>
                    <div className={`px-6 py-1.5 bg-slate-900/90 border ${selected ? 'border-neon-blue text-neon-blue' : 'border-slate-700 text-slate-400'} rounded-none clip-path-polygon-[10%_0,100%_0,90%_100%,0%_100%] backdrop-blur text-sm font-orbitron font-bold tracking-widest uppercase shadow-lg`}>
                        {data.label}
                    </div>
                </div>

                {/* Handles */}
                <Handle type="target" position={Position.Top} className="w-0! h-0! opacity-0!" />
                <Handle type="source" position={Position.Bottom} className="w-0! h-0! opacity-0!" />
            </div>
        </NodeWrapper>
    );
};