import { siteConfig } from "@/data/site-config";

export function buildAmazonUrl(asin: string, tag?: string): string {
  const affiliateTag = tag ?? siteConfig.amazonTag;
  return `https://www.amazon.co.jp/dp/${asin}?tag=${affiliateTag}`;
}
