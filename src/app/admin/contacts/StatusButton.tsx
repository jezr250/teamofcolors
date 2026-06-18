"use client";

import { useTransition } from "react";
import { updateStatus } from "./actions";

const next: Record<string, { status: string; label: string }> = {
  new:     { status: "read",    label: "確認済にする" },
  read:    { status: "replied", label: "返信済にする" },
  replied: { status: "new",     label: "未読に戻す" },
};

export default function StatusButton({ id, status }: { id: number; status: string }) {
  const [pending, startTransition] = useTransition();
  const action = next[status] ?? next["new"];

  return (
    <button
      disabled={pending}
      onClick={() => startTransition(() => updateStatus(id, action.status))}
      className="text-[10px] tracking-[0.2em] border border-white/20 text-white/50
                 px-3 py-1.5 hover:border-white/50 hover:text-white/80
                 transition disabled:opacity-40 whitespace-nowrap"
    >
      {pending ? "..." : action.label}
    </button>
  );
}
