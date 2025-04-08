// utils/autoLayout.js
export function autoLayout(nodes, edges) {
    const nodeMap = new Map(nodes.map((n) => [n.id, { ...n, children: [] }]));
    const parents = new Map();
    const edgeLabels = new Map();
  
    edges.forEach((edge) => {
      const from = nodeMap.get(edge.from);
      const to = nodeMap.get(edge.to);
      if (from && to) {
        from.children.push(to.id);
        parents.set(to.id, from.id);
        edgeLabels.set(`${from.id}-${to.id}`, edge.label || "");
      }
    });
  
    const roots = nodes.filter((n) => !parents.has(n.id));
    const layouted = [];
    let globalY = 100;
  
    function layoutNode(nodeId, x = 100, depth = 0) {
      const node = nodeMap.get(nodeId);
      const children = node.children;
      const y = globalY;
      globalY += 120;
  
      layouted.push({ ...node, x: x + depth * 180, y });
  
      if (node.type === "condition") {
        const yesChild = children.find((childId) =>
          edgeLabels.get(`${node.id}-${childId}`) === "Yes"
        );
        const noChild = children.find((childId) =>
          edgeLabels.get(`${node.id}-${childId}`) === "No"
        );
  
        if (yesChild) layoutNode(yesChild, x - 100, depth + 1); // Left
        if (noChild) layoutNode(noChild, x + 100, depth + 1);   // Right
      } else {
        children.forEach((childId) => layoutNode(childId, x, depth + 1));
      }
    }
  
    roots.forEach((root) => layoutNode(root.id));
  
    return layouted;
  }
  
