import { useSearchParams, useNavigate } from "react-router";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { trpc } from "@/providers/trpc";
import { useAuth } from "@/hooks/useAuth";
import { Loader2, CheckCircle } from "lucide-react";

export default function DemoPayment() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const ref = searchParams.get("ref");
  const amount = searchParams.get("amount");
  const currency = searchParams.get("currency");

  const [processing, setProcessing] = useState(false);
  const [done, setDone] = useState(false);

  const successMutation = trpc.payment.mockSuccess.useMutation({
    onSuccess: (data) => {
      setDone(true);
      setTimeout(() => {
        // If user is logged in, redirect to dashboard with reload
        if (user) {
          window.location.href = "/dashboard"; // Force reload to refresh user data
        } else {
          // If not logged in, redirect to signup
          navigate("/auth/setup?ref=" + ref + "&tier=" + data.tier + "&email=" + encodeURIComponent(data.email ?? ""));
        }
      }, 1500);
    },
  });

  const handlePay = () => {
    if (!ref) return;
    setProcessing(true);
    successMutation.mutate({ providerRef: ref });
  };

  return (
    <div className="min-h-screen bg-[#f5f4f1] flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-lg">Demo Payment</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <p className="text-sm text-neutral-600">This is a demo payment page for testing.</p>
          <div className="bg-neutral-100 rounded-lg p-4">
            <p className="text-xs text-neutral-500">Amount</p>
            <p className="text-2xl font-bold text-[#0d0d0d]">
              {currency === "NGN" ? `\u20A6${Number(amount).toLocaleString()}` : `$${Number(amount).toLocaleString()}`}
            </p>
          </div>
          {done ? (
            <div className="flex items-center justify-center gap-2 text-emerald-600 py-2">
              <CheckCircle className="w-5 h-5" />
              <span className="font-medium">Payment successful! Redirecting...</span>
            </div>
          ) : (
            <Button onClick={handlePay} disabled={processing || !ref} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white">
              {processing ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Processing...</> : "Simulate Successful Payment"}
            </Button>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
