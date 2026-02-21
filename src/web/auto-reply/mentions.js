"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildMentionConfig = buildMentionConfig;
exports.resolveMentionTargets = resolveMentionTargets;
exports.isBotMentionedFromTargets = isBotMentionedFromTargets;
exports.debugMention = debugMention;
exports.resolveOwnerList = resolveOwnerList;
var mentions_js_1 = require("../../auto-reply/reply/mentions.js");
var utils_js_1 = require("../../utils.js");
function buildMentionConfig(cfg, agentId) {
  var _a, _b;
  var mentionRegexes = (0, mentions_js_1.buildMentionRegexes)(cfg, agentId);
  return {
    mentionRegexes: mentionRegexes,
    allowFrom:
      (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null ||
      _b === void 0
        ? void 0
        : _b.allowFrom,
  };
}
function resolveMentionTargets(msg, authDir) {
  var _a, _b;
  var jidOptions = authDir ? { authDir: authDir } : undefined;
  var normalizedMentions = ((_a = msg.mentionedJids) === null || _a === void 0 ? void 0 : _a.length)
    ? msg.mentionedJids
        .map(function (jid) {
          var _a;
          return (_a = (0, utils_js_1.jidToE164)(jid, jidOptions)) !== null && _a !== void 0
            ? _a
            : jid;
        })
        .filter(Boolean)
    : [];
  var selfE164 =
    (_b = msg.selfE164) !== null && _b !== void 0
      ? _b
      : msg.selfJid
        ? (0, utils_js_1.jidToE164)(msg.selfJid, jidOptions)
        : null;
  var selfJid = msg.selfJid ? msg.selfJid.replace(/:\\d+/, "") : null;
  return { normalizedMentions: normalizedMentions, selfE164: selfE164, selfJid: selfJid };
}
function isBotMentionedFromTargets(msg, mentionCfg, targets) {
  var _a, _b;
  var clean = function (text) {
    // Remove zero-width and directionality markers WhatsApp injects around display names
    return (0, mentions_js_1.normalizeMentionText)(text);
  };
  var isSelfChat = (0, utils_js_1.isSelfChatMode)(targets.selfE164, mentionCfg.allowFrom);
  var hasMentions =
    ((_b = (_a = msg.mentionedJids) === null || _a === void 0 ? void 0 : _a.length) !== null &&
    _b !== void 0
      ? _b
      : 0) > 0;
  if (hasMentions && !isSelfChat) {
    if (targets.selfE164 && targets.normalizedMentions.includes(targets.selfE164)) {
      return true;
    }
    if (targets.selfJid) {
      // Some mentions use the bare JID; match on E.164 to be safe.
      if (targets.normalizedMentions.includes(targets.selfJid)) {
        return true;
      }
    }
    // If the message explicitly mentions someone else, do not fall back to regex matches.
    return false;
  } else if (hasMentions && isSelfChat) {
    // Self-chat mode: ignore WhatsApp @mention JIDs, otherwise @mentioning the owner in group chats triggers the bot.
  }
  var bodyClean = clean(msg.body);
  if (
    mentionCfg.mentionRegexes.some(function (re) {
      return re.test(bodyClean);
    })
  ) {
    return true;
  }
  // Fallback: detect body containing our own number (with or without +, spacing)
  if (targets.selfE164) {
    var selfDigits = targets.selfE164.replace(/\D/g, "");
    if (selfDigits) {
      var bodyDigits = bodyClean.replace(/[^\d]/g, "");
      if (bodyDigits.includes(selfDigits)) {
        return true;
      }
      var bodyNoSpace = msg.body.replace(/[\s-]/g, "");
      var pattern = new RegExp("\\+?".concat(selfDigits), "i");
      if (pattern.test(bodyNoSpace)) {
        return true;
      }
    }
  }
  return false;
}
function debugMention(msg, mentionCfg, authDir) {
  var _a, _b, _c;
  var mentionTargets = resolveMentionTargets(msg, authDir);
  var result = isBotMentionedFromTargets(msg, mentionCfg, mentionTargets);
  var details = {
    from: msg.from,
    body: msg.body,
    bodyClean: (0, mentions_js_1.normalizeMentionText)(msg.body),
    mentionedJids: (_a = msg.mentionedJids) !== null && _a !== void 0 ? _a : null,
    normalizedMentionedJids: mentionTargets.normalizedMentions.length
      ? mentionTargets.normalizedMentions
      : null,
    selfJid: (_b = msg.selfJid) !== null && _b !== void 0 ? _b : null,
    selfJidBare: mentionTargets.selfJid,
    selfE164: (_c = msg.selfE164) !== null && _c !== void 0 ? _c : null,
    resolvedSelfE164: mentionTargets.selfE164,
  };
  return { wasMentioned: result, details: details };
}
function resolveOwnerList(mentionCfg, selfE164) {
  var allowFrom = mentionCfg.allowFrom;
  var raw =
    Array.isArray(allowFrom) && allowFrom.length > 0 ? allowFrom : selfE164 ? [selfE164] : [];
  return raw
    .filter(function (entry) {
      return Boolean(entry && entry !== "*");
    })
    .map(function (entry) {
      return (0, utils_js_1.normalizeE164)(entry);
    })
    .filter(function (entry) {
      return Boolean(entry);
    });
}
