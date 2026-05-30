import { useState } from "react";
import AdminNav from "@/components/layout/AdminNav";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getTierLabel } from "@/lib/utils";

export default function AdminPayments() {
  const [page] = useState(1);
  const { data: payments, isLoading } = trpc.admin.payments.useQuery({ page, limit: 50 });

  return (
    <div className="min-h-screen bg-[#f5f4f1] flex">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-6xl">
          <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Payments</h1>

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
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Email</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Tier</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Amount</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Provider</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Status</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(payments ?? []).map((p) => (
                        <tr key={p.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                          <td className="px-4 py-3">{p.email}</td>
                          <td className="px-4 py-3"><Badge variant="outline">{getTierLabel(p.tier)}</Badge></td>
                          <td className="px-4 py-3 font-medium">{p.currency === "NGN" ? `\u20A6` : `$`}{Number(p.amount).toLocaleString()}</td>
                          <td className="px-4 py-3 text-neutral-500">{p.provider}</td>
                          <td className="px-4 py-3"><Badge className={p.status === "success" ? "bg-emerald-100 text-emerald-700" : p.status === "pending" ? "bg-amber-100 text-amber-700" : "bg-red-100 text-red-700"}>{p.status}</Badge></td>
                          <td className="px-4 py-3 text-neutral-400">{new Date(p.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {(payments ?? []).length === 0 && <p className="text-sm text-neutral-500 text-center py-8">No payments found.</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
