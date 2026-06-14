"use client";
import { useEffect, useRef } from "react";

const testimonials = [
  {
    name: "K.M 様",
    role: "テーマパーク 施設運営担当",
    text: "洞窟エリアの擬岩制作をお願いしました。本物の岩と見分けがつかないほどのクオリティで、来場者の反応も大きく変わりました。打ち合わせから施工完了まで丁寧に対応いただき、大変満足しています。",
    category: "擬岩制作",
  },
  {
    name: "S.T 様",
    role: "飲食店 オーナー",
    text: "バーの内装を全面リニューアルしていただきました。コンセプトの段階から一緒に考えてくれて、想像以上の空間に仕上がりました。エイジング塗装の質感が特に好評で、インスタにもよく投稿されています。",
    category: "内装・エイジング塗装",
  },
  {
    name: "H.N 様",
    role: "商業施設 プロデューサー",
    text: "施設エントランスの大型岩石オブジェをフルスクラッチで制作していただきました。スケジュール通りに完成し、現場での設置作業も丁寧でした。次のプロジェクトもぜひお願いしたいと思っています。",
    category: "擬岩制作・施工",
  },
];

export default function Testimonials() {
  const ref = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => e.isIntersecting && e.target.classList.add("visible")),
      { threshold: 0.15 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <section className="py-32 bg-[#0a0a0a]" ref={ref}>
      <div className="max-w-7xl mx-auto px-6">
        {/* ヘッダー */}
        <div className="reveal mb-16">
          <p className="text-[11px] tracking-[0.5em] text-[#C9A84C] mb-5 uppercase">Testimonials</p>
          <h2 className="font-heading text-5xl md:text-6xl tracking-[0.04em] text-white gold-line">
            VOICE OF CLIENTS
          </h2>
        </div>

        {/* カード */}
        <div className="grid md:grid-cols-3 gap-px bg-white/5">
          {testimonials.map((t, i) => (
            <div
              key={t.name}
              className="reveal bg-[#0a0a0a] p-8 md:p-10 flex flex-col gap-6
                         hover:bg-[#0f0f0f] transition-colors duration-300"
              style={{ transitionDelay: `${i * 0.12}s` }}
            >
              {/* 引用マーク */}
              <div className="font-heading text-6xl text-[#C9A84C]/20 leading-none select-none">
                "
              </div>

              <p className="text-gray-300 text-sm leading-[2.2] flex-1">
                {t.text}
              </p>

              <div className="pt-6 border-t border-white/5">
                <span className="text-[9px] tracking-[0.25em] px-2.5 py-1
                                 border border-[#C9A84C]/25 text-[#C9A84C] inline-block mb-3">
                  {t.category}
                </span>
                <p className="font-heading text-base text-white tracking-wide">{t.name}</p>
                <p className="text-[10px] text-gray-600 mt-1 tracking-wide">{t.role}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
