import { Hero }       from "./components/Hero";
import { TrustedBy }  from "./components/TrustedBy";
import { StatsBand }  from "./components/StatsBand";
import { QuickLinks } from "./components/QuickLinks";

export const metadata = {
  title: "ClaimBridge — Intelligent Claims Management",
  description:
    "India's intelligent health insurance claims management platform built for hospitals, TPAs, and healthcare networks.",
};

export default function ClientHomePage() {
  return (
    <>
      <Hero />
      <TrustedBy />
      <StatsBand />
      <QuickLinks />
    </>
  );
}
