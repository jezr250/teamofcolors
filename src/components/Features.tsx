"use client";
import { useEffect, useRef } from "react";

const features = [
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <path d="M20 4L36 12V28L20 36L4 28V12L20 4Z" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
        <path d="M20 14L28 18V26L20 30L12 26V18L20 14Z" fill="#C9A84C" opacity="0.3" />
      </svg>
    ),
    title: "完全フルスクラッチ",
    titleEn: "FULL SCRATCH",
    desc: "既製品は使いません。すべてゼロから手作りで制作。世界にひとつだけの空間を実現します。",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <circle cx="20" cy="20" r="15" stroke="#C9A84C" strokeWidth="1.5" fill="none" />
        <path d="M13 20C13 16.13 16.13 13 20 13C23.87 13 27 16.13 27 20"
          stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="20" r="3" fill="#C9A84C" />
      </svg>
    ),
    title: "圧倒的なリアリティ",
    titleEn: "ARTISTIC",
    desc: "本物と見紛う質感と存在感。FRP・コンクリート・特殊塗料を駆使した職人の技で実現します。",
  },
  {
    icon: (
      <svg viewBox="0 0 40 40" fill="none" className="w-8 h-8">
        <path d="M8 32V16L20 8L32 16V32" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
        <path d="M15 32V24H25V32" stroke="#C9A84C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      </svg>
    ),
    title: "企画から施工まで",
    titleEn: "ONE STOP",
    desc: "コンセプト設計・デザイン・素材調達・施工・アフターフォローまでワンストップで対応。",
  },
];

export default function Features() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.2 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-24 bg-[#0d0d0d] border-y border-white/5" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid md:grid-cols-3 gap-px bg-white/5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="reveal bg-[#0d0d0d] p-10 group hover:bg-[#111] transition-colors duration-300"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              <div className="mb-6">{f.icon}</div>
              <p className="text-[9px] tracking-[0.4em] text-[#C9A84C] mb-3 uppercase">
                {f.titleEn}
              </p>
              <h3 className="font-heading text-2xl text-white mb-4 tracking-wide">
                {f.title}
              </h3>
              <p className="text-gray-500 text-sm leading-[2]">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
