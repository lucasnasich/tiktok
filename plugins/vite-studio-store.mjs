import {
  PLANNING_STORE_FILE,
  readPlanningStoreFile,
  writePlanningStoreFile,
} from "../scripts/planning-store-path.mjs";

const API_PATH = "/__studio/planning-store";

function sendJson(res, statusCode, payload) {
  res.statusCode = statusCode;
  res.setHeader("Content-Type", "application/json; charset=utf-8");
  res.end(JSON.stringify(payload));
}

function readRequestBody(req) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    req.on("data", (chunk) => chunks.push(chunk));
    req.on("end", () => {
      try {
        const raw = Buffer.concat(chunks).toString("utf8");
        resolve(raw ? JSON.parse(raw) : null);
      } catch (error) {
        reject(error);
      }
    });
    req.on("error", reject);
  });
}

function isValidStorePayload(body) {
  return (
    body &&
    typeof body === "object" &&
    body.planning &&
    typeof body.planning === "object" &&
    body.planning.version === 4
  );
}

/** API de dev para leer/escribir `src/content/planning-store.json`. */
export function studioStorePlugin() {
  return {
    name: "vite-studio-store",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url !== API_PATH) return next();

        if (req.method === "GET") {
          const data = readPlanningStoreFile();
          sendJson(res, 200, data);
          return;
        }

        if (req.method === "PUT") {
          try {
            const body = await readRequestBody(req);
            if (!isValidStorePayload(body)) {
              sendJson(res, 400, { error: "Invalid planning store payload" });
              return;
            }

            const payload = {
              meta: {
                updatedAt: new Date().toISOString(),
                source: body.meta?.source ?? "studio-app",
                note:
                  body.meta?.note ??
                  "Sincronizado desde el Studio (npm run dev).",
              },
              planning: body.planning,
            };

            writePlanningStoreFile(payload);
            sendJson(res, 200, { ok: true, meta: payload.meta, path: PLANNING_STORE_FILE });
          } catch {
            sendJson(res, 400, { error: "Could not parse request body" });
          }
          return;
        }

        sendJson(res, 405, { error: "Method not allowed" });
      });
    },
  };
}
