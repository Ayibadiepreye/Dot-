# Testing Guide

## Unit Tests (Vitest)

```bash
# Run all unit tests
npm run test

# Watch mode
npm run test:watch
```

### Payment Pipeline Tests

```typescript
// tests/unit/payment-pipeline.test.ts
describe("Payment Pipeline", () => {
  it("creates user, wallet, and credits on payment success", async () => {
    // Mock payment data
    const result = await runPostPaymentPipeline({
      paymentId: "test-123",
      email: "test@example.com",
      tier: "starter",
      amount: 30000,
      currency: "NGN",
      provider: "paystack",
    });
    expect(result.user).toBeDefined();
    expect(result.wallet).toBeDefined();
    expect(result.affiliate).toBeDefined();
  });

  it("prevents duplicate processing (idempotency)", async () => {
    // Same payment should not create duplicate user
  });

  it("calculates affiliate commission correctly at 10%", async () => {
    // Commission = amount * 0.10
  });
});
```

### Affiliate Tests

```typescript
// tests/unit/affiliate.test.ts
describe("Affiliate System", () => {
  it("commission = amount * rate / 100", () => {
    expect(calculateCommission(30000, 10)).toBe(3000);
  });

  it("does not credit commission for inactive affiliates", () => {
    // isActive = false → no commission
  });
});
```

## Integration Tests

### Webhook Tests

1. Start dev server: `npm run dev`
2. Use ngrok or similar to expose localhost
3. Configure webhook URL in Paystack/Stripe dashboard
4. Send test webhook events
5. Verify database state changes

### Auth Flow Test

```bash
# 1. Visit login page
curl http://localhost:3000/login

# 2. Follow OAuth redirect
# 3. Verify callback sets cookie
# 4. Verify protected routes accessible
```

## E2E Tests (Playwright)

```bash
# Install Playwright browsers
npx playwright install

# Run E2E tests
npm run test:e2e
```

### Example Specs

```typescript
// tests/e2e/checkout.spec.ts
test("complete checkout flow", async ({ page }) => {
  await page.goto("/join");
  await page.click("text=Get Started"); // Starter tier
  await page.fill('input[type="email"]', "test@example.com");
  await page.click('button:has-text("Pay")');
  await page.click('button:has-text("Simulate")');
  await expect(page).toHaveURL(/auth.setup/);
});

// tests/e2e/dashboard.spec.ts
test("dashboard loads with wallet data", async ({ page }) => {
  // Login first (set auth cookie or use API)
  await page.goto("/dashboard");
  await expect(page.locator("text=Credit Balance")).toBeVisible();
});
```

## Manual Testing Checklist

### Public Pages
- [ ] Landing page loads with all sections
- [ ] Metrics bar shows animated counters
- [ ] Pricing section has currency toggle
- [ ] FAQ accordion works
- [ ] Countdown timer updates every second

### Auth Flow
- [ ] Login redirects to OAuth
- [ ] Callback creates session
- [ ] Logout clears session
- [ ] Protected routes redirect unauthenticated users

### Payment Flow
- [ ] Initiate payment for each tier
- [ ] Verify payment record created
- [ ] Mock success creates user + wallet
- [ ] Affiliate code tracked correctly

### Dashboard
- [ ] Wallet shows correct balances
- [ ] Transaction history loads
- [ ] Referral link is copyable
- [ ] Ticket displays QR code
- [ ] Community page shows tier access

### Admin
- [ ] Overview shows metrics
- [ ] User search/filter works
- [ ] Payment log loads
- [ ] Affiliate leaderboard shows
- [ ] QR check-in works
- [ ] Content management toggles work
