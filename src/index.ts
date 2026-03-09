import { ToolRegistry, Severity } from '@aiready/core';
import { PatternDetectProvider } from './provider';

// Register with global registry
ToolRegistry.register(PatternDetectProvider);

export * from './analyzer';
export * from './detector';
export * from './grouping';
export * from './scoring';
export * from './context-rules';
export { PatternDetectProvider, Severity };
