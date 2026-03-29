import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site-config";

export const metadata = buildMetadata({
  title: "プライバシーポリシー",
  path: "/privacy",
});

export default function PrivacyPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">プライバシーポリシー</h1>
      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <p>{siteConfig.name}（以下「当サイト」）は、ユーザーのプライバシーを尊重し、個人情報の保護に努めます。</p>
        <h2 className="text-xl font-bold mt-8">アクセス解析ツール</h2>
        <p>当サイトでは、Googleアナリティクスを使用しています。このツールはトラフィックデータの収集のためにCookieを使用しています。収集されるデータは匿名であり、個人を特定するものではありません。</p>
        <h2 className="text-xl font-bold mt-8">Amazonアソシエイト</h2>
        <p>当サイトはAmazonアソシエイトプログラムに参加しています。当サイトを経由してAmazonの商品を購入された場合、当サイトに紹介料が支払われます。これによりユーザーの購入金額は変わりません。</p>
        <h2 className="text-xl font-bold mt-8">免責事項</h2>
        <p>当サイトのツールによる計算結果は参考値です。実際の数値は使用環境により異なります。計算結果に基づく行為については自己責任でお願いします。</p>
      </div>
    </div>
  );
}
