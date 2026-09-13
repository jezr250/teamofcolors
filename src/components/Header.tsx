"use client";
import { useState, useEffect } from "react";
import NavOverlay from "./NavOverlay";
import LogoMark from "./LogoMark";

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
            <LogoMark size={40} />
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
