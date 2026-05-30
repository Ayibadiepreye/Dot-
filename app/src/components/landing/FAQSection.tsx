import { trpc } from "@/providers/trpc";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Skeleton } from "@/components/ui/skeleton";

export default function FAQSection() {
  const { data: faqs, isLoading } = trpc.content.faqs.useQuery();

  if (isLoading) {
    return (
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <Skeleton className="h-10 w-64 mx-auto mb-8" />
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full mb-3" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-[#0d0d0d] mb-4">Frequently Asked Questions</h2>
          <p className="text-neutral-600">Everything you need to know about DOT membership.</p>
        </div>

        <Accordion type="single" collapsible className="space-y-3">
          {(faqs ?? []).map((faq) => (
            <AccordionItem
              key={faq.id}
              value={`faq-${faq.id}`}
              className="border border-neutral-200 rounded-xl px-4 data-[state=open]:border-[#0d0d0d]/30"
            >
              <AccordionTrigger className="text-left text-sm font-medium text-[#0d0d0d] hover:no-underline py-4">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-sm text-neutral-600 leading-relaxed pb-4">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
