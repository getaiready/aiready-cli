---
title: Unify Fragmented Interfaces
impact: CRITICAL
impactDescription: 40-80% reduction in AI confusion, prevents wrong type usage
tags: patterns, interfaces, types, consistency
references: https://refactoring.guru/extract-interface
---

## Unify Fragmented Interfaces

**Impact: CRITICAL (Type logic fragmentation)**

Multiple similar interfaces for the same concept (`User`, `UserData`, `UserInfo`) confuse AI agents, leading to incorrect property access and mixed type usage. This is a primary driver of subtle type errors in AI-generated code.

### Core Principles

- **Single Domain Representative:** Define one canonical interface per concept and use it across the service.
- **Extensional Specialization:** Use `extends` to create specialized DTOs or API shapes from the base domain entity.
- **Composition over Duplication:** Compose complex types from stable primitives rather than redefining them in each module.

### Guidelines

- **Incorrect:** Having 5 slightly different versions of the `User` object across API, DB, and UI layers.
- **Correct (Extends):** `interface UserDTO extends User { createdAt: Date }`.
- **Measurement:** High unification means a single change to a domain entity correctly propagates through its specialized variations.

**Benefits:** Reduces type-related bugs by 40-80% by providing clear "source of truth" grounding for the AI agent.

Reference: [Refactoring: Extract Interface](https://refactoring.guru/extract-interface)
