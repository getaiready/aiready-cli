'use client';

import { useEffect, useRef } from 'react';
import * as d3 from 'd3';
import { FileNode, GraphData } from '@/lib/graph-builder';

interface GraphCanvasProps {
  data: GraphData;
  width: number;
  height: number;
  onNodeClick: (node: FileNode | null) => void;
}

export function GraphCanvas({
  data,
  width,
  height,
  onNodeClick,
}: GraphCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const zoomTransformRef = useRef<d3.ZoomTransform>(d3.zoomIdentity);

  useEffect(() => {
    if (!data || !svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const container = svg.append('g');

    const zoom = d3
      .zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.1, 4])
      .on('zoom', (event) => {
        container.attr('transform', event.transform);
        zoomTransformRef.current = event.transform;
      });

    svg.call(zoom);
    svg.call(zoom.transform, zoomTransformRef.current);

    const nodes = data.nodes.map((d) => ({ ...d }));
    const links = data.edges.map((d) => ({ ...d }));

    const simulation = d3
      .forceSimulation(nodes as any)
      .force(
        'link',
        d3
          .forceLink(links)
          .id((d: any) => d.id)
          .distance((d: any) => (d.type === 'structural' ? 50 : 120))
          .strength((d: any) => (d.type === 'structural' ? 0.5 : 0.1))
      )
      .force(
        'charge',
        d3
          .forceManyBody()
          .strength((d: any) => (d.color === '#4f46e5' ? -1000 : -300))
      )
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force(
        'collision',
        d3.forceCollide().radius((d: any) => (d.color === '#4f46e5' ? 60 : 40))
      )
      .force('x', d3.forceX(width / 2).strength(0.05))
      .force('y', d3.forceY(height / 2).strength(0.05));

    const link = container
      .append('g')
      .selectAll('line')
      .data(links)
      .enter()
      .append('line')
      .attr('stroke', (d: any) => {
        if (d.type === 'similarity') return '#fbbf24';
        if (d.type === 'reference') return '#60a5fa';
        if (d.type === 'dependency') return '#22d3ee';
        if (d.type === 'structural') return '#4f46e5';
        return '#ffffff22';
      })
      .attr('stroke-opacity', (d: any) => {
        if (d.type === 'similarity') return 0.8;
        if (d.type === 'reference') return 0.6;
        if (d.type === 'dependency') return 0.6;
        if (d.type === 'structural') return 0.3;
        return 0.2;
      })
      .attr('stroke-width', (d: any) => {
        if (d.type === 'similarity') return 3;
        if (d.type === 'reference') return 2;
        if (d.type === 'dependency') return 2;
        if (d.type === 'structural') return 1.5;
        return 1;
      })
      .attr('stroke-dasharray', (d: any) =>
        d.type === 'reference' ? '6,4' : null
      );

    const node = container
      .append('g')
      .selectAll('g')
      .data(nodes)
      .enter()
      .append('g')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        event.stopPropagation();
        onNodeClick(d as FileNode);
      })
      .call(
        d3
          .drag<any, any>()
          .on('start', dragstarted)
          .on('drag', dragged)
          .on('end', dragended) as any
      );

    node
      .append('circle')
      .attr('r', (d: any) => Math.sqrt(d.value || 5) + 6)
      .attr('fill', (d: any) => d.color || '#97c2fc')
      .attr('stroke', '#0a0a0f')
      .attr('stroke-width', 2)
      .style('filter', (d: any) => `drop-shadow(0 0 4px ${d.color}66)`);

    node
      .append('text')
      .text((d: any) => d.label)
      .attr('dy', (d: any) => Math.sqrt(d.value || 5) + 18)
      .attr('text-anchor', 'middle')
      .attr('fill', '#94a3b8')
      .attr('font-size', '10px')
      .attr('font-weight', '500')
      .style('pointer-events', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node.attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      d.fx = d.x;
      d.fy = d.y;
    }

    function dragged(event: any, d: any) {
      d.fx = event.x;
      d.fy = event.y;
    }

    function dragended(event: any, d: any) {
      if (!event.active) simulation.alphaTarget(0);
      d.fx = null;
      d.fy = null;
    }

    svg.on('click', () => onNodeClick(null));

    return () => {
      simulation.stop();
    };
  }, [data, width, height, onNodeClick]);

  return (
    <svg ref={svgRef} width="100%" height="100%" className="relative z-10" />
  );
}
