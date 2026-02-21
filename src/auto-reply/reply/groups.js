"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveGroupRequireMention = resolveGroupRequireMention;
exports.defaultGroupActivation = defaultGroupActivation;
exports.buildGroupIntro = buildGroupIntro;
var dock_js_1 = require("../../channels/dock.js");
var index_js_1 = require("../../channels/plugins/index.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var group_activation_js_1 = require("../group-activation.js");
function extractGroupId(raw) {
  var _a;
  var trimmed = (raw !== null && raw !== void 0 ? raw : "").trim();
  if (!trimmed) {
    return undefined;
  }
  var parts = trimmed.split(":").filter(Boolean);
  if (parts.length >= 3 && (parts[1] === "group" || parts[1] === "channel")) {
    return parts.slice(2).join(":") || undefined;
  }
  if (
    parts.length >= 2 &&
    ((_a = parts[0]) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "whatsapp" &&
    trimmed.toLowerCase().includes("@g.us")
  ) {
    return parts.slice(1).join(":") || undefined;
  }
  if (parts.length >= 2 && (parts[0] === "group" || parts[0] === "channel")) {
    return parts.slice(1).join(":") || undefined;
  }
  return trimmed;
}
function resolveGroupRequireMention(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
  var cfg = params.cfg,
    ctx = params.ctx,
    groupResolution = params.groupResolution;
  var rawChannel =
    (_a =
      groupResolution === null || groupResolution === void 0 ? void 0 : groupResolution.channel) !==
      null && _a !== void 0
      ? _a
      : (_b = ctx.Provider) === null || _b === void 0
        ? void 0
        : _b.trim();
  var channel = (0, index_js_1.normalizeChannelId)(rawChannel);
  if (!channel) {
    return true;
  }
  var groupId =
    (_c = groupResolution === null || groupResolution === void 0 ? void 0 : groupResolution.id) !==
      null && _c !== void 0
      ? _c
      : extractGroupId(ctx.From);
  var groupChannel =
    (_e = (_d = ctx.GroupChannel) === null || _d === void 0 ? void 0 : _d.trim()) !== null &&
    _e !== void 0
      ? _e
      : (_f = ctx.GroupSubject) === null || _f === void 0
        ? void 0
        : _f.trim();
  var groupSpace = (_g = ctx.GroupSpace) === null || _g === void 0 ? void 0 : _g.trim();
  var requireMention =
    (_k =
      (_j =
        (_h = (0, dock_js_1.getChannelDock)(channel)) === null || _h === void 0
          ? void 0
          : _h.groups) === null || _j === void 0
        ? void 0
        : _j.resolveRequireMention) === null || _k === void 0
      ? void 0
      : _k.call(_j, {
          cfg: cfg,
          groupId: groupId,
          groupChannel: groupChannel,
          groupSpace: groupSpace,
          accountId: ctx.AccountId,
        });
  if (typeof requireMention === "boolean") {
    return requireMention;
  }
  return true;
}
function defaultGroupActivation(requireMention) {
  return requireMention === false ? "always" : "mention";
}
function buildGroupIntro(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
  var activation =
    (_b = (0, group_activation_js_1.normalizeGroupActivation)(
      (_a = params.sessionEntry) === null || _a === void 0 ? void 0 : _a.groupActivation,
    )) !== null && _b !== void 0
      ? _b
      : params.defaultActivation;
  var subject =
    (_c = params.sessionCtx.GroupSubject) === null || _c === void 0 ? void 0 : _c.trim();
  var members =
    (_d = params.sessionCtx.GroupMembers) === null || _d === void 0 ? void 0 : _d.trim();
  var rawProvider =
    (_e = params.sessionCtx.Provider) === null || _e === void 0 ? void 0 : _e.trim();
  var providerKey =
    (_f = rawProvider === null || rawProvider === void 0 ? void 0 : rawProvider.toLowerCase()) !==
      null && _f !== void 0
      ? _f
      : "";
  var providerId = (0, index_js_1.normalizeChannelId)(rawProvider);
  var providerLabel = (function () {
    var _a, _b, _c, _d;
    if (!providerKey) {
      return "chat";
    }
    if ((0, message_channel_js_1.isInternalMessageChannel)(providerKey)) {
      return "WebChat";
    }
    if (providerId) {
      return (_b =
        (_a = (0, index_js_1.getChannelPlugin)(providerId)) === null || _a === void 0
          ? void 0
          : _a.meta.label) !== null && _b !== void 0
        ? _b
        : providerId;
    }
    return ""
      .concat(
        (_d = (_c = providerKey.at(0)) === null || _c === void 0 ? void 0 : _c.toUpperCase()) !==
          null && _d !== void 0
          ? _d
          : "",
      )
      .concat(providerKey.slice(1));
  })();
  var subjectLine = subject
    ? "You are replying inside the ".concat(providerLabel, ' group "').concat(subject, '".')
    : "You are replying inside a ".concat(providerLabel, " group chat.");
  var membersLine = members ? "Group members: ".concat(members, ".") : undefined;
  var activationLine =
    activation === "always"
      ? "Activation: always-on (you receive every group message)."
      : "Activation: trigger-only (you are invoked only when explicitly mentioned; recent context may be included).";
  var groupId =
    (_h = (_g = params.sessionEntry) === null || _g === void 0 ? void 0 : _g.groupId) !== null &&
    _h !== void 0
      ? _h
      : extractGroupId(params.sessionCtx.From);
  var groupChannel =
    (_k = (_j = params.sessionCtx.GroupChannel) === null || _j === void 0 ? void 0 : _j.trim()) !==
      null && _k !== void 0
      ? _k
      : subject;
  var groupSpace =
    (_l = params.sessionCtx.GroupSpace) === null || _l === void 0 ? void 0 : _l.trim();
  var providerIdsLine = providerId
    ? (_p =
        (_o =
          (_m = (0, dock_js_1.getChannelDock)(providerId)) === null || _m === void 0
            ? void 0
            : _m.groups) === null || _o === void 0
          ? void 0
          : _o.resolveGroupIntroHint) === null || _p === void 0
      ? void 0
      : _p.call(_o, {
          cfg: params.cfg,
          groupId: groupId,
          groupChannel: groupChannel,
          groupSpace: groupSpace,
          accountId: params.sessionCtx.AccountId,
        })
    : undefined;
  var silenceLine =
    activation === "always"
      ? 'If no response is needed, reply with exactly "'.concat(
          params.silentToken,
          '" (and nothing else) so OpenClaw stays silent. Do not add any other words, punctuation, tags, markdown/code blocks, or explanations.',
        )
      : undefined;
  var cautionLine =
    activation === "always"
      ? "Be extremely selective: reply only when directly addressed or clearly helpful. Otherwise stay silent."
      : undefined;
  var lurkLine =
    "Be a good group participant: mostly lurk and follow the conversation; reply only when directly addressed or you can add clear value. Emoji reactions are welcome when available.";
  var styleLine =
    "Write like a human. Avoid Markdown tables. Don't type literal \\n sequences; use real line breaks sparingly.";
  return [
    subjectLine,
    membersLine,
    activationLine,
    providerIdsLine,
    silenceLine,
    cautionLine,
    lurkLine,
    styleLine,
  ]
    .filter(Boolean)
    .join(" ")
    .concat(" Address the specific sender noted in the message context.");
}
