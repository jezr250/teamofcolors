import type { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubpageHero from "@/components/SubpageHero";
import PostArchive from "@/components/PostArchive";

export const metadata: Metadata = {
  title: "NEWS | TEAM OF COLORS",
  description: "Team of Colors からのお知らせ・活動報告をお届けします。",
};

export default function BlogPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <SubpageHero
            label="Journal"
            title="NEWS"
            description="お知らせ・イベント情報・活動報告をお届けします。"
          />
          <PostArchive apiPath="/api/news" detailPath="/blog/detail" />
        </div>
      </main>
      <Footer />
    </>
  );
}
