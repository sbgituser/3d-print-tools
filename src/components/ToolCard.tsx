import Link from "next/link";

interface Tool {
  slug: string;
  title: string;
  description: string;
  category: string;
  icon: string;
}

export default function ToolCard({ tool }: { tool: Tool }) {
  return (
    <Link
      href={`/tools/${tool.slug}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[var(--color-primary)] transition-all group"
    >
      <div className="flex items-start gap-4">
        <div className="w-12 h-12 rounded-lg bg-[var(--color-bg)] flex items-center justify-center text-2xl flex-shrink-0">
          🖨️
        </div>
        <div>
          <span className="text-xs text-[var(--color-primary)] font-medium">{tool.category}</span>
          <h3 className="font-bold text-gray-800 mt-0.5 group-hover:text-[var(--color-primary)] transition-colors">
            {tool.title}
          </h3>
          <p className="text-sm text-gray-500 mt-1 line-clamp-2">{tool.description}</p>
        </div>
      </div>
    </Link>
  );
}
