---
title: Maintain Verification Coverage
impact: MEDIUM
impactDescription: Low test coverage prevents AI from confirming its changes work
tags: testability, verification, coverage, testing, ai-agent
---

## Maintain Verification Coverage

**Impact: MEDIUM (Verification blind spots)**

Verification coverage measures how effectively AI can confirm its changes work. Low test coverage forces AI into trial-and-error loops, guessing at correctness rather than proving it through results. This significantly increases the risk of regressions in AI-maintained codebases.

### Core Principles

- **Testable Interface Design:** Ensure functions have clear inputs/outputs that can be easily asserted in a test runner.
- **Assertion-Rich Tests:** Avoid "smoke tests" that only check if code runs; use specific assertions that prove the business logic is correct.
- **Fast Feedback Loops:** Keep unit tests highly performant so AI can run them after every major code block edit.

### Guidelines

- **Incorrect:** Functions without matching test files or tests that lack meaningful assertions (`expect(true).toBe(true)`).
- **Correct:** A dedicated `__tests__/` directory co-located with features, containing specific unit and integration tests.
- **Measurement:** High coverage means an agent can modify a function and immediately know if they've broken its core logic or edge cases.

**AI Strategy:** Agents should proactively search for or create tests before refactoring complex modules to ensure they have a "safety net".

Reference: [Testability Docs](https://getaiready.dev/docs)
