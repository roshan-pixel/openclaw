"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.applyGroupGating = applyGroupGating;
var command_detection_js_1 = require("../../../auto-reply/command-detection.js");
var group_activation_js_1 = require("../../../auto-reply/group-activation.js");
var utils_js_1 = require("../../../utils.js");
var mention_gating_js_1 = require("../../../channels/mention-gating.js");
var mentions_js_1 = require("../mentions.js");
var history_js_1 = require("../../../auto-reply/reply/history.js");
var commands_js_1 = require("./commands.js");
var group_activation_js_2 = require("./group-activation.js");
var group_members_js_1 = require("./group-members.js");
function isOwnerSender(baseMentionConfig, msg) {
  var _a, _b;
  var sender = (0, utils_js_1.normalizeE164)(
    (_a = msg.senderE164) !== null && _a !== void 0 ? _a : "",
  );
  if (!sender) {
    return false;
  }
  var owners = (0, mentions_js_1.resolveOwnerList)(
    baseMentionConfig,
    (_b = msg.selfE164) !== null && _b !== void 0 ? _b : undefined,
  );
  return owners.includes(sender);
}
function applyGroupGating(params) {
  var _a, _b, _c, _d, _e, _f;
  var groupPolicy = (0, group_activation_js_2.resolveGroupPolicyFor)(
    params.cfg,
    params.conversationId,
  );
  if (groupPolicy.allowlistEnabled && !groupPolicy.allowed) {
    params.logVerbose(
      "Skipping group message ".concat(params.conversationId, " (not in allowlist)"),
    );
    return { shouldProcess: false };
  }
  (0, group_members_js_1.noteGroupMember)(
    params.groupMemberNames,
    params.groupHistoryKey,
    params.msg.senderE164,
    params.msg.senderName,
  );
  var mentionConfig = (0, mentions_js_1.buildMentionConfig)(params.cfg, params.agentId);
  var commandBody = (0, commands_js_1.stripMentionsForCommand)(
    params.msg.body,
    mentionConfig.mentionRegexes,
    params.msg.selfE164,
  );
  var activationCommand = (0, group_activation_js_1.parseActivationCommand)(commandBody);
  var owner = isOwnerSender(params.baseMentionConfig, params.msg);
  var shouldBypassMention =
    owner && (0, command_detection_js_1.hasControlCommand)(commandBody, params.cfg);
  if (activationCommand.hasCommand && !owner) {
    params.logVerbose(
      "Ignoring /activation from non-owner in group ".concat(params.conversationId),
    );
    var sender =
      params.msg.senderName && params.msg.senderE164
        ? "".concat(params.msg.senderName, " (").concat(params.msg.senderE164, ")")
        : (_b =
              (_a = params.msg.senderName) !== null && _a !== void 0
                ? _a
                : params.msg.senderE164) !== null && _b !== void 0
          ? _b
          : "Unknown";
    (0, history_js_1.recordPendingHistoryEntryIfEnabled)({
      historyMap: params.groupHistories,
      historyKey: params.groupHistoryKey,
      limit: params.groupHistoryLimit,
      entry: {
        sender: sender,
        body: params.msg.body,
        timestamp: params.msg.timestamp,
        id: params.msg.id,
        senderJid: params.msg.senderJid,
      },
    });
    return { shouldProcess: false };
  }
  var mentionDebug = (0, mentions_js_1.debugMention)(params.msg, mentionConfig, params.authDir);
  params.replyLogger.debug(
    __assign(
      { conversationId: params.conversationId, wasMentioned: mentionDebug.wasMentioned },
      mentionDebug.details,
    ),
    "group mention debug",
  );
  var wasMentioned = mentionDebug.wasMentioned;
  var activation = (0, group_activation_js_2.resolveGroupActivationFor)({
    cfg: params.cfg,
    agentId: params.agentId,
    sessionKey: params.sessionKey,
    conversationId: params.conversationId,
  });
  var requireMention = activation !== "always";
  var selfJid =
    (_c = params.msg.selfJid) === null || _c === void 0 ? void 0 : _c.replace(/:\\d+/, "");
  var replySenderJid =
    (_d = params.msg.replyToSenderJid) === null || _d === void 0 ? void 0 : _d.replace(/:\\d+/, "");
  var selfE164 = params.msg.selfE164 ? (0, utils_js_1.normalizeE164)(params.msg.selfE164) : null;
  var replySenderE164 = params.msg.replyToSenderE164
    ? (0, utils_js_1.normalizeE164)(params.msg.replyToSenderE164)
    : null;
  var implicitMention = Boolean(
    (selfJid && replySenderJid && selfJid === replySenderJid) ||
    (selfE164 && replySenderE164 && selfE164 === replySenderE164),
  );
  var mentionGate = (0, mention_gating_js_1.resolveMentionGating)({
    requireMention: requireMention,
    canDetectMention: true,
    wasMentioned: wasMentioned,
    implicitMention: implicitMention,
    shouldBypassMention: shouldBypassMention,
  });
  params.msg.wasMentioned = mentionGate.effectiveWasMentioned;
  if (!shouldBypassMention && requireMention && mentionGate.shouldSkip) {
    params.logVerbose(
      "Group message stored for context (no mention detected) in "
        .concat(params.conversationId, ": ")
        .concat(params.msg.body),
    );
    var sender =
      params.msg.senderName && params.msg.senderE164
        ? "".concat(params.msg.senderName, " (").concat(params.msg.senderE164, ")")
        : (_f =
              (_e = params.msg.senderName) !== null && _e !== void 0
                ? _e
                : params.msg.senderE164) !== null && _f !== void 0
          ? _f
          : "Unknown";
    (0, history_js_1.recordPendingHistoryEntryIfEnabled)({
      historyMap: params.groupHistories,
      historyKey: params.groupHistoryKey,
      limit: params.groupHistoryLimit,
      entry: {
        sender: sender,
        body: params.msg.body,
        timestamp: params.msg.timestamp,
        id: params.msg.id,
        senderJid: params.msg.senderJid,
      },
    });
    return { shouldProcess: false };
  }
  return { shouldProcess: true };
}
