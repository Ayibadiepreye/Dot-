import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, Link2, CreditCard, Gift, ArrowRight } from "lucide-react";

export default function BecomeAffiliate() {
  const { isAuthenticated } = useAuth();

  const steps = [
    { icon: Link2, title: "Get Your Link", desc: "Every member automatically receives a unique referral link" },
    { icon: Users, title: "Share with Friends", desc: "Post on social media, send to your network, share in groups" },
    { icon: CreditCard, title: "They Join & Pay", desc: "When someone joins through your link and pays, you earn" },
    { icon: Gift, title: "Earn 10% Commission", desc: "Commission is added to your reward balance automatically" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f4f1]">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#0d0d0d] mb-4">Affiliate Program</h1>
          <p className="text-neutral-600 mb-10 max-w-xl mx-auto">
            Every DOT member is automatically an affiliate. Share your unique link and earn 10% commission on every paid referral.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10 text-left">
            {steps.map((step, i) => (
              <Card key={i} className="border-neutral-200">
                <CardContent className="p-5">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-[#f5f4f1] rounded-lg flex items-center justify-center shrink-0">
                      <step.icon className="w-5 h-5 text-[#0d6efd]" />
                    </div>
                    <div>
                      <p className="font-medium text-[#0d0d0d] text-sm">{step.title}</p>
                      <p className="text-xs text-neutral-500 mt-1">{step.desc}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="bg-[#0d0d0d] text-white rounded-2xl p-8">
            <h2 className="text-xl font-bold mb-2">Ready to start earning?</h2>
            <p className="text-sm text-neutral-400 mb-6">Join DOT to get your unique referral link instantly.</p>
            <Link to={isAuthenticated ? "/dashboard/referrals" : "/join"}>
              <Button className="bg-white text-[#0d0d0d] hover:bg-neutral-100 gap-2">
                {isAuthenticated ? "View My Referrals" : "Join DOT"} <ArrowRight className="w-4 h-4" />
              </Button>
            </Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
