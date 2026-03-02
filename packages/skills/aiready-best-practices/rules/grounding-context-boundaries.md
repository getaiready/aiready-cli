---
title: Define Clear Context Boundaries
impact: HIGH
impactDescription: Ambiguous boundaries prevent AI from understanding domain contexts
tags: grounding, boundaries, domains, context, architecture
---

## Define Clear Context Boundaries

**Impact: HIGH (Retrieval failure risk)**

Amorphous domain boundaries confuse AI about which rules apply to a given task. Mixing multiple domains in a single file or directory prevents effectively grounding the agent in the correct business context.

### Core Principles

- **Directory-as-Domain:** Use a directory structure that mirrors business domains (e.g., `domain/order/` vs `domain/user/`).
- **Explicit Public Contracts:** Use `index.ts` (barrel exports) to define exactly what a domain exposes to the rest of the system.
- **Avoid Semantic Overlap:** Don't mix authentication utilities with business logic or infrastructure concerns in the same module.

### Guidelines

- **Incorrect:** `src/utils/mixed.ts` containing `calculateOrderTotal` and `validateProductSku`.
- **Correct:** Domain-driven directories with internal `entities/` and `services/`, and an `index.ts` defining the public API.
- **Rationale:** Clear boundaries allow the agent to load _only_ order-relevant code when performing order-related tasks.

**Detection tip:** Run `npx @aiready/agent-grounding` to analyze context boundaries and directory semantics.

Reference: [Agent Grounding Docs](https://getaiready.dev/docs)
