# AIReady Agent Integration Guide

AIReady provides the "ground truth" context layer for AI agents. By integrating with AIReady, agents can avoid context fragmentation, reduce token waste, and ground themselves instantly in complex repositories.

## 🚀 Instant Grounding with `ai-ready.json`

Every AIReady-enabled repository contains an `ai-ready.json` file. Agents should look for this file during the "discovery" phase of a task.

### 1. Identify Entry Points

Agents can read the `entryPoints` array in `ai-ready.json` to know exactly which files represent the core architecture, avoiding a full file-system scan.

### 2. Use the Grounding Protocol

Instead of searching for code, agents should query the AIReady Grounding API:
`GET /api/agent/grounding?repoId={id}&query="Where is the payment logic?"`

This returns high-relevance file clusters based on AIReady's semantic index.

## 🛠️ Automated Remediation

AIReady provides programmatic fix instructions that agents can directly execute.

1. `GET /api/agent/remediate?repoId={id}` returns a queue of "Quick Wins".
2. Each suggestion includes a CLI command: `npx @aiready/cli remediate --report {path} --tool {tool}`

## 🤝 Partner Specific Instructions

### Cline / Claude Code

Add the following to your `.clinerules`:
"Before starting any task, check for `ai-ready.json`. If present, use the AIReady API to ground yourself and identify context hotspots before loading files."

### Aider

Run AIReady first to identify semantic duplicates, then use Aider to merge them using the instructions from `/api/agent/remediate`.
