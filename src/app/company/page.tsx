import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubpageHero from "@/components/SubpageHero";
import {
  COMPANY_NAME,
  COMPANY_CEO,
  COMPANY_SERVICES,
  COMPANY_PHILOSOPHY,
  COMPANY_KEYWORDS,
  SITE_ADDRESS_FULL,
  SITE_TEL,
  SITE_TEL_HREF,
  SITE_BUSINESS_HOURS,
  SITE_CLOSED_DAYS,
  SITE_MAP_EMBED_URL,
  SITE_MAP_LINK_URL,
} from "@/lib/siteConfig";

export const metadata: Metadata = {
  title: "会社概要 | TEAM OF COLORS",
  description:
    "TEAM OF COLORS株式会社の会社概要・事業内容・アクセス。神奈川県横浜市港南区を拠点に、モルタル造形・特殊左官・エイジング塗装・一般建築塗装を手がけています。",
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
];

export default function CompanyPage() {
  // 検索結果に会社情報（住所・電話・営業時間）を出すための構造化データ
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: COMPANY_NAME,
    description:
      "モルタル造形・特殊左官・エイジング塗装・一般建築塗装を手がける施工会社",
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
            description="神奈川県横浜市を拠点に、モルタル造形・特殊左官・エイジング塗装を手がけています。"
          />

          {/* 企業理念 */}
          <section className="mb-20">
            <h2 className="type-label text-gold mb-8">
              Philosophy
            </h2>
            <div className="space-y-4">
              {COMPANY_PHILOSOPHY.map((line) => (
                <p
                  key={line}
                  className="type-heading text-white/85"
                >
                  {line}
                </p>
              ))}
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              {COMPANY_KEYWORDS.map((word) => (
                <span
                  key={word}
                  className="type-meta text-white/55 border border-white/15 px-3 py-1"
                >
                  {word}
                </span>
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

          {/* アクセス */}
          <section>
            <h2 className="type-label text-gold mb-8">
              Access
            </h2>
            <p className="type-body text-white/85 mb-2">{SITE_ADDRESS_FULL}</p>
            <a
              href={SITE_MAP_LINK_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block type-meta tracking-[0.25em] text-white/55
                         hover:text-gold transition-colors gold-hover mb-6"
            >
              GOOGLE マップで開く →
            </a>
            {/* 地図は表示に時間がかかるので遅延読み込み。読めない環境では上のリンクが受け皿になる */}
            <div className="aspect-[16/9] w-full border border-white/10">
              <iframe
                src={SITE_MAP_EMBED_URL}
                title={`${COMPANY_NAME}の所在地`}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="w-full h-full"
              />
            </div>
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
