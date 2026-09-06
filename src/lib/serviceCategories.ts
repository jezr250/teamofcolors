// トップの5サービス ＝ microCMS works の category に対応する定数（一元管理）。
//
// microCMS側は「works 1エンドポイント + カテゴリー項目」構成（A案）を想定。
// カテゴリーのコンテンツID（下記 key = category.id）が確定したら、この値だけ差し替える。
// ServiceTiles（トップのタイル）と /works の絞り込み見出しがここを参照する。

export type ServiceCategory = {
  id: string; // microCMS category のコンテンツID（= URLの ?category= の値）
  name: string; // 日本語表示名（microCMS category.name と揃える）
  en: string; // 英語ラベル
  description: string; // /works 絞り込み時のリード文
  trademarkPending?: boolean; // 商標登録出願中（タイルにその旨のバッジを出す）
};

// 表示順を保つため配列で定義し、id 引き用の Record も派生させる。
export const SERVICE_CATEGORY_LIST: ServiceCategory[] = [
  {
    id: "mortar",
    name: "モルタル造形制作",
    en: "MORTAR SCULPTURE",
    description:
      "コンクリートや FRP を素材に、本物と見紛う岩・石・洞窟をフルスクラッチで制作した実績をご紹介します。",
  },
  {
    id: "interior",
    name: "内装・インテリア塗装",
    en: "INTERIOR DESIGN",
    description:
      "店舗・商業空間の内装をトータルでデザイン・施工した実績をご紹介します。",
  },
  {
    id: "aging",
    name: "エイジング塗装",
    en: "AGING PAINT",
    description:
      "経年変化や素材の質感を再現するエイジング塗装で空間に深みを与えた実績をご紹介します。",
  },
  {
    id: "special",
    name: "特殊塗装",
    en: "SPECIAL COATING",
    description:
      "左官材・骨材・意匠塗料を組み合わせ、既製品には無い表情を壁面に与えた実績をご紹介します。",
  },
  {
    // 「氷壁」は商標登録出願中。en は商標なので訳さずローマ字表記にしている。
    id: "hyoheki",
    name: "氷壁",
    en: "HYOHEKI",
    description:
      "氷壁は当社独自の造形技術です。氷河や氷の壁の質感を屋内で再現し、空間そのものを主役に変えます。",
    trademarkPending: true,
  },
];

export const SERVICE_CATEGORIES: Record<string, ServiceCategory> =
  Object.fromEntries(SERVICE_CATEGORY_LIST.map((c) => [c.id, c]));
