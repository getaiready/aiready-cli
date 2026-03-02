---
title: Avoid Change Amplification Hotspots
impact: HIGH
impactDescription: High fan-in/fan-out files cause "edit explosion" for AI agents
tags: amplification, coupling, fan-in, fan-out, hotspots, graph-metrics
---

## Avoid Change Amplification Hotspots

**Impact: HIGH (Edit explosion risk)**

Change amplification hotspots are files with extreme dependency counts (high fan-in/fan-out). When an AI modifies these files, it often triggers a cascade of breakages that exceeds the agent's context window or reasoning capacity, leading to failed edits and regression loops.

### Core Principles

- **Interface Segregation:** Use specific interfaces to hide implementation details from high fan-in modules, limiting the impact of internal changes.
- **Bounded Contexts:** Group related code into modules that AI can reason about independently without loading the entire project.
- **Modular Configuration:** Avoid massive central config objects; split configuration into feature-specific modules to localize edits.

### Guidelines

- **Avoid Generic "God Files":** `utils/index.ts` files that export 50+ unrelated functions create high fan-out and confuse agent focus.
- **Minimize Global Coupling:** Changes to a base entity (e.g., `BaseEntity`) that force updates in 100+ files are dangerous for automated agents.
- **Rationale:** Reducing the number of "affected files" per edit allows agents to operate with higher precision and shorter feedback loops.

**Refactoring tip:** Extract domain boundaries (e.g., `user/`, `order/`) so the AI only needs to load modules relevant to the current business feature.

Reference: [Change Amplification Docs](https://getaiready.dev/docs)
