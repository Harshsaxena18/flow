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
    let globalX = 100;
  
    function layoutNode(nodeId, y = 100, level = 0) {
      const node = nodeMap.get(nodeId);
      const children = node.children;
      const x = globalX;
      globalX += 200;
  
      layouted.push({ ...node, x, y: y + level * 160 });
  
      if (node.type === "condition") {
        const yesChild = children.find((childId) =>
          edgeLabels.get(`${node.id}-${childId}`) === "Yes"
        );
        const noChild = children.find((childId) =>
          edgeLabels.get(`${node.id}-${childId}`) === "No"
        );
  
        if (yesChild) layoutNode(yesChild, y + 160, level + 1); // lower
        if (noChild) layoutNode(noChild, y + 160, level + 1);   // lower
      } else {
        children.forEach((childId) => layoutNode(childId, y + 160, level + 1));
      }
    }
  
    roots.forEach((root) => layoutNode(root.id));
    return layouted;
  }
  