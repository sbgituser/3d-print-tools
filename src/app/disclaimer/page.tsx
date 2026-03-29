import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({
  title: "免責事項",
  path: "/disclaimer",
});

export default function DisclaimerPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">免責事項</h1>
      <div className="prose prose-gray max-w-none space-y-6 text-gray-700">
        <p>当サイトのコンテンツ・情報は正確性に努めていますが、情報の完全性・正確性を保証するものではありません。</p>
        <h2 className="text-xl font-bold mt-8">計算ツールについて</h2>
        <p>当サイトの計算ツールが提供する結果は推定値・参考値です。実際の電気代・コスト・プリント時間は使用環境・設定・素材によって異なります。ツールの計算結果を唯一の根拠として重要な決定を行う場合は、専門家にご相談ください。</p>
        <h2 className="text-xl font-bold mt-8">リンクについて</h2>
        <p>当サイトから外部サイトへのリンクを設置している場合がありますが、外部サイトのコンテンツについては責任を負いません。</p>
        <h2 className="text-xl font-bold mt-8">著作権</h2>
        <p>当サイトのコンテンツの著作権は当サイト運営者に帰属します。無断転載・複製を禁止します。</p>
      </div>
    </div>
  );
}
