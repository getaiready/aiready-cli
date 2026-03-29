# ClawMore (Layer 3: Monetization)

> Managed Evolution & EaaS (Evolution-as-a-Service)

ClawMore is the premium layer of the **AIReady Empire**, providing autonomous codebase evolution and managed infrastructure.

## 🚀 The AIReady Empire

1.  **LAYER 1: OPEN SOURCE**: [AIReady CLI](https://github.com/getaiready/aiready-cli), [MCP Server](https://github.com/getaiready/aiready-mcp-server), and 10 Analysis Tools.
2.  **LAYER 2: ACTIVATION**: [Platform Dashboard](https://getaiready.dev/dashboard) for trend tracking and remediation.
3.  **LAYER 3: MONETIZATION**: **ClawMore** - Autonomous evolution for managed AWS infrastructure.

## Features

- **Autonomous Infrastructure**: Managed AWS account vending and serverless management.
- **Codebase Evolution**: Automatic application of AI-readiness fixes and architectural improvements.
- **Innovation Harvesting**: Automatically detect and promote successful patterns across your organization.
- **Managed Evolution**: Move beyond static code to a living, evolving repository.

## Architecture

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────────┐
│   Client     │────▶│  ClawMore Hub    │────▶│  Spoke (per client) │
│  (Signup)    │     │  (This repo)     │     │  (clawmost org)     │
└─────────────┘     └──────────────────┘     └─────────────────────┘
                           │                          │
                    ┌──────┴──────┐            ┌──────┴──────┐
                    │ Stripe      │            │ AWS Account │
                    │ DynamoDB    │            │ serverlessclaw│
                    │ EventBridge │            │ SST Stack   │
                    └─────────────┘            └─────────────┘
```

## One-Click Client Setup Flow

1. **Signup** → User creates account with email (magic link auth)
2. **Subscribe** → Stripe Checkout for $29/99/299/mo plan
3. **Provision** → Webhook triggers automated provisioning:
   - Finds/creates AWS account via Organizations (warm pool)
   - Creates private repo from `serverlessclaw` template in `clawmost` org
   - Injects AWS credentials + SST secrets into GitHub Actions
   - Applies serverless-only SCPs
4. **Deploy** → GitHub Actions workflow auto-deploys `sst deploy --stage production`
5. **Dashboard** → Real-time status polling shows provisioning progress

## Key Files

| File                               | Purpose                                                         |
| ---------------------------------- | --------------------------------------------------------------- |
| `sst.config.ts`                    | Infrastructure-as-Code (DynamoDB, EventBridge, Stripe products) |
| `lib/onboarding/provision-node.ts` | One-click provisioning orchestrator                             |
| `lib/aws/vending.ts`               | AWS account vending (warm pool, Organizations)                  |
| `lib/aws/governance.ts`            | SCP management (serverless-only enforcement)                    |
| `lib/billing.ts`                   | Stripe checkout sessions, metered usage, overage charges        |
| `app/api/webhooks/stripe/route.ts` | Payment event handler → triggers provisioning                   |
| `app/dashboard/`                   | Client dashboard with provisioning status                       |

## Environment Variables

| Variable                   | Purpose                                   |
| -------------------------- | ----------------------------------------- |
| `STRIPE_SECRET_KEY`        | Stripe API key                            |
| `STRIPE_WEBHOOK_SECRET`    | Stripe webhook signature verification     |
| `GITHUB_SERVICE_TOKEN`     | GitHub PAT for repo provisioning          |
| `SPOKE_TELEGRAM_BOT_TOKEN` | Injected into client serverlessclaw stack |
| `SPOKE_MINIMAX_API_KEY`    | Injected into client serverlessclaw stack |
| `SPOKE_OPENAI_API_KEY`     | Injected into client serverlessclaw stack |
| `SPOKE_GITHUB_TOKEN`       | Injected into client serverlessclaw stack |
| `ADMIN_PASSWORD`           | Admin console access                      |
| `ADMIN_EMAILS`             | Comma-separated admin emails              |

## Get Started

Visit [getaiready.dev/clawmore](https://getaiready.dev/clawmore) to learn more about our EaaS offerings.
