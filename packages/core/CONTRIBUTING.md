# Contributing to @aiready/core

Thank you for your interest in contributing to AIReady Core! We welcome bug reports, feature requests, and code contributions.

## 🐛 Reporting Issues

Found a bug or have a feature request? [Open an issue](https://github.com/getaiready/aiready-core/issues) with:

- Clear description of the problem or feature
- Steps to reproduce (for bugs)
- Expected vs actual behavior
- Your environment (Node version, OS)

## 🔧 Development Setup

```bash
# Clone your fork
git clone https://github.com/getaiready/aiready-core
cd aiready-core

# Install dependencies
pnpm install

# Build
pnpm build

# Run tests
pnpm test

# Run linter
pnpm lint
```

## 📝 Making Changes

1. **Fork the repository** and create a new branch:

   ```bash
   git checkout -b fix/your-bug-fix
   # or
   git checkout -b feat/your-new-feature
   ```

2. **Make your changes** following our code style:
   - Use TypeScript strict mode
   - Add JSDoc comments for public APIs
   - Write tests for new functionality
   - Keep functions pure and focused

3. **Test your changes**:

   ```bash
   pnpm build
   pnpm test
   pnpm lint
   ```

4. **Commit using conventional commits**:

   ```bash
   git commit -m "fix: resolve token estimation edge case"
   git commit -m "feat: add new similarity algorithm"
   ```

5. **Push and open a PR**:

   ```bash
   git push origin fix/your-bug-fix
   ```

## 📋 Commit Convention

We use [Conventional Commits](https://www.conventionalcommits.org/):

- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `chore:` - Maintenance tasks
- `refactor:` - Code refactoring
- `test:` - Test updates

## 🧪 Testing Guidelines

- Add tests for new functions in `src/__tests__/`
- Ensure all tests pass: `pnpm test`
- Aim for >80% code coverage

## 📚 Documentation

- Update README.md if adding new public APIs
- Add JSDoc comments for exported functions
- Include usage examples for new features

## 🔍 Code Review

- Automated checks must pass (build, tests, lint)
- Maintainers will review within 2 business days
- Address feedback and update your PR
- Once approved, we'll merge and publish

## 🎯 What to Contribute

Good first contributions:

- Fix typos in documentation
- Add missing tests
- Improve error messages
- Optimize existing utilities

## ❓ Questions?

Open an issue or reach out to the maintainers. We're here to help!

---

**Thank you for contributing!** 💙
