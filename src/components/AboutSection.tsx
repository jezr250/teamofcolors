"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

export default function AboutSection() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("visible");
          e.target.querySelectorAll(".reveal-clip").forEach((el) =>
            el.classList.add("visible")
          );
        }),
      { threshold: 0.12 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-24 bg-[#0d0d0d]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* 画像 */}
          <div className="reveal">
            <div className="relative aspect-[4/5] overflow-hidden reveal-clip">
              <Image
                src="https://images.unsplash.com/photo-1714828180412-063a6eab7bae?w=900&auto=format&fit=crop&q=85"
                alt="洞窟 擬岩制作"
                fill
                className="object-cover transition-transform duration-700 hover:scale-103"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* コーナー装飾 */}
              <div className="absolute top-4 left-4 w-10 h-10 border-l border-t border-[#C9A84C]/40" />
              <div className="absolute bottom-4 right-4 w-10 h-10 border-r border-b border-[#C9A84C]/40" />
              {/* キャプション */}
              <div className="absolute bottom-6 left-6">
                <p className="font-label text-[10px] tracking-[0.3em] text-[#C9A84C] uppercase">
                  Artificial Rock
                </p>
                <p className="font-label text-xs tracking-[0.15em] text-white/60 mt-1">
                  擬岩制作の現場
                </p>
              </div>
            </div>
          </div>

          {/* テキスト */}
          <div className="reveal space-y-8" style={{ transitionDelay: "0.15s" }}>
            <div>
              <p className="font-label text-[10px] tracking-[0.5em] text-gold uppercase mb-4">About</p>
              <h2 className="font-heading italic text-5xl md:text-6xl tracking-[0.04em] leading-tight silver-grad">
                WORK &<br />BELIEF
              </h2>
            </div>

            <div className="w-8 h-px bg-gold" />

            <p className="text-white/75 text-sm leading-[2.2]">
              Team of Colors は、擬岩制作を核とした空間創造集団です。
              コンクリートや FRP を素材に、本物と見紛う岩・石・洞窟を手作りで制作し、
              テーマパーク・飲食店・商業施設に唯一無二の空間を提供します。
            </p>
            <p className="text-white/60 text-sm leading-[2.2]">
              「既製品はない。すべてがフルスクラッチ。」
              それが私たちの唯一のルールです。
            </p>

            <div className="grid grid-cols-3 gap-6 pt-6 border-t border-white/8">
              {[["15+", "Years"], ["200+", "Projects"], ["100%", "Scratch"]].map(([num, label]) => (
                <div key={label}>
                  <p className="font-heading text-3xl text-gold">{num}</p>
                  <p className="font-label text-[9px] tracking-[0.2em] text-white/40 mt-1 uppercase">{label}</p>
                </div>
              ))}
            </div>

            <a href="#order"
              className="inline-flex items-center gap-3 text-[10px] tracking-[0.3em]
                         text-white/50 hover:text-gold transition-colors font-label gold-hover">
              VIEW MORE
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
