---
title: Keep Documentation in Sync with Code
impact: MEDIUM
impactDescription: 20-30% reduction in AI suggestion errors from stale docs
tags: documentation, maintenance, comments, sync
references: https://jsdoc.app/
---

## Keep Documentation in Sync with Code

**Impact: MEDIUM (Stale documentation risk)**

Outdated documentation misleads AI models. When function signatures or business logic change without matching updates to JSDoc/comments, AI suggests code based on stale information, causing type errors and logic bugs.

### Core Principles

- **Single Truth Source:** Update documentation in the same commit/change-block as the code it describes.
- **Type-Aware Docs:** Use JSDoc or TSDoc that can be validated against the code's types.
- **Minimal, High-Signal Comments:** Favor self-documenting code; use comments only for complex logic, business rationale, or non-obvious side effects.

### Guidelines

- **Incorrect:** JSDoc describing a parameter `email` when the function signature now uses `userId`.
- **Correct:** Accurate `@param` and `@returns` tags that match the current TypeScript signature.
- **Correct:** Using `@deprecated` to warn agents about obsolete paths and provide a clear `@see` alternative.

**Workflow Tip:** Remove "TODO" comments older than 30 days—they create noise and confusion for AI agents trying to prioritize work.

Reference: [JSDoc](https://jsdoc.app/)
