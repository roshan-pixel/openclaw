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
exports.resolveReplyToMode = resolveReplyToMode;
exports.createReplyToModeFilter = createReplyToModeFilter;
exports.createReplyToModeFilterForChannel = createReplyToModeFilterForChannel;
var dock_js_1 = require("../../channels/dock.js");
var index_js_1 = require("../../channels/plugins/index.js");
function resolveReplyToMode(cfg, channel, accountId, chatType) {
  var _a, _b, _c;
  var provider = (0, index_js_1.normalizeChannelId)(channel);
  if (!provider) {
    return "all";
  }
  var resolved =
    (_c =
      (_b =
        (_a = (0, dock_js_1.getChannelDock)(provider)) === null || _a === void 0
          ? void 0
          : _a.threading) === null || _b === void 0
        ? void 0
        : _b.resolveReplyToMode) === null || _c === void 0
      ? void 0
      : _c.call(_b, {
          cfg: cfg,
          accountId: accountId,
          chatType: chatType,
        });
  return resolved !== null && resolved !== void 0 ? resolved : "all";
}
function createReplyToModeFilter(mode, opts) {
  if (opts === void 0) {
    opts = {};
  }
  var hasThreaded = false;
  return function (payload) {
    if (!payload.replyToId) {
      return payload;
    }
    if (mode === "off") {
      if (opts.allowTagsWhenOff && payload.replyToTag) {
        return payload;
      }
      return __assign(__assign({}, payload), { replyToId: undefined });
    }
    if (mode === "all") {
      return payload;
    }
    if (hasThreaded) {
      return __assign(__assign({}, payload), { replyToId: undefined });
    }
    hasThreaded = true;
    return payload;
  };
}
function createReplyToModeFilterForChannel(mode, channel) {
  var _a, _b;
  var provider = (0, index_js_1.normalizeChannelId)(channel);
  var allowTagsWhenOff = provider
    ? Boolean(
        (_b =
          (_a = (0, dock_js_1.getChannelDock)(provider)) === null || _a === void 0
            ? void 0
            : _a.threading) === null || _b === void 0
          ? void 0
          : _b.allowTagsWhenOff,
      )
    : false;
  return createReplyToModeFilter(mode, {
    allowTagsWhenOff: allowTagsWhenOff,
  });
}
