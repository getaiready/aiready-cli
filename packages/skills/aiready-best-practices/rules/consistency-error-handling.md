---
title: Use Consistent Error Handling Patterns
impact: MEDIUM
impactDescription: 15-25% improvement in AI error handling suggestions
tags: consistency, errors, patterns, exceptions
references: https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates
---

## Use Consistent Error Handling Patterns

**Impact: MEDIUM (Error logic fragmentation)**

Mixed error patterns (e.g., mixing `throw`, `Result` objects, and `null` returns) prevent AI models from predicting the correct handling strategy. This leads to inconsistent implementations where errors are partially caught or completely ignored.

### Core Principles

- **Unified Error Strategy:** Choose one primary pattern (Result Objects vs. Exceptions) and use it across the entire codebase.
- **Explicit Failure States:** Favor `Result` types for business logic failures to force the AI agent to handle the error case explicitly.
- **Avoid Semantic Nulls:** Don't return `null` or `undefined` to indicate failure; use typed errors or Result objects for clarity.

### Guidelines

- **Incorrect:** Mixing `throw new Error()` in one file with `return null` in another for the same semantic operation (e.g., "User not found").
- **Correct (Result Pattern):** `async function getUser(id): Result<User, Error>` — Explicit success/failure branches.
- **Correct (Exceptions):** Dedicated `AppError` class used consistently with `try-catch` blocks.

**Benefits:** Ensures the AI agent consistently suggests and implements the project's chosen error pattern, reducing unhandled exceptions by 15-25%.

Reference: [TypeScript: Narrowing with Type Predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)
