---
title: Write Pure Functions
impact: MEDIUM
impactDescription: Global state and side effects prevent AI from writing tests
tags: testability, purity, side-effects, global-state, dependency-injection
---

## Write Pure Functions

**Impact: MEDIUM (Verification failure risk)**

Impure functions (those relying on global state, side effects, or I/O) are difficult for AI agents to verify in isolation. When agents cannot easily prove their changes work through simple unit tests, they enter expensive "fix-test-fail" loops.

### Core Principles

- **Explicit Dependencies:** Pass ALL required data as parameters rather than reaching for global state or hidden singletons.
- **Deterministic Outcomes:** For any given input, the function should always produce the same output and no observable side effects.
- **Dependency Injection:** Inject external services (DB, API) through interfaces so they can be easily mocked during AI-led verification.

### Guidelines

- **Incorrect:** Functions accessing `currentUser` globals or updating shared state directly.
- **Correct (Pure):** `processOrder(order, user, config) => Result` — Everything is explicit and local.
- **Testing Benefit:** Pure functions allow AI to write fast, independent tests that provide immediate feedback on code correctness.

**Detection tip:** Run `npx @aiready/testability` to identify impure patterns that trigger AI verification retries.

Reference: [Testability Docs](https://getaiready.dev/docs)
