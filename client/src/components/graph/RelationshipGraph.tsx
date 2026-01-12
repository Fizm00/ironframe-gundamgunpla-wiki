import { useMemo } from 'react';
import { ReactFlow, Controls, Background, Panel } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { Loader2 } from 'lucide-react';
import { AnimatePresence } from 'framer-motion';
import { FactionNode } from './nodes/FactionNode';
import { PilotNode } from './nodes/PilotNode';
import { MSNode } from './nodes/MSNode';
import { DataPanel } from './panels/DataPanel';
import { useGraphEngine } from './hooks/useGraphEngine';

export function RelationshipGraph() {
    const {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onNodeClick,
        loading,
        selectedNode,
        clearSelection
    } = useGraphEngine();

    const nodeTypes = useMemo(() => ({
        faction: FactionNode,
        pilot: PilotNode,
        mobile_suit: MSNode,
    }), []);

    return (
        <div className="w-full h-[85vh] bg-slate-950 relative overflow-hidden rounded-2xl border border-slate-800 shadow-2xl">
            <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-size-[60px_60px] opacity-10 pointer-events-none"></div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(6,182,212,0.05)_0%,transparent_50%)] pointer-events-none"></div>

            {loading && (
                <div className="absolute inset-0 flex items-center justify-center z-50 bg-slate-950/90 backdrop-blur-sm">
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-neon-blue animate-spin" />
                        <div className="text-neon-blue font-mono text-sm tracking-[0.2em] animate-pulse">INITIALIZING NETWORK...</div>
                    </div>
                </div>
            )}

            <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onNodeClick={onNodeClick}
                onPaneClick={clearSelection}
                nodeTypes={nodeTypes}
                fitView
                minZoom={0.1}
                maxZoom={2}
                defaultEdgeOptions={{ type: 'smoothstep', animated: true }}
                proOptions={{ hideAttribution: true }}
                className="bg-slate-950"
            >
                <Background color="#1e293b" gap={40} size={1} />
                <Controls className="bg-slate-900 border-slate-700 text-slate-300 rounded-lg overflow-hidden" />

                <Panel position="top-left" className="m-4">
                    <div className="p-4 bg-slate-900/90 backdrop-blur-md border border-slate-700/50 rounded-lg max-w-sm pointer-events-none select-none shadow-xl">
                        <div className="flex items-center gap-3 mb-2">
                            <div className="w-2 h-2 bg-neon-blue rounded-full animate-ping"></div>
                            <h3 className="text-neon-blue font-orbitron font-bold text-sm tracking-wider">NET.VISUALIZER v2.0</h3>
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono leading-relaxed">
                            INTERACTIVE RELATIONSHIP MAPPING SYSTEM. <br />
                            &gt; SELECT NODES TO EXPAND CONNECTIONS.<br />
                            &gt; ACCESS CLASSIFIED DATA VIA SIDE PANEL.
                        </p>
                    </div>
                </Panel>
            </ReactFlow>

            <AnimatePresence>
                {selectedNode && (
                    <DataPanel node={selectedNode} onClose={clearSelection} />
                )}
            </AnimatePresence>
        </div>
    );
}
