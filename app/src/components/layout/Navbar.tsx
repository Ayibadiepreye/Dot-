import { Link } from "react-router";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { LogOut, LayoutDashboard, Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav className="w-full border-b border-neutral-200 bg-white/80 backdrop-blur-md fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-[#0d0d0d] rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">D</span>
            </div>
            <span className="text-xl font-bold text-[#0d0d0d] tracking-tight">DOT</span>
          </Link>

          <div className="hidden md:flex items-center gap-6">
            <Link to="/" className="text-sm text-neutral-600 hover:text-[#0d0d0d] transition-colors">Home</Link>
            <Link to="/join" className="text-sm text-neutral-600 hover:text-[#0d0d0d] transition-colors">Pricing</Link>
            <Link to="/become-affiliate" className="text-sm text-neutral-600 hover:text-[#0d0d0d] transition-colors">Affiliate</Link>
            <Link to="/become-partner" className="text-sm text-neutral-600 hover:text-[#0d0d0d] transition-colors">Partner</Link>
          </div>

          <div className="hidden md:flex items-center gap-3">
            {isAuthenticated && user ? (
              <div className="flex items-center gap-3">
                <Link to="/dashboard">
                  <Button variant="ghost" size="sm" className="gap-2">
                    <LayoutDashboard className="w-4 h-4" />
                    Dashboard
                  </Button>
                </Link>
                <Avatar className="w-8 h-8">
                  <AvatarImage src={user.avatar ?? undefined} />
                  <AvatarFallback className="bg-[#0d6efd] text-white text-xs">
                    {user.name?.[0] ?? "D"}
                  </AvatarFallback>
                </Avatar>
                <Button variant="ghost" size="icon" onClick={logout} className="text-neutral-500">
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            ) : (
              <Link to="/login">
                <Button className="bg-[#0d0d0d] hover:bg-[#1a1a1a] text-white">Sign In</Button>
              </Link>
            )}
          </div>

          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="md:hidden bg-white border-t border-neutral-200 px-4 py-4 space-y-3">
          <Link to="/" className="block text-sm text-neutral-600" onClick={() => setMobileOpen(false)}>Home</Link>
          <Link to="/join" className="block text-sm text-neutral-600" onClick={() => setMobileOpen(false)}>Pricing</Link>
          <Link to="/become-affiliate" className="block text-sm text-neutral-600" onClick={() => setMobileOpen(false)}>Affiliate</Link>
          <Link to="/become-partner" className="block text-sm text-neutral-600" onClick={() => setMobileOpen(false)}>Partner</Link>
          {isAuthenticated ? (
            <>
              <Link to="/dashboard" className="block text-sm text-neutral-600" onClick={() => setMobileOpen(false)}>Dashboard</Link>
              <button onClick={() => { logout(); setMobileOpen(false); }} className="block text-sm text-red-600">Sign Out</button>
            </>
          ) : (
            <Link to="/login" className="block" onClick={() => setMobileOpen(false)}>
              <Button className="w-full bg-[#0d0d0d] text-white">Sign In</Button>
            </Link>
          )}
        </div>
      )}
    </nav>
  );
}
