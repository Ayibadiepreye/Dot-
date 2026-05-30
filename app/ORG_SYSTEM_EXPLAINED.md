# 🏢 Organization System Explained

**Last Updated**: May 30, 2026

---

## ❓ YOUR QUESTIONS ANSWERED

### Q1: How does one login as an org?

**A: Organizations don't login directly.**

Here's how it actually works:

1. **Individual users login** (email/password or Google OAuth)
2. **Users can be linked to an organization** via the `organizationId` field
3. **Users with `org_admin` role** can manage their organization

**Example Flow:**
```
1. John logs in with john@acme.edu
2. John's user record has organizationId = 5 (Acme University)
3. John's role = "org_admin"
4. John can now manage Acme University members
```

---

### Q2: What makes org users different?

**A: It's all about the `role` field.**

| User Type | Role | What They Can Do |
|-----------|------|------------------|
| **Regular Member** | `member` | - Access own dashboard<br>- Pay for own account<br>- Use platform features |
| **Org Admin** | `org_admin` | - Everything a member can do<br>- View organization dashboard<br>- Invite members to org<br>- View org revenue<br>- Manage org members |
| **Platform Admin** | `admin` or `super_admin` | - Everything org admin can do<br>- Access admin panel<br>- Manage all users<br>- Approve organizations<br>- No payment gate |

---

## 📊 DATABASE STRUCTURE

### Users Table:
```typescript
users {
  id: 1
  email: "john@acme.edu"
  name: "John Doe"
  organizationId: 5              // ← Links to organization
  role: "org_admin"              // ← Determines permissions
  hasPaid: true
  tier: "corporate"
  ...
}
```

### Organizations Table:
```typescript
organizations {
  id: 5
  name: "Acme University"
  slug: "acme-university"
  contactEmail: "admin@acme.edu"
  referralCode: "ACME2024"       // ← For tracking signups
  revenueTotal: 5000000.00       // ← Total from all members
  status: "active"               // ← pending/active/suspended
  approvedBy: 1                  // ← Admin who approved
  approvedAt: "2026-01-15"
  ...
}
```

---

## 🔄 HOW IT WORKS

### Scenario 1: Regular Member

```
User: Jane (jane@gmail.com)
organizationId: null
role: "member"

What Jane sees:
✅ Dashboard (with payment gate if unpaid)
✅ Settings page
✅ Wallet, Referrals, Ticket
❌ Organization dashboard
❌ Admin panel
```

### Scenario 2: Organization Member

```
User: Bob (bob@acme.edu)
organizationId: 5 (Acme University)
role: "member"

What Bob sees:
✅ Dashboard (with payment gate if unpaid)
✅ Settings page
✅ Wallet, Referrals, Ticket
✅ "Part of Acme University" badge
❌ Organization management
❌ Admin panel
```

### Scenario 3: Organization Admin

```
User: John (john@acme.edu)
organizationId: 5 (Acme University)
role: "org_admin"

What John sees:
✅ Dashboard (with payment gate if unpaid)
✅ Settings page
✅ Wallet, Referrals, Ticket
✅ Organization dashboard
✅ View all Acme University members
✅ Invite new members
✅ View organization revenue
❌ Platform admin panel
```

### Scenario 4: Platform Admin

```
User: Admin (admin@dotplatform.com)
organizationId: null
role: "admin" or "super_admin"

What Admin sees:
✅ Dashboard (NO payment gate)
✅ Settings page
✅ Wallet, Referrals, Ticket
✅ Admin panel
✅ Manage all users
✅ Manage all organizations
✅ Approve/suspend organizations
✅ View all payments
```

---

## 🎯 ORGANIZATION FEATURES

### Currently Implemented:
- ✅ Database schema (organizations table)
- ✅ User-organization linking (organizationId field)
- ✅ Role-based access (org_admin role)
- ✅ Middleware for org admin checks

### NOT Implemented Yet:
- ❌ Organization signup/application flow
- ❌ Organization dashboard UI
- ❌ Invite members functionality
- ❌ Organization revenue dashboard
- ❌ Member management UI

---

## 🚀 HOW TO IMPLEMENT ORG FEATURES

### Step 1: Organization Application Flow

**Create**: `src/pages/ApplyOrganization.tsx`

```typescript
// Form for organizations to apply
- Organization name
- Contact email
- Country
- Logo upload
- Description

// Submit application
// Status = "pending"
// Wait for admin approval
```

### Step 2: Admin Approval

**Update**: `src/pages/AdminOrganizations.tsx`

```typescript
// List all organizations
// Filter by status (pending/active/suspended)
// Approve/reject applications
// Set status to "active"
```

### Step 3: Organization Dashboard

**Create**: `src/pages/OrgDashboard.tsx`

```typescript
// Only accessible by org_admin
// Show organization details
// List all members
// Show revenue stats
// Invite members button
```

### Step 4: Invite Members

**Create**: `src/pages/OrgInvite.tsx`

```typescript
// Generate invite link
// Send email invitation
// Track pending invitations
// Accept/decline flow
```

### Step 5: Member Management

**Create**: `src/pages/OrgMembers.tsx`

```typescript
// List all organization members
// View member details
// Remove members
// Change member roles
```

---

## 💡 USE CASES

### Use Case 1: University Partnership

```
Acme University wants to join DOT Platform:

1. Admin applies via organization form
2. Platform admin reviews and approves
3. Organization status = "active"
4. Admin invites students via email
5. Students sign up with invite link
6. Students auto-linked to Acme University
7. Students pay individually
8. Revenue tracked under Acme University
9. Org admin sees total revenue dashboard
```

### Use Case 2: Corporate Partnership

```
Tech Corp wants bulk access:

1. Tech Corp applies as organization
2. Platform admin approves
3. HR admin becomes org_admin
4. HR invites 100 employees
5. Employees sign up and pay
6. All linked to Tech Corp
7. HR sees all employee activity
8. Revenue tracked for reporting
```

### Use Case 3: Hub Partner

```
Innovation Hub wants to manage members:

1. Hub applies as organization
2. Platform admin approves
3. Hub gets special referral code
4. Hub invites startups/founders
5. Members join with hub code
6. Hub tracks member progress
7. Hub earns affiliate commission
8. Hub sees revenue dashboard
```

---

## 🔧 CURRENT STATE

### What Works Now:
- ✅ Users can have organizationId
- ✅ Users can have org_admin role
- ✅ Middleware checks for org_admin
- ✅ Database tracks organizations

### What Doesn't Work Yet:
- ❌ No UI for organization features
- ❌ No application flow
- ❌ No invite system
- ❌ No org dashboard
- ❌ No member management

### To Make It Work:
1. Build organization application form
2. Build admin approval UI
3. Build organization dashboard
4. Build invite system
5. Build member management UI

**Estimated Time**: 4-6 hours

---

## 🎯 PRIORITY

### Is This Needed Now?
**Probably not.**

Most platforms start with:
1. Individual users
2. Payment flow
3. Core features

Then add organization features later when:
- You have corporate clients
- You have university partnerships
- You need bulk management

### When to Implement:
- ✅ **Now**: If you already have org partners lined up
- ⏳ **Later**: If you're starting with individual users
- ⏳ **Much Later**: If you don't have org use cases yet

---

## 📞 RECOMMENDATION

**Focus on Week 1-2 features first:**
1. Production webhooks (critical)
2. Email notifications (important)
3. Whop integration (important)
4. SMS/WhatsApp (nice to have)

**Then add organization features if needed.**

---

## 🎉 SUMMARY

**Organizations in DOT Platform:**
- Don't login directly
- Are managed by org_admin users
- Track revenue from members
- Can invite and manage members
- Need UI implementation (4-6 hours)

**Current Status:**
- Database ready ✅
- Backend logic ready ✅
- UI not implemented ❌

**Priority:**
- Low (unless you have org partners now)
- Focus on webhooks and notifications first

**Read**: `COMPLETE_IMPLEMENTATION_PLAN.md` for full roadmap! 🚀
