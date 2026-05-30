import { useParams, useSearchParams, useNavigate, Link } from "react-router";
import { useState } from "react";
import Navbar from "@/components/layout/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { trpc } from "@/providers/trpc";
import { TIER_PRICES_NGN, TIER_PRICES_USD, TIER_CREDITS } from "@contracts/constants";
import { getTierLabel } from "@/lib/utils";
import { ArrowLeft, CreditCard, Loader2 } from "lucide-react";
import type { Tier } from "@/types";

export default function Checkout() {
  const { tier } = useParams<{ tier: string }>();
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const currency = (searchParams.get("currency") as "NGN" | "USD") ?? "NGN";
  const ref = searchParams.get("ref");

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validTier = ["starter", "vip", "pioneer", "corporate", "hub_partner"].includes(tier ?? "") ? (tier as Tier) : null;
  const price = validTier ? (currency === "NGN" ? TIER_PRICES_NGN[validTier] : TIER_PRICES_USD[validTier]) : 0;
  const credits = validTier ? TIER_CREDITS[validTier] : 0;

  const initiateMutation = trpc.payment.initiate.useMutation({
    onSuccess: (data) => {
      // For demo: redirect to demo payment page
      navigate(data.authorizationUrl + `&setup=true`);
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validTier || !email) return;
    setIsSubmitting(true);
    try {
      await initiateMutation.mutateAsync({
        tier: validTier,
        email,
        phone: phone || undefined,
        currency,
        affiliateCode: ref || undefined,
      });
    } catch {
      setIsSubmitting(false);
    }
  };

  if (!validTier) {
    return (
      <div className="min-h-screen bg-[#f5f4f1] pt-24">
        <div className="max-w-md mx-auto px-4 text-center">
          <h1 className="text-xl font-bold text-[#0d0d0d] mb-4">Invalid tier</h1>
          <Link to="/join"><Button>Back to Pricing</Button></Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f5f4f1]">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-2xl mx-auto px-4">
          <Link to="/join" className="inline-flex items-center gap-1 text-sm text-neutral-600 hover:text-[#0d0d0d] mb-6">
            <ArrowLeft className="w-4 h-4" /> Back to plans
          </Link>

          <div className="mb-6">
            <h1 className="text-2xl font-bold text-[#0d0d0d] mb-1">Checkout</h1>
            <p className="text-neutral-600 text-sm">Complete your {getTierLabel(validTier)} membership.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card className="h-fit">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Tier</span>
                  <Badge variant="outline">{getTierLabel(validTier)}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-neutral-600">Credits</span>
                  <span className="text-sm font-medium">${credits.toLocaleString()}</span>
                </div>
                {ref && (
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-600">Referral</span>
                    <span className="text-xs text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">{ref}</span>
                  </div>
                )}
                <div className="border-t pt-3 flex items-center justify-between">
                  <span className="font-semibold">Total</span>
                  <span className="text-xl font-bold text-[#0d0d0d]">
                    {currency === "NGN" ? `\u20A6${price.toLocaleString()}` : `$${price.toLocaleString()}`}
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Payment Details</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="text-xs">Email</Label>
                    <Input id="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="mt-1" />
                  </div>
                  {currency === "NGN" && (
                    <div>
                      <Label htmlFor="phone" className="text-xs">Phone (for Paystack)</Label>
                      <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+234..." className="mt-1" />
                    </div>
                  )}
                  <Button type="submit" className="w-full bg-[#0d0d0d] hover:bg-[#1a1a1a] text-white" disabled={isSubmitting}>
                    {isSubmitting ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : <><CreditCard className="w-4 h-4 mr-2" /> Pay {currency === "NGN" ? `\u20A6${price.toLocaleString()}` : `$${price.toLocaleString()}`}</>}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
