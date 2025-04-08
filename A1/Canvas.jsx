// Canvas.jsx
import React, { useRef, useState } from "react";
import Node from "./Node";
import Edge from "./Edge";

export default function Canvas({
  nodes,
  edges,
  onAddNode,
  onDeleteNode,
  onRenameNode,
  onUpdateLogic,
  onUpdateType,
  onConnectNodes,
  onMoveNode,
  menuAnchor,
  setMenuAnchor,
}) {
  const [draggingNodeId, setDraggingNodeId] = useState(null);
  const [offset, setOffset] = useState({ x: 0, y: 0 });

  const [scale, setScale] = useState(1);
  const [translate, setTranslate] = useState({ x: 0, y: 0 });

  const svgRef = useRef(null);

  const handleMouseDown = (e, node) => {
    const svgRect = svgRef.current.getBoundingClientRect();
    const offsetX = e.clientX - svgRect.left - node.x * scale - translate.x;
    const offsetY = e.clientY - svgRect.top - node.y * scale - translate.y;
    setDraggingNodeId(node.id);
    setOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e) => {
    if (!draggingNodeId) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const newX = (e.clientX - svgRect.left - offset.x - translate.x) / scale;
    const newY = (e.clientY - svgRect.top - offset.y - translate.y) / scale;
    onMoveNode(draggingNodeId, newX, newY);
  };

  const handleMouseUp = () => {
    setDraggingNodeId(null);
  };

  const handleAddClick = (type) => {
    if (!menuAnchor) return;
    const { nodeId, x, y } = menuAnchor;
    const isCondition = type === "condition";
    onAddNode(nodeId, x + 200, y, isCondition, type);
    setMenuAnchor(null);
  };

  const zoomIn = () => setScale((prev) => Math.min(prev + 0.2, 2));
  const zoomOut = () => setScale((prev) => Math.max(prev - 0.2, 0.4));
  const fitToScreen = () => {
    if (nodes.length === 0 || !svgRef.current) return;
  
    const svgRect = svgRef.current.getBoundingClientRect();
  
    // Compute bounding box of all nodes
    const padding = 40;
    const minX = Math.min(...nodes.map((n) => n.x));
    const maxX = Math.max(...nodes.map((n) => n.x + 160)); // include node width
    const minY = Math.min(...nodes.map((n) => n.y));
    const maxY = Math.max(...nodes.map((n) => n.y + 100)); // include node height
  
    const graphWidth = maxX - minX + padding * 2;
    const graphHeight = maxY - minY + padding * 2;
  
    const scaleX = svgRect.width / graphWidth;
    const scaleY = svgRect.height / graphHeight;
  
    const newScale = Math.min(scaleX, scaleY, 1.5);
  
    const centerX = (svgRect.width - (minX + maxX) * newScale) / 2;
    const centerY = (svgRect.height - (minY + maxY) * newScale) / 2;
  
    setScale(newScale);
    setTranslate({ x: centerX, y: centerY });
  };
  

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100vh" }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Toolbar */}
      <div style={{ position: "absolute", top: 10, left: 10, zIndex: 9999 }}>
        <button onClick={zoomIn} style={{ marginRight: 4 }}>🔍+</button>
        <button onClick={zoomOut} style={{ marginRight: 4 }}>🔍−</button>
        <button onClick={fitToScreen}>🎯 Fit</button>
      </div>

      <svg width="100%" height="100%" ref={svgRef}>
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="10"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto-start-reverse"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill="#555" />
          </marker>
        </defs>

        <g
          transform={`translate(${translate.x}, ${translate.y}) scale(${scale})`}
        >
          {edges.map((edge) => {
            const fromNode = nodes.find((n) => n.id === edge.from);
            const toNode = nodes.find((n) => n.id === edge.to);
            return (
              <Edge
                key={edge.id}
                from={fromNode}
                to={toNode}
                label={edge.label}
              />
            );
          })}

          {nodes.map((node) => (
            <Node
              key={node.id}
              data={node}
              onAddNode={(id, x, y) => setMenuAnchor({ nodeId: id, x, y })}
              onDeleteNode={onDeleteNode}
              onRenameNode={onRenameNode}
              onUpdateLogic={onUpdateLogic}
              onUpdateType={onUpdateType}
              onConnectNodes={onConnectNodes}
              onMouseDown={(e) => handleMouseDown(e, node)}
            />
          ))}
        </g>
      </svg>

      {/* Floating "+" Menu */}
      {menuAnchor && (() => {
        const sourceNode = nodes.find(n => n.id === menuAnchor.nodeId);
        const isStartNode = sourceNode?.type === "start";
        const isFormNode = sourceNode?.type === "form";

        const hasFormChild = edges.some(e =>
          e.from === sourceNode?.id &&
          nodes.find(n => n.id === e.to)?.type === "form"
        );

        const canAddForm =
          isStartNode || (isFormNode && !hasFormChild);

        return (
          <div
            style={{
              position: "absolute",
              top: menuAnchor.y * scale + translate.y + 60,
              left: menuAnchor.x * scale + translate.x + 160,
              background: "white",
              border: "1px solid #ccc",
              borderRadius: 4,
              boxShadow: "0 2px 6px rgba(0,0,0,0.2)",
              padding: "4px",
              zIndex: 9999,
              fontSize: 12,
            }}
          >
            <div
              onClick={canAddForm ? () => handleAddClick("form") : undefined}
              style={{
                cursor: canAddForm ? "pointer" : "not-allowed",
                padding: "4px",
                color: canAddForm ? "black" : "gray"
              }}
            >
              📄 Form
            </div>

            {!isStartNode && (
              <div
                onClick={() => handleAddClick("condition")}
                style={{ cursor: "pointer", padding: "4px" }}
              >
                🔀 Condition
              </div>
            )}

            <div
              onClick={() => setMenuAnchor(null)}
              style={{ cursor: "pointer", padding: "4px", color: "gray" }}
            >
              ✖ Cancel
            </div>
          </div>
        );
      })()}
    </div>
  );
}
