# Contributing to @aiready/visualizer

Thank you for your interest in contributing to AIReady Visualizer! We welcome bug reports, feature requests, and code contributions.

## 🎯 What is Visualizer?

The Visualizer transforms AIReady analysis results into **interactive force-directed graph visualizations**. It helps you understand:

- **Dependency graphs**: How files connect through imports
- **Issue overlays**: Where problems are located in your codebase
- **Cluster analysis**: How your code is organized into domains
- **Metrics visualization**: Token costs, complexity, and more

## 🏛️ Architecture

The Visualizer follows a **hub-and-spoke** pattern:

```
@aiready/core (HUB)
    │
    ├── @aiready/visualizer (SPOKE)
    │   ├── Graph Builder      # Transform analysis → graph
    │   ├── CLI Tool          # Generate HTML visualizations
    │   └── Web App           # Interactive React UI
    │       └── @aiready/components
    │           └── ForceDirectedGraph
    │
    └── @aiready/cli (HUB - integration)
```

### Key Components

- **Graph Builder**: Transform analysis reports into graph structures
- **CLI Tool**: Generate standalone HTML visualizations
- **Web App**: React-based interactive visualization (Vite-powered)
- **D3 Integration**: Force-directed layout using d3-force

## 🐛 Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/getaiready/aiready-visualizer/issues) with:

- Clear description of the problem or feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Your environment (Node version, OS)

## 🔧 Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/aiready-visualizer
cd aiready-visualizer

# Install dependencies
pnpm install

# Build
pnpm build

# Watch mode for CLI
pnpm dev

# Start web dev server
pnpm dev:web

# Run tests
pnpm test
```

## 📝 Making Changes

1. **Fork the repository** and create a new branch:

   ```bash
   git checkout -b fix/graph-layout
   # or
   git checkout -b feat/new-visualization
   ```

2. **Make your changes** following our code style:
   - Use TypeScript strict mode
   - Add tests for new features
   - Update README with new features
   - Keep visualization logic modular

3. **Test your changes**:

   ```bash
   pnpm build
   pnpm test

   # Generate sample visualization
   ./dist/cli.js sample -o test.html
   ```

4. **Commit using conventional commits**:

   ```bash
   git commit -m "fix: correct node positioning"
   git commit -m "feat: add zoom controls"
   ```

5. **Push and open a PR**:
   ```bash
   git push origin feat/new-visualization
   ```

## 📋 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature (new visualization, UI control)
- `fix:` - Bug fix (graph rendering, layout issues)
- `docs:` - Documentation updates
- `perf:` - Performance improvements
- `refactor:` - Code restructuring
- `test:` - Test additions/updates
- `ui:` - UI/styling changes

## 🧪 Testing Guidelines

- Add tests for new graph features
- Test with various graph sizes (small, medium, large)
- Verify edge cases (empty graphs, circular dependencies)
- Test cross-browser compatibility
- Verify responsive behavior

Example test:

```typescript
import { GraphBuilder } from './src/graph/builder';

test('builds graph from analysis results', () => {
  const report = { files: [...], dependencies: [...] };
  const graph = GraphBuilder.buildFromReport(report, '/project');

  expect(graph.nodes).toHaveLength(10);
  expect(graph.edges).toHaveLength(15);
});
```

## 🏗️ Architecture

### Directory Structure

```
packages/visualizer/
├── src/
│   ├── cli.ts              # CLI entry point
│   ├── index.ts            # Package exports
│   ├── types.ts            # Core TypeScript types
│   └── graph/
│       └── builder.ts      # Graph building logic
├── web/                    # React web application
│   ├── src/
│   │   ├── App.tsx         # Main app component
│   │   ├── components/     # UI components
│   │   ├── hooks/          # Custom React hooks
│   │   └── utils.ts        # Utilities
│   └── vite.config.ts      # Vite configuration
├── scripts/                # Development scripts
├── test/                  # Unit tests
└── README.md              # This file
```

### Adding a New Visualization Feature

1. For CLI tools, edit `src/cli.ts`:

   ```typescript
   program
     .command('new-command')
     .description('Description')
     .action(() => {
       // Your implementation
     });
   ```

2. For web features, add to `web/src/components/`:

   ```typescript
   export function YourFeature() {
     // Your React component
     return <div>...</div>;
   }
   ```

3. Add tests in `test/`

4. Update README.md

## 🎯 Areas for Contribution

Great places to start:

- **New visualizations**: Add new chart types or views
- **Interactivity**: Improve drag, zoom, pan behaviors
- **Performance**: Optimize for large graphs
- **UI/UX**: Improve controls, legends, panels
- **Export formats**: Add new export options
- **Accessibility**: Keyboard navigation, screen readers

## 💡 Feature Ideas

Looking for inspiration? Consider:

- Clustering by module/domain
- Timeline views for changes
- Filter by issue type/severity
- Highlight paths between nodes
- Export to PNG/SVG
- Comparison views (before/after)

## 🔍 Code Review

- All checks must pass (build, tests, lint)
- Maintainers review within 2 business days
- Address feedback and update PR
- Once approved, we'll merge and publish

## 📚 Documentation

- Update README.md for new features
- Add examples for new visualizations
- Document CLI options
- Include usage with real data

## ❓ Questions?

Open an issue or reach out to the maintainers. We're here to help!

---

**Thank you for helping visualize AI-ready codebases!** 💙
