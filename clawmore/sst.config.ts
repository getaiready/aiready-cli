// @ts-nocheck
/// <reference path="./.sst/platform/config.d.ts" />

// Suppress AWS SDK warning when both profile and static keys are set
// by prioritizing the profile (which is the project standard)
if (
  process.env.AWS_PROFILE &&
  (process.env.AWS_ACCESS_KEY_ID || process.env.AWS_SECRET_ACCESS_KEY)
) {
  delete process.env.AWS_ACCESS_KEY_ID;
  delete process.env.AWS_SECRET_ACCESS_KEY;
}

export default $config({
  app(input) {
    return {
      name: 'aiready-clawmore',
      removal: input?.stage === 'production' ? 'retain' : 'remove',
      home: 'aws',
      providers: {
        stripe: '0.0.14',
      },
    } as any;
  },
  async run() {
    const isProd = $app.stage === 'production';

    // Configure the Stripe provider
    ($config as any).providers.stripe = {
      apiKey: process.env.STRIPE_SECRET_KEY || 'sk_test_placeholder',
    };

    const domainName = isProd
      ? 'clawmore.getaiready.dev'
      : `${$app.stage}.clawmore.getaiready.dev`;

    // --- Stripe Products & Prices (IaC) ---

    // 1. Managed Platform Subscription ($29/mo)
    const platformProduct = new (stripe as any).Product('PlatformProduct', {
      name: 'ClawMore Managed Platform',
      description:
        'Fully managed serverless AWS infrastructure with AI evolution.',
    });

    const platformPrice = new (stripe as any).Price('PlatformPrice', {
      product: platformProduct.id,
      unitAmount: 2900,
      currency: 'usd',
      recurring: { interval: 'month' },
    });

    // 2. AI Fuel Pack ($10.00 one-time)
    const fuelPackProduct = new (stripe as any).Product('FuelPackProduct', {
      name: 'AI Fuel Pack',
      description: 'Pre-paid intelligence credits for agent mutations.',
    });

    const fuelPackPrice = new (stripe as any).Price('FuelPackPrice', {
      product: fuelPackProduct.id,
      unitAmount: 1000,
      currency: 'usd',
    });

    // Storage for ClawMore Managed Platform data
    const table = new sst.aws.Dynamo('ClawMoreTable', {
      fields: {
        PK: 'string',
        SK: 'string',
      },
      primaryIndex: { hashKey: 'PK', rangeKey: 'SK' },
    });

    // EventBridge Bus for managed events (e.g. mutations)
    const bus = new sst.aws.Bus('ClawMoreBus');

    // Queue for fair-use AI task processing
    const aiQueue = new sst.aws.Queue('AIQueue', {
      visibilityTimeout: '5 minutes',
    });

    // Storage for leads
    const leads = new sst.aws.Bucket('Leads', {
      public: false,
    });

    // SNS Topic for notifications
    const topic = new sst.aws.SnsTopic('LeadNotifications');
    new aws.sns.TopicSubscription('LeadEmailSubscription', {
      topic: topic.arn,
      protocol: 'email',
      endpoint: 'caopengau@gmail.com',
    });

    // API Gateway for lead submissions (standalone to match landing pattern)
    const api = new sst.aws.ApiGatewayV2('LeadApi', {
      cors: true,
    });

    api.route('POST /submit', {
      handler: 'api/submit-lead.handler',
      link: [leads, topic],
      environment: {
        LEADS_BUCKET: leads.name,
        TOPIC_ARN: topic.arn,
      },
    });

    // Managed Platform Functions
    const createAccount = new sst.aws.Function('CreateManagedAccount', {
      handler: 'functions/create-managed-account.handler',
      timeout: '15 minutes',
      link: [table],
      permissions: [
        {
          actions: [
            'organizations:CreateAccount',
            'organizations:DescribeCreateAccountStatus',
            'organizations:ListPolicies',
            'organizations:CreatePolicy',
            'organizations:AttachPolicy',
            'sts:AssumeRole',
          ],
          resources: ['*'],
        },
      ],
    });

    const reportMutationTax = new sst.aws.Function('ReportMutationTax', {
      handler: 'functions/report-mutation-tax.handler',
      link: [table],
      environment: {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
      },
    });

    bus.subscribe('MutationReporting', reportMutationTax.arn, {
      pattern: {
        detailType: ['MutationPerformed'],
      },
    });

    new sst.aws.Function('CreateCheckoutSession', {
      handler: 'functions/create-checkout-session.handler',
      link: [table],
      environment: {
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
      },
    });

    new sst.aws.Cron('CostSyncCron', {
      schedule: 'rate(12 hours)',
      job: {
        handler: 'functions/cost-sync.handler',
        timeout: '5 minutes',
        link: [table],
        permissions: [
          {
            actions: ['ce:GetCostAndUsage', 'organizations:ListAccounts'],
            resources: ['*'],
          },
        ],
        environment: {
          STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
        },
      },
    });

    const site = new sst.aws.Nextjs('ClawMoreSite', {
      path: '.',
      dev: {
        command: 'pnpm run dev:next',
        autostart: true,
      },
      domain: {
        name: domainName,
        dns: sst.cloudflare.dns({
          zone: '50eb7dcadc84c58ab34583742db0b671',
        }),
      },
      environment: {
        NEXT_PUBLIC_APP_URL: `https://${domainName}`,
        LEAD_API_URL: api.url,
        LEADS_BUCKET: leads.name,
        DYNAMO_TABLE: table.name,
        STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
        STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET || '',
        NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY:
          process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || '',
        OPENROUTER_API_KEY: process.env.OPENROUTER_API_KEY || '',
        CLAW_MORE_BUS: bus.name,
        GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID || '',
        GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET || '',
        GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID || '',
        GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET || '',
        AUTH_SECRET:
          process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || '',
        ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || '',
        ADMIN_EMAILS: process.env.ADMIN_EMAILS || '',
      },
      permissions: [
        {
          actions: ['ses:SendEmail', 'ses:SendRawEmail'],
          resources: ['*'],
        },
      ],
      link: [api, leads, table, aiQueue, bus, platformPrice, fuelPackPrice],
    });

    return {
      site: site.url,
      domain: domainName,
      apiUrl: api.url,
      leadsBucket: leads.name,
    };
  },
});
