/**
 * Parser for rule markdown files
 */

import { readFile } from 'fs/promises';
import { basename } from 'path';
import { Rule, ImpactLevel } from './types.js';

export interface RuleFile {
  rule: Rule;
  section: number;
}

/**
 * Parse a rule markdown file into a Rule object
 */
export async function parseRuleFile(
  filePath: string,
  sectionMap?: Record<string, number>
): Promise<RuleFile> {
  const rawContent = await readFile(filePath, 'utf-8');
  // Normalize Windows CRLF line endings to LF for consistent parsing
  const content = rawContent.replace(/\r\n/g, '\n');
  const lines = content.split('\n');

  // Extract frontmatter if present
  let frontmatter: Record<string, any> = {};
  let contentStart = 0;

  if (content.startsWith('---')) {
    const frontmatterEnd = content.indexOf('---', 3);
    if (frontmatterEnd !== -1) {
      const frontmatterText = content.slice(3, frontmatterEnd).trim();
      frontmatterText.split('\n').forEach((line) => {
        const [key, ...valueParts] = line.split(':');
        if (key && valueParts.length) {
          const value = valueParts.join(':').trim();
          // Remove quotes if present
          frontmatter[key.trim()] = value.replace(/^["']|["']$/g, '');
        }
      });
      contentStart = content.indexOf('\n', frontmatterEnd + 3) + 1;
    }
  }

  const bodyContent = content.slice(contentStart);

  // Parse title from first heading
  const titleMatch = bodyContent.match(/^##\s+(.+)$/m);
  const title = titleMatch ? titleMatch[1].trim() : 'Untitled Rule';

  // Parse impact
  const impactMatch = bodyContent.match(
    /\*\*Impact:\s*(CRITICAL|HIGH|MEDIUM|LOW)/i
  );
  const impact = (
    impactMatch ? impactMatch[1].toUpperCase() : 'MEDIUM'
  ) as ImpactLevel;

  // Parse impact description
  const impactDescMatch = bodyContent.match(/\*\*Impact:\s*\w+\s*\(([^)]+)\)/);
  const impactDescription = impactDescMatch
    ? impactDescMatch[1].trim()
    : undefined;

  // Parse explanation
  // We want everything after the title and impact description, up to the old-style examples or references
  const explanation = bodyContent
    .split('\n')
    // Skip the first heading and any impact lines
    .filter((line) => !line.match(/^##\s+/) && !line.match(/^\*\*Impact:/))
    .join('\n')
    // Stop at old-style examples or references section
    .split(/\n\n\*\*Incorrect|\n\nReference:|\n\n\s*---\s*\n/)[0]
    .trim();

  // Parse code examples
  const examples: Rule['examples'] = [];
  const exampleRegex =
    /\*\*(Incorrect|Correct)(?:\s*\([^)]+\))?:\*\*\s*\n\n```(\w+)\n([\s\S]*?)```/g;
  let match;

  while ((match = exampleRegex.exec(bodyContent)) !== null) {
    const type = match[1].toLowerCase() as 'incorrect' | 'correct';
    const language = match[2];
    const code = match[3].trim();

    // Extract description from parentheses if present
    const descMatch = bodyContent
      .slice(match.index - 100, match.index)
      .match(/\*\*(?:Incorrect|Correct)\s*\(([^)]+)\)/);
    const description = descMatch ? descMatch[1].trim() : undefined;

    examples.push({ type, code, language, description });
  }

  // Parse references
  const references: string[] = [];
  const referenceMatch = bodyContent.match(/Reference:\s*(.+)/i);
  if (referenceMatch) {
    const refLinks = referenceMatch[1].match(/\[([^\]]+)\]\(([^)]+)\)/g);
    if (refLinks) {
      refLinks.forEach((link) => {
        const urlMatch = link.match(/\(([^)]+)\)/);
        if (urlMatch) references.push(urlMatch[1]);
      });
    }
  }

  // Parse tags
  const tags = frontmatter.tags
    ? frontmatter.tags.split(',').map((t: string) => t.trim())
    : [];

  // Infer section from filename patterns
  const filename = basename(filePath);
  const defaultSectionMap: Record<string, number> = {
    patterns: 1,
    context: 2,
    consistency: 3,
    docs: 4,
    deps: 5,
  };

  const effectiveSectionMap = sectionMap || defaultSectionMap;

  // Extract area from filename - try longest prefix match first
  const filenameParts = filename.replace('.md', '').split('-');
  let section = 0;

  // Try progressively shorter prefixes to find the best match
  for (let len = filenameParts.length; len > 0; len--) {
    const prefix = filenameParts.slice(0, len).join('-');
    if (effectiveSectionMap[prefix] !== undefined) {
      section = effectiveSectionMap[prefix];
      break;
    }
  }

  // Fall back to frontmatter section if specified
  section = frontmatter.section || section || 0;

  const rule: Rule = {
    id: '', // Will be assigned by build script based on sorted order
    title: frontmatter.title || title,
    section: section,
    subsection: undefined,
    impact: frontmatter.impact || impact,
    impactDescription: frontmatter.impactDescription || impactDescription,
    explanation: frontmatter.explanation || explanation.trim(),
    examples,
    references: frontmatter.references
      ? Array.isArray(frontmatter.references)
        ? frontmatter.references
        : [frontmatter.references]
      : references,
    tags: frontmatter.tags ? tags : undefined,
  };

  return { rule, section };
}
