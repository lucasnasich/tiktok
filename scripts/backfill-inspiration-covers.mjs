import { spawnSync } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

const result = spawnSync(
  "python3",
  [path.join(root, "scripts/backfill-inspiration-covers.py")],
  { encoding: "utf8", stdio: "pipe" },
);

if (result.stdout) process.stdout.write(result.stdout);
if (result.stderr) process.stderr.write(result.stderr);

spawnSync("node", [path.join(root, "scripts/regenerate-inspiration-media.mjs")], {
  stdio: "inherit",
});

if (result.status !== 0) {
  process.exit(result.status ?? 1);
}
