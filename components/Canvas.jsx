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

  const svgRef = useRef(null);

  const handleMouseDown = (e, node) => {
    const svgRect = svgRef.current.getBoundingClientRect();
    const offsetX = e.clientX - svgRect.left - node.x;
    const offsetY = e.clientY - svgRect.top - node.y;
    setDraggingNodeId(node.id);
    setOffset({ x: offsetX, y: offsetY });
  };

  const handleMouseMove = (e) => {
    if (!draggingNodeId) return;
    const svgRect = svgRef.current.getBoundingClientRect();
    const newX = e.clientX - svgRect.left - offset.x;
    const newY = e.clientY - svgRect.top - offset.y;
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

  return (
    <div
      style={{ position: "relative", width: "100%", height: "100vh" }}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
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

        {edges.map((edge) => {
          const fromNode = nodes.find((n) => n.id === edge.from);
          const toNode = nodes.find((n) => n.id === edge.to);
          return (
            <Edge key={edge.id} from={fromNode} to={toNode} label={edge.label} />
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
      </svg>

      {/* Floating "+" Menu */}
      {menuAnchor && (
        <div
          style={{
            position: "absolute",
            top: menuAnchor.y + 50,
            left: menuAnchor.x + 150,
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
            onClick={() => handleAddClick("condition")}
            style={{ cursor: "pointer", padding: "4px" }}
          >
            🔀 Condition
          </div>
          <div
            onClick={() => handleAddClick("form")}
            style={{ cursor: "pointer", padding: "4px" }}
          >
            📄 Form
          </div>
          <div
            onClick={() => setMenuAnchor(null)}
            style={{ cursor: "pointer", padding: "4px", color: "gray" }}
          >
            ✖ Cancel
          </div>
        </div>
      )}
    </div>
  );
}
