// ロゴマーク。2026-09-17 の修正依頼 01 で支給された正式ロゴ（ダイヤ枠に TEAM OF COLORS と
// 虹色のブラシストローク）。画像は scripts/build-favicon.py が透過PNG（白文字版）から
// 正方形に起こしたもの（public/logo-mark.webp）。ヘッダーではヒーロー写真の上に透けて載るため
// 背景は透明。
//
// 2026-09-13 までは暫定ロゴ（730110.jpg）を白抜きして使っていた。
// ロゴが変わったら元画像を差し替えてスクリプトを再実行するだけでよい。

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
