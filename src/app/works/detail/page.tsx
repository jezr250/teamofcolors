import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PostDetailView from "@/components/PostDetailView";

export const metadata: Metadata = {
  title: "WORKS | TEAM OF COLORS",
};

// 静的exportでは動的ルート不可のため /works/detail?id=xxx のクエリ方式。
// useSearchParams を使う子コンポーネントは Suspense で包む必要がある。
export default function WorkDetailPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen">
        <div className="max-w-3xl mx-auto px-6 md:px-12">
          <Suspense>
            <PostDetailView apiPath="/api/works.php" backHref="/works" backLabel="ALL PROJECTS" />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
