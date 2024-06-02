import { type ChangeEventHandler, useCallback, useState } from "react";
import {
  ReactFlow,
  addEdge,
  type Node,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type Edge,
  MiniMap,
  Background,
  Controls,
  Panel,
  type ColorMode,
  Position,
} from "@xyflow/react";

import "@xyflow/react/dist/style.css";
import { useTheme } from "next-themes";

const nodeDefaults = {
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
};

const initialNodes: Node[] = [
  {
    id: "A",
    type: "input",
    position: { x: 0, y: 150 },
    data: { label: "A" },
    ...nodeDefaults,
  },
  {
    id: "B",
    position: { x: 250, y: 0 },
    data: { label: "B" },
    ...nodeDefaults,
  },
  {
    id: "C",
    position: { x: 250, y: 150 },
    data: { label: "C" },
    ...nodeDefaults,
  },
  {
    id: "D",
    position: { x: 250, y: 300 },
    data: { label: "D" },
    ...nodeDefaults,
  },
];

const initialEdges: Edge[] = [
  {
    id: "A-B",
    source: "A",
    target: "B",
  },
  {
    id: "A-C",
    source: "A",
    target: "C",
  },
  {
    id: "A-D",
    source: "A",
    target: "D",
  },
];

const BlueprintBuilder = () => {
  const { theme } = useTheme();

  const [nodes, , onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect: OnConnect = useCallback(
    (params) => setEdges((eds) => addEdge(params, eds)),
    [setEdges],
  );

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      colorMode={theme === "dark" ? "dark" : "light"}
      fitView
    >
      <MiniMap />
      <Background />
      <Controls />
    </ReactFlow>
  );
};

export default BlueprintBuilder;
