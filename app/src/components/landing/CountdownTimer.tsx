import { useEffect, useState } from "react";
import { MAY_29_EVENT_DATE } from "@contracts/constants";
import { Button } from "@/components/ui/button";
import { Link } from "react-router";
import { Flame } from "lucide-react";

function getTimeRemaining(target: Date) {
  const diff = target.getTime() - Date.now();
  if (diff <= 0) return null;
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

export default function CountdownTimer() {
  const [time, setTime] = useState(getTimeRemaining(MAY_29_EVENT_DATE));

  useEffect(() => {
    const timer = setInterval(() => {
      setTime(getTimeRemaining(MAY_29_EVENT_DATE));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  if (!time) {
    return (
      <section className="py-20 bg-[#0d0d0d] text-white text-center">
        <div className="max-w-2xl mx-auto px-4">
          <div className="inline-flex items-center gap-2 bg-emerald-500/20 text-emerald-400 rounded-full px-4 py-1.5 text-xs font-medium mb-4">
            <Flame className="w-3.5 h-3.5" /> LIVE NOW
          </div>
          <h2 className="text-3xl sm:text-4xl font-bold mb-4">Event is LIVE — Join Now</h2>
          <p className="text-neutral-400 mb-6">The Cohort I launch event is happening right now at Family Hall.</p>
          <Link to="/join">
            <Button className="bg-emerald-500 hover:bg-emerald-600 text-white">Join DOT</Button>
          </Link>
        </div>
      </section>
    );
  }

  const units = [
    { label: "Days", value: time.days },
    { label: "Hours", value: time.hours },
    { label: "Minutes", value: time.minutes },
    { label: "Seconds", value: time.seconds },
  ];

  return (
    <section className="py-20 bg-[#0d0d0d] text-white text-center">
      <div className="max-w-3xl mx-auto px-4">
        <p className="text-sm text-neutral-400 uppercase tracking-wider mb-6">Cohort I Launch Countdown</p>
        <div className="flex justify-center gap-4 sm:gap-6 mb-8">
          {units.map((u) => (
            <div key={u.label} className="text-center">
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/10 rounded-xl flex items-center justify-center mb-2 backdrop-blur">
                <span className="text-2xl sm:text-3xl font-bold">{String(u.value).padStart(2, "0")}</span>
              </div>
              <p className="text-xs text-neutral-400">{u.label}</p>
            </div>
          ))}
        </div>
        <p className="text-neutral-400 text-sm mb-6">
          Friday, May 29, 2026 — Family Hall
        </p>
        <Link to="/join">
          <Button className="bg-white text-[#0d0d0d] hover:bg-neutral-100">Secure Your Spot</Button>
        </Link>
      </div>
    </section>
  );
}
