---
title: Split Large Files (>500 lines)
impact: HIGH
impactDescription: 30-50% reduction in context window usage
tags: context, file-size, refactoring, modules
references: https://refactoring.guru/extract-class
---

## Split Large Files (>500 lines)

**Impact: HIGH (Context window exhaustion)**

Files exceeding 500 lines often force AI models to process unnecessary code, wasting 90%+ of their context budget for a single operation. This leads to incomplete reasoning and inaccurate suggestions as the model's focus is diluted.

### Core Principles

- **Context Optimization:** Keep source files small so they fit entirely within an AI's highly-attentive context window.
- **Responsibility-Based Splitting:** Move distinct feature sets into separate files (e.g., `ProfileService` should not live with `AuthService`).
- **Incremental Extraction:** Proactively split files once they cross the 500-line threshold to maintain modularity.

### Guidelines

- **Ideal (< 200 lines):** Fits easily in a single context window with high precision.
- **Acceptable (200-500 lines):** Manageable if cohesion is very high.
- **Problematic (> 500 lines):** Should be split to avoid context pollution.
- **Critical (> 1000 lines):** Always split; too large for effective AI assistance and often indicates architectural "god objects".

**Workflow:** When a file grows too large, extract logical classes or function groups into separate files in a feature-specific directory. Use `index.ts` to maintain a clean public API.

Reference: [Refactoring: Extract Class](https://refactoring.guru/extract-class)
