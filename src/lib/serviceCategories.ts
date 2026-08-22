// トップの3サービス ＝ microCMS works の category に対応する定数（一元管理）。
//
// microCMS側は「works 1エンドポイント + カテゴリー項目」構成（A案）を想定。
// カテゴリーのコンテンツID（下記 key = category.id）が確定したら、この値だけ差し替える。
// ServiceTriptych（トップのタイル）と /works の絞り込み見出しがここを参照する。

export type ServiceCategory = {
  id: string; // microCMS category のコンテンツID（= URLの ?category= の値）
  name: string; // 日本語表示名（microCMS category.name と揃える）
  en: string; // 英語ラベル
  description: string; // /works 絞り込み時のリード文
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
    name: "内装・インテリア",
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
];

export const SERVICE_CATEGORIES: Record<string, ServiceCategory> =
  Object.fromEntries(SERVICE_CATEGORY_LIST.map((c) => [c.id, c]));
