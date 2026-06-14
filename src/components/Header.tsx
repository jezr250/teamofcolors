"use client";
import { useState, useEffect } from "react";
import NavOverlay from "./NavOverlay";

export default function Header() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 80);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500
                    ${scrolled ? "bg-black/90 backdrop-blur-sm" : ""}`}
      >
        <div className="flex items-center justify-between px-8 md:px-12 py-6">
          {/* ロゴ */}
          <a href="/" className="z-10 flex items-center gap-3">
            {/* ゼッケンバッジ */}
            <svg width="44" height="30" viewBox="0 0 44 30" fill="none">
              <rect x="1" y="1" width="42" height="28" rx="5"
                stroke="#C9A84C" strokeWidth="1" fill="rgba(5,5,5,0.7)" />
              <path
                d="M6 24 C5.5 21 5.5 18.5 6.5 17 L5.5 15.5 C5 14.8 5.5 14 6.5 14
                   L7.5 15.5 C9 14.5 10.5 14 12 14.5 L12.5 13 C13 12 14 12.5 14 13.5
                   L13.5 15 C14.5 16 15 17.5 15 20 L15.5 20.5 C16 21.5 15.5 23 14.5 23
                   L14 22.5 C14 24 13.5 25.5 13 26.5 L13 28 L11.5 28 L11.5 26.5
                   L10.5 26.5 L10.5 28 L9 28 L9 26.5 C8.5 25.5 8 24 8 22.5 Z"
                fill="#C9A84C" opacity="0.65"
              />
              <text x="30" y="20" textAnchor="middle" fill="#C9A84C"
                fontSize="11" fontFamily="var(--font-bebas),sans-serif" letterSpacing="2">
                TOC
              </text>
            </svg>
            <span
              className={`font-heading tracking-[0.18em] text-sm transition-colors duration-300
                          ${open ? "text-white/30" : "text-white"}`}
            >
              TEAM OF COLORS
            </span>
          </a>

          {/* ハンバーガー */}
          <button
            onClick={() => setOpen(!open)}
            className="z-[210] flex flex-col justify-center gap-[6px] w-8 h-8 group"
            aria-label={open ? "メニューを閉じる" : "メニューを開く"}
          >
            <span
              className={`block h-[1.5px] origin-center transition-all duration-400
                          ${open ? "w-6 rotate-45 translate-y-[7.5px] bg-white" : "w-6 bg-white"}`}
            />
            <span
              className={`block h-[1.5px] transition-all duration-300
                          ${open ? "w-0 opacity-0 bg-white" : "w-6 bg-white"}`}
            />
            <span
              className={`block h-[1.5px] origin-center transition-all duration-400
                          ${open ? "w-6 -rotate-45 -translate-y-[7.5px] bg-white" : "w-6 bg-white"}`}
            />
          </button>
        </div>
      </header>

      <NavOverlay open={open} onClose={() => setOpen(false)} />
    </>
  );
}
