// Edge.jsx
import React from "react";

export default function Edge({ from, to, label }) {
  const fromX = from.x + 70;
  const fromY = from.y + 60; // bottom of source node
  const toX = to.x + 70;
  const toY = to.y; // top of target node

  const midY = (fromY + toY) / 2;

  const path = `
    M ${fromX} ${fromY}
    L ${fromX} ${midY}
    L ${toX} ${midY}
    L ${toX} ${toY}
  `;

  return (
    <>
      <path
        d={path}
        stroke="#444"
        strokeWidth="2"
        fill="none"
        markerEnd="url(#arrow)"
      />
      {label && (
        <text
          x={(fromX + toX) / 2}
          y={midY - 5}
          textAnchor="middle"
          fontSize="12"
          fill="black"
        >
          {label}
        </text>
      )}
    </>
  );
}
