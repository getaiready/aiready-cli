import React from 'react';
import {
  PACKAGE_BOUNDARY_FILL,
  PACKAGE_BOUNDARY_STROKE,
  PACKAGE_BOUNDARY_STROKE_WIDTH,
  PACKAGE_BOUNDARY_DASH,
  PACKAGE_LABEL_COLOR,
  PACKAGE_LABEL_FONT_SIZE,
} from './constants';

interface PackageBoundariesProps {
  packageBounds: Record<string, { x: number; y: number; r: number }>;
}

/**
 * Renders the circular boundaries and labels for package groups in the force-directed graph.
 *
 * @lastUpdated 2026-03-18
 */
export const PackageBoundaries: React.FC<PackageBoundariesProps> = ({
  packageBounds,
}) => {
  if (!packageBounds || Object.keys(packageBounds).length === 0) return null;

  return (
    <g className="package-boundaries" pointerEvents="none">
      {Object.entries(packageBounds).map(([pid, b]) => (
        <g key={pid}>
          <circle
            cx={b.x}
            cy={b.y}
            r={b.r}
            fill={PACKAGE_BOUNDARY_FILL}
            stroke={PACKAGE_BOUNDARY_STROKE}
            strokeWidth={PACKAGE_BOUNDARY_STROKE_WIDTH}
            strokeDasharray={PACKAGE_BOUNDARY_DASH}
            opacity={0.9}
          />
          <text
            x={b.x}
            y={Math.max(12, b.y - b.r + 14)}
            fill={PACKAGE_LABEL_COLOR}
            fontSize={PACKAGE_LABEL_FONT_SIZE}
            textAnchor="middle"
            pointerEvents="none"
          >
            {pid.replace(/^pkg:/, '')}
          </text>
        </g>
      ))}
    </g>
  );
};

PackageBoundaries.displayName = 'PackageBoundaries';
