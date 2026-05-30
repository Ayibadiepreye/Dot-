import { useState } from "react";
import { useNavigate } from "react-router";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getTierLabel } from "@/lib/utils";
import { User, Phone, MessageCircle, Wallet, QrCode, ArrowRight, Check } from "lucide-react";

const steps = [
  { label: "Profile", icon: User },
  { label: "Verify", icon: Phone },
  { label: "Community", icon: MessageCircle },
  { label: "Wallet", icon: Wallet },
  { label: "Ticket", icon: QrCode },
];

export default function Onboarding() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const [profile, setProfile] = useState({ name: "", country: "", state: "", school: "", phone: "" });
  const [phoneVerified, setPhoneVerified] = useState(false);

  const updateProfile = trpc.user.updateProfile.useMutation();
  const completeOnboarding = trpc.user.completeOnboarding.useMutation({
    onSuccess: () => navigate("/dashboard"),
  });

  const handleNext = async () => {
    if (step === 0) {
      await updateProfile.mutateAsync(profile);
    }
    if (step < steps.length - 1) {
      setStep(step + 1);
    } else {
      await completeOnboarding.mutateAsync();
    }
  };

  const tier = user?.tier ?? "starter";

  return (
    <div className="min-h-screen bg-[#f5f4f1] flex items-center justify-center p-4">
      <Card className="w-full max-w-lg">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between mb-2">
            <p className="text-xs text-neutral-500">Step {step + 1} of {steps.length}</p>
            <p className="text-xs font-medium text-[#0d6efd]">{steps[step].label}</p>
          </div>
          <Progress value={((step + 1) / steps.length) * 100} className="h-1.5" />
        </CardHeader>
        <CardContent className="pt-4">
          {step === 0 && (
            <div className="space-y-4">
              <div className="text-center mb-4">
                <User className="w-10 h-10 text-[#0d6efd] mx-auto mb-2" />
                <CardTitle className="text-lg">Complete Your Profile</CardTitle>
                <p className="text-sm text-neutral-500">Tell us a bit about yourself.</p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div><Label className="text-xs">Full Name</Label><Input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="Your name" className="mt-1" /></div>
                <div><Label className="text-xs">Country</Label><Input value={profile.country} onChange={(e) => setProfile({ ...profile, country: e.target.value })} placeholder="Nigeria" className="mt-1" /></div>
                <div><Label className="text-xs">State/Region</Label><Input value={profile.state} onChange={(e) => setProfile({ ...profile, state: e.target.value })} placeholder="Lagos" className="mt-1" /></div>
                <div><Label className="text-xs">School/Org</Label><Input value={profile.school} onChange={(e) => setProfile({ ...profile, school: e.target.value })} placeholder="Optional" className="mt-1" /></div>
              </div>
              <div><Label className="text-xs">Phone</Label><Input value={profile.phone} onChange={(e) => setProfile({ ...profile, phone: e.target.value })} placeholder="+234..." className="mt-1" /></div>
            </div>
          )}

          {step === 1 && (
            <div className="text-center space-y-4">
              <Phone className="w-10 h-10 text-[#0d6efd] mx-auto" />
              <CardTitle className="text-lg">Phone Verification</CardTitle>
              <p className="text-sm text-neutral-500">Verify your phone to unlock affiliate features.</p>
              <Button variant="outline" onClick={() => setPhoneVerified(true)} className={phoneVerified ? "border-emerald-500 text-emerald-600" : ""}>
                {phoneVerified ? <><Check className="w-4 h-4 mr-1" /> Verified</> : "Send OTP"}
              </Button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center space-y-4">
              <MessageCircle className="w-10 h-10 text-[#0d6efd] mx-auto" />
              <CardTitle className="text-lg">Join the Community</CardTitle>
              <p className="text-sm text-neutral-500">Your {getTierLabel(tier)} membership includes access to:</p>
              <ul className="text-left text-sm bg-neutral-50 rounded-lg p-4 space-y-2">
                <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> General community channels</li>
                {tier !== "starter" && <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> VIP rooms</li>}
                {(tier === "pioneer" || tier === "corporate" || tier === "hub_partner") && <li className="flex items-center gap-2"><Check className="w-4 h-4 text-emerald-500" /> Founder rooms</li>}
              </ul>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" className="w-full">Open Whop Community</Button>
              </a>
            </div>
          )}

          {step === 3 && (
            <div className="text-center space-y-4">
              <Wallet className="w-10 h-10 text-[#0d6efd] mx-auto" />
              <CardTitle className="text-lg">Your Wallet</CardTitle>
              <p className="text-sm text-neutral-500">Your builder credits have been deposited.</p>
              <div className="bg-neutral-50 rounded-lg p-6">
                <p className="text-xs text-neutral-500 mb-1">Credit Balance</p>
                <p className="text-3xl font-bold text-[#0d0d0d]">
                  ${user?.wallet?.creditBalance ? Number(user.wallet.creditBalance).toLocaleString() : "2,000"}
                </p>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="text-center space-y-4">
              <QrCode className="w-10 h-10 text-[#0d6efd] mx-auto" />
              <CardTitle className="text-lg">Your Event Ticket</CardTitle>
              <p className="text-sm text-neutral-500">You're registered for the Cohort I Launch!</p>
              <div className="bg-neutral-50 rounded-lg p-4">
                <p className="text-sm font-medium">DOT Cohort I Launch</p>
                <p className="text-xs text-neutral-500">Friday, May 29, 2026</p>
                <p className="text-xs text-neutral-500">Family Hall</p>
              </div>
            </div>
          )}

          <Button onClick={handleNext} className="w-full mt-6 bg-[#0d0d0d] hover:bg-[#1a1a1a] text-white">
            {step < steps.length - 1 ? (<>Next <ArrowRight className="w-4 h-4 ml-1" /></>) : "Go to Dashboard"}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
