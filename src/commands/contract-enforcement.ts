/**
 * Contract enforcement command - Analyze defensive coding patterns
 */

import { type Command } from 'commander';
import {
  defineToolCommand,
  type CommonToolOptions,
} from './shared/command-builder';
import { contractEnforcementConfig } from './shared/standard-tool-actions';

export { contractEnforcementAction } from './shared/standard-tool-actions';

interface ContractEnforcementOptions extends CommonToolOptions {
  minChainDepth?: string;
}

/**
 * Define the contract enforcement command.
 */
export function defineContractEnforcementCommand(program: Command) {
  defineToolCommand(program, {
    name: 'contracts',
    description: 'Analyze defensive coding patterns and contract enforcement',
    toolName: 'contract-enforcement',
    label: 'Contract enforcement analysis',
    emoji: '🛡️',
    options: [
      {
        flags: '--min-chain-depth <number>',
        description: 'Minimum chain depth to analyze',
        defaultValue: '3',
      },
    ],
    actionConfig: contractEnforcementConfig,
  });
}
