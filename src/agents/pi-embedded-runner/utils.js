"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.mapThinkingLevel = mapThinkingLevel;
exports.resolveExecToolDefaults = resolveExecToolDefaults;
exports.describeUnknownError = describeUnknownError;
function mapThinkingLevel(level) {
  // pi-agent-core supports "xhigh"; OpenClaw enables it for specific models.
  if (!level) {
    return "off";
  }
  return level;
}
function resolveExecToolDefaults(config) {
  var tools = config === null || config === void 0 ? void 0 : config.tools;
  if (!(tools === null || tools === void 0 ? void 0 : tools.exec)) {
    return undefined;
  }
  return tools.exec;
}
function describeUnknownError(error) {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  try {
    var serialized = JSON.stringify(error);
    return serialized !== null && serialized !== void 0 ? serialized : "Unknown error";
  } catch (_a) {
    return "Unknown error";
  }
}
