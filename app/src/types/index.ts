export type Tier = "starter" | "vip" | "pioneer" | "corporate" | "hub_partner";

export type Currency = "NGN" | "USD";

export type UserRole = "member" | "org_admin" | "ops" | "admin" | "super_admin";

export interface User {
  id: number;
  name: string | null;
  email: string;
  phone: string | null;
  country: string | null;
  state: string | null;
  school: string | null;
  tier: Tier;
  referralCode: string;
  role: UserRole;
  onboarded: boolean;
  phoneVerified: boolean;
  avatar: string | null;
  builderScore: number | null;
  whopId: string | null;
  createdAt: Date;
}

export interface Wallet {
  id: number;
  userId: number;
  creditBalance: string;
  rewardBalance: string;
  reputationScore: number;
  lifetimeCredits: string;
}

export interface Transaction {
  id: number;
  walletId: number;
  type: "credit" | "debit" | "reward" | "adjustment";
  amount: string;
  description: string | null;
  reference: string | null;
  createdAt: Date;
}

export interface Achievement {
  id: number;
  userId: number;
  type: string;
  label: string;
  icon: string | null;
  unlockedAt: Date;
}

export interface Ticket {
  id: number;
  eventId: number;
  userId: number;
  qrCode: string;
  qrUrl: string | null;
  checkedIn: boolean;
  checkedInAt: Date | null;
}

export interface Affiliate {
  id: number;
  userId: number;
  referralCode: string;
  totalClicks: number;
  totalSignups: number;
  totalPaid: number;
  totalRevenue: string;
  commissionRate: string;
  isActive: boolean;
}

export interface Event {
  id: number;
  title: string;
  description: string | null;
  venue: string;
  startsAt: Date;
  endsAt: Date | null;
  isActive: boolean;
}

export interface Payment {
  id: number;
  email: string;
  tier: Tier;
  currency: Currency;
  amount: string;
  provider: string;
  status: string;
  createdAt: Date;
}

export interface Faq {
  id: number;
  question: string;
  answer: string;
  displayOrder: number;
  active: boolean;
}

export interface PartnerLogo {
  id: number;
  name: string;
  logoUrl: string;
  url: string | null;
  displayOrder: number;
  active: boolean;
}
