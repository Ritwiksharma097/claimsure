import { Navbar } from "./components/Navbar";
import { Footer } from "./components/Footer";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div
      style={{
        background: "#0a0f1e",
        color: "#f8f6f0",
        minHeight: "100vh",
        fontFamily: "var(--font-outfit, 'Outfit', sans-serif)",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
      <Footer />
    </div>
  );
}
