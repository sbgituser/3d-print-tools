/** @jsxImportSource react */
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";
import * as fs from "fs";
import * as path from "path";
import tools from "../src/data/tools.json";
import articles from "../src/data/articles.json";

const WIDTH = 1200;
const HEIGHT = 630;
const ORANGE = "#EA580C";
const ORANGE_DARK = "#C2410C";
const ORANGE_LIGHT = "#FFF7ED";

async function getFontData(): Promise<ArrayBuffer> {
  try {
    const css = await fetch(
      "https://fonts.googleapis.com/css2?family=Noto+Sans+JP:wght@700&display=swap",
      { headers: { "User-Agent": "Mozilla/5.0 (compatible; OGP-Generator)" } }
    ).then((r) => r.text());
    const match = css.match(/url\((https:\/\/fonts\.gstatic\.com[^)]+)\)/);
    if (!match) throw new Error("Font URL not found in CSS");
    return fetch(match[1]).then((r) => r.arrayBuffer());
  } catch (e) {
    console.warn("Failed to fetch Noto Sans JP, falling back to no-font mode:", e);
    return new ArrayBuffer(0);
  }
}

function OgpCard({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div
      style={{
        width: WIDTH,
        height: HEIGHT,
        display: "flex",
        flexDirection: "column",
        backgroundColor: ORANGE_LIGHT,
        fontFamily: "Noto Sans JP, sans-serif",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Top accent bar */}
      <div
        style={{
          width: "100%",
          height: 12,
          backgroundColor: ORANGE,
          display: "flex",
        }}
      />
      {/* Main content area */}
      <div
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "60px 80px",
          gap: 24,
        }}
      >
        {/* Site badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div
            style={{
              backgroundColor: ORANGE,
              color: "white",
              fontSize: 20,
              fontWeight: 700,
              padding: "6px 16px",
              borderRadius: 6,
              display: "flex",
            }}
          >
            3Dプリントツール
          </div>
        </div>
        {/* Title */}
        <div
          style={{
            fontSize: title.length > 30 ? 40 : 52,
            fontWeight: 700,
            color: "#1a1a1a",
            lineHeight: 1.3,
            display: "flex",
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        {/* Subtitle */}
        {subtitle && (
          <div
            style={{
              fontSize: 24,
              color: "#555",
              lineHeight: 1.4,
              display: "flex",
              maxWidth: 900,
            }}
          >
            {subtitle.length > 70 ? subtitle.slice(0, 70) + "…" : subtitle}
          </div>
        )}
      </div>
      {/* Bottom bar */}
      <div
        style={{
          width: "100%",
          height: 8,
          backgroundColor: ORANGE_DARK,
          display: "flex",
        }}
      />
    </div>
  );
}

async function generateImage(
  title: string,
  subtitle: string,
  outputPath: string,
  fontData: ArrayBuffer
) {
  const fonts =
    fontData.byteLength > 0
      ? [{ name: "Noto Sans JP", data: fontData, weight: 700 as const, style: "normal" as const }]
      : [];

  const svg = await satori(<OgpCard title={title} subtitle={subtitle} />, {
    width: WIDTH,
    height: HEIGHT,
    fonts,
  });

  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: WIDTH } });
  const pngData = resvg.render().asPng();

  const dir = path.dirname(outputPath);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(outputPath, pngData);
  console.log(`✓ ${outputPath}`);
}

async function main() {
  const root = path.join(process.cwd());
  console.log("Fetching Noto Sans JP font...");
  const fontData = await getFontData();

  // default OGP
  await generateImage(
    "3Dプリントツール",
    "3Dプリンターのコスト計算・フィラメント比較など無料ツール集",
    path.join(root, "public/ogp/default-ogp.png"),
    fontData
  );

  // tool pages
  for (const tool of tools) {
    await generateImage(
      tool.title,
      tool.description,
      path.join(root, `public/ogp/tools/${tool.slug}.png`),
      fontData
    );
  }

  // blog pages
  for (const article of articles) {
    await generateImage(
      article.title,
      article.description,
      path.join(root, `public/ogp/blog/${article.slug}.png`),
      fontData
    );
  }

  console.log("\nOGP image generation complete!");
}

main().catch((e) => {
  console.error("OGP generation failed:", e);
  process.exit(1);
});
