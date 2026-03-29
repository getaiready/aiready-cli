# AIReady GitHub Action

[![GitHub Marketplace](https://img.shields.io/badge/GitHub-Marketplace-blue?logo=github)](https://github.com/marketplace/actions/aiready-check)
[![Version](https://img.shields.io/github/v/release/getaiready/aiready-action?label=version)](https://github.com/getaiready/aiready-action/releases)
[![License](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Block PRs that break your AI context budget.** Run AI readiness analysis in your CI/CD pipeline.

## Features

- 🛡️ **AI-Regression Guardrail**: Automatically block PRs that reduce your AI leverage. Compares the current score against the platform baseline to ensure your codebase only gets better for AI.
- 🔄 **Semantic Duplicate Detection**: Identify redundant logic that confuses LLMs.
- 🔗 **Context Window Optimization**: Map and flatten dependency graphs to fit in context.
- 📛 **Naming Consistency**: Ensure your codebase is "Agent-Grounded" with predictable naming.

## Quick Start

```yaml
# .github/workflows/aiready.yml
name: AIReady Check
on: [pull_request]

jobs:
  aiready:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: getaiready/aiready-action@v1
        with:
          threshold: '70'
          fail-on-regression: 'true' # 🛡️ New: Block if score drops
          api-key: ${{ secrets.AIREADY_API_KEY }}
```

## Inputs

| Input                | Required | Default    | Description                                                   |
| -------------------- | -------- | ---------- | ------------------------------------------------------------- |
| `directory`          | No       | `.`        | Directory to analyze                                          |
| `threshold`          | No       | `70`       | Minimum AI readiness score (0-100)                            |
| `fail-on`            | No       | `critical` | Fail on severity: `critical`, `major`, `any`, `none`          |
| `fail-on-regression` | No       | `false`    | **New:** Block PR if score is lower than platform baseline    |
| `upload-to-saas`     | No       | `false`    | Upload results to AIReady SaaS for tracking                   |
| `api-key`            | No       | -          | Required for `fail-on-regression` and `upload-to-saas`        |
| `tools`              | No       | `all`      | Tools to run (patterns, context, consistency, ai-signal, etc) |

## Outputs

| Output     | Description                               |
| ---------- | ----------------------------------------- |
| `score`    | Overall AI readiness score (0-100)        |
| `passed`   | Whether the check passed (`true`/`false`) |
| `issues`   | Total number of issues found              |
| `critical` | Number of critical issues                 |
| `major`    | Number of major issues                    |

## Examples

### Basic PR Check

```yaml
name: AIReady Check
on: [pull_request]

jobs:
  aiready:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: getaiready/aiready-action@v1
```

### Strict Mode (Fail on Any Issue)

```yaml
- uses: getaiready/aiready-action@v1
  with:
    threshold: '80'
    fail-on: 'major'
```

### Specific Tools Only

```yaml
- uses: getaiready/aiready-action@v1
  with:
    tools: 'patterns,context' # Skip consistency check
```

### Upload to SaaS for History

```yaml
- uses: getaiready/aiready-action@v1
  with:
    threshold: '70'
    upload-to-saas: 'true'
    api-key: ${{ secrets.AIREADY_API_KEY }}
    repo-id: 'my-repo-id'
```

## Pricing

| Plan            | Price  | Features                       |
| --------------- | ------ | ------------------------------ |
| **Open Source** | Free   | Unlimited public repos         |
| **Pro**         | $9/mo  | Private repos, history, trends |
| **Team**        | $29/mo | Team dashboard, integrations   |

## Other Installation Methods

### npm

```bash
npm install -g @aiready/cli
aiready scan .
```

### Docker

```bash
docker run --rm -v $(pwd):/workspace aiready/cli:latest scan /workspace
```

### npx (No Install)

```bash
npx @aiready/cli scan .
```

## Links

- 📚 [Documentation](https://getaiready.dev/docs)
- 🌐 [Website](https://getaiready.dev)
- 💬 [Discussions](https://github.com/getaiready/aiready/discussions)
- 🐛 [Report Bug](https://github.com/getaiready/aiready/issues)

## License

MIT © AIReady
</task_progress>
</write_to_file>
