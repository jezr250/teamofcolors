"use client";
import { useEffect } from "react";

// "/#xxx" 形式にしておくと /works などの下層ページからでもトップの各セクションに戻れる
// TEL・COMPANY も同じ見た目で最後に並べる（COMPANYが一番下）
const links = [
  { label: "ABOUT",    href: "/#about" },
  { label: "SERVICE",  href: "/#service" },
  { label: "WORKS",    href: "/#works" },
  { label: "ORDER",    href: "/#order" },
  { label: "CONTACT",  href: "/#contact" },
  { label: "TEL",      href: "/#contact-tel" },
  { label: "COMPANY",  href: "/company" },
];

type Props = { open: boolean; onClose: () => void };

export default function NavOverlay({ open, onClose }: Props) {
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => { document.body.style.overflow = ""; };
  }, [open]);

  return (
    <div className={`nav-overlay ${open ? "open" : ""}`} onClick={onClose}>
      <div
        className="nav-overlay__panel"
        onClick={(e) => e.stopPropagation()}
      >
        <nav>
          {links.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="nav-overlay__item"
              onClick={onClose}
            >
              {link.label}
            </a>
          ))}
        </nav>
      </div>

      {/* ロゴマーク（背景） */}
      <div className="nav-overlay__mark pointer-events-none">
        <svg width="200" height="200" viewBox="0 0 52 36" fill="white">
          <rect x="1" y="1" width="50" height="34" rx="6"
            stroke="white" strokeWidth="1" fill="none" />
          <text x="26" y="22" textAnchor="middle" fill="white"
            fontSize="14" fontFamily="var(--font-bebas),sans-serif" letterSpacing="3">
            TOC
          </text>
        </svg>
      </div>

      {/* 閉じるボタン */}
      <button
        onClick={onClose}
        className="absolute top-6 right-8 md:right-12 text-white/70
                   hover:text-white active:text-white transition-colors
                   text-sm tracking-[0.3em] font-heading
                   flex items-center gap-2 py-2 px-1"
      >
        <span className="text-base leading-none">✕</span>
        <span className="text-xs">CLOSE</span>
      </button>
    </div>
  );
}
