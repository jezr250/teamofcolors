"use client";
import { useEffect } from "react";
import { SITE_INSTAGRAM_URL } from "@/lib/siteConfig";

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

        <div className="mt-12 flex items-center gap-8">
          <a href={SITE_INSTAGRAM_URL}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-2 text-xs tracking-[0.25em] text-white/60
                       hover:text-[#C9A84C] active:text-[#C9A84C] transition-colors font-heading">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <rect x="2" y="2" width="20" height="20" rx="6" ry="6" />
              <circle cx="12" cy="12" r="5" />
              <circle cx="17.5" cy="6.5" r="1.5" fill="currentColor" stroke="none" />
            </svg>
            Instagram
          </a>
          <a href="#contact-tel"
            onClick={onClose}
            className="flex items-center gap-2 text-xs tracking-[0.25em] text-white/60
                       hover:text-[#C9A84C] active:text-[#C9A84C] transition-colors font-heading">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"
              strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07
                       A19.5 19.5 0 0 1 5.45 13a19.79 19.79 0 0 1-3.07-8.67
                       A2 2 0 0 1 4.36 2h3a2 2 0 0 1 2 1.72
                       c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91
                       a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45
                       c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
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
