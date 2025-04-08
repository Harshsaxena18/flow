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
    const positioned = [];
    const visited = new Set();
    const nodeMap = Object.fromEntries(newNodes.map((n) => [n.id, n]));
  
    const positionNode = (id, depth = 0, siblingOffset = 0) => {
      if (visited.has(id)) return;
      visited.add(id);
  
      const node = nodeMap[id];
  
      // Only reposition if node hasn't been moved manually (has x=0 and y=0 or some flag)
      const manuallyMoved = node._movedManually;
      if (!manuallyMoved) {
        node.x = 100 + depth * 200;
        node.y = 100 + siblingOffset * 100;
      }
  
      positioned.push(node);
  
      const children = newEdges
        .filter((e) => e.from === id)
        .map((e) => nodeMap[e.to])
        .filter(Boolean);
  
      children.forEach((child, idx) => {
        positionNode(child.id, depth + 1, siblingOffset + idx);
      });
    };
  
    const rootNodes = newNodes.filter((n) => !newEdges.some((e) => e.to === n.id));
    rootNodes.forEach((root, idx) => {
      positionNode(root.id, 0, idx);
    });
  
    setNodes([...positioned]);
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
    // Helper function to get all descendants recursively
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
  
    // Get all descendant node IDs
    const descendantIds = getDescendants(nodeId, edges);
    descendantIds.add(nodeId); // Include the node itself
  
    // Filter out nodes and edges connected to this node or its descendants
    const newNodes = nodes.filter(n => !descendantIds.has(n.id));
    const newEdges = edges.filter(
      e => !descendantIds.has(e.from) && !descendantIds.has(e.to)
    );
  
    setEdges(newEdges);
    layoutAndSetNodes(newNodes, newEdges);
  };
  
  const moveNode = (id, newX, newY) => {
    setNodes((prev) =>
      prev.map((node) =>
        node.id === id ? { ...node, x: newX, y: newY ,_movedManually: true} : node
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
