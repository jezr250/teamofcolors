"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

const stats = [
  { num: "15+", label: "Years Experience" },
  { num: "200+", label: "Projects Done" },
  { num: "100%", label: "Full Scratch" },
];

export default function About() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.15 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="about" className="py-32 bg-[#0a0a0a]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="grid lg:grid-cols-2 gap-20 items-center">

          {/* 画像パネル */}
          <div className="reveal order-2 lg:order-1">
            <div className="relative">
              {/* メイン画像 */}
              <div className="relative aspect-[3/4] overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1547609434-b732edfee020?w=900&auto=format&fit=crop&q=85"
                  alt="職人の作業風景"
                  fill
                  className="object-cover img-zoom"
                  sizes="(max-width: 1024px) 100vw, 50vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                {/* 画像上の文字 */}
                <div className="absolute bottom-6 left-6">
                  <p className="font-heading text-2xl text-white tracking-widest">CRAFTSMAN</p>
                  <p className="text-[10px] tracking-[0.3em] text-[#C9A84C] mt-1">手仕事の美学</p>
                </div>
              </div>

              {/* コーナー装飾 */}
              <div className="absolute -top-4 -left-4 w-14 h-14 border-l-2 border-t-2 border-[#C9A84C]" />
              <div className="absolute -bottom-4 -right-4 w-14 h-14 border-r-2 border-b-2 border-[#C9A84C]" />

              {/* フローティングバッジ */}
              <div className="absolute -bottom-6 -right-2 md:right-[-2rem] bg-black border border-[#C9A84C]/30
                              px-7 py-5 backdrop-blur-sm z-10">
                <p className="font-heading text-4xl text-[#C9A84C] leading-none">2010</p>
                <p className="text-[10px] tracking-[0.25em] text-gray-500 mt-2 uppercase">Established</p>
              </div>
            </div>
          </div>

          {/* テキスト */}
          <div className="order-1 lg:order-2 space-y-8">
            <div className="reveal">
              <p className="text-[11px] tracking-[0.5em] text-[#C9A84C] mb-5 uppercase">About Us</p>
              <h2 className="font-heading text-5xl md:text-6xl tracking-[0.04em] text-white leading-tight gold-line">
                WHAT WE DO
              </h2>
            </div>

            <div className="reveal space-y-4" style={{ transitionDelay: "0.15s" }}>
              <p className="text-gray-300 leading-[2.2] text-sm">
                Team of Colors は、<span className="text-white font-medium">擬岩（ぎがん）制作</span>を核とした
                空間創造集団です。コンクリートや FRP を素材に、本物と見紛う岩・石・洞窟を手作りで制作。
                テーマパーク・飲食店・商業施設に唯一無二の空間を提供します。
              </p>
              <p className="text-gray-400 leading-[2.2] text-sm">
                エイジング塗装では、新しい素材に経年劣化の表情を与え、
                空間にリアルな重みと深みをもたらします。
                アイデアの段階から施工完了まで、すべてフルスクラッチで対応。
                あなたのビジョンを、そのまま空間へ。
              </p>
            </div>

            {/* Stats */}
            <div className="reveal grid grid-cols-3 gap-px bg-white/5"
                 style={{ transitionDelay: "0.3s" }}>
              {stats.map((s) => (
                <div key={s.label}
                     className="bg-[#0a0a0a] border border-white/5 p-6 text-center
                                hover:border-[#C9A84C]/20 transition-colors duration-300">
                  <p className="font-heading text-4xl text-[#C9A84C] mb-1">{s.num}</p>
                  <p className="text-[9px] tracking-[0.2em] text-gray-600 uppercase">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
