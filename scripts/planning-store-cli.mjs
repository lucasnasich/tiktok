import {
  EMPTY_PLANNING_STORE_FILE,
  PLANNING_STORE_FILE,
  readPlanningStoreFile,
  writePlanningStoreFile,
} from "./planning-store-path.mjs";

const [command = "status"] = process.argv.slice(2);

function summarize(store) {
  const planning = store?.planning ?? {};
  return {
    path: PLANNING_STORE_FILE,
    updatedAt: store?.meta?.updatedAt ?? null,
    setupCompleted: Boolean(planning.setupCompleted),
    profiles: Array.isArray(planning.profiles) ? planning.profiles.length : 0,
    accounts: Object.keys(planning.accountProfileIds ?? {}).length,
    wizardSessions: Object.keys(planning.wizardSessions ?? {}).length,
  };
}

switch (command) {
  case "status": {
    const store = readPlanningStoreFile();
    console.log(JSON.stringify(summarize(store), null, 2));
    break;
  }
  case "cat": {
    const store = readPlanningStoreFile();
    console.log(JSON.stringify(store ?? EMPTY_PLANNING_STORE_FILE, null, 2));
    break;
  }
  case "reset": {
    writePlanningStoreFile(EMPTY_PLANNING_STORE_FILE);
    console.log(`Reset → ${PLANNING_STORE_FILE}`);
    break;
  }
  default:
    console.error(`Uso: node scripts/planning-store-cli.mjs [status|cat|reset]`);
    process.exit(1);
}
