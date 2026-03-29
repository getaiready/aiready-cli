# Deep Dive: Semantic Duplicate Detection

**Published:** February 7, 2026  
**Reading Time:** 15 min  
**Tags:** AI, Code Quality, AST, Pattern Detection, Semantic Analysis

---

You've just asked your AI assistant to add email validation to your new signup form. It writes this:

```typescript
function validateEmail(email: string): boolean {
  return email.includes('@') && email.includes('.');
}
```

Simple enough. But here's the problem: this exact logic—checking for '@' and '.'—already exists in four other places in your codebase, just written differently:

```typescript
// In src/utils/validators.ts
const isValidEmail = (e) => e.indexOf('@') !== -1 && e.indexOf('.') !== -1;

// In src/api/auth.ts
if (user.email.match(/@/) && user.email.match(/\./)) {
  /* ... */
}

// In src/components/EmailForm.tsx
const checkEmail = (val) =>
  val.split('').includes('@') && val.split('').includes('.');

// In src/services/user-service.ts
return email.search('@') >= 0 && email.search('.') >= 0;
```

Your AI didn't see these patterns. Why? Because they look different syntactically, even though they're semantically identical. This is **semantic duplication**—and it's one of the biggest hidden costs in AI-assisted development.

## The Problem: Syntax Blinds AI Models

Traditional duplicate detection tools look for _exact_ or near-exact text matches. They catch copy-paste duplicates, but miss logic that's been rewritten with different:

- Variable names (`email` vs `e` vs `val`)
- Methods (`includes()` vs `indexOf()` vs `match()` vs `search()`)
- Structure (inline vs function vs arrow function)

AI models suffer from the same limitation. When they scan your codebase for context, they see these five implementations as completely unrelated. Each one consumes precious context window tokens, yet provides zero new information.

## Real-World Impact: The receiptclaimer Story

When I ran `@aiready/pattern-detect` on [receiptclaimer](https://receiptclaimer.com)'s codebase, I found **23 semantic duplicate patterns** scattered across 47 files. Here's what that looked like:

**Before:**

- 23 duplicate patterns (validation, formatting, error handling)
- 8,450 wasted context tokens
- AI suggestions kept reinventing existing logic
- Code reviews: "Didn't we already have this somewhere?"

**After consolidation:**

- 3 remaining patterns (acceptable, different contexts)
- 1,200 context tokens (85% reduction)
- AI now references existing patterns
- Faster code reviews, cleaner suggestions

The math: Each duplicate pattern cost ~367 tokens on average. When AI assistants tried to understand feature areas, they had to load multiple variations of the same logic, quickly exhausting their context window.

## How It Works: Jaccard Similarity on AST Tokens

`@aiready/pattern-detect` uses a technique called **Jaccard similarity** on **Abstract Syntax Tree (AST) tokens** to detect semantic duplicates. Let me break that down.

### Step 1: Parse to AST

First, we parse your code into an Abstract Syntax Tree—a structural representation that ignores syntax and focuses on meaning:

```typescript
// Original code
function validateEmail(email) {
  return email.includes('@') && email.includes('.');
}

// AST tokens (simplified)
[
  'FunctionDeclaration',
  'Identifier:validateEmail',
  'Identifier:email',
  'ReturnStatement',
  'LogicalExpression:&&',
  'CallExpression:includes',
  'MemberExpression:email',
  'StringLiteral:@',
  'CallExpression:includes',
  'MemberExpression:email',
  'StringLiteral:.',
];
```

### Step 2: Normalize

We normalize these tokens by:

- Removing specific identifiers (variable/function names)
- Keeping operation types (CallExpression, LogicalExpression)
- Preserving structure (nesting, flow control)

```typescript
// Normalized tokens
[
  'FunctionDeclaration',
  'ReturnStatement',
  'LogicalExpression:&&',
  'CallExpression:includes',
  'StringLiteral',
  'CallExpression:includes',
  'StringLiteral',
];
```

### Step 3: Calculate Jaccard Similarity

Jaccard similarity measures how similar two sets are:

```
Jaccard(A, B) = |A ∩ B| / |A ∪ B|
```

Where:

- **A ∩ B** = tokens in both sets (intersection)
- **A ∪ B** = tokens in either set (union)

**Example:**

```typescript
// Pattern A (normalized)
Set A = ['FunctionDeclaration', 'ReturnStatement', 'LogicalExpression:&&',
         'CallExpression:includes', 'StringLiteral']

// Pattern B (normalized)
Set B = ['FunctionDeclaration', 'ReturnStatement', 'LogicalExpression:&&',
         'CallExpression:indexOf', 'StringLiteral']

// Intersection
A ∩ B = ['FunctionDeclaration', 'ReturnStatement', 'LogicalExpression:&&',
         'StringLiteral']
|A ∩ B| = 4

// Union
A ∪ B = ['FunctionDeclaration', 'ReturnStatement', 'LogicalExpression:&&',
         'CallExpression:includes', 'CallExpression:indexOf', 'StringLiteral']
|A ∪ B| = 6

// Jaccard similarity
Jaccard(A, B) = 4 / 6 = 0.67 (67%)
```

By default, `pattern-detect` flags patterns with **≥70% similarity** as duplicates. This catches most semantic duplicates while avoiding false positives.

## Pattern Classification

The tool automatically classifies patterns into categories:

### 1. Validators

Logic that checks conditions and returns boolean:

```typescript
// Pattern: Email validation
function validateEmail(email) {
  return email.includes('@');
}
const isValidEmail = (e) => e.indexOf('@') !== -1;
```

### 2. Formatters

Logic that transforms input to output:

```typescript
// Pattern: Phone number formatting
function formatPhone(num) {
  return num.replace(/\D/g, '');
}
const cleanPhone = (n) =>
  n
    .split('')
    .filter((c) => /\d/.test(c))
    .join('');
```

### 3. API Handlers

Request/response processing logic:

```typescript
// Pattern: Error response handling
function handleError(err) {
  return { status: 500, message: err.message };
}
const errorResponse = (e) => ({ status: 500, message: e.message });
```

### 4. Utilities

General helper functions:

```typescript
// Pattern: Array deduplication
function unique(arr) {
  return [...new Set(arr)];
}
const dedupe = (a) => Array.from(new Set(a));
```

## When to Extract vs When to Tolerate

Not all semantic duplicates should be eliminated. Here's how to decide:

### ✅ Extract When:

- **High similarity (>85%)**: Nearly identical logic, definitely consolidate
- **Frequent reuse**: Used in 3+ places
- **Core business logic**: Validation, formatting, calculations
- **High maintenance cost**: Logic that changes often

### ⚠️ Consider Context:

- **Medium similarity (70-85%)**: Review case-by-case
- **Different domains**: User validation vs product validation might be intentionally separate
- **Performance critical**: Sometimes duplication for optimization is justified

### ❌ Tolerate When:

- **Low similarity (<70%)**: Probably not semantic duplicates
- **Test code**: Tests often duplicate assertions intentionally
- **Isolated modules**: If modules should remain independent
- **One-off logic**: Used once or twice, extraction overhead not worth it

## Example: Refactoring receiptclaimer's Validation Logic

Here's a real refactoring from receiptclaimer:

**Before: 5 duplicate email validators**

```typescript
// src/api/auth/signup.ts
function validateSignupEmail(email: string) {
  return email.includes('@') && email.length > 5;
}

// src/api/auth/login.ts
const checkLoginEmail = (e: string) => e.indexOf('@') !== -1 && e.length > 5;

// src/services/user-service.ts
function isValidEmail(email: string) {
  return /@/.test(email) && email.length > 5;
}

// src/components/EmailForm.tsx
const validateEmail = (val: string) =>
  val.includes('@') && val.trim().length > 5;

// src/utils/validators.ts
export const emailValid = (email: string) =>
  email.search('@') >= 0 && email.length > 5;
```

**Similarity scores:**

- signup vs login: 89%
- signup vs user-service: 87%
- signup vs EmailForm: 85%
- signup vs validators: 91%

**After: Consolidated to core utility**

```typescript
// src/utils/validators.ts
export function isValidEmail(email: string): boolean {
  return email.includes('@') && email.trim().length > 5;
}

// Usage everywhere else
import { isValidEmail } from '@/utils/validators';
```

**Impact:**

- 5 implementations → 1
- ~1,850 tokens → ~370 tokens (80% reduction)
- AI now finds and reuses the pattern
- Single source of truth for email validation

## Integration with CI/CD

Make semantic duplicate detection part of your workflow:

### GitHub Actions Example

```yaml
name: Code Quality
on: [pull_request]

jobs:
  semantic-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Detect semantic duplicates
        run: npx @aiready/pattern-detect ./src --threshold 70

      - name: Comment on PR
        if: failure()
        uses: actions/github-script@v6
        with:
          script: |
            github.rest.issues.createComment({
              issue_number: context.issue.number,
              owner: context.repo.owner,
              repo: context.repo.repo,
              body: '⚠️ Semantic duplicates detected. Run `npx @aiready/pattern-detect` locally for details.'
            })
```

### Pre-commit Hook

```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "Checking for semantic duplicates..."
npx @aiready/pattern-detect ./src --threshold 70 --quiet

if [ $? -ne 0 ]; then
  echo "❌ Semantic duplicates detected. Review and consolidate before committing."
  exit 1
fi
```

## Advanced Configuration

Customize pattern detection for your project:

```json
{
  "pattern-detect": {
    "threshold": 70,
    "minTokens": 10,
    "ignorePatterns": ["**/tests/**", "**/*.test.ts", "**/mocks/**"],
    "categories": {
      "validators": {
        "enabled": true,
        "threshold": 75
      },
      "formatters": {
        "enabled": true,
        "threshold": 70
      }
    }
  }
}
```

## Best Practices

1. **Run regularly**: Make it part of your CI/CD, not a one-time audit
2. **Start with high thresholds**: Begin at 85%, lower gradually as you understand your codebase
3. **Review context**: Don't blindly consolidate—understand why duplicates exist
4. **Educate your team**: Share findings in code reviews, explain semantic vs syntactic
5. **Track progress**: Measure token reduction over time

## The Bottom Line

Semantic duplication is invisible to traditional tools and AI models alike. But it's costing you:

- **Context window waste**: 30-50% of tokens in typical AI-assisted projects
- **Slower AI responses**: Models process redundant logic repeatedly
- **Inconsistent suggestions**: AI doesn't know which pattern to follow
- **Higher maintenance**: Changes must be made in multiple places

`@aiready/pattern-detect` makes the invisible visible. It shows you where your AI is wasting context, where your patterns diverge, and where consolidation will have the biggest impact.

## Try It Yourself

```bash
# Analyze your codebase
npx @aiready/pattern-detect ./src

# With custom threshold
npx @aiready/pattern-detect ./src --threshold 80

# Output to JSON
npx @aiready/pattern-detect ./src --output json > report.json

# Unified CLI with all metrics
npx @aiready/cli scan --score
```

**Resources:**

- GitHub: [github.com/getaiready/aiready-cli](https://github.com/getaiready/aiready-cli)
- Docs: [aiready.dev](https://aiready.dev)
- Report issues: [github.com/getaiready/aiready-cli/issues](https://github.com/getaiready/aiready-cli/issues)

---

**Found semantic duplicates in your codebase?** Share your before/after numbers in the comments—I'd love to hear your results.

---

_Peng Cao is the founder of [receiptclaimer](https://receiptclaimer.com) and creator of [aiready](https://github.com/getaiready/aiready-cli), an open-source suite for measuring and optimizing codebases for AI adoption._
