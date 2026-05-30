# Launch Day Operations Runbook

## Date: Friday, May 29, 2026
## Target: 1,000,000 Cohort I users

---

## Pre-Launch (6:00 AM WAT)

### System Checks
- [ ] Vercel deployment status green
- [ ] Database connection healthy (TiDB Cloud dashboard)
- [ ] All environment variables set
- [ ] Payment webhooks configured and verified
- [ ] Whop API responding
- [ ] R2 storage accessible
- [ ] PostHog receiving events
- [ ] Email (Resend) working — send test email

### Payment Verification
- [ ] Test one Paystack payment in live mode
- [ ] Test one Stripe payment in live mode
- [ ] Verify webhook receives and processes events
- [ ] Confirm user creation pipeline runs successfully

### Team Briefing
- [ ] Ops team on ground at Family Hall
- [ ] Admin dashboard open on 2+ devices (tablet + phone)
- [ ] QR scanner tested on check-in device
- [ ] Manual token entry fallback confirmed working
- [ ] Emergency contact list distributed

---

## Event Day Timeline

### 8:00 AM — Doors Open
- Open `/admin/events` on check-in devices
- Confirm camera permissions granted
- Test scan with a sample QR code

### 9:00 AM — Event Starts
- Begin check-in flow
- Monitor `eventCheckins` metric in real-time
- Watch for invalid token errors
- Check Vercel function logs for errors

### Check-in Flow
1. Attendee presents QR code
2. Scanner reads token (or ops enters manually)
3. System validates token
4. Success: green flash + name + tier
5. Already checked in: amber flash + timestamp
6. Invalid: red flash + error message

---

## Monitoring Stack

### Primary
- Vercel Dashboard: Function logs, errors
- TiDB Cloud: Query performance, connection count
- PostHog: Live events feed, conversion funnel

### Secondary
- Paystack Dashboard: Transaction volume
- Stripe Dashboard: Global payment volume
- Whop Dashboard: Membership provisioning status

---

## Incident Response

### Payment Fails
1. Check Paystack/Stripe dashboard for issues
2. Check webhook logs in Vercel
3. Verify webhook signature verification is working
4. If provider outage: display maintenance message

### Whop Provisioning Fails
1. Check `whop_pending` table for stuck records
2. Verify Whop API key is valid
3. Manual retry via admin dashboard
4. After 5 failed attempts: alert sent to admin email

### QR Scanner Down
1. Switch to manual token entry
2. Ops staff types token from attendee's phone
3. Same validation logic applies

### Database Slow
1. Check TiDB Cloud metrics
2. Scale compute if needed
3. Check for slow queries
4. Enable query caching if needed

---

## Emergency Contacts

| Service | Contact | Notes |
|---------|---------|-------|
| Paystack | support@paystack.com | Nigeria payments |
| Stripe | support.stripe.com | Global payments |
| Vercel | vercel.com/support | Hosting |
| Whop | discord.gg/whop | Community |
| TiDB | support@pingcap.com | Database |

---

## Post-Event

### Within 24 hours
- [ ] Export attendee list from admin dashboard
- [ ] Send thank-you email to attendees
- [ ] Review check-in metrics
- [ ] Process any pending affiliate commissions

### Within 1 week
- [ ] Send event recap to all members
- [ ] Review payment analytics
- [ ] Identify top affiliates for recognition
- [ ] Plan Cohort II improvements
