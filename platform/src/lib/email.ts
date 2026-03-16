/**
 * Email utilities using AWS SES
 *
 * SES is configured in sst.config.ts with domain verification
 * Dev: noreply@dev.getaiready.dev
 * Prod: noreply@getaiready.dev
 */

import {
  SESClient,
  SendEmailCommand,
  SendEmailCommandInput,
} from '@aws-sdk/client-ses';

// Initialize SES client
const sesClient = new SESClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
});

// Get from email based on environment
const getFromEmail = () => {
  return process.env.SES_FROM_EMAIL || 'noreply@dev.getaiready.dev';
};

// Email types
interface EmailParams {
  to: string | string[];
  subject: string;
  htmlBody: string;
  textBody?: string;
}

/**
 * Send an email via SES
 */
export async function sendEmail(
  params: EmailParams
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, subject, htmlBody, textBody } = params;

  const input: SendEmailCommandInput = {
    Source: getFromEmail(),
    Destination: {
      ToAddresses: Array.isArray(to) ? to : [to],
    },
    Message: {
      Subject: {
        Data: subject,
        Charset: 'UTF-8',
      },
      Body: {
        Html: {
          Data: htmlBody,
          Charset: 'UTF-8',
        },
        ...(textBody && {
          Text: {
            Data: textBody,
            Charset: 'UTF-8',
          },
        }),
      },
    },
    ConfigurationSetName: process.env.SES_CONFIGURATION_SET,
  };

  try {
    const command = new SendEmailCommand(input);
    const response = await sesClient.send(command);

    return {
      success: true,
      messageId: response.MessageId,
    };
  } catch (error) {
    console.error('Failed to send email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
}

/**
 * Send analysis complete notification
 */
export async function sendAnalysisCompleteEmail(params: {
  to: string;
  repoName: string;
  aiScore: number;
  breakdown: Record<string, number>;
  summary: {
    totalFiles: number;
    totalIssues: number;
    criticalIssues: number;
    warnings: number;
  };
  dashboardUrl: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, repoName, aiScore, breakdown, summary, dashboardUrl } = params;

  const scoreColor =
    aiScore >= 80 ? '#10b981' : aiScore >= 60 ? '#f59e0b' : '#ef4444';
  const scoreLabel =
    aiScore >= 80 ? 'Excellent' : aiScore >= 60 ? 'Good' : 'Needs Work';

  const subject = `AIReady Analysis Complete: ${repoName} scored ${aiScore}/100`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0f; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border-radius: 16px; border: 1px solid rgba(99, 102, 241, 0.3); overflow: hidden;">
    
    <!-- Header -->
    <div style="padding: 24px; border-bottom: 1px solid rgba(99, 102, 241, 0.2); text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 700;">AIReady</h1>
      <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 14px;">Analysis Complete</p>
    </div>
    
    <!-- Score Section -->
    <div style="padding: 32px; text-align: center;">
      <div style="display: inline-block; background: rgba(0,0,0,0.3); border-radius: 16px; padding: 24px 40px; border: 2px solid ${scoreColor};">
        <div style="font-size: 56px; font-weight: 900; color: ${scoreColor}; line-height: 1;">${aiScore}</div>
        <div style="color: #64748b; font-size: 14px; margin-top: 4px;">/ 100</div>
        <div style="color: ${scoreColor}; font-size: 14px; font-weight: 600; margin-top: 8px;">${scoreLabel}</div>
      </div>
      <h2 style="color: #fff; margin: 24px 0 8px 0; font-size: 20px;">${repoName}</h2>
      <p style="color: #94a3b8; margin: 0; font-size: 14px;">Your AI readiness analysis is complete</p>
    </div>
    
    <!-- Breakdown Section -->
    <div style="padding: 0 24px 24px;">
      <h3 style="color: #e2e8f0; font-size: 14px; font-weight: 600; margin: 0 0 16px 0; text-transform: uppercase; letter-spacing: 0.05em;">Score Breakdown</h3>
      <div style="display: grid; grid-template-columns: repeat(auto-fill, minmax(120px, 1fr)); gap: 12px;">
        ${Object.entries(breakdown)
          .map(
            ([key, value]) => `
          <div style="background: rgba(30, 41, 59, 0.5); border-radius: 8px; padding: 12px; border: 1px solid rgba(100, 116, 139, 0.2);">
            <div style="font-size: 20px; font-weight: 700; color: ${value >= 70 ? '#10b981' : value >= 50 ? '#f59e0b' : '#ef4444'};">${value}</div>
            <div style="font-size: 12px; color: #94a3b8; margin-top: 4px;">${formatBreakdownKey(key)}</div>
          </div>
        `
          )
          .join('')}
      </div>
    </div>
    
    <!-- Summary Section -->
    <div style="padding: 0 24px 24px;">
      <h3 style="color: #e2e8f0; font-size: 14px; font-weight: 600; margin: 0 0 12px 0; text-transform: uppercase; letter-spacing: 0.05em;">Summary</h3>
      <div style="display: flex; gap: 16px; flex-wrap: wrap;">
        <div style="color: #94a3b8; font-size: 14px;">
          <span style="color: #e2e8f0; font-weight: 600;">${summary.totalFiles}</span> files
        </div>
        ${
          summary.criticalIssues > 0
            ? `
          <div style="color: #ef4444; font-size: 14px;">
            <span style="font-weight: 600;">${summary.criticalIssues}</span> critical issues
          </div>
        `
            : ''
        }
        ${
          summary.warnings > 0
            ? `
          <div style="color: #f59e0b; font-size: 14px;">
            <span style="font-weight: 600;">${summary.warnings}</span> warnings
          </div>
        `
            : ''
        }
      </div>
    </div>
    
    <!-- CTA Button -->
    <div style="padding: 0 24px 32px; text-align: center;">
      <a href="${dashboardUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #06b6d4); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
        View Report Details
      </a>
    </div>
    
    <!-- Footer -->
    <div style="padding: 20px 24px; border-top: 1px solid rgba(99, 102, 241, 0.2); text-align: center;">
      <p style="color: #64748b; font-size: 12px; margin: 0;">
        © 2026 AIReady · Make your codebase AI-ready
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const textBody = `
AIReady Analysis Complete

${repoName} scored ${aiScore}/100 (${scoreLabel})

Score Breakdown:
${Object.entries(breakdown)
  .map(([key, value]) => `  ${formatBreakdownKey(key)}: ${value}`)
  .join('\n')}

Summary:
  - ${summary.totalFiles} files analyzed
  ${summary.criticalIssues > 0 ? `- ${summary.criticalIssues} critical issues` : ''}
  ${summary.warnings > 0 ? `- ${summary.warnings} warnings` : ''}

View your full report: ${dashboardUrl}

© 2026 AIReady
  `.trim();

  return sendEmail({ to, subject, htmlBody, textBody });
}

/**
 * Send welcome email to new users
 */
export async function sendWelcomeEmail(params: {
  to: string;
  name?: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, name } = params;
  const firstName = name?.split(' ')[0] || 'Developer';

  const subject = 'Welcome to AIReady! 🚀';

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0f; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border-radius: 16px; border: 1px solid rgba(99, 102, 241, 0.3); overflow: hidden;">
    
    <div style="padding: 32px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 28px; font-weight: 700;">Welcome to AIReady!</h1>
      <p style="color: #94a3b8; margin: 16px 0 0 0; font-size: 16px;">Hi ${firstName}, let's make your codebase AI-ready.</p>
    </div>
    
    <div style="padding: 0 24px 24px;">
      <h3 style="color: #e2e8f0; font-size: 16px; font-weight: 600; margin: 0 0 16px 0;">Quick Start Guide</h3>
      
      <div style="background: rgba(30, 41, 59, 0.5); border-radius: 8px; padding: 16px; margin-bottom: 12px; border: 1px solid rgba(100, 116, 139, 0.2);">
        <div style="color: #06b6d4; font-size: 12px; font-weight: 600; margin-bottom: 8px;">STEP 1</div>
        <div style="color: #e2e8f0; font-size: 14px;">Add a repository to your dashboard</div>
      </div>
      
      <div style="background: rgba(30, 41, 59, 0.5); border-radius: 8px; padding: 16px; margin-bottom: 12px; border: 1px solid rgba(100, 116, 139, 0.2);">
        <div style="color: #06b6d4; font-size: 12px; font-weight: 600; margin-bottom: 8px;">STEP 2</div>
        <div style="color: #e2e8f0; font-size: 14px; font-family: monospace; background: rgba(0,0,0,0.3); padding: 8px 12px; border-radius: 4px;">npx @aiready/cli scan . --output json > report.json</div>
      </div>
      
      <div style="background: rgba(30, 41, 59, 0.5); border-radius: 8px; padding: 16px; border: 1px solid rgba(100, 116, 139, 0.2);">
        <div style="color: #06b6d4; font-size: 12px; font-weight: 600; margin-bottom: 8px;">STEP 3</div>
        <div style="color: #e2e8f0; font-size: 14px;">Upload report.json to see your AI readiness score</div>
      </div>
    </div>
    
    <div style="padding: 0 24px 32px; text-align: center;">
      <a href="https://platform.getaiready.dev/dashboard" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #06b6d4); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
        Go to Dashboard
      </a>
    </div>
    
    <div style="padding: 20px 24px; border-top: 1px solid rgba(99, 102, 241, 0.2); text-align: center;">
      <p style="color: #64748b; font-size: 12px; margin: 0;">
        Free plan: 3 repos · 10 runs/month · 7-day retention
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  return sendEmail({ to, subject, htmlBody });
}

/**
 * Send magic link email for passwordless auth
 */
export async function sendMagicLinkEmail(params: {
  to: string;
  magicLinkUrl: string;
}): Promise<{ success: boolean; messageId?: string; error?: string }> {
  const { to, magicLinkUrl } = params;

  const subject = 'Sign in to AIReady';

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #0a0a0f; margin: 0; padding: 20px;">
  <div style="max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #1e1b4b 0%, #0f172a 100%); border-radius: 16px; border: 1px solid rgba(99, 102, 241, 0.3); overflow: hidden;">
    
    <div style="padding: 32px; text-align: center;">
      <h1 style="color: #fff; margin: 0; font-size: 24px; font-weight: 700;">Sign in to AIReady</h1>
      <p style="color: #94a3b8; margin: 16px 0 0 0; font-size: 14px;">Click the button below to sign in to your account.</p>
    </div>
    
    <div style="padding: 0 24px 32px; text-align: center;">
      <a href="${magicLinkUrl}" style="display: inline-block; background: linear-gradient(135deg, #3b82f6, #06b6d4); color: #fff; text-decoration: none; padding: 14px 32px; border-radius: 8px; font-weight: 600; font-size: 14px;">
        Sign In
      </a>
    </div>
    
    <div style="padding: 0 24px 24px; text-align: center;">
      <p style="color: #64748b; font-size: 12px; margin: 0;">
        This link will expire in 15 minutes. If you didn't request this email, you can safely ignore it.
      </p>
    </div>
    
    <div style="padding: 20px 24px; border-top: 1px solid rgba(99, 102, 241, 0.2); text-align: center;">
      <p style="color: #64748b; font-size: 12px; margin: 0;">
        © 2026 AIReady · Make your codebase AI-ready
      </p>
    </div>
  </div>
</body>
</html>
  `.trim();

  const textBody = `
Sign in to AIReady

Click the link below to sign in to your account:
${magicLinkUrl}

This link will expire in 15 minutes. If you didn't request this email, you can safely ignore it.

© 2026 AIReady
  `.trim();

  return sendEmail({ to, subject, htmlBody, textBody });
}

/**
 * Format breakdown key for display
 */
function formatBreakdownKey(key: string): string {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (s) => s.toUpperCase())
    .trim();
}
