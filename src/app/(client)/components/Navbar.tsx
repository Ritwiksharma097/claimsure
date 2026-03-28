"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

const navLinks = [
  { label: "Home",         href: "/"             },
  { label: "About",        href: "/about"        },
  { label: "Services",     href: "/services"     },
  { label: "How It Works", href: "/how-it-works" },
  { label: "Contact",      href: "/contact"      },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobile,   setIsMobile]   = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close drawer when resizing to desktop
  useEffect(() => {
    if (!isMobile) setMobileOpen(false);
  }, [isMobile]);

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
          padding: "0 clamp(1rem, 5vw, 4rem)",
          background: scrolled ? "rgba(10,15,30,0.97)" : "rgba(10,15,30,0.6)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(255,255,255,0.06)",
          transition: "background 0.3s ease",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{ display: "flex", alignItems: "center", gap: "10px", textDecoration: "none", flexShrink: 0 }}
        >
          <div
            style={{
              width: "36px", height: "36px",
              background: "linear-gradient(135deg,#00b4c8,#00d4eb)",
              borderRadius: "8px",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: "18px",
              boxShadow: "0 0 20px rgba(0,180,200,0.3)",
            }}
          >⚕</div>
          <span
            style={{
              fontFamily: "var(--font-cormorant,'Cormorant Garamond',serif)",
              fontSize: "1.5rem", fontWeight: 600, color: "#f8f6f0",
            }}
          >
            Claim<span style={{ color: "#00b4c8" }}>Sure</span>
          </span>
        </Link>

        {/* Desktop links — hidden on mobile via JS */}
        {!isMobile && (
          <ul
            style={{
              display: "flex",
              alignItems: "center",
              gap: "2.25rem",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
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
                href="/portal"
                style={{
                  padding: "0.5rem 1.25rem",
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
                onMouseEnter={(e) => { (e.currentTarget as HTMLElement).style.background = "rgba(0,180,200,0.08)"; }}
                onMouseLeave={(e) => { (e.currentTarget as HTMLElement).style.background = "transparent"; }}
              >
                My Portal
              </Link>
            </li>
            <li>
              <Link
                href="/register"
                style={{
                  padding: "0.5rem 1.25rem",
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
        )}

        {/* Hamburger — only on mobile */}
        {isMobile && (
          <button
            onClick={() => setMobileOpen((o) => !o)}
            aria-label="Toggle menu"
            style={{
              background: "none",
              border: "1px solid rgba(255,255,255,0.12)",
              color: "#f8f6f0",
              fontSize: "1.25rem",
              cursor: "pointer",
              padding: "0.4rem 0.7rem",
              borderRadius: "6px",
              lineHeight: 1,
            }}
          >
            {mobileOpen ? "✕" : "☰"}
          </button>
        )}
      </nav>

      {/* Mobile drawer */}
      {isMobile && mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: "72px", left: 0, right: 0, bottom: 0,
            zIndex: 999,
            background: "rgba(10,15,30,0.99)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            overflowY: "auto",
            padding: "1.5rem 2rem 3rem",
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {navLinks.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "1rem 0",
                color: pathname === l.href ? "#f8f6f0" : "#9aabb8",
                textDecoration: "none",
                fontSize: "1.125rem",
                fontWeight: pathname === l.href ? 600 : 400,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
              }}
            >
              {l.label}
              {pathname === l.href && (
                <span style={{ color: "#00b4c8", fontSize: "0.75rem" }}>●</span>
              )}
            </Link>
          ))}

          <div style={{ marginTop: "2rem", display: "flex", flexDirection: "column", gap: "0.75rem" }}>
            <Link
              href="/portal"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "0.875rem 1.5rem",
                border: "1px solid rgba(0,180,200,0.4)",
                color: "#00b4c8",
                borderRadius: "8px",
                textDecoration: "none",
                textAlign: "center",
                fontSize: "1rem",
                fontWeight: 500,
              }}
            >
              My Portal
            </Link>
            <Link
              href="/register"
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "0.875rem 1.5rem",
                background: "linear-gradient(135deg,#00b4c8,#00d4eb)",
                color: "#0a0f1e",
                borderRadius: "8px",
                textDecoration: "none",
                fontWeight: 700,
                textAlign: "center",
                fontSize: "1rem",
              }}
            >
              Register Now →
            </Link>
          </div>
        </div>
      )}
    </>
  );
}
