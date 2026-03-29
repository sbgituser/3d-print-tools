import BlogCard from "@/components/BlogCard";
import Breadcrumb from "@/components/Breadcrumb";
import { buildMetadata } from "@/lib/seo";
import articlesData from "@/data/articles.json";

export const metadata = buildMetadata({
  title: "3Dプリンターお役立ちブログ",
  description: "3Dプリンターの電気代・フィラメント比較・コスト節約術など、実践的な情報を発信するブログ。",
  path: "/blog",
});

export default function BlogPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: "ブログ", href: "/blog" }]} />
      <h1 className="text-2xl md:text-3xl font-bold mb-2">ブログ</h1>
      <p className="text-gray-500 mb-8">3Dプリンターに関する実践的な情報をお届けします。</p>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {articlesData.map((article) => (
          <BlogCard key={article.slug} article={article} />
        ))}
      </div>
    </div>
  );
}
