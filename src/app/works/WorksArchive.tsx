"use client";
import { useSearchParams } from "next/navigation";
import SubpageHero from "@/components/SubpageHero";
import PostArchive from "@/components/PostArchive";
import { SERVICE_CATEGORIES } from "@/lib/serviceCategories";

// /works の中身。?category= を読み、カテゴリー指定時は見出しとリード文を切り替え、
// 該当カテゴリーのみ絞り込み表示する（未指定=全件）。
// useSearchParams を使うため、呼び出し側で <Suspense> に包む必要がある。
const DEFAULT_DESCRIPTION =
  "モルタル造形制作・内装・インテリア・エイジング塗装の施工実績をご紹介します。";

export default function WorksArchive() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const category = categoryId ? SERVICE_CATEGORIES[categoryId] : undefined;

  return (
    <>
      {category && (
        <nav className="mb-6">
          <a
            href="/works"
            className="font-label text-xs tracking-[0.25em] text-white/50
                       hover:text-gold transition-colors gold-hover"
          >
            ← ALL WORKS
          </a>
        </nav>
      )}
      <SubpageHero
        label={category ? "Works" : "All Projects"}
        title={category ? category.name : "WORKS"}
        description={category ? category.description : DEFAULT_DESCRIPTION}
      />
      <PostArchive
        apiPath="/api/works.php"
        detailPath="/works/detail"
        category={category?.id}
      />
    </>
  );
}
