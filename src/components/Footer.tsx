import {
  COMPANY_NAME,
  SITE_ADDRESS_FULL,
  SITE_TEL,
  SITE_TEL_HREF,
  SITE_BUSINESS_HOURS,
  SITE_CLOSED_DAYS,
} from "@/lib/siteConfig";
import LogoMark from "./LogoMark";

// 会社情報のブロックはトップページのフッターだけに置く（showCompany）。
// 会社概要ページや実績ページでは、同じ内容がページ本体にあるか文脈が違うので出さない。
// ここに id は振らない。お問い合わせフォームの「会社名」欄が id="company" を持っており、
// 文書内で先に現れるそちらにアンカーが吸われるため。
type Props = { showCompany?: boolean };

export default function Footer({ showCompany = false }: Props) {
  // 上余白と各ブロックの間隔を詰めてある。ハンバーガーの TEL から飛んだときに、
  // フッターのコピーライトまで1画面に収まるようにするため（画面が低い端末ほど効く）。
  return (
    <footer className="bg-[#050505] pt-10 pb-12 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center gap-6">

        {showCompany && (
          <div className="flex flex-col items-center gap-8">
            {/* 金の小ラベル＝セクション名（ハンバーガーメニューの語と一致させる） */}
            <p className="type-label text-gold">Company</p>

            <address className="not-italic text-center space-y-1.5">
              <p className="type-body-sm text-white/70">{COMPANY_NAME}</p>
              <p className="type-body-sm text-white/50">{SITE_ADDRESS_FULL}</p>
              <p className="type-body-sm text-white/50">
                TEL{" "}
                <a href={SITE_TEL_HREF} className="hover:text-gold transition-colors">
                  {SITE_TEL}
                </a>
              </p>
              <p className="type-body-sm text-white/40">
                営業時間 {SITE_BUSINESS_HOURS}／定休日 {SITE_CLOSED_DAYS}
              </p>
            </address>

            {/* 上の要約を読んだ流れで会社概要ページへ行けるようにする。
                ORDER の CONTACT ボタンと同じ金ベタにして目立たせる（2026-09-13 レビュー指摘） */}
            <a
              href="/company"
              className="inline-block bg-gold text-black type-meta tracking-[0.3em]
                         px-8 py-3 hover:bg-gold-light transition-colors duration-300"
            >
              COMPANY →
            </a>
          </div>
        )}

        {/* 区切り。COMPANYブロックとロゴの間を分けるためのものなので、
            ブロックが無い下層ページでは出さない（線だけが浮いて見えるため）。
            各ページへのリンクはハンバーガーメニューに集約しているのでここには置かない */}
        {showCompany && <div className="w-16 h-px bg-white/20" />}

        {/* ロゴマーク（ヘッダーと共用） */}
        <div>
          <LogoMark size={88} />
        </div>

        {/* ブランド名 */}
        <p className="font-heading tracking-[0.3em] type-card-title silver-grad">
          TEAM OF COLORS
        </p>

        {/* コピーライト */}
        <p className="type-meta text-white/55">
          © 2026 TEAM OF COLORS. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
