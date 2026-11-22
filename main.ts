// gta6-clipper-01 — entrypoint.
// Copies VIDEO.json from the repository root into the output directory.
// The house reads the video itself through the YouTube Data API; this
// program only hands over the video's address. Standard library only,
// no network access, no writes outside the output directory.
import { copyFile, mkdir, readFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = dirname(fileURLToPath(import.meta.url));
const outDir = process.env.MAKEFUN_OUTPUT_DIR || "/output";

const videoJson = join(repoRoot, "VIDEO.json");
const parsed = JSON.parse(await readFile(videoJson, "utf8"));
if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
  throw new Error("VIDEO.json must hold a JSON object");
}
if (typeof parsed.url !== "string" || parsed.url.length === 0) {
  throw new Error("VIDEO.json must name a url string");
}
const videoId = parsed.url.match(
  /(?:youtube\.com\/(?:shorts\/|watch\?v=)|youtu\.be\/)([A-Za-z0-9_-]{11})/,
)?.[1];
if (!videoId) {
  throw new Error(
    "VIDEO.json url must be a YouTube video address (shorts, watch or youtu.be)",
  );
}

await mkdir(outDir, { recursive: true });
await copyFile(videoJson, join(outDir, "VIDEO.json"));
console.log(`copied VIDEO.json -> ${join(outDir, "VIDEO.json")}`);
