# Getting Started with AIReady CLI: Make Your Codebase AI-Ready in 5 Minutes

> A practical guide to scanning your codebase and improving AI readiness

---

Have you ever noticed that AI coding assistants sometimes give you worse suggestions over time? Or that they keep suggesting code that already exists in your project? You're not alone — and there's a tool that can help.

AIReady is an open-source CLI that analyzes your codebase and tells you exactly where AI tools struggle — and how to fix it. In this guide, you'll learn how to scan your codebase, understand your AI readiness score, and start improving in just 5 minutes.

## What You'll Learn

- How to install AIReady CLI
- How to scan your codebase
- How to understand your AI readiness score
- How to fix common issues
- How to track improvements over time

## Prerequisites

- Node.js 18 or higher
- A codebase to analyze (any TypeScript, JavaScript, Python, Java, Go, or C# project)

## Step 1: Install AIReady CLI

```bash
# Install globally
npm install -g @aiready/cli

# Or use npx without installing
npx @aiready/cli scan .
```

That's it! You're ready to scan.

## Step 2: Scan Your Codebase

Navigate to your project directory and run:

```bash
# Scan current directory
aiready scan .

# Or scan a specific directory
aiready scan ./src
```

You'll see output like this:

```
🎯 AI Readiness Score: 72/100 (Fair)

📊 Breakdown:
  • Pattern Detection:    65/100  (12 semantic duplicates found)
  • Context Analysis:     78/100  (Import depth: 4 levels)
  • Consistency:          82/100  (Naming conventions: 90% consistent)
  • Contract Enforcement: 70/100  (Type safety: Good)
  • Documentation:        68/100  (3 outdated docs found)

💡 Top Recommendations:
  1. Consolidate 12 similar validation functions
  2. Reduce import chain depth from 4 to 3 levels
  3. Update 3 documentation files that are out of sync
```

## Step 3: Understand Your Score

Your AI readiness score (0-100) tells you how well AI tools will work with your codebase:

| Score  | Rating     | What It Means                 |
| ------ | ---------- | ----------------------------- |
| 90-100 | Excellent  | AI works optimally            |
| 75-89  | Good       | Minor improvements possible   |
| 60-74  | Fair       | Noticeable AI confusion       |
| 40-59  | Needs Work | Significant AI struggles      |
| 0-39   | Critical   | Major refactoring recommended |

## Step 4: Fix Common Issues

### Issue 1: Semantic Duplicates

AI tools can't see that similar functions do the same thing. AIReady finds them:

```bash
# Find semantic duplicates
aiready patterns . --similarity 0.7
```

**Fix:** Consolidate similar functions into a single, well-documented utility.

### Issue 2: Deep Import Chains

When imports are 5+ levels deep, AI tools lose context:

```bash
# Analyze import depth
aiready context . --max-depth 3
```

**Fix:** Flatten your module structure or use barrel exports.

### Issue 3: Inconsistent Naming

AI tools learn from your patterns. Inconsistent naming confuses them:

```bash
# Check naming consistency
aiready consistency .
```

**Fix:** Standardize naming conventions across your codebase.

## Step 5: Track Improvements

### Save Your Results

```bash
# Save results to JSON
aiready scan . --output json

# Results are saved to .aiready/ directory
```

### Visualize Your Codebase

```bash
# Generate interactive visualization
aiready visualise .

# Opens a force-directed graph showing relationships
```

### Upload to Platform (Optional)

```bash
# Create a free account at platform.getaiready.dev
# Then upload your results
aiready scan . --upload --api-key ar_your_key
```

Track trends over time and see your improvements!

## Step 6: Integrate into Your Workflow

### Add to CI/CD

```yaml
# GitHub Actions example
- name: Check AI Readiness
  run: |
    npx @aiready/cli scan . --score --threshold 75
```

### Pre-commit Hook

```bash
# Add to package.json
{
  "scripts": {
    "precommit": "aiready scan . --score --threshold 70"
  }
}
```

### VS Code Extension

Install the [AIReady VS Code extension](https://marketplace.visualstudio.com/items?itemName=pengcao.aiready) for real-time feedback as you code.

## Real-World Example

Let's see how AIReady helped improve a real project:

**Before:**

- Score: 62/100
- 23 semantic duplicates
- Import depth: 5 levels
- 8 inconsistent naming patterns

**After 2 hours of fixes:**

- Score: 84/100
- 3 semantic duplicates (87% reduction)
- Import depth: 3 levels
- 1 inconsistent pattern (88% improvement)

**Result:** AI coding assistants now give relevant suggestions 40% faster.

## Next Steps

1. **Join the community:** [Discord](https://discord.gg/aiready)
2. **Track trends:** [Platform](https://platform.getaiready.dev)
3. **Read more:** [AI Engineering Handbook](./docs/AI_ENGINEERING_HANDBOOK.md)
4. **Contribute:** [GitHub](https://github.com/getaiready/aiready-cli)

## Common Questions

**Q: Does AIReady work with my framework?**
A: Yes! AIReady supports TypeScript, JavaScript, Python, Java, Go, and C#. It works with any framework.

**Q: Is it free?**
A: Yes! The CLI and all analysis tools are free and open source. The Platform has a free tier with paid plans for teams.

**Q: How is this different from a linter?**
A: Linters check code quality for humans. AIReady checks code quality for AI tools. They're complementary, not competing.

**Q: Can I use this in my company?**
A: Absolutely! AIReady is MIT licensed. Use it anywhere.

## Conclusion

Making your codebase AI-ready isn't about perfection — it's about removing the friction that makes AI tools less effective. Start with a scan, fix the top 3 issues, and watch your AI assistants become more helpful.

Ready to try it? Run this now:

```bash
npx @aiready/cli scan .
```

---

**Found this helpful?** Share it with your team and join our [Discord community](https://discord.gg/aiready) to discuss AI readiness strategies.

**Want to track improvements over time?** Check out [AIReady Platform](https://platform.getaiready.dev) for trend tracking, team collaboration, and CI/CD integration.
