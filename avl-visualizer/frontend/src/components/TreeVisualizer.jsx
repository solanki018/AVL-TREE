import { motion } from "framer-motion";

// Recursive Tree Node Component
function TreeNode({ node, x, y, level, parentX, parentY }) {
  if (!node) return null;

  const dx = 150 / (level + 1);
  const dy = 90;

  const leftX = x - dx;
  const rightX = x + dx;
  const nextY = y + dy;

  return (
    <>
      {/* Line to parent */}
      {parentX !== null && (
        <motion.line
          x1={parentX}
          y1={parentY}
          x2={x}
          y2={y}
          stroke="#aaa"
          strokeWidth={2}
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 1 }}
          transition={{ duration: 0.3 }}
        />
      )}

      {/* Recursively draw left/right children */}
      <TreeNode node={node.left} x={leftX} y={nextY} level={level + 1} parentX={x} parentY={y} />
      <TreeNode node={node.right} x={rightX} y={nextY} level={level + 1} parentX={x} parentY={y} />

      {/* Node circle and text */}
      <motion.circle
        cx={x}
        cy={y}
        r={18}
        fill="#4f46e5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      />
      <motion.text
        x={x}
        y={y + 5}
        textAnchor="middle"
        fill="white"
        fontSize="14"
      >
        {node.val}
      </motion.text>
    </>
  );
}

export default function TreeVisualizer({ data }) {
  if (!data) return null;

  let parsed = null;
  try {
    parsed = JSON.parse(data);
  } catch {
    return <p className="text-red-500">Invalid Tree JSON</p>;
  }

  return (
    <svg width="100%" height="500" className="bg-white rounded border">
      <TreeNode
        node={parsed}
        x={window.innerWidth / 2}
        y={50}
        level={0}
        parentX={null}
        parentY={null}
      />
    </svg>
  );
}
