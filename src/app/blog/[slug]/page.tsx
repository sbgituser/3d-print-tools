import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCard from "@/components/ToolCard";
import JsonLd from "@/components/JsonLd";
import { articleSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import { siteConfig } from "@/data/site-config";
import articlesData from "@/data/articles.json";
import toolsData from "@/data/tools.json";
import type { Metadata } from "next";

export async function generateStaticParams() {
  return articlesData.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = articlesData.find((a) => a.slug === slug);
  if (!article) return {};
  return buildMetadata({
    title: article.title,
    description: article.description,
    path: `/blog/${slug}`,
    ogImage: `/ogp/blog/${slug}.png`,
  });
}

export default async function BlogArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = articlesData.find((a) => a.slug === slug);
  if (!article) notFound();

  const relatedTools = toolsData.filter((t) => article.relatedTools?.includes(t.slug));
  const schema = articleSchema({
    title: article.title,
    description: article.description,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    url: `${siteConfig.url}/blog/${slug}`,
  });

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: "ブログ", href: "/blog" }, { name: article.title, href: `/blog/${article.slug}` }]} />
      <JsonLd data={schema} />

      <span className="text-sm text-[var(--color-primary)] font-medium mt-4 block">{article.category}</span>
      <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-2">{article.title}</h1>
      <time className="text-sm text-gray-400 block mb-8">
        更新日: {new Date(article.updatedAt).toLocaleDateString("ja-JP")}
      </time>

      <div className="prose prose-gray max-w-none">
        {article.content.split("\n").map((para, i) => {
          if (para.startsWith("## ")) {
            return <h2 key={i} className="text-xl font-bold mt-8 mb-3">{para.slice(3)}</h2>;
          }
          if (para.startsWith("### ")) {
            return <h3 key={i} className="text-lg font-bold mt-6 mb-2">{para.slice(4)}</h3>;
          }
          if (para.startsWith("- ")) {
            return <li key={i} className="ml-4 text-gray-700">{para.slice(2)}</li>;
          }
          if (para.match(/^\d+\./)) {
            return <li key={i} className="ml-4 text-gray-700">{para}</li>;
          }
          if (para.trim() === "") return null;
          // Bold text rendering
          const rendered = para.replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");
          return <p key={i} className="text-gray-700 leading-relaxed mb-4" dangerouslySetInnerHTML={{ __html: rendered }} />;
        })}
      </div>

      {relatedTools.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold mb-4">関連ツール</h2>
          <div className="space-y-3">
            {relatedTools.map((tool) => (
              <ToolCard key={tool.slug} tool={tool} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
