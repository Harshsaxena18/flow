import React from "react";
import AddButton from "./AddButton";

export default function Node({ data, onAddNode, onDeleteNode, onRenameNode, onConnectNodes }) {
  const { x, y, label, type, id } = data;
  const width = 120;
  const height = 60;

  const handleRename = () => {
    const newLabel = prompt("Enter new label:", label);
    if (newLabel) {
      onRenameNode(id, newLabel);
    }
  };

  const handleConnect = () => {
    const targetId = prompt("Enter ID of node to connect to:");
    if (targetId) {
      onConnectNodes(id, targetId);
    }
  };

  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect
        width={width}
        height={height}
        fill={type === "condition" ? "#ffc107" : "#007bff"}
        rx={10}
        ry={10}
        onDoubleClick={handleRename}
      />
      <text
        x={width / 2}
        y={height / 2}
        alignmentBaseline="middle"
        textAnchor="middle"
        fill="white"
        fontSize="14"
      >
        {label}
      </text>

      <AddButton x={width + 10} y={10} onClick={() => onAddNode(id, x + 200, y)} />
      <AddButton x={width + 10} y={40} onClick={() => onAddNode(id, x + 200, y, true)} color="#ffc107" label="?" />
      <AddButton x={-20} y={10} onClick={() => onDeleteNode(id)} color="#dc3545" label="X" />
      <AddButton x={-20} y={40} onClick={handleConnect} color="#6c757d" label="→" />
    </g>
  );
}
