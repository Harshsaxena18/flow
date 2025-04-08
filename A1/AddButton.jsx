import React from "react";

export default function AddButton({ x, y, onClick, color = "#28a745", label = "+" }) {
  return (
    <g transform={`translate(${x}, ${y})`} onClick={onClick} style={{ cursor: "pointer" }}>
      <circle r={10} fill={color} />
      <text
        x={0}
        y={4}
        textAnchor="middle"
        fontSize="12"
        fill="white"
      >
        {label}
      </text>
    </g>
  );
}
