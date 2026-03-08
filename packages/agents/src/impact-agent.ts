import { Agent } from 'mastra';
import { z } from 'zod';

export const ImpactAgent = new Agent({
  name: 'Impact Agent',
  instructions: `
    You are a financial analyst for AI infrastructure.
    Your goal is to estimate the Monthly Token Savings (in USD) for a specific code remediation.

    Analysis Logic:
    1. Base Cost: Assume an average developer interacts with this code 20 times/day via AI.
    2. Token Impact: Calculate token reduction based on "Cognitive Load" and "Context Window" savings.
    3. Model Pricing: Use a blended rate of $10 per 1M tokens (GPT-4o/Claude 3.5 Sonnet average).
    4. Formulas:
       - MonthlySavings = (TokensSavedPerInteraction * 20 * 22 days) * (Rate / 1,000,000)
    
    Output a JSON object with:
    - estimatedMonthlySavings: number (USD)
    - confidenceScore: number (0.0 to 1.0)
    - breakdown: string (explanation of the math)
  `,
  model: {
    provider: 'openai',
    name: 'gpt-4o',
  },
});

export const ImpactSchema = z.object({
  estimatedMonthlySavings: z.number(),
  confidenceScore: z.number(),
  breakdown: z.string(),
});

export type ImpactResult = z.infer<typeof ImpactSchema>;
