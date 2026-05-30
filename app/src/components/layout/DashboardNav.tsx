import { Link, useLocation, useNavigate } from "react-router";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Wallet, Users, QrCode, MessageCircle, Settings, LogOut } from "lucide-react";
import { trpc } from "@/providers/trpc";
import { Button } from "@/components/ui/button";

const navItems = [
  { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { label: "Wallet", href: "/dashboard/wallet", icon: Wallet },
  { label: "Referrals", href: "/dashboard/referrals", icon: Users },
  { label: "Ticket", href: "/dashboard/ticket", icon: QrCode },
  { label: "Community", href: "/dashboard/community", icon: MessageCircle },
];

export default function DashboardNav() {
  const location = useLocation();
  const navigate = useNavigate();

  const logoutMutation = trpc.auth.logout.useMutation({
    onSuccess: () => {
      navigate("/login");
    },
  });

  const handleLogout = () => {
    logoutMutation.mutate();
  };

  return (
    <nav className="w-64 bg-white border-r border-neutral-200 min-h-screen flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-[#0d0d0d] rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">D</span>
          </div>
          <span className="text-lg font-bold text-[#0d0d0d]">DOT</span>
        </Link>
      </div>

      <div className="flex-1 px-3 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.href}
            to={item.href}
            className={cn(
              "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
              location.pathname === item.href
                ? "bg-[#0d0d0d] text-white"
                : "text-neutral-600 hover:bg-neutral-100"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="p-3 border-t border-neutral-200 space-y-1">
        <Link to="/dashboard/settings" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-600 hover:bg-neutral-100 transition-colors">
          <Settings className="w-4 h-4" />
          Settings
        </Link>
        <Button
          variant="ghost"
          className="w-full justify-start gap-3 px-3 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 hover:text-red-700"
          onClick={handleLogout}
          disabled={logoutMutation.isPending}
        >
          <LogOut className="w-4 h-4" />
          {logoutMutation.isPending ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </nav>
  );
}
