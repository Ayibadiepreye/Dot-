import { Clock, Coins, Users2, MessageCircle, TrendingUp } from "lucide-react";

const benefits = [
  {
    icon: Clock,
    title: "90-Day Builder Program",
    description: "Intensive 90-day program to take your idea from concept to launched product with mentorship.",
  },
  {
    icon: Coins,
    title: "$2,000 Builder Credits",
    description: "Platform credits to access tools, resources, and services within the DOT ecosystem.",
  },
  {
    icon: Users2,
    title: "Founder Access",
    description: "Connect with founders across Africa. Share experiences, get feedback, and find co-founders.",
  },
  {
    icon: MessageCircle,
    title: "Community Access",
    description: "Join tier-matched rooms on Whop — from General channels to exclusive VIP and Founder spaces.",
  },
  {
    icon: TrendingUp,
    title: "Funding Pathways",
    description: "Get introductions to investors, grants, and funding opportunities tailored to your stage.",
  },
];

export default function BenefitsGrid() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0d0d0d] mb-4">What Members Get</h2>
          <p className="text-neutral-600 max-w-xl mx-auto">Everything you need to build, launch, and scale — all in one membership.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {benefits.map((b, i) => (
            <div
              key={i}
              className="group p-6 rounded-2xl border border-neutral-200 hover:border-[#0d0d0d]/20 hover:shadow-lg transition-all bg-white"
            >
              <div className="w-10 h-10 bg-[#f5f4f1] rounded-xl flex items-center justify-center mb-4 group-hover:bg-[#0d0d0d] transition-colors">
                <b.icon className="w-5 h-5 text-[#0d0d0d] group-hover:text-white transition-colors" />
              </div>
              <h3 className="font-semibold text-[#0d0d0d] mb-2">{b.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{b.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
