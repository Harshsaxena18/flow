import React from "react";
import AddButton from "./AddButton";
export default function Node({
  data,
  onAddNode,
  onDeleteNode,
  onRenameNode,
  onUpdateLogic,
  onUpdateType,
  onConnectNodes,
  onMouseDown,
}) {
  const { x, y, label, type, id, logic } = data;
  const width = 140;
  const height = type === "condition" ? 100 : 60;

  const handleRename = () => {
    const newLabel = prompt("Enter new label:", label);
    if (newLabel) onRenameNode(id, newLabel);
  };

  const handleConnect = () => {
    const targetId = prompt("Enter ID of node to connect to:");
    if (targetId) onConnectNodes(id, targetId);
  };

  const handleLogicChange = (e) => {
    onUpdateLogic(id, e.target.value);
  };

  const handleTypeChange = (e) => {
    onUpdateType(id, e.target.value);
  };

  return (
    <g transform={`translate(${x}, ${y})`} onMouseDown={onMouseDown}>
      <rect
        width={width}
        height={height}
        fill={
          type === "condition"
            ? "#ffc107"
            : type === "start"
            ? "#28a745"
            : "#007bff"
        }
        rx={10}
        ry={10}
        onDoubleClick={handleRename}
        style={{ cursor: "move" }}
      />
      <foreignObject x="5" y="5" width={width - 10} height={height - 10}>
        <div style={{ padding: 4, fontSize: 12, color: "white" }}>
          <strong>{label}</strong>
          <br />
          <select
            value={type}
            onChange={handleTypeChange}
            style={{ width: "100%", marginTop: 4 }}
            disabled={type === "start"}
          >
            <option value="email">Email</option>
            <option value="wait">Wait</option>
            <option value="webhook">Webhook</option>
            <option value="condition">Condition</option>
          </select>
          {type === "condition" && (
            <input
              value={logic || ""}
              onChange={handleLogicChange}
              style={{
                width: "100%",
                marginTop: 4,
                fontSize: "10px",
                padding: "2px",
              }}
              placeholder="Enter logic (e.g., x > 10)"
            />
          )}
        </div>
      </foreignObject>

      {type !== "start" && (
        <>
          <AddButton
            x={-20}
            y={10}
            onClick={() => onDeleteNode(id)}
            color="#dc3545"
            label="X"
          />
          <AddButton
            x={-20}
            y={40}
            onClick={handleConnect}
            color="#6c757d"
            label="→"
          />
        </>
      )}

      {type !== "condition" && (
        <AddButton
          x={width + 10}
          y={10}
          onClick={() => onAddNode(id, x, y)}
          label="+"
          color="#17a2b8"
        />
      )}
    </g>
  );
}
