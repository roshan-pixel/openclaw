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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveEnforceFinalTag =
  exports.appendUsageLine =
  exports.formatResponseUsageLine =
  exports.formatBunFetchSocketError =
  exports.isBunFetchSocketError =
    void 0;
exports.buildThreadingToolContext = buildThreadingToolContext;
var dock_js_1 = require("../../channels/dock.js");
var registry_js_1 = require("../../channels/registry.js");
var provider_utils_js_1 = require("../../utils/provider-utils.js");
var usage_format_js_1 = require("../../utils/usage-format.js");
var BUN_FETCH_SOCKET_ERROR_RE = /socket connection was closed unexpectedly/i;
/**
 * Build provider-specific threading context for tool auto-injection.
 */
function buildThreadingToolContext(params) {
  var _a, _b, _c, _d, _e;
  var sessionCtx = params.sessionCtx,
    config = params.config,
    hasRepliedRef = params.hasRepliedRef;
  if (!config) {
    return {};
  }
  var rawProvider =
    (_a = sessionCtx.Provider) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
  if (!rawProvider) {
    return {};
  }
  var provider =
    (_b = (0, registry_js_1.normalizeChannelId)(rawProvider)) !== null && _b !== void 0
      ? _b
      : (0, registry_js_1.normalizeAnyChannelId)(rawProvider);
  // Fallback for unrecognized/plugin channels (e.g., BlueBubbles before plugin registry init)
  var dock = provider ? (0, dock_js_1.getChannelDock)(provider) : undefined;
  if (
    !((_c = dock === null || dock === void 0 ? void 0 : dock.threading) === null || _c === void 0
      ? void 0
      : _c.buildToolContext)
  ) {
    return {
      currentChannelId:
        ((_d = sessionCtx.To) === null || _d === void 0 ? void 0 : _d.trim()) || undefined,
      currentChannelProvider: provider !== null && provider !== void 0 ? provider : rawProvider,
      hasRepliedRef: hasRepliedRef,
    };
  }
  var context =
    (_e = dock.threading.buildToolContext({
      cfg: config,
      accountId: sessionCtx.AccountId,
      context: {
        Channel: sessionCtx.Provider,
        From: sessionCtx.From,
        To: sessionCtx.To,
        ChatType: sessionCtx.ChatType,
        ReplyToId: sessionCtx.ReplyToId,
        ThreadLabel: sessionCtx.ThreadLabel,
        MessageThreadId: sessionCtx.MessageThreadId,
      },
      hasRepliedRef: hasRepliedRef,
    })) !== null && _e !== void 0
      ? _e
      : {};
  return __assign(__assign({}, context), { currentChannelProvider: provider });
}
var isBunFetchSocketError = function (message) {
  return Boolean(message && BUN_FETCH_SOCKET_ERROR_RE.test(message));
};
exports.isBunFetchSocketError = isBunFetchSocketError;
var formatBunFetchSocketError = function (message) {
  var trimmed = message.trim();
  return [
    "⚠️ LLM connection failed. This could be due to server issues, network problems, or context length exceeded (e.g., with local LLMs like LM Studio). Original error:",
    "```",
    trimmed || "Unknown error",
    "```",
  ].join("\n");
};
exports.formatBunFetchSocketError = formatBunFetchSocketError;
var formatResponseUsageLine = function (params) {
  var usage = params.usage;
  if (!usage) {
    return null;
  }
  var input = usage.input;
  var output = usage.output;
  if (typeof input !== "number" && typeof output !== "number") {
    return null;
  }
  var inputLabel = typeof input === "number" ? (0, usage_format_js_1.formatTokenCount)(input) : "?";
  var outputLabel =
    typeof output === "number" ? (0, usage_format_js_1.formatTokenCount)(output) : "?";
  var cost =
    params.showCost && typeof input === "number" && typeof output === "number"
      ? (0, usage_format_js_1.estimateUsageCost)({
          usage: {
            input: input,
            output: output,
            cacheRead: usage.cacheRead,
            cacheWrite: usage.cacheWrite,
          },
          cost: params.costConfig,
        })
      : undefined;
  var costLabel = params.showCost ? (0, usage_format_js_1.formatUsd)(cost) : undefined;
  var suffix = costLabel ? " \u00B7 est ".concat(costLabel) : "";
  return "Usage: ".concat(inputLabel, " in / ").concat(outputLabel, " out").concat(suffix);
};
exports.formatResponseUsageLine = formatResponseUsageLine;
var appendUsageLine = function (payloads, line) {
  var _a, _b;
  var index = -1;
  for (var i = payloads.length - 1; i >= 0; i -= 1) {
    if ((_a = payloads[i]) === null || _a === void 0 ? void 0 : _a.text) {
      index = i;
      break;
    }
  }
  if (index === -1) {
    return __spreadArray(__spreadArray([], payloads, true), [{ text: line }], false);
  }
  var existing = payloads[index];
  var existingText = (_b = existing.text) !== null && _b !== void 0 ? _b : "";
  var separator = existingText.endsWith("\n") ? "" : "\n";
  var next = __assign(__assign({}, existing), {
    text: "".concat(existingText).concat(separator).concat(line),
  });
  var updated = payloads.slice();
  updated[index] = next;
  return updated;
};
exports.appendUsageLine = appendUsageLine;
var resolveEnforceFinalTag = function (run, provider) {
  return Boolean(run.enforceFinalTag || (0, provider_utils_js_1.isReasoningTagProvider)(provider));
};
exports.resolveEnforceFinalTag = resolveEnforceFinalTag;
