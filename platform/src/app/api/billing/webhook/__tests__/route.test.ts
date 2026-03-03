import { describe, it, expect, vi, beforeEach } from 'vitest';
import { POST } from '../route';
import { NextRequest } from 'next/server';
import { updateTeam } from '@/lib/db';
import { getStripe } from '@/lib/billing';

// Mock dependencies
vi.mock('@/lib/db', () => ({
  updateTeam: vi.fn().mockResolvedValue({}),
}));

vi.mock('@/lib/billing', () => ({
  getStripe: vi.fn(),
  determinePlan: vi.fn().mockReturnValue('team'),
}));

describe('Billing Webhook API', () => {
  const webhookSecret = 'whsec_test';

  beforeEach(() => {
    vi.clearAllMocks();
    process.env.STRIPE_WEBHOOK_SECRET = webhookSecret;
  });

  const createMockRequest = (body: any, signature: string) => {
    return new NextRequest('http://localhost/api/billing/webhook', {
      method: 'POST',
      headers: {
        'stripe-signature': signature,
      },
      body: JSON.stringify(body),
    });
  };

  it('should return 400 if signature is missing', async () => {
    const req = new NextRequest('http://localhost/api/billing/webhook', {
      method: 'POST',
      body: JSON.stringify({}),
    });

    // We need to mock getStripe to return something valid
    (getStripe as any).mockReturnValue({
      webhooks: { constructEvent: vi.fn() },
    });

    const res = await POST(req);
    expect(res.status).toBe(400);
    const data = await res.json();
    expect(data.error).toBe('No signature');
  });

  it('should handle customer.subscription.updated and update the team', async () => {
    const mockEvent = {
      type: 'customer.subscription.updated',
      data: {
        object: {
          id: 'sub_123',
          customer: 'cus_123',
          metadata: { teamId: 'team_123', plan: 'team' },
        },
      },
    };

    const mockStripe = {
      webhooks: {
        constructEvent: vi.fn().mockReturnValue(mockEvent),
      },
    };
    (getStripe as any).mockReturnValue(mockStripe);

    const req = createMockRequest(mockEvent, 'valid_sig');
    // Mock req.text() because the actual implementation calls it
    req.text = vi.fn().mockResolvedValue(JSON.stringify(mockEvent));

    const res = await POST(req);
    expect(res.status).toBe(200);

    expect(updateTeam).toHaveBeenCalledWith('team_123', {
      plan: 'team',
      stripeSubscriptionId: 'sub_123',
      stripeCustomerId: 'cus_123',
    });
  });

  it('should handle customer.subscription.deleted and downgrade to free', async () => {
    const mockEvent = {
      type: 'customer.subscription.deleted',
      data: {
        object: {
          id: 'sub_123',
          metadata: { teamId: 'team_123' },
        },
      },
    };

    const mockStripe = {
      webhooks: {
        constructEvent: vi.fn().mockReturnValue(mockEvent),
      },
    };
    (getStripe as any).mockReturnValue(mockStripe);

    const req = createMockRequest(mockEvent, 'valid_sig');
    req.text = vi.fn().mockResolvedValue(JSON.stringify(mockEvent));

    const res = await POST(req);
    expect(res.status).toBe(200);

    expect(updateTeam).toHaveBeenCalledWith('team_123', {
      plan: 'free',
      stripeSubscriptionId: undefined,
    });
  });
});
