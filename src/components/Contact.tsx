"use client";
import { useState } from "react";

const fields = [
  { id: "name",    label: "お名前",    labelEn: "NAME",    type: "text",  required: true },
  { id: "company", label: "会社名",    labelEn: "COMPANY", type: "text",  required: false },
  { id: "email",   label: "メール",    labelEn: "EMAIL",   type: "email", required: true },
  { id: "phone",   label: "電話番号",  labelEn: "PHONE",   type: "tel",   required: false },
];

export default function Contact() {
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    if (!data.get("name") || !data.get("email") || !data.get("message")) return;
    // TODO: 実運用時は /api/contact または EmailJS を設定
    setSent(true);
  };

  return (
    <section id="contact" className="py-24 bg-[#0c0c0c] border-t border-white/8">
      <div className="max-w-2xl mx-auto px-6 md:px-12">

        {/* ヘッダー */}
        <div className="text-center mb-16">
          <p className="font-label text-[10px] tracking-[0.5em] text-gold uppercase mb-4">
            Contact
          </p>
          <h2 className="font-heading text-6xl md:text-7xl tracking-[0.06em] mb-6 silver-grad">
            CONTACT
          </h2>
          <p className="text-white/60 text-[13px] tracking-[0.08em] leading-loose">
            お問い合わせ・ご相談はお気軽に。<br />
            2営業日以内にご連絡いたします。
          </p>
        </div>

        {sent ? (
          <div className="text-center py-20 border border-gold/30">
            <p className="font-heading text-4xl text-gold mb-3">THANK YOU</p>
            <p className="text-white/60 text-sm mt-3">近日中にご連絡いたします。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* 入力欄 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {fields.map((f) => (
                <div key={f.id} className={f.id === "company" || f.id === "phone" ? "" : ""}>
                  <label
                    htmlFor={f.id}
                    className="block font-label text-[9px] tracking-[0.4em] text-white/55 mb-2 uppercase"
                  >
                    {f.label}
                    <span className="text-white/30 ml-1 font-sans normal-case tracking-normal text-[9px]">
                      / {f.labelEn}
                    </span>
                    {f.required && <span className="text-gold ml-1">*</span>}
                  </label>
                  <input
                    id={f.id}
                    name={f.id}
                    type={f.type}
                    required={f.required}
                    className="form-field"
                    placeholder={f.id === "email" ? "example@mail.com" : ""}
                  />
                </div>
              ))}
            </div>

            {/* メッセージ */}
            <div className="mb-6">
              <label
                htmlFor="message"
                className="block font-label text-[9px] tracking-[0.4em] text-white/55 mb-2 uppercase"
              >
                お問い合わせ内容
                <span className="text-white/30 ml-1 font-sans normal-case tracking-normal text-[9px]">
                  / MESSAGE
                </span>
                <span className="text-gold ml-1">*</span>
              </label>
              <textarea
                id="message"
                name="message"
                required
                rows={6}
                className="form-field resize-none"
                placeholder="ご要望・ご予算・施工場所などをご記入ください"
              />
            </div>

            {/* 送信ボタン */}
            <button type="submit" className="btn-service">
              送信する / SEND MESSAGE
              <span className="text-base leading-none">→</span>
            </button>
          </form>
        )}

        {/* TEL */}
        <div className="mt-12 pt-10 border-t border-white/8 text-center">
          <p className="font-label text-[9px] tracking-[0.5em] text-white/35 mb-3">
            TEL（平日 10:00 – 18:00）
          </p>
          <p className="font-label text-2xl text-white/55 tracking-[0.2em]">
            000-0000-0000
          </p>
        </div>
      </div>
    </section>
  );
}
