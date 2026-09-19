"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import type { Post, PostListResponse } from "@/lib/microcms";
import { formatDate } from "@/lib/formatDate";

// 施工実績の一覧グリッド（/works で使用）
// 中継API（/api/works）からCSRで取得し、「MORE」で12件ずつ追加読み込み。
//
// 一覧には2種類の項目が混ざる（詳しくは lib/microcms.ts）:
//   - microCMS記事 … タイトル・日付つき。クリックで詳細ページへ
//   - 静的写真(photoOnly) … 写真とサービス名のみ。遷移先を持たないため非リンク

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
      <p className="py-20 text-center type-body text-white/55">
        実績の取得に失敗しました。しばらくしてから再度お試しください。
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
    return <p className="py-20 text-center type-body text-white/55">実績はまだありません。</p>;
  }

  // 写真1枚ぶんの枠。組（pair）のカードでは2つ横に並べる
  const photo = (img: { url: string }, alt: string, sizes: string, label?: string) => (
    <div className="relative aspect-[4/3] overflow-hidden bg-[#141414]">
      <Image
        src={img.url}
        alt={alt}
        fill
        className="object-cover transition-transform duration-700 group-hover:scale-106"
        sizes={sizes}
      />
      <div className="absolute inset-0 bg-black/15 group-hover:bg-black/5 transition-colors duration-300" />
      {label && (
        <span className="absolute top-3 left-3 type-meta uppercase tracking-[0.25em]
                         text-gold bg-black/60 px-2 py-1">
          {label}
        </span>
      )}
    </div>
  );

  // カード中身は記事／写真で共通の見た目にせず、写真のほうは情報を持たせない
  const cardInner = (post: Post) => (
    <>
      {post.pair ? (
        // 2枚1組（施工前後など）。カード自体を2列ぶんの幅にして、中で2枚を横に並べる。
        // スマホ（1列）では上下に積む。組は一覧の先頭に固めて出すので、縦に積んでも
        // Before → After の順は崩れない（2026-09-19 ユーザー判断）
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-px bg-white/5">
          {post.pair.map((p, i) =>
            <div key={i}>
              {photo(p.thumb, p.label ? `${post.title}（${p.label}）` : post.title,
                     "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw", p.label)}
            </div>
          )}
        </div>
      ) : (
        (post.thumb ?? post.eyecatch) &&
          photo((post.thumb ?? post.eyecatch)!, post.title,
                "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw")
      )}

      <div className="p-5 md:p-6">
        {post.photoOnly ? (
          // 写真のみ — 架空の物件名は付けず、サービス名だけを出す
          <>
            <p className="type-meta uppercase tracking-[0.25em] text-gold mb-2">
              Category
            </p>
            <h3 className="type-card-title text-white/90">
              {post.category?.name ?? post.title}
            </h3>
          </>
        ) : (
          <>
            <div className="flex items-center gap-3 mb-3">
              <time className="type-meta text-white/55">
                {formatDate(post.publishedAt)}
              </time>
              {post.category && (
                <span className="type-meta tracking-[0.1em] text-white/60 border border-white/15 px-2 py-0.5">
                  {post.category.name}
                </span>
              )}
            </div>
            <h3 className="type-card-title text-white/90 mb-3
                           group-hover:text-gold group-active:text-gold transition-colors">
              {post.title}
            </h3>
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="type-meta uppercase tracking-[0.1em] text-white/55">
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </>
  );

  // hover 演出は遷移先を持つ記事カードだけに付ける（group は <a> 側で足す）
  const cardClass = "relative block w-full text-left bg-[#0a0a0a] overflow-hidden";

  return (
    <>
      {/* grid-flow-dense: 2列ぶんの組カードが先頭に並ぶと、3列のときに右端が空くので、
          後続の1列カードをその空きに詰める（左→右・上→下の読み順は保たれる） */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 grid-flow-dense gap-px bg-white/5">
        {posts.map((post) =>
          post.photoOnly ? (
            // 遷移先も拡大表示も持たないので、ただの表示要素として置く。
            // 組（pair）は2列ぶんの幅を取る（1列のスマホではそのまま全幅）
            <div key={post.id} className={`${cardClass} ${post.pair ? "sm:col-span-2" : ""}`}>
              {cardInner(post)}
            </div>
          ) : (
            <a
              key={post.id}
              href={`${detailPath}?id=${encodeURIComponent(post.id)}`}
              className={`group ${cardClass}`}
            >
              {cardInner(post)}
            </a>
          )
        )}
      </div>

      {/* 追加読み込み */}
      {posts.length < totalCount && (
        <div className="mt-12 text-center">
          <button
            onClick={() => load(posts.length)}
            disabled={loading}
            className="inline-block border border-white/35 text-white/75 type-meta
                       tracking-[0.3em] px-10 py-3
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
