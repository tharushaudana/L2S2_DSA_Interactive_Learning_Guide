export const TreeGraph = ({
  nodes,
  edges,
  highlightedNodes = [],
  highlightedEdges = [],
  activeNode = null,
  className = 'h-48',
  labelKey = 'id',           // field to display: 'id' or 'key'
  balanceFactors = null,     // map of nodeId -> bf number (for AVL)
  onNodeClick = null,
}) => (
  <svg viewBox="0 0 100 100" className={`w-full overflow-visible ${className}`}>
    {/* Edges */}
    {edges.map(([n1, n2], idx) => {
      const node1 = nodes.find(n => n.id === n1);
      const node2 = nodes.find(n => n.id === n2);
      if (!node1 || !node2) return null;

      const isHighlighted = highlightedEdges.some(
        e => (e[0] === n1 && e[1] === n2) || (e[0] === n2 && e[1] === n1)
      );

      return (
        <line
          key={idx}
          x1={node1.x} y1={node1.y} x2={node2.x} y2={node2.y}
          stroke={isHighlighted ? '#4F46E5' : '#CBD5E1'}
          strokeWidth={isHighlighted ? '2.5' : '1.5'}
          className="transition-all duration-300"
        />
      );
    })}

    {/* Nodes */}
    {nodes.map((node) => {
      const nodeId = node.id;
      const label = labelKey === 'key' ? node.key : node.id;
      const isHighlighted = highlightedNodes.includes(nodeId);
      const isActive = activeNode === nodeId;

      // AVL balance factor color coding
      let bf = balanceFactors ? balanceFactors[nodeId] : null;
      const isUnbalanced = bf !== null && Math.abs(bf) > 1;

      const fill = isActive ? '#4F46E5'
        : isHighlighted ? '#A5B4FC'
        : isUnbalanced ? '#FCA5A5'
        : '#F8FAFC';

      const stroke = isActive ? '#312E81'
        : isHighlighted ? '#4F46E5'
        : isUnbalanced ? '#EF4444'
        : '#94A3B8';

      const textFill = isActive ? 'white'
        : isHighlighted ? '#312E81'
        : isUnbalanced ? '#991B1B'
        : '#475569';

      return (
        <g
          key={nodeId}
          className={`transition-all duration-300 ${onNodeClick ? 'cursor-pointer' : ''}`}
          onClick={() => onNodeClick && onNodeClick(nodeId)}
        >
          <circle
            cx={node.x} cy={node.y} r="6.5"
            fill={fill}
            stroke={stroke}
            strokeWidth="1.5"
            className="transition-colors duration-300"
          />
          <text
            x={node.x} y={node.y}
            textAnchor="middle" dy=".35em"
            fontSize="4" fontWeight="bold"
            fill={textFill}
            className="pointer-events-none transition-colors duration-300 select-none"
          >
            {label}
          </text>

          {/* Balance factor label for AVL */}
          {bf !== null && (
            <text
              x={node.x + 8} y={node.y - 5}
              textAnchor="middle"
              fontSize="3.5" fontWeight="bold"
              fill={isUnbalanced ? '#EF4444' : '#6366F1'}
              className="pointer-events-none select-none"
            >
              {bf > 0 ? `+${bf}` : bf}
            </text>
          )}
        </g>
      );
    })}
  </svg>
);
