import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';

const bucket = process.env.SUBMISSIONS_BUCKET || 'aiready-submissions';
const s3 = new S3Client({});
const sesToEmail = process.env.SES_TO_EMAIL || 'team@getaiready.dev';
const ses = new SESClient({});

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const { email, plan, notes } = data;

    if (!email || !plan) {
      return NextResponse.json(
        { error: 'Email and plan are required' },
        { status: 400 }
      );
    }

    const now = new Date();
    const id = `${now.toISOString()}_${Math.random().toString(36).slice(2, 8)}`;
    const key = `waiting-list/${plan}/${id}.json`;

    const payload = {
      email,
      plan,
      notes,
      receivedAt: now.toISOString(),
      source: 'platform-pricing',
    };

    // Store in S3
    await s3.send(
      new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: JSON.stringify(payload, null, 2),
        ContentType: 'application/json',
      })
    );

    // Notify via SES
    const htmlBody = `
      <div style="font-family: sans-serif; padding: 20px; color: #333;">
        <h2 style="color: #0891b2;">New Waitlist Signup</h2>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Plan:</strong> ${plan}</p>
        <p><strong>Notes:</strong> ${notes || 'None'}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">Received at ${now.toLocaleString()}</p>
      </div>
    `;

    await ses.send(
      new SendEmailCommand({
        Destination: { ToAddresses: [sesToEmail] },
        Message: {
          Subject: { Data: `⏳ New Waitlist: ${plan} (${email})` },
          Body: {
            Html: { Data: htmlBody },
          },
        },
        Source: 'notifications@getaiready.dev',
      })
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Waiting list error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
