// ロゴマーク。2026-09-13 の修正依頼⑩で先方から支給されたロゴタイプ（730110.jpg）を
// 暫定で使う。画像は scripts/build-favicon.py が白背景を抜いて正方形に起こしたもの
// （public/logo-mark.webp）。ヘッダーではヒーロー写真の上に透けて載るため背景は透明。
//
// 以前の「金枠バッジに氷壁の写真＋ロボット」の SVG 構成は廃止した。
// 正式なロゴが来たら元画像を差し替えてスクリプトを再実行するだけでよい。

type Props = {
  size: number; // 一辺のピクセル数（正方形）
  className?: string;
};

export default function LogoMark({ size, className }: Props) {
  return (
    // eslint-disable-next-line @next/next/no-img-element -- 静的exportのため next/image は使わない
    <img
      src="/logo-mark.webp"
      alt=""
      width={size}
      height={size}
      className={className}
      aria-hidden="true"
    />
  );
}
