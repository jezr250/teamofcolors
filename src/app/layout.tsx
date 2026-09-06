import type { Metadata } from "next";
import { Cormorant_Garamond, Bebas_Neue, Inter, Noto_Sans_JP } from "next/font/google";
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

export const metadata: Metadata = {
  title: "TEAM OF COLORS | モルタル造形・内装・エイジング塗装",
  description:
    "Team of Colors はモルタル造形制作・内装・インテリア塗装・エイジング塗装・特殊塗装・氷壁を手がけるアーティスティックな施工会社です。",
  icons: {
    icon: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },
  openGraph: {
    title: "TEAM OF COLORS",
    description: "モルタル造形制作・内装・インテリア塗装・エイジング塗装・特殊塗装・氷壁",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="ja"
      className={`${cormorant.variable} ${bebas.variable} ${inter.variable} ${notoSansJP.variable}`}
    >
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
