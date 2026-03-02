---
title: Follow Consistent Naming Conventions
impact: MEDIUM
impactDescription: 5-15% improvement in AI pattern recognition
tags: consistency, naming, conventions, readability
---

## Follow Consistent Naming Conventions

**Impact: MEDIUM (Pattern recognition consistency)**

Inconsistent naming conventions confuse AI models about code intent and relationships. When similar concepts use different naming patterns, AI cannot reliably predict the correct pattern for new code, leading to fragmented and hard-to-maintain suggestions.

### Core Principles

- **Standardize Casing:** Establish and strictly follow casing rules for all identifier types (e.g., `camelCase` for functions, `PascalCase` for types).
- **Uniform File Naming:** Use a consistent file naming scheme (e.g., `kebab-case.ts`) to help AI navigate the file system predictably.
- **Predictable Prefixing:** Use consistent prefixes for specific roles (e.g., `_` for internal/private, `I` or `T` if required by project standards).

### Guidelines

- **Incorrect:** Mixing `getUserData()` with `fetch_user_profile()` and `GetUserSettings()` in the same layer.
- **Correct:** Consistent `camelCase` for all functions: `getUserData()`, `getUserProfile()`, `getUserSettings()`.
- **Correct (Files):** Standardizing on `kebab-case.ts` (e.g., `user-service.ts`, `auth-repository.ts`).

**Detection tip:** Run `npx @aiready/consistency` to identify naming pattern violations across your codebase.

Reference: [Consistency Checking Docs](https://getaiready.dev/docs)
