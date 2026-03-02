---
title: Avoid Boolean Trap Parameters
impact: CRITICAL
impactDescription: High confusion potential - AI flips boolean intent incorrectly
tags: signal, boolean, parameters, ambiguity, ai-signal
---

## Avoid Boolean Trap Parameters

**Impact: CRITICAL (High confusion potential)**

Boolean parameters with unclear meaning cause AI assistants to incorrectly interpret or invert logic. Multi-boolean patterns are especially problematic as AI cannot reliably predict which combination produces which result.

### Core Principles

- **Prefer Objects over Positional Booleans:** Use named properties in an options object to provide explicit context for each flag.
- **Use Enums for State:** For mutually exclusive states, use enums instead of multiple boolean flags.
- **Self-Documenting Intent:** Ensure the parameter name clearly indicates what `true` vs `false` means (e.g., `includeDeleted` is better than `statusCheck`).

### Guidelines

- **Incorrect:** `fetchUsers(true, false)` — The meaning of these flags is hidden and highly prone to AI hallucination or inversion.
- **Correct:** `fetchUsers({ includeInactive: true, includeDeleted: false })` — Explicit naming provides "grounding" for the AI model.
- **Correct (Enum):** `fetchUsers(UserFilter.ActiveOnly)` — Limits the possibility space to valid, named states.

**Detection tip:** Run `npx @aiready/ai-signal-clarity` to automatically identify boolean trap patterns.

Reference: [AI Signal Clarity Docs](https://getaiready.dev/docs)
