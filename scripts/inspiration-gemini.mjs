import fs, { createReadStream } from "node:fs";
import path from "node:path";

import {
  ANALYSIS_MODEL,
  EMBEDDING_DIMENSIONS,
  EMBEDDING_MODEL,
} from "./inspiration-analysis-schema.mjs";

const DEFAULT_TIMEOUT_MS = 180_000;

export function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function statusOf(error) {
  return (
    error?.status ??
    error?.statusCode ??
    error?.code ??
    error?.cause?.status ??
    error?.response?.status
  );
}

function isRetryable(error) {
  const status = Number(statusOf(error));
  if (status === 429 || (status >= 500 && status < 600)) return true;
  const message = String(error?.message ?? error ?? "");
  return /429|RESOURCE_EXHAUSTED|UNAVAILABLE|500|502|503|504|ECONNRESET|ETIMEDOUT/i.test(
    message,
  );
}

export async function withRetry(fn, { retries = 3, label = "Gemini" } = {}) {
  let lastError;
  for (let attempt = 1; attempt <= retries; attempt += 1) {
    try {
      return await fn();
    } catch (error) {
      lastError = error;
      if (!isRetryable(error) || attempt === retries) throw error;
      const delay = Math.min(2000 * 3 ** (attempt - 1), 20_000);
      const status = statusOf(error) || String(error?.message ?? "error");
      console.warn(
        `${label}: ${status}. Reintento ${attempt}/${retries} en ${delay}ms`,
      );
      await sleep(delay);
    }
  }
  throw lastError;
}

export async function createGeminiClient(apiKey) {
  const { GoogleGenAI } = await import("@google/genai");
  return new GoogleGenAI({
    apiKey,
    httpOptions: { timeout: DEFAULT_TIMEOUT_MS },
  });
}

function mimeForFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === ".mp4") return "video/mp4";
  if (ext === ".webm") return "video/webm";
  if (ext === ".mov") return "video/quicktime";
  if (ext === ".png") return "image/png";
  if (ext === ".webp") return "image/webp";
  if (ext === ".gif") return "image/gif";
  return "image/jpeg";
}

function fileState(file) {
  return String(file?.state ?? file?.fileState ?? "").toUpperCase();
}

export async function waitForFileActive(ai, file, {
  timeoutMs = 300_000,
  intervalMs = 3000,
} = {}) {
  const start = Date.now();
  let current = file;
  while (fileState(current) === "PROCESSING") {
    if (Date.now() - start > timeoutMs) {
      throw new Error(`Timeout esperando ACTIVE (${file?.name ?? "file"})`);
    }
    await sleep(intervalMs);
    current = await ai.files.get({ name: current.name });
  }
  const state = fileState(current);
  if (state && state !== "ACTIVE") {
    throw new Error(`Archivo Gemini en estado ${state}`);
  }
  return current;
}

export async function uploadGeminiFile(ai, filePath, displayName) {
  const mimeType = mimeForFile(filePath);
  const uploaded = await withRetry(
    () =>
      ai.files.upload({
        file: filePath,
        config: { mimeType, displayName },
      }),
    { label: `upload ${path.basename(filePath)}` },
  );
  return waitForFileActive(ai, uploaded);
}

export async function uploadGeminiFileFromStream(ai, filePath, displayName) {
  const mimeType = mimeForFile(filePath);
  const uploaded = await withRetry(
    () =>
      ai.files.upload({
        file: createReadStream(filePath),
        config: { mimeType, displayName },
      }),
    { label: `upload-stream ${path.basename(filePath)}` },
  );
  return waitForFileActive(ai, uploaded);
}

export async function deleteGeminiFile(ai, file) {
  if (!file?.name) return;
  try {
    await ai.files.delete({ name: file.name });
  } catch (error) {
    console.warn(
      `No se pudo borrar el archivo remoto ${file.name}: ${error?.message ?? error}`,
    );
  }
}

export function inlineImagePart(filePath) {
  return {
    inlineData: {
      mimeType: mimeForFile(filePath),
      data: fs.readFileSync(filePath).toString("base64"),
    },
  };
}

export async function generateStructuredAnalysis(ai, { contents, schema }) {
  const response = await withRetry(
    () =>
      ai.models.generateContent({
        model: ANALYSIS_MODEL,
        contents,
        config: {
          responseMimeType: "application/json",
          responseSchema: schema,
          temperature: 0.2,
        },
      }),
    { label: "generateContent" },
  );

  const text =
    typeof response?.text === "string"
      ? response.text
      : response?.candidates?.[0]?.content?.parts
          ?.map((part) => part.text)
          .filter(Boolean)
          .join("\n") ?? "";

  if (!text.trim()) {
    throw new Error("Gemini devolvió una respuesta vacía");
  }

  let parsed;
  try {
    parsed = JSON.parse(text);
  } catch {
    throw new Error("Gemini no devolvió JSON válido");
  }

  return parsed;
}

function embeddingVector(response, index = 0) {
  const embeddings = response?.embeddings ?? [];
  const values =
    embeddings[index]?.values ??
    response?.embedding?.values ??
    embeddings[0]?.values;
  if (!Array.isArray(values) || values.length === 0) {
    throw new Error("Gemini no devolvió embedding");
  }
  return values;
}

export async function embedTexts(ai, texts, { taskType } = {}) {
  const contents = texts.map((text) => text || " ");
  const config = {
    outputDimensionality: EMBEDDING_DIMENSIONS,
  };
  if (taskType) config.taskType = taskType;

  const embedOne = async (text, embedConfig) => {
    const response = await withRetry(
      () =>
        ai.models.embedContent({
          model: EMBEDDING_MODEL,
          contents: text,
          config: embedConfig,
        }),
      { label: "embedContent" },
    );
    return embeddingVector(response, 0);
  };

  try {
    const vectors = [];
    for (const text of contents) {
      vectors.push(await embedOne(text, config));
    }
    return vectors;
  } catch (error) {
    if (!taskType) throw error;
    const fallback = { outputDimensionality: EMBEDDING_DIMENSIONS };
    const vectors = [];
    for (const text of contents) {
      vectors.push(await embedOne(text, fallback));
    }
    return vectors;
  }
}

export async function embedQuery(ai, query) {
  const [vector] = await embedTexts(ai, [query], { taskType: "RETRIEVAL_QUERY" });
  return vector;
}

export function fileToGeneratePart(file) {
  const fileUri = file?.uri || file?.fileUri;
  const mimeType = file?.mimeType || "application/octet-stream";
  if (!fileUri) {
    throw new Error("El archivo de Gemini no tiene URI");
  }
  return {
    fileData: {
      fileUri,
      mimeType,
    },
  };
}
