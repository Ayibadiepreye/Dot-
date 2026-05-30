import { useState } from "react";
import { Link } from "react-router";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building2, CheckCircle } from "lucide-react";

export default function BecomePartner() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-[#f5f4f1]">
      <Navbar />
      <main className="pt-24 pb-16">
        <div className="max-w-lg mx-auto px-4">
          <Link to="/" className="text-sm text-neutral-600 hover:text-[#0d0d0d]">Back to home</Link>

          {submitted ? (
            <Card className="mt-6 border-emerald-200">
              <CardContent className="p-8 text-center">
                <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h2 className="text-xl font-bold text-[#0d0d0d] mb-2">Application Received</h2>
                <p className="text-sm text-neutral-600">We'll contact you within 48 hours.</p>
              </CardContent>
            </Card>
          ) : (
            <Card className="mt-6 border-neutral-200">
              <CardHeader className="text-center pb-4">
                <Building2 className="w-10 h-10 text-[#0d6efd] mx-auto mb-2" />
                <CardTitle className="text-xl">Become a Partner</CardTitle>
                <p className="text-sm text-neutral-500">Apply for Corporate or Hub Partner membership.</p>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div><Label className="text-xs">Organization Name</Label><Input required placeholder="Your company name" className="mt-1" /></div>
                  <div><Label className="text-xs">Contact Email</Label><Input type="email" required placeholder="partner@company.com" className="mt-1" /></div>
                  <div><Label className="text-xs">Country</Label><Input placeholder="Nigeria" className="mt-1" /></div>
                  <div><Label className="text-xs">Website</Label><Input placeholder="https://company.com" className="mt-1" /></div>
                  <div><Label className="text-xs">Description</Label><Textarea placeholder="Tell us about your organization..." className="mt-1" /></div>
                  <Button type="submit" className="w-full bg-[#0d0d0d] hover:bg-[#1a1a1a] text-white">Submit Application</Button>
                </form>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
