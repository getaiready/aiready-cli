import { GraphNode } from './types';
import { CIRCULAR_LAYOUT_RADIUS_RATIO } from './constants';

/**
 * Calculates node positions for a circular layout.
 *
 * @param nodes - Array of dependency nodes.
 * @param width - Canvas width.
 * @param height - Canvas height.
 * @lastUpdated 2026-03-18
 */
export function applyCircularLayout(
  nodes: GraphNode[],
  width: number,
  height: number
): void {
  const centerX = width / 2;
  const centerY = height / 2;
  const radius = Math.min(width, height) * CIRCULAR_LAYOUT_RADIUS_RATIO;

  nodes.forEach((node, i) => {
    const angle = (2 * Math.PI * i) / nodes.length;
    node.fx = centerX + Math.cos(angle) * radius;
    node.fy = centerY + Math.sin(angle) * radius;
    node.x = node.fx;
    node.y = node.fy;
  });
}

/**
 * Calculates node positions for a hierarchical layout by grouping packages.
 *
 * @param nodes - Array of dependency nodes.
 * @param width - Canvas width.
 * @param height - Canvas height.
 * @lastUpdated 2026-03-18
 */
export function applyHierarchicalLayout(
  nodes: GraphNode[],
  width: number,
  height: number
): void {
  const groups = new Map<string, GraphNode[]>();
  nodes.forEach((n: any) => {
    const key = n.packageGroup || n.group || 'root';
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key)!.push(n);
  });

  const groupArray = Array.from(groups.entries());
  const cols = Math.ceil(Math.sqrt(groupArray.length));
  const groupSpacingX = (width * 0.8) / cols;
  const groupSpacingY = (height * 0.8) / Math.ceil(groupArray.length / cols);

  groupArray.forEach(([groupKey, groupNodes], gi) => {
    const col = gi % cols;
    const row = Math.floor(gi / cols);
    const groupX = (col + 0.5) * groupSpacingX;
    const groupY = (row + 0.5) * groupSpacingY;

    if (groupKey.startsWith('pkg:') || groupKey === groupKey) {
      groupNodes.forEach((n, ni) => {
        const angle = (2 * Math.PI * ni) / groupNodes.length;
        const r = Math.min(80, 20 + groupNodes.length * 8);
        n.fx = groupX + Math.cos(angle) * r;
        n.fy = groupY + Math.sin(angle) * r;
        n.x = n.fx;
        n.y = n.fy;
      });
    }
  });
}

/**
 * Calculates initial random positions for nodes in a force-directed layout.
 *
 * @param nodes - Array of dependency nodes.
 * @param width - Canvas width.
 * @param height - Canvas height.
 * @lastUpdated 2026-03-18
 */
export function applyInitialForceLayout(
  nodes: GraphNode[],
  width: number,
  height: number
): void {
  nodes.forEach((node) => {
    if (node.fx === undefined || node.fx === null) {
      node.x = Math.random() * width;
      node.y = Math.random() * height;
    }
  });
}
