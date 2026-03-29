export const siteConfig = {
  name: "3Dプリントツール",
  description: "3Dプリンターのコスト計算・フィラメント比較・プリント時間推定など、3Dプリンティングに役立つ無料ツール集",
  domain: "3d-print-tools.kuras-plus.com",
  url: "https://3d-print-tools.kuras-plus.com",
  theme: "orange" as const,
  amazonTag: "kurasplus-22",
  ga4Id: "G-7XEX8K92PV",
  ogImage: "/images/og-default.png",
  twitterHandle: "",
  nav: [
    { label: "ツール", href: "/tools" },
    { label: "ブログ", href: "/blog" },
  ],
};

export const themeColors = {
  blue:   { primary: "#2563EB", accent: "#3B82F6", bg: "#EFF6FF" },
  green:  { primary: "#059669", accent: "#10B981", bg: "#ECFDF5" },
  purple: { primary: "#7C3AED", accent: "#8B5CF6", bg: "#F5F3FF" },
  orange: { primary: "#EA580C", accent: "#F97316", bg: "#FFF7ED" },
};
