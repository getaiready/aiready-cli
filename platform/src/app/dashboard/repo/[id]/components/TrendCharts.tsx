'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface MetricPoint {
  timestamp: string;
  value: number;
  type: string;
}

interface TrendChartsProps {
  metrics: MetricPoint[];
  title?: string;
}

export function TrendCharts({
  metrics,
  title = 'Metrics Evolution',
}: TrendChartsProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!metrics.length || !svgRef.current) return;

    const margin = { top: 20, right: 150, bottom: 30, left: 40 };
    const width = svgRef.current.clientWidth - margin.left - margin.right;
    const height = 300 - margin.top - margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const g = svg
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`);

    const parseTime = d3.isoParse;

    // Group data by metric type
    const dataByType = d3.group(metrics, (d) => d.type);

    const x = d3
      .scaleTime()
      .domain(
        d3.extent(metrics, (d) => parseTime(d.timestamp)!) as [Date, Date]
      )
      .range([0, width]);

    const y = d3.scaleLinear().domain([0, 100]).range([height, 0]);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    const line = d3
      .line<MetricPoint>()
      .x((d) => x(parseTime(d.timestamp)!))
      .y((d) => y(d.value))
      .curve(d3.curveMonotoneX);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(5))
      .attr('class', 'text-xs text-gray-500');

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(y).ticks(5))
      .attr('class', 'text-xs text-gray-500');

    // Add lines
    dataByType.forEach((typeData, type) => {
      g.append('path')
        .datum(typeData)
        .attr('fill', 'none')
        .attr('stroke', color(type))
        .attr('stroke-width', 2)
        .attr('d', line)
        .append('title')
        .text(type);
    });

    // Add legend
    const legend = g
      .append('g')
      .attr('font-family', 'sans-serif')
      .attr('font-size', 10)
      .attr('text-anchor', 'start')
      .selectAll('g')
      .data(Array.from(dataByType.keys()))
      .enter()
      .append('g')
      .attr('transform', (d, i) => `translate(${width + 10},${i * 20})`);

    legend
      .append('rect')
      .attr('x', -10)
      .attr('width', 10)
      .attr('height', 10)
      .attr('fill', color);

    legend
      .append('text')
      .attr('x', 5)
      .attr('y', 9.5)
      .attr('dy', '0.32em')
      .attr('fill', (d) => color(d))
      .attr('font-weight', 'bold')
      .text((d) => d);
  }, [metrics]);

  return (
    <div className="bg-slate-900/20 border border-slate-800 rounded-3xl p-8 overflow-hidden">
      <h3 className="text-xl font-bold text-white mb-6">{title}</h3>
      <div className="w-full h-[300px]">
        <svg ref={svgRef} className="w-full h-full" />
      </div>
    </div>
  );
}
