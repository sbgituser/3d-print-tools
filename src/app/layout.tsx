import type { Metadata } from "next";
import { Noto_Sans_JP } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JsonLd from "@/components/JsonLd";
import { websiteSchema } from "@/lib/jsonld";
import { siteConfig, themeColors } from "@/data/site-config";

const notoSansJP = Noto_Sans_JP({ subsets: ["latin"], weight: ["400", "700"] });

export const metadata: Metadata = {
  title: siteConfig.name,
  description: siteConfig.description,
  metadataBase: new URL(siteConfig.url),
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const colors = themeColors[siteConfig.theme];

  return (
    <html lang="ja">
      <head>
        {siteConfig.ga4Id && siteConfig.ga4Id !== "G-XXXXXXXXXX" && (
          <>
            <script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${siteConfig.ga4Id}`}
            />
            <script
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${siteConfig.ga4Id}');
                `,
              }}
            />
          </>
        )}
        <style>{`
          :root {
            --color-primary: ${colors.primary};
            --color-accent: ${colors.accent};
            --color-bg: ${colors.bg};
          }
        `}</style>
        <JsonLd data={websiteSchema()} />
      </head>
      <body className={`${notoSansJP.className} bg-gray-50 min-h-screen flex flex-col`}>
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
