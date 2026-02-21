"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSendPolicy = normalizeSendPolicy;
exports.resolveSendPolicy = resolveSendPolicy;
var chat_type_js_1 = require("../channels/chat-type.js");
function normalizeSendPolicy(raw) {
  var value = raw === null || raw === void 0 ? void 0 : raw.trim().toLowerCase();
  if (value === "allow") {
    return "allow";
  }
  if (value === "deny") {
    return "deny";
  }
  return undefined;
}
function normalizeMatchValue(raw) {
  var value = raw === null || raw === void 0 ? void 0 : raw.trim().toLowerCase();
  return value ? value : undefined;
}
function deriveChannelFromKey(key) {
  if (!key) {
    return undefined;
  }
  var parts = key.split(":").filter(Boolean);
  if (parts.length >= 3 && (parts[1] === "group" || parts[1] === "channel")) {
    return normalizeMatchValue(parts[0]);
  }
  return undefined;
}
function deriveChatTypeFromKey(key) {
  if (!key) {
    return undefined;
  }
  if (key.includes(":group:")) {
    return "group";
  }
  if (key.includes(":channel:")) {
    return "channel";
  }
  return undefined;
}
function resolveSendPolicy(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
  var override = normalizeSendPolicy(
    (_a = params.entry) === null || _a === void 0 ? void 0 : _a.sendPolicy,
  );
  if (override) {
    return override;
  }
  var policy = (_b = params.cfg.session) === null || _b === void 0 ? void 0 : _b.sendPolicy;
  if (!policy) {
    return "allow";
  }
  var channel =
    (_g =
      (_e =
        (_c = normalizeMatchValue(params.channel)) !== null && _c !== void 0
          ? _c
          : normalizeMatchValue(
              (_d = params.entry) === null || _d === void 0 ? void 0 : _d.channel,
            )) !== null && _e !== void 0
        ? _e
        : normalizeMatchValue(
            (_f = params.entry) === null || _f === void 0 ? void 0 : _f.lastChannel,
          )) !== null && _g !== void 0
      ? _g
      : deriveChannelFromKey(params.sessionKey);
  var chatType =
    (_k = (0, chat_type_js_1.normalizeChatType)(
      (_h = params.chatType) !== null && _h !== void 0
        ? _h
        : (_j = params.entry) === null || _j === void 0
          ? void 0
          : _j.chatType,
    )) !== null && _k !== void 0
      ? _k
      : (0, chat_type_js_1.normalizeChatType)(deriveChatTypeFromKey(params.sessionKey));
  var sessionKey = (_l = params.sessionKey) !== null && _l !== void 0 ? _l : "";
  var allowedMatch = false;
  for (
    var _i = 0, _q = (_m = policy.rules) !== null && _m !== void 0 ? _m : [];
    _i < _q.length;
    _i++
  ) {
    var rule = _q[_i];
    if (!rule) {
      continue;
    }
    var action = (_o = normalizeSendPolicy(rule.action)) !== null && _o !== void 0 ? _o : "allow";
    var match = (_p = rule.match) !== null && _p !== void 0 ? _p : {};
    var matchChannel = normalizeMatchValue(match.channel);
    var matchChatType = (0, chat_type_js_1.normalizeChatType)(match.chatType);
    var matchPrefix = normalizeMatchValue(match.keyPrefix);
    if (matchChannel && matchChannel !== channel) {
      continue;
    }
    if (matchChatType && matchChatType !== chatType) {
      continue;
    }
    if (matchPrefix && !sessionKey.startsWith(matchPrefix)) {
      continue;
    }
    if (action === "deny") {
      return "deny";
    }
    allowedMatch = true;
  }
  if (allowedMatch) {
    return "allow";
  }
  var fallback = normalizeSendPolicy(policy.default);
  return fallback !== null && fallback !== void 0 ? fallback : "allow";
}
