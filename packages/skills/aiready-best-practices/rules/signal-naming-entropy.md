---
title: Avoid High-Entropy Naming
impact: CRITICAL
impactDescription: Names with multiple interpretations confuse AI models
tags: signal, naming, entropy, ambiguity, clarity
---

## Avoid High-Entropy Naming

**Impact: CRITICAL (Semantic hallucinaton risk)**

High-entropy names—generic identifiers like `data`, `info`, or `handle`—lack distinct semantic meaning. AI models often misinterpret these names or "hallucinate" their contents based on generic training data rather than the actual local context, leading to subtle logic errors.

### Core Principles

- **Specific over Generic:** Replace "junk" words with the specific entity or action (e.g., `userRecord` instead of `data`).
- **Domain-Grounded Verbs:** Use clear actions from the business domain (e.g., `calculateTaxes`, `verifyEmail`) instead of generic wrappers.
- **Self-Documenting Data Flow:** Variable names should describe the state of the data as it moves through a pipe (e.g., `rawInput` -> `normalizedResults`).

### Guidelines

- **Incorrect:** `const data = fetchData()` followed by `const processed = process(data)`.
- **Correct:** `const userRecords = fetchUserRecords()` followed by `const activeUsers = filterActiveUsers(userRecords)`.
- **Measurement:** High clarity means a model can predict the type and structure of a variable from its name alone.

**Detection tip:** Run `npx @aiready/ai-signal-clarity` to automatically identify clusters of high-entropy names.

Reference: [AI Signal Clarity Docs](https://getaiready.dev/docs)
