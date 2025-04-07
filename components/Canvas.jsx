import React from "react";
import Node from "./Node";
import Edge from "./Edge";

export default function Canvas({ nodes, edges, onAddNode, onDeleteNode, onRenameNode, onConnectNodes }) {
  return (
    <svg width="100%" height="100vh">
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
        if (!fromNode || !toNode) return null;
        return <Edge key={edge.id} from={fromNode} to={toNode} label={edge.label} />;
      })}

      {nodes.map((node) => (
        <Node
          key={node.id}
          data={node}
          onAddNode={onAddNode}
          onDeleteNode={onDeleteNode}
          onRenameNode={onRenameNode}
          onConnectNodes={onConnectNodes}
        />
      ))}
    </svg>
  );
}
