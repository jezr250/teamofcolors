"use client";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import SubpageHero from "@/components/SubpageHero";
import PostArchive from "@/components/PostArchive";
import { SERVICE_CATEGORIES, SERVICE_CATEGORY_LIST } from "@/lib/serviceCategories";

// /works の中身。?category= を読み、カテゴリー指定時は見出しとリード文を切り替え、
// 該当カテゴリーのみ絞り込み表示する（未指定=全件）。
// useSearchParams を使うため、呼び出し側で <Suspense> に包む必要がある。
const DEFAULT_DESCRIPTION =
  "モルタル造形制作・内装・インテリア・エイジング塗装の施工実績をご紹介します。";

export default function WorksArchive() {
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("category");
  const category = categoryId ? SERVICE_CATEGORIES[categoryId] : undefined;

  // トップのサービスタイルから ?category= 付きで来るほか、ここでも直接切り替えられるようにする
  const tabs = [
    { id: undefined, label: "ALL", href: "/works" },
    ...SERVICE_CATEGORY_LIST.map((c) => ({
      id: c.id,
      label: c.name,
      href: `/works?category=${c.id}`,
    })),
  ];

  return (
    <>
      <SubpageHero
        label={category ? "Works" : "All Projects"}
        title={category ? category.name : "WORKS"}
        description={category ? category.description : DEFAULT_DESCRIPTION}
      />

      <nav className="mb-10 flex flex-wrap gap-x-6 gap-y-3 border-b border-white/5 pb-5">
        {tabs.map((tab) => {
          const active = tab.id === (category?.id ?? undefined);
          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? "page" : undefined}
              className={`font-label text-xs tracking-[0.2em] transition-colors gold-hover
                          ${active ? "text-gold" : "text-white/50 hover:text-white/80"}`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      <PostArchive
        apiPath="/api/works.php"
        detailPath="/works/detail"
        category={category?.id}
      />
    </>
  );
}
