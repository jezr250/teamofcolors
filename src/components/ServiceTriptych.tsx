"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { SERVICE_CATEGORY_LIST } from "@/lib/serviceCategories";

// href は各サービスの category で絞り込んだ WORKS 一覧（/works?category=xxx）へ。
// 表示名・英語ラベル・商標フラグは src/lib/serviceCategories.ts で一元管理しているので、
// ここが持つのは「どの写真を使うか」だけにしている。
//
// 並びは先方指定（2026-09-03 の追加依頼）で、上段3枚＋下段2枚。
// 下段は幅が広くなるぶん高さを抑えて、上下の面積が釣り合うようにしてある。
const TILE_IMAGES: Record<string, { img: string; alt: string }> = {
  mortar: { img: "/service-mortar.jpg", alt: "モルタル造形で仕上げた岩肌の壁" },
  interior: { img: "/service-interior.webp", alt: "曲面の什器で構成した店舗内装" },
  aging: { img: "/service-aging.webp", alt: "木目を再現したエイジング塗装の壁" },
  special: { img: "/service-special.webp", alt: "特殊塗装による凹凸のある壁面" },
  hyoheki: { img: "/service-hyoheki.webp", alt: "氷壁で仕上げた通路" },
};

const TOP_ROW = SERVICE_CATEGORY_LIST.slice(0, 3);
const BOTTOM_ROW = SERVICE_CATEGORY_LIST.slice(3);

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

  // 上下段で遅延を通し番号にしたいので、行をまたいで連番を振る
  let order = 0;
  const renderTile = (
    cat: (typeof SERVICE_CATEGORY_LIST)[number],
    sizes: string
  ) => {
    const image = TILE_IMAGES[cat.id];
    const i = order++;
    return (
      <a
        key={cat.id}
        href={`/works?category=${cat.id}`}
        className="triptych-item tile-item opacity-0"
        style={{
          transition: `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`,
          transform: "translateY(20px)",
        }}
      >
        <Image
          src={image.img}
          alt={image.alt}
          fill
          className="object-cover transition-transform duration-900 group-hover:scale-105"
          sizes={sizes}
        />
        {/* 商標登録出願中のバッジ。氷壁だけを他より目立たせる狙いなので、
            オーバーレイの外（画像の左上）に金枠で常時出している */}
        {cat.trademarkPending && (
          <span className="trademark-badge">商標登録出願中</span>
        )}
        <div className="triptych-overlay">
          <div className="text-center">
            <p className="type-meta uppercase tracking-[0.4em] text-gold mb-2">
              {cat.en}
            </p>
            <p className="type-heading italic silver-grad">{cat.name}</p>
          </div>
        </div>
      </a>
    );
  };

  return (
    <section id="service" ref={ref} className="pt-16 md:pt-20">
      {/* 金の小ラベル＝セクション名（ハンバーガーメニューの語と一致させる）。
          着地した位置がどこか分かるようにするための目印なので、
          気の利いた別の言葉に置き換えないこと。
          このセクションだけは銀の大見出しを置かない（主役はタイルなので、
          見出しを足すとタイルが画面外に押し出される） */}
      <p className="type-label text-gold text-center mb-8">Service</p>

      <div
        className="flex flex-col md:flex-row"
        style={{ height: "clamp(300px, 70vh, 700px)" }}
      >
        {TOP_ROW.map((cat) => renderTile(cat, "(max-width: 768px) 100vw, 33vw"))}
      </div>

      <div
        className="flex flex-col md:flex-row"
        style={{ height: "clamp(240px, 50vh, 500px)" }}
      >
        {BOTTOM_ROW.map((cat) => renderTile(cat, "(max-width: 768px) 100vw, 50vw"))}
      </div>
    </section>
  );
}
