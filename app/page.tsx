import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { JsonLd } from "@/components/JsonLd";
import { Hero } from "@/components/hero/Hero";
import { About } from "@/components/sections/About";
import { Contact } from "@/components/sections/Contact";
import { Coverage } from "@/components/sections/Coverage";
import { CtaBand } from "@/components/sections/CtaBand";
import { Faq } from "@/components/sections/Faq";
import { Process } from "@/components/sections/Process";
import { Services } from "@/components/sections/Services";
import { TrustBar } from "@/components/sections/TrustBar";
import { Vessels } from "@/components/sections/Vessels";
import { WhyUs } from "@/components/sections/WhyUs";

export default function Home() {
  return (
    <>
      <Header />
      <main id="main">
        <Hero />
        <TrustBar />
        <About />
        <Services />
        <Vessels />
        <WhyUs />
        <Coverage />
        <Process />
        <CtaBand />
        <Contact />
        <Faq />
      </main>
      <Footer />
      <JsonLd />
    </>
  );
}
