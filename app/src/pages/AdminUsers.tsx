import { useState } from "react";
import AdminNav from "@/components/layout/AdminNav";
import { trpc } from "@/providers/trpc";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { getTierLabel, getTierColor } from "@/lib/utils";
import { Search, Download, Ban } from "lucide-react";

export default function AdminUsers() {
  const [search, setSearch] = useState("");
  const [tier, setTier] = useState("");
  const [role, setRole] = useState("");
  const [page] = useState(1);

  const { data, isLoading, refetch } = trpc.admin.users.useQuery({ search, tier, role, page, limit: 50 });
  const banMutation = trpc.admin.banUser.useMutation({ onSuccess: () => refetch() });

  const handleExport = () => {
    const rows = data?.rows ?? [];
    const csv = [
      ["ID", "Name", "Email", "Phone", "Tier", "Role", "Referral Code", "Joined"],
      ...rows.map((u) => [u.id, u.name ?? "", u.email, u.phone ?? "", u.tier, u.role, u.referralCode, new Date(u.createdAt).toISOString()]),
    ].map((r) => r.join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "users.csv";
    a.click();
  };

  return (
    <div className="min-h-screen bg-[#f5f4f1] flex">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-6xl">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-[#0d0d0d]">Users</h1>
            <Button variant="outline" size="sm" onClick={handleExport} className="gap-1.5"><Download className="w-4 h-4" /> Export CSV</Button>
          </div>

          <div className="flex gap-3 mb-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
              <Input placeholder="Search name, email, phone, referral code..." value={search} onChange={(e) => setSearch(e.target.value)} className="pl-9" />
            </div>
            <Select value={tier} onValueChange={setTier}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Tier" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tiers</SelectItem>
                <SelectItem value="starter">Starter</SelectItem>
                <SelectItem value="vip">VIP</SelectItem>
                <SelectItem value="pioneer">Pioneer</SelectItem>
                <SelectItem value="corporate">Corporate</SelectItem>
                <SelectItem value="hub_partner">Hub Partner</SelectItem>
              </SelectContent>
            </Select>
            <Select value={role} onValueChange={setRole}>
              <SelectTrigger className="w-36"><SelectValue placeholder="Role" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="member">Member</SelectItem>
                <SelectItem value="org_admin">Org Admin</SelectItem>
                <SelectItem value="ops">Ops</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
              </SelectContent>
            </Select>
          </div>

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
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Name</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Email</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Tier</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Role</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Joined</th>
                        <th className="text-left px-4 py-3 font-medium text-neutral-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(data?.rows ?? []).map((user) => (
                        <tr key={user.id} className="border-b border-neutral-100 last:border-0 hover:bg-neutral-50">
                          <td className="px-4 py-3">{user.name ?? "—"}</td>
                          <td className="px-4 py-3 text-neutral-500">{user.email}</td>
                          <td className="px-4 py-3"><Badge className={getTierColor(user.tier)}>{getTierLabel(user.tier)}</Badge></td>
                          <td className="px-4 py-3"><Badge variant="outline">{user.role}</Badge></td>
                          <td className="px-4 py-3 text-neutral-400">{new Date(user.createdAt).toLocaleDateString()}</td>
                          <td className="px-4 py-3">
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600" onClick={() => banMutation.mutate({ userId: user.id })}>
                              <Ban className="w-4 h-4" />
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
