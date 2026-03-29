# Why Your Codebase is Invisible to AI (And What to Do About It)

**Part 2 of 7: The AI Code Debt Tsunami Series**

---

I watched GitHub Copilot suggest the same validation logic three times in one week. Different syntax. Different variable names. Same exact purpose.

The AI wasn't broken. My codebase was invisible.

Here's the problem: AI can write code, but it can't _see_ your patterns. Not the way humans do. When you have the same logic scattered across different files with different names, AI treats each one as unique. It doesn't know you've already solved this problem. So it solves it again. And again.

This isn't just annoying. It's expensive.

## The Context Window Crisis

Every time your AI assistant helps with code, it needs context. It reads your file, follows imports, understands dependencies. All of this costs tokens. The more fragmented your code, the more tokens you burn.

Let me show you a real example from building ReceiptClaimer.

### Example 1: User Validation - The Hard Way

I had user validation logic spread across 8 files:

- `api/auth/validate-email.ts`
- `api/auth/validate-password.ts`
- `api/users/check-email-exists.ts`
- `api/users/validate-username.ts`
- `lib/validators/email.ts`
- `lib/validators/password-strength.ts`
- `utils/auth/email-format.ts`
- `utils/validation/user-fields.ts`

Each file: 80-150 lines. Different patterns. Different error handling. Different import chains.

When AI needed to help with user validation, it had to:

1. Read the current file (200 tokens)
2. Follow imports to understand the pattern (3,200 tokens)
3. Pull in dependencies to match types (5,800 tokens)
4. Scan similar files to understand conventions (3,250 tokens)

**Total context cost: 12,450 tokens per request.**

At GPT-4 pricing (~$0.03/1K tokens), that's **$0.37 per code suggestion**.

### Example 2: User Validation - The Smart Way

After refactoring, I consolidated to 2 files:

- `lib/user-validation/index.ts` - All validation logic
- `lib/user-validation/types.ts` - Shared types

Each file: 200-250 lines. Single pattern. Clear error handling. Minimal imports.

Same AI assistance, new cost:

1. Read the current file (200 tokens)
2. Read the validation module (900 tokens)
3. Read type definitions (1,000 tokens)

**Total context cost: 2,100 tokens per request.**

**That's an 83% reduction.** From $0.37 to $0.06 per suggestion.

If your team makes 50 AI-assisted edits per day, that's:

- **Before:** $18.50/day = $555/month = $6,660/year
- **After:** $3/day = $90/month = $1,080/year

**Savings: $5,580/year. Just from organizing user validation.**

And that's one domain. What about error handling? Database queries? API endpoints? File uploads?

## Three Ways Your Code Becomes Invisible

### 1. Semantic Duplicates: Same Logic, Different Disguise

Traditional linters catch copy-paste duplication. They're useless for semantic duplicates.

Here's what I mean. Both functions do the exact same thing:

```typescript
// File: api/receipts/validate.ts
function checkReceiptData(data: any): boolean {
  if (!data.merchant) return false;
  if (!data.amount) return false;
  if (data.amount <= 0) return false;
  if (!data.date) return false;
  return true;
}

// File: lib/validators/receipt-validator.ts
export function isValidReceipt(receipt: ReceiptInput): boolean {
  const hasRequiredFields = receipt.merchant && receipt.amount && receipt.date;
  const hasPositiveAmount = receipt.amount > 0;
  return hasRequiredFields && hasPositiveAmount;
}
```

ESLint won't catch this. SonarQube won't catch this. They look different.

But to an AI reading your codebase? These are two competing patterns. Should it use the imperative style with early returns? Or the declarative style with boolean composition?

**It doesn't know. So it picks randomly. Or invents a third way.**

I found 23 of these in ReceiptClaimer before I measured. Receipt validation, user authentication, file upload checks, date parsing, currency formatting.

Each one was a signal to AI: "We don't have a standard way of doing this."

### 2. Domain Fragmentation: Scattered Logic That Bleeds Tokens

Every time you split a single responsibility across multiple files, you fragment your domain. AI has to load more context. Burn more tokens. Make more mistakes.

Here's what fragmentation looked like in my codebase:

**Receipt Processing (fragmented):**

```
src/
  api/
    receipts/
      upload.ts          # Handles file upload
      extract.ts         # Calls OCR service
      parse.ts           # Parses OCR response
  lib/
    ocr/
      google-vision.ts   # Google Vision integration
      openai-vision.ts   # OpenAI Vision integration
    parsers/
      receipt-parser.ts  # Parsing logic
  services/
    receipt-service.ts   # Business logic
  utils/
    file-upload.ts       # S3 upload helper
```

8 files. 7 different import paths. To understand receipt processing, AI needs to load all of them.

**Receipt Processing (consolidated):**

```
src/
  domains/
    receipt-processing/
      index.ts           # Public API
      ocr-service.ts     # OCR abstraction
      parser.ts          # Parsing logic
      storage.ts         # S3 operations
      types.ts           # Shared types
```

5 files. Single import path. Clear boundaries. AI can understand the entire domain from one import.

**The result:** Import depth dropped from 7 levels to 3 levels. Context budget per file dropped 62%.

### 3. Low Cohesion: Mixed Concerns That Confuse Everyone

This is the "God file" problem, but inverted.

Instead of one file doing everything, you have files that do _unrelated_ things. AI can't figure out what the file is _for_.

Example from my early codebase:

```typescript
// lib/utils/helpers.ts (820 lines)
export function formatCurrency(amount: number): string { ... }
export function parseDate(dateStr: string): Date { ... }
export function uploadToS3(file: Buffer): Promise<string> { ... }
export function validateEmail(email: string): boolean { ... }
export function generateToken(): string { ... }
export function calculateGST(amount: number): number { ... }
export function hashPassword(pwd: string): Promise<string> { ... }
```

What is this file? Currency formatting? Date parsing? Authentication? File uploads? Tax calculation?

**All of them. None of them.**

When AI tries to help, it doesn't know which pattern to follow. The file has no cohesive theme. So AI makes guesses. Often wrong guesses.

After measuring cohesion scores (more on this below), I split this into:

- `lib/formatting/currency.ts` - Currency & GST
- `lib/formatting/date.ts` - Date parsing
- `lib/auth/tokens.ts` - Token & password handling
- `lib/storage/s3.ts` - File uploads
- `lib/validation/email.ts` - Email validation

**Cohesion score went from 0.23 (terrible) to 0.89 (excellent).**

AI suggestions became relevant. Copilot started importing the right modules. Code reviews got faster because humans could find things too.

## How to Measure Invisibility

You can't fix what you can't measure. So I built tools to measure these three dimensions.

### Measuring Semantic Duplicates

Traditional tools use line-by-line comparison. They fail on semantic duplicates.

I built `@aiready/pattern-detect` using a different approach:

1. **Parse code into AST** (Abstract Syntax Trees)
2. **Extract semantic tokens** (variable names → generic placeholders)
3. **Calculate Jaccard similarity** (set-based comparison)

Example:

```typescript
// Function A
function validateUser(user) {
  if (!user.email) return false;
  if (!user.password) return false;
  return true;
}

// Function B
function checkUserValid(data) {
  const hasEmail = !!data.email;
  const hasPassword = !!data.password;
  return hasEmail && hasPassword;
}
```

After normalization:

```
Function A tokens: [if, not, property, return, false, return, true]
Function B tokens: [const, property, return, and]
```

Jaccard similarity: **0.78** (78% similar)

Anything above 0.70? Probably a semantic duplicate worth reviewing.

**Tool:** `npx @aiready/pattern-detect`

### Measuring Fragmentation

Context budget tells you how many tokens AI needs to understand a file.

I built `@aiready/context-analyzer` to measure:

1. **Import depth** - How many levels deep do imports go?
2. **Context budget** - Total tokens needed to understand this file
3. **Cohesion score** - Are imports related to each other?
4. **Fragmentation score** - Is this domain split across files?

Example output:

```bash
src/api/receipts/upload.ts
  Import depth: 7 levels
  Context budget: 12,450 tokens
  Cohesion: 0.34 (low - mixed concerns)
  Fragmentation: 0.78 (high - scattered domain)
```

High fragmentation + low cohesion = AI will struggle.

**Tool:** `npx @aiready/context-analyzer`

### Measuring Consistency (Coming Soon)

The third dimension: pattern consistency.

Do you handle errors the same way everywhere? Use the same naming conventions? Follow the same async patterns?

I'm building `@aiready/consistency` to detect:

- Mixed error handling patterns (try-catch vs callbacks vs promises)
- Inconsistent naming (camelCase vs snake_case)
- Import style drift (ES modules vs require)
- Async pattern mixing (async/await vs .then())

**Status:** Beta release next week.

## The ReceiptClaimer Results

I ran these tools on my own codebase — [ReceiptClaimer](https://receiptclaimer.com.au/), an AI-powered receipt tracker for Australian taxpayers. Here's what I found:

### Before Measurement

- **Semantic duplicates:** 23 patterns repeated 87 times
- **Average import depth:** 5.8 levels
- **Average context budget:** 8,200 tokens per file
- **Cohesion score:** 0.42 (poor)
- **Monthly AI costs:** ~$380 (estimated)

### After Refactoring (4 weeks)

- **Semantic duplicates:** 3 patterns repeated 8 times (-87%)
- **Average import depth:** 2.9 levels (-50%)
- **Average context budget:** 2,100 tokens per file (-74%)
- **Cohesion score:** 0.89 (excellent)
- **Monthly AI costs:** ~$95 (estimated)

**Time invested:** 40 hours over 4 weeks
**Annual savings:** $3,420 in AI costs
**ROI:** 12.6 months (probably faster due to velocity gains)

But the real win wasn't the money.

**AI suggestions became useful.** Copilot started suggesting the right patterns. Code reviews got faster. New features shipped with fewer bugs. Onboarding new developers became easier.

Making my code visible to AI made it better for humans too.

## What You Can Do Today

You don't need to refactor everything. Start with measurement.

### Step 1: Measure Your Semantic Duplicates

```bash
npx @aiready/pattern-detect
```

Look for:

- Similarity scores > 70%
- Patterns repeated 3+ times
- Core domains (auth, validation, API handlers)

### Step 2: Measure Your Fragmentation

```bash
npx @aiready/context-analyzer
```

Look for:

- Import depth > 5 levels
- Context budget > 8,000 tokens
- Cohesion score < 0.50
- Files with fragmentation > 0.70

### Step 3: Pick ONE Domain to Fix

Don't refactor everything. Pick your most painful domain:

- The one where AI suggestions are worst
- The one where code reviews take longest
- The one where new developers get confused

Focus there. Consolidate files. Extract common patterns. Measure again.

### Step 4: Track Improvements

Run the tools weekly. Watch the metrics improve. Share results with your team.

**The goal isn't perfect code. It's visible code.**

Code that AI can understand. Code that humans can maintain. Code that doesn't waste tokens on fragmentation.

## Next in This Series

In Part 3, I'll dive deep into the technical details: **"Building AIReady: Metrics That Actually Matter"**

We'll explore:

- Why traditional metrics (cyclomatic complexity, code coverage) miss AI problems
- How Jaccard similarity works on AST tokens (with diagrams)
- The three dimensions of AI-readiness and how they interact
- Design decisions: Why I built a hub-and-spoke architecture
- Open source philosophy: Free forever, configurable by design

Until then, run the tools. Measure your codebase. See how invisible it really is.

---

**Have questions or want to share your AI code quality story?** Drop them in the comments. I read every one.

---

**Try it yourself:**

- GitHub: [github.com/getaiready/aiready-cli](https://github.com/getaiready/aiready-cli)
- Docs: [aiready.dev](https://aiready.dev)

**Want to support this work?**

- ⭐ Star the repo
- 🐛 Report issues you find
- 💬 Share your results (I read every comment)

---

_Peng Cao is building open source tools for AI-ready development. He's also the creator of ReceiptClaimer, an AI-powered receipt tracker for Australian taxpayers. Follow along as he builds in public._

**Read the series:**

- [Part 1: The AI Code Debt Tsunami is Here](link-to-part-1)
- **Part 2: Why Your Codebase is Invisible to AI** ← You are here
- Part 3: Building AIReady - Metrics That Actually Matter (coming Feb 7)
