import { useEffect, useRef, useState } from "react";
import { trpc } from "@/providers/trpc";
import { Users, Building2, Globe, Wifi } from "lucide-react";

function AnimatedCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const [hasAnimated, setHasAnimated] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const duration = 2000;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(Math.floor(current));
            }
          }, duration / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, hasAnimated]);

  return (
    <div ref={ref} className="text-3xl sm:text-4xl font-bold text-[#0d0d0d]">
      {count.toLocaleString()}{suffix}
    </div>
  );
}

export default function MetricsBar() {
  const { data: stats } = trpc.stats.public.useQuery();

  const metrics = [
    { icon: Users, label: "Members", value: stats?.member_count ?? 0, suffix: "+" },
    { icon: Building2, label: "Organizations", value: stats?.org_count ?? 0, suffix: "" },
    { icon: Globe, label: "Cities", value: 12, suffix: "" },
    { icon: Wifi, label: "Hubs", value: 8, suffix: "" },
  ];

  return (
    <section className="bg-white border-y border-neutral-200 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {metrics.map((m) => (
            <div key={m.label} className="text-center">
              <m.icon className="w-5 h-5 text-[#0d6efd] mx-auto mb-3" />
              <AnimatedCounter target={m.value} suffix={m.suffix} />
              <p className="text-sm text-neutral-500 mt-1">{m.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
