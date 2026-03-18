import React, {
  useCallback,
  useEffect,
  useRef,
  useState,
  forwardRef,
  useImperativeHandle,
} from 'react';
import * as d3 from 'd3';
import { cn } from '../utils/cn';
import NodeItem from './NodeItem';
import LinkItem from './LinkItem';
import { PackageBoundaries } from './PackageBoundaries';
import {
  applyCircularLayout,
  applyHierarchicalLayout,
  applyInitialForceLayout,
} from './layout-utils';
import {
  DEFAULT_NODE_COLOR,
  DEFAULT_NODE_SIZE,
  DEFAULT_LINK_COLOR,
  DEFAULT_LINK_WIDTH,
  FIT_VIEW_PADDING,
  TRANSITION_DURATION_MS,
} from './constants';
import { useGraphZoom, useWindowDrag } from './hooks';

import { GraphNode, GraphLink, LayoutType } from './types';
export type { GraphNode, GraphLink, LayoutType };

/**
 * Handle for imperative actions on the ForceDirectedGraph.
 */
export interface ForceDirectedGraphHandle {
  /** Pins all nodes to their current positions. */
  pinAll: () => void;
  /** Unpins all nodes, allowing them to move freely in the simulation. */
  unpinAll: () => void;
  /** Resets the layout by unpinning all nodes and restarting the simulation. */
  resetLayout: () => void;
  /** Rescales and re-centers the view to fit all nodes. */
  fitView: () => void;
  /** Returns the IDs of all currently pinned nodes. */
  getPinnedNodes: () => string[];
  /**
   * Enable or disable drag mode for nodes.
   * @param enabled - When true, nodes can be dragged; when false, dragging is disabled
   */
  setDragMode: (enabled: boolean) => void;
  /** Sets the current layout type. */
  setLayout: (layout: LayoutType) => void;
  /** Gets the current layout type. */
  getLayout: () => LayoutType;
}

/**
 * Props for the ForceDirectedGraph component.
 */
export interface ForceDirectedGraphProps {
  /** Array of node objects to render. */
  nodes: GraphNode[];
  /** Array of link objects to render. */
  links: GraphLink[];
  /** Width of the SVG canvas. */
  width: number;
  /** Height of the SVG canvas. */
  height: number;
  /** Whether to enable zoom and pan interactions. */
  enableZoom?: boolean;
  /** Whether to enable node dragging. */
  enableDrag?: boolean;
  /** Callback fired when a node is clicked. */
  onNodeClick?: (node: GraphNode) => void;
  /** Callback fired when a node is hovered. */
  onNodeHover?: (node: GraphNode | null) => void;
  /** Callback fired when a link is clicked. */
  onLinkClick?: (link: GraphLink) => void;
  /** ID of the currently selected node. */
  selectedNodeId?: string;
  /** ID of the currently hovered node. */
  hoveredNodeId?: string;
  /** Default fallback color for nodes. */
  defaultNodeColor?: string;
  /** Default fallback size for nodes. */
  defaultNodeSize?: number;
  /** Default fallback color for links. */
  defaultLinkColor?: string;
  /** Default fallback width for links. */
  defaultLinkWidth?: number;
  /** Whether to show labels on nodes. */
  showNodeLabels?: boolean;
  /** Whether to show labels on links. */
  showLinkLabels?: boolean;
  /** Additional CSS classes for the SVG element. */
  className?: string;
  /** Whether manual layout mode is active. */
  manualLayout?: boolean;
  /** Callback fired when manual layout mode changes. */
  onManualLayoutChange?: (enabled: boolean) => void;
  /** Optional bounds for package groups. */
  packageBounds?: Record<string, { x: number; y: number; r: number }>;
  /** Current layout algorithm. */
  layout?: LayoutType;
  /** Callback fired when layout changes. */
  onLayoutChange?: (layout: LayoutType) => void;
}

/**
 * An interactive Force-Directed Graph component using D3.js for physics and React for rendering.
 *
 * Supports multiple layout modes (force, circular, hierarchical), pinning, zooming, and dragging.
 * Optimal for visualizing complex dependency networks and codebase structures.
 *
 * @lastUpdated 2026-03-18
 */
export const ForceDirectedGraph = forwardRef<
  ForceDirectedGraphHandle,
  ForceDirectedGraphProps
>(
  (
    {
      nodes: initialNodes,
      links: initialLinks,
      width,
      height,
      enableZoom = true,
      enableDrag = true,
      onNodeClick,
      onNodeHover,
      onLinkClick,
      selectedNodeId,
      hoveredNodeId,
      defaultNodeColor = DEFAULT_NODE_COLOR,
      defaultNodeSize = DEFAULT_NODE_SIZE,
      defaultLinkColor = DEFAULT_LINK_COLOR,
      defaultLinkWidth = DEFAULT_LINK_WIDTH,
      showNodeLabels = true,
      showLinkLabels = false,
      className,
      manualLayout = false,
      onManualLayoutChange,
      packageBounds,
      layout: externalLayout,
      onLayoutChange,
    },
    ref
  ) => {
    const svgRef = useRef<SVGSVGElement>(null);
    const gRef = useRef<SVGGElement>(null);
    const [transform, setTransform] = useState({ k: 1, x: 0, y: 0 });
    const transformRef = useRef(transform);
    const dragNodeRef = useRef<GraphNode | null>(null);
    const dragActiveRef = useRef(false);
    const [pinnedNodes, setPinnedNodes] = useState<Set<string>>(new Set());
    const internalDragEnabledRef = useRef(enableDrag);
    const [layout, setLayout] = useState<LayoutType>(externalLayout || 'force');

    // Sync external layout prop with internal state
    useEffect(() => {
      if (externalLayout && externalLayout !== layout) {
        setLayout(externalLayout);
      }
    }, [externalLayout, layout]);

    // Handle layout change and notify parent
    const handleLayoutChange = useCallback(
      (newLayout: LayoutType) => {
        setLayout(newLayout);
        onLayoutChange?.(newLayout);
      },
      [onLayoutChange]
    );

    // Update the ref when enableDrag prop changes
    useEffect(() => {
      internalDragEnabledRef.current = enableDrag;
    }, [enableDrag]);

    // Initial positioning - delegate to layout utils
    const nodes = React.useMemo(() => {
      if (!initialNodes || !initialNodes.length) return initialNodes;
      const copy = initialNodes.map((n) => ({ ...n }));
      if (layout === 'circular') applyCircularLayout(copy, width, height);
      else if (layout === 'hierarchical')
        applyHierarchicalLayout(copy, width, height);
      else applyInitialForceLayout(copy, width, height);
      return copy;
    }, [initialNodes, width, height, layout]);

    // No force simulation - static layout only (stubs for API compatibility)
    const restart = React.useCallback(() => {}, []);
    const stop = React.useCallback(() => {}, []);
    const setForcesEnabled = React.useCallback((enabled?: boolean) => {
      void enabled;
    }, []);

    // Apply layout-specific positioning when layout changes
    useEffect(() => {
      if (!nodes || nodes.length === 0) return;
      if (layout === 'circular') applyCircularLayout(nodes, width, height);
      else if (layout === 'hierarchical')
        applyHierarchicalLayout(nodes, width, height);

      restart();
    }, [layout, nodes, width, height, restart]);

    // If manual layout is enabled or any nodes are pinned, disable forces
    useEffect(() => {
      if (manualLayout || pinnedNodes.size > 0) setForcesEnabled(false);
      else setForcesEnabled(true);
    }, [manualLayout, pinnedNodes, setForcesEnabled]);

    // Expose imperative handle for parent components
    useImperativeHandle(
      ref,
      () => ({
        pinAll: () => {
          const newPinned = new Set<string>();
          nodes.forEach((node) => {
            node.fx = node.x;
            node.fy = node.y;
            newPinned.add(node.id);
          });
          setPinnedNodes(newPinned);
          restart();
        },
        unpinAll: () => {
          nodes.forEach((node) => {
            node.fx = null;
            node.fy = null;
          });
          setPinnedNodes(new Set());
          restart();
        },
        resetLayout: () => {
          nodes.forEach((node) => {
            node.fx = null;
            node.fy = null;
          });
          setPinnedNodes(new Set());
          restart();
        },
        fitView: () => {
          if (!svgRef.current || !nodes.length) return;
          let minX = Infinity,
            maxX = -Infinity,
            minY = Infinity,
            maxY = -Infinity;
          nodes.forEach((node) => {
            if (node.x !== undefined && node.y !== undefined) {
              const size = node.size || DEFAULT_NODE_SIZE;
              minX = Math.min(minX, node.x - size);
              maxX = Math.max(maxX, node.x + size);
              minY = Math.min(minY, node.y - size);
              maxY = Math.max(maxY, node.y + size);
            }
          });
          if (!isFinite(minX)) return;
          const scale = Math.min(
            (width - FIT_VIEW_PADDING * 2) / (maxX - minX),
            (height - FIT_VIEW_PADDING * 2) / (maxY - minY),
            10
          );
          const x = width / 2 - ((minX + maxX) / 2) * scale;
          const y = height / 2 - ((minY + maxY) / 2) * scale;
          if (gRef.current && svgRef.current) {
            const svg = d3.select(svgRef.current);
            const newTransform = d3.zoomIdentity.translate(x, y).scale(scale);
            svg
              .transition()
              .duration(TRANSITION_DURATION_MS)
              .call((d3 as any).zoom().transform as any, newTransform);
            setTransform(newTransform);
          }
        },
        getPinnedNodes: () => Array.from(pinnedNodes),
        setDragMode: (enabled: boolean) => {
          internalDragEnabledRef.current = enabled;
        },
        setLayout: (newLayout: LayoutType) => handleLayoutChange(newLayout),
        getLayout: () => layout,
      }),
      [
        nodes,
        pinnedNodes,
        restart,
        width,
        height,
        layout,
        handleLayoutChange,
        setForcesEnabled,
      ]
    );

    // Notify parent when manual layout mode changes
    useEffect(() => {
      if (typeof onManualLayoutChange === 'function')
        onManualLayoutChange(manualLayout);
    }, [manualLayout, onManualLayoutChange]);

    // Use custom hooks for zoom and window-level drag
    useGraphZoom(svgRef, gRef, enableZoom, setTransform, transformRef);
    useWindowDrag(
      enableDrag,
      svgRef,
      transformRef,
      dragActiveRef,
      dragNodeRef,
      () => {
        setForcesEnabled(true);
        restart();
      }
    );

    // Run positioning pass when nodes/links change
    useEffect(() => {
      if (!gRef.current) return;
      const g = d3.select(gRef.current);
      g.selectAll('g.node').each(function (this: any) {
        const datum = d3.select(this).datum() as any;
        if (!datum) return;
        d3.select(this).attr(
          'transform',
          `translate(${datum.x || 0},${datum.y || 0})`
        );
      });
      g.selectAll('line').each(function (this: any) {
        const l = d3.select(this).datum() as any;
        if (!l) return;
        const s: any =
          typeof l.source === 'object'
            ? l.source
            : nodes.find((n) => n.id === l.source) || l.source;
        const t: any =
          typeof l.target === 'object'
            ? l.target
            : nodes.find((n) => n.id === l.target) || l.target;
        if (!s || !t) return;
        d3.select(this)
          .attr('x1', s.x)
          .attr('y1', s.y)
          .attr('x2', t.x)
          .attr('y2', t.y);
      });
    }, [nodes, initialLinks]);

    const handleDragStart = useCallback(
      (event: React.MouseEvent, node: GraphNode) => {
        if (!enableDrag) return;
        event.preventDefault();
        event.stopPropagation();
        dragActiveRef.current = true;
        dragNodeRef.current = node;
        node.fx = node.x;
        node.fy = node.y;
        setPinnedNodes((prev) => new Set([...prev, node.id]));
        stop();
      },
      [enableDrag, stop]
    );

    // Attach d3.drag behavior to nodes
    useEffect(() => {
      if (!gRef.current || !enableDrag) return;
      const g = d3.select(gRef.current);
      const dragBehavior = (d3 as any)
        .drag()
        .on('start', (event: any) => {
          const target =
            (event.sourceEvent && (event.sourceEvent.target as Element)) ||
            (event.target as Element);
          const grp = target.closest?.('g.node') as Element | null;
          const id = grp?.getAttribute('data-id');
          if (!id || !internalDragEnabledRef.current) return;
          const node = nodes.find((n) => n.id === id);
          if (!node) return;
          if (!event.active) restart();
          dragActiveRef.current = true;
          dragNodeRef.current = node;
          node.fx = node.x;
          node.fy = node.y;
          setPinnedNodes((prev) => new Set([...prev, node.id]));
        })
        .on('drag', (event: any) => {
          if (!dragActiveRef.current || !dragNodeRef.current) return;
          const svg = svgRef.current;
          if (!svg) return;
          const rect = svg.getBoundingClientRect();
          dragNodeRef.current.fx =
            (event.sourceEvent.clientX - rect.left - transform.x) / transform.k;
          dragNodeRef.current.fy =
            (event.sourceEvent.clientY - rect.top - transform.y) / transform.k;
        })
        .on('end', () => {
          setForcesEnabled(true);
          restart();
        });

      g.selectAll('g.node').call(dragBehavior as any);
      return () => {
        g.selectAll('g.node').on('.drag', null as any);
      };
    }, [
      gRef,
      enableDrag,
      nodes,
      transform,
      restart,
      setForcesEnabled,
      internalDragEnabledRef,
    ]);

    const handleNodeDoubleClick = useCallback(
      (event: React.MouseEvent, node: GraphNode) => {
        event.stopPropagation();
        if (!enableDrag) return;
        if (node.fx === null || node.fx === undefined) {
          node.fx = node.x;
          node.fy = node.y;
          setPinnedNodes((prev) => new Set([...prev, node.id]));
        } else {
          node.fx = null;
          node.fy = null;
          setPinnedNodes((prev) => {
            const next = new Set(prev);
            next.delete(node.id);
            return next;
          });
        }
        restart();
      },
      [enableDrag, restart]
    );

    return (
      <svg
        ref={svgRef}
        width={width}
        height={height}
        className={cn('bg-white dark:bg-gray-900', className)}
        onDoubleClick={() => {
          nodes.forEach((n) => {
            n.fx = null;
            n.fy = null;
          });
          setPinnedNodes(new Set());
          restart();
        }}
      >
        <defs>
          <marker
            id="arrow"
            viewBox="0 0 10 10"
            refX="20"
            refY="5"
            markerWidth="6"
            markerHeight="6"
            orient="auto"
          >
            <path d="M 0 0 L 10 5 L 0 10 z" fill={defaultLinkColor} />
          </marker>
        </defs>

        <g ref={gRef}>
          {initialLinks.map((link, i) => (
            <LinkItem
              key={`link-${i}`}
              link={link as GraphLink}
              onClick={onLinkClick}
              defaultWidth={defaultLinkWidth}
              showLabel={showLinkLabels}
              nodes={nodes}
            />
          ))}

          {nodes.map((node) => (
            <NodeItem
              key={node.id}
              node={node}
              isSelected={selectedNodeId === node.id}
              isHovered={hoveredNodeId === node.id}
              pinned={pinnedNodes.has(node.id)}
              defaultNodeSize={defaultNodeSize}
              defaultNodeColor={defaultNodeColor}
              showLabel={showNodeLabels}
              onClick={onNodeClick}
              onDoubleClick={handleNodeDoubleClick}
              onMouseEnter={(n) => onNodeHover?.(n)}
              onMouseLeave={() => onNodeHover?.(null)}
              onMouseDown={handleDragStart}
            />
          ))}
          <PackageBoundaries packageBounds={packageBounds || {}} />
        </g>
      </svg>
    );
  }
);

ForceDirectedGraph.displayName = 'ForceDirectedGraph';
