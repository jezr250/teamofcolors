// ロゴマーク（ゼッケンバッジ）。金枠の中に氷壁の写真を敷き、
// 手前にロボットと TOC の文字を金で重ねる。
// ヘッダーとフッターで共用するため、clipPath の id は呼び出し側から渡す
// （同じページに両方出るので重複させないこと）。

// 元のロゴから引き継いだロボットのシルエット。
// 白い氷壁の上では旧来の opacity 0.65 だと消えてしまうため不透明で置く。
const ROBOT_PATH =
  "M6 24 C5.5 21 5.5 18.5 6.5 17 L5.5 15.5 C5 14.8 5.5 14 6.5 14 " +
  "L7.5 15.5 C9 14.5 10.5 14 12 14.5 L12.5 13 C13 12 14 12.5 14 13.5 " +
  "L13.5 15 C14.5 16 15 17.5 15 20 L15.5 20.5 C16 21.5 15.5 23 14.5 23 " +
  "L14 22.5 C14 24 13.5 25.5 13 26.5 L13 28 L11.5 28 L11.5 26.5 " +
  "L10.5 26.5 L10.5 28 L9 28 L9 26.5 C8.5 25.5 8 24 8 22.5 Z";

type Props = {
  id: string;      // clipPath の識別子（ページ内で一意にする）
  width: number;
  height: number;
};

export default function LogoMark({ id, width, height }: Props) {
  return (
    <svg width={width} height={height} viewBox="0 0 44 30" fill="none" aria-hidden="true">
      <defs>
        <clipPath id={id}>
          <rect x="1" y="1" width="42" height="28" rx="5" />
        </clipPath>
      </defs>
      <image
        href="/logo-mark.webp"
        x="1" y="1" width="42" height="28"
        preserveAspectRatio="xMidYMid slice"
        clipPath={`url(#${id})`}
      />
      {/* ロボットは元のロゴと同じ左寄せ、右に TOC の文字を置く */}
      <path d={ROBOT_PATH} fill="#C9A84C" clipPath={`url(#${id})`} />
      <text x="30" y="20" textAnchor="middle" fill="#C9A84C"
        fontSize="11" fontFamily="var(--font-bebas),sans-serif" letterSpacing="2">
        TOC
      </text>
      <rect x="1" y="1" width="42" height="28" rx="5"
        stroke="#C9A84C" strokeWidth="1" fill="none" />
    </svg>
  );
}
