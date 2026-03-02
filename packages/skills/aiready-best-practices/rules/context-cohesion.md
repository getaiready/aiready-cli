---
title: Maintain High Module Cohesion
impact: HIGH
impactDescription: 25-40% reduction in context pollution, improves AI file selection
tags: context, cohesion, organization, modules
references: https://en.wikipedia.org/wiki/Cohesion_(computer_science)
---

## Maintain High Module Cohesion

**Impact: HIGH (Context pollution risk)**

Low cohesion forces AI to process unrelated code when focusing on a specific feature. When "util" files bundle authentication, formatting, and validation, AI must load the entire file, wasting its context budget and increasing the risk of hallucination.

### Core Principles

- **Single Responsibility Files:** Each file should focus on a single domain or functional area (e.g., `auth/password.ts` vs a generic `utils.ts`).
- **Feature-Based Grouping:** Group code by what it _does_ for the user, not its technical type (e.g., `domain/user/` vs `services/`).
- **Minimize "Junk Drawer" Utils:** Move generic utilities into specific, named sub-modules once they exceed 2-3 related functions.

### Guidelines

- **Incorrect:** A 500-line `utils.ts` containing everything from date formatting to database connection logic.
- **Correct:** Modular structure like `auth/token.ts`, `validation/email.ts`, and `utils/date.ts`.
- **Measurement:** High cohesion means all functions in a file share the same data types or serve the same business feature.

**Benefits for AI:** Reduces context waste by 25-40% and ensures the agent loads only the minimal relevant code for a task.

Reference: [Cohesion (computer science)](<https://en.wikipedia.org/wiki/Cohesion_(computer_science)>)
