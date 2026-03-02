---
title: Keep Import Chains Shallow
impact: HIGH
impactDescription: 10-30% reduction in context depth
tags: context, imports, dependency-depth, circular-imports
---

## Keep Import Chains Shallow

**Impact: HIGH (Context depth risk)**

Deep import chains force AI models to load many intermediate files to trace logic, quickly exceeding context window limits. When AI must trace through 5+ levels of imports, it often loses the original goal's context and provides incomplete or hallucinated suggestions.

### Core Principles

- **Flatten Dependency Trees:** Use barrel exports (`index.ts`) and clear module boundaries to reduce the level of transitives.
- **Prefer Direct Imports:** In deep architectures, use path aliases (e.g., `@/lib/utils`) to keep import paths shallow and predictable.
- **Co-locate Related Logic:** Reduce the need for deep cross-module imports by keeping tightly coupled logic in the same or adjacent directories.

### Guidelines

- **Level 1 (Direct):** Ideal. AI understands the dependency immediately.
- **Level 2-3 (Transitive):** Acceptable. Manageable for most modern models.
- **Level 4+ (Deep):** Problematic. Triggers "context fatigue" and increases error rates.
- **Best Practice:** Use barrel exports to flatten paths: `import { x } from '@/lib'` instead of `import { x } from '../../lib/a/b/c/x'`.

**Detection tip:** Run `npx @aiready/context-analyzer --max-depth 3` to identify deep or circular import chains.

Reference: [Context Analysis Docs](https://getaiready.dev/docs)
