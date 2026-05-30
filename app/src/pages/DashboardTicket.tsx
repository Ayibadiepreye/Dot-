import DashboardNav from "@/components/layout/DashboardNav";
import { useAuth } from "@/hooks/useAuth";
import { PaymentRequired } from "@/components/PaymentRequired";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { getTierLabel, getTierColor } from "@/lib/utils";
import { Calendar, MapPin, Download } from "lucide-react";

export default function DashboardTicket() {
  const { user } = useAuth();
  const { data: ticket, isLoading } = trpc.user.ticket.useQuery();

  // Payment gate check
  if (!user?.hasPaid) {
    return (
      <div className="min-h-screen bg-[#f5f4f1] flex">
        <DashboardNav />
        <main className="flex-1 p-8">
          <div className="max-w-md mx-auto">
            <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Event Ticket</h1>
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
        <div className="max-w-md mx-auto">
          <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Event Ticket</h1>

          {isLoading ? (
            <Skeleton className="h-96 w-full" />
          ) : (
            <Card className="border-neutral-200 overflow-hidden">
              <div className="bg-[#0d0d0d] text-white p-6 text-center">
                <h2 className="text-lg font-bold mb-1">DOT Cohort I Launch</h2>
                <p className="text-xs text-neutral-400">Africa's Largest Builder Ecosystem</p>
              </div>
              <CardContent className="p-6">
                <div className="bg-neutral-100 rounded-xl p-6 mb-4 flex items-center justify-center">
                  {ticket?.qrUrl ? (
                    <img src={ticket.qrUrl} alt="QR Code" className="w-48 h-48" />
                  ) : (
                    <div className="w-48 h-48 bg-white rounded-lg flex items-center justify-center border-2 border-dashed border-neutral-300">
                      <div className="text-center">
                        <div className="text-3xl font-mono font-bold text-[#0d0d0d] mb-1">{ticket?.qrCode ?? "PENDING"}</div>
                        <p className="text-[10px] text-neutral-400">QR CODE</p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="text-center mb-4">
                  <p className="font-mono text-sm text-neutral-600">{ticket?.qrCode ?? "DOT-XXXXXXXX"}</p>
                  <p className="text-xs text-neutral-400 mt-1">Present this QR at the venue entrance</p>
                </div>

                <div className="space-y-3 mb-6">
                  <div className="flex items-center gap-3 text-sm">
                    <Calendar className="w-4 h-4 text-neutral-400" />
                    <span>Friday, May 29, 2026 — 9:00 AM WAT</span>
                  </div>
                  <div className="flex items-center gap-3 text-sm">
                    <MapPin className="w-4 h-4 text-neutral-400" />
                    <span>Family Hall</span>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-4 border-t border-neutral-200">
                  <div>
                    <p className="text-sm font-medium">{user?.name ?? "Member"}</p>
                    <Badge className={getTierColor(user?.tier ?? "starter")}>{getTierLabel(user?.tier ?? "starter")}</Badge>
                  </div>
                  {ticket?.checkedIn && (
                    <Badge className="bg-emerald-100 text-emerald-700">Checked In</Badge>
                  )}
                </div>

                {ticket?.qrUrl && (
                  <a href={ticket.qrUrl} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-1.5 text-xs text-[#0d6efd] mt-4 hover:underline">
                    <Download className="w-3.5 h-3.5" /> Download QR
                  </a>
                )}
              </CardContent>
            </Card>
          )}
        </div>
      </main>
    </div>
  );
}
