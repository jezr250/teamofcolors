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

        {/* サービス説明 */}
        <p className="font-label text-[10px] tracking-[0.3em] text-white/45 uppercase text-center">
          Artificial Rock · Interior Design · Aging Paint
        </p>

        {/* ナビ */}
        <nav className="flex flex-wrap justify-center gap-5 md:gap-8 pt-4 border-t border-white/10 w-full">
          {["ABOUT","SERVICE","WORKS","ORDER","NEWS","CONTACT"].map((item) => (
            <a
              key={item}
              href={`#${item.toLowerCase()}`}
              className="font-label text-[10px] tracking-[0.25em] text-white/50
                         hover:text-gold transition-colors duration-300 gold-hover"
            >
              {item}
            </a>
          ))}
        </nav>

        {/* 区切り */}
        <div className="w-16 h-px bg-white/20" />

        {/* コピーライト */}
        <p className="font-label text-[9px] tracking-[0.2em] text-white/40">
          © 2025 TEAM OF COLORS. ALL RIGHTS RESERVED.
        </p>
      </div>
    </footer>
  );
}
