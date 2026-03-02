---
title: Write Agent-Actionable READMEs
impact: HIGH
impactDescription: Poor README quality reduces AI's understanding of project context
tags: grounding, readme, documentation, context, agents
---

## Write Agent-Actionable READMEs

**Impact: HIGH (High-level reasoning context)**

READMEs are the primary entry point for AI agents. A poor README forces an agent to scan every file in the repository to infer architecture and intent, often leading to incorrect mental models and high token costs.

### Core Principles

- **Purpose & Domain First:** Explicitly state the problem space (e.g., "Order Processing Service") at the top.
- **Architectural Grounding:** Provide a high-level overview of how data flows and which modules own which responsibilities.
- **Verification Manifest:** List the exact commands needed to verify changes (e.g., `npm test`).

### Guidelines

- **Avoid Minimalist READMEs:** Titles and installation steps only are insufficient for AI architectural reasoning.
- **Include Domain Glossary:** Define core terms (e.g., "Fulfillment", "Sourcing") to ensure the agent uses correct domain language.
- **Table of Services:** Provide a quick-reference table of key modules and their responsibilities.

**Key AI Elements:** Domain statement, architecture overview, concept glossary, service map, and verification commands.

**Detection tip:** Run `npx @aiready/agent-grounding` to analyze README quality and directory semantics.

Reference: [Agent Grounding Docs](https://getaiready.dev/docs)
