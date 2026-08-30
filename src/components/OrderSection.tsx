"use client";
import { useEffect, useRef } from "react";

export default function OrderSection() {
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
    <section id="order" className="parallax-wrap h-screen flex items-center justify-center">
      {/* パラックス背景 */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imgRef}
        src="https://images.unsplash.com/photo-1547609434-b732edfee020?w=1920&auto=format&fit=crop&q=85"
        alt="職人作業"
        className="parallax-img"
      />
      <div className="absolute inset-0 bg-black/55" />

      {/* テキスト — Artizanの ORDER + NO BORDER + "YOU SHOULD MAKE…" 相当 */}
      <div className="relative z-10 text-center px-6">
        {/* "ORDER" 大見出し */}
        <p className="font-label text-white/8 leading-none select-none"
           style={{ fontSize: "clamp(6rem, 20vw, 18rem)", letterSpacing: "0.05em" }}>
          ORDER
        </p>

        <div className="-mt-8 md:-mt-16">
          {/* 金の小ラベル＝セクション名（ハンバーガーメニューの語と一致させる）。
              着地した位置がどこか分かるようにするための目印なので、
              気の利いた別の言葉に置き換えないこと。銀の大見出しがコピー担当 */}
          <p className="font-label text-xs tracking-[0.5em] text-gold uppercase mb-6">
            Order
          </p>
          <h2 className="font-heading italic tracking-[0.05em] leading-tight mb-10 silver-grad"
              style={{ fontSize: "clamp(1.6rem, 4vw, 3.2rem)" }}>
            THERE IS NO USE KNOCKOFF.<br />
            FULL SCRATCH ONLY.
          </h2>
          <p className="text-white/65 text-sm tracking-[0.06em] max-w-md mx-auto mb-12 leading-loose">
            既製品は使いません。すべてを手作りで、<br className="hidden md:block" />
            ゼロから創り上げることが私たちの仕事です。
          </p>
          <a href="#contact"
            className="inline-block bg-gold text-black text-xs tracking-[0.3em]
                       font-label px-12 py-4 hover:bg-gold-light transition-colors duration-300">
            ORDER →
          </a>
        </div>
      </div>
    </section>
  );
}
