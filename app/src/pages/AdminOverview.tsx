import AdminNav from "@/components/layout/AdminNav";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Users, CreditCard, Building2, CalendarDays } from "lucide-react";

export default function AdminOverview() {
  const { data: metrics, isLoading } = trpc.admin.metrics.useQuery(undefined, { refetchInterval: 30000 });

  const statCards = [
    { label: "Total Users", value: metrics?.totalUsers ?? 0, icon: Users, color: "text-[#0d6efd]" },
    { label: "Total Revenue", value: metrics ? `\u20A6${(metrics.totalRevenue).toLocaleString()}` : "—", icon: CreditCard, color: "text-emerald-500" },
    { label: "NGN Revenue", value: metrics ? `\u20A6${(metrics.ngnRevenue).toLocaleString()}` : "—", icon: CreditCard, color: "text-blue-500" },
    { label: "USD Revenue", value: metrics ? `$${(metrics.usdRevenue).toLocaleString()}` : "—", icon: CreditCard, color: "text-purple-500" },
    { label: "Active Orgs", value: metrics?.activeOrgs ?? 0, icon: Building2, color: "text-amber-500" },
    { label: "Check-ins", value: metrics?.eventCheckins ?? 0, icon: CalendarDays, color: "text-red-500" },
  ];

  return (
    <div className="min-h-screen bg-[#f5f4f1] flex">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-6xl">
          <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Admin Overview</h1>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-28" />)}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {statCards.map((card) => (
                <Card key={card.label} className="border-neutral-200">
                  <CardContent className="p-5">
                    <card.icon className={`w-5 h-5 ${card.color} mb-3`} />
                    <p className="text-xs text-neutral-500 mb-1">{card.label}</p>
                    <p className="text-xl font-bold text-[#0d0d0d]">{card.value}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
