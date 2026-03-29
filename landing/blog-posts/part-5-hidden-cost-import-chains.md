# The Hidden Cost of Import Chains

**Published:** February 15, 2026  
**Reading Time:** 16 min  
**Tags:** AI, Context Optimization, Dependencies, Architecture, Refactoring

---

You open a seemingly simple file in your codebase:

```typescript
// src/api/user-profile.ts (52 lines)
import { validateUser } from './validators';
import { formatResponse } from './formatters';
import { logRequest } from './logger';

export async function getUserProfile(userId: string) {
  validateUser(userId);
  const user = await fetchUser(userId);
  logRequest('getUserProfile', userId);
  return formatResponse(user);
}
```

Looks clean, right? Just 52 lines, three imports, straightforward logic. But when your AI assistant tries to understand this file, here's what actually gets loaded into its context window:

```
src/api/user-profile.ts           52 lines    1,245 tokens
  └─ validators.ts                 89 lines    2,134 tokens
       └─ validation-rules.ts      156 lines   3,721 tokens
       └─ error-types.ts            41 lines     982 tokens
  └─ formatters.ts                 103 lines   2,456 tokens
       └─ format-utils.ts           78 lines    1,867 tokens
  └─ logger.ts                      67 lines    1,603 tokens
       └─ log-transport.ts          124 lines   2,967 tokens
       └─ log-formatter.ts          91 lines    2,178 tokens

Total: 801 lines, 19,153 tokens
```

Your 52-line file just became a **19,153-token context load**. That's 366x more expensive than it appears. And your AI assistant has to load all of this to understand your simple function.

This is the **hidden cost of import chains**—and it's one of the biggest reasons AI struggles with your codebase.

## The Context Window Crisis

Every import creates a **cascading context cost**:

1. **Direct dependencies**: Files you import
2. **Transitive dependencies**: Files your imports import
3. **Type dependencies**: Interfaces and types needed for understanding
4. **Implementation depth**: How deep the chain goes

Modern AI models have context windows of 128K-1M tokens. Sounds like a lot, right? But in a real codebase:

- **Average file**: 200-300 lines = 4,800-7,200 tokens
- **With direct imports**: 800-1,200 lines = 19,200-28,800 tokens
- **With deep chains**: 2,000+ lines = 48,000+ tokens
- **Multiple related files**: Context exhaustion

Suddenly that 128K context window doesn't feel so spacious. Add a few related files to analyze a feature, and your AI is already hitting limits—or worse, truncating critical context.

## Real-World Impact: The receiptclaimer Analysis

When I ran `@aiready/context-analyzer` on [receiptclaimer](https://receiptclaimer.com)'s codebase, I discovered patterns that shocked me:

**Before Refactoring:**

```
Average context budget per file: 12,450 tokens
Maximum depth: 7 levels
Fragmented domains: 4 (User, Receipt, Auth, Payment)
Low cohesion files: 23 (43% of analyzed files)

Top offenders:
- src/api/receipt-processor.ts: 47,821 tokens (cascade depth: 7)
- src/services/user-service.ts: 38,945 tokens (cascade depth: 6)
- src/api/payment-handler.ts: 35,102 tokens (cascade depth: 6)
```

**After Refactoring:**

```
Average context budget per file: 4,780 tokens (-62%)
Maximum depth: 4 levels
Fragmented domains: 2 (consolidated User+Auth, Receipt+Payment)
Low cohesion files: 5 (9% of analyzed files)

Top files (now optimized):
- src/api/receipt-processor.ts: 8,234 tokens (depth: 3)
- src/services/user-service.ts: 6,891 tokens (depth: 3)
- src/api/payment-handler.ts: 7,445 tokens (depth: 4)
```

**Impact on AI Performance:**

- Response time: Avg 8.2s → 3.1s (62% faster)
- Context truncation errors: 34 → 2 (94% reduction)
- Suggestions quality: Subjectively much better, AI now references correct patterns
- Developer satisfaction: "AI finally gets what I'm trying to do"

## The Four Dimensions of Context Cost

`@aiready/context-analyzer` measures four key metrics:

### 1. Import Depth (Cascade Levels)

How many layers deep your dependencies go:

```typescript
// Depth 0: No imports
export function add(a: number, b: number) {
  return a + b;
}

// Depth 1: Direct imports only
import { add } from './math';
export function calculate(x: number) {
  return add(x, 10);
}

// Depth 3+: Deep chain (EXPENSIVE)
import { processUser } from './user-processor'; // imports 5 files
// └─ which imports './validators'             // imports 3 files
//     └─ which imports './validation-rules'   // imports 2 files
```

**Rule of thumb:**

- Depth 0-2: ✅ Excellent (< 5,000 tokens)
- Depth 3-4: ⚠️ Acceptable (5,000-15,000 tokens)
- Depth 5+: ❌ Expensive (15,000+ tokens)

### 2. Context Budget (Total Tokens)

The total number of tokens AI needs to understand your file:

```typescript
// Small budget (< 3,000 tokens)
// File: 120 lines, 1 import, shallow dependency
import { API_URL } from './config';
export function fetchUser(id: string) {
  return fetch(`${API_URL}/users/${id}`);
}

// Large budget (> 20,000 tokens)
// File: 200 lines, 8 imports, deep dependencies
import { validateInput } from './validators'; // +4,500 tokens
import { transformData } from './transformers'; // +6,200 tokens
import { enrichUser } from './enrichment'; // +8,100 tokens
import { formatResponse } from './formatters'; // +3,800 tokens
// ... more imports ...
```

**Target zones:**

- < 5,000 tokens: ✅ AI-friendly
- 5,000-15,000 tokens: ⚠️ Monitor
- 15,000+ tokens: ❌ Refactor needed

### 3. Domain Fragmentation

How scattered your related logic is across files:

```typescript
// FRAGMENTED (user logic in 8 files)
src/api/user-login.ts           // Authentication
src/api/user-profile.ts         // Profile management
src/services/user-validator.ts  // Validation
src/utils/user-formatter.ts     // Formatting
src/models/user-types.ts        // Types
src/db/user-repository.ts       // Data access
src/middleware/user-auth.ts     // Auth middleware
src/helpers/user-utils.ts       // Utilities

// CONSOLIDATED (user logic in 3 files)
src/domain/user/
  ├─ user.service.ts            // Core business logic
  ├─ user.repository.ts         // Data access
  └─ user.types.ts              // Types and interfaces
```

**Why fragmentation matters:**

When AI tries to understand user-related features, it must:

- Load 8 separate files (fragmented) vs 3 files (consolidated)
- Parse 3,200+ lines vs 800 lines
- Navigate 24+ imports vs 6 imports
- Build mental model across scattered context vs cohesive modules

### 4. Cohesion Score

How well a file focuses on one responsibility:

```typescript
// LOW COHESION (mixed concerns)
// user-service.ts
export class UserService {
  validateEmail() {
    /* validation logic */
  }
  sendEmail() {
    /* email sending logic */
  }
  formatUserName() {
    /* formatting logic */
  }
  logUserAction() {
    /* logging logic */
  }
  encryptPassword() {
    /* crypto logic */
  }
  renderUserProfile() {
    /* rendering logic */
  }
}

// HIGH COHESION (single responsibility)
// user-service.ts
export class UserService {
  createUser() {
    /* user creation */
  }
  updateUser() {
    /* user updates */
  }
  deleteUser() {
    /* user deletion */
  }
  getUserById() {
    /* user retrieval */
  }
}
```

**Cohesion calculation:**

The tool analyzes:

- Method names and their similarity
- Import types (business logic vs utilities vs external)
- File path and naming conventions
- Return types and parameter types

Scores:

- 80-100%: ✅ Highly cohesive (focused responsibility)
- 60-79%: ⚠️ Moderate cohesion (some mixing)
- < 60%: ❌ Low cohesion (refactor into separate modules)

## Technical Deep Dive: How Context-Analyzer Works

### Step 1: Build Dependency Graph

```typescript
// Pseudo-code of the analysis
function analyzeDependencies(entryFile: string) {
  const graph = new DependencyGraph();

  function traverse(file: string, depth: number = 0) {
    const ast = parseFile(file);
    const imports = extractImports(ast);

    for (const imp of imports) {
      const resolvedPath = resolveImport(imp, file);
      graph.addEdge(file, resolvedPath, depth + 1);

      if (depth < MAX_DEPTH) {
        traverse(resolvedPath, depth + 1);
      }
    }
  }

  traverse(entryFile);
  return graph;
}
```

### Step 2: Calculate Token Costs

```typescript
function calculateContextBudget(file: string, graph: DependencyGraph) {
  let totalTokens = 0;
  const visited = new Set();

  function countTokens(currentFile: string) {
    if (visited.has(currentFile)) return;
    visited.add(currentFile);

    const content = readFile(currentFile);
    const tokens = estimateTokens(content); // ~24 tokens per 100 chars
    totalTokens += tokens;

    // Recursively count dependencies
    for (const dep of graph.getDependencies(currentFile)) {
      countTokens(dep);
    }
  }

  countTokens(file);
  return totalTokens;
}
```

### Step 3: Detect Fragmentation

```typescript
function detectFragmentation(files: string[]) {
  const domains = new Map();

  for (const file of files) {
    const domain = extractDomain(file); // e.g., "user", "receipt"
    if (!domains.has(domain)) {
      domains.set(domain, []);
    }
    domains.get(domain).push(file);
  }

  // Flag domains split across many files
  return [...domains.entries()]
    .filter(([_, files]) => files.length > 5)
    .map(([domain, files]) => ({
      domain,
      fileCount: files.length,
      fragmentationScore: calculateFragmentation(files),
    }));
}
```

### Step 4: Measure Cohesion

```typescript
function analyzeCohesion(file: string) {
  const ast = parseFile(file);
  const exports = extractExports(ast);
  const imports = extractImports(ast);

  // Analyze semantic similarity of exports
  const similarities = [];
  for (let i = 0; i < exports.length - 1; i++) {
    for (let j = i + 1; j < exports.length; j++) {
      const sim = calculateSimilarity(exports[i], exports[j]);
      similarities.push(sim);
    }
  }

  // High average similarity = high cohesion
  const avgSimilarity =
    similarities.reduce((a, b) => a + b, 0) / similarities.length;

  // Penalty for mixed import types
  const importTypes = categorizeImports(imports);
  const mixedPenalty = Object.keys(importTypes).length > 3 ? 0.2 : 0;

  return Math.max(0, avgSimilarity - mixedPenalty);
}
```

## Example: Refactoring receiptclaimer's Receipt Processing

Let me show you a real refactoring that reduced context budget by 82%.

### Before: Deep Import Chain (47,821 tokens)

```typescript
// src/api/receipt-processor.ts
import { validateReceipt } from '../validators/receipt-validator';
import { parseReceiptImage } from '../services/ocr-service';
import { extractLineItems } from '../parsers/line-item-parser';
import { calculateTotals } from '../calculators/total-calculator';
import { enrichMerchantData } from '../enrichment/merchant-enricher';
import { formatReceiptResponse } from '../formatters/receipt-formatter';
import { logProcessing } from '../logging/process-logger';
import { notifyUser } from '../notifications/user-notifier';

export async function processReceipt(imageUrl: string, userId: string) {
  logProcessing('start', userId);

  const validation = validateReceipt(imageUrl);
  if (!validation.valid) throw new Error('Invalid receipt');

  const ocrResult = await parseReceiptImage(imageUrl);
  const lineItems = extractLineItems(ocrResult);
  const totals = calculateTotals(lineItems);
  const enriched = await enrichMerchantData(ocrResult.merchant, lineItems);

  await notifyUser(userId, 'Receipt processed');

  return formatReceiptResponse({ lineItems, totals, merchant: enriched });
}
```

**Dependency tree:**

```
receipt-processor.ts (180 lines, 4,302 tokens)
  ├─ receipt-validator.ts (94 lines, 2,247 tokens)
  │   ├─ validation-rules.ts (156 lines, 3,721 tokens)
  │   └─ error-types.ts (41 lines, 982 tokens)
  ├─ ocr-service.ts (203 lines, 4,847 tokens)
  │   ├─ image-preprocessor.ts (145 lines, 3,461 tokens)
  │   ├─ ocr-client.ts (89 lines, 2,125 tokens)
  │   └─ text-extractor.ts (178 lines, 4,249 tokens)
  ├─ line-item-parser.ts (167 lines, 3,987 tokens)
  ├─ total-calculator.ts (78 lines, 1,862 tokens)
  ├─ merchant-enricher.ts (134 lines, 3,201 tokens)
  │   └─ merchant-api-client.ts (98 lines, 2,340 tokens)
  ├─ receipt-formatter.ts (103 lines, 2,458 tokens)
  ├─ process-logger.ts (67 lines, 1,601 tokens)
  │   └─ log-transport.ts (124 lines, 2,967 tokens)
  └─ user-notifier.ts (89 lines, 2,125 tokens)
      └─ notification-service.ts (156 lines, 3,724 tokens)

Total: 1,902 lines, 47,821 tokens
Depth: 7 levels
```

### After: Consolidated Module (8,234 tokens)

```typescript
// src/domain/receipt/receipt.service.ts
import { ReceiptRepository } from './receipt.repository';
import { OCRProvider } from './ocr.provider';
import { ReceiptTypes } from './receipt.types';

export class ReceiptService {
  constructor(
    private repository: ReceiptRepository,
    private ocrProvider: OCRProvider
  ) {}

  async processReceipt(
    imageUrl: string,
    userId: string
  ): Promise<ReceiptTypes.ProcessedReceipt> {
    // Validation (inline, simple)
    if (!this.isValidImageUrl(imageUrl)) {
      throw new ReceiptTypes.ValidationError('Invalid image URL');
    }

    // OCR processing (delegated to focused provider)
    const ocrResult = await this.ocrProvider.parseImage(imageUrl);

    // Business logic (co-located)
    const receipt = this.buildReceipt(ocrResult);
    const lineItems = this.parseLineItems(ocrResult.text);
    const totals = this.calculateTotals(lineItems);

    // Enrichment (co-located)
    const merchant = await this.enrichMerchant(ocrResult.merchantName);

    // Persistence
    const saved = await this.repository.save({
      ...receipt,
      lineItems,
      totals,
      merchant,
      userId,
    });

    return saved;
  }

  private isValidImageUrl(url: string): boolean {
    return url.startsWith('http') && /\.(jpg|jpeg|png|pdf)$/i.test(url);
  }

  private parseLineItems(text: string): ReceiptTypes.LineItem[] {
    // Inline parsing logic (previously in separate file)
    // ~30 lines of focused parsing
  }

  private calculateTotals(items: ReceiptTypes.LineItem[]): ReceiptTypes.Totals {
    // Inline calculation (previously in separate file)
    // ~15 lines of calculation
  }

  private async enrichMerchant(name: string): Promise<ReceiptTypes.Merchant> {
    // Inline enrichment (previously in separate file + client)
    // ~20 lines of enrichment logic
  }

  private buildReceipt(ocrResult: OCRResult): Partial<ReceiptTypes.Receipt> {
    // Mapping logic
  }
}
```

**New dependency tree:**

```
receipt.service.ts (245 lines, 5,856 tokens)
  ├─ receipt.repository.ts (87 lines, 2,078 tokens)
  ├─ ocr.provider.ts (45 lines, 1,072 tokens) [thin wrapper]
  └─ receipt.types.ts (38 lines, 908 tokens)

Total: 415 lines, 8,234 tokens
Depth: 3 levels
Reduction: 47,821 → 8,234 tokens (82.8% decrease)
```

### What Changed?

**1. Consolidated scattered logic:**

- 8 separate files → 1 service file
- Related functions co-located
- Clear domain boundary

**2. Inlined simple utilities:**

- `validateReceipt`: 94 lines → 3 lines (simple inline check)
- `calculateTotals`: 78 lines → 15 lines (removed abstraction overhead)
- `parseLineItems`: 167 lines → 30 lines (removed generic parsers)

**3. Removed unnecessary abstractions:**

- Separate formatter → methods on service
- Separate logger → focused logging where needed
- Notification → moved to message queue trigger

**4. Created thin wrappers:**

- OCR client: Fat client (203 lines) → thin provider (45 lines)
- Repository: Focused data access only

## Migration Strategy: How to Refactor Without Breaking Everything

Refactoring deep import chains is scary. Here's how to do it safely:

### Step 1: Measure Current State

```bash
# Generate baseline report
npx @aiready/context-analyzer ./src --output baseline.json

# Identify top offenders
npx @aiready/context-analyzer ./src --sort-by budget --limit 10
```

### Step 2: Prioritize Refactoring

Focus on:

- **High-traffic files**: API handlers, services, core business logic
- **High-budget files**: > 15,000 tokens
- **Deep chains**: Depth > 5
- **Low cohesion**: Score < 60%

### Step 3: Create Domain Boundaries

```
Before (scattered):
src/
  ├─ api/
  ├─ services/
  ├─ utils/
  ├─ formatters/
  ├─ validators/
  └─ helpers/

After (domain-driven):
src/
  ├─ domain/
  │   ├─ user/
  │   │   ├─ user.service.ts
  │   │   ├─ user.repository.ts
  │   │   └─ user.types.ts
  │   ├─ receipt/
  │   └─ payment/
  └─ infrastructure/
      ├─ api/
      └─ database/
```

### Step 4: Refactor Incrementally

**Week 1:** Consolidate one domain (e.g., User)
**Week 2:** Consolidate another domain (e.g., Receipt)  
**Week 3:** Update imports across codebase
**Week 4:** Remove old files, update tests

### Step 5: Verify Improvements

```bash
# Generate new report
npx @aiready/context-analyzer ./src --output after.json

# Compare
npx @aiready/cli compare baseline.json after.json
```

## Best Practices

### ✅ Do:

1. **Co-locate related logic**: Keep domain logic together
2. **Inline simple utilities**: < 20 lines, used in one place
3. **Use dependency injection**: Makes testing easier, reduces coupling
4. **Create thin adapters**: For external services, databases
5. **Measure regularly**: Track context budget over time

### ❌ Don't:

1. **Over-abstract**: Not everything needs a separate file
2. **Create deep hierarchies**: Flat is better than nested
3. **Split prematurely**: Extract only when reused 3+ times
4. **Ignore cohesion**: Low cohesion = mixed concerns = high context cost
5. **Refactor blindly**: Understand dependencies before moving code

## Integration with CI/CD

### GitHub Actions: Context Budget Check

```yaml
name: Context Budget Check
on: [pull_request]

jobs:
  context-analysis:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3

      - name: Analyze context budget
        run: npx @aiready/context-analyzer ./src --threshold 15000

      - name: Check for regressions
        run: |
          npx @aiready/context-analyzer ./src --output current.json
          npx @aiready/cli compare baseline.json current.json --fail-on-regression
```

### Pre-commit Hook: Prevent Deep Chains

```bash
#!/bin/sh
# .git/hooks/pre-commit

echo "Checking import depth..."
npx @aiready/context-analyzer ./src --max-depth 4 --quiet

if [ $? -ne 0 ]; then
  echo "❌ Import chains too deep. Refactor before committing."
  exit 1
fi
```

## The Bottom Line

Import chains are **invisible expensive**. Every import adds context cost that:

- Slows down AI responses
- Increases token usage (costs money on paid APIs)
- Causes context truncation errors
- Makes AI suggestions less accurate

But unlike many optimization problems, this one has clear metrics and actionable fixes:

1. **Measure**: Run context-analyzer to see your current state
2. **Prioritize**: Focus on high-budget, deep-chain, low-cohesion files
3. **Refactor**: Consolidate domains, inline utilities, remove unnecessary abstractions
4. **Verify**: Measure again, track improvements over time

## Try It Yourself

```bash
# Analyze your codebase
npx @aiready/context-analyzer ./src

# Check specific file
npx @aiready/context-analyzer ./src/api/handler.ts --detailed

# Find files over budget
npx @aiready/context-analyzer ./src --threshold 15000

# Export report
npx @aiready/context-analyzer ./src --output report.json

# Unified CLI with all metrics
npx @aiready/cli scan --score
```

**Before you refactor:**

- Measure your current context budget
- Identify top offenders (top 10 files by token cost)
- Pick one domain to consolidate

**After you refactor:**

- Measure again
- Calculate percentage improvement
- Share your results!

**Resources:**

- GitHub: [github.com/getaiready/aiready-cli](https://github.com/getaiready/aiready-cli)
- Docs: [aiready.dev](https://aiready.dev)
- Report issues: [github.com/getaiready/aiready-cli/issues](https://github.com/getaiready/aiready-cli/issues)

---

**What's your biggest context budget file?** Run the analyzer and share your findings—I'd love to see what you discover.

---

_Peng Cao is the founder of [receiptclaimer](https://receiptclaimer.com) and creator of [aiready](https://github.com/getaiready/aiready-cli), an open-source suite for measuring and optimizing codebases for AI adoption._
