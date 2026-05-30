import DashboardNav from "@/components/layout/DashboardNav";
import { useAuth } from "@/hooks/useAuth";
import { PaymentRequired } from "@/components/PaymentRequired";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { getTierLabel, getTierColor } from "@/lib/utils";
import { ExternalLink, Check } from "lucide-react";

const tierAccess: Record<string, string[]> = {
  starter: ["General Channels", "Announcements", "Courses"],
  vip: ["General Channels", "Announcements", "Courses", "VIP Rooms"],
  pioneer: ["General Channels", "Announcements", "Courses", "VIP Rooms", "Founder Rooms"],
  corporate: ["General Channels", "Announcements", "Courses", "VIP Rooms", "Founder Rooms", "Partner Rooms"],
  hub_partner: ["All Channels", "Full Access"],
};

export default function DashboardCommunity() {
  const { user } = useAuth();
  const tier = user?.tier ?? "starter";
  const access = tierAccess[tier] ?? tierAccess.starter;

  // Payment gate check
  if (!user?.hasPaid) {
    return (
      <div className="min-h-screen bg-[#f5f4f1] flex">
        <DashboardNav />
        <main className="flex-1 p-8">
          <div className="max-w-2xl">
            <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Community</h1>
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
        <div className="max-w-2xl">
          <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Community</h1>

          <Card className="border-neutral-200 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Whop Access</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-neutral-600">
                Your <Badge className={getTierColor(tier)}>{getTierLabel(tier)}</Badge> membership includes access to the following community channels:
              </p>

              <ul className="space-y-2">
                {access.map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-neutral-700">
                    <Check className="w-4 h-4 text-emerald-500" />
                    {item}
                  </li>
                ))}
              </ul>

              <a href="#" target="_blank" rel="noopener noreferrer">
                <Button className="w-full bg-[#0d0d0d] hover:bg-[#1a1a1a] text-white gap-2 mt-2">
                  <ExternalLink className="w-4 h-4" /> Open Whop Community
                </Button>
              </a>

              {user?.whopEmail && (
                <p className="text-xs text-neutral-500">Whop email: {user.whopEmail}</p>
              )}
            </CardContent>
          </Card>

          <Card className="border-neutral-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Access Comparison</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-200">
                      <th className="text-left py-2 font-medium text-neutral-500">Feature</th>
                      <th className="text-center py-2 font-medium text-neutral-500">You</th>
                      <th className="text-center py-2 font-medium text-neutral-500">VIP+</th>
                    </tr>
                  </thead>
                  <tbody>
                    {["General Channels", "VIP Rooms", "Founder Rooms", "Partner Rooms", "Full Access"].map((f) => (
                      <tr key={f} className="border-b border-neutral-100 last:border-0">
                        <td className="py-2 text-neutral-700">{f}</td>
                        <td className="text-center py-2">{access.includes(f) || access.includes("All Channels") ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-neutral-300">—</span>}</td>
                        <td className="text-center py-2">
                          {f === "General Channels" || f === "VIP Rooms" ? <Check className="w-4 h-4 text-emerald-500 mx-auto" /> : <span className="text-neutral-300">—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
