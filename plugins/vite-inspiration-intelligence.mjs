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
  generateStructuredAnalysis,
} from "../scripts/inspiration-gemini.mjs";
import { loadBrainDocuments } from "../scripts/mercantis-brain-loader.mjs";
import { buildFormatProductionPromptSection } from "../scripts/format-production-examples.mjs";
import {
  buildSlotDescriptionSchema,
  buildSlotDescriptionUserPrompt,
  normalizeSlotDescriptionPayload,
} from "../scripts/slot-description-schema.mjs";
import {
  resolveGeminiApiKey,
} from "../scripts/load-studio-env.mjs";

const STATUS_PATH = "/__studio/inspiration-intelligence/status";
const MATCH_PATH = "/__studio/inspiration-match";
const SLOT_DESCRIPTION_PATH = "/__studio/slot-description";

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

/** API de dev: matching semántico y preparación de SlotSpec. La API key nunca sale de Node. */
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
        if (
          url !== STATUS_PATH &&
          url !== MATCH_PATH &&
          url !== SLOT_DESCRIPTION_PATH
        ) {
          return next();
        }

        if (url === STATUS_PATH) {
          if (req.method !== "GET") {
            sendJson(res, 405, { error: "Method not allowed" });
            return;
          }
          sendJson(res, 200, collectIntelligenceStatus({ configured: Boolean(apiKey()) }));
          return;
        }

        if (url === SLOT_DESCRIPTION_PATH) {
          if (req.method !== "POST") {
            sendJson(res, 405, { error: "Method not allowed" });
            return;
          }
          try {
            const body = await readRequestBody(req);
            const configured = Boolean(apiKey());
            if (!configured) {
              sendJson(res, 200, {
                configured: false,
                error: "Falta GOOGLE_GENERATIVE_AI_API_KEY.",
              });
              return;
            }
            if (!body || typeof body !== "object") {
              sendJson(res, 400, { error: "Body JSON inválido" });
              return;
            }
            if (!String(body.slotId ?? "").trim()) {
              sendJson(res, 400, { error: "slotId is required" });
              return;
            }

            const brainRefs = Array.isArray(body.brainRefs) ? body.brainRefs : [];
            const { documents, missing } = loadBrainDocuments(brainRefs);
            const ai = await getClient();
            if (!ai) {
              sendJson(res, 200, {
                configured: false,
                error: "Falta GOOGLE_GENERATIVE_AI_API_KEY.",
              });
              return;
            }

            const parsed = await generateStructuredAnalysis(ai, {
              contents: [
                {
                  role: "user",
                  parts: [
                    {
                      text: buildSlotDescriptionUserPrompt({
                        slotId: body.slotId,
                        accountLabel: body.accountLabel,
                        accountId: body.accountId,
                        roleLabel: body.roleLabel,
                        roleId: body.roleId,
                        roleSummary: body.roleSummary,
                        pillarLabel: body.pillarLabel,
                        pillarId: body.pillarId,
                        pillarSummary: body.pillarSummary,
                        formatLabel: body.formatLabel,
                        formatId: body.formatId,
                        formatSummary: body.formatSummary,
                        formatProductionSection: buildFormatProductionPromptSection({
                          formatId: body.formatId,
                          formatLabel: body.formatLabel,
                          formatSummary: body.formatSummary,
                          cameraPresence: body.cameraPresence,
                          cameraPresenceLabel: body.cameraPresenceLabel,
                        }),
                        cameraPresenceLabel: body.cameraPresenceLabel,
                        cameraPresenceConstraint: body.cameraPresenceConstraint,
                        platforms: body.platforms,
                        date: body.date,
                        time: body.time,
                        editorialConstraints: Array.isArray(body.editorialConstraints)
                          ? body.editorialConstraints
                          : [],
                        brainDocuments: documents,
                        missingBrainRefs: missing,
                      }),
                    },
                  ],
                },
              ],
              schema: buildSlotDescriptionSchema(),
              temperature: 0.35,
            });
            const payload = normalizeSlotDescriptionPayload(parsed);
            sendJson(res, 200, {
              configured: true,
              ...payload,
              brainFiles: documents.map((doc) => doc.file),
              missingBrainRefs: missing,
            });
          } catch (error) {
            console.error("[slot-description]", error);
            sendJson(res, 500, {
              configured: Boolean(apiKey()),
              error:
                error?.message?.trim() ||
                "Gemini no pudo generar la descripción del slot.",
            });
          }
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
