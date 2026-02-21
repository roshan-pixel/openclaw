"use strict";
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
exports.resolveWhatsAppHeartbeatRecipients = resolveWhatsAppHeartbeatRecipients;
var registry_js_1 = require("../../channels/registry.js");
var sessions_js_1 = require("../../config/sessions.js");
var utils_js_1 = require("../../utils.js");
function getSessionRecipients(cfg) {
  var _a, _b;
  var sessionCfg = cfg.session;
  var scope =
    (_a = sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.scope) !== null &&
    _a !== void 0
      ? _a
      : "per-sender";
  if (scope === "global") {
    return [];
  }
  var storePath = (0, sessions_js_1.resolveStorePath)(
    (_b = cfg.session) === null || _b === void 0 ? void 0 : _b.store,
  );
  var store = (0, sessions_js_1.loadSessionStore)(storePath);
  var isGroupKey = function (key) {
    return key.includes(":group:") || key.includes(":channel:") || key.includes("@g.us");
  };
  var isCronKey = function (key) {
    return key.startsWith("cron:");
  };
  var recipients = Object.entries(store)
    .filter(function (_a) {
      var key = _a[0];
      return key !== "global" && key !== "unknown";
    })
    .filter(function (_a) {
      var key = _a[0];
      return !isGroupKey(key) && !isCronKey(key);
    })
    .map(function (_a) {
      var _b;
      var _ = _a[0],
        entry = _a[1];
      return {
        to:
          (0, registry_js_1.normalizeChatChannelId)(
            entry === null || entry === void 0 ? void 0 : entry.lastChannel,
          ) === "whatsapp" && (entry === null || entry === void 0 ? void 0 : entry.lastTo)
            ? (0, utils_js_1.normalizeE164)(entry.lastTo)
            : "",
        updatedAt:
          (_b = entry === null || entry === void 0 ? void 0 : entry.updatedAt) !== null &&
          _b !== void 0
            ? _b
            : 0,
      };
    })
    .filter(function (_a) {
      var to = _a.to;
      return to.length > 1;
    })
    .toSorted(function (a, b) {
      return b.updatedAt - a.updatedAt;
    });
  // Dedupe while preserving recency ordering.
  var seen = new Set();
  return recipients.filter(function (r) {
    if (seen.has(r.to)) {
      return false;
    }
    seen.add(r.to);
    return true;
  });
}
function resolveWhatsAppHeartbeatRecipients(cfg, opts) {
  var _a, _b;
  if (opts === void 0) {
    opts = {};
  }
  if (opts.to) {
    return { recipients: [(0, utils_js_1.normalizeE164)(opts.to)], source: "flag" };
  }
  var sessionRecipients = getSessionRecipients(cfg);
  var allowFrom =
    Array.isArray(
      (_b = (_a = cfg.channels) === null || _a === void 0 ? void 0 : _a.whatsapp) === null ||
        _b === void 0
        ? void 0
        : _b.allowFrom,
    ) && cfg.channels.whatsapp.allowFrom.length > 0
      ? cfg.channels.whatsapp.allowFrom
          .filter(function (v) {
            return v !== "*";
          })
          .map(utils_js_1.normalizeE164)
      : [];
  var unique = function (list) {
    return __spreadArray([], new Set(list.filter(Boolean)), true);
  };
  if (opts.all) {
    var all = unique(
      __spreadArray(
        __spreadArray(
          [],
          sessionRecipients.map(function (s) {
            return s.to;
          }),
          true,
        ),
        allowFrom,
        true,
      ),
    );
    return { recipients: all, source: "all" };
  }
  if (sessionRecipients.length === 1) {
    return { recipients: [sessionRecipients[0].to], source: "session-single" };
  }
  if (sessionRecipients.length > 1) {
    return {
      recipients: sessionRecipients.map(function (s) {
        return s.to;
      }),
      source: "session-ambiguous",
    };
  }
  return { recipients: allowFrom, source: "allowFrom" };
}
