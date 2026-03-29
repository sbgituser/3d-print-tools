"use client";

import { useState } from "react";
import JsonLd from "@/components/JsonLd";
import { faqSchema } from "@/lib/jsonld";

interface FAQItem {
  q: string;
  a: string;
}

export default function FAQ({ faqs }: { faqs: FAQItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="mt-10">
      <JsonLd data={faqSchema(faqs)} />
      <h2 className="text-xl font-bold mb-4">よくある質問</h2>
      <div className="space-y-2">
        {faqs.map((faq, i) => (
          <div key={i} className="border border-gray-200 rounded-lg overflow-hidden">
            <button
              className="w-full text-left px-4 py-3 font-medium text-gray-800 hover:bg-gray-50 flex items-center justify-between"
              onClick={() => setOpenIndex(openIndex === i ? null : i)}
              aria-expanded={openIndex === i}
            >
              <span>Q. {faq.q}</span>
              <span className="text-[var(--color-primary)] text-xl ml-2">{openIndex === i ? "−" : "+"}</span>
            </button>
            {openIndex === i && (
              <div className="px-4 py-3 bg-[var(--color-bg)] text-gray-700 text-sm leading-relaxed">
                A. {faq.a}
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
