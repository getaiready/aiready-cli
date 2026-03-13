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
    };
  },
  async run() {
    const isProd = $app.stage === 'production';
    const domainName = isProd
      ? 'clawmore.getaiready.dev'
      : `${$app.stage}.clawmore.getaiready.dev`;

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

    const site = new sst.aws.Nextjs('ClawMoreSite', {
      path: '.',
      domain: {
        name: domainName,
        dns: sst.cloudflare.dns({
          zone: '50eb7dcadc84c58ab34583742db0b671',
        }),
      },
      environment: {
        NEXT_PUBLIC_APP_URL: `https://${domainName}`,
        NEXT_PUBLIC_LEAD_API_URL: api.url,
      },
    });

    return {
      site: site.url,
      domain: domainName,
      apiUrl: api.url,
      leadsBucket: leads.name,
    };
  },
});
