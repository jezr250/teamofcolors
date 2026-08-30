// 下層ページ（/works・/company）共通のページ見出し。
// サイズは globals.css のタイポグラフィ規則（.type-label / .type-display / .type-display-ja）に従う。
type Props = { label: string; title: string; description?: string };

// 和文（ASCII以外）を含むタイトルは欧文と同じ大きさだと幅が倍近くなり、
// スマホで必ず2行に折り返す（例:「モルタル造形制作」「会社概要」）。
// 一回り小さい和文用の見出しに切り替える。
const isJapanese = (text: string) => /[^\x00-\x7F]/.test(text);

export default function SubpageHero({ label, title, description }: Props) {
  return (
    <div className="mb-14 pb-8 border-b border-white/5">
      <p className="type-label text-gold mb-4">{label}</p>
      <h1 className={`silver-grad ${isJapanese(title) ? "type-display-ja" : "type-display"}`}>
        {title}
      </h1>
      {description && (
        <p className="mt-6 type-body text-white/65">{description}</p>
      )}
    </div>
  );
}
