"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTranscriptPolicy = resolveTranscriptPolicy;
var google_js_1 = require("./pi-embedded-helpers/google.js");
var model_selection_js_1 = require("./model-selection.js");
var MISTRAL_MODEL_HINTS = [
  "mistral",
  "mixtral",
  "codestral",
  "pixtral",
  "devstral",
  "ministral",
  "mistralai",
];
var OPENAI_MODEL_APIS = new Set([
  "openai",
  "openai-completions",
  "openai-responses",
  "openai-codex-responses",
]);
var OPENAI_PROVIDERS = new Set(["openai", "openai-codex"]);
function isOpenAiApi(modelApi) {
  if (!modelApi) {
    return false;
  }
  return OPENAI_MODEL_APIS.has(modelApi);
}
function isOpenAiProvider(provider) {
  if (!provider) {
    return false;
  }
  return OPENAI_PROVIDERS.has((0, model_selection_js_1.normalizeProviderId)(provider));
}
function isAnthropicApi(modelApi, provider) {
  if (modelApi === "anthropic-messages") {
    return true;
  }
  var normalized = (0, model_selection_js_1.normalizeProviderId)(
    provider !== null && provider !== void 0 ? provider : "",
  );
  // MiniMax now uses openai-completions API, not anthropic-messages
  return normalized === "anthropic";
}
function isMistralModel(params) {
  var _a, _b;
  var provider = (0, model_selection_js_1.normalizeProviderId)(
    (_a = params.provider) !== null && _a !== void 0 ? _a : "",
  );
  if (provider === "mistral") {
    return true;
  }
  var modelId = ((_b = params.modelId) !== null && _b !== void 0 ? _b : "").toLowerCase();
  if (!modelId) {
    return false;
  }
  return MISTRAL_MODEL_HINTS.some(function (hint) {
    return modelId.includes(hint);
  });
}
function resolveTranscriptPolicy(params) {
  var _a, _b;
  var provider = (0, model_selection_js_1.normalizeProviderId)(
    (_a = params.provider) !== null && _a !== void 0 ? _a : "",
  );
  var modelId = (_b = params.modelId) !== null && _b !== void 0 ? _b : "";
  var isGoogle = (0, google_js_1.isGoogleModelApi)(params.modelApi);
  var isAnthropic = isAnthropicApi(params.modelApi, provider);
  var isOpenAi = isOpenAiProvider(provider) || (!provider && isOpenAiApi(params.modelApi));
  var isMistral = isMistralModel({ provider: provider, modelId: modelId });
  var isOpenRouterGemini =
    (provider === "openrouter" || provider === "opencode") &&
    modelId.toLowerCase().includes("gemini");
  var isAntigravityClaudeModel = (0, google_js_1.isAntigravityClaude)({
    api: params.modelApi,
    provider: provider,
    modelId: modelId,
  });
  var needsNonImageSanitize = isGoogle || isAnthropic || isMistral || isOpenRouterGemini;
  var sanitizeToolCallIds = isGoogle || isMistral;
  var toolCallIdMode = isMistral ? "strict9" : sanitizeToolCallIds ? "strict" : undefined;
  var repairToolUseResultPairing = isGoogle || isAnthropic;
  var sanitizeThoughtSignatures = isOpenRouterGemini
    ? { allowBase64Only: true, includeCamelCase: true }
    : undefined;
  var normalizeAntigravityThinkingBlocks = isAntigravityClaudeModel;
  return {
    sanitizeMode: isOpenAi ? "images-only" : needsNonImageSanitize ? "full" : "images-only",
    sanitizeToolCallIds: !isOpenAi && sanitizeToolCallIds,
    toolCallIdMode: toolCallIdMode,
    repairToolUseResultPairing: !isOpenAi && repairToolUseResultPairing,
    preserveSignatures: isAntigravityClaudeModel,
    sanitizeThoughtSignatures: isOpenAi ? undefined : sanitizeThoughtSignatures,
    normalizeAntigravityThinkingBlocks: normalizeAntigravityThinkingBlocks,
    applyGoogleTurnOrdering: !isOpenAi && isGoogle,
    validateGeminiTurns: !isOpenAi && isGoogle,
    validateAnthropicTurns: !isOpenAi && isAnthropic,
    allowSyntheticToolResults: !isOpenAi && (isGoogle || isAnthropic),
  };
}
