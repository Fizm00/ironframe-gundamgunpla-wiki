import { useCallback, useEffect, useState, useMemo } from 'react';
import { useNodesState, useEdgesState, type Edge, type Node, MarkerType } from '@xyflow/react';
import api from '@/lib/api';
import type { CustomNode, GraphApiResponse } from '../types';

export function useGraphEngine() {
    const [nodes, setNodes, onNodesChange] = useNodesState<CustomNode>([]);
    const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
    const [loading, setLoading] = useState(true);
    const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);

    // Initial Fetch (Roots)
    useEffect(() => {
        const fetchRoots = async () => {
            try {
                const res = await api.get('/relationships/roots');
                const data = res.data as GraphApiResponse;

                const rootNodes: CustomNode[] = data.nodes.map((n, i) => ({
                    id: n.id,
                    type: n.type,
                    data: { ...n },
                    position: { x: 350 * i, y: 0 },
                }));
                setNodes(rootNodes);
            } catch (err) {
                console.error("Failed to load roots", err);
            } finally {
                setLoading(false);
            }
        };
        fetchRoots();
    }, [setNodes]);

    // Handle Node Click -> Expand & Select
    const onNodeClick = useCallback(async (_event: React.MouseEvent, node: Node) => {
        setSelectedNodeId(node.id);

        try {
            const res = await api.get(`/relationships/network/${node.type}/${node.id}`);
            const { nodes: newNodesData, edges: newEdgesData } = res.data as GraphApiResponse;

            // --- IMPROVED LAYOUT ALGORITHM ---
            const parentPos = node.position;

            // Calculate angle from center (0,0) to parent
            // If parent is at 0,0 (roots), assume downward spread
            const isRoot = parentPos.y === 0 && Math.abs(parentPos.x) > 0;
            const centerAngle = isRoot ? Math.PI / 2 : Math.atan2(parentPos.y, parentPos.x); // Roots spread DOWN

            const expandRadius = isRoot ? 600 : 500; // Large radius to avoid overlap

            // Determine spread angle
            const totalSpread = isRoot ? Math.PI * 0.8 : Math.PI / 1.5;

            // Filter unique new nodes
            const uniqueNewNodes = newNodesData.filter((n) => !nodes.some((existing) => existing.id === n.id));

            const newNodes: CustomNode[] = uniqueNewNodes.map((n, i) => {
                // Distribute in an arc around the centerAngle
                // i goes from 0 to length-1
                // We want to center the arc around centerAngle

                const count = uniqueNewNodes.length;
                const offset = count > 1
                    ? (i - (count - 1) / 2) * (totalSpread / (count + 1)) // Spread evenly within the totalSpread
                    : 0;

                const angle = centerAngle + offset;

                return {
                    id: n.id,
                    type: n.type,
                    data: { ...n },
                    position: {
                        x: parentPos.x + expandRadius * Math.cos(angle),
                        y: parentPos.y + expandRadius * Math.sin(angle)
                    },
                };
            });

            const newEdges: Edge[] = newEdgesData
                .filter((e) => !edges.some((existing) => existing.id === e.id))
                .map((e) => ({
                    id: e.id,
                    source: e.source,
                    target: e.target,
                    label: e.label,
                    type: 'default',
                    animated: true,
                    style: {
                        stroke: e.label?.includes('Enemy') ? '#ef4444' : '#06b6d4',
                        strokeWidth: 2,
                        opacity: 0.6
                    },
                    markerEnd: {
                        type: MarkerType.ArrowClosed,
                        color: e.label?.includes('Enemy') ? '#ef4444' : '#06b6d4'
                    },
                }));

            setNodes((nds) => [...nds, ...newNodes]);
            setEdges((eds) => [...eds, ...newEdges]);

        } catch (err) {
            console.error("Failed to expand node", err);
        }
    }, [nodes, edges, setNodes, setEdges]);

    const clearSelection = useCallback(() => setSelectedNodeId(null), []);

    const selectedNode = useMemo(() =>
        nodes.find(n => n.id === selectedNodeId),
        [nodes, selectedNodeId]);

    return {
        nodes,
        edges,
        onNodesChange,
        onEdgesChange,
        onNodeClick,
        loading,
        selectedNode,
        clearSelection
    };
}
