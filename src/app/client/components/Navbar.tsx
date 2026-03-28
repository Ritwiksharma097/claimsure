"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home",         href: "/client"               },
  { label: "About",        href: "/client/about"          },
  { label: "Services",     href: "/client/services"       },
  { label: "How It Works", href: "/client/how-it-works"   },
  { label: "Contact",      href: "/client/contact"        },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled]     = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0, left: 0, right: 0,
          zIndex: 1000,
          height: "72px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "0 clamp(1.5rem, 5vw, 4rem)",
          background: scrolled ? "rgba(10,15,30,0.95)" : "rgba(10,15,30,0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          transition: "background 0.3s ease",
        }}
      >
        {/* Logo */}
        <Link
          href="/client"
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none" }}
        >
          <div
            style={{
              width: "36px", height: "36px",
              background: "linear-gradient(135deg, #00b4c8, #00d4eb)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px",
              boxShadow: "0 0 20px rgba(0,180,200,0.3)",
            }}
          >⚕</div>
          <span
            style={{
              fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
              fontSize: "1.5rem", fontWeight: 600, color: "#f8f6f0",
            }}
          >
            Claim<span style={{ color: "#00b4c8" }}>Sure</span>
          </span>
        </Link>

        {/* Desktop links */}
        <ul
          className="hidden md:flex"
          style={{ display: "flex", alignItems: "center", gap: "2.25rem", listStyle: "none", margin: 0, padding: 0 }}
        >
          {navLinks.map((l) => {
            const active = pathname === l.href;
            return (
              <li key={l.href}>
                <Link
                  href={l.href}
                  style={{
                    color: active ? "#f8f6f0" : "#9aabb8",
                    textDecoration: "none",
                    fontSize: "0.875rem",
                    fontWeight: active ? 500 : 400,
                    letterSpacing: "0.04em",
                    textTransform: "uppercase",
                    transition: "color 0.2s",
                    borderBottom: active ? "1px solid #00b4c8" : "1px solid transparent",
                    paddingBottom: "2px",
                  }}
                >
                  {l.label}
                </Link>
              </li>
            );
          })}
          <li>
            <Link
              href="/client/portal"
              style={{
                padding: "0.5rem 1.5rem",
                border: "1px solid rgba(0,180,200,0.4)",
                color: "#00b4c8",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 500,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.currentTarget as HTMLElement).style.background = "rgba(0,180,200,0.08)";
              }}
              onMouseLeave={(e) => {
                (e.currentTarget as HTMLElement).style.background = "transparent";
              }}
            >
              My Portal
            </Link>
          </li>
          <li>
            <Link
              href="/client/register"
              style={{
                padding: "0.5rem 1.5rem",
                background: "linear-gradient(135deg,#00b4c8,#00d4eb)",
                color: "#0a0f1e",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.875rem",
                fontWeight: 700,
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "all 0.3s ease",
                boxShadow: "0 0 16px rgba(0,180,200,0.2)",
              }}
            >
              Register
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex md:hidden"
          style={{ background: "none", border: "none", color: "#f8f6f0", fontSize: "1.5rem", cursor: "pointer", padding: "0.25rem" }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: "72px", left: 0, right: 0,
            zIndex: 999,
            background: "rgba(10,15,30,0.98)",
            backdropFilter: "blur(20px)",
            padding: "1.5rem 2rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "0.875rem 0",
                color: pathname === l.href ? "#f8f6f0" : "#9aabb8",
                textDecoration: "none",
                fontSize: "1rem",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
                fontWeight: pathname === l.href ? 600 : 400,
              }}
            >
              {l.label}
            </Link>
          ))}
          <Link
            href="/client/portal"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "block",
              marginTop: "1.25rem",
              padding: "0.875rem 1.5rem",
              border: "1px solid rgba(0,180,200,0.4)",
              color: "#00b4c8",
              borderRadius: "4px",
              textDecoration: "none",
              textAlign: "center",
              fontSize: "0.9375rem",
              fontWeight: 500,
            }}
          >
            My Portal
          </Link>
          <Link
            href="/client/register"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "block",
              marginTop: "0.75rem",
              padding: "0.875rem 1.5rem",
              background: "linear-gradient(135deg,#00b4c8,#00d4eb)",
              color: "#0a0f1e",
              borderRadius: "4px",
              textDecoration: "none",
              fontWeight: 700,
              textAlign: "center",
              fontSize: "0.9375rem",
            }}
          >
            Register Now
          </Link>
        </div>
      )}
    </>
  );
}
