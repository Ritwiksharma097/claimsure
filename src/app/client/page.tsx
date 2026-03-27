import { Navbar }     from "./components/Navbar";
import { Hero }       from "./components/Hero";
import { TrustedBy }  from "./components/TrustedBy";
import { About }      from "./components/About";
import { Services }   from "./components/Services";
import { HowItWorks } from "./components/HowItWorks";
import { StatsBand }  from "./components/StatsBand";
import { Contact }    from "./components/Contact";
import { Footer }     from "./components/Footer";

export const metadata = {
  title: "ClaimBridge — Intelligent Claims Management",
  description:
    "India's intelligent health insurance claims management platform built for hospitals, TPAs, and healthcare networks.",
};

export default function ClientPage() {
  return (
    <div
      style={{
        background: "#0a0f1e",
        color: "#f8f6f0",
        minHeight: "100vh",
        fontFamily: "var(--font-outfit, 'Outfit', sans-serif)",
      }}
    >
      <Navbar />
      <Hero />
      <TrustedBy />
      <About />
      <Services />
      <HowItWorks />
      <StatsBand />
      <Contact />
      <Footer />
    </div>
  );
}
