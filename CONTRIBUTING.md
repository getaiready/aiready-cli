# Contributing to @aiready/pattern-detect

Thank you for your interest in contributing to AIReady Pattern Detection! We welcome bug reports, feature requests, and code contributions.

## 🐛 Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/caopengau/aiready-pattern-detect/issues) with:

- Clear description of the problem or feature
- Sample code that demonstrates the issue
- Expected vs actual behavior
- Your environment (Node version, OS)

## 🔧 Development Setup

```bash
# Clone your fork
git clone https://github.com/YOUR_USERNAME/aiready-pattern-detect
cd aiready-pattern-detect

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
   git checkout -b fix/similarity-calculation
   # or
   git checkout -b feat/new-pattern-type
   ```

2. **Make your changes** following our code style:
   - Use TypeScript strict mode
   - Add tests for new pattern types
   - Update README with new features
   - Keep detection logic modular

3. **Test your changes**:

   ```bash
   pnpm build
   pnpm test

   # Test on real codebases
   ./dist/cli.js /path/to/test-repo
   ```

4. **Commit using conventional commits**:

   ```bash
   git commit -m "fix: improve similarity threshold accuracy"
   git commit -m "feat: add React component pattern detection"
   ```

5. **Push and open a PR**:
   ```bash
   git push origin feat/new-pattern-type
   ```

## 📋 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature (new pattern type, output format)
- `fix:` - Bug fix (detection accuracy, false positives)
- `docs:` - Documentation updates
- `perf:` - Performance improvements
- `refactor:` - Code restructuring
- `test:` - Test additions/updates

## 🧪 Testing Guidelines

- Add test cases in `src/__tests__/detector.test.ts`
- Include real-world pattern examples
- Test edge cases (empty files, single-line functions)
- Verify output formats (console, JSON, HTML)

Example test:

```typescript
test('detects API handler patterns', () => {
  const results = detectDuplicatePatterns([...]);
  expect(results).toHaveLength(2);
  expect(results[0].patternType).toBe('api-handler');
});
```

## 🎯 Areas for Contribution

Great places to start:

- **New pattern types**: Add detection for new code patterns
- **Better categorization**: Improve pattern type classification
- **Detection accuracy**: Reduce false positives/negatives
- **Performance**: Optimize for large codebases
- **Output formats**: Add new export options
- **Documentation**: Usage examples, best practices

## 🔍 Code Review

- All checks must pass (build, tests, lint)
- Maintainers review within 2 business days
- Address feedback and update PR
- Once approved, we'll merge and publish

## 📚 Documentation

- Update README.md for new features
- Add examples for new pattern types
- Document CLI options
- Include real-world use cases

## 💡 Feature Ideas

Looking for inspiration? Consider:

- Language-specific pattern types (Go, Rust, etc.)
- Integration with popular linters
- VS Code extension
- CI/CD report generation
- Pattern suggestion improvements

## ❓ Questions?

Open an issue or reach out to the maintainers. We're here to help!

---

**Thank you for helping make AI-generated code better!** 💙
