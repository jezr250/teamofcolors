import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubpageHero from "@/components/SubpageHero";
import {
  COMPANY_NAME,
  COMPANY_CEO,
  COMPANY_SERVICES,
  COMPANY_PHILOSOPHY,
  COMPANY_LICENSES,
  COMPANY_TAGLINE,
  COMPANY_MAJOR_CLIENTS,
  SITE_ADDRESS_FULL,
  SITE_TEL,
  SITE_TEL_HREF,
  SITE_BUSINESS_HOURS,
  SITE_CLOSED_DAYS,
} from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "会社概要 | TEAM OF COLORS",
  description:
    `TEAM OF COLORS株式会社の会社概要・企業理念・事業内容・主要取引先。神奈川県横浜市港南区を拠点に、${COMPANY_TAGLINE}。`,
};

// 会社概要の表。値が確定していない項目（設立年月日・資本金・許可番号など）は
// 憶測で埋めず、判明した時点で行を足す。
const PROFILE_ROWS: { label: string; value: React.ReactNode }[] = [
  { label: "会社名", value: COMPANY_NAME },
  { label: "代表取締役", value: COMPANY_CEO },
  { label: "所在地", value: SITE_ADDRESS_FULL },
  {
    label: "電話番号",
    value: (
      <a href={SITE_TEL_HREF} className="hover:text-gold transition-colors">
        {SITE_TEL}
      </a>
    ),
  },
  { label: "営業時間", value: SITE_BUSINESS_HOURS },
  { label: "定休日", value: SITE_CLOSED_DAYS },
  {
    // 11項目あるので1行に詰めず縦に並べる。補足のある項目はその場に添える。
    label: "事業内容",
    value: (
      <ul className="space-y-1.5">
        {COMPANY_SERVICES.map((s) => (
          <li key={s.name}>
            {s.name}
            {s.note && <span className="text-white/45">（{s.note}）</span>}
          </li>
        ))}
      </ul>
    ),
  },
  {
    // 許認可等 — 先方指定で事業内容の直後。種別と番号を1行に並べる
    label: "許認可等",
    value: (
      <ul className="space-y-1.5">
        {COMPANY_LICENSES.map((l) => (
          <li key={l.number}>
            {l.name}
            <span className="inline-block ml-3">{l.number}</span>
          </li>
        ))}
      </ul>
    ),
  },
];

export default function CompanyPage() {
  // 検索結果に会社情報（住所・電話・営業時間）を出すための構造化データ
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY_NAME,
    description: `${COMPANY_TAGLINE}。`,
    address: {
      "@type": "PostalAddress",
      postalCode: "233-0006",
      addressRegion: "神奈川県",
      addressLocality: "横浜市港南区",
      streetAddress: "芹が谷3-6-3",
      addressCountry: "JP",
    },
    telephone: SITE_TEL,
    openingHours: "Mo-Sa 09:00-17:00",
  };

  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen">
        <div className="max-w-5xl mx-auto px-6 md:px-12">
          <SubpageHero
            label="Company"
            title="会社概要"
            description={`${COMPANY_TAGLINE}。`}
          />

          {/* 企業理念 — 先方支給の全文。見出しはページ先頭の「Company / 会社概要」と同じ組み方
              （金の小ラベル＋銀の和文大見出し）。段落が長いので本文サイズで組み、
              最初の一文だけは理念の核なので type-heading で大きく見せる */}
          <section className="mb-20">
            <p className="type-label text-gold mb-4">Philosophy</p>
            <h2 className="silver-grad type-display-ja mb-10">企業理念</h2>
            <p className="type-heading text-white/85 mb-8">
              {COMPANY_PHILOSOPHY[0]}
            </p>
            <div className="space-y-5 max-w-3xl">
              {COMPANY_PHILOSOPHY.slice(1).map((line) => (
                <p key={line} className="type-body text-white/70 leading-loose">
                  {line}
                </p>
              ))}
            </div>
          </section>

          {/* 会社概要 — 定義リストの表 */}
          <section className="mb-20">
            <h2 className="type-label text-gold mb-8">
              Profile
            </h2>
            <dl className="border-t border-white/10">
              {PROFILE_ROWS.map((row) => (
                <div
                  key={row.label}
                  className="flex flex-col md:flex-row gap-1 md:gap-8 py-5 border-b border-white/10"
                >
                  <dt className="md:w-40 shrink-0 type-body text-white/50">
                    {row.label}
                  </dt>
                  <dd className="type-body text-white/85">
                    {row.value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>

          {/* 主要取引先 — 先方指定で Profile の後ろ。並び順（五十音順）は動かさない */}
          <section>
            <h2 className="type-label text-gold mb-8">
              Major Clients
            </h2>
            <ul className="space-y-3">
              {COMPANY_MAJOR_CLIENTS.map((name) => (
                <li key={name} className="type-body text-white/85">
                  {name}
                </li>
              ))}
            </ul>
            <p className="type-meta text-white/45 mt-6">（五十音順）</p>
          </section>

        </div>
      </main>
      <Footer />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
    </>
  );
}
