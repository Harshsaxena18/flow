import React from "react";

export default function Edge({ from, to, label }) {
  const startX = from.x + 120;
  const startY = from.y + 30;
  const endX = to.x;
  const endY = to.y + 30;

  const midX = (startX + endX) / 2;
  const midY = (startY + endY) / 2;

  return (
    <>
      <path
        d={`M${startX},${startY} C${midX},${startY} ${midX},${endY} ${endX},${endY}`}
        stroke="#555"
        fill="transparent"
        strokeWidth={2}
        markerEnd="url(#arrow)"
      />
      {label && (
        <text
          x={midX}
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
