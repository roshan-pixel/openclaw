"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveGroupPolicyFor = resolveGroupPolicyFor;
exports.resolveGroupRequireMentionFor = resolveGroupRequireMentionFor;
exports.resolveGroupActivationFor = resolveGroupActivationFor;
var group_activation_js_1 = require("../../../auto-reply/group-activation.js");
var group_policy_js_1 = require("../../../config/group-policy.js");
var sessions_js_1 = require("../../../config/sessions.js");
function resolveGroupPolicyFor(cfg, conversationId) {
  var _a;
  var groupId =
    (_a = (0, sessions_js_1.resolveGroupSessionKey)({
      From: conversationId,
      ChatType: "group",
      Provider: "whatsapp",
    })) === null || _a === void 0
      ? void 0
      : _a.id;
  return (0, group_policy_js_1.resolveChannelGroupPolicy)({
    cfg: cfg,
    channel: "whatsapp",
    groupId: groupId !== null && groupId !== void 0 ? groupId : conversationId,
  });
}
function resolveGroupRequireMentionFor(cfg, conversationId) {
  var _a;
  var groupId =
    (_a = (0, sessions_js_1.resolveGroupSessionKey)({
      From: conversationId,
      ChatType: "group",
      Provider: "whatsapp",
    })) === null || _a === void 0
      ? void 0
      : _a.id;
  return (0, group_policy_js_1.resolveChannelGroupRequireMention)({
    cfg: cfg,
    channel: "whatsapp",
    groupId: groupId !== null && groupId !== void 0 ? groupId : conversationId,
  });
}
function resolveGroupActivationFor(params) {
  var _a, _b;
  var storePath = (0, sessions_js_1.resolveStorePath)(
    (_a = params.cfg.session) === null || _a === void 0 ? void 0 : _a.store,
    {
      agentId: params.agentId,
    },
  );
  var store = (0, sessions_js_1.loadSessionStore)(storePath);
  var entry = store[params.sessionKey];
  var requireMention = resolveGroupRequireMentionFor(params.cfg, params.conversationId);
  var defaultActivation = !requireMention ? "always" : "mention";
  return (_b = (0, group_activation_js_1.normalizeGroupActivation)(
    entry === null || entry === void 0 ? void 0 : entry.groupActivation,
  )) !== null && _b !== void 0
    ? _b
    : defaultActivation;
}
