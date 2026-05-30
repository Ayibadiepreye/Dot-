import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import MetricsBar from "@/components/landing/MetricsBar";
import BenefitsGrid from "@/components/landing/BenefitsGrid";
import PricingSection from "@/components/landing/PricingSection";
import PartnerLogos from "@/components/landing/PartnerLogos";
import FAQSection from "@/components/landing/FAQSection";
import CountdownTimer from "@/components/landing/CountdownTimer";

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <Navbar />
      <main>
        <HeroSection />
        <MetricsBar />
        <BenefitsGrid />
        <PricingSection />
        <PartnerLogos />
        <FAQSection />
        <CountdownTimer />
      </main>
      <Footer />
    </div>
  );
}
