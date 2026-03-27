"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const links = [
    { label: "About", href: "#about" },
    { label: "Services", href: "#services" },
    { label: "How It Works", href: "#how" },
    { label: "Contact", href: "#contact" },
  ];

  return (
    <>
      <nav
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          right: 0,
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
        <a
          href="#home"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
          }}
        >
          <div
            style={{
              width: "36px",
              height: "36px",
              background: "linear-gradient(135deg, #00b4c8, #00d4eb)",
              borderRadius: "8px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "18px",
              boxShadow: "0 0 20px rgba(0,180,200,0.3)",
            }}
          >
            ⚕
          </div>
          <span
            style={{
              fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
              fontSize: "1.5rem",
              fontWeight: 600,
              color: "#f8f6f0",
            }}
          >
            Claim<span style={{ color: "#00b4c8" }}>Bridge</span>
          </span>
        </a>

        {/* Desktop links */}
        <ul
          style={{
            display: "flex",
            alignItems: "center",
            gap: "2.5rem",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
          className="hidden md:flex"
        >
          {links.map((l) => (
            <li key={l.label}>
              <a
                href={l.href}
                style={{
                  color: "#e8e4da",
                  textDecoration: "none",
                  fontSize: "0.875rem",
                  fontWeight: 400,
                  letterSpacing: "0.04em",
                  textTransform: "uppercase",
                  transition: "color 0.2s",
                }}
                onMouseEnter={(e) =>
                  ((e.target as HTMLElement).style.color = "#f8f6f0")
                }
                onMouseLeave={(e) =>
                  ((e.target as HTMLElement).style.color = "#e8e4da")
                }
              >
                {l.label}
              </a>
            </li>
          ))}
          <li>
            <Link
              href="/login"
              style={{
                padding: "0.5rem 1.5rem",
                border: "1px solid #00b4c8",
                color: "#00b4c8",
                borderRadius: "4px",
                textDecoration: "none",
                fontSize: "0.875rem",
                letterSpacing: "0.04em",
                textTransform: "uppercase",
                transition: "all 0.3s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = "#00b4c8";
                (e.target as HTMLElement).style.color = "#0a0f1e";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "transparent";
                (e.target as HTMLElement).style.color = "#00b4c8";
              }}
            >
              Staff Login
            </Link>
          </li>
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="flex md:hidden"
          style={{
            background: "none",
            border: "none",
            color: "#f8f6f0",
            fontSize: "1.5rem",
            cursor: "pointer",
            padding: "0.25rem",
          }}
          aria-label="Toggle menu"
        >
          {mobileOpen ? "✕" : "☰"}
        </button>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div
          style={{
            position: "fixed",
            top: "72px",
            left: 0,
            right: 0,
            zIndex: 999,
            background: "rgba(10,15,30,0.98)",
            backdropFilter: "blur(20px)",
            padding: "1.5rem 2rem",
            borderBottom: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          {links.map((l) => (
            <a
              key={l.label}
              href={l.href}
              onClick={() => setMobileOpen(false)}
              style={{
                display: "block",
                padding: "0.875rem 0",
                color: "#e8e4da",
                textDecoration: "none",
                fontSize: "1rem",
                borderBottom: "1px solid rgba(255,255,255,0.05)",
              }}
            >
              {l.label}
            </a>
          ))}
          <Link
            href="/login"
            onClick={() => setMobileOpen(false)}
            style={{
              display: "block",
              marginTop: "1.25rem",
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
            Staff Login
          </Link>
        </div>
      )}
    </>
  );
}
