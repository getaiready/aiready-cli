import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

import {
  json,
  allowedCorsHeaders,
  extractIp,
  LandingEvent as Event,
} from './utils';

const bucket = process.env.SUBMISSIONS_BUCKET!;
const s3 = new S3Client({});
const sesToEmail = process.env.SES_TO_EMAIL || '';
const sesFromEmail =
  process.env.SES_FROM_EMAIL || 'notifications@getaiready.dev';
const ses = new SESClient({});

export async function handler(event: Event) {
  const method = event.requestContext?.http?.method || 'POST';

  // Handle CORS preflight
  if (method === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: allowedCorsHeaders(),
      body: '',
    };
  }

  try {
    if (!bucket) throw new Error('Bucket not configured');
    if (!event.body) throw new Error('Missing body');

    const data = JSON.parse(event.body);
    const email: string = (data.email || '').trim();
    const repoUrl: string = (data.repoUrl || '').trim();
    const notes: string = (data.notes || '').trim();

    // Basic validation
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return json(400, { error: 'Invalid email' });
    }
    if (!/^https:\/\/github.com\/.+\/.+/.test(repoUrl)) {
      return json(400, { error: 'Invalid GitHub repo URL' });
    }

    const now = new Date();
    const id = `${now.toISOString()}_${Math.random().toString(36).slice(2, 8)}`;
    const key = `submissions/${id}.json`;

    const payload = {
      email,
      repoUrl,
      notes,
      receivedAt: now.toISOString(),
      ip: extractIp(event.headers),
      userAgent:
        event.headers?.['user-agent'] || event.headers?.['User-Agent'] || '',
    };

    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: Buffer.from(JSON.stringify(payload, null, 2)),
        ContentType: 'application/json',
      })
    );

    // Optional: notify via SES email (to founder)
    if (sesToEmail) {
      try {
        const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>New AIReady Report Request</title>
</head>
<body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
  <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px 10px 0 0; text-align: center;">
    <h1 style="color: white; margin: 0; font-size: 24px;">🎯 New Report Request</h1>
    <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0;">AIReady - Codebase Audit</p>
  </div>
  
  <div style="background: #f8f9fa; padding: 30px; border-radius: 0 0 10px 10px;">
    <h2 style="color: #667eea; margin-top: 0;">Request Details</h2>
    
    <table style="width: 100%; border-collapse: collapse;">
      <tr>
        <td style="padding: 10px 0; font-weight: bold; color: #555; width: 100px;">📧 Email:</td>
        <td style="padding: 10px 0;"><a href="mailto:${email}" style="color: #667eea; text-decoration: none;">${email}</a></td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-weight: bold; color: #555;">📦 Repository:</td>
        <td style="padding: 10px 0;"><a href="${repoUrl}" style="color: #667eea; text-decoration: none;">${repoUrl}</a></td>
      </tr>
      ${
        notes
          ? `<tr>
        <td style="padding: 10px 0; font-weight: bold; color: #555; vertical-align: top;">📝 Notes:</td>
        <td style="padding: 10px 0; white-space: pre-wrap;">${notes}</td>
      </tr>`
          : ''
      }
      <tr>
        <td style="padding: 10px 0; font-weight: bold; color: #555;">🕐 Received:</td>
        <td style="padding: 10px 0;">${new Date(now).toLocaleString('en-US', { dateStyle: 'full', timeStyle: 'short' })}</td>
      </tr>
    </table>
    
    <div style="margin-top: 30px; padding: 20px; background: white; border-left: 4px solid #667eea; border-radius: 5px;">
      <p style="margin: 0 0 10px 0; font-weight: bold; color: #555;">📂 S3 Location:</p>
      <code style="background: #f1f3f5; padding: 8px 12px; border-radius: 4px; display: inline-block; font-size: 12px; color: #495057;">${key}</code>
    </div>
    
    <div style="margin-top: 30px; text-align: center; padding-top: 20px; border-top: 1px solid #dee2e6;">
      <p style="color: #6c757d; font-size: 14px; margin: 0;">
        This is an automated notification from <strong>AIReady</strong><br>
        <a href="https://getaiready.dev" style="color: #667eea; text-decoration: none;">getaiready.dev</a>
      </p>
    </div>
  </div>
</body>
</html>`;

        const textBody = `New AIReady Report Request

Email: ${email}
Repository: ${repoUrl}
${notes ? `Notes: ${notes}` : ''}
Received: ${new Date(now).toLocaleString()}

S3 Key: ${key}

---
This is an automated notification from AIReady
https://getaiready.dev`;

        await ses.send(
          new SendEmailCommand({
            Destination: { ToAddresses: [sesToEmail] },
            Message: {
              Subject: { Data: '🎯 New AIReady Report Request' },
              Body: {
                Html: { Data: htmlBody },
                Text: { Data: textBody },
              },
            },
            Source: sesFromEmail,
          })
        );
      } catch {}
    }

    return json(200, { ok: true });
  } catch (err: any) {
    console.error('request-report error', err);
    return json(500, { error: err?.message || 'Internal error' });
  }
}
