import AdminNav from "@/components/layout/AdminNav";
import { trpc } from "@/providers/trpc";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { Image, HelpCircle } from "lucide-react";

export default function AdminContent() {
  const { data: logos, isLoading: logosLoading } = trpc.content.allPartnerLogos.useQuery();
  const { data: faqs, isLoading: faqsLoading } = trpc.content.allFaqs.useQuery();
  const utils = trpc.useUtils();

  const updateLogo = trpc.content.updatePartnerLogo.useMutation({ onSuccess: () => utils.content.allPartnerLogos.invalidate() });
  const updateFaq = trpc.content.updateFaq.useMutation({ onSuccess: () => utils.content.allFaqs.invalidate() });

  return (
    <div className="min-h-screen bg-[#f5f4f1] flex">
      <AdminNav />
      <main className="flex-1 p-8">
        <div className="max-w-4xl">
          <h1 className="text-2xl font-bold text-[#0d0d0d] mb-6">Content Management</h1>

          <Card className="border-neutral-200 mb-6">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><Image className="w-4 h-4" /> Partner Logos</CardTitle>
            </CardHeader>
            <CardContent>
              {logosLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : (
                <div className="space-y-2">
                  {(logos ?? []).map((logo) => (
                    <div key={logo.id} className="flex items-center justify-between py-2 border-b border-neutral-100 last:border-0">
                      <div className="flex items-center gap-3">
                        <img src={logo.logoUrl} alt={logo.name} className="h-6 object-contain" />
                        <span className="text-sm">{logo.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-neutral-400">Order: {logo.displayOrder}</span>
                        <Switch checked={logo.active ?? false} onCheckedChange={(c) => updateLogo.mutate({ id: logo.id, active: c })} />
                      </div>
                    </div>
                  ))}
                  {(logos ?? []).length === 0 && <p className="text-sm text-neutral-500">No logos.</p>}
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="border-neutral-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2"><HelpCircle className="w-4 h-4" /> FAQs</CardTitle>
            </CardHeader>
            <CardContent>
              {faqsLoading ? (
                <div className="space-y-2">
                  {Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-10 w-full" />)}
                </div>
              ) : (
                <div className="space-y-2">
                  {(faqs ?? []).map((faq) => (
                    <div key={faq.id} className="py-2 border-b border-neutral-100 last:border-0">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-sm font-medium text-[#0d0d0d]">{faq.question}</p>
                        <Switch checked={faq.active ?? false} onCheckedChange={(c) => updateFaq.mutate({ id: faq.id, active: c })} />
                      </div>
                      <p className="text-xs text-neutral-500 line-clamp-2">{faq.answer}</p>
                    </div>
                  ))}
                  {(faqs ?? []).length === 0 && <p className="text-sm text-neutral-500">No FAQs.</p>}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
