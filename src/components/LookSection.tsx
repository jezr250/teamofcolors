"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

export default function LookSection() {
  const imgRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    const onScroll = () => {
      if (!imgRef.current) return;
      const rect = imgRef.current.parentElement!.getBoundingClientRect();
      const offset = rect.top / window.innerHeight;
      imgRef.current.style.transform = `translateY(${offset * 60}px)`;
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    // メニューから外した装飾セクションなので id（アンカー）は持たない
    <section className="parallax-wrap h-[85vh] flex items-center justify-center">
      {/* パラックス画像 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="https://images.unsplash.com/photo-1760119547261-2acb17d8ae71?w=1920&auto=format&fit=crop&q=85"
        alt="施工実績"
        className="parallax-img"
      />
      <div className="absolute inset-0 bg-black/40" />

      {/* テキスト — Artizanの look-txt.svg 相当 */}
      <div className="relative z-10 text-center px-6">
        {/* 金の小ラベル（セクション名）は置かない。このセクションはメニューに無い装飾で、
            銀の大見出し LOOK と重なって見えるだけだった（2026-09-13 レビュー指摘） */}
        <h2 className="font-heading italic leading-none tracking-[0.06em] mb-8 silver-grad"
            style={{ fontSize: "clamp(4.5rem, 13vw, 10rem)" }}>
          LOOK
        </h2>
        <p className="type-body text-white/70 mb-10">
          施工実績の一部をご紹介します
        </p>
        <a href="#works"
          className="inline-block border border-white/35 text-white/75 type-meta
                     tracking-[0.3em] px-8 py-3
                     hover:border-gold hover:text-gold transition-all duration-300">
          VIEW WORKS →
        </a>
      </div>
    </section>
  );
}
