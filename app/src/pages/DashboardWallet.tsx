import { useState } from "react";
import DashboardNav from "@/components/layout/DashboardNav";
import { useAuth } from "@/hooks/useAuth";
import { PaymentRequired } from "@/components/PaymentRequired";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Wallet, Gift, Star, AlertTriangle } from "lucide-react";

export default function DashboardWallet() {
  const { user } = useAuth();
  const [page] = useState(1);
  const { data: transactions, isLoading } = trpc.user.transactions.useQuery({ page, limit: 20 });
  const { data: achievements } = trpc.user.achievements.useQuery();

  const wallet = user?.wallet;

  // Payment gate check
  if (!user?.hasPaid) {
    return (
      <div className="min-h-screen bg-[#f5f4f1] flex">
        <DashboardNav />
        <main className="flex-1 p-8">
          <div className="max-w-4xl">
            <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Wallet</h1>
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
          <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Wallet</h1>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card className="border-neutral-200">
              <CardContent className="p-5">
                <Wallet className="w-5 h-5 text-[#0d6efd] mb-2" />
                <p className="text-xs text-neutral-500">Credit Balance</p>
                <p className="text-2xl font-bold text-[#0d0d0d]">${Number(wallet?.creditBalance ?? 0).toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-neutral-200">
              <CardContent className="p-5">
                <Gift className="w-5 h-5 text-emerald-500 mb-2" />
                <p className="text-xs text-neutral-500">Reward Balance</p>
                <p className="text-2xl font-bold text-[#0d0d0d]">${Number(wallet?.rewardBalance ?? 0).toLocaleString()}</p>
              </CardContent>
            </Card>
            <Card className="border-neutral-200">
              <CardContent className="p-5">
                <Star className="w-5 h-5 text-amber-500 mb-2" />
                <p className="text-xs text-neutral-500">Reputation Score</p>
                <p className="text-2xl font-bold text-[#0d0d0d]">{wallet?.reputationScore ?? 0}</p>
              </CardContent>
            </Card>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-3 mb-6 flex items-center gap-3">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <p className="text-xs text-amber-700">Withdrawals available in Phase 2. Rewards are platform credits, not withdrawable cash.</p>
          </div>

          <Card className="border-neutral-200 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Transaction History</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full mb-2" />)
              ) : (transactions?.rows ?? []).length === 0 ? (
                <p className="text-sm text-neutral-500 text-center py-6">No transactions yet.</p>
              ) : (
                <div className="space-y-2">
                  {(transactions?.rows ?? []).map((tx) => (
                    <div key={tx.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <Badge variant="outline" className={tx.type === "credit" ? "text-emerald-600" : tx.type === "reward" ? "text-blue-600" : "text-neutral-600"}>{tx.type}</Badge>
                        <div>
                          <p className="text-sm text-[#0d0d0d]">{tx.description ?? "Transaction"}</p>
                          <p className="text-xs text-neutral-400">{tx.reference ?? "-"}</p>
                        </div>
                      </div>
                      <span className="text-sm font-medium text-[#0d0d0d]">${Number(tx.amount).toLocaleString()}</span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {achievements && achievements.length > 0 && (
            <Card className="border-neutral-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Achievements</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {achievements.map((a) => (
                    <Badge key={a.id} variant="outline" className="px-3 py-1.5">
                      {a.icon ?? "🏆"} {a.label}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
