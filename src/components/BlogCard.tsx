import Link from "next/link";

interface Article {
  slug: string;
  title: string;
  description: string;
  category: string;
  publishedAt: string;
}

export default function BlogCard({ article }: { article: Article }) {
  return (
    <Link
      href={`/blog/${article.slug}`}
      className="block bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md hover:border-[var(--color-primary)] transition-all group"
    >
      <span className="text-xs text-[var(--color-primary)] font-medium">{article.category}</span>
      <h3 className="font-bold text-gray-800 mt-1 group-hover:text-[var(--color-primary)] transition-colors line-clamp-2">
        {article.title}
      </h3>
      <p className="text-sm text-gray-500 mt-2 line-clamp-2">{article.description}</p>
      <time className="text-xs text-gray-400 mt-3 block">
        {new Date(article.publishedAt).toLocaleDateString("ja-JP")}
      </time>
    </Link>
  );
}
