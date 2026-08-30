"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

// トップの代表実績6件（ハードコード・実施工写真 public/works-*.jpg）。
// ラベルは写真フォルダの3サービス名のみ（架空の物件名は付けず、実画像との齟齬をなくす）。
// モバイル1列でも モルタル→内装→エイジング の順に見えるよう M/I/A/M/I/A で配置。
// microCMS連携後もこのショーケースは残し、各カード → /works（全実績一覧）への導線とする。
const projects = [
  { id: 1, category: "モルタル造形制作", img: "/works-1.jpg", alt: "岩壁のカウンター厨房" },
  { id: 2, category: "内装・インテリア", img: "/works-2.jpg", alt: "曲面を用いた店舗内装" },
  { id: 3, category: "エイジング塗装", img: "/works-3.jpg", alt: "大理石調のエイジング仕上げ" },
  { id: 4, category: "モルタル造形制作", img: "/works-4.jpg", alt: "立体的な岩壁造形" },
  { id: 5, category: "内装・インテリア", img: "/works-5.jpg", alt: "曲面壁の店舗空間" },
  { id: 6, category: "エイジング塗装", img: "/works-6.jpg", alt: "石肌を再現したエイジング壁面" },
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
            {/* 金の小ラベル＝セクション名（ハンバーガーメニューの語と一致させる）。
              着地した位置がどこか分かるようにするための目印なので、
              気の利いた別の言葉に置き換えないこと。銀の大見出しがコピー担当 */}
            <p className="font-label text-xs tracking-[0.5em] text-gold uppercase mb-3">Works</p>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-px bg-white/5">
          {projects.map((project, i) => (
            <a
              key={project.id}
              href="/works"
              className="stagger-item group relative block bg-[#0a0a0a] overflow-hidden cursor-pointer"
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

              {/* テキスト — サービス名のみ */}
              <div className="p-5 md:p-6">
                <p className="font-label text-[11px] tracking-[0.25em] text-gold uppercase mb-2">
                  Category
                </p>
                <h3 className="text-base text-white/90 tracking-wide
                               group-hover:text-gold group-active:text-gold transition-colors">
                  {project.category}
                </h3>
              </div>
            </a>
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
