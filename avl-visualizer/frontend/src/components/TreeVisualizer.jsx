import { motion } from "framer-motion";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

/**
 * @typedef {Object} TreeNodeData
 * @property {number} val
 * @property {TreeNodeData|null} left
 * @property {TreeNodeData|null} right
 */

/**
 * @typedef {Object} TreeNodeProps
 * @property {TreeNodeData} node
 * @property {number} x
 * @property {number} y
 * @property {number} level
 * @property {number|null} parentX
 * @property {number|null} parentY
 */

function TreeNode({ node, x, y, level, parentX, parentY }) {
  if (!node) return null;

  const dx = 180 * Math.pow(0.6, level);
  const dy = 90;

  const leftX = x - dx;
  const rightX = x + dx;
  const nextY = y + dy;

  return (
    <>
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

      {node.left && (
        <TreeNode
          node={node.left}
          x={leftX}
          y={nextY}
          level={level + 1}
          parentX={x}
          parentY={y}
        />
      )}
      {node.right && (
        <TreeNode
          node={node.right}
          x={rightX}
          y={nextY}
          level={level + 1}
          parentX={x}
          parentY={y}
        />
      )}

      <motion.circle
        cx={x}
        cy={y}
        r={20}
        fill="#4f46e5"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ type: "spring", stiffness: 200 }}
      />
      <motion.text
        x={x}
        y={y + 6}
        textAnchor="middle"
        fill="white"
        fontSize="14"
      >
        {node.val}
      </motion.text>
    </>
  );
}

/**
 * @typedef {Object} TreeVisualizerProps
 * @property {string} data
 */

export default function TreeVisualizer({ data }) {
  if (!data) return null;

  let parsed = null;
  try {
    parsed = JSON.parse(data);
  } catch {
    return <p className="text-red-500 p-4">❌ Invalid Tree JSON</p>;
  }

  return (
   <TransformWrapper
      options={{ limitToBounds: false }} // Allow free panning/zooming outside bounds
      pan={{ disabled: false }}         // Enable drag/pan
      pinch={{ disabled: false }}       // Enable pinch zoom
      wheel={{ step: 50 }}              // Set zoom sensitivity with mouse wheel
      doubleClick={{ disabled: true }}  // Disable zoom on double click
      centerOnInit                      // Automatically center on load
      minScale={0.9}                    // Prevent too much zoom-out
      maxScale={3}                      // Prevent too much zoom-in
    >
      <TransformComponent wrapperClass="w-full h-full">
        {/* Center SVG in parent using flexbox */}
        <div className="w-full h-full flex justify-center items-start">
          <svg
            width="1600"               // Initial width (can adjust as needed)
            height="800"              // Initial height
            viewBox="0 0 1600 800"    // Logical coordinate system for scaling
            xmlns="http://www.w3.org/2000/svg"
          >
            <TreeNode
              node={parsed}           // Root node to start rendering from
              x={800}                 // Center X coordinate (half of width)
              y={50}                  // Starting Y coordinate
              level={0}               // Root is at level 0
              parentX={null}          // No parent for root
              parentY={null}
            />
          </svg>
        </div>
      </TransformComponent>
    </TransformWrapper>
);

}
