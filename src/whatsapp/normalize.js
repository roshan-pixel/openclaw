"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isWhatsAppGroupJid = isWhatsAppGroupJid;
exports.isWhatsAppUserTarget = isWhatsAppUserTarget;
exports.normalizeWhatsAppTarget = normalizeWhatsAppTarget;
var utils_js_1 = require("../utils.js");
var WHATSAPP_USER_JID_RE = /^(\d+)(?::\d+)?@s\.whatsapp\.net$/i;
var WHATSAPP_LID_RE = /^(\d+)@lid$/i;
function stripWhatsAppTargetPrefixes(value) {
  var candidate = value.trim();
  for (;;) {
    var before = candidate;
    candidate = candidate.replace(/^whatsapp:/i, "").trim();
    if (candidate === before) {
      return candidate;
    }
  }
}
function isWhatsAppGroupJid(value) {
  var candidate = stripWhatsAppTargetPrefixes(value);
  var lower = candidate.toLowerCase();
  if (!lower.endsWith("@g.us")) {
    return false;
  }
  var localPart = candidate.slice(0, candidate.length - "@g.us".length);
  if (!localPart || localPart.includes("@")) {
    return false;
  }
  return /^[0-9]+(-[0-9]+)*$/.test(localPart);
}
/**
 * Check if value looks like a WhatsApp user target (e.g. "41796666864:0@s.whatsapp.net" or "123@lid").
 */
function isWhatsAppUserTarget(value) {
  var candidate = stripWhatsAppTargetPrefixes(value);
  return WHATSAPP_USER_JID_RE.test(candidate) || WHATSAPP_LID_RE.test(candidate);
}
/**
 * Extract the phone number from a WhatsApp user JID.
 * "41796666864:0@s.whatsapp.net" -> "41796666864"
 * "123456@lid" -> "123456"
 */
function extractUserJidPhone(jid) {
  var userMatch = jid.match(WHATSAPP_USER_JID_RE);
  if (userMatch) {
    return userMatch[1];
  }
  var lidMatch = jid.match(WHATSAPP_LID_RE);
  if (lidMatch) {
    return lidMatch[1];
  }
  return null;
}
function normalizeWhatsAppTarget(value) {
  var candidate = stripWhatsAppTargetPrefixes(value);
  if (!candidate) {
    return null;
  }
  if (isWhatsAppGroupJid(candidate)) {
    var localPart = candidate.slice(0, candidate.length - "@g.us".length);
    return "".concat(localPart, "@g.us");
  }
  // Handle user JIDs (e.g. "41796666864:0@s.whatsapp.net")
  if (isWhatsAppUserTarget(candidate)) {
    var phone = extractUserJidPhone(candidate);
    if (!phone) {
      return null;
    }
    var normalized_1 = (0, utils_js_1.normalizeE164)(phone);
    return normalized_1.length > 1 ? normalized_1 : null;
  }
  // If the caller passed a JID-ish string that we don't understand, fail fast.
  // Otherwise normalizeE164 would happily treat "group:120@g.us" as a phone number.
  if (candidate.includes("@")) {
    return null;
  }
  var normalized = (0, utils_js_1.normalizeE164)(candidate);
  return normalized.length > 1 ? normalized : null;
}
