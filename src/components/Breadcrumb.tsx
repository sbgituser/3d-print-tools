import Link from "next/link";
import JsonLd from "@/components/JsonLd";
import { breadcrumbSchema } from "@/lib/jsonld";
import { siteConfig } from "@/data/site-config";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  const schemaItems = [
    { name: "ホーム", url: siteConfig.url },
    ...items.map((item) => ({
      name: item.name,
      url: `${siteConfig.url}${item.href}`,
    })),
  ];

  return (
    <>
      <JsonLd data={breadcrumbSchema(schemaItems)} />
      <nav aria-label="パンくずリスト" className="text-sm text-gray-500 flex items-center gap-1 flex-wrap">
        <Link href="/" className="hover:text-[var(--color-primary)]">ホーム</Link>
        {items.map((item, i) => (
          <span key={item.href} className="flex items-center gap-1">
            <span>/</span>
            {i === items.length - 1 ? (
              <span className="text-gray-700">{item.name}</span>
            ) : (
              <Link href={item.href} className="hover:text-[var(--color-primary)]">{item.name}</Link>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
