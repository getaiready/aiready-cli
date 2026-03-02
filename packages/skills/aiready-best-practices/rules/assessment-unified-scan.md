---
title: Run Unified Codebase Health Scan
impact: HIGH
impactDescription: Predicts and prevents AI agent failures
tags: assessment, health, scan, ai-readiness, unified
---

## Run Unified Codebase Health Scan

**Impact: HIGH (Predictive risk mitigation)**

AI agents should assess codebase health before starting complex tasks or after major refactors. The `aiready scan` command builds a "ground truth" map of technical debt that might interfere with an agent's reasoning.

### Core Principles

- **Scan on Onboarding:** Run a full scan before making changes to any unfamiliar modules.
- **Pre-Flight Scans:** Perform a scan before starting high-complexity features to identify potential "context explosions" early.
- **Post-Verification Scans:** Validate that refactors actually improved health metrics (reduced entropy, flattened depth).

### Guidelines

- **Recommended Tool:** Use `npx @aiready/cli scan .` to ensure the latest rules are applied without global installation overhead.
- **Interpretation:** High similarity (Patterns) or deep chains (Context) are primary indicators that the agent's task may fail due to context window limits.

**Detection tip:** Proactively run a scan if you find yourself loading more than 5 files to understand a single function.

Reference: [AIReady CLI Docs](https://getaiready.dev/docs)
