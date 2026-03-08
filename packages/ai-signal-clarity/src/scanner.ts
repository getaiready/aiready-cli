/**
 * Language-agnostic scanner for AI signal clarity signals.
 *
 * Detects code patterns that empirically cause AI models to generate
 * incorrect code across all supported languages (TS, Python, Java, C#, Go).
 */

import { readFileSync } from 'fs';
import { getParser, Severity, IssueType, Language } from '@aiready/core';
import type {
  AiSignalClarityIssue,
  FileAiSignalClarityResult,
  AiSignalClarityOptions,
} from './types';

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const AMBIGUOUS_NAME_PATTERNS = [
  /^[a-z]$/, // single letter: a, b, x, y
  /^(tmp|temp|data|obj|val|res|ret|result|item|elem|thing|stuff|info|misc|util|helper|handler|cb|fn|func)$/i,
  /^[a-z]\d+$/, // x1, x2, n3
];

const MAGIC_LITERAL_IGNORE = new Set([0, 1, -1, 2, 10, 100, 1000, 1024]);
const MAGIC_STRING_IGNORE = new Set([
  '',
  ' ',
  '\n',
  '\t',
  'utf8',
  'utf-8',
  'hex',
  'base64',
  'true',
  'false',
  'null',
]);

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isAmbiguousName(name: string): boolean {
  return AMBIGUOUS_NAME_PATTERNS.some((p) => p.test(name));
}

function isMagicNumber(value: number): boolean {
  return !MAGIC_LITERAL_IGNORE.has(value);
}

function isMagicString(value: string): boolean {
  if (value.length === 0) return false;
  if (MAGIC_STRING_IGNORE.has(value)) return false;
  // Allow URL-like strings, CSS values — focus on short opaque strings
  return value.length <= 20 && !/[/.]/.test(value) && !/^\s+$/.test(value);
}

// ---------------------------------------------------------------------------
// Main scanner
// ---------------------------------------------------------------------------

export async function scanFile(
  filePath: string,
  options: AiSignalClarityOptions = { rootDir: '.' }
): Promise<FileAiSignalClarityResult> {
  let code: string;
  try {
    code = readFileSync(filePath, 'utf-8');
  } catch {
    return emptyResult(filePath);
  }

  const parser = getParser(filePath);
  if (!parser) return emptyResult(filePath);

  try {
    await parser.initialize();
    const result = parser.parse(code, filePath);
    const ast = await parser.getAST(code, filePath);

    const issues: AiSignalClarityIssue[] = [];
    const signals = {
      magicLiterals: 0,
      booleanTraps: 0,
      ambiguousNames: 0,
      undocumentedExports: 0,
      implicitSideEffects: 0,
      deepCallbacks: 0,
      overloadedSymbols: 0,
      totalSymbols: result.exports.length + result.imports.length,
      totalExports: result.exports.length,
    };

    // Symbol tracking for overloading detection
    const symbolCounts = new Map<string, number>();

    // 1. Check Metadata-based signals (Side Effects, Docs, Overloads)
    for (const exp of result.exports) {
      // Overload tracking
      symbolCounts.set(exp.name, (symbolCounts.get(exp.name) || 0) + 1);

      // Undocumented Exports
      if (options.checkUndocumentedExports !== false) {
        if (!exp.documentation || !exp.documentation.content) {
          signals.undocumentedExports++;
          issues.push({
            type: IssueType.AiSignalClarity,
            category: 'undocumented-export',
            severity: Severity.Minor,
            message: `Public export "${exp.name}" has no documentation — AI fabricates behavior from the name alone.`,
            location: {
              file: filePath,
              line: exp.loc?.start.line || 1,
              column: exp.loc?.start.column,
            },
            suggestion:
              'Add a docstring or comment describing parameters, return value, and side effects.',
          });
        }
      }

      // Implicit Side Effects
      if (options.checkImplicitSideEffects !== false) {
        if (exp.hasSideEffects && !exp.isPure && exp.type === 'function') {
          const lowerName = exp.name.toLowerCase();
          const looksPure =
            !/(set|update|save|delete|create|write|send|post|sync)/.test(
              lowerName
            );

          if (looksPure) {
            signals.implicitSideEffects++;
            issues.push({
              type: IssueType.AiSignalClarity,
              category: 'implicit-side-effect',
              severity: Severity.Major,
              message: `Function "${exp.name}" mutates external state but name doesn't reflect it — AI misses this contract.`,
              location: {
                file: filePath,
                line: exp.loc?.start.line || 1,
              },
              suggestion:
                'Make side-effects explicit in function name (e.g., updateX) or return a result.',
            });
          }
        }
      }

      // Ambiguous Names for Exports
      if (options.checkAmbiguousNames !== false && isAmbiguousName(exp.name)) {
        signals.ambiguousNames++;
        issues.push({
          type: IssueType.AmbiguousApi,
          category: 'ambiguous-name',
          severity: Severity.Info,
          message: `Ambiguous public export "${exp.name}" — AI cannot infer intent and will guess incorrectly.`,
          location: {
            file: filePath,
            line: exp.loc?.start.line || 1,
          },
          suggestion: 'Use a domain-descriptive name instead.',
        });
      }
    }

    // Report Overloads
    if (options.checkOverloadedSymbols !== false) {
      for (const [name, count] of symbolCounts.entries()) {
        if (count > 1 && name !== 'default' && name !== 'anonymous') {
          signals.overloadedSymbols++;
          issues.push({
            type: IssueType.AiSignalClarity,
            category: 'overloaded-symbol',
            severity: Severity.Critical,
            message: `Symbol "${name}" has ${count} overloaded signatures — AI often picks the wrong one or gets confused by conflicting contracts.`,
            location: {
              file: filePath,
              line: 1,
            },
            suggestion: `Rename overloads to unique, descriptive names if possible.`,
          });
        }
      }
    }

    // 2. Check AST-based signals (Structural: Magic Literals, Boolean Traps, Callbacks)
    if (ast) {
      let callbackDepth = 0;
      let maxCallbackDepth = 0;

      const visitNode = (node: any) => {
        if (!node) return;

        // --- Magic Literals ---
        if (options.checkMagicLiterals !== false) {
          // Tree-sitter (Python, Java, etc.)
          if (node.type === 'number') {
            const val = parseFloat(node.text);
            if (!isNaN(val) && isMagicNumber(val)) {
              signals.magicLiterals++;
              issues.push({
                type: IssueType.MagicLiteral,
                category: 'magic-literal',
                severity: Severity.Minor,
                message: `Magic number ${node.text} — AI will invent wrong semantics. Extract to a named constant.`,
                location: {
                  file: filePath,
                  line: node.startPosition.row + 1,
                  column: node.startPosition.column,
                },
                suggestion: `const MEANINGFUL_NAME = ${node.text};`,
              });
            }
          } else if (node.type === 'string' || node.type === 'string_literal') {
            const val = node.text.replace(/['"]/g, '');
            if (isMagicString(val)) {
              signals.magicLiterals++;
              issues.push({
                type: IssueType.MagicLiteral,
                category: 'magic-literal',
                severity: Severity.Info,
                message: `Magic string "${val}" — intent is ambiguous to AI. Consider a named constant.`,
                location: {
                  file: filePath,
                  line: node.startPosition.row + 1,
                },
              });
            }
          }
          // ESTree (TypeScript, JavaScript)
          else if (node.type === 'Literal') {
            if (typeof node.value === 'number' && isMagicNumber(node.value)) {
              signals.magicLiterals++;
              issues.push({
                type: IssueType.MagicLiteral,
                category: 'magic-literal',
                severity: Severity.Minor,
                message: `Magic number ${node.value} — AI will invent wrong semantics. Extract to a named constant.`,
                location: {
                  file: filePath,
                  line: node.loc?.start.line || 1,
                  column: node.loc?.start.column,
                },
                suggestion: `const MEANINGFUL_NAME = ${node.value};`,
              });
            } else if (
              typeof node.value === 'string' &&
              isMagicString(node.value)
            ) {
              signals.magicLiterals++;
              issues.push({
                type: IssueType.MagicLiteral,
                category: 'magic-literal',
                severity: Severity.Info,
                message: `Magic string "${node.value}" — intent is ambiguous to AI. Consider a named constant.`,
                location: {
                  file: filePath,
                  line: node.loc?.start.line || 1,
                },
              });
            }
          }
        }

        // --- Boolean Traps ---
        if (options.checkBooleanTraps !== false) {
          // Tree-sitter
          if (node.type === 'argument_list') {
            const hasBool = node.namedChildren?.some(
              (c: any) =>
                c.type === 'true' ||
                c.type === 'false' ||
                (c.type === 'boolean' &&
                  (c.text === 'true' || c.text === 'false'))
            );
            if (hasBool) {
              signals.booleanTraps++;
              issues.push({
                type: IssueType.BooleanTrap,
                category: 'boolean-trap',
                severity: Severity.Major,
                message: `Boolean trap: positional boolean argument at call site. AI inverts intent ~30% of the time.`,
                location: {
                  file: filePath,
                  line: (node.startPosition?.row || 0) + 1,
                },
                suggestion:
                  'Replace boolean arg with a named options object or separate functions.',
              });
            }
          }
          // ESTree
          else if (node.type === 'CallExpression') {
            const hasBool = node.arguments.some(
              (arg: any) =>
                arg.type === 'Literal' && typeof arg.value === 'boolean'
            );
            if (hasBool) {
              signals.booleanTraps++;
              issues.push({
                type: IssueType.BooleanTrap,
                category: 'boolean-trap',
                severity: Severity.Major,
                message: `Boolean trap: positional boolean argument at call site. AI inverts intent ~30% of the time.`,
                location: {
                  file: filePath,
                  line: node.loc?.start.line || 1,
                },
                suggestion:
                  'Replace boolean arg with a named options object or separate functions.',
              });
            }
          }
        }

        // --- Ambiguous Names ---
        if (options.checkAmbiguousNames !== false) {
          // Tree-sitter
          if (node.type === 'variable_declarator') {
            const nameNode = node.childForFieldName('name');
            if (nameNode && isAmbiguousName(nameNode.text)) {
              signals.ambiguousNames++;
              issues.push({
                type: IssueType.AmbiguousApi,
                category: 'ambiguous-name',
                severity: Severity.Info,
                message: `Ambiguous variable name "${nameNode.text}" — AI intent is unclear.`,
                location: {
                  file: filePath,
                  line: node.startPosition.row + 1,
                },
              });
            }
          }
          // ESTree
          else if (
            node.type === 'VariableDeclarator' &&
            node.id.type === 'Identifier'
          ) {
            if (isAmbiguousName(node.id.name)) {
              signals.ambiguousNames++;
              issues.push({
                type: IssueType.AmbiguousApi,
                category: 'ambiguous-name',
                severity: Severity.Info,
                message: `Ambiguous variable name "${node.id.name}" — AI intent is unclear.`,
                location: {
                  file: filePath,
                  line: node.loc?.start.line || 1,
                },
              });
            }
          }
        }

        // --- Callback Depth ---
        const nodeType = (node.type || '').toLowerCase();
        const isFunction =
          nodeType.includes('function') ||
          nodeType.includes('arrow') ||
          nodeType.includes('lambda') ||
          nodeType === 'method_declaration';

        if (isFunction) {
          callbackDepth++;
          maxCallbackDepth = Math.max(maxCallbackDepth, callbackDepth);
        }

        // Recurse Tree-sitter
        if (node.namedChildren) {
          for (const child of node.namedChildren) {
            visitNode(child);
          }
        }
        // Recurse ESTree
        else {
          for (const key in node) {
            if (key === 'parent' || key === 'loc' || key === 'range') continue;
            const child = node[key];
            if (child && typeof child === 'object') {
              if (Array.isArray(child)) {
                child.forEach(
                  (c) => c && typeof c.type === 'string' && visitNode(c)
                );
              } else if (typeof child.type === 'string') {
                visitNode(child);
              }
            }
          }
        }

        if (isFunction) {
          callbackDepth--;
        }
      };

      // Start visiting
      if ((ast as any).rootNode) {
        visitNode((ast as any).rootNode); // Tree-sitter
      } else {
        visitNode(ast); // ESTree
      }

      if (options.checkDeepCallbacks !== false && maxCallbackDepth >= 3) {
        signals.deepCallbacks = maxCallbackDepth - 2;
        issues.push({
          type: IssueType.AiSignalClarity,
          category: 'deep-callback',
          severity: Severity.Major,
          message: `Deeply nested logic (depth ${maxCallbackDepth}) — AI loses control flow context beyond 3 levels.`,
          location: {
            file: filePath,
            line: 1,
          },
          suggestion:
            'Extract nested logic into named functions or flatten the structure.',
        });
      }
    }

    return {
      filePath,
      issues,
      signals,
      fileName: filePath,
      metrics: {
        totalSymbols: signals.totalSymbols,
        totalExports: signals.totalExports,
      },
    };
  } catch (error) {
    console.error(`AI Signal Clarity: Failed to scan ${filePath}: ${error}`);
    return emptyResult(filePath);
  }
}

function emptyResult(filePath: string): FileAiSignalClarityResult {
  return {
    filePath,
    issues: [],
    signals: {
      magicLiterals: 0,
      booleanTraps: 0,
      ambiguousNames: 0,
      undocumentedExports: 0,
      implicitSideEffects: 0,
      deepCallbacks: 0,
      overloadedSymbols: 0,
      totalSymbols: 0,
      totalExports: 0,
    },
    fileName: filePath,
    metrics: {
      totalSymbols: 0,
      totalExports: 0,
    },
  };
}
