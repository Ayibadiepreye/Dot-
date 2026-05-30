import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { trpc } from "@/providers/trpc";
import DashboardNav from "@/components/layout/DashboardNav";
import { PaymentRequired } from "@/components/PaymentRequired";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTierLabel, getTierColor } from "@/lib/utils";
import { Wallet, Users, QrCode, MessageCircle, ArrowRight, Copy, Check } from "lucide-react";
import { useState } from "react";

export default function DashboardHome() {
  const { user } = useAuth();
  const { data: ticket } = trpc.user.ticket.useQuery();
  const [copied, setCopied] = useState(false);

  const referralLink = user ? `https://joindot.africa/r/${user.referralCode}` : "";

  const handleCopy = () => {
    if (referralLink) {
      navigator.clipboard.writeText(referralLink);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const cards = [
    {
      title: "Wallet",
      desc: "View your credits & transactions",
      icon: Wallet,
      href: "/dashboard/wallet",
      value: `$${Number(user?.wallet?.creditBalance ?? 0).toLocaleString()}`,
    },
    {
      title: "Referrals",
      desc: "Track your affiliate stats",
      icon: Users,
      href: "/dashboard/referrals",
      value: `${user?.referralCode ?? ""}`,
    },
    {
      title: "Event Ticket",
      desc: "Your QR code for May 29",
      icon: QrCode,
      href: "/dashboard/ticket",
      value: ticket ? "View QR" : "Pending",
    },
    {
      title: "Community",
      desc: "Access Whop community",
      icon: MessageCircle,
      href: "/dashboard/community",
      value: getTierLabel(user?.tier ?? "starter"),
    },
  ];

  // Payment gate check
  if (!user?.hasPaid) {
    return (
      <div className="min-h-screen bg-[#f5f4f1] flex">
        <DashboardNav />
        <main className="flex-1 p-8">
          <div className="max-w-5xl">
            <PaymentRequired />
            {/* Preview of features (grayed out) */}
            <div className="opacity-40 pointer-events-none">
              <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#0d0d0d]">
                  Welcome, {user?.name ?? "Builder"}
                </h1>
                <div className="flex items-center gap-3 mt-2">
                  <Badge className={getTierColor(user?.tier ?? "starter")}>{getTierLabel(user?.tier ?? "starter")}</Badge>
                  <span className="text-sm text-neutral-500">Reputation: 0 pts</span>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {cards.map((card) => (
                  <Card key={card.href} className="border-neutral-200 h-full">
                    <CardContent className="p-5">
                      <div className="flex items-start justify-between mb-3">
                        <card.icon className="w-5 h-5 text-[#0d6efd]" />
                        <ArrowRight className="w-4 h-4 text-neutral-400" />
                      </div>
                      <p className="text-xs text-neutral-500 mb-1">{card.title}</p>
                      <p className="text-lg font-semibold text-[#0d0d0d] truncate">{card.desc}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f4f1] flex">
      <DashboardNav />
      <main className="flex-1 p-8">
        <div className="max-w-5xl">
          <div className="mb-8">
            <h1 className="text-2xl font-bold text-[#0d0d0d]">
              Welcome, {user?.name ?? "Builder"}
            </h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge className={getTierColor(user?.tier ?? "starter")}>{getTierLabel(user?.tier ?? "starter")}</Badge>
              <span className="text-sm text-neutral-500">Reputation: {user?.wallet?.reputationScore ?? 0} pts</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6 flex items-center gap-3">
            <span className="text-sm text-neutral-600 shrink-0">Your referral link:</span>
            <code className="bg-neutral-100 rounded px-2 py-1 text-xs flex-1 truncate">{referralLink}</code>
            <button type="button" onClick={handleCopy} className="text-[#0d6efd] hover:text-[#0b5ed7] transition">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {cards.map((card) => (
              <Link key={card.href} to={card.href}>
                <Card className="hover:shadow-md transition-shadow border-neutral-200 h-full">
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between mb-3">
                      <card.icon className="w-5 h-5 text-[#0d6efd]" />
                      <ArrowRight className="w-4 h-4 text-neutral-400" />
                    </div>
                    <p className="text-xs text-neutral-500 mb-1">{card.title}</p>
                    <p className="text-lg font-semibold text-[#0d0d0d] truncate">{card.value}</p>
                    <p className="text-xs text-neutral-400 mt-1">{card.desc}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
