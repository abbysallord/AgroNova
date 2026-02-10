import { Navbar } from "@/components/landing/Navbar";
import { HeroSection } from "@/components/landing/HeroSection";
import { FeaturesSection } from "@/components/landing/FeaturesSection";
import { CommunitySection } from "@/components/landing/CommunitySection";
import { AboutSection } from "@/components/landing/AboutSection";
import { Footer } from "@/components/landing/Footer";
import Grainient from "@/components/Grainient";
import GradualBlur from "@/components/GradualBlur";
import { ChatWidget } from "@/components/landing/ChatWidget";

export default function Home() {
  const lightGreenTheme = {
    color1: "#ffffff", // white
    color2: "#dcfce7", // green-100
    color3: "#f0fdf4"  // green-50
  };

  return (
    <div className="relative min-h-screen text-neutral-900">
      {/* Global Fixed Background */}
      <div className="fixed inset-0 z-[-10]">
        <Grainient
          {...lightGreenTheme}
          grainAmount={0.05}
          grainScale={1.5}
        />
      </div>

      <GradualBlur
        className="z-[5] pointer-events-none"
        position="bottom"
        target="page"
        strength={2}
        height="8rem"
        opacity={0.8}
        zIndex={-90}
      />

      <Navbar />
      <HeroSection />
      <FeaturesSection />
      <CommunitySection />
      <AboutSection />
      <Footer />
      <ChatWidget />
    </div>
  );
}
