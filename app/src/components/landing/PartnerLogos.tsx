import { trpc } from "@/providers/trpc";
import { Skeleton } from "@/components/ui/skeleton";

export default function PartnerLogos() {
  const { data: logos, isLoading } = trpc.content.partnerLogos.useQuery();

  if (isLoading) {
    return (
      <section className="py-14 bg-white border-y border-neutral-200">
        <div className="max-w-6xl mx-auto px-4">
          <p className="text-center text-sm text-neutral-500 mb-8 uppercase tracking-wider">Trusted Partners</p>
          <div className="flex justify-center gap-8">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="w-28 h-10" />
            ))}
          </div>
        </div>
      </section>
    );
  }

  const displayLogos = logos ?? [];
  // Duplicate for seamless scroll
  const allLogos = [...displayLogos, ...displayLogos];

  return (
    <section className="py-14 bg-white border-y border-neutral-200 overflow-hidden">
      <div className="max-w-6xl mx-auto px-4">
        <p className="text-center text-sm text-neutral-500 mb-8 uppercase tracking-wider">Trusted Partners</p>
        <div className="relative">
          <div className="flex gap-12 animate-scroll items-center justify-center">
            {allLogos.map((logo, i) => (
              <div
                key={`${logo.id}-${i}`}
                className="flex-shrink-0 grayscale hover:grayscale-0 opacity-60 hover:opacity-100 transition-all"
              >
                <img
                  src={logo.logoUrl}
                  alt={logo.name}
                  className="h-8 object-contain"
                  loading="lazy"
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
