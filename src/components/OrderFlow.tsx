// 発注フロー。2026-09-17 の修正依頼 15 で、トップの CONTACT フォームと TEL の間に追加した。
// 文言・構成は先方が示した構成例（64969.jpg）そのまま。リンクやボタンは置かない（先方指示）。
// お問い合わせの紹介文にある「発注フローはこちら」（修正依頼 16）がここ（#flow）へ飛ぶ。
//
// 旧 Process.tsx（5ステップ・未使用）とは別物。文言は先方確認済みのこちらを正とする。

const STEPS = [
  {
    title: "ヒアリング・現場調査",
    est: "1-3 Days",
    desc: "ご要望のイメージ、現場の寸法・下地状態を確認します。大まかな世界観の共有からスタート可能です。",
  },
  {
    title: "立体サンプル制作・デザイン案",
    est: "1 Week",
    desc: "実際に現場で使う塗料・セメントを用いて、手のひらサイズの「立体ミニサンプル」を制作。本番でのミスマッチを防ぎます。",
  },
  {
    title: "お見積り・正式契約",
    est: "2-3 Days",
    desc: "確定した仕様・サンプルに基づき、詳細なお見積もりをご提示いたします。",
  },
  {
    title: "現場施工（フルスクラッチ）",
    est: "3 Days - 2 Weeks",
    desc: "専属の特殊左官・塗装職人が現場に入り、手作業で丁寧に造形・仕上げを行います。施工規模により日数は変動します。",
  },
];

export default function OrderFlow() {
  return (
    // scroll-mt はヘッダー（固定）に見出しが隠れないための余白
    <div id="flow" className="max-w-3xl mx-auto px-6 md:px-12 scroll-mt-24">
      <div className="text-center mb-12">
        {/* 金の小ラベル＝セクション名（ハンバーガーメニューの FLOW と一致させる） */}
        <p className="type-label text-gold mb-4">Order Process</p>
        <h2 className="type-display-ja silver-grad">発注フロー</h2>
      </div>

      <ol>
        {STEPS.map((step, i) => (
          <li
            key={step.title}
            className="grid grid-cols-[3rem_1fr] md:grid-cols-[4.5rem_1fr] gap-x-2 md:gap-x-4
                       py-8 border-b border-white/10 last:border-b-0"
          >
            {/* 番号。金のセリフ体で大きく */}
            <span className="font-heading text-gold leading-none pt-1"
                  style={{ fontSize: "clamp(1.5rem, 2.4vw, 1.9rem)" }}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="border-l border-white/10 pl-5 md:pl-6">
              {/* 見出しと目安日数。スマホでは日数を見出しの下に落とす */}
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1 sm:gap-4 mb-3">
                <h3 className="type-card-title font-bold text-white/90">{step.title}</h3>
                <span className="type-meta uppercase tracking-[0.2em] text-gold whitespace-nowrap">
                  Est: {step.est}
                </span>
              </div>
              <p className="type-body-sm text-white/60 leading-[1.9]">{step.desc}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
