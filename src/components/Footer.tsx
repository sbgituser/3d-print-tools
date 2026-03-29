import Link from "next/link";
import { siteConfig } from "@/data/site-config";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-16">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-white font-bold mb-2">{siteConfig.name}</h3>
            <p className="text-sm">{siteConfig.description}</p>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2">メニュー</h3>
            <ul className="space-y-1 text-sm">
              {siteConfig.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="hover:text-white transition-colors">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-white font-bold mb-2">サイト情報</h3>
            <ul className="space-y-1 text-sm">
              <li><Link href="/privacy" className="hover:text-white transition-colors">プライバシーポリシー</Link></li>
              <li><Link href="/disclaimer" className="hover:text-white transition-colors">免責事項</Link></li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-6 border-t border-gray-700 text-center text-sm">
          <p>© {new Date().getFullYear()} {siteConfig.name}. All rights reserved.</p>
          <p className="mt-1 text-xs">
            Amazonのアソシエイトとして、{siteConfig.name}は適格販売により収入を得ています。
          </p>
        </div>
      </div>
    </footer>
  );
}
