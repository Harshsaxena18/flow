import React, { useState } from "react";
import Canvas from "./components/Canvas";
import { autoLayout } from "./Utils/autoLayout";

export default function App() {
  const [nodes, setNodes] = useState([
    { id: "node-1", x: 100, y: 100, label: "Start", type: "start" },
  ]);
  const [edges, setEdges] = useState([]);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const layoutAndSetNodes = (allNodes, allEdges) => {
    const manuallyMovedIds = new Set(
      nodes.filter((n) => n._movedManually).map((n) => n.id)
    );

    const autoLaidOut = autoLayout(allNodes, allEdges);

    const final = autoLaidOut.map((n) =>
      manuallyMovedIds.has(n.id)
        ? { ...nodes.find((x) => x.id === n.id) } // preserve dragged position
        : n
    );

    setNodes(final);
    setEdges(allEdges);
  };

  const addNode = (parentId, x, y, isCondition = false, type = "email") => {
    const id = Date.now().toString();
    const newNode = {
      id,
      x,
      y,
      label: type.toUpperCase(),
      type,
      logic: "",
    };

    let newNodes = [...nodes, newNode];
    let newEdges = [...edges];

    if (parentId) {
      const parent = nodes.find((n) => n.id === parentId);
      if (parent?.type === "condition") {
        const existingYes = edges.find((e) => e.from === parentId && e.label === "Yes");
        const existingNo = edges.find((e) => e.from === parentId && e.label === "No");
        const label = !existingYes ? "Yes" : !existingNo ? "No" : "";
        if (label) {
          newEdges.push({ id: `${parentId}-${id}`, from: parentId, to: id, label });
        } else return;
      } else {
        newEdges.push({ id: `${parentId}-${id}`, from: parentId, to: id });
      }
    }

    if (type === "condition") {
      const yesId = `${id}-yes`;
      const noId = `${id}-no`;

      const yesNode = {
        id: yesId,
        x: x + 100,
        y: y + 160,
        label: "YES",
        type: "email",
        logic: "",
      };
      const noNode = {
        id: noId,
        x: x + 300,
        y: y + 160,
        label: "NO",
        type: "email",
        logic: "",
      };

      newNodes.push(yesNode, noNode);
      newEdges.push(
        { id: `${id}-${yesId}`, from: id, to: yesId, label: "Yes" },
        { id: `${id}-${noId}`, from: id, to: noId, label: "No" }
      );
    }

    layoutAndSetNodes(newNodes, newEdges);
  };

  const deleteNode = (nodeId) => {
    const getDescendants = (id, allEdges, collected = new Set()) => {
      const children = allEdges.filter(e => e.from === id).map(e => e.to);
      children.forEach(childId => {
        if (!collected.has(childId)) {
          collected.add(childId);
          getDescendants(childId, allEdges, collected);
        }
      });
      return collected;
    };

    const toDelete = getDescendants(nodeId, edges);
    toDelete.add(nodeId);

    const newNodes = nodes.filter((n) => !toDelete.has(n.id));
    const newEdges = edges.filter(
      (e) => !toDelete.has(e.from) && !toDelete.has(e.to)
    );

    layoutAndSetNodes(newNodes, newEdges);
  };

  const moveNode = (id, newX, newY) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id
          ? { ...node, x: newX, y: newY, _movedManually: true }
          : node
      )
    );
  };

  const renameNode = (id, newLabel) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, label: newLabel } : node))
    );
  };

  const updateNodeLogic = (id, newLogic) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, logic: newLogic } : node))
    );
  };

  const updateNodeType = (id, newType) => {
    setNodes((prev) =>
      prev.map((node) => (node.id === id ? { ...node, type: newType } : node))
    );
  };

  const connectNodes = (fromId, toId) => {
    if (
      fromId === toId ||
      edges.find((e) => e.from === fromId && e.to === toId)
    )
      return;

    const fromNode = nodes.find((n) => n.id === fromId);
    const label =
      fromNode.type === "condition"
        ? edges.find((e) => e.from === fromId && e.label === "Yes")
          ? "No"
          : "Yes"
        : "";

    const newEdge = { id: `${fromId}-${toId}`, from: fromId, to: toId, label };
    const newEdges = [...edges, newEdge];

    layoutAndSetNodes(nodes, newEdges);
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
        onUpdateLogic={updateNodeLogic}
        onUpdateType={updateNodeType}
        onConnectNodes={connectNodes}
        onMoveNode={moveNode}
        menuAnchor={menuAnchor}
        setMenuAnchor={setMenuAnchor}
      />
    </div>
  );
}
