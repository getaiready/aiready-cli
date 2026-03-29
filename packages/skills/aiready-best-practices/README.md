# AIReady Skills Package

This README is for the skills package itself. For the actual skill documentation, see [aiready-best-practices/SKILL.md](./aiready-best-practices/SKILL.md).

## Quick Start

The best-practices skill is ready to use:

```bash
# Install via skills.sh
npx skills add aiready/skills

# Or use directly via NPM
npm install -g @aiready/skills
```

## Development

### Building Skills

```bash
# Build AGENTS.md from rules
pnpm run build

# Build and increment version
pnpm run build:upgrade

# Validate all rules
pnpm run validate

# Build + validate
pnpm run dev
```

### Creating New Rules

1. Copy the template:

```bash
cp aiready-best-practices/rules/_template.md aiready-best-practices/rules/section-name.md
```

2. Fill in the content following the template structure

3. Build to regenerate:

```bash
pnpm run build
```

### Via Makefile (from monorepo root)

```bash
# Build skills
make build-skills

# Validate and build
make dev-skills

# Publish to npm
make npm-publish-skills

# Publish to GitHub
make publish-skills
```

## Structure

```
packages/skills/
├── aiready-best-practices/      # The skill
│   ├── SKILL.md                # Entry point (indexed by skills.sh)
│   ├── AGENTS.md               # Compiled full document
│   ├── rules/                  # Individual rule files
│   │   ├── _sections.md       # Section metadata
│   │   ├── _template.md       # Rule template
│   │   └── *.md               # Rule files
│   └── metadata.json          # Version, organization
└── src/                        # Build tooling
    ├── build.ts               # Compiles rules → AGENTS.md
    ├── parser.ts              # Parses rule files
    ├── config.ts              # Section mapping
    ├── types.ts               # Rule types
    └── validate.ts            # Validates rules
```

## Rules Organization

Rules are organized by priority/impact:

| Section                 | Impact   | Prefix         | Description                 |
| ----------------------- | -------- | -------------- | --------------------------- |
| 1. Pattern Detection    | CRITICAL | `patterns-`    | Semantic duplicates, naming |
| 2. Context Optimization | HIGH     | `context-`     | Import depth, cohesion      |
| 3. Consistency Checking | MEDIUM   | `consistency-` | Naming conventions, errors  |
| 4. Documentation        | MEDIUM   | `docs-`        | Code-doc sync               |
| 5. Dependencies         | LOW      | `deps-`        | Circular deps               |

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for detailed guidelines.

## Testing

```bash
# Validate rules
pnpm run validate

# Build and check output
pnpm run build

# Test with actual AI agents
# - GitHub Copilot
# - Cursor
# - Claude Code
```

## Publishing

### To GitHub (Spoke Repo)

```bash
# From monorepo root
make publish-skills

# This creates a subtree split and pushes to:
# https://github.com/getaiready/aiready-skills
```

### To skills.sh

Once published to GitHub, users can install via:

```bash
npx skills add aiready/skills
```

The skill will be indexed by skills.sh and appear in the marketplace.

## License

MIT - See [LICENSE](./LICENSE)
