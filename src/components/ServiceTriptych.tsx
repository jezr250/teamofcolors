"use client";
import Image from "next/image";
import { useEffect, useRef } from "react";
import { SERVICE_CATEGORY_LIST } from "@/lib/serviceCategories";

// href は各サービスの category で絞り込んだ WORKS 一覧（/works?category=xxx）へ。
// 表示名・英語ラベル・商標フラグは src/lib/serviceCategories.ts で一元管理しているので、
// ここが持つのは「どの写真を使うか」だけにしている。
//
// 構成は 2026-09-17 の修正依頼 13・14 で先方が示した構成例どおり 3列×2段の6マス。
// 上段: モルタル／内装／エイジング、下段: 特殊塗装／氷壁（2マス分）。
// 氷壁だけ写真を2マス分に敷き、右半分を透かして説明文を載せ、看板商品として目立たせている。
// （それ以前は上段3枚＋下段2枚の幅いっぱいのタイルだった）
const TILE_IMAGES: Record<string, { img: string; alt: string; position?: string }> = {
  mortar: { img: "/service-mortar.jpg", alt: "モルタル造形で仕上げた岩肌の壁" },
  interior: { img: "/service-interior.webp", alt: "曲面の什器で構成した店舗内装" },
  // 左端に壁の角を残した切り抜きなので、縦長に切られる PC でも角が消えないよう左寄せ
  aging: { img: "/service-aging.webp", alt: "木目を再現したエイジング塗装の壁", position: "object-left" },
  special: { img: "/service-special.webp", alt: "特殊塗装による凹凸のある壁面" },
  hyoheki: { img: "/service-hyoheki.webp", alt: "氷壁で仕上げた通路" },
};

// HYOHEKI 説明パネルの文言。先方が構成例（64967.jpg）の文言を微修正したもの
// （「特殊意匠仕上げ（商標登録出願中・特許申請中）」→「特殊仕上げ（商標登録出願中）」）。
// 1文目は「TEAM OF COLORSが独自開発した唯一無二の特殊仕上げ」を1行、
// 「（商標登録出願中）。」を2行目に固定する（2026-09-20 ユーザー指示）。
// 1行目は25文字あるので、1024px 以上は文字サイズをパネル幅に連動させて（globals.css の
// .hyoheki-text）必ず1行に収める。768〜1023px は幅が足りないため幅なりに折り返すが、
// 「唯一無二の特殊仕上げ」はひとかたまりにして語の途中では切れないようにしている
const HYOHEKI_LEAD_MAIN = "TEAM OF COLORSが独自開発した";
const HYOHEKI_LEAD_WORD = "唯一無二の特殊仕上げ";
const HYOHEKI_LEAD_NOTE = "（商標登録出願中）。";
const HYOHEKI_BODY =
  "本物の氷塊を思わせる透明感、ひんやりとした質感表現、そして透過光によるライティング効果。空間に他にはない圧倒的なインパクトを発揮します。";

// タイルの高さ。スマホ（1列）は 16:9 で6マス積んでも間延びしないように固定比率。
// タブレット以上は grid の auto-rows-fr で全マスを同じ高さにし、その高さは文章量で決まる
// HYOHEKI パネル（6マス目）に従う。写真タイルは中身が無いので min-h で下限だけ持たせる
const TILE_ASPECT = "aspect-[16/9] md:aspect-auto md:min-h-[280px]";

const HYOHEKI = SERVICE_CATEGORY_LIST.find((c) => c.id === "hyoheki")!;

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

  // 氷壁（最後のタイル）まで通しでフェードインさせるため、順番を i で持つ
  const tileStyle = (i: number) => ({
    transition: `opacity 0.7s ease ${i * 0.12}s, transform 0.7s ease ${i * 0.12}s`,
    transform: "translateY(20px)",
  });

  const renderTile = (cat: (typeof SERVICE_CATEGORY_LIST)[number], i: number) => {
    const image = TILE_IMAGES[cat.id];
    return (
      <a
        key={cat.id}
        href={`/works?category=${cat.id}`}
        className={`triptych-item tile-item opacity-0 ${TILE_ASPECT}`}
        style={tileStyle(i)}
      >
        <Image
          src={image.img}
          alt={image.alt}
          fill
          className={`object-cover ${image.position ?? ""}`}
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        {/* 商標登録出願中のバッジ。氷壁だけを他より目立たせる狙いなので、
            オーバーレイの外（画像の左上）に金枠で常時出している */}
        {cat.trademarkPending && (
          <span className="trademark-badge">商標登録出願中</span>
        )}
        <div className="triptych-overlay">
          <div>
            <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-2">
              {cat.en}
            </p>
            <p className="type-heading triptych-name italic silver-grad">{cat.name}</p>
          </div>
        </div>
      </a>
    );
  };

  return (
    <section id="service" ref={ref} className="pt-16 md:pt-20">
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* 金の小ラベル＝セクション名（ハンバーガーメニューの語と一致させる）。
            着地した位置がどこか分かるようにするための目印なので、
            気の利いた別の言葉に置き換えないこと。
            見出し「事業内容・仕上げ技法」は 2026-09-17 の構成例に合わせて追加した */}
        <div className="text-center mb-10 md:mb-14">
          <p className="type-label text-gold mb-4">Service</p>
          <h2 className="type-section-ja silver-grad">事業内容・仕上げ技法</h2>
        </div>

        {/* 列数: スマホ1列 → md 以上は先方の構成例どおり3列×2段 */}
        <div className="grid grid-cols-1 md:grid-cols-3 md:auto-rows-fr gap-px bg-white/5">
          {SERVICE_CATEGORY_LIST.filter((c) => c.id !== "hyoheki").map((cat, i) => renderTile(cat, i))}

          {/* 氷壁: 2マス分に写真を1枚敷き、左半分は他と同じタイル（一覧へのリンク）、
              右半分は写真を暗く透かした上に説明文（先方指示「文字は透過させる」）。
              スマホ（1列）では写真の下に説明文が続く */}
          <div
            className="tile-item opacity-0 relative overflow-hidden bg-[#0a0a0a] md:col-span-2"
            style={tileStyle(SERVICE_CATEGORY_LIST.length - 1)}
          >
            <Image
              src={TILE_IMAGES.hyoheki.img}
              alt={TILE_IMAGES.hyoheki.alt}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, 66vw"
            />
            <div className="relative h-full grid grid-cols-1 md:grid-cols-2">
              {/* 左: 他のタイルと同じ見せ方 */}
              <a
                href={`/works?category=${HYOHEKI.id}`}
                className="triptych-item aspect-[16/9] md:aspect-auto"
              >
                {HYOHEKI.trademarkPending && (
                  <span className="trademark-badge">商標登録出願中</span>
                )}
                <div className="triptych-overlay">
                  <div>
                    <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-2">
                      {HYOHEKI.en}
                    </p>
                    {/* タイルだけ読みを添える（先方の構成例どおり）。一覧のタブや見出しは「氷壁」のまま */}
                    <p className="type-heading triptych-name italic silver-grad">{HYOHEKI.name}（ひょうへき）</p>
                  </div>
                </div>
              </a>

              {/* 右: 写真を透かして文言。左端をわずかに明るく残して1枚の写真が続いて見えるようにする */}
              <div className="relative bg-gradient-to-r from-black/70 via-black/80 to-black/85">
                {/* 文字の大きさは先方の構成例に合わせて控えめ（見出し 28〜36px、本文 12〜13px） */}
                {/* 余白は md 以上 24px で固定（.hyoheki-text の文字サイズ計算がこの余白を前提にしている） */}
                <div className="h-full flex flex-col justify-center p-6">
                  <p className="text-[10px] uppercase tracking-[0.35em] text-gold mb-3">
                    Signature Finish
                  </p>
                  <p className="font-heading text-white leading-none tracking-[0.04em]"
                     style={{ fontSize: "clamp(1.75rem, 2.6vw, 2.25rem)" }}>
                    HYOHEKI
                  </p>
                  <p className="type-body-sm text-white/70 tracking-[0.3em] mt-2">- 氷壁 -</p>
                  <div className="w-8 h-px bg-gold my-4" />
                  <p className="hyoheki-text text-white/85 leading-[1.8] mb-3">
                    <span className="lg:whitespace-nowrap">
                      {HYOHEKI_LEAD_MAIN}
                      <span className="whitespace-nowrap">{HYOHEKI_LEAD_WORD}</span>
                    </span>
                    <span className="block">{HYOHEKI_LEAD_NOTE}</span>
                  </p>
                  <p className="hyoheki-text text-white/60 leading-[1.8]">{HYOHEKI_BODY}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
