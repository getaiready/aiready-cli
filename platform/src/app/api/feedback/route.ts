import { NextRequest, NextResponse } from 'next/server';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { SESClient, SendEmailCommand } from '@aws-sdk/client-ses';
import { auth } from '@/app/api/auth/[...nextauth]/route';

const bucket = process.env.SUBMISSIONS_BUCKET || 'aiready-submissions';
const s3 = new S3Client({});
const sesToEmail = process.env.SES_TO_EMAIL || 'team@getaiready.dev';
const ses = new SESClient({});

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    const data = await req.json();
    const { message, email: optionalEmail } = data;

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      );
    }

    const email = session?.user?.email || optionalEmail || 'Anonymous';
    const now = new Date();
    const id = `${now.toISOString()}_${Math.random().toString(36).slice(2, 8)}`;
    const key = `feedback/${id}.json`;

    const payload = {
      email,
      message,
      receivedAt: now.toISOString(),
      userAgent: req.headers.get('user-agent'),
      path: req.headers.get('referer'),
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
        <h2 style="color: #4f46e5;">New User Feedback</h2>
        <p><strong>From:</strong> ${email}</p>
        <p><strong>Message:</strong></p>
        <div style="background: #f3f4f6; padding: 15px; border-radius: 8px; font-style: italic;">
          ${message.replace(/\n/g, '<br/>')}
        </div>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        <p style="font-size: 12px; color: #666;">Received at ${now.toLocaleString()}</p>
      </div>
    `;

    await ses.send(
      new SendEmailCommand({
        Destination: { ToAddresses: [sesToEmail] },
        Message: {
          Subject: { Data: `📣 Feedback from ${email}` },
          Body: {
            Html: { Data: htmlBody },
          },
        },
        Source: 'notifications@getaiready.dev',
      })
    );

    return NextResponse.json({ ok: true });
  } catch (error: any) {
    console.error('Feedback error:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
