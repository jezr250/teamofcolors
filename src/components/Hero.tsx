"use client";
import { useEffect, useRef } from "react";

/**
 * PDF参考: PATTERN ONEスタイル
 * 左：大テキスト  右：モルタル造形による岩肌テクスチャが黒背景から浮かび上がる
 *
 * mix-blend-mode: lighten → 岩の暗部が黒背景に沈み、明るい岩肌が浮かぶ
 */
export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    requestAnimationFrame(() => {
      el.style.opacity = "1";
      el.style.transform = "translateY(0)";
    });
  }, []);

  return (
    <section className="relative w-full h-screen bg-black overflow-hidden flex items-center">

      {/* ── 右パネル：馬画像（PC: 右60% / SP: フル画面背景） ── */}
      <div className="absolute right-0 top-0 bottom-0 w-full lg:w-[62%] select-none pointer-events-none">
        {/* モルタル造形の岩肌テクスチャ — Ken Burns + lighten blend */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/hero-rock.jpg"
          alt="モルタル造形による岩肌のテクスチャ"
          className="absolute inset-0 w-full h-full object-cover object-center ken-burns"
          style={{
            mixBlendMode: "lighten",
            filter: "brightness(1.05) contrast(1.08) saturate(0.85)",
            opacity: 0.9,
          }}
        />

        {/* テクスチャ感を出すノイズ風グラデーション */}
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 90% at 65% 50%, transparent 30%, rgba(0,0,0,0.5) 100%)",
          }}
        />

      </div>

      {/* ── グラデーション（モバイル: 全体覆う / PC: 左から右） ── */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: [
            /* モバイル: 全体暗くしてテキスト可読 */
            "linear-gradient(to bottom, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0.5) 100%)",
            /* PC: 左から右へ */
            "linear-gradient(to right, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.85) 40%, rgba(0,0,0,0.15) 70%, transparent 100%)",
          ].join(", "),
        }}
      />

      {/* ── テキストコンテンツ（モバイル: 中央下 / PC: 左半分） ── */}
      <div
        ref={ref}
        className="relative z-10 w-full lg:w-1/2 px-6 md:px-12 xl:px-20
                   flex flex-col items-center text-center
                   lg:items-start lg:text-left"
        style={{
          opacity: 0,
          transform: "translateY(30px)",
          transition: "opacity 1s ease, transform 1s ease",
        }}
      >
        {/* 小ラベル */}
        <p className="font-label text-xs tracking-[0.6em] uppercase mb-6 silver-grad">
          is genuine works
        </p>

        {/* メイン見出し — Cormorant Garamond Italic */}
        <h1
          className="font-heading italic leading-[0.92] mb-6 silver-grad"
          style={{ fontSize: "clamp(4rem, 8vw, 7.5rem)" }}
        >
          TEAM<br />OF<br />COLORS
        </h1>

        {/* サブタイトル */}
        <div className="mb-2">
          <p className="font-label text-xs tracking-[0.4em] text-white/70 uppercase">
            Mortar Sculpture
          </p>
          <p className="font-label text-xs tracking-[0.4em] text-white/70 uppercase">
            Interior Design
          </p>
          <p className="font-label text-xs tracking-[0.4em] text-white/70 uppercase">
            Aging Paint
          </p>
        </div>

        {/* ゴールドライン */}
        <div className="w-12 h-px bg-gold my-8" />

        {/* CTA — PATTERN ONE スタイル */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* OUR SERVICES 相当：半透明ダーク＋白ボーダー */}
          <a
            href="#works"
            className="inline-flex items-center justify-center gap-5
                       font-label text-xs tracking-[0.28em] text-white
                       px-9 py-4 transition-all duration-300"
            style={{
              background: "rgba(8,8,8,0.6)",
              border: "1px solid rgba(255,255,255,0.45)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.07)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.75)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.background = "rgba(8,8,8,0.6)";
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.45)";
            }}
          >
            施工実績を見る
            <span className="text-base leading-none">→</span>
          </a>
          {/* VIEW WORK 相当：よりシンプルなボーダー */}
          <a
            href="#contact"
            className="inline-flex items-center justify-center gap-5
                       font-label text-xs tracking-[0.28em] text-white/75
                       px-9 py-4 transition-all duration-300"
            style={{
              background: "transparent",
              border: "1px solid rgba(255,255,255,0.25)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.6)";
              (e.currentTarget as HTMLElement).style.color = "#fff";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLElement).style.borderColor = "rgba(255,255,255,0.25)";
              (e.currentTarget as HTMLElement).style.color = "rgba(255,255,255,0.75)";
            }}
          >
            無料相談
            <span className="text-base leading-none">→</span>
          </a>
        </div>

        {/* 実績数値 */}
        <div className="flex gap-8 md:gap-10 mt-10 pt-8 border-t border-white/8 w-full justify-center lg:justify-start">
          {[["15+", "Years"], ["200+", "Projects"], ["100%", "Full Scratch"]].map(
            ([num, label]) => (
              <div key={label}>
                <p className="font-heading text-2xl text-gold leading-none">{num}</p>
                <p className="font-label text-[11px] tracking-[0.2em] text-white/60 mt-1 uppercase">
                  {label}
                </p>
              </div>
            )
          )}
        </div>
      </div>

      {/* ── 下部グラデーション ── */}
      <div className="absolute bottom-0 left-0 right-0 h-24 pointer-events-none"
           style={{ background: "linear-gradient(to top, #0a0a0a, transparent)" }} />

      {/* ── 下のセクションのラベル ──
          リンクではなく見出し。表記は AboutSection の「About」と同じスタイルに揃えている */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 lg:left-14 lg:translate-x-0 xl:left-20
                      flex items-center gap-3">
        <div className="w-px h-10 bg-gradient-to-b from-white/20 to-transparent" />
        <p className="font-label text-xs tracking-[0.5em] text-gold uppercase">Service</p>
      </div>
    </section>
  );
}
