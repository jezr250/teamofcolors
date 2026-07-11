// 下層ページ（/works・/blog など）共通のページ見出し
type Props = { label: string; title: string; description?: string };

export default function SubpageHero({ label, title, description }: Props) {
  return (
    <div className="mb-14 pb-8 border-b border-white/5">
      <p className="font-label text-xs tracking-[0.5em] text-gold uppercase mb-4">{label}</p>
      <h1 className="font-heading italic text-5xl md:text-7xl tracking-[0.04em] silver-grad">
        {title}
      </h1>
      {description && (
        <p className="mt-6 text-sm text-white/65 leading-relaxed tracking-wide">{description}</p>
      )}
    </div>
  );
}
