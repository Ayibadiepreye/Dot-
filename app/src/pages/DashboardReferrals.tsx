import { useState } from "react";
import DashboardNav from "@/components/layout/DashboardNav";
import { useAuth } from "@/hooks/useAuth";
import { PaymentRequired } from "@/components/PaymentRequired";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Copy, Check, Twitter, MessageCircle, MousePointer, UserPlus, CreditCard } from "lucide-react";

export default function DashboardReferrals() {
  const { user } = useAuth();
  const { data: affiliate, isLoading } = trpc.user.affiliate.useQuery();
  const [copied, setCopied] = useState(false);

  const referralLink = user ? `https://joindot.africa/r/${user.referralCode}` : "";

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTwitter = () => {
    const text = `I'm building with DOT — Africa's largest builder ecosystem! Join using my link: ${referralLink}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, "_blank");
  };

  const shareWhatsApp = () => {
    const text = `Join DOT — Africa's largest builder ecosystem! Use my referral link: ${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(text)}`, "_blank");
  };

  // Payment gate check
  if (!user?.hasPaid) {
    return (
      <div className="min-h-screen bg-[#f5f4f1] flex">
        <DashboardNav />
        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Referrals</h1>
            <PaymentRequired />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f4f1] flex">
      <DashboardNav />
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Referrals</h1>

          {!user?.phoneVerified && (
            <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6 flex items-center gap-3">
              <Badge variant="outline" className="text-amber-600 border-amber-300">Required</Badge>
              <p className="text-sm text-amber-700">Verify your phone number to unlock full affiliate stats.</p>
            </div>
          )}

          <div className="bg-white rounded-xl border border-neutral-200 p-4 mb-6 flex items-center gap-3">
            <span className="text-sm text-neutral-600 shrink-0">Your link:</span>
            <code className="bg-neutral-100 rounded px-2 py-1 text-xs flex-1 truncate">{referralLink}</code>
            <button type="button" onClick={handleCopy} className="text-[#0d6efd] hover:text-[#0b5ed7] transition">
              {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
            </button>
          </div>

          <div className="flex gap-2 mb-6">
            <Button variant="outline" size="sm" onClick={shareTwitter} className="gap-1.5"><Twitter className="w-3.5 h-3.5" /> Share on X</Button>
            <Button variant="outline" size="sm" onClick={shareWhatsApp} className="gap-1.5"><MessageCircle className="w-3.5 h-3.5" /> WhatsApp</Button>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {Array.from({ length: 4 }).map((_, i) => <Skeleton key={i} className="h-24" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              <Card className="border-neutral-200"><CardContent className="p-4 text-center"><MousePointer className="w-5 h-5 text-[#0d6efd] mx-auto mb-1" /><p className="text-2xl font-bold">{affiliate?.totalClicks ?? 0}</p><p className="text-xs text-neutral-500">Clicks</p></CardContent></Card>
              <Card className="border-neutral-200"><CardContent className="p-4 text-center"><UserPlus className="w-5 h-5 text-emerald-500 mx-auto mb-1" /><p className="text-2xl font-bold">{affiliate?.totalSignups ?? 0}</p><p className="text-xs text-neutral-500">Signups</p></CardContent></Card>
              <Card className="border-neutral-200"><CardContent className="p-4 text-center"><CreditCard className="w-5 h-5 text-purple-500 mx-auto mb-1" /><p className="text-2xl font-bold">{affiliate?.totalPaid ?? 0}</p><p className="text-xs text-neutral-500">Paid</p></CardContent></Card>
              <Card className="border-neutral-200"><CardContent className="p-4 text-center"><p className="text-lg font-bold text-[#0d0d0d]">\u20A6{Number(affiliate?.totalRevenue ?? 0).toLocaleString()}</p><p className="text-xs text-neutral-500">Revenue</p></CardContent></Card>
            </div>
          )}

          <Card className="border-neutral-200">
            <CardHeader className="pb-2"><CardTitle className="text-base">Commission</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-neutral-600">You've earned <span className="font-semibold">\u20A6{Number(user?.wallet?.rewardBalance ?? 0).toLocaleString()}</span> in referral commissions.</p>
              <p className="text-xs text-neutral-400 mt-1">10% commission rate. Paid out in Phase 2.</p>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
