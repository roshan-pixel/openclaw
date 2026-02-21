"use strict";
/**
 * Template interpolation for response prefix.
 *
 * Supports variables like `{model}`, `{provider}`, `{thinkingLevel}`, etc.
 * Variables are case-insensitive and unresolved ones remain as literal text.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveResponsePrefixTemplate = resolveResponsePrefixTemplate;
exports.extractShortModelName = extractShortModelName;
exports.hasTemplateVariables = hasTemplateVariables;
// Regex pattern for template variables: {variableName} or {variable.name}
var TEMPLATE_VAR_PATTERN = /\{([a-zA-Z][a-zA-Z0-9.]*)\}/g;
/**
 * Interpolate template variables in a response prefix string.
 *
 * @param template - The template string with `{variable}` placeholders
 * @param context - Context object with values for interpolation
 * @returns The interpolated string, or undefined if template is undefined
 *
 * @example
 * resolveResponsePrefixTemplate("[{model} | think:{thinkingLevel}]", {
 *   model: "gpt-5.2",
 *   thinkingLevel: "high"
 * })
 * // Returns: "[gpt-5.2 | think:high]"
 */
function resolveResponsePrefixTemplate(template, context) {
  if (!template) {
    return undefined;
  }
  return template.replace(TEMPLATE_VAR_PATTERN, function (match, varName) {
    var _a, _b, _c, _d, _e;
    var normalizedVar = varName.toLowerCase();
    switch (normalizedVar) {
      case "model":
        return (_a = context.model) !== null && _a !== void 0 ? _a : match;
      case "modelfull":
        return (_b = context.modelFull) !== null && _b !== void 0 ? _b : match;
      case "provider":
        return (_c = context.provider) !== null && _c !== void 0 ? _c : match;
      case "thinkinglevel":
      case "think":
        return (_d = context.thinkingLevel) !== null && _d !== void 0 ? _d : match;
      case "identity.name":
      case "identityname":
        return (_e = context.identityName) !== null && _e !== void 0 ? _e : match;
      default:
        // Leave unrecognized variables as-is
        return match;
    }
  });
}
/**
 * Extract short model name from a full model string.
 *
 * Strips:
 * - Provider prefix (e.g., "openai/" from "openai/gpt-5.2")
 * - Date suffixes (e.g., "-20251101" from "claude-opus-4-5-20251101")
 * - Common version suffixes (e.g., "-latest")
 *
 * @example
 * extractShortModelName("openai-codex/gpt-5.2") // "gpt-5.2"
 * extractShortModelName("claude-opus-4-5-20251101") // "claude-opus-4-5"
 * extractShortModelName("gpt-5.2-latest") // "gpt-5.2"
 */
function extractShortModelName(fullModel) {
  // Strip provider prefix
  var slash = fullModel.lastIndexOf("/");
  var modelPart = slash >= 0 ? fullModel.slice(slash + 1) : fullModel;
  // Strip date suffixes (YYYYMMDD format)
  return modelPart.replace(/-\d{8}$/, "").replace(/-latest$/, "");
}
/**
 * Check if a template string contains any template variables.
 */
function hasTemplateVariables(template) {
  if (!template) {
    return false;
  }
  // Reset lastIndex since we're using a global regex
  TEMPLATE_VAR_PATTERN.lastIndex = 0;
  return TEMPLATE_VAR_PATTERN.test(template);
}
