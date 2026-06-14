"use client";
import { useEffect, useRef, useState } from "react";

const faqs = [
  {
    q: "どんな素材で擬岩を作るのですか？",
    a: "主にFRP（繊維強化プラスチック）・ポリウレア・コンクリートを使用します。設置場所・サイズ・耐久性要件に応じて最適な素材をご提案します。屋外・屋内どちらにも対応可能です。",
  },
  {
    q: "納期はどのくらいかかりますか？",
    a: "規模によって異なります。小型オブジェ（〜50cm）で2〜4週間、中型（1〜2m）で1〜2ヶ月、大型造形物は3ヶ月以上が目安です。ご相談時にご要望のスケジュールをお聞きし、できる限り対応します。",
  },
  {
    q: "エイジング塗装はどんな素材・場所に対応できますか？",
    a: "コンクリート・モルタル・木材・金属・石膏ボードなど幅広い素材に対応可能です。錆・苔・経年変化・汚れ・カビなど様々な質感を再現できます。屋外の防水仕様にも対応しています。",
  },
  {
    q: "見積もりは無料ですか？",
    a: "はい、お見積もりは無料です。ご相談・現地調査も費用は発生しません。お気軽にお問い合わせください。",
  },
  {
    q: "小さいサイズの擬岩も制作できますか？",
    a: "はい、インテリア用の小型オブジェから大型テーマパーク施設まで対応しています。卓上サイズの石オブジェも制作可能です。",
  },
  {
    q: "遠方でも対応してもらえますか？",
    a: "全国対応しています。現地調査が必要な場合は交通費・宿泊費を実費でご請求しますが、まずはオンラインでのご相談も可能です。",
  },
];

export default function FAQ() {
  const ref = useRef<HTMLElement>(null);
  const [open, setOpen] = useState<number | null>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="faq" className="py-32 bg-[#0d0d0d]" ref={ref}>
      <div className="max-w-4xl mx-auto px-6">
        {/* ヘッダー */}
        <div className="reveal mb-16">
          <p className="text-[11px] tracking-[0.5em] text-[#C9A84C] mb-5 uppercase">FAQ</p>
          <h2 className="font-heading text-5xl md:text-6xl tracking-[0.04em] text-white gold-line">
            QUESTIONS
          </h2>
        </div>

        {/* アコーディオン */}
        <div className="space-y-px">
          {faqs.map((faq, i) => (
            <div
              key={i}
              className="reveal border-b border-white/5"
              style={{ transitionDelay: `${i * 0.07}s` }}
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full py-6 flex items-start justify-between gap-6 text-left
                           group hover:text-[#C9A84C] transition-colors duration-300"
              >
                <div className="flex items-start gap-5">
                  <span className="font-heading text-[#C9A84C]/40 text-sm shrink-0 mt-0.5">
                    Q{String(i + 1).padStart(2, "0")}
                  </span>
                  <span className="text-white text-sm leading-relaxed tracking-wide
                                   group-hover:text-[#C9A84C] transition-colors duration-300">
                    {faq.q}
                  </span>
                </div>
                <span className={`shrink-0 font-heading text-[#C9A84C] text-xl transition-transform duration-300
                                  ${open === i ? "rotate-45" : ""}`}>
                  +
                </span>
              </button>

              <div className={`overflow-hidden transition-all duration-500 ease-in-out
                               ${open === i ? "max-h-64 pb-6" : "max-h-0"}`}>
                <div className="flex gap-5 pl-0">
                  <span className="font-heading text-[#C9A84C] text-sm shrink-0 mt-0.5 pl-0">
                    <span className="opacity-0 select-none">Q{String(i + 1).padStart(2, "0")}</span>
                  </span>
                  <p className="text-gray-400 text-sm leading-[2.2] pl-[calc(1rem+20px)]">
                    {faq.a}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* 残りの質問へのCTA */}
        <div className="reveal mt-16 text-center" style={{ transitionDelay: "0.6s" }}>
          <p className="text-gray-600 text-sm mb-6">解決しなかった場合はお気軽にお問い合わせください</p>
          <a href="#contact"
            className="inline-flex items-center gap-3 text-[#C9A84C] text-xs tracking-[0.3em]
                       font-heading hover:opacity-70 transition-opacity">
            お問い合わせへ
            <span className="w-10 h-px bg-[#C9A84C] inline-block" />
          </a>
        </div>
      </div>
    </section>
  );
}
