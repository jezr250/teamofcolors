import {
  COMPANY_NAME,
  SITE_ADDRESS_FULL,
  SITE_TEL,
  SITE_TEL_HREF,
  SITE_BUSINESS_HOURS,
  SITE_CLOSED_DAYS,
} from "@/lib/siteConfig";

export default function Footer() {
  return (
    <footer className="bg-[#050505] py-16 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-6 md:px-12 flex flex-col items-center gap-8">

        {/* ロゴマーク */}
        <div className="opacity-70">
          <svg width="80" height="56" viewBox="0 0 52 36" fill="white">
            <rect x="1" y="1" width="50" height="34" rx="6"
              stroke="white" strokeWidth="1" fill="none" />
            <path
              d="M7 30 C6.5 27 6.5 24 7.5 22 L6.5 21 C6 20 6.5 19 7.5 19 L8.5 21
                 C10 20 11.5 19.5 13 20 L13.5 18.5 C14 17.5 15 18 15 19 L14.5 20.5
                 C15.5 21.5 16 23 16 25.5 L16.5 26 C17 27 16.5 28.5 15.5 28.5 L15 28
                 C15 29.5 14.5 31 14 32 L14 34 L12.5 34 L12.5 32 L11.5 32 L11.5 34
                 L10 34 L10 32 C9.5 31 9 29.5 9 28 Z"
              fill="white"
            />
            <text x="35" y="23" textAnchor="middle" fill="white"
              fontSize="12" fontFamily="var(--font-bebas),sans-serif" letterSpacing="2">
              TOC
            </text>
          </svg>
        </div>

        {/* ブランド名 */}
        <p className="font-heading tracking-[0.3em] text-sm silver-grad">
          TEAM OF COLORS
        </p>

        {/* 区切り — 各ページへのリンクはハンバーガーメニューに集約しているのでここには置かない */}
        <div className="w-16 h-px bg-white/20" />

        {/* 会社情報 — 検索サイトが会社を認識する手がかりになるので全ページに置く */}
        <address className="not-italic text-center space-y-1.5">
          <p className="text-xs text-white/70 tracking-[0.1em]">{COMPANY_NAME}</p>
          <p className="text-xs text-white/50 tracking-[0.05em]">{SITE_ADDRESS_FULL}</p>
          <p className="text-xs text-white/50 tracking-[0.05em]">
            TEL{" "}
            <a href={SITE_TEL_HREF} className="hover:text-gold transition-colors">
              {SITE_TEL}
            </a>
          </p>
          <p className="text-xs text-white/40 tracking-[0.05em]">
            営業時間 {SITE_BUSINESS_HOURS}／定休日 {SITE_CLOSED_DAYS}
          </p>
        </address>

        {/* 上の要約を読んだ流れで詳細ページへ行けるようにする */}
        <a
          href="/company"
          className="inline-block border border-white/25 text-white/70 font-label text-xs
                     tracking-[0.3em] px-8 py-3
                     hover:border-gold hover:text-gold active:border-gold active:text-gold
                     transition-all duration-300"
        >
          COMPANY →
        </a>

        {/* コピーライト */}
        <p className="font-label text-xs tracking-[0.2em] text-white/55">
          © 2026 TEAM OF COLORS. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
