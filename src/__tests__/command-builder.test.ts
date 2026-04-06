import { describe, it, expect } from 'vitest';
import { Command } from 'commander';
import { defineToolCommand } from '../commands/shared/command-builder';

describe('command-builder', () => {
  it('registers a command and invokes customAction with defaults', async () => {
    const program = new Command();
    let called = false;

    const config: any = {
      name: 'testcmd',
      description: 'a test command',
      toolName: 'test-tool',
      label: 'Test Tool',
      emoji: '🔧',
      actionConfig: {},
      customAction: async (directory: string, options: any) => {
        called = true;
        expect(directory).toBe('.');
        // default output option should be 'console' from addCommonOptions
        expect(options.output).toBe('console');
      },
    };

    defineToolCommand(program, config);

    // Simulate running the command without args (user input form)
    await program.parseAsync(['testcmd'], { from: 'user' });

    expect(called).toBe(true);
  });
});
