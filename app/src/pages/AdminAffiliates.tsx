import AdminNav from "@/components/layout/AdminNav";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Switch } from "@/components/ui/switch";
import { Trophy } from "lucide-react";

export default function AdminAffiliates() {
  const { data: affiliates, isLoading, refetch } = trpc.admin.affiliates.useQuery();
  const toggleMutation = trpc.admin.toggleAffiliate.useMutation({ onSuccess: () => refetch() });

  return (
    <div className="min-h-screen bg-[#f5f4f1] flex">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-6xl">
          <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Affiliate Leaderboard</h1>

          <Card className="border-neutral-200">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-4 space-y-2">
                  {Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-neutral-200 bg-neutral-50">
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Rank</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Referral Code</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Clicks</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Paid</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Revenue</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Rate</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Active</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(affiliates ?? []).map((a, i) => (
                        <tr key={a.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                          <td className="px-4 py-3">
                            {i < 3 ? <Trophy className={`w-4 h-4 ${i === 0 ? "text-amber-500" : i === 1 ? "text-neutral-400" : "text-amber-700"}`} /> : <span className="text-neutral-400">{i + 1}</span>}
                          </td>
                          <td className="px-4 py-3 font-mono text-xs">{a.referralCode}</td>
                          <td className="px-4 py-3">{a.totalClicks}</td>
                          <td className="px-4 py-3">{a.totalPaid}</td>
                          <td className="px-4 py-3 font-medium">\u20A6{Number(a.totalRevenue).toLocaleString()}</td>
                          <td className="px-4 py-3">{a.commissionRate}%</td>
                          <td className="px-4 py-3">
                            <Switch checked={a.isActive ?? false} onCheckedChange={(c) => toggleMutation.mutate({ referralCode: a.referralCode, isActive: c })} />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(affiliates ?? []).length === 0 && <p className="text-sm text-neutral-500 text-center py-8">No affiliates yet.</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
