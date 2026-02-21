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
exports.buildReplyPayloads = buildReplyPayloads;
var globals_js_1 = require("../../globals.js");
var heartbeat_js_1 = require("../heartbeat.js");
var tokens_js_1 = require("../tokens.js");
var agent_runner_utils_js_1 = require("./agent-runner-utils.js");
var block_reply_pipeline_js_1 = require("./block-reply-pipeline.js");
var reply_directives_js_1 = require("./reply-directives.js");
var reply_payloads_js_1 = require("./reply-payloads.js");
function buildReplyPayloads(params) {
  var _a, _b, _c, _d, _e;
  var didLogHeartbeatStrip = params.didLogHeartbeatStrip;
  var sanitizedPayloads = params.isHeartbeat
    ? params.payloads
    : params.payloads.flatMap(function (payload) {
        var _a, _b;
        var text = payload.text;
        if (payload.isError && text && (0, agent_runner_utils_js_1.isBunFetchSocketError)(text)) {
          text = (0, agent_runner_utils_js_1.formatBunFetchSocketError)(text);
        }
        if (!text || !text.includes("HEARTBEAT_OK")) {
          return [__assign(__assign({}, payload), { text: text })];
        }
        var stripped = (0, heartbeat_js_1.stripHeartbeatToken)(text, { mode: "message" });
        if (stripped.didStrip && !didLogHeartbeatStrip) {
          didLogHeartbeatStrip = true;
          (0, globals_js_1.logVerbose)("Stripped stray HEARTBEAT_OK token from reply");
        }
        var hasMedia =
          Boolean(payload.mediaUrl) ||
          ((_b = (_a = payload.mediaUrls) === null || _a === void 0 ? void 0 : _a.length) !==
            null && _b !== void 0
            ? _b
            : 0) > 0;
        if (stripped.shouldSkip && !hasMedia) {
          return [];
        }
        return [__assign(__assign({}, payload), { text: stripped.text })];
      });
  var replyTaggedPayloads = (0, reply_payloads_js_1.applyReplyThreading)({
    payloads: sanitizedPayloads,
    replyToMode: params.replyToMode,
    replyToChannel: params.replyToChannel,
    currentMessageId: params.currentMessageId,
  })
    .map(function (payload) {
      var _a, _b, _c, _d, _e;
      var parsed = (0, reply_directives_js_1.parseReplyDirectives)(
        (_a = payload.text) !== null && _a !== void 0 ? _a : "",
        {
          currentMessageId: params.currentMessageId,
          silentToken: tokens_js_1.SILENT_REPLY_TOKEN,
        },
      );
      var mediaUrls = (_b = payload.mediaUrls) !== null && _b !== void 0 ? _b : parsed.mediaUrls;
      var mediaUrl =
        (_d = (_c = payload.mediaUrl) !== null && _c !== void 0 ? _c : parsed.mediaUrl) !== null &&
        _d !== void 0
          ? _d
          : mediaUrls === null || mediaUrls === void 0
            ? void 0
            : mediaUrls[0];
      return __assign(__assign({}, payload), {
        text: parsed.text ? parsed.text : undefined,
        mediaUrls: mediaUrls,
        mediaUrl: mediaUrl,
        replyToId: (_e = payload.replyToId) !== null && _e !== void 0 ? _e : parsed.replyToId,
        replyToTag: payload.replyToTag || parsed.replyToTag,
        replyToCurrent: payload.replyToCurrent || parsed.replyToCurrent,
        audioAsVoice: Boolean(payload.audioAsVoice || parsed.audioAsVoice),
      });
    })
    .filter(reply_payloads_js_1.isRenderablePayload);
  // Drop final payloads only when block streaming succeeded end-to-end.
  // If streaming aborted (e.g., timeout), fall back to final payloads.
  var shouldDropFinalPayloads =
    params.blockStreamingEnabled &&
    Boolean((_a = params.blockReplyPipeline) === null || _a === void 0 ? void 0 : _a.didStream()) &&
    !((_b = params.blockReplyPipeline) === null || _b === void 0 ? void 0 : _b.isAborted());
  var messagingToolSentTexts =
    (_c = params.messagingToolSentTexts) !== null && _c !== void 0 ? _c : [];
  var messagingToolSentTargets =
    (_d = params.messagingToolSentTargets) !== null && _d !== void 0 ? _d : [];
  var suppressMessagingToolReplies = (0, reply_payloads_js_1.shouldSuppressMessagingToolReplies)({
    messageProvider: params.messageProvider,
    messagingToolSentTargets: messagingToolSentTargets,
    originatingTo: params.originatingTo,
    accountId: params.accountId,
  });
  var dedupedPayloads = (0, reply_payloads_js_1.filterMessagingToolDuplicates)({
    payloads: replyTaggedPayloads,
    sentTexts: messagingToolSentTexts,
  });
  // Filter out payloads already sent via pipeline or directly during tool flush.
  var filteredPayloads = shouldDropFinalPayloads
    ? []
    : params.blockStreamingEnabled
      ? dedupedPayloads.filter(function (payload) {
          var _a;
          return !((_a = params.blockReplyPipeline) === null || _a === void 0
            ? void 0
            : _a.hasSentPayload(payload));
        })
      : ((_e = params.directlySentBlockKeys) === null || _e === void 0 ? void 0 : _e.size)
        ? dedupedPayloads.filter(function (payload) {
            return !params.directlySentBlockKeys.has(
              (0, block_reply_pipeline_js_1.createBlockReplyPayloadKey)(payload),
            );
          })
        : dedupedPayloads;
  var replyPayloads = suppressMessagingToolReplies ? [] : filteredPayloads;
  return {
    replyPayloads: replyPayloads,
    didLogHeartbeatStrip: didLogHeartbeatStrip,
  };
}
