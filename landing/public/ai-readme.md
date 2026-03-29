# AIReady - AI-Ready Codebase Optimization Tools

**Purpose**: Free, open-source CLI tools to optimize codebases for AI collaboration

**Quick Start**: `npx @aiready/cli scan .`

## What is AIReady?

AIReady is a free command-line tool that analyzes your codebase to identify issues that make it harder for AI models (like ChatGPT, Claude, or GitHub Copilot) to understand and work with your code effectively.

## Key Features

### 1. Semantic Duplicate Detection

- Identifies functionally similar code patterns across your codebase
- Finds variations that waste AI context window tokens
- Language: TypeScript/JavaScript, Python, Java, Go, C#

### 2. Context Window Analysis

- Calculates token usage for AI models (GPT-4, Claude, etc.)
- Identifies context fragmentation issues
- Optimizes file organization for better AI understanding

### 3. Code Consistency Checking

- Detects pattern inconsistencies that confuse AI models
- Ensures naming conventions and code structure are learnable
- Checks for anti-patterns in AI-assisted development

### 4. AI Readiness Score

- Quantifies how well your code works with AI tools
- Provides actionable recommendations
- Tracks improvement over time

## How to Use

```bash
# Option 1: Run directly with npx (no installation)
npx @aiready/cli scan .

# Option 2: Install globally
npm install -g @aiready/cli
aiready scan .

# Option 3: Add to package.json
npm install --save-dev @aiready/cli
npx aiready scan .
```

## Privacy & Security

- ✅ Runs completely offline on your local machine
- ✅ Zero network calls - no code is uploaded anywhere
- ✅ No SaaS, no cloud processing
- ✅ Air-gap compatible for secure environments
- ✅ Open source - inspect the code yourself

## Comparison: AIReady vs Linters

**ESLint/TSLint**: Check syntax correctness, coding standards, potential bugs
**AIReady**: Checks AI understandability, semantic duplicates, context optimization

They complement each other - use both for best results.

## Pricing

100% Free. Open source under MIT license.

## Support

- GitHub: https://github.com/getaiready/aiready-cli
- Issues: https://github.com/getaiready/aiready-cli/issues
- npm: https://www.npmjs.com/package/@aiready/cli
- Documentation: https://github.com/getaiready/aiready-cli#readme

## Use Cases

1. **Before AI Pair Programming**: Optimize your codebase before starting AI-assisted development
2. **Code Reviews**: Check if new code maintains AI-friendly patterns
3. **Legacy Code Modernization**: Identify areas that need refactoring for AI collaboration
4. **Onboarding**: Help new team members understand codebase patterns
5. **Managing Multiple Repositories**: Maintain consistency across multiple packages

## Requirements

- Node.js 18 or higher
- npm or pnpm package manager

## Common Questions

**Q: Is my code uploaded anywhere?**
A: No. Everything runs locally on your machine. Zero network calls.

**Q: What languages are supported?**
A: TypeScript, JavaScript, Python, Java, Go, and C#. We cover 95% of the total programming language market.
**Q: How is this different from a linter?**
A: Linters check code correctness. AIReady checks AI understandability - semantic duplicates, context fragmentation, pattern consistency.

**Q: Can I use it in CI/CD?**
A: Yes! AIReady can be integrated into your CI/CD pipeline to maintain AI readiness scores.

**Q: Is it free for commercial use?**
A: Yes. MIT license allows commercial use.

## Installation Alternatives

```bash
# npm
npm install -g @aiready/cli

# pnpm
pnpm add -g @aiready/cli

# yarn
yarn global add @aiready/cli
```

## Output Format

AIReady generates detailed JSON and Markdown reports including:

- AI Readiness Score (0-100)
- List of semantic duplicates with similarity scores
- Context window analysis with token counts
- Pattern consistency violations
- Actionable recommendations

## Contributing

Contributions welcome! See [CONTRIBUTING.md](https://github.com/getaiready/aiready-cli/blob/main/CONTRIBUTING.md)

## License

MIT - Free for personal and commercial use

## Keywords

AI codebase optimization, semantic duplicate detection, context window analysis, code consistency, AI readiness score, developer tools, static analysis, TypeScript analyzer, JavaScript linter, AI pair programming, code quality, AST parsing, token optimization, AI collaboration, open source tools

---

**Last Updated**: January 2026
**Version**: 0.7.x
**Maintainer**: AIReady Team
**Status**: Active Development
