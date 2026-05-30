import { Link } from "react-router";
import { Button } from "@/components/ui/button";
import { ArrowRight, Sparkles, Building2, Users } from "lucide-react";

export default function HeroSection() {
  return (
    <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden bg-[#f5f4f1]">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, #0d0d0d 1px, transparent 1px), radial-gradient(circle at 75% 75%, #0d0d0d 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }} />
      </div>

      <div className="absolute top-20 right-10 w-72 h-72 bg-emerald-200/30 rounded-full blur-3xl" />
      <div className="absolute bottom-20 left-10 w-96 h-96 bg-amber-200/20 rounded-full blur-3xl" />

      <div className="relative max-w-5xl mx-auto px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur border border-neutral-200 rounded-full px-4 py-1.5 text-xs font-medium text-neutral-600 mb-6">
          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
          Cohort I Launch: May 29, 2026
        </div>

        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-[#0d0d0d] tracking-tight leading-[1.05] mb-6">
          Africa's Largest{" "}
          <span className="relative">
            Builder Ecosystem
            <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 300 8" fill="none">
              <path d="M2 6C50 2 100 2 150 4C200 6 250 4 298 2" stroke="#0d6efd" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </span>
        </h1>

        <p className="text-lg sm:text-xl text-neutral-600 max-w-2xl mx-auto mb-10 leading-relaxed">
          Join 1,000,000 founders, creators, and entrepreneurs building the future. 
          Get $2,000 in builder credits, exclusive community access, and a path to funding.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12">
          <Link to="/join">
            <Button size="lg" className="bg-[#0d0d0d] hover:bg-[#1a1a1a] text-white px-8 h-12 text-base gap-2">
              Join DOT <ArrowRight className="w-4 h-4" />
            </Button>
          </Link>
          <Link to="/become-partner">
            <Button size="lg" variant="outline" className="border-[#0d0d0d] text-[#0d0d0d] hover:bg-[#0d0d0d] hover:text-white px-8 h-12 text-base gap-2">
              <Building2 className="w-4 h-4" /> Become Partner
            </Button>
          </Link>
          <Link to="/become-affiliate">
            <Button size="lg" variant="outline" className="border-neutral-300 text-neutral-700 hover:bg-neutral-100 px-8 h-12 text-base gap-2">
              <Users className="w-4 h-4" /> Become Affiliate
            </Button>
          </Link>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-neutral-500">
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Secure Payments
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Instant Access
          </span>
          <span className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Community Included
          </span>
        </div>
      </div>
    </section>
  );
}
