"use client";
import { useEffect, useRef } from "react";
import Image from "next/image";

export default function AboutSection() {
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
      { threshold: 0.12 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // 見出しはモバイルとPCで挿入位置が違うため変数にまとめる。
  // モバイル: 見出し → 画像 → 本文（着地した瞬間に見出しと画像の両方が入るように）
  // PC:       画像（左） / 見出し＋本文（右）
  const heading = (
    <div>
      {/* 金の小ラベル＝セクション名（ハンバーガーメニューの語と一致させる） */}
      <p className="type-label text-gold mb-4">About</p>
      <h2 className="type-display silver-grad">
        WORK &<br />BELIEF
      </h2>
    </div>
  );

  return (
    <section id="about" className="py-24 bg-[#0d0d0d]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* モバイルは画像と本文が縦に並ぶので gap-16(64px) だと間延びする。
            1画面に収めたいので gap-8(32px) に詰め、PCは従来どおり64px */}
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-16 items-center">

          {/* 画像 — PCは左（order-1）、モバイルは先頭（order-1）。
              モバイルでは見出しを画像の上に重ねて置くので、見出し用の高さを別途取らない。
              これで着地した瞬間に見出しと画像が1つの塊として目に入る */}
          <div className="reveal order-1 lg:order-1">
            <div className="relative aspect-[4/5] overflow-hidden reveal-clip">
              <Image
                src="/about-mortar.jpg"
                alt="モルタル造形制作の現場"
                fill
                className="object-cover transition-transform duration-700 hover:scale-103"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              {/* 上端の暗がり。銀のグラデーション文字は写真の明るい部分だと読めなくなるため、
                  見出しを重ねるモバイルでだけ敷く */}
              <div className="absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-black/85 via-black/45 to-transparent lg:hidden" />

              {/* 見出し（モバイルのみ・画像の上に重ねる）。PCでは本文列の中に出す */}
              <div className="absolute top-8 left-6 right-6 lg:hidden">{heading}</div>

              {/* コーナー装飾 — 左上はモバイルだと見出しと重なるのでPCのみ */}
              <div className="absolute top-4 left-4 w-10 h-10 border-l border-t border-[#C9A84C]/40 hidden lg:block" />
              <div className="absolute bottom-4 right-4 w-10 h-10 border-r border-b border-[#C9A84C]/40" />
              {/* キャプション */}
              <div className="absolute bottom-6 left-6">
                <p className="type-meta uppercase tracking-[0.3em] text-[#C9A84C]">
                  Mortar Sculpture
                </p>
                <p className="type-meta tracking-[0.15em] text-white/60 mt-1">
                  モルタル造形制作の現場
                </p>
              </div>
            </div>
          </div>

          {/* 本文 — PCは右（order-2）、モバイルは画像の下（order-2） */}
          <div className="reveal order-2" style={{ transitionDelay: "0.15s" }}>
            {/* 見出しはモバイルでは画像の上に出しているので、ここではPCのみ表示。
                space-y-8 の中に置くと、非表示のモバイルでも次の要素に32pxの余白が
                付いてしまうため、間隔は mb-8 で自分から出す */}
            <div className="hidden lg:block mb-8">{heading}</div>

            <div className="space-y-8">
              <div className="w-8 h-px bg-gold" />

              <p className="type-body text-white/75">
                Team of Colors は、モルタル造形制作を核とした空間創造集団です。
                コンクリートや FRP を素材に、本物と見紛う岩・石・洞窟を手作りで制作し、
                テーマパーク・飲食店・商業施設に唯一無二の空間を提供します。
              </p>
              <p className="type-body text-white/60">
                「既製品はない。すべてがフルスクラッチ。」
                それが私たちの唯一のルールです。
              </p>
            </div>

            {/* 実績数値（15+ Years など）はヒーローに同じものがあるため削除。
                VIEW MORE も #works への3本目の導線だったため削除（ヒーロー・LOOK・メニューから行ける） */}
          </div>
        </div>
      </div>
    </section>
  );
}
