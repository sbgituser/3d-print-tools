import ToolCard from "@/components/ToolCard";
import BlogCard from "@/components/BlogCard";
import { siteConfig } from "@/data/site-config";
import toolsData from "@/data/tools.json";
import articlesData from "@/data/articles.json";
import { buildMetadata } from "@/lib/seo";

export const metadata = buildMetadata({});

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-[var(--color-primary)] text-white py-16 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="text-5xl mb-4">🖨️</div>
          <h1 className="text-3xl md:text-4xl font-bold mb-4">{siteConfig.name}</h1>
          <p className="text-lg md:text-xl opacity-90">{siteConfig.description}</p>
        </div>
      </section>

      {/* Tools */}
      <section className="max-w-6xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6">🔧 便利なツール一覧</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
          {toolsData.map((tool) => (
            <ToolCard key={tool.slug} tool={tool} />
          ))}
        </div>
      </section>

      {/* Latest Articles */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <h2 className="text-2xl font-bold mb-6">📝 最新記事</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {articlesData.slice(0, 3).map((article) => (
            <BlogCard key={article.slug} article={article} />
          ))}
        </div>
      </section>
    </>
  );
}
