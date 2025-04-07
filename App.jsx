import React, { useState } from "react";
import Canvas from "./components/Canvas";

export default function App() {
  const [nodes, setNodes] = useState([
    {
      id: "node-1",
      x: 100,
      y: 200,
      label: "Start",
      type: "default",
    },
  ]);
  const [edges, setEdges] = useState([]);

  const getNodeById = (id) => nodes.find((n) => n.id === id);

  const generateUniqueId = () => `node-${nodes.length + 1}`;

  const addNode = (sourceId, x, y, isCondition = false) => {
    const sourceNode = getNodeById(sourceId);
    const baseId = nodes.length + 1;

    const newNode = {
      id: `node-${baseId}`,
      x: sourceNode.x + 200,
      y: sourceNode.y,
      label: isCondition ? "Condition" : `Step ${baseId}`,
      type: isCondition ? "condition" : "default",
    };

    const newNodes = [newNode];
    const newEdges = [
      {
        id: `edge-${sourceId}-${newNode.id}`,
        from: sourceId,
        to: newNode.id,
        label: "",
      },
    ];

    if (isCondition) {
      const yesNode = {
        id: `node-${baseId + 1}`,
        x: newNode.x + 200,
        y: newNode.y - 100,
        label: "Yes Path",
        type: "default",
      };
      const noNode = {
        id: `node-${baseId + 2}`,
        x: newNode.x + 200,
        y: newNode.y + 100,
        label: "No Path",
        type: "default",
      };

      newNodes.push(yesNode, noNode);

      newEdges.push(
        {
          id: `edge-${newNode.id}-${yesNode.id}`,
          from: newNode.id,
          to: yesNode.id,
          label: "Yes",
        },
        {
          id: `edge-${newNode.id}-${noNode.id}`,
          from: newNode.id,
          to: noNode.id,
          label: "No",
        }
      );
    }

    setNodes((prev) => [...prev, ...newNodes]);
    setEdges((prev) => [...prev, ...newEdges]);
  };

  const deleteNode = (id) => {
    const parents = edges.filter((e) => e.to === id).map((e) => e.from);
    const children = edges.filter((e) => e.from === id).map((e) => e.to);

    const newEdges = [];

    parents.forEach((parentId) => {
      children.forEach((childId) => {
        const edgeId = `edge-${parentId}-${childId}`;
        const exists = edges.some((e) => e.id === edgeId);
        if (!exists) {
          newEdges.push({
            id: edgeId,
            from: parentId,
            to: childId,
            label: "",
          });
        }
      });
    });

    const filteredEdges = edges.filter((e) => e.from !== id && e.to !== id);
    setEdges([...filteredEdges, ...newEdges]);
    setNodes((prev) => prev.filter((n) => n.id !== id));
  };

  const renameNode = (id, newLabel) => {
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, label: newLabel } : n))
    );
  };

  const connectNodes = (fromId, toId) => {
    const edgeId = `edge-${fromId}-${toId}`;
    if (edges.some((e) => e.id === edgeId)) return;

    setEdges((prev) => [
      ...prev,
      {
        id: edgeId,
        from: fromId,
        to: toId,
        label: "",
      },
    ]);
  };

  return (
    <div>
      <h2 style={{ textAlign: "center" }}>Workflow Builder</h2>
      <Canvas
        nodes={nodes}
        edges={edges}
        onAddNode={addNode}
        onDeleteNode={deleteNode}
        onRenameNode={renameNode}
        onConnectNodes={connectNodes}
      />
    </div>
  );
}
