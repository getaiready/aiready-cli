import {
  ChartIcon,
  TargetIcon,
  RobotIcon,
  ShieldIcon,
  TrendingUpIcon,
  FileIcon,
} from '@/components/Icons';

export const metrics = [
  {
    id: 'semantic-duplicates',
    name: 'Semantic Duplicates',
    description:
      'Detects logic that is repeated but written in different ways.',
    why: 'Traditional linters miss logic duplication. AI models get confused when the same logic exists in multiple places, often updating only one.',
    how: 'Uses Jaccard similarity on AST (Abstract Syntax Tree) tokens to identify structurally identical logic, ignoring variable name or formatting changes.',
    thresholds: [
      {
        score: '90+',
        label: 'Excellent',
        detail: '< 1% duplication across domain logic.',
      },
      {
        score: '70-89',
        label: 'Good',
        detail: 'Minor duplication in boilerplate or utilities.',
      },
      {
        score: '< 50',
        label: 'Critical',
        detail: 'Core business logic repeated in multiple places.',
      },
    ],
    playbook: [
      'Identify "Hidden Singletons" - logic that should be a shared service.',
      'Use Higher-Order Functions to parameterize slight variations in logic.',
      'Consolidate duplicated API handlers into a unified resource controller.',
    ],
    examples: {
      bad: `// File A
function validate(u) {
  return u.id && u.email.includes('@');
}

// File B
const isValid = (user) => {
  return user.id && user.email.indexOf('@') !== -1;
}`,
      good: `// shared/validators.ts
export const isUserValid = (user: User) => {
  return !!(user.id && user.email.includes('@'));
};`,
    },
    icon: <ChartIcon className="w-6 h-6 text-indigo-400" />,
  },
  {
    id: 'context-fragmentation',
    name: 'Context Fragmentation',
    description: 'Analyzes how scattered related logic is across the codebase.',
    why: 'AI has a limited context window. If related logic is scattered across too many files, the AI cannot see the whole picture at once.',
    how: 'Calculates the "Token Distance" between a file and its dependencies by recursively traversing the import graph and measuring domain boundary crossings.',
    thresholds: [
      {
        score: '90+',
        label: 'Cohesive',
        detail: 'Related logic is contained within 1-3 files.',
      },
      {
        score: '60-80',
        label: 'Moderate',
        detail: 'Logic is spread across multiple folders.',
      },
      {
        score: '< 40',
        label: 'Fragmented',
        detail: 'Requires 15+ files to understand a single feature.',
      },
    ],
    playbook: [
      'Adopt a "Feature-First" folder structure instead of "Layer-First".',
      'Consolidate fragmented utility functions into a single domain service.',
      'Reduce deep import chains by flattening the module hierarchy.',
    ],
    examples: {
      bad: `// Fragmented across 3 folders
import { UserType } from '../../types/user';
import { saveUser } from '../../api/user';
import { validateUser } from '../../utils/validation';`,
      good: `// Cohesive feature module
import { UserType, saveUser, validateUser } from '../features/user';`,
    },
    icon: <TargetIcon className="w-6 h-6 text-purple-400" />,
  },
  {
    id: 'naming-consistency',
    name: 'Naming Consistency',
    description:
      'Measures how consistently variables, functions, and classes are named.',
    why: 'AI predicts code based on patterns. Inconsistent naming (e.g., mixing getUser and fetchAccount) breaks these patterns.',
    how: 'Uses token entropy and lexical pattern matching to detect naming drift across similar domain entities and architectural layers.',
    thresholds: [
      {
        score: '95+',
        label: 'Perfect',
        detail: 'Unified naming convention across the entire project.',
      },
      {
        score: '75-90',
        label: 'Good',
        detail: 'Occasional drift in non-critical modules.',
      },
      {
        score: '< 60',
        label: 'Inconsistent',
        detail:
          'Multiple competing conventions (e.g. CamelCase vs snake_case).',
      },
    ],
    playbook: [
      'Define a "Ubiquitous Language" for your domain entities.',
      'Enforce strict suffixing for specific layers (e.g., *Controller, *Service).',
      'Use automated linting to catch casing and prefix inconsistencies early.',
    ],
    examples: {
      bad: `function getUser() { ... }
function fetchAccount() { ... }
function retrieveProfile() { ... }`,
      good: `function getUser() { ... }
function getAccount() { ... }
function getProfile() { ... }`,
    },
    icon: <RobotIcon className="w-6 h-6 text-cyan-400" />,
  },
  {
    id: 'dependency-health',
    name: 'Dependency Health',
    description:
      'Measures the stability, security, and freshness of your project dependencies.',
    why: 'AI often suggests outdated or insecure packages if your project is stuck on old versions.',
    how: 'Cross-references your dependency graph with CVE databases and ecosystem staleness metrics to identify risk and maintenance debt.',
    thresholds: [
      {
        score: '90+',
        label: 'Healthy',
        detail: 'All major deps are within 1 minor version of latest.',
      },
      {
        score: '60-80',
        label: 'Stable',
        detail: 'Some staleness but no critical vulnerabilities.',
      },
      {
        score: '< 40',
        label: 'Degraded',
        detail: 'Multiple deprecated packages or security risks.',
      },
    ],
    playbook: [
      'Automate dependency updates using tools like Renovate or Dependabot.',
      'Prune "Micro-Dependencies" that can be replaced with native logic.',
      'Resolve circular dependencies that break AI-generated refactoring plans.',
    ],
    examples: {
      bad: `"dependencies": {
  "moment": "^2.24.0", // Deprecated
  "lodash": "^3.0.0"   // 10 years old
}`,
      good: `"dependencies": {
  "date-fns": "^4.0.0",
  "zod": "^3.23.0"
}`,
    },
    icon: <ShieldIcon className="w-6 h-6 text-emerald-400" />,
  },
  {
    id: 'change-amplification',
    name: 'Change Amplification',
    description:
      'Tracks how many places need to change when a single requirement evolves.',
    why: 'AI struggles with high coupling. If one change requires 10 files to be updated, the AI is more likely to miss one.',
    how: 'Measures "Coupling Density" by analyzing co-change frequency and shared constant usage across module boundaries.',
    thresholds: [
      {
        score: '90+',
        label: 'Decoupled',
        detail: 'Changes are localized to a single module.',
      },
      {
        score: '60-80',
        label: 'Coupled',
        detail: 'Single change ripples across 3-5 files.',
      },
      {
        score: '< 40',
        label: 'Rigid',
        detail: 'Requirement changes force widespread rewrites.',
      },
    ],
    playbook: [
      'Extract hardcoded constants into a centralized configuration.',
      'Use the "Observer" or "Pub/Sub" pattern to decouple unrelated modules.',
      'Implement clear interfaces between layers to prevent ripple effects.',
    ],
    examples: {
      bad: `// Hardcoded API URL in 10 files
const API = 'https://api.v1.old.com';`,
      good: `// Centralized configuration
import { config } from '@/config';
const API = config.api.baseUrl;`,
    },
    icon: <TrendingUpIcon className="w-6 h-6 text-blue-400" />,
  },
  {
    id: 'ai-signal-clarity',
    name: 'AI Signal Clarity',
    description:
      'Measures the ratio of "signal" (actual logic) to "noise" (boilerplate, dead code).',
    why: 'Excess boilerplate wastes AI context window and leads to lower-quality suggestions.',
    how: 'Uses a signal-to-noise algorithm that weights domain-specific logic against framework boilerplate and unused code segments.',
    thresholds: [
      {
        score: '90+',
        label: 'Clear',
        detail: 'Focus is entirely on business logic.',
      },
      {
        score: '60-80',
        label: 'Noisy',
        detail: 'Boilerplate accounts for 40%+ of the file.',
      },
      {
        score: '< 40',
        label: 'Muffled',
        detail: 'Actual logic is buried in generated or dead code.',
      },
    ],
    playbook: [
      'Eliminate dead code and unused modules aggressively.',
      'Simplify verbose framework boilerplate into reusable hooks or HOCs.',
      'Use concise syntax patterns (e.g., arrow functions, destructuring).',
    ],
    examples: {
      bad: `// 50 lines of boilerplate for 2 lines of logic
class UserComponent extends React.Component {
  constructor(props) { ... }
  render() { ... }
}`,
      good: `// Concise signal-focused logic
const UserComponent = ({ user }) => (
  <div>{user.name}</div>
);`,
    },
    icon: <TrendingUpIcon className="w-6 h-6 text-teal-400" />,
  },
  {
    id: 'documentation-health',
    name: 'Documentation Health',
    description: 'Checks for missing, outdated, or misleading documentation.',
    why: 'AI relies heavily on docstrings to understand intent. Outdated docs lead to "hallucinations".',
    how: 'Analyzes the semantic alignment between docstrings and implementation using a "Drift Detection" algorithm.',
    thresholds: [
      {
        score: '90+',
        label: 'Synchronized',
        detail: 'Docs accurately reflect implementation 99% of the time.',
      },
      {
        score: '60-80',
        label: 'Outdated',
        detail: 'Occasional "comment rot" where docs lag behind code.',
      },
      {
        score: '< 40',
        label: 'Misleading',
        detail: 'Documentation describes non-existent behavior.',
      },
    ],
    playbook: [
      'Enforce "Self-Documenting Code" through clear naming first.',
      'Use JSDoc/TSDoc to provide structured context for AI models.',
      'Link READMEs directly to feature entry points.',
    ],
    examples: {
      bad: `/** Returns user age */
function getUserEmail(id) { ... }`,
      good: `/** Fetches user email by unique identifier */
function getUserEmail(id: string) { ... }`,
    },
    icon: <FileIcon className="w-6 h-6 text-amber-400" />,
  },
  {
    id: 'agent-grounding',
    name: 'Agent Grounding',
    description:
      'Assesses how easily an AI agent can navigate your project structure.',
    why: 'Standard structures allow AI agents to navigate autonomously without getting lost.',
    how: 'Evaluates project topology against "Discovery Benchmarks" for common frameworks (React, Next.js, FastAPI, etc.).',
    thresholds: [
      {
        score: '90+',
        label: 'Grounded',
        detail: 'Follows 100% of ecosystem conventions.',
      },
      {
        score: '70-89',
        label: 'Discoverable',
        detail: 'Standard structure with minor custom layouts.',
      },
      {
        score: '< 50',
        label: 'Lost',
        detail: 'Non-standard layout that confuses autonomous agents.',
      },
    ],
    playbook: [
      'Use standard framework entry points (e.g., index.ts, main.py).',
      'Keep your directory structure shallow and intuitively named.',
      'Avoid deeply nested folders that exceed typical agent search depths.',
    ],
    examples: {
      bad: `src/
  stuff/
    logic/
      user/
        implementation_v2/
          actual_code.ts`,
      good: `src/
  features/
    user/
      user.service.ts`,
    },
    icon: <TargetIcon className="w-6 h-6 text-rose-400" />,
  },
  {
    id: 'testability-index',
    name: 'Testability Index',
    description:
      'Quantifies how easy it is for an AI to write and run tests for your code.',
    why: 'AI-generated tests verify AI-generated code. Code that is hard to test is harder for AI to maintain.',
    how: 'Analyzes cyclomatic complexity, side-effect density, and external dependency mocking requirements.',
    thresholds: [
      {
        score: '90+',
        label: 'Testable',
        detail: 'Pure functions with isolated side effects.',
      },
      {
        score: '60-80',
        label: 'Complex',
        detail: 'Requires significant mocking to test simple logic.',
      },
      {
        score: '< 40',
        label: 'Untestable',
        detail: 'Tightly coupled to global state or IO.',
      },
    ],
    playbook: [
      'Prefer Pure Functions that take inputs and return outputs.',
      'Use Dependency Injection to make mocking easier for AI agents.',
      'Break down large "God Functions" into smaller, testable units.',
    ],
    examples: {
      bad: `function saveUser(user) {
  // Direct DB call, impossible to test in isolation
  return db.query('INSERT...', user);
}`,
      good: `function saveUser(user, repository = defaultRepo) {
  // Dependency injection allows easy mocking
  return repository.save(user);
}`,
    },
    icon: <TargetIcon className="w-6 h-6 text-orange-400" />,
  },
];
