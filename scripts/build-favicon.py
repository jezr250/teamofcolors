#!/usr/bin/env python3
"""ロゴ画像（白背景のロゴタイプ）からファビコンとヘッダー/フッター用のロゴマークを起こす。

入力  : teamofcolors-materials/logo-730110.jpg（2026-09-13 修正依頼⑩で暫定指定されたロゴ）
出力  : public/favicon.ico（16/32/48px）, public/apple-touch-icon.png（180px）… 黒背景
        public/logo-mark.webp（320px）… 背景透明。ヘッダーはヒーロー写真の上に透けて載るので
        黒い四角が出ないよう透明にしている（LogoMark.tsx が使う）

元画像は白背景・横長（1536x1024）なので、
  1. 白い連結領域のうち大きいもの（＝背景と文字の抜き）を黒に置き換える
     ※ 文字の中の小さな白いハイライト（ダイヤの輝き）は残す
  2. ロゴの外接矩形を正方形に切り出して余白を足す
  3. 各サイズに縮小する
背景を黒にするのはサイトの背景色に合わせるため（ブラウザのタブが白でも銀のロゴは見える）。

Docker での実行方法:
  docker run --rm \
    -v /home/eza/projects/teamofcolors-materials:/src:ro \
    -v /home/eza/projects/teamofcolors:/app \
    -w /app python:3.12-slim \
    sh -c "pip install --quiet pillow numpy scipy && python scripts/build-favicon.py"
  docker run --rm -v /home/eza/projects/teamofcolors:/app alpine \
    chown $(id -u):$(id -g) /app/public/favicon.ico /app/public/apple-touch-icon.png
"""

import numpy as np
from PIL import Image, ImageFilter
from scipy import ndimage

SRC = "/src/logo-730110.jpg"
WHITE_THRESHOLD = 235  # これより明るい画素を「白」とみなす
MIN_BG_AREA = 400  # これより大きい白い塊は背景。小さいものはハイライトなので残す
PADDING = 0.08  # 正方形にしたあと四辺に足す余白（一辺に対する比率）

im = Image.open(SRC).convert("RGB")
arr = np.asarray(im).astype(np.int16)
white = arr.min(axis=2) >= WHITE_THRESHOLD

labels, n = ndimage.label(white)
sizes = ndimage.sum(white, labels, range(1, n + 1))
bg = np.isin(labels, [i + 1 for i, s in enumerate(sizes) if s >= MIN_BG_AREA])

# 背景マスクを1pxぼかしてから黒と合成し、文字の縁のアンチエイリアス（白っぽい画素）が
# 黒地に白い縁として残らないようにする
mask = Image.fromarray((bg * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(1.2))
m = np.asarray(mask).astype(np.float32)[..., None] / 255.0
out = (arr.astype(np.float32) * (1.0 - m)).clip(0, 255).astype(np.uint8)

# ロゴの外接矩形 → 正方形 → 余白
ys, xs = np.where(~bg)
top, bottom, left, right = ys.min(), ys.max(), xs.min(), xs.max()
side = max(bottom - top, right - left)
side = int(side * (1 + PADDING * 2))
cy, cx = (top + bottom) // 2, (left + right) // 2
canvas = np.zeros((side, side, 3), dtype=np.uint8)
y0, x0 = cy - side // 2, cx - side // 2
# 元画像の外にはみ出す部分は黒のまま
sy0, sx0 = max(y0, 0), max(x0, 0)
sy1, sx1 = min(y0 + side, out.shape[0]), min(x0 + side, out.shape[1])
canvas[sy0 - y0 : sy1 - y0, sx0 - x0 : sx1 - x0] = out[sy0:sy1, sx0:sx1]
square = Image.fromarray(canvas)

square.resize((180, 180), Image.LANCZOS).save("public/apple-touch-icon.png", optimize=True)
square.save("public/favicon.ico", sizes=[(16, 16), (32, 32), (48, 48)])

# 透明版。黒と合成した画素をそのまま使い、背景マスクの反転をアルファにする
alpha = np.zeros((side, side), dtype=np.uint8)
alpha[sy0 - y0 : sy1 - y0, sx0 - x0 : sx1 - x0] = (255 - np.asarray(mask))[sy0:sy1, sx0:sx1]
rgba = np.dstack([canvas, alpha])
Image.fromarray(rgba, "RGBA").resize((320, 320), Image.LANCZOS).save("public/logo-mark.webp", quality=88)
print(f"元 {im.size} → 正方形 {side}px（背景成分 {int(bg.sum())}px, 白い塊 {n} 個）")
