import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number, currency = "NGN"): string {
  if (currency === "NGN") {
    return new Intl.NumberFormat("en-NG", {
      style: "currency",
      currency: "NGN",
      minimumFractionDigits: 0,
    }).format(amount);
  }
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
}

export function formatNumber(num: number): string {
  if (num >= 1_000_000) return `${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `${(num / 1_000).toFixed(1)}K`;
  return num.toString();
}

export function generateReferralCode(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export function getTierColor(tier: string): string {
  const colors: Record<string, string> = {
    starter: "bg-gray-100 text-gray-800",
    vip: "bg-blue-100 text-blue-800",
    pioneer: "bg-purple-100 text-purple-800",
    corporate: "bg-amber-100 text-amber-800",
    hub_partner: "bg-emerald-100 text-emerald-800",
  };
  return colors[tier] ?? "bg-gray-100 text-gray-800";
}

export function getTierLabel(tier: string): string {
  const labels: Record<string, string> = {
    starter: "Starter",
    vip: "VIP",
    pioneer: "Pioneer",
    corporate: "Corporate",
    hub_partner: "Hub Partner",
  };
  return labels[tier] ?? tier;
}
