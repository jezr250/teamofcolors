import type { Metadata } from "next";
import { Suspense } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SubpageHero from "@/components/SubpageHero";
import WorksArchive from "./WorksArchive";

export const metadata: Metadata = {
  title: "WORKS | TEAM OF COLORS",
  description: "Team of Colors の施工実績一覧。モルタル造形制作・内装・インテリア・エイジング塗装の事例をご紹介します。",
};

export default function WorksPage() {
  return (
    <>
      <Header />
      <main className="pt-32 pb-24 bg-[#0a0a0a] min-h-screen">
        <div className="max-w-7xl mx-auto px-6 md:px-12">
          <Suspense
            fallback={
              <SubpageHero
                label="All Projects"
                title="WORKS"
                description="モルタル造形制作・内装・インテリア・エイジング塗装の施工実績をご紹介します。"
              />
            }
          >
            <WorksArchive />
          </Suspense>
        </div>
      </main>
      <Footer />
    </>
  );
}
