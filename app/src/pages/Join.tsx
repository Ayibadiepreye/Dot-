import { Link, useSearchParams } from "react-router";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Check, ArrowLeft } from "lucide-react";
import { useState } from "react";
import { TIER_PRICES_NGN, TIER_PRICES_USD, TIER_CREDITS } from "@contracts/constants";
import { getTierColor, getTierLabel } from "@/lib/utils";
import type { Tier } from "@/types";

const tiers: { key: Tier; features: string[]; recommended?: boolean }[] = [
  { key: "starter", features: ["$2,000 Builder Credits", "General Community", "90-Day Program", "Newsletter", "Event Discounts"] },
  { key: "vip", features: ["$5,000 Builder Credits", "+ VIP Rooms", "Priority Support", "Weekly Calls", "Investor Intros"], recommended: true },
  { key: "pioneer", features: ["$10,000 Builder Credits", "+ Founder Rooms", "1-on-1 Mentorship", "Grant Help", "Lifetime Credits"] },
  { key: "corporate", features: ["$50,000 Builder Credits", "+ Partner Rooms", "Team Onboarding", "Custom Workshops", "Account Manager"] },
  { key: "hub_partner", features: ["$200,000 Builder Credits", "Full Access", "Hub Branding", "Sponsorship", "Board Seat"] },
];

export default function Join() {
  const [searchParams] = useSearchParams();
  const [currency, setCurrency] = useState<"NGN" | "USD">((searchParams.get("currency") as any) ?? "NGN");
  const ref = searchParams.get("ref");

  return (
    <div className="min-h-screen bg-[#f5f4f1]">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <Link to="/" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-[#0d0d0d] mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to home
          </Link>
          <div className="text-center mb-10">
            <h1 className="text-3xl sm:text-4xl font-bold text-[#0d0d0d] mb-3">Join DOT</h1>
            <p className="text-neutral-600 mb-5">Choose your membership tier and start building.</p>
            {ref && (
              <p className="text-xs text-emerald-600 bg-emerald-50 inline-block px-3 py-1 rounded-full">
                Referred by: {ref}
              </p>
            )}
            <div className="flex items-center justify-center gap-3 mt-4">
              <span className={`text-sm ${currency === "NGN" ? "font-medium text-[#0d0d0d]" : "text-neutral-500"}`}>NGN</span>
              <Switch checked={currency === "USD"} onCheckedChange={(c) => setCurrency(c ? "USD" : "NGN")} />
              <span className={`text-sm ${currency === "USD" ? "font-medium text-[#0d0d0d]" : "text-neutral-500"}`}>USD</span>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
            {tiers.map((tier) => {
              const price = currency === "NGN" ? TIER_PRICES_NGN[tier.key] : TIER_PRICES_USD[tier.key];
              return (
                <div key={tier.key} className={`relative rounded-2xl border bg-white p-5 flex flex-col ${tier.recommended ? "border-[#0d6efd] shadow-lg shadow-blue-100" : "border-neutral-200"}`}>
                  {tier.recommended && <Badge className="absolute -top-2 left-1/2 -translate-x-1/2 bg-[#0d6efd] text-white text-[10px]">Recommended</Badge>}
                  <Badge variant="outline" className={`w-fit mb-3 ${getTierColor(tier.key)}`}>{getTierLabel(tier.key)}</Badge>
                  <div className="mb-1">
                    <span className="text-2xl font-bold text-[#0d0d0d]">{currency === "NGN" ? `\u20A6${price.toLocaleString()}` : `$${price.toLocaleString()}`}</span>
                  </div>
                  <p className="text-xs text-neutral-500 mb-4">${TIER_CREDITS[tier.key].toLocaleString()} credits</p>
                  <ul className="space-y-2 mb-6 flex-1">
                    {tier.features.map((f, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-neutral-600"><Check className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />{f}</li>
                    ))}
                  </ul>
                  <Link to={`/checkout/${tier.key}?currency=${currency}${ref ? `&ref=${ref}` : ""}`} className="mt-auto">
                    <Button className={`w-full ${tier.recommended ? "bg-[#0d6efd] hover:bg-[#0b5ed7] text-white" : "bg-[#0d0d0d] hover:bg-[#1a1a1a] text-white"}`} size="sm">
                      {tier.key === "starter" ? "Get Started" : `Join ${getTierLabel(tier.key)}`}
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
