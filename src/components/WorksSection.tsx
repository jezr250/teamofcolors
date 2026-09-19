"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

// トップの「施工実績」。2026-09-17 の修正依頼 11 で、Service タイルと同じ一覧
// （/works?category=xxx）へ飛ぶだけだった旧5枚構成を、先方が示した構成例
// （64968.jpg）どおりの3枚に置き換えた。各カードは「分類タグ・場所・見出し・説明・
// 工期・技法」を持つ読み物で、リンクやボタンは持たない（先方指示：画像は既存のもの、
// 文言へのリンクやアクション等の設置は不要）。
//
// 文言は構成例の画像から起こしたもの。2枚目だけ先方が見出し・説明・工期を差し替えている
// （店舗内装および造作什器仕上げ → 店舗内装仕上げ壁面等のペイント、2 WEEKS → 1 WEEK）。
// 写真は旧構成で使っていた public/works-*.webp をそのまま流用。
const projects = [
  {
    tag: "Commercial",
    place: "Tokyo",
    title: "飲食店の立体モルタル岩壁造形",
    desc: "下地から厚み150mmのダイナミックな造形。照明の陰影を生かしたリアルな岩肌を表現。",
    duration: "5 Days",
    tech: "Sculpture",
    img: "/works-1.webp",
    alt: "岩壁を背にした飲食店の厨房",
  },
  {
    tag: "Shop Interior",
    place: "Kanagawa",
    title: "店舗内装仕上げ壁面等のペイント",
    desc: "空間全体の世界観を統一するため、什器・家具に合う壁面のトータルペイントを実施。",
    duration: "1 Week",
    tech: "Interior",
    img: "/works-2.webp",
    alt: "造作棚と壁面を同じ色調で仕上げた店舗内装",
  },
  {
    tag: "Residence",
    place: "Yokohama",
    title: "個人邸・外構門壁エイジング",
    desc: "無機質なブロック塀の素地から、数百年経過したような風化石積みの質感へ劇的に変化。",
    duration: "3 Days",
    tech: "Aging",
    img: "/works-3.webp",
    alt: "風化した石積みを再現したエイジング塗装の門壁",
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
        {/* 見出し。構成例に合わせて中央寄せの和文にした。
            金の小ラベル＝セクション名（ハンバーガーメニューの語と一致させる）。
            着地した位置がどこか分かるようにするための目印なので、
            気の利いた別の言葉に置き換えないこと */}
        <div className="reveal text-center mb-14">
          <p className="type-label text-gold mb-4">Works</p>
          <h2 className="type-display-ja silver-grad">施工実績</h2>
        </div>

        {/* 3枚のカード。lg 以上で3列、md で2列（3枚目は左寄せ）、それ未満は1列 */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
          {projects.map((project, i) => (
            <article
              key={project.title}
              className="stagger-item relative bg-[#0a0a0a] overflow-hidden"
              style={{ "--stagger-delay": `${i * 0.1}s` } as React.CSSProperties}
            >
              {/* 画像 — reveal-clip アニメーション */}
              <div className="relative aspect-[4/3] overflow-hidden reveal-clip">
                <Image
                  src={project.img}
                  alt={project.alt}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-black/15" />
              </div>

              <div className="p-6 md:p-8">
                {/* 分類タグ（金の細枠）と場所 */}
                <div className="flex items-center justify-between mb-6">
                  <span className="type-meta uppercase tracking-[0.25em] text-gold
                                   border border-gold/50 px-3 py-1">
                    {project.tag}
                  </span>
                  <span className="type-body-sm text-white/60">{project.place}</span>
                </div>

                <h3 className="type-card-title font-bold text-white/90 mb-3">
                  {project.title}
                </h3>
                <p className="type-body-sm text-white/60 leading-[1.9]">
                  {project.desc}
                </p>

                {/* 工期と技法。値だけ白にして読み取りやすくする */}
                <div className="mt-6 pt-4 border-t border-white/10
                                flex items-center justify-between type-meta uppercase tracking-[0.15em] text-white/45">
                  <span>Duration: <span className="text-white/75">{project.duration}</span></span>
                  <span>Tech: <span className="text-white/75">{project.tech}</span></span>
                </div>
              </div>
            </article>
          ))}
        </div>

        {/* 全件一覧への入口。カードにはリンクを置かない方針なので、ここだけが /works への導線 */}
        <div className="reveal mt-12 text-center">
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
