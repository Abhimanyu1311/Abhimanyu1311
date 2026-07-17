#!/usr/bin/env node
// Fetches a random programming/dev quote and renders it as assets/quote.svg.
// Run by .github/workflows/update.yml on a daily cron. Node 20+ (built-in fetch).

import { writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = path.join(__dirname, "..", "assets", "quote.svg");

// Used if the remote API is unreachable, so the daily job never fails outright.
const FALLBACK_QUOTES = [
  { text: "Code is like humor. When you have to explain it, it's bad.", author: "Cory House" },
  { text: "First, solve the problem. Then, write the code.", author: "John Johnson" },
  { text: "Simplicity is the soul of efficiency.", author: "Austin Freeman" },
  { text: "Programs must be written for people to read, and only incidentally for machines to execute.", author: "Harold Abelson" },
  { text: "The best error message is the one that never shows up.", author: "Thomas Fuchs" },
  { text: "Talk is cheap. Show me the code.", author: "Linus Torvalds" },
];

async function fetchQuote() {
  try {
    const res = await fetch("https://zenquotes.io/api/random", {
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`status ${res.status}`);
    const [{ q, a }] = await res.json();
    if (!q || !a) throw new Error("malformed response");
    return { text: q, author: a };
  } catch (err) {
    console.warn(`Falling back to local quote list: ${err.message}`);
    return FALLBACK_QUOTES[Math.floor(Math.random() * FALLBACK_QUOTES.length)];
  }
}

function escapeXml(str) {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// Greedy word-wrap tuned for ~16px Fira Code inside a 700px-wide card.
function wrapText(text, maxCharsPerLine = 78, maxLines = 3) {
  const words = text.split(/\s+/);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length > maxCharsPerLine && current) {
      lines.push(current);
      current = word;
    } else {
      current = next;
    }
    if (lines.length === maxLines - 1 && current.length > maxCharsPerLine) break;
  }
  if (current) lines.push(current);

  if (lines.length > maxLines) {
    const truncated = lines.slice(0, maxLines);
    truncated[maxLines - 1] = truncated[maxLines - 1].replace(/.{0,3}$/, "...");
    return truncated;
  }
  return lines;
}

function renderSvg({ text, author }) {
  const lines = wrapText(text);
  const lineHeight = 24;
  const textBlockHeight = lines.length * lineHeight;
  const height = 100 + textBlockHeight;
  const startY = 60;

  const quoteLines = lines
    .map(
      (line, i) =>
        `<text x="380" y="${startY + i * lineHeight}" text-anchor="middle" font-family="Fira Code, Consolas, monospace" font-size="16" fill="#E2E8F0">${escapeXml(line)}</text>`
    )
    .join("\n  ");

  const authorY = startY + textBlockHeight + 16;
  const footerY = authorY + 24;

  return `<svg width="760" height="${height}" viewBox="0 0 760 ${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="quote-bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1e1b4b" />
      <stop offset="50%" stop-color="#1e293b" />
      <stop offset="100%" stop-color="#0c4a6e" />
    </linearGradient>
  </defs>
  <rect width="760" height="${height}" rx="14" fill="url(#quote-bg)" />
  <text x="30" y="45" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="34" fill="#A78BFA" opacity="0.6">&#8220;</text>
  ${quoteLines}
  <text x="380" y="${authorY}" text-anchor="middle" font-family="Fira Code, Consolas, monospace" font-size="14" fill="#38BDF8">— ${escapeXml(author)}</text>
  <text x="380" y="${footerY}" text-anchor="middle" font-family="Segoe UI, Helvetica, Arial, sans-serif" font-size="10" fill="#64748B">refreshed daily · .github/workflows/update.yml</text>
</svg>
`;
}

const quote = await fetchQuote();
await writeFile(OUTPUT_PATH, renderSvg(quote));
console.log(`Wrote ${OUTPUT_PATH} with quote by ${quote.author}`);
