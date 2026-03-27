/**
 * Hook for managing d3-force simulations
 * Automatically handles simulation lifecycle, tick updates, and cleanup
 */

import { useEffect, useRef, useState, useCallback } from 'react';
import * as d3 from 'd3';
import {
  seedRandomPositions,
  seedCircularPositions,
  safelyStopSimulation,
} from './simulation-helpers';
import { SIMULATION_DEFAULTS, FORCE_NAMES, EVENT_NAMES } from './simulation-constants';
import type {
  SimulationNode,
  SimulationLink,
  ForceSimulationOptions,
  UseForceSimulationReturn,
} from './simulation-types';

/**
 * Enhanced return type for the force simulation hook
 */
export interface UseForceSimulationReturnExt extends UseForceSimulationReturn {
  /**
   * Enable or disable simulation forces (charge and link forces)
   */
  setForcesEnabled: (enabled: boolean) => void;
}

/**
 * useForceSimulation: robust d3-force management with React
 * @lastUpdated 2026-03-27
 */
export function useForceSimulation(
  initialNodes: SimulationNode[],
  initialLinks: SimulationLink[],
  options: ForceSimulationOptions
): UseForceSimulationReturnExt {
  const {
    chargeStrength = SIMULATION_DEFAULTS.CHARGE_STRENGTH,
    linkDistance = SIMULATION_DEFAULTS.LINK_DISTANCE,
    linkStrength = SIMULATION_DEFAULTS.LINK_STRENGTH,
    collisionStrength = SIMULATION_DEFAULTS.COLLISION_STRENGTH,
    collisionRadius = SIMULATION_DEFAULTS.COLLISION_RADIUS,
    centerStrength = SIMULATION_DEFAULTS.CENTER_STRENGTH,
    width,
    height,
    alphaDecay = SIMULATION_DEFAULTS.ALPHA_DECAY,
    velocityDecay = SIMULATION_DEFAULTS.VELOCITY_DECAY,
    alphaTarget = SIMULATION_DEFAULTS.ALPHA_TARGET,
    warmAlpha = SIMULATION_DEFAULTS.WARM_ALPHA,
    alphaMin = SIMULATION_DEFAULTS.ALPHA_MIN,
    onTick,
    stabilizeOnStop = SIMULATION_DEFAULTS.STABILIZE_ON_STOP,
    tickThrottleMs = SIMULATION_DEFAULTS.TICK_THROTTLE_MS,
    maxSimulationTimeMs = SIMULATION_DEFAULTS.MAX_SIMULATION_TIME_MS,
  } = options;

  const [nodes, setNodes] = useState<SimulationNode[]>(initialNodes);
  const [links, setLinks] = useState<SimulationLink[]>(initialLinks);
  const [isRunning, setIsRunning] = useState(false);
  const [alpha, setAlpha] = useState(1);

  const simulationRef = useRef<d3.Simulation<SimulationNode, SimulationLink> | null>(null);
  const stopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const forcesEnabledRef = useRef(true);
  const originalForcesRef = useRef({
    charge: chargeStrength,
    link: linkStrength,
  });

  // Unique keys to detect when to rebuild the simulation
  const nodesKey = initialNodes.map((n) => n.id).join('|');
  const linksKey = initialLinks
    .map((l) => {
      const sourceId = typeof l.source === 'string' ? l.source : (l.source as SimulationNode)?.id;
      const targetId = typeof l.target === 'string' ? l.target : (l.target as SimulationNode)?.id;
      const linkType = (l as any).type || '';
      return `${sourceId}->${targetId}:${linkType}`;
    })
    .join('|');

  /**
   * Internal effect to manage simulation lifecycle
   */
  useEffect(() => {
    const nodesCopy = initialNodes.map((node) => ({ ...node }));
    const linksCopy = initialLinks.map((link) => ({ ...link }));

    try {
      seedCircularPositions(nodesCopy, width, height);
    } catch (error) {
      console.warn('AIReady: Position seeding failed, using random fallback:', error);
      seedRandomPositions(nodesCopy, width, height);
    }

    const simulation = d3.forceSimulation<SimulationNode, SimulationLink>(nodesCopy);
    applySimulationForces(simulation, linksCopy);
    configureSimulationParameters(simulation);

    simulationRef.current = simulation;

    const rafState = { rafId: null as number | null, lastUpdate: 0 };
    setupTickHandler(simulation, nodesCopy, linksCopy, rafState);

    setupStopTimer(simulation, nodesCopy, linksCopy);

    return () => cleanupSimulation(simulation, rafState);
  }, [
    nodesKey,
    linksKey,
    chargeStrength,
    linkDistance,
    linkStrength,
    collisionStrength,
    collisionRadius,
    centerStrength,
    width,
    height,
    alphaDecay,
    velocityDecay,
    alphaTarget,
    alphaMin,
    stabilizeOnStop,
    tickThrottleMs,
    maxSimulationTimeMs,
  ]);

  /**
   * Applies d3 forces to the simulation instance
   */
  const applySimulationForces = (
    simulation: d3.Simulation<SimulationNode, SimulationLink>,
    linksCopy: SimulationLink[]
  ) => {
    try {
      const linkForce = d3
        .forceLink<SimulationNode, SimulationLink>(linksCopy)
        .id((d) => d.id)
        .distance((d) => (d as any).distance ?? linkDistance)
        .strength(linkStrength);

      simulation
        .force(FORCE_NAMES.LINK, linkForce)
        .force(FORCE_NAMES.CHARGE, d3.forceManyBody().strength(chargeStrength))
        .force(FORCE_NAMES.CENTER, d3.forceCenter(width / 2, height / 2).strength(centerStrength))
        .force(
          FORCE_NAMES.COLLISION,
          d3.forceCollide<SimulationNode>().radius((d) => (d.size ?? 10) + collisionRadius).strength(collisionStrength)
        )
        .force(FORCE_NAMES.X, d3.forceX(width / 2).strength(Math.max(0.02, centerStrength * 0.5)))
        .force(FORCE_NAMES.Y, d3.forceY(height / 2).strength(Math.max(0.02, centerStrength * 0.5)));
    } catch (error) {
      console.warn('AIReady: Failed to configure simulation forces:', error);
    }
  };

  /**
   * Configures simulation decay and heat parameters
   */
  const configureSimulationParameters = (simulation: d3.Simulation<SimulationNode, SimulationLink>) => {
    simulation
      .alphaDecay(alphaDecay)
      .velocityDecay(velocityDecay)
      .alphaMin(alphaMin)
      .alphaTarget(alphaTarget)
      .alpha(warmAlpha);
  };

  /**
   * Sets up a timer to force-stop the simulation after maxSimulationTimeMs
   */
  const setupStopTimer = (
    simulation: d3.Simulation<SimulationNode, SimulationLink>,
    nodesCopy: SimulationNode[],
    linksCopy: SimulationLink[]
  ) => {
    if (stopTimeoutRef.current) {
      clearTimeout(stopTimeoutRef.current);
    }

    if (maxSimulationTimeMs > 0) {
      stopTimeoutRef.current = setTimeout(() => {
        safelyStopSimulation(simulation, nodesCopy, { stabilize: stabilizeOnStop });
        updateStateAfterStop(nodesCopy, linksCopy, 0);
      }, maxSimulationTimeMs);
    }
  };

  /**
   * Updates state variables after simulation stops
   */
  const updateStateAfterStop = (
    nodesCopy: SimulationNode[],
    linksCopy: SimulationLink[],
    currentAlpha: number
  ) => {
    setIsRunning(false);
    setAlpha(currentAlpha);
    setNodes([...nodesCopy]);
    setLinks([...linksCopy]);
  };

  /**
   * Manages simulation ticks and React state sync
   */
  const setupTickHandler = (
    simulation: d3.Simulation<SimulationNode, SimulationLink>,
    nodesCopy: SimulationNode[],
    linksCopy: SimulationLink[],
    rafState: { rafId: number | null; lastUpdate: number }
  ) => {
    const handleTick = () => {
      if (onTick) {
        try {
          onTick(nodesCopy, linksCopy, simulation);
        } catch (error) {
          console.warn('AIReady: Simulation onTick callback failed:', error);
        }
      }

      const currentAlpha = simulation.alpha();
      if (currentAlpha <= alphaMin) {
        safelyStopSimulation(simulation, nodesCopy, { stabilize: stabilizeOnStop });
        updateStateAfterStop(nodesCopy, linksCopy, currentAlpha);
        return;
      }

      syncStateOnTick(nodesCopy, linksCopy, currentAlpha, rafState);
    };

    simulation.on(EVENT_NAMES.TICK, handleTick);
    simulation.on(EVENT_NAMES.END, () => setIsRunning(false));
  };

  /**
   * Syncs simulation results to React state using requestAnimationFrame
   */
  const syncStateOnTick = (
    nodesCopy: SimulationNode[],
    linksCopy: SimulationLink[],
    currentAlpha: number,
    rafState: { rafId: number | null; lastUpdate: number }
  ) => {
    const now = Date.now();
    if (rafState.rafId === null && now - rafState.lastUpdate >= tickThrottleMs) {
      rafState.rafId = requestAnimationFrame(() => {
        rafState.rafId = null;
        rafState.lastUpdate = Date.now();
        setNodes([...nodesCopy]);
        setLinks([...linksCopy]);
        setAlpha(currentAlpha);
        setIsRunning(currentAlpha > alphaMin);
      });
    }
  };

  /**
   * Cleanup routine for simulation unmount or rebuild
   */
  const cleanupSimulation = (
    simulation: d3.Simulation<SimulationNode, SimulationLink>,
    rafState: { rafId: number | null }
  ) => {
    simulation.on(EVENT_NAMES.TICK, null);
    if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
    if (rafState.rafId !== null) cancelAnimationFrame(rafState.rafId);
    simulation.stop();
  };

  /**
   * Restart the simulation manually
   */
  const restartSimulation = useCallback(() => {
    const sim = simulationRef.current;
    if (!sim) return;

    try {
      sim.alphaTarget(warmAlpha).restart();
      setIsRunning(true);
      if (stopTimeoutRef.current) clearTimeout(stopTimeoutRef.current);
      if (maxSimulationTimeMs > 0) {
        stopTimeoutRef.current = setTimeout(() => {
          sim.alpha(0);
          sim.stop();
          setIsRunning(false);
        }, maxSimulationTimeMs);
      }
    } catch (error) {
      console.warn('AIReady: Failed to restart simulation:', error);
    }
  }, [warmAlpha, maxSimulationTimeMs]);

  /**
   * Stop the simulation manually
   */
  const stopSimulation = useCallback(() => {
    if (simulationRef.current) {
      simulationRef.current.stop();
      setIsRunning(false);
    }
  }, []);

  /**
   * Enable or disable simulation forces
   */
  const setForcesEnabled = useCallback((enabled: boolean) => {
    const sim = simulationRef.current;
    if (!sim || forcesEnabledRef.current === enabled) return;
    
    forcesEnabledRef.current = enabled;

    try {
      const charge = sim.force(FORCE_NAMES.CHARGE) as d3.ForceManyBody<SimulationNode> | null;
      if (charge) {
        charge.strength(enabled ? originalForcesRef.current.charge : 0);
      }

      const link = sim.force(FORCE_NAMES.LINK) as d3.ForceLink<SimulationNode, SimulationLink> | null;
      if (link) {
        link.strength(enabled ? originalForcesRef.current.link : 0);
      }
      
      sim.alpha(warmAlpha).restart();
    } catch (error) {
      console.warn('AIReady: Failed to toggle simulation forces:', error);
    }
  }, [warmAlpha]);

  return {
    nodes,
    links,
    restart: restartSimulation,
    stop: stopSimulation,
    isRunning,
    alpha,
    setForcesEnabled,
  };
}

/**
 * Hook for creating a draggable force simulation
 */
export function useDrag(simulation: d3.Simulation<SimulationNode, any> | null | undefined) {
  const handleDragStart = useCallback(
    (event: any, node: SimulationNode) => {
      if (!simulation) return;
      if (!event.active) simulation.alphaTarget(0.3).restart();
      node.fx = node.x;
      node.fy = node.y;
    },
    [simulation]
  );

  const handleDragged = useCallback((event: any, node: SimulationNode) => {
    node.fx = event.x;
    node.fy = event.y;
  }, []);

  const handleDragEnd = useCallback(
    (event: any, node: SimulationNode) => {
      if (!simulation) return;
      if (!event.active) simulation.alphaTarget(0);
      node.fx = null;
      node.fy = null;
    },
    [simulation]
  );

  return {
    onDragStart: handleDragStart,
    onDrag: handleDragged,
    onDragEnd: handleDragEnd,
  };
}
