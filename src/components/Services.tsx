"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

const services = [
  {
    num: "01",
    title: "擬岩制作",
    titleEn: "ARTIFICIAL ROCK",
    desc: "FRP・コンクリートを素材に、本物そっくりの岩・石・洞窟を制作。テーマパークや飲食店、商業施設のランドマークとなる大型造形物から、インテリアアクセントの小品まで完全フルスクラッチで制作します。",
    tags: ["テーマパーク", "商業施設", "飲食店", "大型造形"],
    img: "https://images.unsplash.com/photo-1714828180412-063a6eab7bae?w=1000&auto=format&fit=crop&q=85",
    imgAlt: "洞窟内部 擬岩制作",
  },
  {
    num: "02",
    title: "店舗内装・インテリア",
    titleEn: "INTERIOR DESIGN",
    desc: "空間コンセプトの設計から施工まで一貫対応。独自の素材加工技術で既製品では出せない「手仕事の質感」を空間に宿らせます。開業前のゼロからの立ち上げにも対応。",
    tags: ["コンセプト設計", "内装施工", "什器制作", "空間演出"],
    img: "https://images.unsplash.com/photo-1531973968078-9bb02785f13d?w=1000&auto=format&fit=crop&q=85",
    imgAlt: "ダークバー内装",
  },
  {
    num: "03",
    title: "エイジング塗装",
    titleEn: "AGING PAINT",
    desc: "新しい素材に時間の経過を表現する職人技。錆・苔・風化・剥がれなど、リアルな経年劣化の表情を塗装で再現。映画セット・飲食店・ホテルロビーまで幅広く対応します。",
    tags: ["錆表現", "コンクリート風", "風化・剥がれ", "フルスクラッチ"],
    img: "https://images.unsplash.com/photo-1578922427288-a47338083a57?w=1000&auto=format&fit=crop&q=85",
    imgAlt: "経年劣化した壁面テクスチャ",
  },
];

export default function Services() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="services" className="py-32 bg-[#0d0d0d]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className="reveal mb-20">
          <p className="text-[11px] tracking-[0.5em] text-[#C9A84C] mb-5 uppercase">Services</p>
          <h2 className="font-heading text-5xl md:text-6xl tracking-[0.04em] text-white gold-line">
            WHAT WE OFFER
          </h2>
        </div>

        {/* サービス一覧 */}
        <div className="space-y-2">
          {services.map((svc, i) => (
            <div
              key={svc.num}
              className="reveal service-card group relative overflow-hidden cursor-default"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              {/* 背景画像 */}
              <div className="absolute inset-0">
                <Image
                  src={svc.img}
                  alt={svc.imgAlt}
                  fill
                  className="object-cover work-img brightness-[0.25] group-hover:brightness-[0.35] transition-all duration-700"
                  sizes="100vw"
                />
              </div>

              {/* オーバーレイ */}
              <div className="service-overlay absolute inset-0 bg-black/70 group-hover:bg-black/55 transition-colors duration-500" />

              {/* コンテンツ */}
              <div className="service-border relative z-10 border border-white/5 group-hover:border-[#C9A84C]/30
                              transition-colors duration-500 p-8 md:p-12">
                <div className="grid md:grid-cols-[80px_1fr_200px] gap-8 items-start">
                  {/* 番号 */}
                  <span className="font-heading text-7xl text-white/10
                                   group-hover:text-[#C9A84C]/25 transition-colors duration-500 leading-none">
                    {svc.num}
                  </span>

                  {/* テキスト */}
                  <div>
                    <p className="text-[10px] tracking-[0.4em] text-[#C9A84C] mb-3">{svc.titleEn}</p>
                    <h3 className="font-heading text-3xl text-white mb-4 tracking-wide">{svc.title}</h3>
                    <p className="text-gray-400 text-sm leading-[2] max-w-2xl">{svc.desc}</p>
                  </div>

                  {/* タグ＋矢印 */}
                  <div className="hidden md:flex flex-col justify-between h-full gap-4">
                    <div className="flex flex-wrap gap-2">
                      {svc.tags.map((tag) => (
                        <span key={tag}
                          className="text-[9px] tracking-[0.1em] px-2.5 py-1 border border-white/10
                                     text-gray-500 group-hover:border-[#C9A84C]/20 transition-colors">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="font-heading text-2xl text-white/20
                                     group-hover:text-[#C9A84C] transition-colors duration-300 text-right">
                      →
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
