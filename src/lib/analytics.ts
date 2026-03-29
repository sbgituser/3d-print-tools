"use client";

import { siteConfig } from "@/data/site-config";

declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
  }
}

export function trackToolUse(toolSlug: string, inputs: Record<string, unknown>) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "tool_use", {
      tool_slug: toolSlug,
      ...inputs,
    });
  }
}

export function trackAffiliateClick(asin: string, productTitle: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("event", "affiliate_click", {
      asin,
      product_title: productTitle,
      affiliate_type: "amazon",
    });
  }
}

export function trackPageView(url: string) {
  if (typeof window !== "undefined" && window.gtag) {
    window.gtag("config", siteConfig.ga4Id, { page_path: url });
  }
}
