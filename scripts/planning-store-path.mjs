import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");

export const PLANNING_STORE_FILE = path.join(
  root,
  "src/content/planning-store.json",
);

export const EMPTY_PLANNING_STORE_FILE = {
  meta: {
    updatedAt: null,
    source: "seed",
    note:
      "Base versionada del Studio. En dev, la app sincroniza acá planificación (perfiles, cuentas, wizard).",
  },
  planning: {
    version: 4,
    setupCompleted: false,
    profiles: [],
    accounts: [],
    accountProfileIds: {},
    wizardSessions: {},
  },
};

export function readPlanningStoreFile() {
  if (!fs.existsSync(PLANNING_STORE_FILE)) return null;
  try {
    return JSON.parse(fs.readFileSync(PLANNING_STORE_FILE, "utf8"));
  } catch {
    return null;
  }
}

export function writePlanningStoreFile(data) {
  fs.mkdirSync(path.dirname(PLANNING_STORE_FILE), { recursive: true });
  fs.writeFileSync(
    PLANNING_STORE_FILE,
    `${JSON.stringify(data, null, 2)}\n`,
    "utf8",
  );
}

export function ensurePlanningStoreFile() {
  if (!fs.existsSync(PLANNING_STORE_FILE)) {
    writePlanningStoreFile(EMPTY_PLANNING_STORE_FILE);
  }
}
