"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.XHIGH_MODEL_REFS = void 0;
exports.isBinaryThinkingProvider = isBinaryThinkingProvider;
exports.normalizeThinkLevel = normalizeThinkLevel;
exports.supportsXHighThinking = supportsXHighThinking;
exports.listThinkingLevels = listThinkingLevels;
exports.listThinkingLevelLabels = listThinkingLevelLabels;
exports.formatThinkingLevels = formatThinkingLevels;
exports.formatXHighModelHint = formatXHighModelHint;
exports.normalizeVerboseLevel = normalizeVerboseLevel;
exports.normalizeNoticeLevel = normalizeNoticeLevel;
exports.normalizeUsageDisplay = normalizeUsageDisplay;
exports.resolveResponseUsageMode = resolveResponseUsageMode;
exports.normalizeElevatedLevel = normalizeElevatedLevel;
exports.resolveElevatedMode = resolveElevatedMode;
exports.normalizeReasoningLevel = normalizeReasoningLevel;
function normalizeProviderId(provider) {
  if (!provider) {
    return "";
  }
  var normalized = provider.trim().toLowerCase();
  if (normalized === "z.ai" || normalized === "z-ai") {
    return "zai";
  }
  return normalized;
}
function isBinaryThinkingProvider(provider) {
  return normalizeProviderId(provider) === "zai";
}
exports.XHIGH_MODEL_REFS = [
  "openai/gpt-5.2",
  "openai-codex/gpt-5.2-codex",
  "openai-codex/gpt-5.1-codex",
];
var XHIGH_MODEL_SET = new Set(
  exports.XHIGH_MODEL_REFS.map(function (entry) {
    return entry.toLowerCase();
  }),
);
var XHIGH_MODEL_IDS = new Set(
  exports.XHIGH_MODEL_REFS.map(function (entry) {
    var _a;
    return (_a = entry.split("/")[1]) === null || _a === void 0 ? void 0 : _a.toLowerCase();
  }).filter(function (entry) {
    return Boolean(entry);
  }),
);
// Normalize user-provided thinking level strings to the canonical enum.
function normalizeThinkLevel(raw) {
  if (!raw) {
    return undefined;
  }
  var key = raw.toLowerCase();
  if (["off"].includes(key)) {
    return "off";
  }
  if (["on", "enable", "enabled"].includes(key)) {
    return "low";
  }
  if (["min", "minimal"].includes(key)) {
    return "minimal";
  }
  if (["low", "thinkhard", "think-hard", "think_hard"].includes(key)) {
    return "low";
  }
  if (["mid", "med", "medium", "thinkharder", "think-harder", "harder"].includes(key)) {
    return "medium";
  }
  if (
    ["high", "ultra", "ultrathink", "think-hard", "thinkhardest", "highest", "max"].includes(key)
  ) {
    return "high";
  }
  if (["xhigh", "x-high", "x_high"].includes(key)) {
    return "xhigh";
  }
  if (["think"].includes(key)) {
    return "minimal";
  }
  return undefined;
}
function supportsXHighThinking(provider, model) {
  var modelKey = model === null || model === void 0 ? void 0 : model.trim().toLowerCase();
  if (!modelKey) {
    return false;
  }
  var providerKey =
    provider === null || provider === void 0 ? void 0 : provider.trim().toLowerCase();
  if (providerKey) {
    return XHIGH_MODEL_SET.has("".concat(providerKey, "/").concat(modelKey));
  }
  return XHIGH_MODEL_IDS.has(modelKey);
}
function listThinkingLevels(provider, model) {
  var levels = ["off", "minimal", "low", "medium", "high"];
  if (supportsXHighThinking(provider, model)) {
    levels.push("xhigh");
  }
  return levels;
}
function listThinkingLevelLabels(provider, model) {
  if (isBinaryThinkingProvider(provider)) {
    return ["off", "on"];
  }
  return listThinkingLevels(provider, model);
}
function formatThinkingLevels(provider, model, separator) {
  if (separator === void 0) {
    separator = ", ";
  }
  return listThinkingLevelLabels(provider, model).join(separator);
}
function formatXHighModelHint() {
  var refs = __spreadArray([], exports.XHIGH_MODEL_REFS, true);
  if (refs.length === 0) {
    return "unknown model";
  }
  if (refs.length === 1) {
    return refs[0];
  }
  if (refs.length === 2) {
    return "".concat(refs[0], " or ").concat(refs[1]);
  }
  return "".concat(refs.slice(0, -1).join(", "), " or ").concat(refs[refs.length - 1]);
}
// Normalize verbose flags used to toggle agent verbosity.
function normalizeVerboseLevel(raw) {
  if (!raw) {
    return undefined;
  }
  var key = raw.toLowerCase();
  if (["off", "false", "no", "0"].includes(key)) {
    return "off";
  }
  if (["full", "all", "everything"].includes(key)) {
    return "full";
  }
  if (["on", "minimal", "true", "yes", "1"].includes(key)) {
    return "on";
  }
  return undefined;
}
// Normalize system notice flags used to toggle system notifications.
function normalizeNoticeLevel(raw) {
  if (!raw) {
    return undefined;
  }
  var key = raw.toLowerCase();
  if (["off", "false", "no", "0"].includes(key)) {
    return "off";
  }
  if (["full", "all", "everything"].includes(key)) {
    return "full";
  }
  if (["on", "minimal", "true", "yes", "1"].includes(key)) {
    return "on";
  }
  return undefined;
}
// Normalize response-usage display modes used to toggle per-response usage footers.
function normalizeUsageDisplay(raw) {
  if (!raw) {
    return undefined;
  }
  var key = raw.toLowerCase();
  if (["off", "false", "no", "0", "disable", "disabled"].includes(key)) {
    return "off";
  }
  if (["on", "true", "yes", "1", "enable", "enabled"].includes(key)) {
    return "tokens";
  }
  if (["tokens", "token", "tok", "minimal", "min"].includes(key)) {
    return "tokens";
  }
  if (["full", "session"].includes(key)) {
    return "full";
  }
  return undefined;
}
function resolveResponseUsageMode(raw) {
  var _a;
  return (_a = normalizeUsageDisplay(raw)) !== null && _a !== void 0 ? _a : "off";
}
// Normalize elevated flags used to toggle elevated bash permissions.
function normalizeElevatedLevel(raw) {
  if (!raw) {
    return undefined;
  }
  var key = raw.toLowerCase();
  if (["off", "false", "no", "0"].includes(key)) {
    return "off";
  }
  if (["full", "auto", "auto-approve", "autoapprove"].includes(key)) {
    return "full";
  }
  if (["ask", "prompt", "approval", "approve"].includes(key)) {
    return "ask";
  }
  if (["on", "true", "yes", "1"].includes(key)) {
    return "on";
  }
  return undefined;
}
function resolveElevatedMode(level) {
  if (!level || level === "off") {
    return "off";
  }
  if (level === "full") {
    return "full";
  }
  return "ask";
}
// Normalize reasoning visibility flags used to toggle reasoning exposure.
function normalizeReasoningLevel(raw) {
  if (!raw) {
    return undefined;
  }
  var key = raw.toLowerCase();
  if (["off", "false", "no", "0", "hide", "hidden", "disable", "disabled"].includes(key)) {
    return "off";
  }
  if (["on", "true", "yes", "1", "show", "visible", "enable", "enabled"].includes(key)) {
    return "on";
  }
  if (["stream", "streaming", "draft", "live"].includes(key)) {
    return "stream";
  }
  return undefined;
}
