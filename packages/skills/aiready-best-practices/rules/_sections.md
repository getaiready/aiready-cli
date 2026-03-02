# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Pattern Detection (patterns)

**Impact:** CRITICAL  
**Description:** Identifies semantic duplicate patterns and naming inconsistencies that waste AI context window tokens and confuse pattern recognition. Consolidating duplicates can save 30-70% of context usage.

## 2. Context Optimization (context)

**Impact:** HIGH  
**Description:** Optimizes code organization for AI context windows. Addresses import depth, file cohesion, and dependency fragmentation that break AI understanding and lead to incomplete or incorrect suggestions.

## 3. Consistency Checking (consistency)

**Impact:** MEDIUM  
**Description:** Ensures naming conventions, error handling patterns, and API designs are consistent across the codebase. Inconsistencies confuse AI models and lead to incorrect pattern replication.

## 4. AI Signal Clarity (signal)

**Impact:** CRITICAL  
**Description:** Maximizes the semantic "signal" code provides to AI models. Eliminates ambiguous booleans, magic literals, and high-entropy naming that cause models to hallucinate or misinterpret logic.

## 5. Change Amplification (amplification)

**Impact:** HIGH  
**Description:** Identifies "hotspots" where a single code change triggers a cascade of breakages. Reducing amplification ensures AI edits stay within context window limits and don't overwhelm the agent's reasoning.

## 6. Agent Grounding (grounding)

**Impact:** HIGH  
**Description:** Provides the architectural and domain context necessary for AI agents to reason effectively. High-quality READMEs and clear domain boundaries ensure the agent is "grounded" in the correct project semantics.

## 7. Testability (testability)

**Impact:** MEDIUM  
**Description:** Ensures code is designed for automated verification by AI agents. Pure functions and clear verification coverage allow agents to confidently prove their changes work without expensive trial-and-error loops.

## 8. Documentation (docs)

**Impact:** MEDIUM  
**Description:** Keeps documentation synchronized with code changes. Outdated documentation misleads AI models, causing them to suggest deprecated patterns or incorrect implementations.

## 9. Codebase Health Assessment (assessment)

**Impact:** HIGH  
**Description:** Provides agents with a unified methodology for measuring codebase health and "AI-readiness". Regular scans identify critical technical debt and context fragmentation that can lead to agent failure.

## 10. Dependencies (deps)

**Impact:** LOW  
**Description:** Manages dependency health, circular dependencies, and version freshness. While lower priority, dependency issues can cascade into AI confusion about available APIs and best practices.
