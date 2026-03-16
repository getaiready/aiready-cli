# AIReady Best Practices

**Version 0.2.2**  
AIReady  
February 2026

> **Note:**  
> This document is for AI agents and LLMs to follow when writing,  
> maintaining, or refactoring AI-friendly codebases.  
> Humans may find it useful, but guidance here is optimized for  
> AI-assisted workflows and automated consistency.

> [!NOTE] This document is automatically generated from individual rules in the
> `rules/` directory. Contributors should modify the source rules rather than
> this compiled file.

---

## Abstract

Guidelines for writing AI-friendly codebases that AI coding assistants can
understand and maintain effectively. Based on analysis of thousands of
repositories and common AI model failure patterns. Covers pattern detection, AI
signal clarity, context optimization, change amplification, agent grounding,
consistency checking, documentation, testability, and dependency management.

---

## Table of Contents

1. [Pattern Detection (patterns)](#1-pattern-detection-patterns) (CRITICAL)
   - 1.1
     [Avoid Semantic Duplicate Patterns](#11-avoid-semantic-duplicate-patterns)
   - 1.2 [Unify Fragmented Interfaces](#12-unify-fragmented-interfaces)
2. [Context Optimization (context)](#2-context-optimization-context) (HIGH)
   - 2.1 [Keep Import Chains Shallow](#21-keep-import-chains-shallow)
   - 2.2 [Maintain High Module Cohesion](#22-maintain-high-module-cohesion)
   - 2.3 [Split Large Files (>500 lines)](#23-split-large-files-500-lines)
3. [Consistency Checking (consistency)](#3-consistency-checking-consistency)
   (MEDIUM)
   - 3.1
     [Follow Consistent Naming Conventions](#31-follow-consistent-naming-conventions)
   - 3.2
     [Use Consistent Error Handling Patterns](#32-use-consistent-error-handling-patterns)
4. [AI Signal Clarity (signal)](#4-ai-signal-clarity-signal) (CRITICAL)
   - 4.1 [Avoid Boolean Trap Parameters](#41-avoid-boolean-trap-parameters)
   - 4.2 [Avoid High-Entropy Naming](#42-avoid-high-entropy-naming)
   - 4.3 [Avoid Magic Literals](#43-avoid-magic-literals)
   - 4.4 [Avoid Redundant Type Constants](#44-avoid-redundant-type-constants)
5. [Change Amplification (amplification)](#5-change-amplification-amplification)
   (HIGH)
   - 5.1
     [Avoid Change Amplification Hotspots](#51-avoid-change-amplification-hotspots)
6. [Agent Grounding (grounding)](#6-agent-grounding-grounding) (HIGH)
   - 6.1 [Define Clear Context Boundaries](#61-define-clear-context-boundaries)
   - 6.2 [Write Agent-Actionable READMEs](#62-write-agent-actionable-readmes)
7. [Testability (testability)](#7-testability-testability) (MEDIUM)
   - 7.1 [Maintain Verification Coverage](#71-maintain-verification-coverage)
   - 7.2 [Write Pure Functions](#72-write-pure-functions)
8. [Documentation (docs)](#8-documentation-docs) (MEDIUM)
   - 8.1
     [Keep Documentation in Sync with Code](#81-keep-documentation-in-sync-with-code)
9. [Codebase Health Assessment (assessment)](#9-codebase-health-assessment-assessment)
   (HIGH)
   - 9.1
     [Run Unified Codebase Health Scan](#91-run-unified-codebase-health-scan)

---

## 1. Pattern Detection (patterns)

**Impact: CRITICAL**

Identifies semantic duplicate patterns and naming inconsistencies that waste AI
context window tokens and confuse pattern recognition. Consolidating duplicates
can save 30-70% of context usage.

---

### 1.1 Avoid Semantic Duplicate Patterns

**Impact: CRITICAL (30-70% context window waste)**

_Tags: patterns, duplicates, context-window, semantic-similarity_

Multiple functions or components that perform the same task with different names
(`fetchUser`, `getUserData`, `loadUserInfo`) waste AI context tokens and confuse
pattern recognition. AI cannot determine the canonical pattern and will often
create new, redundant variations.

### Core Principles

- **Canonical Implementation:** Establish a single "source of truth" for every
  business operation.
- **Pattern Reuse over Recreation:** Proactively search for existing
  implementations before creating new ones.
- **Unified Naming:** Use consistent verbs for similar operations (e.g., always
  use `get` for retrieval, `update` for mutation).

### Guidelines

- **Incorrect:** Three different versions of an API fetcher scattered across the
  codebase.
- **Correct:** A single module (e.g., `users.ts`) containing the canonical
  `getUser` function.
- **Measurement:** AI recognizes and consistently reuses the existing pattern
  rather than hallucinating new ones.

**Detection tip:** Run `npx @aiready/pattern-detect` to identify semantic
duplicates and consolidate them.

Reference: [https://getaiready.dev/docs](https://getaiready.dev/docs)

### 1.2 Unify Fragmented Interfaces

**Impact: CRITICAL (40-80% reduction in AI confusion, prevents wrong type
usage)**

_Tags: patterns, interfaces, types, consistency_

Multiple similar interfaces for the same concept (`User`, `UserData`,
`UserInfo`) confuse AI agents, leading to incorrect property access and mixed
type usage. This is a primary driver of subtle type errors in AI-generated code.

### Core Principles

- **Single Domain Representative:** Define one canonical interface per concept
  and use it across the service.
- **Extensional Specialization:** Use `extends` to create specialized DTOs or
  API shapes from the base domain entity.
- **Composition over Duplication:** Compose complex types from stable primitives
  rather than redefining them in each module.

### Guidelines

- **Incorrect:** Having 5 slightly different versions of the `User` object
  across API, DB, and UI layers.
- **Correct (Extends):** `interface UserDTO extends User { createdAt: Date }`.
- **Measurement:** High unification means a single change to a domain entity
  correctly propagates through its specialized variations.

**Benefits:** Reduces type-related bugs by 40-80% by providing clear "source of
truth" grounding for the AI agent.

Reference:
[https://refactoring.guru/extract-interface](https://refactoring.guru/extract-interface)

---

## 2. Context Optimization (context)

**Impact: HIGH**

Optimizes code organization for AI context windows. Addresses import depth, file
cohesion, and dependency fragmentation that break AI understanding and lead to
incomplete or incorrect suggestions.

---

### 2.1 Keep Import Chains Shallow

**Impact: HIGH (10-30% reduction in context depth)**

_Tags: context, imports, dependency-depth, circular-imports_

Deep import chains force AI models to load many intermediate files to trace
logic, quickly exceeding context window limits. When AI must trace through 5+
levels of imports, it often loses the original goal's context and provides
incomplete or hallucinated suggestions.

### Core Principles

- **Flatten Dependency Trees:** Use barrel exports (`index.ts`) and clear module
  boundaries to reduce the level of transitives.
- **Prefer Direct Imports:** In deep architectures, use path aliases (e.g.,
  `@/lib/utils`) to keep import paths shallow and predictable.
- **Co-locate Related Logic:** Reduce the need for deep cross-module imports by
  keeping tightly coupled logic in the same or adjacent directories.

### Guidelines

- **Level 1 (Direct):** Ideal. AI understands the dependency immediately.
- **Level 2-3 (Transitive):** Acceptable. Manageable for most modern models.
- **Level 4+ (Deep):** Problematic. Triggers "context fatigue" and increases
  error rates.
- **Best Practice:** Use barrel exports to flatten paths:
  `import { x } from '@/lib'` instead of
  `import { x } from '../../lib/a/b/c/x'`.

**Detection tip:** Run `npx @aiready/context-analyzer --max-depth 3` to identify
deep or circular import chains.

Reference: [https://getaiready.dev/docs](https://getaiready.dev/docs)

### 2.2 Maintain High Module Cohesion

**Impact: HIGH (25-40% reduction in context pollution, improves AI file
selection)**

_Tags: context, cohesion, organization, modules_

Low cohesion forces AI to process unrelated code when focusing on a specific
feature. When "util" files bundle authentication, formatting, and validation, AI
must load the entire file, wasting its context budget and increasing the risk of
hallucination.

### Core Principles

- **Single Responsibility Files:** Each file should focus on a single domain or
  functional area (e.g., `auth/password.ts` vs a generic `utils.ts`).
- **Feature-Based Grouping:** Group code by what it _does_ for the user, not its
  technical type (e.g., `domain/user/` vs `services/`).
- **Minimize "Junk Drawer" Utils:** Move generic utilities into specific, named
  sub-modules once they exceed 2-3 related functions.

### Guidelines

- **Incorrect:** A 500-line `utils.ts` containing everything from date
  formatting to database connection logic.
- **Correct:** Modular structure like `auth/token.ts`, `validation/email.ts`,
  and `utils/date.ts`.
- **Measurement:** High cohesion means all functions in a file share the same
  data types or serve the same business feature.

**Benefits for AI:** Reduces context waste by 25-40% and ensures the agent loads
only the minimal relevant code for a task.

Reference:
[https://en.wikipedia.org/wiki/Cohesion\_(computer_science)](<https://en.wikipedia.org/wiki/Cohesion_(computer_science)>)

### 2.3 Split Large Files (>500 lines)

**Impact: HIGH (30-50% reduction in context window usage)**

_Tags: context, file-size, refactoring, modules_

Files exceeding 500 lines often force AI models to process unnecessary code,
wasting 90%+ of their context budget for a single operation. This leads to
incomplete reasoning and inaccurate suggestions as the model's focus is diluted.

### Core Principles

- **Context Optimization:** Keep source files small so they fit entirely within
  an AI's highly-attentive context window.
- **Responsibility-Based Splitting:** Move distinct feature sets into separate
  files (e.g., `ProfileService` should not live with `AuthService`).
- **Incremental Extraction:** Proactively split files once they cross the
  500-line threshold to maintain modularity.

### Guidelines

- **Ideal (< 200 lines):** Fits easily in a single context window with high
  precision.
- **Acceptable (200-500 lines):** Manageable if cohesion is very high.
- **Problematic (> 500 lines):** Should be split to avoid context pollution.
- **Critical (> 1000 lines):** Always split; too large for effective AI
  assistance and often indicates architectural "god objects".

**Workflow:** When a file grows too large, extract logical classes or function
groups into separate files in a feature-specific directory. Use `index.ts` to
maintain a clean public API.

Reference:
[https://refactoring.guru/extract-class](https://refactoring.guru/extract-class)

---

## 3. Consistency Checking (consistency)

**Impact: MEDIUM**

Ensures naming conventions, error handling patterns, and API designs are
consistent across the codebase. Inconsistencies confuse AI models and lead to
incorrect pattern replication.

---

### 3.1 Follow Consistent Naming Conventions

**Impact: MEDIUM (5-15% improvement in AI pattern recognition)**

_Tags: consistency, naming, conventions, readability_

Inconsistent naming conventions confuse AI models about code intent and
relationships. When similar concepts use different naming patterns, AI cannot
reliably predict the correct pattern for new code, leading to fragmented and
hard-to-maintain suggestions.

### Core Principles

- **Standardize Casing:** Establish and strictly follow casing rules for all
  identifier types (e.g., `camelCase` for functions, `PascalCase` for types).
- **Uniform File Naming:** Use a consistent file naming scheme (e.g.,
  `kebab-case.ts`) to help AI navigate the file system predictably.
- **Predictable Prefixing:** Use consistent prefixes for specific roles (e.g.,
  `_` for internal/private, `I` or `T` if required by project standards).

### Guidelines

- **Incorrect:** Mixing `getUserData()` with `fetch_user_profile()` and
  `GetUserSettings()` in the same layer.
- **Correct:** Consistent `camelCase` for all functions: `getUserData()`,
  `getUserProfile()`, `getUserSettings()`.
- **Correct (Files):** Standardizing on `kebab-case.ts` (e.g.,
  `user-service.ts`, `auth-repository.ts`).

**Detection tip:** Run `npx @aiready/consistency` to identify naming pattern
violations across your codebase.

Reference: [https://getaiready.dev/docs](https://getaiready.dev/docs)

### 3.2 Use Consistent Error Handling Patterns

**Impact: MEDIUM (15-25% improvement in AI error handling suggestions)**

_Tags: consistency, errors, patterns, exceptions_

Mixed error patterns (e.g., mixing `throw`, `Result` objects, and `null`
returns) prevent AI models from predicting the correct handling strategy. This
leads to inconsistent implementations where errors are partially caught or
completely ignored.

### Core Principles

- **Unified Error Strategy:** Choose one primary pattern (Result Objects vs.
  Exceptions) and use it across the entire codebase.
- **Explicit Failure States:** Favor `Result` types for business logic failures
  to force the AI agent to handle the error case explicitly.
- **Avoid Semantic Nulls:** Don't return `null` or `undefined` to indicate
  failure; use typed errors or Result objects for clarity.

### Guidelines

- **Incorrect:** Mixing `throw new Error()` in one file with `return null` in
  another for the same semantic operation (e.g., "User not found").
- **Correct (Result Pattern):**
  `async function getUser(id): Result<User, Error>` — Explicit success/failure
  branches.
- **Correct (Exceptions):** Dedicated `AppError` class used consistently with
  `try-catch` blocks.

**Benefits:** Ensures the AI agent consistently suggests and implements the
project's chosen error pattern, reducing unhandled exceptions by 15-25%.

Reference:
[https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates](https://www.typescriptlang.org/docs/handbook/2/narrowing.html#using-type-predicates)

---

## 4. AI Signal Clarity (signal)

**Impact: CRITICAL**

Maximizes the semantic "signal" code provides to AI models. Eliminates ambiguous
booleans, magic literals, and high-entropy naming that cause models to
hallucinate or misinterpret logic.

---

### 4.1 Avoid Boolean Trap Parameters

**Impact: CRITICAL (High confusion potential - AI flips boolean intent
incorrectly)**

_Tags: signal, boolean, parameters, ambiguity, ai-signal_

Boolean parameters with unclear meaning cause AI assistants to incorrectly
interpret or invert logic. Multi-boolean patterns are especially problematic as
AI cannot reliably predict which combination produces which result.

### Core Principles

- **Prefer Objects over Positional Booleans:** Use named properties in an
  options object to provide explicit context for each flag.
- **Use Enums for State:** For mutually exclusive states, use enums instead of
  multiple boolean flags.
- **Self-Documenting Intent:** Ensure the parameter name clearly indicates what
  `true` vs `false` means (e.g., `includeDeleted` is better than `statusCheck`).

### Guidelines

- **Incorrect:** `fetchUsers(true, false)` — The meaning of these flags is
  hidden and highly prone to AI hallucination or inversion.
- **Correct:** `fetchUsers({ includeInactive: true, includeDeleted: false })` —
  Explicit naming provides "grounding" for the AI model.
- **Correct (Enum):** `fetchUsers(UserFilter.ActiveOnly)` — Limits the
  possibility space to valid, named states.

**Detection tip:** Run `npx @aiready/ai-signal-clarity` to automatically
identify boolean trap patterns.

Reference: [https://getaiready.dev/docs](https://getaiready.dev/docs)

### 4.2 Avoid High-Entropy Naming

**Impact: CRITICAL (Names with multiple interpretations confuse AI models)**

_Tags: signal, naming, entropy, ambiguity, clarity_

High-entropy names—generic identifiers like `data`, `info`, or `handle`—lack
distinct semantic meaning. AI models often misinterpret these names or
"hallucinate" their contents based on generic training data rather than the
actual local context, leading to subtle logic errors.

### Core Principles

- **Specific over Generic:** Replace "junk" words with the specific entity or
  action (e.g., `userRecord` instead of `data`).
- **Domain-Grounded Verbs:** Use clear actions from the business domain (e.g.,
  `calculateTaxes`, `verifyEmail`) instead of generic wrappers.
- **Self-Documenting Data Flow:** Variable names should describe the state of
  the data as it moves through a pipe (e.g., `rawInput` -> `normalizedResults`).

### Guidelines

- **Incorrect:** `const data = fetchData()` followed by
  `const processed = process(data)`.
- **Correct:** `const userRecords = fetchUserRecords()` followed by
  `const activeUsers = filterActiveUsers(userRecords)`.
- **Measurement:** High clarity means a model can predict the type and structure
  of a variable from its name alone.

**Detection tip:** Run `npx @aiready/ai-signal-clarity` to automatically
identify clusters of high-entropy names.

Reference: [https://getaiready.dev/docs](https://getaiready.dev/docs)

### 4.3 Avoid Magic Literals

**Impact: CRITICAL (Unnamed constants confuse AI about business rules)**

_Tags: signal, magic, literals, constants, clarity_

Magic literals—unnamed constants used directly in logic—prevent AI from
understanding the "why" behind business rules. When AI sees `if (status === 2)`,
it lacks the semantic grounding to suggest valid alternatives or explain the
intent of the check.

### Core Principles

- **Named Constants for Rules:** Every number or string with specific domain
  meaning must be held in a named constant or enum.
- **Grouped Domain Values:** Use Enums or Namespaces to group related constants
  (e.g., `UserStatus`, `ApiStatus`).
- **Centralized Configuration:** Move environment-specific or configurable
  literals into a central config object.

### Guidelines

- **Incorrect:** `if (user.status === 2)` — Unclear what "2" represents.
- **Correct:** `if (user.status === UserStatus.Active)` — Explicitly states the
  intent.
- **Incorrect:** Calculation with unnamed coefficients (e.g.,
  `amount * 0.15 + 100`).
- **Correct:** `amount * TAX_RATE + BASE_FEE` — Provides clear semantic labels
  for the model.

**Detection tip:** Run `npx @aiready/ai-signal-clarity` to identify magic
literal clusters that need extraction.

Reference: [https://getaiready.dev/docs](https://getaiready.dev/docs)

### 4.4 Avoid Redundant Type Constants

**Impact: MEDIUM (Boilerplate constants for primitive types add noise and reduce
semantic transparency)**

_Tags: signal, clean-code, typescript, json-schema_

Defining local constants like `const TYPE_STRING = 'string'` or
`const TYPE_OBJECT = 'object'` for JSON Schema types is redundant in modern
TypeScript codebases. These constants add an indirection layer that requires a
lookup without providing functional benefit, as these are already primitive
types.

### Core Principles

- **Direct Literals:** Use 'string', 'object', 'array', etc. directly in schemas
  for transparency.
- **TypeScript Union Types:** Use TypeScript's native type system (e.g.,
  `type: 'string' | 'object' | 'array'`) for IDE autocompletion and safety.
- **Centralized Types:** If constants are required for system-wide refactors,
  they should be in a central `types.ts` rather than redefined per file.

### Guidelines

- **Incorrect:**

```typescript
const TYPE_STRING = 'string';
const TYPE_OBJECT = 'object';

const schema = {
  type: TYPE_OBJECT,
  properties: {
    name: { type: TYPE_STRING },
  },
};
```

- **Correct:**

```typescript
const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
};
```

**Advice for developer:** Favor "AI-native" code where transparency is key.
Models and humans working with JSON Schema expect literals. indirection layers
like local constants for primitives should be removed.

**Incorrect:**

```typescript
const TYPE_STRING = 'string';
const TYPE_OBJECT = 'object';

const schema = {
  type: TYPE_OBJECT,
  properties: {
    name: { type: TYPE_STRING },
  },
};
```

**Correct:**

```typescript
const schema = {
  type: 'object',
  properties: {
    name: { type: 'string' },
  },
};
```

Reference: [https://getaiready.dev/docs](https://getaiready.dev/docs)

---

## 5. Change Amplification (amplification)

**Impact: HIGH**

Identifies "hotspots" where a single code change triggers a cascade of
breakages. Reducing amplification ensures AI edits stay within context window
limits and don't overwhelm the agent's reasoning.

---

### 5.1 Avoid Change Amplification Hotspots

**Impact: HIGH (High fan-in/fan-out files cause "edit explosion" for AI
agents)**

_Tags: amplification, coupling, fan-in, fan-out, hotspots, graph-metrics_

Change amplification hotspots are files with extreme dependency counts (high
fan-in/fan-out). When an AI modifies these files, it often triggers a cascade of
breakages that exceeds the agent's context window or reasoning capacity, leading
to failed edits and regression loops.

### Core Principles

- **Interface Segregation:** Use specific interfaces to hide implementation
  details from high fan-in modules, limiting the impact of internal changes.
- **Bounded Contexts:** Group related code into modules that AI can reason about
  independently without loading the entire project.
- **Modular Configuration:** Avoid massive central config objects; split
  configuration into feature-specific modules to localize edits.

### Guidelines

- **Avoid Generic "God Files":** `utils/index.ts` files that export 50+
  unrelated functions create high fan-out and confuse agent focus.
- **Minimize Global Coupling:** Changes to a base entity (e.g., `BaseEntity`)
  that force updates in 100+ files are dangerous for automated agents.
- **Rationale:** Reducing the number of "affected files" per edit allows agents
  to operate with higher precision and shorter feedback loops.

**Refactoring tip:** Extract domain boundaries (e.g., `user/`, `order/`) so the
AI only needs to load modules relevant to the current business feature.

Reference: [https://getaiready.dev/docs](https://getaiready.dev/docs)

---

## 6. Agent Grounding (grounding)

**Impact: HIGH**

Provides the architectural and domain context necessary for AI agents to reason
effectively. High-quality READMEs and clear domain boundaries ensure the agent
is "grounded" in the correct project semantics.

---

### 6.1 Define Clear Context Boundaries

**Impact: HIGH (Ambiguous boundaries prevent AI from understanding domain
contexts)**

_Tags: grounding, boundaries, domains, context, architecture_

Amorphous domain boundaries confuse AI about which rules apply to a given task.
Mixing multiple domains in a single file or directory prevents effectively
grounding the agent in the correct business context.

### Core Principles

- **Directory-as-Domain:** Use a directory structure that mirrors business
  domains (e.g., `domain/order/` vs `domain/user/`).
- **Explicit Public Contracts:** Use `index.ts` (barrel exports) to define
  exactly what a domain exposes to the rest of the system.
- **Avoid Semantic Overlap:** Don't mix authentication utilities with business
  logic or infrastructure concerns in the same module.

### Guidelines

- **Incorrect:** `src/utils/mixed.ts` containing `calculateOrderTotal` and
  `validateProductSku`.
- **Correct:** Domain-driven directories with internal `entities/` and
  `services/`, and an `index.ts` defining the public API.
- **Rationale:** Clear boundaries allow the agent to load _only_ order-relevant
  code when performing order-related tasks.

**Detection tip:** Run `npx @aiready/agent-grounding` to analyze context
boundaries and directory semantics.

Reference: [https://getaiready.dev/docs](https://getaiready.dev/docs)

### 6.2 Write Agent-Actionable READMEs

**Impact: HIGH (Poor README quality reduces AI's understanding of project
context)**

_Tags: grounding, readme, documentation, context, agents_

READMEs are the primary entry point for AI agents. A poor README forces an agent
to scan every file in the repository to infer architecture and intent, often
leading to incorrect mental models and high token costs.

### Core Principles

- **Purpose & Domain First:** Explicitly state the problem space (e.g., "Order
  Processing Service") at the top.
- **Architectural Grounding:** Provide a high-level overview of how data flows
  and which modules own which responsibilities.
- **Verification Manifest:** List the exact commands needed to verify changes
  (e.g., `npm test`).

### Guidelines

- **Avoid Minimalist READMEs:** Titles and installation steps only are
  insufficient for AI architectural reasoning.
- **Include Domain Glossary:** Define core terms (e.g., "Fulfillment",
  "Sourcing") to ensure the agent uses correct domain language.
- **Table of Services:** Provide a quick-reference table of key modules and
  their responsibilities.

**Key AI Elements:** Domain statement, architecture overview, concept glossary,
service map, and verification commands.

**Detection tip:** Run `npx @aiready/agent-grounding` to analyze README quality
and directory semantics.

Reference: [https://getaiready.dev/docs](https://getaiready.dev/docs)

---

## 7. Testability (testability)

**Impact: MEDIUM**

Ensures code is designed for automated verification by AI agents. Pure functions
and clear verification coverage allow agents to confidently prove their changes
work without expensive trial-and-error loops.

---

### 7.1 Maintain Verification Coverage

**Impact: MEDIUM (Low test coverage prevents AI from confirming its changes
work)**

_Tags: testability, verification, coverage, testing, ai-agent_

Verification coverage measures how effectively AI can confirm its changes work.
Low test coverage forces AI into trial-and-error loops, guessing at correctness
rather than proving it through results. This significantly increases the risk of
regressions in AI-maintained codebases.

### Core Principles

- **Testable Interface Design:** Ensure functions have clear inputs/outputs that
  can be easily asserted in a test runner.
- **Assertion-Rich Tests:** Avoid "smoke tests" that only check if code runs;
  use specific assertions that prove the business logic is correct.
- **Fast Feedback Loops:** Keep unit tests highly performant so AI can run them
  after every major code block edit.

### Guidelines

- **Incorrect:** Functions without matching test files or tests that lack
  meaningful assertions (`expect(true).toBe(true)`).
- **Correct:** A dedicated `__tests__/` directory co-located with features,
  containing specific unit and integration tests.
- **Measurement:** High coverage means an agent can modify a function and
  immediately know if they've broken its core logic or edge cases.

**AI Strategy:** Agents should proactively search for or create tests before
refactoring complex modules to ensure they have a "safety net".

Reference: [https://getaiready.dev/docs](https://getaiready.dev/docs)

### 7.2 Write Pure Functions

**Impact: MEDIUM (Global state and side effects prevent AI from writing tests)**

_Tags: testability, purity, side-effects, global-state, dependency-injection_

Impure functions (those relying on global state, side effects, or I/O) are
difficult for AI agents to verify in isolation. When agents cannot easily prove
their changes work through simple unit tests, they enter expensive
"fix-test-fail" loops.

### Core Principles

- **Explicit Dependencies:** Pass ALL required data as parameters rather than
  reaching for global state or hidden singletons.
- **Deterministic Outcomes:** For any given input, the function should always
  produce the same output and no observable side effects.
- **Dependency Injection:** Inject external services (DB, API) through
  interfaces so they can be easily mocked during AI-led verification.

### Guidelines

- **Incorrect:** Functions accessing `currentUser` globals or updating shared
  state directly.
- **Correct (Pure):** `processOrder(order, user, config) => Result` — Everything
  is explicit and local.
- **Testing Benefit:** Pure functions allow AI to write fast, independent tests
  that provide immediate feedback on code correctness.

**Detection tip:** Run `npx @aiready/testability` to identify impure patterns
that trigger AI verification retries.

Reference: [https://getaiready.dev/docs](https://getaiready.dev/docs)

---

## 8. Documentation (docs)

**Impact: MEDIUM**

Keeps documentation synchronized with code changes. Outdated documentation
misleads AI models, causing them to suggest deprecated patterns or incorrect
implementations.

---

### 8.1 Keep Documentation in Sync with Code

**Impact: MEDIUM (20-30% reduction in AI suggestion errors from stale docs)**

_Tags: documentation, maintenance, comments, sync_

Outdated documentation misleads AI models. When function signatures or business
logic change without matching updates to JSDoc/comments, AI suggests code based
on stale information, causing type errors and logic bugs.

### Core Principles

- **Single Truth Source:** Update documentation in the same commit/change-block
  as the code it describes.
- **Type-Aware Docs:** Use JSDoc or TSDoc that can be validated against the
  code's types.
- **Minimal, High-Signal Comments:** Favor self-documenting code; use comments
  only for complex logic, business rationale, or non-obvious side effects.

### Guidelines

- **Incorrect:** JSDoc describing a parameter `email` when the function
  signature now uses `userId`.
- **Correct:** Accurate `@param` and `@returns` tags that match the current
  TypeScript signature.
- **Correct:** Using `@deprecated` to warn agents about obsolete paths and
  provide a clear `@see` alternative.

**Workflow Tip:** Remove "TODO" comments older than 30 days—they create noise
and confusion for AI agents trying to prioritize work.

Reference: [https://jsdoc.app/](https://jsdoc.app/)

---

## 9. Codebase Health Assessment (assessment)

**Impact: HIGH**

Provides agents with a unified methodology for measuring codebase health and
"AI-readiness". Regular scans identify critical technical debt and context
fragmentation that can lead to agent failure.

---

### 9.1 Run Unified Codebase Health Scan

**Impact: HIGH (Predicts and prevents AI agent failures)**

_Tags: assessment, health, scan, ai-readiness, unified_

AI agents should assess codebase health before starting complex tasks or after
major refactors. The `aiready scan` command builds a "ground truth" map of
technical debt that might interfere with an agent's reasoning.

### Core Principles

- **Scan on Onboarding:** Run a full scan before making changes to any
  unfamiliar modules.
- **Pre-Flight Scans:** Perform a scan before starting high-complexity features
  to identify potential "context explosions" early.
- **Post-Verification Scans:** Validate that refactors actually improved health
  metrics (reduced entropy, flattened depth).

### Guidelines

- **Recommended Tool:** Use `npx @aiready/cli scan .` to ensure the latest rules
  are applied without global installation overhead.
- **Interpretation:** High similarity (Patterns) or deep chains (Context) are
  primary indicators that the agent's task may fail due to context window
  limits.

**Detection tip:** Proactively run a scan if you find yourself loading more than
5 files to understand a single function.

Reference: [https://getaiready.dev/docs](https://getaiready.dev/docs)

---

## References

1. [https://getaiready.dev](https://getaiready.dev)
2. [https://getaiready.dev/docs](https://getaiready.dev/docs)
