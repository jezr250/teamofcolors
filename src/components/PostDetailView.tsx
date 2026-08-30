"use client";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Image from "next/image";
import type { Post } from "@/lib/microcms";
import { formatDate } from "@/lib/formatDate";

// 施工実績の詳細（/works/detail で使用）
// 静的exportでは動的ルート（/works/[id]）が使えないため ?id=xxx クエリ方式。
// useSearchParams を使うので、ページ側で <Suspense> に包むこと。

type Props = {
  apiPath: string;   // 例: "/api/works"
  backHref: string;  // 例: "/works"
  backLabel: string; // 例: "ALL WORKS"
};

export default function PostDetailView({ apiPath, backHref, backLabel }: Props) {
  const id = useSearchParams().get("id");
  const [post, setPost] = useState<Post | null>(null);
  const [status, setStatus] = useState<"loading" | "ok" | "notfound" | "error">("loading");

  useEffect(() => {
    if (!id) {
      setStatus("notfound");
      return;
    }
    fetch(`${apiPath}?id=${encodeURIComponent(id)}`)
      .then((res) => {
        if (res.status === 404) {
          setStatus("notfound");
          return null;
        }
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<Post>;
      })
      .then((data) => {
        if (data) {
          setPost(data);
          setStatus("ok");
        }
      })
      .catch(() => setStatus("error"));
  }, [apiPath, id]);

  if (status === "loading") {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-3 w-40 bg-white/5" />
        <div className="h-8 w-3/4 bg-white/10" />
        <div className="aspect-[16/9] bg-white/5" />
        <div className="h-4 w-full bg-white/5" />
        <div className="h-4 w-5/6 bg-white/5" />
      </div>
    );
  }

  if (status === "notfound" || status === "error") {
    return (
      <div className="py-20 text-center">
        <p className="type-body text-white/55 mb-8">
          {status === "notfound"
            ? "記事が見つかりませんでした。"
            : "記事の取得に失敗しました。しばらくしてから再度お試しください。"}
        </p>
        <a href={backHref}
          className="inline-block border border-white/35 text-white/75 type-meta
                     tracking-[0.3em] px-8 py-3 font-label
                     hover:border-gold hover:text-gold transition-all duration-300">
          ← {backLabel}
        </a>
      </div>
    );
  }

  return (
    <article>
      {/* メタ情報 */}
      <div className="flex items-center gap-4 mb-6">
        <time className="type-meta text-white/55">
          {formatDate(post!.publishedAt)}
        </time>
        {post!.category && (
          <span className="type-meta tracking-[0.1em] text-white/60
                           border border-white/15 px-2 py-0.5">
            {post!.category.name}
          </span>
        )}
      </div>

      {/* タイトル */}
      <h1 className="type-heading text-white/90 mb-10">
        {post!.title}
      </h1>

      {/* アイキャッチ */}
      {post!.eyecatch && (
        <div className="relative aspect-[16/9] overflow-hidden mb-12 bg-[#141414]">
          <Image
            src={post!.eyecatch.url}
            alt={post!.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 768px"
            priority
          />
        </div>
      )}

      {/* 本文（microCMS richEditorのHTML） */}
      {post!.content && (
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: post!.content }}
        />
      )}

      {/* タグ（worksのみ） */}
      {post!.tags && post!.tags.length > 0 && (
        <div className="flex flex-wrap gap-3 mt-12 pt-8 border-t border-white/8">
          {post!.tags.map((tag) => (
            <span key={tag} className="type-meta uppercase tracking-[0.1em] text-white/55">
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* 戻る */}
      <div className="mt-16 pt-10 border-t border-white/8 text-center">
        <a href={backHref}
          className="inline-block border border-white/35 text-white/75 type-meta
                     tracking-[0.3em] px-8 py-3 font-label
                     hover:border-gold hover:text-gold active:border-gold active:text-gold
                     transition-all duration-300">
          ← {backLabel}
        </a>
      </div>
    </article>
  );
}
