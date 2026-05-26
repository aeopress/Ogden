/**
 * Generate a placeholder OG / Twitter Card image at public/og-image.png (1200×630).
 *
 * Replace with the gpt-image-2 final by overwriting public/og-image.png — the
 * meta tag in Base.astro points to that path so no code change needed.
 *
 * Run:  bun run scripts/build-og-image.ts
 */

import sharp from 'sharp';
import { join } from 'node:path';

const OUT = join(import.meta.dir, '..', 'public', 'og-image.png');

const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1c1917"/>
      <stop offset="100%" stop-color="#0c0a09"/>
    </linearGradient>
  </defs>

  <rect width="1200" height="630" fill="url(#bg)"/>

  <!-- accent bar (matches the operations category color) -->
  <rect x="80" y="80" width="6" height="80" fill="#fb923c"/>

  <!-- small kicker -->
  <text x="100" y="120" font-family="Inter, sans-serif" font-size="16"
        fill="#a8a29e" letter-spacing="3">A CONTROLLED LANGUAGE · 1930</text>

  <!-- main title -->
  <text x="100" y="260" font-family="Cormorant Garamond, Georgia, serif"
        font-size="90" font-weight="600" fill="#fafaf9" letter-spacing="-1.5">
    Ogden's <tspan font-style="italic" fill="#fb923c">Basic</tspan> English
  </text>

  <!-- subtitle CJK -->
  <text x="100" y="340" font-family="Noto Serif TC, serif"
        font-size="38" fill="#e7e5e4">
    850 字繁中學習手冊
  </text>

  <!-- five category swatches -->
  <g transform="translate(100,420)">
    <g>
      <rect width="200" height="80" rx="10" fill="#3a1f12" stroke="#fb923c" stroke-width="2"/>
      <text x="100" y="38" text-anchor="middle" font-family="Inter, sans-serif"
            font-size="13" font-weight="600" fill="#fb923c" letter-spacing="2">OPERATIONS</text>
      <text x="100" y="60" text-anchor="middle" font-family="Noto Serif TC, serif"
            font-size="20" fill="#fde68a">功能詞 · 100</text>
    </g>
    <g transform="translate(208,0)">
      <rect width="200" height="80" rx="10" fill="#0d2926" stroke="#5eead4" stroke-width="2"/>
      <text x="100" y="38" text-anchor="middle" font-family="Inter, sans-serif"
            font-size="13" font-weight="600" fill="#5eead4" letter-spacing="2">GENERAL</text>
      <text x="100" y="60" text-anchor="middle" font-family="Noto Serif TC, serif"
            font-size="20" fill="#a7f3d0">一般名詞 · 400</text>
    </g>
    <g transform="translate(416,0)">
      <rect width="200" height="80" rx="10" fill="#2d2410" stroke="#fbbf24" stroke-width="2"/>
      <text x="100" y="38" text-anchor="middle" font-family="Inter, sans-serif"
            font-size="13" font-weight="600" fill="#fbbf24" letter-spacing="2">PICTURABLE</text>
      <text x="100" y="60" text-anchor="middle" font-family="Noto Serif TC, serif"
            font-size="20" fill="#fde68a">具象名詞 · 200</text>
    </g>
    <g transform="translate(624,0)">
      <rect width="200" height="80" rx="10" fill="#1e1d3a" stroke="#a5b4fc" stroke-width="2"/>
      <text x="100" y="38" text-anchor="middle" font-family="Inter, sans-serif"
            font-size="13" font-weight="600" fill="#a5b4fc" letter-spacing="2">QUALITIES</text>
      <text x="100" y="60" text-anchor="middle" font-family="Noto Serif TC, serif"
            font-size="20" fill="#c7d2fe">形容詞 · 100</text>
    </g>
    <g transform="translate(832,0)">
      <rect width="200" height="80" rx="10" fill="#2b1e3a" stroke="#d8b4fe" stroke-width="2"/>
      <text x="100" y="38" text-anchor="middle" font-family="Inter, sans-serif"
            font-size="13" font-weight="600" fill="#d8b4fe" letter-spacing="2">OPPOSITES</text>
      <text x="100" y="60" text-anchor="middle" font-family="Noto Serif TC, serif"
            font-size="20" fill="#e9d5ff">反義詞 · 50</text>
    </g>
  </g>

  <!-- footer url -->
  <text x="100" y="580" font-family="Inter, sans-serif" font-size="20"
        fill="#a8a29e" letter-spacing="1">ogden.orz99.com</text>

  <!-- corner mark -->
  <text x="1100" y="580" text-anchor="end" font-family="Inter, sans-serif"
        font-size="14" fill="#78716c" letter-spacing="2">CC BY-SA 4.0 · MIT</text>
</svg>`;

await sharp(Buffer.from(svg))
  .png({ quality: 92, compressionLevel: 9 })
  .toFile(OUT);

console.log(`Wrote ${OUT}`);
