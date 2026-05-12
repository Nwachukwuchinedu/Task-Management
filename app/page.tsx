import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import LogosMarquee from "@/components/LogosMarquee";
import StatsBar from "@/components/StatsBar";
import Features from "@/components/Features";
import Pricing from "@/components/Pricing";
import { CTA, Footer } from "@/components/Footer";

export default function Home() {
  return (
    <main className="bg-background text-text-main selection:bg-primary/30 selection:text-white antialiased min-h-screen relative">
      {/* CSS Noise Texture Overlay */}
      <div className="pointer-events-none fixed inset-0 z-50 opacity-[0.03] w-full h-full mix-blend-overlay">
        <svg className="w-full h-full">
          <filter id="noise">
            <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="4" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noise)" />
        </svg>
      </div>

      <Navbar />
      <Hero />
      <LogosMarquee />
      <StatsBar />
      <Features />
      <Pricing />
      <CTA />
      <Footer />
    </main>
  );
}
