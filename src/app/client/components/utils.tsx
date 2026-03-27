"use client";

import { useEffect, useRef, useState } from "react";

/* ─── Reveal on scroll ─── */
export function useReveal() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) { setVisible(true); obs.disconnect(); }
      },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, visible };
}

export function Reveal({
  children,
  delay = 0,
  className = "",
}: {
  children: React.ReactNode;
  delay?: number;
  className?: string;
}) {
  const { ref, visible } = useReveal();
  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(28px)",
        transition: `opacity 0.65s ease ${delay}s, transform 0.65s ease ${delay}s`,
      }}
    >
      {children}
    </div>
  );
}

/* ─── Count-up number ─── */
export function Counter({
  target,
  suffix = "",
}: {
  target: number;
  suffix?: string;
}) {
  const [count, setCount] = useState(0);
  const { ref, visible } = useReveal();

  useEffect(() => {
    if (!visible) return;
    let current = 0;
    const step = Math.max(1, Math.ceil(target / 60));
    const id = setInterval(() => {
      current += step;
      if (current >= target) { setCount(target); clearInterval(id); }
      else setCount(current);
    }, 20);
    return () => clearInterval(id);
  }, [visible, target]);

  return <span ref={ref}>{count}{suffix}</span>;
}

/* ─── Shared style tokens ─── */
export const token = {
  btnPrimary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "0.75rem 2rem",
    background: "linear-gradient(135deg, #00b4c8, #00d4eb)",
    color: "#0a0f1e",
    fontWeight: 600,
    borderRadius: "4px",
    border: "none",
    cursor: "pointer",
    fontSize: "0.9375rem",
    letterSpacing: "0.02em",
    boxShadow: "0 0 30px rgba(0,180,200,0.3)",
    transition: "all 0.3s ease",
    textDecoration: "none",
  } as React.CSSProperties,

  btnSecondary: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    padding: "0.75rem 2rem",
    background: "transparent",
    color: "#f8f6f0",
    fontWeight: 500,
    borderRadius: "4px",
    border: "1px solid rgba(255,255,255,0.2)",
    cursor: "pointer",
    fontSize: "0.9375rem",
    letterSpacing: "0.02em",
    transition: "all 0.3s ease",
    textDecoration: "none",
  } as React.CSSProperties,

  sectionTag: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.75rem",
    fontWeight: 500,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "#00b4c8",
    marginBottom: "1rem",
  } as React.CSSProperties,

  sectionTitle: {
    fontFamily: "var(--font-cormorant, 'Cormorant Garamond', serif)",
    fontSize: "clamp(2rem, 4vw, 3rem)",
    fontWeight: 600,
    color: "#f8f6f0",
    lineHeight: 1.15,
    marginBottom: "1.5rem",
  } as React.CSSProperties,

  glassCard: {
    background: "rgba(255,255,255,0.04)",
    border: "1px solid rgba(255,255,255,0.08)",
    backdropFilter: "blur(12px)",
    WebkitBackdropFilter: "blur(12px)",
    borderRadius: "12px",
    padding: "2rem",
    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
  } as React.CSSProperties,

  sectionInner: {
    maxWidth: "1200px",
    margin: "0 auto",
    padding: "6rem 2rem",
  } as React.CSSProperties,
};
