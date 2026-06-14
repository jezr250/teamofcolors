"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

const works = [
  {
    id: 1,
    title: "洞窟カフェ「岩窟」内装",
    category: "擬岩・内装",
    year: "2024",
    span: "col-span-2",
    img: "https://images.unsplash.com/photo-1760119547261-2acb17d8ae71?w=1200&auto=format&fit=crop&q=85",
    alt: "石灰岩洞窟 擬岩制作",
  },
  {
    id: 2,
    title: "アミューズメント洞窟エリア",
    category: "擬岩制作",
    year: "2024",
    span: "col-span-1",
    img: "https://images.unsplash.com/photo-1702847341686-ba2c2b173371?w=800&auto=format&fit=crop&q=85",
    alt: "洞窟 水 擬岩",
  },
  {
    id: 3,
    title: "バー「KURAYAMI」内装",
    category: "内装施工",
    year: "2024",
    span: "col-span-1",
    img: "https://images.unsplash.com/photo-1531973968078-9bb02785f13d?w=800&auto=format&fit=crop&q=85",
    alt: "ダークバー内装",
  },
  {
    id: 4,
    title: "コンクリートエイジング壁面",
    category: "エイジング塗装",
    year: "2023",
    span: "col-span-1",
    img: "https://images.unsplash.com/photo-1519145127298-00d5287fcdd3?w=800&auto=format&fit=crop&q=85",
    alt: "コンクリートテクスチャ",
  },
  {
    id: 5,
    title: "商業施設 岩石オブジェ",
    category: "擬岩制作",
    year: "2023",
    span: "col-span-1",
    img: "https://images.unsplash.com/photo-1613981371672-98fcc5a1b59e?w=800&auto=format&fit=crop&q=85",
    alt: "石材 岩石 オブジェ",
  },
  {
    id: 6,
    title: "施工フルスクラッチ制作",
    category: "フルスクラッチ",
    year: "2023",
    span: "col-span-1",
    img: "https://images.unsplash.com/photo-1608613304899-ea8098577e38?w=800&auto=format&fit=crop&q=85",
    alt: "職人 作業 施工",
  },
];

export default function Works() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.08 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="works" className="py-32 bg-[#0a0a0a]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className="reveal mb-16 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-[11px] tracking-[0.5em] text-[#C9A84C] mb-5 uppercase">Works</p>
            <h2 className="font-heading text-5xl md:text-6xl tracking-[0.04em] text-white gold-line">
              OUR PROJECTS
            </h2>
          </div>
          <p className="text-[10px] tracking-[0.3em] text-gray-600">
            SELECTED WORKS 2022 – 2024
          </p>
        </div>

        {/* グリッド */}
        <div className="grid grid-cols-3 gap-1">
          {works.map((work, i) => (
            <div
              key={work.id}
              className={`reveal work-card relative overflow-hidden group cursor-pointer
                          ${work.span}
                          ${work.span === "col-span-2" ? "aspect-[16/7]" : i < 3 ? "aspect-[4/3]" : "aspect-square"}`}
              style={{ transitionDelay: `${i * 0.08}s` }}
            >
              {/* 画像 */}
              <Image
                src={work.img}
                alt={work.alt}
                fill
                className="object-cover work-img"
                sizes="(max-width: 768px) 100vw, 33vw"
              />

              {/* 常時：薄いオーバーレイ */}
              <div className="absolute inset-0 bg-black/30" />

              {/* ホバー：オーバーレイ */}
              <div className="work-overlay absolute inset-0 bg-black/72 flex flex-col justify-between p-6">
                <div className="flex items-start justify-between">
                  <span className="text-[9px] tracking-[0.25em] px-2.5 py-1
                                   border border-[#C9A84C]/40 text-[#C9A84C]">
                    {work.category}
                  </span>
                  <span className="text-[9px] tracking-[0.1em] text-gray-500">{work.year}</span>
                </div>
                <div>
                  <h3 className="font-heading text-xl md:text-2xl text-white tracking-wide mb-1">
                    {work.title}
                  </h3>
                  <div className="w-8 h-0.5 bg-[#C9A84C] mt-3" />
                </div>
              </div>

              {/* カテゴリ（常時） */}
              <div className="absolute top-4 left-4 group-hover:opacity-0 transition-opacity duration-300">
                <span className="text-[9px] tracking-[0.2em] px-2 py-1
                                 bg-black/50 text-gray-500 border border-white/10">
                  {work.category}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* お問い合わせCTA */}
        <div className="reveal mt-16 text-center" style={{ transitionDelay: "0.5s" }}>
          <a href="#contact"
            className="inline-flex items-center gap-3 text-xs tracking-[0.3em] text-gray-500
                       hover:text-[#C9A84C] transition-colors font-heading">
            施工のご相談はこちら
            <span className="w-12 h-px bg-current inline-block" />
          </a>
        </div>
      </div>
    </section>
  );
}
