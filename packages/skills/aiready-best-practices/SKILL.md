# AIReady Best Practices

This skill provides guidelines and tools for maintaining an AI-friendly codebase. It is composed of modular rule sets that are compiled into a consolidated instruction set for agents.

## Core Capabilities

1.  **AI Signal Clarity:** Principles for reducing ambiguity in code.
2.  **Context Optimization:** Strategies for minimizing context window waste.
3.  **Pattern Detection:** Identifying and consolidating semantic duplicates.
4.  **Consistency:** Maintaining uniform naming and architectural patterns.
5.  **Health Assessment:** Using `aiready scan` for proactive codebase auditing.

## Usage for Agents

Full instructions are available in [AGENTS.md](./AGENTS.md).

> [!NOTE]
> This document is automatically generated from individual rules in the [`rules/`](./rules/) directory. Contributors should modify the source rules rather than the compiled file.

### Quick Commands (via npx)

- **Measure Health:** `npx @aiready/cli scan .`
- **Check Consistency:** `npx @aiready/cli consistency .`
- **Detect Duplicates:** `npx @aiready/cli patterns .`
