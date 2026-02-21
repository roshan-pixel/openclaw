"use strict";
/**
 * Utility functions for provider-specific logic and capabilities.
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.isReasoningTagProvider = isReasoningTagProvider;
/**
 * Returns true if the provider requires reasoning to be wrapped in tags
 * (e.g. <think> and <final>) in the text stream, rather than using native
 * API fields for reasoning/thinking.
 */
function isReasoningTagProvider(provider) {
  if (!provider) {
    return false;
  }
  var normalized = provider.trim().toLowerCase();
  // Check for exact matches or known prefixes/substrings for reasoning providers
  if (
    normalized === "ollama" ||
    normalized === "google-gemini-cli" ||
    normalized === "google-generative-ai"
  ) {
    return true;
  }
  // Handle google-antigravity and its model variations (e.g. google-antigravity/gemini-3)
  if (normalized.includes("google-antigravity")) {
    return true;
  }
  // Handle Minimax (M2.1 is chatty/reasoning-like)
  if (normalized.includes("minimax")) {
    return true;
  }
  return false;
}
