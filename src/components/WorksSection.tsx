"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

// トップの代表実績6件（ハードコード・実施工写真 public/works-*.webp）。
// ラベルはサービス名のみ（架空の物件名は付けず、実画像との齟齬をなくす）。
// 5カテゴリすべてを出しつつ3列グリッドを2行で埋めるため、主力のモルタル造形だけ2枚にしている。
// モバイル1列でも先頭から順にカテゴリが変わって見えるよう、同じカテゴリは離して配置する。
// 写真は Service タイルと重複しないものを選び、同じ画が上下で二度出ないようにしている。
// microCMS連携後もこのショーケースは残し、各カード → /works（全実績一覧）への導線とする。
const projects = [
  { id: 1, category: "モルタル造形制作", img: "/works-1.webp", alt: "岩壁を背にした厨房" },
  { id: 2, category: "内装・インテリア塗装", img: "/works-2.webp", alt: "アーチ窓と造作棚のある店舗内装" },
  { id: 3, category: "エイジング塗装", img: "/works-3.webp", alt: "石肌を再現したエイジング壁面" },
  { id: 4, category: "特殊塗装", img: "/works-4.webp", alt: "凹凸のある特殊塗装の壁面" },
  { id: 5, category: "氷壁", img: "/works-5.webp", alt: "氷壁で仕上げた通路" },
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
            <p className="type-label text-gold mb-3">Works</p>
            <h2 className="type-display silver-grad">
              WORKS
            </h2>
          </div>
          <a href="/works"
            className="hidden md:block type-meta tracking-[0.3em] text-white/60
                       hover:text-gold transition-colors gold-hover">
            ALL PROJECTS →
          </a>
        </div>

      </div>

      {/* プロジェクトグリッド。
          lg以上だけ画面幅いっぱいにする（Serviceタイルと同じ扱い）。5列をコンテナ幅
          （最大1280px）に収めると1枚236pxまで痩せるので、端まで使って幅を稼ぐため。
          lg未満は従来どおりコンテナ内の1列のまま（モバイルの見え方は変えない）。 */}
      <div className="max-w-7xl lg:max-w-none mx-auto px-6 md:px-12 lg:px-0">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-px bg-white/5">
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
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 20vw"
                />
                <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-300" />
              </div>

              {/* テキスト — サービス名のみ */}
              <div className="p-5 md:p-6">
                <p className="type-meta uppercase tracking-[0.25em] text-gold mb-2">
                  Category
                </p>
                <h3 className="type-card-title text-white/90
                               group-hover:text-gold group-active:text-gold transition-colors">
                  {project.category}
                </h3>
              </div>
            </a>
          ))}
      </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* モバイル用 全件一覧リンク（ヘッダー右のリンクはmd以上のみ表示のため） */}
        <div className="mt-10 text-center md:hidden">
          <a href="/works"
            className="inline-block border border-white/35 text-white/75 type-meta
                       tracking-[0.3em] px-8 py-3
                       hover:border-gold hover:text-gold active:border-gold active:text-gold
                       transition-all duration-300">
            ALL PROJECTS →
          </a>
        </div>
      </div>
    </section>
  );
}
