"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { Post, PostListResponse } from "@/lib/microcms";
import { formatDate } from "@/lib/formatDate";

// 施工実績の一覧グリッド（/works で使用）
// 中継API（/api/works）からCSRで取得し、「MORE」で12件ずつ追加読み込み。

const PAGE_SIZE = 12;

type Props = {
  apiPath: string;    // 例: "/api/works"
  detailPath: string; // 例: "/works/detail"
  category?: string;  // 指定時はそのカテゴリーのみ取得（未指定=全件）
};

export default function PostArchive({ apiPath, detailPath, category }: Props) {
  const [posts, setPosts] = useState<Post[]>([]);
  const [totalCount, setTotalCount] = useState<number | null>(null); // null = 初回読み込み中
  const [loading, setLoading] = useState(false);
  const [failed, setFailed] = useState(false);

  const load = (offset: number) => {
    setLoading(true);
    const params = new URLSearchParams({ limit: String(PAGE_SIZE), offset: String(offset) });
    if (category) params.set("category", category);
    fetch(`${apiPath}?${params.toString()}`)
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<PostListResponse>;
      })
      .then((data) => {
        setPosts((prev) => (offset === 0 ? data.contents : [...prev, ...data.contents]));
        setTotalCount(data.totalCount);
      })
      .catch(() => setFailed(true))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    // apiPath / category が変わったら先頭から読み直し（スケルトン表示に戻す）
    setPosts([]);
    setTotalCount(null);
    setFailed(false);
    load(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiPath, category]);

  if (failed) {
    return (
      <p className="py-20 text-center text-sm text-white/55">
        記事の取得に失敗しました。しばらくしてから再度お試しください。
      </p>
    );
  }

  // 初回読み込み中のスケルトン
  if (totalCount === null) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="bg-[#0a0a0a] animate-pulse">
            <div className="aspect-[4/3] bg-white/5" />
            <div className="p-5 md:p-6 space-y-3">
              <div className="h-3 w-24 bg-white/5" />
              <div className="h-4 w-3/4 bg-white/10" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (posts.length === 0) {
    return <p className="py-20 text-center text-sm text-white/55">記事はまだありません。</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-px bg-white/5">
        {posts.map((post) => (
          <a
            key={post.id}
            href={`${detailPath}?id=${encodeURIComponent(post.id)}`}
            className="group relative block bg-[#0a0a0a] overflow-hidden"
          >
            {/* アイキャッチ */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#141414]">
              {post.eyecatch && (
                <Image
                  src={post.eyecatch.url}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-106"
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                />
              )}
              <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-300" />
            </div>

            {/* テキスト */}
            <div className="p-5 md:p-6">
              <div className="flex items-center gap-3 mb-3">
                <time className="font-label text-[11px] tracking-[0.2em] text-white/55">
                  {formatDate(post.publishedAt)}
                </time>
                {post.category && (
                  <span className="font-label text-[11px] tracking-[0.1em] text-white/60 border border-white/15 px-2 py-0.5">
                    {post.category.name}
                  </span>
                )}
              </div>
              <h3 className="text-sm text-white/90 leading-relaxed tracking-wide mb-3
                             group-hover:text-gold group-active:text-gold transition-colors">
                {post.title}
              </h3>
              {post.tags && post.tags.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {post.tags.map((tag) => (
                    <span key={tag} className="font-label text-[11px] tracking-[0.1em] text-white/55 uppercase">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </a>
        ))}
      </div>

      {/* 追加読み込み */}
      {posts.length < totalCount && (
        <div className="mt-12 text-center">
          <button
            onClick={() => load(posts.length)}
            disabled={loading}
            className="inline-block border border-white/35 text-white/75 text-xs
                       tracking-[0.3em] px-10 py-3 font-label
                       hover:border-gold hover:text-gold active:border-gold active:text-gold
                       disabled:opacity-40 transition-all duration-300"
          >
            {loading ? "LOADING…" : "MORE →"}
          </button>
        </div>
      )}
    </>
  );
}
