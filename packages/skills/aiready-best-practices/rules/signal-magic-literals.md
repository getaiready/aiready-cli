---
title: Avoid Magic Literals
impact: CRITICAL
impactDescription: Unnamed constants confuse AI about business rules
tags: signal, magic, literals, constants, clarity
---

## Avoid Magic Literals

**Impact: CRITICAL (Business rule opacity)**

Magic literals—unnamed constants used directly in logic—prevent AI from understanding the "why" behind business rules. When AI sees `if (status === 2)`, it lacks the semantic grounding to suggest valid alternatives or explain the intent of the check.

### Core Principles

- **Named Constants for Rules:** Every number or string with specific domain meaning must be held in a named constant or enum.
- **Grouped Domain Values:** Use Enums or Namespaces to group related constants (e.g., `UserStatus`, `ApiStatus`).
- **Centralized Configuration:** Move environment-specific or configurable literals into a central config object.

### Guidelines

- **Incorrect:** `if (user.status === 2)` — Unclear what "2" represents.
- **Correct:** `if (user.status === UserStatus.Active)` — Explicitly states the intent.
- **Incorrect:** Calculation with unnamed coefficients (e.g., `amount * 0.15 + 100`).
- **Correct:** `amount * TAX_RATE + BASE_FEE` — Provides clear semantic labels for the model.

**Detection tip:** Run `npx @aiready/ai-signal-clarity` to identify magic literal clusters that need extraction.

Reference: [AI Signal Clarity Docs](https://getaiready.dev/docs)
