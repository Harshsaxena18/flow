import React, { useState } from "react";
import Canvas from "./components/Canvas";
import { autoLayout } from "./Utils/autoLayout";


export default function App() {
  const [nodes, setNodes] = useState([
    { id: "node-1", x: 100, y: 100, label: "Start", type: "start" },
  ]);
  const [edges, setEdges] = useState([]);
  const [menuInfo, setMenuInfo] = useState(null); // { id, x, y }
  const [menuAnchor, setMenuAnchor] = useState(null);


  const layoutAndSetNodes = (newNodes, newEdges) => {
    const laidOut = autoLayout(newNodes, newEdges);
    setNodes(laidOut);
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
        } else return; // Don't allow more than two children
      } else {
        newEdges.push({ id: `${parentId}-${id}`, from: parentId, to: id });
      }
    }
  
    // If this node is a Condition, auto-create Yes and No children
    if (type === "condition") {
      const yesId = `${id}-yes`;
      const noId = `${id}-no`;
  
      const yesNode = {
        id: yesId,
        x: x + 200,
        y: y + 100,
        label: "YES",
        type: "email",
        logic: "",
      };
  
      const noNode = {
        id: noId,
        x: x + 200,
        y: y + 200,
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
  
    setEdges(newEdges);
    layoutAndSetNodes(newNodes, newEdges);
  };
  

  const deleteNode = (nodeId) => {
    const nodeToDelete = nodes.find((n) => n.id === nodeId);
    if (!nodeToDelete) return;
  
    const children = edges.filter((e) => e.from === nodeId).map((e) => e.to);
    const parents = edges.filter((e) => e.to === nodeId).map((e) => e.from);
  
    const newEdges = edges.filter(
      (e) => e.from !== nodeId && e.to !== nodeId
    );
  
    const newNodes = nodes.filter((n) => n.id !== nodeId);
  
    if (parents.length === 1 && children.length >= 1) {
      const parent = parents[0];
      children.forEach((child) => {
        if (!newEdges.find((e) => e.from === parent && e.to === child)) {
          newEdges.push({ id: `${parent}-${child}`, from: parent, to: child });
        }
      });
    }
  
    setEdges(newEdges);
    layoutAndSetNodes(newNodes, newEdges);
  };
  const moveNode = (id, newX, newY) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, x: newX, y: newY } : node
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
