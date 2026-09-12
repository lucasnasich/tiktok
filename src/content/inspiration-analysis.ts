/** Tipos del análisis persistido en `assets/inspiracion/media/<assetId>/analysis.json`. */

export type InspirationPacing = "slow" | "medium" | "fast";
export type InspirationCameraNeed = "required" | "optional" | "none";
export type InspirationComplexity = "low" | "medium" | "high";
export type InspirationMatchMode = "structure" | "visual";

export type InspirationAnalysis = {
  version: number;
  promptVersion: number;
  analyzedAt: string;
  model: string;
  mediaFingerprint: string;
  summary: string;
  structure: {
    hookType: string;
    openingMechanism: string;
    narrativePattern: string;
    beats: string[];
    pacing: InspirationPacing;
    payoffType: string;
    ctaType: string;
    reusableMechanism: string;
    searchDocument: string;
  };
  visual: {
    mediaMode: string;
    subject: string;
    setting: string;
    composition: string;
    cameraStyle: string;
    cameraMovement: string;
    editingStyle: string;
    textOverlay: string;
    visualRhythm: string;
    visualTone: string;
    reusableMechanism: string;
    searchDocument: string;
  };
  content: {
    topicSummary: string;
    audienceSummary: string;
    intentSummary: string;
    semanticSearchDocument: string;
  };
  production: {
    cameraPresence: InspirationCameraNeed;
    complexity: InspirationComplexity;
  };
  audio: {
    hasSpeech: boolean;
    speechSummary: string;
    musicRole: string;
  };
  confidence: {
    structure: number;
    visual: number;
    audio: number;
    overall: number;
  };
  embeddings: {
    structure: number[];
    visual: number[];
    semantic: number[];
  };
};

export type InspirationMatchCandidate = {
  assetId: string;
  similarity: number;
  confidence: number;
  production?: {
    cameraPresence?: InspirationCameraNeed | string;
    complexity?: InspirationComplexity | string;
  };
};

export type InspirationIntelligenceStatus = {
  configured: boolean;
  analyzed: number;
  pending: number;
};

export type InspirationUseRole = "structure" | "visual" | "both";
