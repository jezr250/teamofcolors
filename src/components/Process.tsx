"use client";
import { useEffect, useRef } from "react";

const steps = [
  {
    num: "01",
    title: "ご相談・ヒアリング",
    titleEn: "CONSULTATION",
    desc: "ご要望・施工場所・ご予算・スケジュールをお聞きします。現地調査も無料で対応。",
    time: "無料",
  },
  {
    num: "02",
    title: "デザイン提案・見積",
    titleEn: "DESIGN & QUOTE",
    desc: "ヒアリングをもとにデザイン案とお見積りをご提案。ご要望に合わせ何度でも修正します。",
    time: "1〜2週間",
  },
  {
    num: "03",
    title: "素材選定・試作",
    titleEn: "MATERIAL & SAMPLE",
    desc: "最適な素材を選定し、色・質感のサンプルをご確認いただきます。納得いただいてから制作へ。",
    time: "1〜3週間",
  },
  {
    num: "04",
    title: "制作・加工",
    titleEn: "PRODUCTION",
    desc: "職人が手作業でフルスクラッチ制作。大型造形物から細部の塗装まで丁寧に仕上げます。",
    time: "規模による",
  },
  {
    num: "05",
    title: "施工・完成",
    titleEn: "INSTALLATION",
    desc: "現地での設置・施工を行い、完成状態をご確認いただきます。アフターフォローも万全。",
    time: "〜完成",
  },
];

export default function Process() {
  const ref = useRef<HTMLElement>(null);

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
    <section id="process" className="py-32 bg-[#0d0d0d]" ref={ref}>
      <div className="max-w-5xl mx-auto px-6">
        {/* ヘッダー */}
        <div className="reveal mb-20">
          <p className="text-[11px] tracking-[0.5em] text-[#C9A84C] mb-5 uppercase">Process</p>
          <h2 className="font-heading text-5xl md:text-6xl tracking-[0.04em] text-white gold-line">
            HOW WE WORK
          </h2>
          <p className="text-gray-500 text-sm mt-6 leading-loose max-w-xl">
            ご相談から完成まで、すべてのプロセスを透明に。
            初めての方も安心してご依頼いただけます。
          </p>
        </div>

        {/* ステップ：縦タイムライン */}
        <div className="relative pl-8 md:pl-16">
          {/* 縦ライン */}
          <div className="absolute left-3 md:left-7 top-2 bottom-2 w-px
                          bg-gradient-to-b from-[#C9A84C]/50 via-[#C9A84C]/20 to-transparent" />

          <div className="space-y-12">
            {steps.map((step, i) => (
              <div
                key={step.num}
                className="reveal relative"
                style={{ transitionDelay: `${i * 0.1}s` }}
              >
                {/* バッジ：縦ラインに沿った絶対位置 */}
                <div className="absolute -left-8 md:-left-16 top-0
                                w-6 h-6 border border-[#C9A84C]/50 bg-[#0d0d0d]
                                flex items-center justify-center">
                  <span className="font-heading text-[9px] text-[#C9A84C]">{step.num}</span>
                </div>

                {/* コンテンツ */}
                <div className="bg-[#111] border border-white/5 p-8
                                hover:border-[#C9A84C]/15 transition-colors duration-300">
                  <div className="flex flex-col md:flex-row md:items-start gap-4 mb-4">
                    <div className="flex-1">
                      <p className="text-[9px] tracking-[0.4em] text-[#C9A84C] mb-2 uppercase">
                        {step.titleEn}
                      </p>
                      <h3 className="font-heading text-2xl text-white tracking-wide">
                        {step.title}
                      </h3>
                    </div>
                    <span className="shrink-0 text-[10px] tracking-[0.15em] text-[#C9A84C]/60
                                     border border-[#C9A84C]/20 px-3 py-1 h-fit">
                      目安：{step.time}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm leading-[2]">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="reveal mt-16 text-center" style={{ transitionDelay: "0.5s" }}>
          <a href="#contact"
            className="inline-flex items-center gap-4 px-10 py-4 border border-[#C9A84C]/40
                       text-[#C9A84C] text-xs tracking-[0.25em] font-heading
                       hover:bg-[#C9A84C] hover:text-black transition-all duration-300">
            まずは無料相談から
            <span>→</span>
          </a>
        </div>
      </div>
    </section>
  );
}
