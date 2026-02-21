"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveQueueSettings = resolveQueueSettings;
var index_js_1 = require("../../../channels/plugins/index.js");
var normalize_js_1 = require("./normalize.js");
var state_js_1 = require("./state.js");
function defaultQueueModeForChannel(_channel) {
  return "collect";
}
/** Resolve per-channel debounce override from debounceMsByChannel map. */
function resolveChannelDebounce(byChannel, channelKey) {
  if (!channelKey || !byChannel) {
    return undefined;
  }
  var value = byChannel[channelKey];
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : undefined;
}
function resolvePluginDebounce(channelKey) {
  var _a, _b;
  if (!channelKey) {
    return undefined;
  }
  var plugin = (0, index_js_1.getChannelPlugin)(channelKey);
  var value =
    (_b =
      (_a = plugin === null || plugin === void 0 ? void 0 : plugin.defaults) === null ||
      _a === void 0
        ? void 0
        : _a.queue) === null || _b === void 0
      ? void 0
      : _b.debounceMs;
  return typeof value === "number" && Number.isFinite(value) ? Math.max(0, value) : undefined;
}
function resolveQueueSettings(params) {
  var _a,
    _b,
    _c,
    _d,
    _e,
    _f,
    _g,
    _h,
    _j,
    _k,
    _l,
    _m,
    _o,
    _p,
    _q,
    _r,
    _s,
    _t,
    _u,
    _v,
    _w,
    _x,
    _y,
    _z;
  var channelKey =
    (_a = params.channel) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
  var queueCfg = (_b = params.cfg.messages) === null || _b === void 0 ? void 0 : _b.queue;
  var providerModeRaw =
    channelKey && (queueCfg === null || queueCfg === void 0 ? void 0 : queueCfg.byChannel)
      ? queueCfg.byChannel[channelKey]
      : undefined;
  var resolvedMode =
    (_g =
      (_f =
        (_e =
          (_c = params.inlineMode) !== null && _c !== void 0
            ? _c
            : (0, normalize_js_1.normalizeQueueMode)(
                (_d = params.sessionEntry) === null || _d === void 0 ? void 0 : _d.queueMode,
              )) !== null && _e !== void 0
          ? _e
          : (0, normalize_js_1.normalizeQueueMode)(providerModeRaw)) !== null && _f !== void 0
        ? _f
        : (0, normalize_js_1.normalizeQueueMode)(
            queueCfg === null || queueCfg === void 0 ? void 0 : queueCfg.mode,
          )) !== null && _g !== void 0
      ? _g
      : defaultQueueModeForChannel(channelKey);
  var debounceRaw =
    (_p =
      (_o =
        (_m =
          (_l =
            (_j =
              (_h = params.inlineOptions) === null || _h === void 0 ? void 0 : _h.debounceMs) !==
              null && _j !== void 0
              ? _j
              : (_k = params.sessionEntry) === null || _k === void 0
                ? void 0
                : _k.queueDebounceMs) !== null && _l !== void 0
            ? _l
            : resolveChannelDebounce(
                queueCfg === null || queueCfg === void 0 ? void 0 : queueCfg.debounceMsByChannel,
                channelKey,
              )) !== null && _m !== void 0
          ? _m
          : resolvePluginDebounce(channelKey)) !== null && _o !== void 0
        ? _o
        : queueCfg === null || queueCfg === void 0
          ? void 0
          : queueCfg.debounceMs) !== null && _p !== void 0
      ? _p
      : state_js_1.DEFAULT_QUEUE_DEBOUNCE_MS;
  var capRaw =
    (_u =
      (_t =
        (_r = (_q = params.inlineOptions) === null || _q === void 0 ? void 0 : _q.cap) !== null &&
        _r !== void 0
          ? _r
          : (_s = params.sessionEntry) === null || _s === void 0
            ? void 0
            : _s.queueCap) !== null && _t !== void 0
        ? _t
        : queueCfg === null || queueCfg === void 0
          ? void 0
          : queueCfg.cap) !== null && _u !== void 0
      ? _u
      : state_js_1.DEFAULT_QUEUE_CAP;
  var dropRaw =
    (_z =
      (_y =
        (_w = (_v = params.inlineOptions) === null || _v === void 0 ? void 0 : _v.dropPolicy) !==
          null && _w !== void 0
          ? _w
          : (_x = params.sessionEntry) === null || _x === void 0
            ? void 0
            : _x.queueDrop) !== null && _y !== void 0
        ? _y
        : (0, normalize_js_1.normalizeQueueDropPolicy)(
            queueCfg === null || queueCfg === void 0 ? void 0 : queueCfg.drop,
          )) !== null && _z !== void 0
      ? _z
      : state_js_1.DEFAULT_QUEUE_DROP;
  return {
    mode: resolvedMode,
    debounceMs: typeof debounceRaw === "number" ? Math.max(0, debounceRaw) : undefined,
    cap: typeof capRaw === "number" ? Math.max(1, Math.floor(capRaw)) : undefined,
    dropPolicy: dropRaw,
  };
}
