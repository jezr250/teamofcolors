import { prisma } from "@/lib/prisma";
import StatusButton from "./StatusButton";

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD ?? "admin";

const STATUS_CONFIG = {
  new:     { label: "未読",   border: "border-l-yellow-400", badge: "bg-yellow-400/15 text-yellow-400 border-yellow-400/30" },
  read:    { label: "確認済", border: "border-l-white/20",  badge: "bg-white/5 text-white/40 border-white/20" },
  replied: { label: "返信済", border: "border-l-green-500",  badge: "bg-green-500/15 text-green-400 border-green-500/30" },
} as const;

type StatusKey = keyof typeof STATUS_CONFIG;

function formatDate(d: Date) {
  return new Date(d).toLocaleString("ja-JP", {
    year: "numeric", month: "2-digit", day: "2-digit",
    hour: "2-digit", minute: "2-digit",
  });
}

export default async function AdminContactsPage({
  searchParams,
}: {
  searchParams: Promise<{ pw?: string; filter?: string }>;
}) {
  const params = await searchParams;
  const pw = params.pw;
  const filter = params.filter ?? "all";

  if (pw !== ADMIN_PASSWORD) {
    return (
      <div className="min-h-screen bg-[#111827] flex items-center justify-center">
        <form method="get" className="flex flex-col gap-4 w-72">
          <p className="text-white/30 text-[10px] tracking-[0.5em] text-center uppercase mb-1">Team of Colors</p>
          <h1 className="text-white text-xl tracking-[0.3em] text-center mb-4 font-light">ADMIN</h1>
          <input
            type="password"
            name="pw"
            placeholder="パスワード"
            className="bg-[#1f2937] border border-white/15 text-white px-4 py-3 text-sm
                       focus:outline-none focus:border-white/40 placeholder:text-white/20"
          />
          <button
            type="submit"
            className="bg-white/10 border border-white/20 text-white/70 text-xs py-3
                       tracking-[0.3em] hover:bg-white/15 hover:text-white transition"
          >
            LOGIN
          </button>
        </form>
      </div>
    );
  }

  const all = await prisma.contact.findMany({ orderBy: { createdAt: "desc" } });

  const counts = {
    all:     all.length,
    new:     all.filter((c) => c.status === "new").length,
    read:    all.filter((c) => c.status === "read").length,
    replied: all.filter((c) => c.status === "replied").length,
  };

  const contacts = filter === "all" ? all : all.filter((c) => c.status === filter);

  const tabs = [
    { key: "all",     label: "すべて",  count: counts.all },
    { key: "new",     label: "未読",    count: counts.new },
    { key: "read",    label: "確認済",  count: counts.read },
    { key: "replied", label: "返信済",  count: counts.replied },
  ];

  return (
    <div className="min-h-screen bg-[#111827] text-white">

      {/* ヘッダー */}
      <div className="border-b border-white/10 bg-[#1f2937] px-8 py-6">
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div>
            <p className="text-white/30 text-[9px] tracking-[0.5em] uppercase mb-1">Team of Colors</p>
            <h1 className="text-xl tracking-[0.2em] font-light">お問い合わせ管理</h1>
          </div>
          {/* 統計 */}
          <div className="flex gap-6">
            <div className="text-center">
              <p className="text-yellow-400 text-2xl font-light leading-none">{counts.new}</p>
              <p className="text-white/30 text-[9px] tracking-widest mt-1">未読</p>
            </div>
            <div className="w-px bg-white/8" />
            <div className="text-center">
              <p className="text-white/60 text-2xl font-light leading-none">{counts.read}</p>
              <p className="text-white/30 text-[9px] tracking-widest mt-1">確認済</p>
            </div>
            <div className="w-px bg-white/8" />
            <div className="text-center">
              <p className="text-green-400 text-2xl font-light leading-none">{counts.replied}</p>
              <p className="text-white/30 text-[9px] tracking-widest mt-1">返信済</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-8 py-8">

        {/* フィルタータブ */}
        <div className="flex gap-1 mb-8 border-b border-white/8">
          {tabs.map((tab) => (
            <a
              key={tab.key}
              href={`?pw=${pw}&filter=${tab.key}`}
              className={`px-5 py-3 text-xs tracking-[0.2em] transition border-b-2 -mb-px
                ${filter === tab.key
                  ? "border-white/60 text-white"
                  : "border-transparent text-white/35 hover:text-white/60"
                }`}
            >
              {tab.label}
              <span className={`ml-2 text-[10px] ${filter === tab.key ? "text-white/50" : "text-white/20"}`}>
                {tab.count}
              </span>
            </a>
          ))}
        </div>

        {/* 一覧 */}
        {contacts.length === 0 ? (
          <p className="text-white/20 text-center py-20 tracking-widest text-sm">該当する問い合わせはありません</p>
        ) : (
          <div className="flex flex-col gap-3">
            {contacts.map((c) => {
              const cfg = STATUS_CONFIG[c.status as StatusKey] ?? STATUS_CONFIG.new;
              return (
                <div
                  key={c.id}
                  className={`bg-[#1f2937] border border-white/10 border-l-2 ${cfg.border}
                             hover:bg-[#263044] transition px-6 py-5`}
                >
                  {/* 上段: 名前・会社・日時・ステータス */}
                  <div className="flex items-start justify-between gap-4 mb-3">
                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-white font-medium tracking-wide">{c.name}</span>
                      {c.company && (
                        <span className="text-white/35 text-xs tracking-wide">{c.company}</span>
                      )}
                      <span className={`text-[9px] tracking-[0.2em] border px-2 py-0.5 ${cfg.badge}`}>
                        {cfg.label}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <span className="text-white/25 text-[11px] tabular-nums">
                        {formatDate(c.createdAt)}
                      </span>
                      <StatusButton id={c.id} status={c.status} />
                    </div>
                  </div>

                  {/* 中段: 連絡先 */}
                  <div className="flex gap-4 mb-4 text-xs">
                    <a
                      href={`mailto:${c.email}`}
                      className="text-white/45 hover:text-white/75 transition underline-offset-2 hover:underline"
                    >
                      {c.email}
                    </a>
                    {c.phone && (
                      <a
                        href={`tel:${c.phone}`}
                        className="text-white/45 hover:text-white/75 transition"
                      >
                        {c.phone}
                      </a>
                    )}
                  </div>

                  {/* 下段: メッセージ */}
                  <p className="text-white/60 text-sm leading-relaxed whitespace-pre-wrap border-t border-white/5 pt-4">
                    {c.message}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
