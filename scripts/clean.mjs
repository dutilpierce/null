import { rmSync } from "node:fs";
import { resolve } from "node:path";

const targets = [".next", "node_modules", "tsconfig.tsbuildinfo"];

for (const t of targets) {
  const p = resolve(process.cwd(), t);
  try {
    rmSync(p, { recursive: true, force: true });
    // eslint-disable-next-line no-console
    console.log(`removed ${t}`);
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`failed to remove ${t}`, e instanceof Error ? e.message : e);
  }
}

