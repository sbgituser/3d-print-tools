import Link from "next/link";

interface BreadcrumbItem {
  name: string;
  href: string;
}

export default function Breadcrumb({ items }: { items: BreadcrumbItem[] }) {
  return (
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
  );
}
