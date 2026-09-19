import type { Metadata } from "next";
import { Cormorant_Garamond, Bebas_Neue, Inter, Noto_Sans_JP, Noto_Serif_JP } from "next/font/google";
import "./globals.css";

/* ── 大見出し用：ラグジュアリーセリフ ── */
const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

/* ── ラベル・ナビ用：コンパクトサンセリフ ── */
const bebas = Bebas_Neue({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-bebas",
  display: "swap",
});

/* ── 英文ボディ用 ── */
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

/* ── 日本語ボディ用 ── */
const notoSansJP = Noto_Sans_JP({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-noto",
  display: "swap",
});

/* ── 日本語見出し用：明朝 ──
   Cormorant に和文グリフは無く、端末の明朝にフォールバックしていた（Android の多くは
   明朝が無くゴシックになる）。和文の見出しだけはこの明朝を明示して端末差をなくす。
   2026-09-20 追加 */
const notoSerifJP = Noto_Serif_JP({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-noto-serif",
  display: "swap",
});

export const metadata: Metadata = {
  title: "TEAM OF COLORS | モルタル造形・内装・エイジング塗装",
  description:
    "Team of Colors はモルタル造形制作・内装・インテリア塗装・エイジング塗装・特殊塗装・特殊左官・氷壁を手がけるアーティスティックな施工会社です。",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "TEAM OF COLORS",
    description: "モルタル造形制作・内装・インテリア塗装・エイジング塗装・特殊塗装・特殊左官・氷壁",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={`${cormorant.variable} ${bebas.variable} ${inter.variable} ${notoSansJP.variable} ${notoSerifJP.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
