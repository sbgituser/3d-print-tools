import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import ToolCard from "@/components/ToolCard";
import JsonLd from "@/components/JsonLd";
import { articleSchema, faqSchema } from "@/lib/jsonld";
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
  const articleFaq = (article as { faq?: { q: string; a: string }[] }).faq;
  const schema = articleSchema({
    title: article.title,
    description: article.description,
    publishedAt: article.publishedAt,
    updatedAt: article.updatedAt,
    url: `${siteConfig.url}/blog/${slug}`,
  });

  // Parse content lines, grouping table rows into blocks
  type ContentBlock =
    | { type: "line"; content: string }
    | { type: "table"; rows: string[] };
  const contentBlocks: ContentBlock[] = [];
  const lines = article.content.split("\n");
  let li = 0;
  while (li < lines.length) {
    if (lines[li].startsWith("|")) {
      const tableRows: string[] = [];
      while (li < lines.length && lines[li].startsWith("|")) {
        tableRows.push(lines[li]);
        li++;
      }
      contentBlocks.push({ type: "table", rows: tableRows });
    } else {
      contentBlocks.push({ type: "line", content: lines[li] });
      li++;
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: "ブログ", href: "/blog" }, { name: article.title, href: `/blog/${article.slug}` }]} />
      <JsonLd data={schema} />
      {articleFaq && articleFaq.length > 0 && <JsonLd data={faqSchema(articleFaq)} />}

      <span className="text-sm text-[var(--color-primary)] font-medium mt-4 block">{article.category}</span>
      <h1 className="text-2xl md:text-3xl font-bold mt-2 mb-2">{article.title}</h1>
      <time className="text-sm text-gray-400 block mb-8">
        更新日: {new Date(article.updatedAt).toLocaleDateString("ja-JP")}
      </time>

      <div className="prose prose-gray max-w-none">
        {contentBlocks.map((block, i) => {
          if (block.type === "table") {
            const dataRows = block.rows.filter((r) => !r.match(/^\|[-:\s|]+\|$/));
            return (
              <div key={i} className="overflow-x-auto mb-6">
                <table className="min-w-full border-collapse text-sm">
                  <tbody>
                    {dataRows.map((row, ri) => {
                      const cells = row.split("|").filter((c) => c.trim() !== "").map((c) => c.trim());
                      return (
                        <tr key={ri} className={ri === 0 ? "bg-[var(--color-bg)] font-semibold" : ri % 2 === 1 ? "bg-white" : "bg-gray-50"}>
                          {cells.map((cell, ci) => (
                            ri === 0
                              ? <th key={ci} className="border border-gray-200 px-3 py-2 text-left whitespace-nowrap">{cell}</th>
                              : <td key={ci} className="border border-gray-200 px-3 py-2">{cell}</td>
                          ))}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            );
          }
          const para = block.content;
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
