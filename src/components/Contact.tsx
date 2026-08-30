"use client";
import { useState } from "react";
import {
  SITE_TEL,
  SITE_TEL_HREF,
  SITE_BUSINESS_HOURS,
  SITE_CLOSED_DAYS,
} from "@/lib/siteConfig";

const fields = [
  { id: "name",    label: "お名前",    labelEn: "NAME",    type: "text",  required: true },
  { id: "company", label: "会社名",    labelEn: "COMPANY", type: "text",  required: false },
  { id: "email",   label: "メール",    labelEn: "EMAIL",   type: "email", required: true },
  { id: "phone",   label: "電話番号",  labelEn: "PHONE",   type: "tel",   required: false },
];

export default function Contact() {
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    const data = new FormData(e.currentTarget);
    const body = {
      name: data.get("name"),
      company: data.get("company"),
      email: data.get("email"),
      phone: data.get("phone"),
      message: data.get("message"),
    };
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error || "送信に失敗しました");
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "送信に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="py-24 bg-[#0c0c0c] border-t border-white/8">
      <div className="max-w-2xl mx-auto px-6 md:px-12">

        {/* ヘッダー */}
        <div className="text-center mb-16">
          <p className="type-label text-gold mb-4">
            Contact
          </p>
          <h2 className="type-display mb-6 silver-grad">
            CONTACT
          </h2>
          <p className="type-body text-white/60">
            お問い合わせ・ご相談はお気軽に。<br />
            2営業日以内にご連絡いたします。
          </p>
        </div>

        {sent ? (
          <div className="text-center py-20 border border-gold/30">
            <p className="type-display text-gold mb-3">THANK YOU</p>
            <p className="type-body text-white/60 mt-3">近日中にご連絡いたします。</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit}>
            {/* 入力欄 */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {fields.map((f) => (
                <div key={f.id} className={f.id === "company" || f.id === "phone" ? "" : ""}>
                  <label
                    htmlFor={f.id}
                    className="block type-label tracking-[0.2em] text-white/65 mb-2"
                  >
                    {f.label}
                    <span className="type-body-sm text-white/50 ml-1 font-sans normal-case">
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
                className="block type-label tracking-[0.2em] text-white/65 mb-2"
              >
                お問い合わせ内容
                <span className="type-body-sm text-white/50 ml-1 font-sans normal-case">
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

            {error && (
              <p className="type-body-sm text-red-400 mb-4">{error}</p>
            )}

            {/* 送信ボタン */}
            <button type="submit" disabled={loading} className="btn-service disabled:opacity-50">
              {loading ? "送信中..." : "送信する / SEND MESSAGE"}
              {!loading && <span className="text-base leading-none">→</span>}
            </button>
          </form>
        )}

        {/* TEL */}
        <div id="contact-tel" className="mt-12 pt-10 border-t border-white/8 text-center">
          {/* 金の小ラベル＝セクション名（ハンバーガーメニューの「TEL」と一致させる）。
              以前は「TEL（営業時間／定休日）」と1行に詰め込んでいたが、
              ラベル・条件・番号の3段に分けて役割をはっきりさせている */}
          <p className="type-label text-gold mb-3">
            TEL
          </p>
          <p className="type-body text-white/60 mb-4">
            {SITE_BUSINESS_HOURS}／定休日 {SITE_CLOSED_DAYS}
          </p>
          <a href={SITE_TEL_HREF}
            className="font-label type-heading text-white/55 tracking-[0.2em]
                       hover:text-gold active:text-gold transition-colors">
            {SITE_TEL}
          </a>
        </div>
      </div>
    </section>
  );
}
