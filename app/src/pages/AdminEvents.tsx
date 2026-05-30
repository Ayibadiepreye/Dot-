import { useState } from "react";
import AdminNav from "@/components/layout/AdminNav";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, XCircle, Camera } from "lucide-react";

export default function AdminEvents() {
  const [token, setToken] = useState("");
  const [result, setResult] = useState<{ success: boolean; message: string; user?: { name: string; tier: string } } | null>(null);

  const scanMutation = trpc.checkin.scan.useMutation({
    onSuccess: (data) => {
      if (data.error) {
        setResult({ success: false, message: data.error === "ALREADY_CHECKED_IN" ? `Already checked in at ${data.checkedInAt ? new Date(data.checkedInAt).toLocaleTimeString() : ""}` : "Invalid token" });
      } else {
        setResult({ success: true, message: "Check-in successful!", user: data.user });
      }
    },
    onError: (err) => {
      setResult({ success: false, message: err.message });
    },
  });

  const handleScan = () => {
    if (!token.trim()) return;
    scanMutation.mutate({ token: token.trim() });
    setToken("");
  };

  return (
    <div className="min-h-screen bg-[#f5f4f1] flex">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-2xl mx-auto">
          <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Event Check-in</h1>

          <Card className="border-neutral-200 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Camera className="w-4 h-4" /> QR Scanner</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-neutral-900 rounded-xl p-8 text-center">
                <Camera className="w-12 h-12 text-neutral-600 mx-auto mb-3" />
                <p className="text-sm text-neutral-500">Camera-based scanning would be active here.</p>
                <p className="text-xs text-neutral-600 mt-1">Use manual entry below as fallback.</p>
              </div>

              <div className="flex gap-2">
                <Input
                  placeholder="Enter QR token (e.g., DOT-A3F9X2K1)"
                  value={token}
                  onChange={(e) => setToken(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleScan()}
                />
                <Button onClick={handleScan} disabled={scanMutation.isPending} className="bg-[#0d0d0d] text-white">
                  {scanMutation.isPending ? "..." : "Check In"}
                </Button>
              </div>
            </CardContent>
          </Card>

          {result && (
            <div className={`rounded-xl p-4 flex items-start gap-3 ${result.success ? "bg-emerald-50 border border-emerald-200" : "bg-red-50 border border-red-200"}`}>
              {result.success ? <CheckCircle className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" /> : <XCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />}
              <div>
                <p className={`text-sm font-medium ${result.success ? "text-emerald-700" : "text-red-700"}`}>{result.message}</p>
                {result.user && (
                  <div className="mt-2 flex items-center gap-2">
                    <Badge variant="outline">{result.user.tier}</Badge>
                    <span className="text-sm text-neutral-600">{result.user.name}</span>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
