import type { Metadata } from "next";
import { siteConfig } from "@/data/site-config";

interface SeoProps {
  title?: string;
  description?: string;
  path?: string;
  ogImage?: string;
}

export function buildMetadata({ title, description, path = "/", ogImage }: SeoProps): Metadata {
  const fullTitle = title ? `${title} | ${siteConfig.name}` : siteConfig.name;
  const desc = description ?? siteConfig.description;
  const url = `${siteConfig.url}${path}`;
  const image = ogImage ?? siteConfig.ogImage;

  return {
    title: fullTitle,
    description: desc,
    metadataBase: new URL(siteConfig.url),
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description: desc,
      url,
      siteName: siteConfig.name,
      images: [{ url: image, width: 1200, height: 630 }],
      type: "website",
      locale: "ja_JP",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description: desc,
      images: [image],
      ...(siteConfig.twitterHandle && { site: siteConfig.twitterHandle }),
    },
  };
}
