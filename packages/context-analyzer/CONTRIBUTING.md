# Contributing to @aiready/context-analyzer

Thank you for your interest in contributing to AIReady Context Analyzer! We welcome bug reports, feature requests, and code contributions.

## 🎯 What is Context Analyzer?

The Context Analyzer measures and optimizes **context window usage** - how much of your codebase an AI model must understand to work with any given file. It helps identify:

- **High context cost files**: Files that require loading many dependencies
- **Deep import chains**: Complex dependency graphs that waste tokens
- **Low cohesion modules**: Files that import too many unrelated concerns
- **Context fragmentation**: Places where important code is scattered

## 🐛 Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/getaiready/aiready-context-analyzer/issues) with:

- Clear description of the problem or feature
- Sample code that demonstrates the issue
- Expected vs actual behavior
- Your environment (Node version, OS)

## 🔧 Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/aiready-context-analyzer
cd aiready-context-analyzer

# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Test CLI locally
./dist/cli.js ../test-project
```

## 📝 Making Changes

1. **Fork the repository** and create a new branch:

   ```bash
   git checkout -b fix/import-depth-calculation
   # or
   git checkout -b feat/new-metric
   ```

2. **Make your changes** following our code style:
   - Use TypeScript strict mode
   - Add tests for new metrics
   - Update README with new features
   - Keep analysis logic modular and focused

3. **Test your changes**:

   ```bash
   pnpm build
   pnpm test

   # Test on real codebases
   ./dist/cli.js /path/to/test-repo
   ```

4. **Commit using conventional commits**:

   ```bash
   git commit -m "fix: accurate import depth calculation"
   git commit -m "feat: add cohesion metric"
   ```

5. **Push and open a PR**:
   ```bash
   git push origin feat/new-metric
   ```

## 📋 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature (new metric, output format)
- `fix:` - Bug fix (calculation accuracy, false positives)
- `docs:` - Documentation updates
- `perf:` - Performance improvements
- `refactor:` - Code restructuring
- `test:` - Test additions/updates

## 🧪 Testing Guidelines

- Add test cases in `src/__tests__/`
- Include real-world code examples
- Test edge cases (empty files, circular imports)
- Verify output formats (console, JSON)

Example test:

```typescript
test('calculates import depth correctly', () => {
  const result = analyzeFile('src/utils/helper.ts', [...files]);
  expect(result.contextCost).toBe(1500);
  expect(result.importDepth).toBe(3);
});
```

## 🏗️ Architecture

### Directory Structure

```
src/
├── analyzer.ts           # Main orchestrator
├── metrics/
│   ├── contextCost.ts   # Token cost estimation
│   ├── importDepth.ts   # Dependency depth analysis
│   ├── cohesion.ts      # Module cohesion scoring
│   └── fragmentation.ts # Context fragmentation detection
├── types.ts             # Type definitions
├── cli.ts               # CLI interface
└── index.ts             # Public API exports
```

### Adding a New Metric

1. Create `src/metrics/your-metric.ts`:

   ```typescript
   import type { FileAnalysis } from '../types';

   export function calculateYourMetric(file: FileAnalysis): number {
     // Your calculation logic
     return metricValue;
   }
   ```

2. Update `src/types.ts` with new result types

3. Integrate in `src/analyzer.ts`

4. Add CLI options in `src/cli.ts`

5. Export from `src/index.ts`

6. Add tests in `src/__tests__/`

## 🎯 Areas for Contribution

Great places to start:

- **New metrics**: Add new context quality measurements
- **Better calculations**: Improve token estimation accuracy
- **Language support**: Add analysis for more file types
- **Performance**: Optimize for large codebases
- **Visualization**: Add output formats or reports
- **Documentation**: Usage examples, best practices

## 🔍 Code Review

- All checks must pass (build, tests, lint)
- Maintainers review within 2 business days
- Address feedback and update PR
- Once approved, we'll merge and publish

## 📚 Documentation

- Update README.md for new features
- Add examples for new metrics
- Document CLI options
- Include real-world use cases

## 💡 Feature Ideas

Looking for inspiration? Consider:

- Language-specific context costs (TypeScript vs Python)
- Framework-aware analysis (React hooks, Vue composables)
- Bundle size estimation
- Hot path analysis
- IDE integration

## ❓ Questions?

Open an issue or reach out to the maintainers. We're here to help!

---

**Thank you for helping optimize AI context usage!** 💙
