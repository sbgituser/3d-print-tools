"use client";

import { buildAmazonUrl } from "@/lib/amazon";
import { trackAffiliateClick } from "@/lib/analytics";

interface AmazonLinkProps {
  asin: string;
  title: string;
  className?: string;
}

export default function AmazonLink({ asin, title, className }: AmazonLinkProps) {
  return (
    <a
      href={buildAmazonUrl(asin)}
      target="_blank"
      rel="nofollow sponsored noopener noreferrer"
      onClick={() => trackAffiliateClick(asin, title)}
      className={`inline-flex items-center gap-2 bg-[#FF9900] hover:bg-[#e68900] text-white font-bold py-2 px-4 rounded transition-colors ${className ?? ""}`}
    >
      <span>🛒</span>
      <span>Amazonで見る</span>
    </a>
  );
}
