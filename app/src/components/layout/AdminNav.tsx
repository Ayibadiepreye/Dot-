import { Link, useLocation } from "react-router";
import { cn } from "@/lib/utils";
import { LayoutDashboard, Users, CreditCard, Users2, Building2, Calendar, Image, ArrowLeft } from "lucide-react";

const navItems = [
  { label: "Overview", href: "/admin", icon: LayoutDashboard },
  { label: "Users", href: "/admin/users", icon: Users },
  { label: "Payments", href: "/admin/payments", icon: CreditCard },
  { label: "Affiliates", href: "/admin/affiliates", icon: Users2 },
  { label: "Organizations", href: "/admin/organizations", icon: Building2 },
  { label: "Event Check-in", href: "/admin/events", icon: Calendar },
  { label: "Content", href: "/admin/content", icon: Image },
];

export default function AdminNav() {
  const location = useLocation();

  return (
    <nav className="w-64 bg-[#0d0d0d] text-white min-h-screen flex flex-col">
      <div className="p-6">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center">
            <span className="text-[#0d0d0d] font-bold text-sm">D</span>
          </div>
          <span className="text-lg font-bold">DOT Admin</span>
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
                ? "bg-white/10 text-white"
                : "text-neutral-400 hover:text-white hover:bg-white/5"
            )}
          >
            <item.icon className="w-4 h-4" />
            {item.label}
          </Link>
        ))}
      </div>

      <div className="p-3 border-t border-white/10">
        <Link to="/dashboard" className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-neutral-400 hover:text-white hover:bg-white/5 transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back to Dashboard
        </Link>
      </div>
    </nav>
  );
}
