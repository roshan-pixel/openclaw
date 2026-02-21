"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeMediaUnderstandingChatType = normalizeMediaUnderstandingChatType;
exports.resolveMediaUnderstandingScope = resolveMediaUnderstandingScope;
var chat_type_js_1 = require("../channels/chat-type.js");
function normalizeDecision(value) {
  var normalized = value === null || value === void 0 ? void 0 : value.trim().toLowerCase();
  if (normalized === "allow") {
    return "allow";
  }
  if (normalized === "deny") {
    return "deny";
  }
  return undefined;
}
function normalizeMatch(value) {
  var normalized = value === null || value === void 0 ? void 0 : value.trim().toLowerCase();
  return normalized || undefined;
}
function normalizeMediaUnderstandingChatType(raw) {
  return (0, chat_type_js_1.normalizeChatType)(raw !== null && raw !== void 0 ? raw : undefined);
}
function resolveMediaUnderstandingScope(params) {
  var _a, _b, _c, _d, _e;
  var scope = params.scope;
  if (!scope) {
    return "allow";
  }
  var channel = normalizeMatch(params.channel);
  var chatType = normalizeMediaUnderstandingChatType(params.chatType);
  var sessionKey = (_a = normalizeMatch(params.sessionKey)) !== null && _a !== void 0 ? _a : "";
  for (
    var _i = 0, _f = (_b = scope.rules) !== null && _b !== void 0 ? _b : [];
    _i < _f.length;
    _i++
  ) {
    var rule = _f[_i];
    if (!rule) {
      continue;
    }
    var action = (_c = normalizeDecision(rule.action)) !== null && _c !== void 0 ? _c : "allow";
    var match = (_d = rule.match) !== null && _d !== void 0 ? _d : {};
    var matchChannel = normalizeMatch(match.channel);
    var matchChatType = normalizeMediaUnderstandingChatType(match.chatType);
    var matchPrefix = normalizeMatch(match.keyPrefix);
    if (matchChannel && matchChannel !== channel) {
      continue;
    }
    if (matchChatType && matchChatType !== chatType) {
      continue;
    }
    if (matchPrefix && !sessionKey.startsWith(matchPrefix)) {
      continue;
    }
    return action;
  }
  return (_e = normalizeDecision(scope.default)) !== null && _e !== void 0 ? _e : "allow";
}
