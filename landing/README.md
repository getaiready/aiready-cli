# AIReady Landing Page

A modern, responsive landing page for AIReady - tools to optimize your codebase for AI collaboration.

## Features

- **AI-Ready Codebase Tools**: Detect semantic duplicates, analyze context windows, and maintain consistency that AI models understand
- **Free & Open Source**: All tools are completely free with no hidden costs
- **Instant Results**: Get analysis results in under 1 second
- **High Accuracy**: 95% detection accuracy for code issues
- **Lead Capture**: Contact form for requesting detailed reports

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Styling**: Tailwind CSS v4
- **Language**: TypeScript
- **Deployment**: AWS (S3 + CloudFront) with SST
- **Domain**: getaiready.dev

## Getting Started

A minimal start: run a scan, then visualize the results.

```bash
# 1) Run analysis (defaults to JSON output)
aiready scan .

# 2) Visualize the generated report
aiready visualise
```

Notes:

- `aiready scan` now defaults to JSON output so you can pipe or save reports easily.
- The visualizer lives in `packages/visualizer` and provides a friendly interactive view of the report.
- If you prefer npm/pnpm scripts, the repo includes convenience scripts that wrap these commands.

## Visualizer

The Visualizer turns an AIReady JSON report into an interactive graph view. Quick options:

- Generate a static HTML from a report:

```bash
aiready visualise
```

- Start the interactive dev server (devs):

```bash
cd packages/visualizer
pnpm dev
```

The right-hand details panel shows paths relative to the project root for easier reading (hover to see the absolute path).

## Environment Variables

Copy `.env.example` to `.env.local` and fill in the required values:

```env
# Contact form submission endpoint (provided by SST deployment)
NEXT_PUBLIC_REQUEST_URL=your-api-endpoint-url
```

## Deployment

This project is configured for deployment with SST (Serverless Stack) to AWS. The deployment configuration is in `sst.config.ts` (not included in this public repo).

For local development, you can run:

```bash
npx sst dev
```

## Contributing

This is the landing page for AIReady. For contributions to the core tools, visit:

- [@aiready/cli](https://github.com/getaiready/aiready-cli) - Unified CLI for all tools
- [@aiready/pattern-detect](https://github.com/getaiready/aiready-pattern-detect) - Semantic duplicate detection
- [@aiready/context-analyzer](https://github.com/getaiready/aiready-context-analyzer) - Context window analysis
- [@aiready/consistency](https://github.com/getaiready/aiready-consistency) - Code consistency checker

## License

MIT License - see LICENSE file for details.
