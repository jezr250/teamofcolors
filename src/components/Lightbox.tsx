"use client";
import { useEffect } from "react";
import Image from "next/image";
import type { Post } from "@/lib/microcms";

// 写真のみの施工実績（詳細ページを持たない静的写真）を拡大表示する。
// 左右キー／矢印ボタンで同じ一覧内を移動、Esc または背景クリックで閉じる。

type Props = {
  posts: Post[]; // 拡大対象の並び（写真のみの項目に限定して渡す）
  index: number;
  onClose: () => void;
  onMove: (nextIndex: number) => void;
};

export default function Lightbox({ posts, index, onClose, onMove }: Props) {
  const post = posts[index];

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && index > 0) onMove(index - 1);
      if (e.key === "ArrowRight" && index < posts.length - 1) onMove(index + 1);
    };
    window.addEventListener("keydown", onKey);
    // 背後のページがスクロールしないようにする
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, posts.length, onClose, onMove]);

  if (!post?.eyecatch) return null;

  return (
    // z-300 はナビゲーションオーバーレイ(200)とハンバーガーボタン(210)より前面に出すため
    <div
      className="fixed inset-0 z-[300] bg-black/92 flex flex-col"
      role="dialog"
      aria-modal="true"
      aria-label={`${post.title} の拡大表示`}
      onClick={onClose}
    >
      {/* 上部バー — カテゴリ名と閉じるボタン */}
      <div className="flex items-center justify-between px-5 md:px-8 py-4 shrink-0">
        <p className="font-label text-[11px] tracking-[0.25em] text-gold uppercase">
          {post.category?.name ?? post.title}
          <span className="ml-3 text-white/40 normal-case tracking-[0.15em]">
            {index + 1} / {posts.length}
          </span>
        </p>
        <button
          onClick={onClose}
          aria-label="閉じる"
          className="text-white/60 hover:text-gold transition-colors text-2xl leading-none px-2"
        >
          ×
        </button>
      </div>

      {/* 画像 — クリックが背景に抜けて閉じないよう stopPropagation */}
      <div className="flex-1 min-h-0 flex items-center justify-center px-4 pb-4">
        <div
          className="relative w-full h-full"
          onClick={(e) => e.stopPropagation()}
        >
          <Image
            src={post.eyecatch.url}
            alt={post.title}
            fill
            className="object-contain"
            sizes="100vw"
            priority
          />
        </div>
      </div>

      {/* 前後送り */}
      {index > 0 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMove(index - 1);
          }}
          aria-label="前の写真"
          className="absolute left-2 md:left-5 top-1/2 -translate-y-1/2 w-11 h-11
                     flex items-center justify-center text-2xl
                     text-white/55 hover:text-gold transition-colors"
        >
          ‹
        </button>
      )}
      {index < posts.length - 1 && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onMove(index + 1);
          }}
          aria-label="次の写真"
          className="absolute right-2 md:right-5 top-1/2 -translate-y-1/2 w-11 h-11
                     flex items-center justify-center text-2xl
                     text-white/55 hover:text-gold transition-colors"
        >
          ›
        </button>
      )}
    </div>
  );
}
