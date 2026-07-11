"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

const projects = [
  {
    id: 1,
    title: "洞窟テーマカフェ「岩窟」内装",
    category: "擬岩制作",
    tags: ["ARTISTIC", "FULL SCRATCH"],
    img: "https://images.unsplash.com/photo-1702847341686-ba2c2b173371?w=800&auto=format&fit=crop&q=85",
    alt: "洞窟 カフェ 擬岩",
  },
  {
    id: 2,
    title: "バー「KURAYAMI」エイジング内装",
    category: "内装・エイジング",
    tags: ["INTERIOR", "AGING PAINT"],
    img: "https://images.unsplash.com/photo-1531973968078-9bb02785f13d?w=800&auto=format&fit=crop&q=85",
    alt: "バー 内装",
  },
  {
    id: 3,
    title: "商業施設 大型岩石オブジェ",
    category: "擬岩制作",
    tags: ["LARGE SCALE", "FRP"],
    img: "https://images.unsplash.com/photo-1613981371672-98fcc5a1b59e?w=800&auto=format&fit=crop&q=85",
    alt: "岩石 オブジェ",
  },
  {
    id: 4,
    title: "レストラン コンクリート壁面",
    category: "エイジング塗装",
    tags: ["AGING PAINT", "CONCRETE"],
    img: "https://images.unsplash.com/photo-1578922427288-a47338083a57?w=800&auto=format&fit=crop&q=85",
    alt: "コンクリート エイジング",
  },
  {
    id: 5,
    title: "アミューズメント洞窟エリア",
    category: "擬岩制作",
    tags: ["THEME PARK", "CAVE"],
    img: "https://images.unsplash.com/photo-1760119547261-2acb17d8ae71?w=800&auto=format&fit=crop&q=85",
    alt: "洞窟 テーマパーク",
  },
  {
    id: 6,
    title: "フルスクラッチ造形 施工事例",
    category: "フルスクラッチ",
    tags: ["FULL SCRATCH", "CRAFT"],
    img: "https://images.unsplash.com/photo-1608613304899-ea8098577e38?w=800&auto=format&fit=crop&q=85",
    alt: "職人 施工",
  },
];

export default function WorksSection() {
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
      { threshold: 0.06 }
    );
    ref.current
      ?.querySelectorAll(".stagger-item, .reveal")
      .forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="works" className="py-24 bg-[#0a0a0a]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* ヘッダー — Artizan風 */}
        <div className="reveal flex items-end justify-between mb-12 pb-6 border-b border-white/5">
          <div>
            <p className="font-label text-xs tracking-[0.5em] text-gold uppercase mb-3">Selected Projects</p>
            <h2 className="font-heading italic text-5xl md:text-6xl tracking-[0.04em] silver-grad">
              WORKS
            </h2>
          </div>
          <a href="/works"
            className="hidden md:block text-xs tracking-[0.3em] text-white/60
                       hover:text-gold transition-colors font-label gold-hover">
            ALL PROJECTS →
          </a>
        </div>

        {/* プロジェクトグリッド — staggerアニメーション */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {projects.map((project, i) => (
            <article
              key={project.id}
              className="stagger-item group relative bg-[#0a0a0a] overflow-hidden cursor-pointer"
              style={{ "--stagger-delay": `${i * 0.1}s` } as React.CSSProperties}
            >
              {/* 画像 — reveal-clip アニメーション */}
              <div className="relative aspect-[4/3] overflow-hidden reveal-clip">
                <Image
                  src={project.img}
                  alt={project.alt}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-106"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-300" />
              </div>

              {/* テキスト */}
              <div className="p-5 md:p-6">
                <div className="flex items-center gap-3 mb-3">
                  <span className="font-label text-[11px] tracking-[0.25em] text-gold uppercase">
                    CATEGORY
                  </span>
                  <span className="font-label text-[11px] tracking-[0.1em] text-white/60 border border-white/15 px-2 py-0.5">
                    {project.category}
                  </span>
                </div>
                <h3 className="text-sm text-white/90 leading-relaxed tracking-wide mb-3">
                  {project.title}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag) => (
                    <span key={tag} className="font-label text-[11px] tracking-[0.1em] text-white/55 uppercase">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* モバイル用 全件一覧リンク（ヘッダー右のリンクはmd以上のみ表示のため） */}
        <div className="mt-10 text-center md:hidden">
          <a href="/works"
            className="inline-block border border-white/35 text-white/75 text-xs
                       tracking-[0.3em] px-8 py-3 font-label
                       hover:border-gold hover:text-gold active:border-gold active:text-gold
                       transition-all duration-300">
            ALL PROJECTS →
          </a>
        </div>
      </div>
    </section>
  );
}
