"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveSessionDeliveryTarget = resolveSessionDeliveryTarget;
exports.resolveOutboundTarget = resolveOutboundTarget;
exports.resolveHeartbeatDeliveryTarget = resolveHeartbeatDeliveryTarget;
exports.resolveHeartbeatSenderContext = resolveHeartbeatSenderContext;
var index_js_1 = require("../../channels/plugins/index.js");
var command_format_js_1 = require("../../cli/command-format.js");
var delivery_context_js_1 = require("../../utils/delivery-context.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var target_errors_js_1 = require("./target-errors.js");
function resolveSessionDeliveryTarget(params) {
  var _a, _b;
  var context = (0, delivery_context_js_1.deliveryContextFromSession)(params.entry);
  var lastChannel =
    (context === null || context === void 0 ? void 0 : context.channel) &&
    (0, message_channel_js_1.isDeliverableMessageChannel)(context.channel)
      ? context.channel
      : undefined;
  var lastTo = context === null || context === void 0 ? void 0 : context.to;
  var lastAccountId = context === null || context === void 0 ? void 0 : context.accountId;
  var lastThreadId = context === null || context === void 0 ? void 0 : context.threadId;
  var rawRequested = (_a = params.requestedChannel) !== null && _a !== void 0 ? _a : "last";
  var requested =
    rawRequested === "last"
      ? "last"
      : (0, message_channel_js_1.normalizeMessageChannel)(rawRequested);
  var requestedChannel =
    requested === "last"
      ? "last"
      : requested && (0, message_channel_js_1.isDeliverableMessageChannel)(requested)
        ? requested
        : undefined;
  var explicitTo =
    typeof params.explicitTo === "string" && params.explicitTo.trim()
      ? params.explicitTo.trim()
      : undefined;
  var explicitThreadId =
    params.explicitThreadId != null && params.explicitThreadId !== ""
      ? params.explicitThreadId
      : undefined;
  var channel = requestedChannel === "last" ? lastChannel : requestedChannel;
  if (
    !channel &&
    params.fallbackChannel &&
    (0, message_channel_js_1.isDeliverableMessageChannel)(params.fallbackChannel)
  ) {
    channel = params.fallbackChannel;
  }
  var to = explicitTo;
  if (!to && lastTo) {
    if (channel && channel === lastChannel) {
      to = lastTo;
    } else if (params.allowMismatchedLastTo) {
      to = lastTo;
    }
  }
  var accountId = channel && channel === lastChannel ? lastAccountId : undefined;
  var threadId = channel && channel === lastChannel ? lastThreadId : undefined;
  var mode =
    (_b = params.mode) !== null && _b !== void 0 ? _b : explicitTo ? "explicit" : "implicit";
  return {
    channel: channel,
    to: to,
    accountId: accountId,
    threadId:
      explicitThreadId !== null && explicitThreadId !== void 0 ? explicitThreadId : threadId,
    mode: mode,
    lastChannel: lastChannel,
    lastTo: lastTo,
    lastAccountId: lastAccountId,
    lastThreadId: lastThreadId,
  };
}
// Channel docking: prefer plugin.outbound.resolveTarget + allowFrom to normalize destinations.
function resolveOutboundTarget(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j;
  if (params.channel === message_channel_js_1.INTERNAL_MESSAGE_CHANNEL) {
    return {
      ok: false,
      error: new Error(
        "Delivering to WebChat is not supported via `".concat(
          (0, command_format_js_1.formatCliCommand)("openclaw agent"),
          "`; use WhatsApp/Telegram or run with --deliver=false.",
        ),
      ),
    };
  }
  var plugin = (0, index_js_1.getChannelPlugin)(params.channel);
  if (!plugin) {
    return {
      ok: false,
      error: new Error("Unsupported channel: ".concat(params.channel)),
    };
  }
  var allowFrom =
    (_a = params.allowFrom) !== null && _a !== void 0
      ? _a
      : params.cfg && plugin.config.resolveAllowFrom
        ? plugin.config.resolveAllowFrom({
            cfg: params.cfg,
            accountId: (_b = params.accountId) !== null && _b !== void 0 ? _b : undefined,
          })
        : undefined;
  var resolveTarget = (_c = plugin.outbound) === null || _c === void 0 ? void 0 : _c.resolveTarget;
  if (resolveTarget) {
    return resolveTarget({
      cfg: params.cfg,
      to: params.to,
      allowFrom: allowFrom,
      accountId: (_d = params.accountId) !== null && _d !== void 0 ? _d : undefined,
      mode: (_e = params.mode) !== null && _e !== void 0 ? _e : "explicit",
    });
  }
  var trimmed = (_f = params.to) === null || _f === void 0 ? void 0 : _f.trim();
  if (trimmed) {
    return { ok: true, to: trimmed };
  }
  var hint =
    (_h = (_g = plugin.messaging) === null || _g === void 0 ? void 0 : _g.targetResolver) ===
      null || _h === void 0
      ? void 0
      : _h.hint;
  return {
    ok: false,
    error: (0, target_errors_js_1.missingTargetError)(
      (_j = plugin.meta.label) !== null && _j !== void 0 ? _j : params.channel,
      hint,
    ),
  };
}
function resolveHeartbeatDeliveryTarget(params) {
  var _a, _b, _c;
  var cfg = params.cfg,
    entry = params.entry;
  var heartbeat =
    (_a = params.heartbeat) !== null && _a !== void 0
      ? _a
      : (_c = (_b = cfg.agents) === null || _b === void 0 ? void 0 : _b.defaults) === null ||
          _c === void 0
        ? void 0
        : _c.heartbeat;
  var rawTarget = heartbeat === null || heartbeat === void 0 ? void 0 : heartbeat.target;
  var target = "last";
  if (rawTarget === "none" || rawTarget === "last") {
    target = rawTarget;
  } else if (typeof rawTarget === "string") {
    var normalized = (0, index_js_1.normalizeChannelId)(rawTarget);
    if (normalized) {
      target = normalized;
    }
  }
  if (target === "none") {
    var base = resolveSessionDeliveryTarget({ entry: entry });
    return {
      channel: "none",
      reason: "target-none",
      accountId: undefined,
      lastChannel: base.lastChannel,
      lastAccountId: base.lastAccountId,
    };
  }
  var resolvedTarget = resolveSessionDeliveryTarget({
    entry: entry,
    requestedChannel: target === "last" ? "last" : target,
    explicitTo: heartbeat === null || heartbeat === void 0 ? void 0 : heartbeat.to,
    mode: "heartbeat",
  });
  if (!resolvedTarget.channel || !resolvedTarget.to) {
    return {
      channel: "none",
      reason: "no-target",
      accountId: resolvedTarget.accountId,
      lastChannel: resolvedTarget.lastChannel,
      lastAccountId: resolvedTarget.lastAccountId,
    };
  }
  var resolved = resolveOutboundTarget({
    channel: resolvedTarget.channel,
    to: resolvedTarget.to,
    cfg: cfg,
    accountId: resolvedTarget.accountId,
    mode: "heartbeat",
  });
  if (!resolved.ok) {
    return {
      channel: "none",
      reason: "no-target",
      accountId: resolvedTarget.accountId,
      lastChannel: resolvedTarget.lastChannel,
      lastAccountId: resolvedTarget.lastAccountId,
    };
  }
  var reason;
  var plugin = (0, index_js_1.getChannelPlugin)(resolvedTarget.channel);
  if (plugin === null || plugin === void 0 ? void 0 : plugin.config.resolveAllowFrom) {
    var explicit = resolveOutboundTarget({
      channel: resolvedTarget.channel,
      to: resolvedTarget.to,
      cfg: cfg,
      accountId: resolvedTarget.accountId,
      mode: "explicit",
    });
    if (explicit.ok && explicit.to !== resolved.to) {
      reason = "allowFrom-fallback";
    }
  }
  return {
    channel: resolvedTarget.channel,
    to: resolved.to,
    reason: reason,
    accountId: resolvedTarget.accountId,
    lastChannel: resolvedTarget.lastChannel,
    lastAccountId: resolvedTarget.lastAccountId,
  };
}
function resolveHeartbeatSenderId(params) {
  var _a, _b;
  var allowFrom = params.allowFrom,
    deliveryTo = params.deliveryTo,
    lastTo = params.lastTo,
    provider = params.provider;
  var candidates = [
    deliveryTo === null || deliveryTo === void 0 ? void 0 : deliveryTo.trim(),
    provider && deliveryTo ? "".concat(provider, ":").concat(deliveryTo) : undefined,
    lastTo === null || lastTo === void 0 ? void 0 : lastTo.trim(),
    provider && lastTo ? "".concat(provider, ":").concat(lastTo) : undefined,
  ].filter(function (val) {
    return Boolean(val === null || val === void 0 ? void 0 : val.trim());
  });
  var allowList = allowFrom
    .map(function (entry) {
      return String(entry);
    })
    .filter(function (entry) {
      return entry && entry !== "*";
    });
  if (allowFrom.includes("*")) {
    return (_a = candidates[0]) !== null && _a !== void 0 ? _a : "heartbeat";
  }
  if (candidates.length > 0 && allowList.length > 0) {
    var matched = candidates.find(function (candidate) {
      return allowList.includes(candidate);
    });
    if (matched) {
      return matched;
    }
  }
  if (candidates.length > 0 && allowList.length === 0) {
    return candidates[0];
  }
  if (allowList.length > 0) {
    return allowList[0];
  }
  return (_b = candidates[0]) !== null && _b !== void 0 ? _b : "heartbeat";
}
function resolveHeartbeatSenderContext(params) {
  var _a, _b, _c, _d, _e;
  var provider =
    params.delivery.channel !== "none" ? params.delivery.channel : params.delivery.lastChannel;
  var allowFrom = provider
    ? (_d =
        (_c =
          (_a = (0, index_js_1.getChannelPlugin)(provider)) === null || _a === void 0
            ? void 0
            : (_b = _a.config).resolveAllowFrom) === null || _c === void 0
          ? void 0
          : _c.call(_b, {
              cfg: params.cfg,
              accountId:
                provider === params.delivery.lastChannel
                  ? params.delivery.lastAccountId
                  : undefined,
            })) !== null && _d !== void 0
      ? _d
      : []
    : [];
  var sender = resolveHeartbeatSenderId({
    allowFrom: allowFrom,
    deliveryTo: params.delivery.to,
    lastTo: (_e = params.entry) === null || _e === void 0 ? void 0 : _e.lastTo,
    provider: provider,
  });
  return { sender: sender, provider: provider, allowFrom: allowFrom };
}
