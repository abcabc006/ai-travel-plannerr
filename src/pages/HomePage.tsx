import Hero from "@/src/components/Hero";
import HowItWorks from "@/src/components/HowItWorks";
import Features from "@/src/components/Features";
import CommunityPlans from "@/src/components/CommunityPlans";
import Navbar from "@/src/components/Navbar";
import Footer from "@/src/components/Footer";

export default function HomePage() {
  return (
    <div className="min-h-screen">
      <Navbar />
      <main>
        <Hero />
        <HowItWorks />
        <Features />
        <CommunityPlans />
      </main>
      <Footer />
    </div>
  );
}
