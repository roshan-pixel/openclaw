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
exports.normalizeReplyPayload = normalizeReplyPayload;
var heartbeat_js_1 = require("../heartbeat.js");
var tokens_js_1 = require("../tokens.js");
var pi_embedded_helpers_js_1 = require("../../agents/pi-embedded-helpers.js");
var response_prefix_template_js_1 = require("./response-prefix-template.js");
var line_directives_js_1 = require("./line-directives.js");
function normalizeReplyPayload(payload, opts) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
  if (opts === void 0) {
    opts = {};
  }
  var hasMedia = Boolean(
    payload.mediaUrl ||
    ((_b = (_a = payload.mediaUrls) === null || _a === void 0 ? void 0 : _a.length) !== null &&
    _b !== void 0
      ? _b
      : 0) > 0,
  );
  var hasChannelData = Boolean(payload.channelData && Object.keys(payload.channelData).length > 0);
  var trimmed =
    (_d = (_c = payload.text) === null || _c === void 0 ? void 0 : _c.trim()) !== null &&
    _d !== void 0
      ? _d
      : "";
  if (!trimmed && !hasMedia && !hasChannelData) {
    (_e = opts.onSkip) === null || _e === void 0 ? void 0 : _e.call(opts, "empty");
    return null;
  }
  var silentToken =
    (_f = opts.silentToken) !== null && _f !== void 0 ? _f : tokens_js_1.SILENT_REPLY_TOKEN;
  var text = (_g = payload.text) !== null && _g !== void 0 ? _g : undefined;
  if (text && (0, tokens_js_1.isSilentReplyText)(text, silentToken)) {
    if (!hasMedia && !hasChannelData) {
      (_h = opts.onSkip) === null || _h === void 0 ? void 0 : _h.call(opts, "silent");
      return null;
    }
    text = "";
  }
  if (text && !trimmed) {
    // Keep empty text when media exists so media-only replies still send.
    text = "";
  }
  var shouldStripHeartbeat = (_j = opts.stripHeartbeat) !== null && _j !== void 0 ? _j : true;
  if (
    shouldStripHeartbeat &&
    (text === null || text === void 0 ? void 0 : text.includes(tokens_js_1.HEARTBEAT_TOKEN))
  ) {
    var stripped = (0, heartbeat_js_1.stripHeartbeatToken)(text, { mode: "message" });
    if (stripped.didStrip) {
      (_k = opts.onHeartbeatStrip) === null || _k === void 0 ? void 0 : _k.call(opts);
    }
    if (stripped.shouldSkip && !hasMedia && !hasChannelData) {
      (_l = opts.onSkip) === null || _l === void 0 ? void 0 : _l.call(opts, "heartbeat");
      return null;
    }
    text = stripped.text;
  }
  if (text) {
    text = (0, pi_embedded_helpers_js_1.sanitizeUserFacingText)(text);
  }
  if (!(text === null || text === void 0 ? void 0 : text.trim()) && !hasMedia && !hasChannelData) {
    (_m = opts.onSkip) === null || _m === void 0 ? void 0 : _m.call(opts, "empty");
    return null;
  }
  // Parse LINE-specific directives from text (quick_replies, location, confirm, buttons)
  var enrichedPayload = __assign(__assign({}, payload), { text: text });
  if (text && (0, line_directives_js_1.hasLineDirectives)(text)) {
    enrichedPayload = (0, line_directives_js_1.parseLineDirectives)(enrichedPayload);
    text = enrichedPayload.text;
  }
  // Resolve template variables in responsePrefix if context is provided
  var effectivePrefix = opts.responsePrefixContext
    ? (0, response_prefix_template_js_1.resolveResponsePrefixTemplate)(
        opts.responsePrefix,
        opts.responsePrefixContext,
      )
    : opts.responsePrefix;
  if (
    effectivePrefix &&
    text &&
    text.trim() !== tokens_js_1.HEARTBEAT_TOKEN &&
    !text.startsWith(effectivePrefix)
  ) {
    text = "".concat(effectivePrefix, " ").concat(text);
  }
  return __assign(__assign({}, enrichedPayload), { text: text });
}
