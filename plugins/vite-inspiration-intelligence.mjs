import {
  collectIntelligenceStatus,
  hashQuery,
  MATCH_CANDIDATE_LIMIT,
  rankIndexByEmbedding,
  readInspirationIndex,
} from "../scripts/inspiration-intelligence-lib.mjs";
import {
  createGeminiClient,
  embedQuery,
} from "../scripts/inspiration-gemini.mjs";
import {
  resolveGeminiApiKey,
} from "../scripts/load-studio-env.mjs";

const STATUS_PATH = "/__studio/inspiration-intelligence/status";
const MATCH_PATH = "/__studio/inspiration-match";

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

/** API de dev: matching semántico local. La API key nunca sale de Node. */
export function inspirationIntelligencePlugin(env = process.env) {
  const queryCache = new Map();
  let indexCache = { mtime: 0, index: null };
  let clientPromise = null;

  function apiKey() {
    return resolveGeminiApiKey({ ...env, ...process.env });
  }

  function getIndex() {
    const fresh = readInspirationIndex();
    const stamp = `${fresh.generatedAt ?? ""}:${fresh.entries?.length ?? 0}`;
    if (indexCache.mtime === stamp && indexCache.index) return indexCache.index;
    indexCache = { mtime: stamp, index: fresh };
    return fresh;
  }

  async function getClient() {
    const key = apiKey();
    if (!key) return null;
    if (!clientPromise) {
      clientPromise = createGeminiClient(key);
    }
    return clientPromise;
  }

  async function embeddingForQuery(mode, query) {
    const cacheKey = hashQuery(mode, query);
    const hit = queryCache.get(cacheKey);
    if (hit) return hit;
    const ai = await getClient();
    if (!ai) return null;
    const vector = await embedQuery(ai, query);
    if (queryCache.size > 200) {
      const first = queryCache.keys().next().value;
      queryCache.delete(first);
    }
    queryCache.set(cacheKey, vector);
    return vector;
  }

  return {
    name: "vite-inspiration-intelligence",
    configureServer(server) {
      server.middlewares.use(async (req, res, next) => {
        const url = req.url?.split("?")[0];
        if (url !== STATUS_PATH && url !== MATCH_PATH) return next();

        if (url === STATUS_PATH) {
          if (req.method !== "GET") {
            sendJson(res, 405, { error: "Method not allowed" });
            return;
          }
          sendJson(res, 200, collectIntelligenceStatus({ configured: Boolean(apiKey()) }));
          return;
        }

        if (req.method !== "POST") {
          sendJson(res, 405, { error: "Method not allowed" });
          return;
        }

        try {
          const body = await readRequestBody(req);
          const mode = body?.mode === "visual" ? "visual" : "structure";
          const query = String(body?.query ?? "").trim();
          const configured = Boolean(apiKey());
          if (!configured) {
            sendJson(res, 200, {
              configured: false,
              mode,
              candidates: [],
            });
            return;
          }
          if (!query) {
            sendJson(res, 400, { error: "query is required" });
            return;
          }

          const index = getIndex();
          if (!index.entries?.length) {
            sendJson(res, 200, {
              configured: true,
              mode,
              candidates: [],
            });
            return;
          }

          const embedding = await embeddingForQuery(mode, query);
          const candidates = rankIndexByEmbedding(
            index,
            embedding,
            mode,
            MATCH_CANDIDATE_LIMIT,
          );
          sendJson(res, 200, {
            configured: true,
            mode,
            candidates,
          });
        } catch (error) {
          console.error("[inspiration-intelligence]", error);
          sendJson(res, 500, {
            error: "Inspiration match failed",
            configured: Boolean(apiKey()),
            candidates: [],
          });
        }
      });
    },
  };
}
