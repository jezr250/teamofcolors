"use client";
import { useEffect } from "react";

// "/#xxx" 形式にしておくと /works などの下層ページからでもトップの各セクションに戻れる
// 並び順はトップページの実際のセクション順（app/page.tsx）に合わせている
//   Hero → service → about → look → order → works → contact
// LOOK はパララックスの視覚演出セクションなのでメニューには載せない
// TEL・COMPANY も同じ見た目で最後に並べる（COMPANYが一番下）
const links = [
  { label: "SERVICE",  href: "/#service" },
  { label: "ABOUT",    href: "/#about" },
  { label: "ORDER",    href: "/#order" },
  { label: "WORKS",    href: "/#works" },
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

      {/* 閉じるボタン */}
      <button
        onClick={onClose}
        className="absolute top-6 right-8 md:right-12 text-white/70
                   hover:text-white active:text-white transition-colors
                   type-meta tracking-[0.3em]
                   flex items-center gap-2 py-2 px-1"
      >
        <span className="text-base leading-none">✕</span>
        <span>CLOSE</span>
      </button>
    </div>
  );
}
