"use client";
import { useEffect, useRef, useState } from "react";
import type { Post, PostListResponse } from "@/lib/microcms";
import { formatDate } from "@/lib/formatDate";

// トップページのNEWS欄 — microCMS news の最新3件をCSRで取得して表示。
// 全件は /blog ページ（ALL NEWS →）。

export default function NewsSection() {
  const ref = useRef<HTMLElement>(null);
  const [posts, setPosts] = useState<Post[] | null>(null); // null = 読み込み中
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    fetch("/api/news.php?limit=3")
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<PostListResponse>;
      })
      .then((data) => setPosts(data.contents))
      .catch(() => setFailed(true));
  }, []);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          e.target.classList.add("visible");
        }),
      { threshold: 0.06 }
    );
    ref.current?.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [posts]);

  // 取得失敗時はセクションごと非表示（トップページの見た目を壊さない）
  if (failed) return null;

  return (
    <section id="news" className="py-24 bg-[#0d0d0d]" ref={ref}>
      <div className="max-w-4xl mx-auto px-6 md:px-12">
        {/* ヘッダー */}
        <div className="reveal flex items-end justify-between mb-10 pb-6 border-b border-white/5">
          <div>
            <p className="font-label text-xs tracking-[0.5em] text-gold uppercase mb-3">Journal</p>
            <h2 className="font-heading italic text-5xl md:text-6xl tracking-[0.04em] silver-grad">
              NEWS
            </h2>
          </div>
          <a href="/blog"
            className="hidden md:block text-xs tracking-[0.3em] text-white/60
                       hover:text-gold transition-colors font-label gold-hover">
            ALL NEWS →
          </a>
        </div>

        {/* 記事リスト（最新3件） */}
        <div className="reveal divide-y divide-white/5">
          {posts === null
            ? // 読み込み中スケルトン（レイアウトのガタつき防止）
              [0, 1, 2].map((i) => (
                <div key={i} className="py-6 animate-pulse">
                  <div className="h-3 w-40 bg-white/5 mb-3" />
                  <div className="h-4 w-3/4 bg-white/10" />
                </div>
              ))
            : posts.map((post) => (
                <a
                  key={post.id}
                  href={`/blog/detail?id=${encodeURIComponent(post.id)}`}
                  className="group block py-6"
                >
                  <div className="flex items-center gap-4 mb-2">
                    <time className="font-label text-xs tracking-[0.2em] text-white/55">
                      {formatDate(post.publishedAt)}
                    </time>
                    {post.category && (
                      <span className="font-label text-[11px] tracking-[0.1em] text-white/60
                                       border border-white/15 px-2 py-0.5">
                        {post.category.name}
                      </span>
                    )}
                  </div>
                  <h3 className="text-sm text-white/85 leading-relaxed tracking-wide
                                 group-hover:text-gold group-active:text-gold transition-colors">
                    {post.title}
                  </h3>
                </a>
              ))}
          {posts !== null && posts.length === 0 && (
            <p className="py-6 text-sm text-white/55">お知らせはまだありません。</p>
          )}
        </div>

        {/* モバイル用 全件リンク */}
        <div className="mt-10 text-center md:hidden">
          <a href="/blog"
            className="inline-block border border-white/35 text-white/75 text-xs
                       tracking-[0.3em] px-8 py-3 font-label
                       hover:border-gold hover:text-gold active:border-gold active:text-gold
                       transition-all duration-300">
            ALL NEWS →
          </a>
        </div>
      </div>
    </section>
  );
}
