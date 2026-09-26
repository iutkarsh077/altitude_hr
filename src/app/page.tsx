import CloudShaderHeroDemo from "@/components/cloud-shader-hero-demo";
import LandingBentoFeatures from "@/components/landing-bento-features";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <CloudShaderHeroDemo />
      <LandingBentoFeatures />
      <Footer />
    </main>
  );
}



