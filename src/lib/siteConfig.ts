// 会社情報の一元管理。
// 会社概要ページ・フッター・お問い合わせ・構造化データ(JSON-LD)がすべてここを参照する。
// 値の出どころは クライアント提供の「HP作成方針_20260812.pdf」（2026-08-09打ち合わせ）。
// 変更が必要になったらこのファイルだけ直せば全体に反映される。

export const COMPANY_NAME = "TEAM OF COLORS株式会社";
export const COMPANY_NAME_EN = "TEAM OF COLORS";
export const COMPANY_CEO = "美馬 秀春";

export const SITE_POSTAL_CODE = "233-0006";
export const SITE_ADDRESS = "神奈川県横浜市港南区芹が谷3-6-3";
export const SITE_ADDRESS_FULL = `〒${SITE_POSTAL_CODE} ${SITE_ADDRESS}`;

export const SITE_TEL = "090-2234-1432";
export const SITE_TEL_HREF = `tel:${SITE_TEL.replace(/-/g, "")}`;

export const SITE_BUSINESS_HOURS = "9:00〜17:00";
export const SITE_CLOSED_DAYS = "日曜・祝日";

export const SITE_INSTAGRAM_URL = "https://www.instagram.com/"; // 実URLに差し替える

// 事業内容。PDFの【事業内容】欄の並び順をそのまま保っている。
export const COMPANY_SERVICES = [
  { name: "一般建築塗装", note: "内外・塗替・各種吹付" },
  { name: "特殊塗装" },
  { name: "特殊左官" },
  { name: "エイジング塗装" },
  { name: "モルタル造形" },
  { name: "氷壁造形" },
  { name: "デザイン壁", note: "ジョリパット、イタリア左官材など各種" },
  { name: "レジン" },
  { name: "囲炉裏制作" },
  { name: "ピザ釜制作" },
  { name: "各種フルオーダー制作" },
];

// 企業理念。PDFに書かれていたのは方向性を示す短い文とキーワードのみで、
// 清書された理念文はまだ無い（別担当が作成中）。届いたら差し替える。
export const COMPANY_PHILOSOPHY = [
  "新しいアイディアを取り入れていきたい",
  "邁進していきたい",
];
export const COMPANY_KEYWORDS = ["アイディア", "新しい", "ご縁 ゆかり"];

// Googleマップ。住所検索で開くだけなのでAPIキーは不要。
export const SITE_MAP_QUERY = encodeURIComponent(`${SITE_POSTAL_CODE} ${SITE_ADDRESS}`);
export const SITE_MAP_EMBED_URL = `https://maps.google.com/maps?q=${SITE_MAP_QUERY}&z=16&output=embed`;
export const SITE_MAP_LINK_URL = `https://www.google.com/maps/search/?api=1&query=${SITE_MAP_QUERY}`;
