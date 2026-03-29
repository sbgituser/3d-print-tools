import { notFound } from "next/navigation";
import Breadcrumb from "@/components/Breadcrumb";
import FAQ from "@/components/FAQ";
import AmazonLink from "@/components/AmazonLink";
import JsonLd from "@/components/JsonLd";
import Calculator from "@/components/Calculator";
import FilamentComparison from "@/components/FilamentComparison";
import { howToSchema } from "@/lib/jsonld";
import { buildMetadata } from "@/lib/seo";
import toolsData from "@/data/tools.json";
import type { Metadata } from "next";

type Tool = (typeof toolsData)[number];

export async function generateStaticParams() {
  return toolsData.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const tool = toolsData.find((t) => t.slug === slug);
  if (!tool) return {};
  return buildMetadata({ title: tool.title, description: tool.description, path: `/tools/${slug}` });
}

export default async function ToolPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const tool = toolsData.find((t) => t.slug === slug) as Tool | undefined;
  if (!tool) notFound();

  const isFilamentComparison = slug === "filament-comparison";

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Breadcrumb items={[{ name: "ツール", href: "/tools" }, { name: tool.title, href: `/tools/${tool.slug}` }]} />

      <JsonLd data={howToSchema(tool)} />

      <h1 className="text-2xl md:text-3xl font-bold mt-4 mb-2">{tool.title}</h1>
      <p className="text-gray-500 mb-8">{tool.description}</p>

      {isFilamentComparison ? (
        <FilamentComparison />
      ) : (
        <Calculator
          slug={tool.slug}
          inputs={tool.inputs as never}
          outputs={tool.outputs}
        />
      )}

      {tool.relatedProducts && tool.relatedProducts.length > 0 && (
        <section className="mt-10">
          <h2 className="text-xl font-bold mb-4">関連商品</h2>
          <div className="space-y-3">
            {tool.relatedProducts.map((product) => (
              <div key={product.asin} className="flex items-center justify-between bg-white rounded-lg border border-gray-100 p-4">
                <span className="font-medium text-gray-700">{product.title}</span>
                <AmazonLink asin={product.asin} title={product.title} />
              </div>
            ))}
          </div>
        </section>
      )}

      {tool.faq && tool.faq.length > 0 && <FAQ faqs={tool.faq} />}
    </div>
  );
}
