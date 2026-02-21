"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.elide = elide;
exports.isLikelyWhatsAppCryptoError = isLikelyWhatsAppCryptoError;
function elide(text, limit) {
  if (limit === void 0) {
    limit = 400;
  }
  if (!text) {
    return text;
  }
  if (text.length <= limit) {
    return text;
  }
  return ""
    .concat(text.slice(0, limit), "\u2026 (truncated ")
    .concat(text.length - limit, " chars)");
}
function isLikelyWhatsAppCryptoError(reason) {
  var _a;
  var formatReason = function (value) {
    var _a, _b;
    if (value == null) {
      return "";
    }
    if (typeof value === "string") {
      return value;
    }
    if (value instanceof Error) {
      return ""
        .concat(value.message, "\n")
        .concat((_a = value.stack) !== null && _a !== void 0 ? _a : "");
    }
    if (typeof value === "object") {
      try {
        return JSON.stringify(value);
      } catch (_c) {
        return Object.prototype.toString.call(value);
      }
    }
    if (typeof value === "number") {
      return String(value);
    }
    if (typeof value === "boolean") {
      return String(value);
    }
    if (typeof value === "bigint") {
      return String(value);
    }
    if (typeof value === "symbol") {
      return (_b = value.description) !== null && _b !== void 0 ? _b : value.toString();
    }
    if (typeof value === "function") {
      return value.name ? "[function ".concat(value.name, "]") : "[function]";
    }
    return Object.prototype.toString.call(value);
  };
  var raw =
    reason instanceof Error
      ? ""
          .concat(reason.message, "\n")
          .concat((_a = reason.stack) !== null && _a !== void 0 ? _a : "")
      : formatReason(reason);
  var haystack = raw.toLowerCase();
  var hasAuthError =
    haystack.includes("unsupported state or unable to authenticate data") ||
    haystack.includes("bad mac");
  if (!hasAuthError) {
    return false;
  }
  return (
    haystack.includes("@whiskeysockets/baileys") ||
    haystack.includes("baileys") ||
    haystack.includes("noise-handler") ||
    haystack.includes("aesdecryptgcm")
  );
}
