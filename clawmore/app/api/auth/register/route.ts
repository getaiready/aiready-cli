import { NextRequest, NextResponse } from 'next/server';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocument } from '@aws-sdk/lib-dynamodb';
import { z } from 'zod';
import { sendWelcomeEmail } from '../../../../lib/email';

const dbClient = new DynamoDBClient({
  region: process.env.AWS_REGION || 'ap-southeast-2',
});
const docClient = DynamoDBDocument.from(dbClient);
const TableName = process.env.DYNAMO_TABLE || '';

const registerSchema = z.object({
  email: z.string().email('Valid email is required'),
  name: z.string().min(1, 'Name is required').max(100),
});

export async function POST(req: NextRequest) {
  try {
    if (!TableName) {
      return NextResponse.json(
        { error: 'Server configuration error' },
        { status: 500 }
      );
    }

    const body = await req.json();
    const parsed = registerSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    const { email, name } = parsed.data;
    const normalizedEmail = email.toLowerCase().trim();

    // Check if user already exists
    const existing = await docClient.query({
      TableName,
      IndexName: 'GSI1',
      KeyConditionExpression: 'GSI1PK = :pk AND GSI1SK = :sk',
      ExpressionAttributeValues: {
        ':pk': 'USER',
        ':sk': normalizedEmail,
      },
    });

    if (existing.Items && existing.Items.length > 0) {
      const existingUser = existing.Items[0];
      const existingId = existingUser.PK.replace('USER#', '');
      if (existingUser.status === 'APPROVED') {
        return NextResponse.json(
          { error: 'Account already exists. Please sign in.' },
          { status: 409 }
        );
      }
      // User exists but is pending - update name if provided and return success
      await docClient.update({
        TableName,
        Key: { PK: `USER#${existingId}`, SK: `USER#${existingId}` },
        UpdateExpression: 'SET #n = :name, updatedAt = :now',
        ExpressionAttributeNames: { '#n': 'name' },
        ExpressionAttributeValues: {
          ':name': name,
          ':now': new Date().toISOString(),
        },
      });
      return NextResponse.json({
        success: true,
        message: 'Account found. Please sign in to continue.',
        userId: existingId,
      });
    }

    // Generate user ID
    const id = Buffer.from(normalizedEmail)
      .toString('base64')
      .replace(/[^a-zA-Z0-9]/g, '')
      .substring(0, 16);

    const now = new Date().toISOString();

    // Create user record with PENDING status
    await docClient.put({
      TableName,
      Item: {
        PK: `USER#${id}`,
        SK: `USER#${id}`,
        GSI1PK: 'USER',
        GSI1SK: normalizedEmail,
        id,
        email: normalizedEmail,
        name,
        status: 'PENDING',
        plan: 'FREE',
        type: 'USER',
        createdAt: now,
        updatedAt: now,
      },
    });

    // Create user metadata with initial credits
    await docClient.put({
      TableName,
      Item: {
        PK: `USER#${id}`,
        SK: 'METADATA',
        EntityType: 'UserMetadata',
        aiTokenBalanceCents: 500,
        aiRefillThresholdCents: 100,
        aiTopupAmountCents: 1000,
        coEvolutionOptIn: false,
        autoTopupEnabled: true,
        createdAt: now,
      },
    });

    // Send welcome email (don't block the response)
    sendWelcomeEmail(normalizedEmail, name).catch(console.error);

    return NextResponse.json({
      success: true,
      message: 'Account created. Proceed to checkout.',
      userId: id,
    });
  } catch (error: any) {
    console.error('[Register] Error:', error);
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
