"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";

// href は各サービスの category で絞り込んだ WORKS 一覧（/works?category=xxx）へ。
// category 値は src/lib/serviceCategories.ts で一元管理（microCMS確定後はそちらを差し替え）。
const tiles = [
  {
    category: "mortar",
    img: "/service-mortar.jpg",
    alt: "モルタル造形制作",
    label: "モルタル造形制作",
    labelEn: "MORTAR SCULPTURE",
  },
  {
    category: "interior",
    img: "https://images.unsplash.com/photo-1531973968078-9bb02785f13d?w=900&auto=format&fit=crop&q=85",
    alt: "店舗内装",
    label: "内装・インテリア",
    labelEn: "INTERIOR DESIGN",
  },
  {
    category: "aging",
    img: "https://images.unsplash.com/photo-1578922427288-a47338083a57?w=900&auto=format&fit=crop&q=85",
    alt: "エイジング塗装",
    label: "エイジング塗装",
    labelEn: "AGING PAINT",
  },
];

export default function ServiceTriptych() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          ref.current?.querySelectorAll(".tile-item").forEach((el, i) => {
            setTimeout(() => el.classList.add("visible"), i * 120);
          });
          observer.disconnect();
        }),
      { threshold: 0.15 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section id="service" ref={ref} className="pt-16 md:pt-20">
      {/* 金の小ラベル＝セクション名（ハンバーガーメニューの語と一致させる）。
          着地した位置がどこか分かるようにするための目印なので、
          気の利いた別の言葉に置き換えないこと。
          このセクションだけは銀の大見出しを置かない（主役は3枚のタイルなので、
          見出しを足すとタイルが画面外に押し出される） */}
      <p className="font-label text-xs tracking-[0.5em] text-gold uppercase text-center mb-8">
        Service
      </p>

      {/* タイルの高さは従来どおり。ラベルはこの外に出しているので影響しない */}
      <div
        className="flex flex-col md:flex-row"
        style={{ height: "clamp(300px, 70vh, 700px)" }}
      >
        {tiles.map((tile, i) => (
          <a
            key={tile.labelEn}
            href={`/works?category=${tile.category}`}
            className="triptych-item tile-item opacity-0"
            style={{
              transition: `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`,
              transform: "translateY(20px)",
            }}
          >
            <Image
              src={tile.img}
              alt={tile.alt}
              fill
              className="object-cover transition-transform duration-900 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, 33vw"
            />
            <div className="triptych-overlay">
              <div className="text-center">
                <p className="font-label text-[11px] tracking-[0.4em] text-gold mb-2 uppercase">
                  {tile.labelEn}
                </p>
                <p className="font-heading italic text-2xl tracking-[0.08em] silver-grad">
                  {tile.label}
                </p>
              </div>
            </div>
            </a>
        ))}
      </div>
    </section>
  );
}
