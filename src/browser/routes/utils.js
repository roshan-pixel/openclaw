"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProfileContext = getProfileContext;
exports.jsonError = jsonError;
exports.toStringOrEmpty = toStringOrEmpty;
exports.toNumber = toNumber;
exports.toBoolean = toBoolean;
exports.toStringArray = toStringArray;
var boolean_js_1 = require("../../utils/boolean.js");
/**
 * Extract profile name from query string or body and get profile context.
 * Query string takes precedence over body for consistency with GET routes.
 */
function getProfileContext(req, ctx) {
  var profileName;
  // Check query string first (works for GET and POST)
  if (typeof req.query.profile === "string") {
    profileName = req.query.profile.trim() || undefined;
  }
  // Fall back to body for POST requests
  if (!profileName && req.body && typeof req.body === "object") {
    var body = req.body;
    if (typeof body.profile === "string") {
      profileName = body.profile.trim() || undefined;
    }
  }
  try {
    return ctx.forProfile(profileName);
  } catch (err) {
    return { error: String(err), status: 404 };
  }
}
function jsonError(res, status, message) {
  res.status(status).json({ error: message });
}
function toStringOrEmpty(value) {
  if (typeof value === "string") {
    return value.trim();
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value).trim();
  }
  return "";
}
function toNumber(value) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string" && value.trim()) {
    var parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : undefined;
  }
  return undefined;
}
function toBoolean(value) {
  return (0, boolean_js_1.parseBooleanValue)(value, {
    truthy: ["true", "1", "yes"],
    falsy: ["false", "0", "no"],
  });
}
function toStringArray(value) {
  if (!Array.isArray(value)) {
    return undefined;
  }
  var strings = value
    .map(function (v) {
      return toStringOrEmpty(v);
    })
    .filter(Boolean);
  return strings.length ? strings : undefined;
}
