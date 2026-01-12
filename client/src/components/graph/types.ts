import type { Node } from '@xyflow/react';

export type GraphNodeData = {
    label: string;
    image?: string;
    description?: string;
    [key: string]: unknown;
};

export type CustomNode = Node<GraphNodeData>;

export type GraphApiResponse = {
    nodes: Array<{
        id: string;
        type: string;
        label: string;
        image?: string;
        description?: string;
        [key: string]: unknown;
    }>;
    edges: Array<{
        id: string;
        source: string;
        target: string;
        label?: string;
    }>;
};
