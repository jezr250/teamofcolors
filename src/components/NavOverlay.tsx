"use client";
import { useEffect } from "react";

const links = [
  { label: "ABOUT",    href: "#about" },
  { label: "SERVICE",  href: "#service" },
  { label: "WORKS",    href: "#works" },
  { label: "ORDER",    href: "#order" },
  { label: "NEWS",     href: "#news" },
  { label: "CONTACT",  href: "#contact" },
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

        <div className="mt-12 flex gap-6">
          <a href="https://www.instagram.com/"
            className="text-[10px] tracking-[0.3em] text-white/30
                       hover:text-[#C9A84C] transition-colors font-heading">
            INSTAGRAM
          </a>
          <a href="#contact"
            className="text-[10px] tracking-[0.3em] text-white/30
                       hover:text-[#C9A84C] transition-colors font-heading"
            onClick={onClose}>
            TEL
          </a>
        </div>
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

      {/* 閉じるボタン（左上） */}
      <button
        onClick={onClose}
        className="absolute top-6 right-8 md:right-12 text-white/30
                   hover:text-white transition-colors text-[10px] tracking-[0.3em] font-heading"
      >
        CLOSE ✕
      </button>
    </div>
  );
}
