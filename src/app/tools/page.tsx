import ToolCard from "@/components/ToolCard";
import { buildMetadata } from "@/lib/seo";
import toolsData from "@/data/tools.json";

export const metadata = buildMetadata({
  title: "3Dプリンターツール一覧",
  description: "3Dプリンターのコスト計算・フィラメント比較・プリント時間推定・電気代シミュレーターなど便利ツールを無料で提供。",
  path: "/tools",
});

export default function ToolsPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <h1 className="text-2xl md:text-3xl font-bold mb-2">ツール一覧</h1>
      <p className="text-gray-500 mb-8">3Dプリンティングに役立つ無料計算ツールを揃えています。</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {toolsData.map((tool) => (
          <ToolCard key={tool.slug} tool={tool} />
        ))}
      </div>
    </div>
  );
}
