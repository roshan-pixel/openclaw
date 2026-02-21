"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeAccountId = normalizeAccountId;
function normalizeAccountId(value) {
  if (typeof value !== "string") {
    return undefined;
  }
  var trimmed = value.trim();
  return trimmed || undefined;
}
