---
title: Avoid Semantic Duplicate Patterns
impact: CRITICAL
impactDescription: 30-70% context window waste
tags: patterns, duplicates, context-window, semantic-similarity
---

## Avoid Semantic Duplicate Patterns

**Impact: CRITICAL (Context window waste)**

Multiple functions or components that perform the same task with different names (`fetchUser`, `getUserData`, `loadUserInfo`) waste AI context tokens and confuse pattern recognition. AI cannot determine the canonical pattern and will often create new, redundant variations.

### Core Principles

- **Canonical Implementation:** Establish a single "source of truth" for every business operation.
- **Pattern Reuse over Recreation:** Proactively search for existing implementations before creating new ones.
- **Unified Naming:** Use consistent verbs for similar operations (e.g., always use `get` for retrieval, `update` for mutation).

### Guidelines

- **Incorrect:** Three different versions of an API fetcher scattered across the codebase.
- **Correct:** A single module (e.g., `users.ts`) containing the canonical `getUser` function.
- **Measurement:** AI recognizes and consistently reuses the existing pattern rather than hallucinating new ones.

**Detection tip:** Run `npx @aiready/pattern-detect` to identify semantic duplicates and consolidate them.

Reference: [Pattern Detection Docs](https://getaiready.dev/docs)
