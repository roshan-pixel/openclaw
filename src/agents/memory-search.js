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
exports.resolveMemorySearchConfig = resolveMemorySearchConfig;
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var utils_js_1 = require("../utils.js");
var agent_scope_js_1 = require("./agent-scope.js");
var DEFAULT_OPENAI_MODEL = "text-embedding-3-small";
var DEFAULT_GEMINI_MODEL = "gemini-embedding-001";
var DEFAULT_CHUNK_TOKENS = 400;
var DEFAULT_CHUNK_OVERLAP = 80;
var DEFAULT_WATCH_DEBOUNCE_MS = 1500;
var DEFAULT_SESSION_DELTA_BYTES = 100000;
var DEFAULT_SESSION_DELTA_MESSAGES = 50;
var DEFAULT_MAX_RESULTS = 6;
var DEFAULT_MIN_SCORE = 0.35;
var DEFAULT_HYBRID_ENABLED = true;
var DEFAULT_HYBRID_VECTOR_WEIGHT = 0.7;
var DEFAULT_HYBRID_TEXT_WEIGHT = 0.3;
var DEFAULT_HYBRID_CANDIDATE_MULTIPLIER = 4;
var DEFAULT_CACHE_ENABLED = true;
var DEFAULT_SOURCES = ["memory"];
function normalizeSources(sources, sessionMemoryEnabled) {
  var normalized = new Set();
  var input = (sources === null || sources === void 0 ? void 0 : sources.length)
    ? sources
    : DEFAULT_SOURCES;
  for (var _i = 0, input_1 = input; _i < input_1.length; _i++) {
    var source = input_1[_i];
    if (source === "memory") {
      normalized.add("memory");
    }
    if (source === "sessions" && sessionMemoryEnabled) {
      normalized.add("sessions");
    }
  }
  if (normalized.size === 0) {
    normalized.add("memory");
  }
  return Array.from(normalized);
}
function resolveStorePath(agentId, raw) {
  var stateDir = (0, paths_js_1.resolveStateDir)(process.env, node_os_1.default.homedir);
  var fallback = node_path_1.default.join(stateDir, "memory", "".concat(agentId, ".sqlite"));
  if (!raw) {
    return fallback;
  }
  var withToken = raw.includes("{agentId}") ? raw.replaceAll("{agentId}", agentId) : raw;
  return (0, utils_js_1.resolveUserPath)(withToken);
}
function mergeConfig(defaults, overrides, agentId) {
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
    _z,
    _0,
    _1,
    _2,
    _3,
    _4,
    _5,
    _6,
    _7,
    _8,
    _9,
    _10,
    _11,
    _12,
    _13,
    _14,
    _15,
    _16,
    _17,
    _18,
    _19,
    _20,
    _21,
    _22,
    _23,
    _24,
    _25,
    _26,
    _27,
    _28,
    _29,
    _30,
    _31,
    _32,
    _33,
    _34,
    _35,
    _36,
    _37,
    _38,
    _39,
    _40,
    _41,
    _42,
    _43,
    _44,
    _45,
    _46,
    _47,
    _48,
    _49,
    _50,
    _51,
    _52,
    _53,
    _54,
    _55,
    _56,
    _57,
    _58,
    _59,
    _60,
    _61,
    _62,
    _63,
    _64,
    _65,
    _66,
    _67,
    _68,
    _69,
    _70,
    _71,
    _72,
    _73,
    _74,
    _75,
    _76,
    _77,
    _78,
    _79,
    _80,
    _81,
    _82,
    _83,
    _84,
    _85,
    _86,
    _87,
    _88,
    _89,
    _90,
    _91,
    _92,
    _93,
    _94,
    _95,
    _96,
    _97,
    _98,
    _99,
    _100,
    _101,
    _102,
    _103,
    _104,
    _105,
    _106,
    _107,
    _108,
    _109,
    _110,
    _111,
    _112,
    _113,
    _114,
    _115,
    _116,
    _117;
  var enabled =
    (_b =
      (_a = overrides === null || overrides === void 0 ? void 0 : overrides.enabled) !== null &&
      _a !== void 0
        ? _a
        : defaults === null || defaults === void 0
          ? void 0
          : defaults.enabled) !== null && _b !== void 0
      ? _b
      : true;
  var sessionMemory =
    (_f =
      (_d =
        (_c = overrides === null || overrides === void 0 ? void 0 : overrides.experimental) ===
          null || _c === void 0
          ? void 0
          : _c.sessionMemory) !== null && _d !== void 0
        ? _d
        : (_e = defaults === null || defaults === void 0 ? void 0 : defaults.experimental) ===
              null || _e === void 0
          ? void 0
          : _e.sessionMemory) !== null && _f !== void 0
      ? _f
      : false;
  var provider =
    (_h =
      (_g = overrides === null || overrides === void 0 ? void 0 : overrides.provider) !== null &&
      _g !== void 0
        ? _g
        : defaults === null || defaults === void 0
          ? void 0
          : defaults.provider) !== null && _h !== void 0
      ? _h
      : "auto";
  var defaultRemote = defaults === null || defaults === void 0 ? void 0 : defaults.remote;
  var overrideRemote = overrides === null || overrides === void 0 ? void 0 : overrides.remote;
  var hasRemoteConfig = Boolean(
    (overrideRemote === null || overrideRemote === void 0 ? void 0 : overrideRemote.baseUrl) ||
    (overrideRemote === null || overrideRemote === void 0 ? void 0 : overrideRemote.apiKey) ||
    (overrideRemote === null || overrideRemote === void 0 ? void 0 : overrideRemote.headers) ||
    (defaultRemote === null || defaultRemote === void 0 ? void 0 : defaultRemote.baseUrl) ||
    (defaultRemote === null || defaultRemote === void 0 ? void 0 : defaultRemote.apiKey) ||
    (defaultRemote === null || defaultRemote === void 0 ? void 0 : defaultRemote.headers),
  );
  var includeRemote =
    hasRemoteConfig || provider === "openai" || provider === "gemini" || provider === "auto";
  var batch = {
    enabled:
      (_m =
        (_k =
          (_j =
            overrideRemote === null || overrideRemote === void 0
              ? void 0
              : overrideRemote.batch) === null || _j === void 0
            ? void 0
            : _j.enabled) !== null && _k !== void 0
          ? _k
          : (_l =
                defaultRemote === null || defaultRemote === void 0
                  ? void 0
                  : defaultRemote.batch) === null || _l === void 0
            ? void 0
            : _l.enabled) !== null && _m !== void 0
        ? _m
        : true,
    wait:
      (_r =
        (_p =
          (_o =
            overrideRemote === null || overrideRemote === void 0
              ? void 0
              : overrideRemote.batch) === null || _o === void 0
            ? void 0
            : _o.wait) !== null && _p !== void 0
          ? _p
          : (_q =
                defaultRemote === null || defaultRemote === void 0
                  ? void 0
                  : defaultRemote.batch) === null || _q === void 0
            ? void 0
            : _q.wait) !== null && _r !== void 0
        ? _r
        : true,
    concurrency: Math.max(
      1,
      (_v =
        (_t =
          (_s =
            overrideRemote === null || overrideRemote === void 0
              ? void 0
              : overrideRemote.batch) === null || _s === void 0
            ? void 0
            : _s.concurrency) !== null && _t !== void 0
          ? _t
          : (_u =
                defaultRemote === null || defaultRemote === void 0
                  ? void 0
                  : defaultRemote.batch) === null || _u === void 0
            ? void 0
            : _u.concurrency) !== null && _v !== void 0
        ? _v
        : 2,
    ),
    pollIntervalMs:
      (_z =
        (_x =
          (_w =
            overrideRemote === null || overrideRemote === void 0
              ? void 0
              : overrideRemote.batch) === null || _w === void 0
            ? void 0
            : _w.pollIntervalMs) !== null && _x !== void 0
          ? _x
          : (_y =
                defaultRemote === null || defaultRemote === void 0
                  ? void 0
                  : defaultRemote.batch) === null || _y === void 0
            ? void 0
            : _y.pollIntervalMs) !== null && _z !== void 0
        ? _z
        : 2000,
    timeoutMinutes:
      (_3 =
        (_1 =
          (_0 =
            overrideRemote === null || overrideRemote === void 0
              ? void 0
              : overrideRemote.batch) === null || _0 === void 0
            ? void 0
            : _0.timeoutMinutes) !== null && _1 !== void 0
          ? _1
          : (_2 =
                defaultRemote === null || defaultRemote === void 0
                  ? void 0
                  : defaultRemote.batch) === null || _2 === void 0
            ? void 0
            : _2.timeoutMinutes) !== null && _3 !== void 0
        ? _3
        : 60,
  };
  var remote = includeRemote
    ? {
        baseUrl:
          (_4 =
            overrideRemote === null || overrideRemote === void 0
              ? void 0
              : overrideRemote.baseUrl) !== null && _4 !== void 0
            ? _4
            : defaultRemote === null || defaultRemote === void 0
              ? void 0
              : defaultRemote.baseUrl,
        apiKey:
          (_5 =
            overrideRemote === null || overrideRemote === void 0
              ? void 0
              : overrideRemote.apiKey) !== null && _5 !== void 0
            ? _5
            : defaultRemote === null || defaultRemote === void 0
              ? void 0
              : defaultRemote.apiKey,
        headers:
          (_6 =
            overrideRemote === null || overrideRemote === void 0
              ? void 0
              : overrideRemote.headers) !== null && _6 !== void 0
            ? _6
            : defaultRemote === null || defaultRemote === void 0
              ? void 0
              : defaultRemote.headers,
        batch: batch,
      }
    : undefined;
  var fallback =
    (_8 =
      (_7 = overrides === null || overrides === void 0 ? void 0 : overrides.fallback) !== null &&
      _7 !== void 0
        ? _7
        : defaults === null || defaults === void 0
          ? void 0
          : defaults.fallback) !== null && _8 !== void 0
      ? _8
      : "none";
  var modelDefault =
    provider === "gemini"
      ? DEFAULT_GEMINI_MODEL
      : provider === "openai"
        ? DEFAULT_OPENAI_MODEL
        : undefined;
  var model =
    (_11 =
      (_10 =
        (_9 = overrides === null || overrides === void 0 ? void 0 : overrides.model) !== null &&
        _9 !== void 0
          ? _9
          : defaults === null || defaults === void 0
            ? void 0
            : defaults.model) !== null && _10 !== void 0
        ? _10
        : modelDefault) !== null && _11 !== void 0
      ? _11
      : "";
  var local = {
    modelPath:
      (_13 =
        (_12 = overrides === null || overrides === void 0 ? void 0 : overrides.local) === null ||
        _12 === void 0
          ? void 0
          : _12.modelPath) !== null && _13 !== void 0
        ? _13
        : (_14 = defaults === null || defaults === void 0 ? void 0 : defaults.local) === null ||
            _14 === void 0
          ? void 0
          : _14.modelPath,
    modelCacheDir:
      (_16 =
        (_15 = overrides === null || overrides === void 0 ? void 0 : overrides.local) === null ||
        _15 === void 0
          ? void 0
          : _15.modelCacheDir) !== null && _16 !== void 0
        ? _16
        : (_17 = defaults === null || defaults === void 0 ? void 0 : defaults.local) === null ||
            _17 === void 0
          ? void 0
          : _17.modelCacheDir,
  };
  var sources = normalizeSources(
    (_18 = overrides === null || overrides === void 0 ? void 0 : overrides.sources) !== null &&
      _18 !== void 0
      ? _18
      : defaults === null || defaults === void 0
        ? void 0
        : defaults.sources,
    sessionMemory,
  );
  var rawPaths = __spreadArray(
    __spreadArray(
      [],
      (_19 = defaults === null || defaults === void 0 ? void 0 : defaults.extraPaths) !== null &&
        _19 !== void 0
        ? _19
        : [],
      true,
    ),
    (_20 = overrides === null || overrides === void 0 ? void 0 : overrides.extraPaths) !== null &&
      _20 !== void 0
      ? _20
      : [],
    true,
  )
    .map(function (value) {
      return value.trim();
    })
    .filter(Boolean);
  var extraPaths = Array.from(new Set(rawPaths));
  var vector = {
    enabled:
      (_26 =
        (_23 =
          (_22 =
            (_21 = overrides === null || overrides === void 0 ? void 0 : overrides.store) ===
              null || _21 === void 0
              ? void 0
              : _21.vector) === null || _22 === void 0
            ? void 0
            : _22.enabled) !== null && _23 !== void 0
          ? _23
          : (_25 =
                (_24 = defaults === null || defaults === void 0 ? void 0 : defaults.store) ===
                  null || _24 === void 0
                  ? void 0
                  : _24.vector) === null || _25 === void 0
            ? void 0
            : _25.enabled) !== null && _26 !== void 0
        ? _26
        : true,
    extensionPath:
      (_29 =
        (_28 =
          (_27 = overrides === null || overrides === void 0 ? void 0 : overrides.store) === null ||
          _27 === void 0
            ? void 0
            : _27.vector) === null || _28 === void 0
          ? void 0
          : _28.extensionPath) !== null && _29 !== void 0
        ? _29
        : (_31 =
              (_30 = defaults === null || defaults === void 0 ? void 0 : defaults.store) === null ||
              _30 === void 0
                ? void 0
                : _30.vector) === null || _31 === void 0
          ? void 0
          : _31.extensionPath,
  };
  var store = {
    driver:
      (_35 =
        (_33 =
          (_32 = overrides === null || overrides === void 0 ? void 0 : overrides.store) === null ||
          _32 === void 0
            ? void 0
            : _32.driver) !== null && _33 !== void 0
          ? _33
          : (_34 = defaults === null || defaults === void 0 ? void 0 : defaults.store) === null ||
              _34 === void 0
            ? void 0
            : _34.driver) !== null && _35 !== void 0
        ? _35
        : "sqlite",
    path: resolveStorePath(
      agentId,
      (_37 =
        (_36 = overrides === null || overrides === void 0 ? void 0 : overrides.store) === null ||
        _36 === void 0
          ? void 0
          : _36.path) !== null && _37 !== void 0
        ? _37
        : (_38 = defaults === null || defaults === void 0 ? void 0 : defaults.store) === null ||
            _38 === void 0
          ? void 0
          : _38.path,
    ),
    vector: vector,
  };
  var chunking = {
    tokens:
      (_42 =
        (_40 =
          (_39 = overrides === null || overrides === void 0 ? void 0 : overrides.chunking) ===
            null || _39 === void 0
            ? void 0
            : _39.tokens) !== null && _40 !== void 0
          ? _40
          : (_41 = defaults === null || defaults === void 0 ? void 0 : defaults.chunking) ===
                null || _41 === void 0
            ? void 0
            : _41.tokens) !== null && _42 !== void 0
        ? _42
        : DEFAULT_CHUNK_TOKENS,
    overlap:
      (_46 =
        (_44 =
          (_43 = overrides === null || overrides === void 0 ? void 0 : overrides.chunking) ===
            null || _43 === void 0
            ? void 0
            : _43.overlap) !== null && _44 !== void 0
          ? _44
          : (_45 = defaults === null || defaults === void 0 ? void 0 : defaults.chunking) ===
                null || _45 === void 0
            ? void 0
            : _45.overlap) !== null && _46 !== void 0
        ? _46
        : DEFAULT_CHUNK_OVERLAP,
  };
  var sync = {
    onSessionStart:
      (_50 =
        (_48 =
          (_47 = overrides === null || overrides === void 0 ? void 0 : overrides.sync) === null ||
          _47 === void 0
            ? void 0
            : _47.onSessionStart) !== null && _48 !== void 0
          ? _48
          : (_49 = defaults === null || defaults === void 0 ? void 0 : defaults.sync) === null ||
              _49 === void 0
            ? void 0
            : _49.onSessionStart) !== null && _50 !== void 0
        ? _50
        : true,
    onSearch:
      (_54 =
        (_52 =
          (_51 = overrides === null || overrides === void 0 ? void 0 : overrides.sync) === null ||
          _51 === void 0
            ? void 0
            : _51.onSearch) !== null && _52 !== void 0
          ? _52
          : (_53 = defaults === null || defaults === void 0 ? void 0 : defaults.sync) === null ||
              _53 === void 0
            ? void 0
            : _53.onSearch) !== null && _54 !== void 0
        ? _54
        : true,
    watch:
      (_58 =
        (_56 =
          (_55 = overrides === null || overrides === void 0 ? void 0 : overrides.sync) === null ||
          _55 === void 0
            ? void 0
            : _55.watch) !== null && _56 !== void 0
          ? _56
          : (_57 = defaults === null || defaults === void 0 ? void 0 : defaults.sync) === null ||
              _57 === void 0
            ? void 0
            : _57.watch) !== null && _58 !== void 0
        ? _58
        : true,
    watchDebounceMs:
      (_62 =
        (_60 =
          (_59 = overrides === null || overrides === void 0 ? void 0 : overrides.sync) === null ||
          _59 === void 0
            ? void 0
            : _59.watchDebounceMs) !== null && _60 !== void 0
          ? _60
          : (_61 = defaults === null || defaults === void 0 ? void 0 : defaults.sync) === null ||
              _61 === void 0
            ? void 0
            : _61.watchDebounceMs) !== null && _62 !== void 0
        ? _62
        : DEFAULT_WATCH_DEBOUNCE_MS,
    intervalMinutes:
      (_66 =
        (_64 =
          (_63 = overrides === null || overrides === void 0 ? void 0 : overrides.sync) === null ||
          _63 === void 0
            ? void 0
            : _63.intervalMinutes) !== null && _64 !== void 0
          ? _64
          : (_65 = defaults === null || defaults === void 0 ? void 0 : defaults.sync) === null ||
              _65 === void 0
            ? void 0
            : _65.intervalMinutes) !== null && _66 !== void 0
        ? _66
        : 0,
    sessions: {
      deltaBytes:
        (_72 =
          (_69 =
            (_68 =
              (_67 = overrides === null || overrides === void 0 ? void 0 : overrides.sync) ===
                null || _67 === void 0
                ? void 0
                : _67.sessions) === null || _68 === void 0
              ? void 0
              : _68.deltaBytes) !== null && _69 !== void 0
            ? _69
            : (_71 =
                  (_70 = defaults === null || defaults === void 0 ? void 0 : defaults.sync) ===
                    null || _70 === void 0
                    ? void 0
                    : _70.sessions) === null || _71 === void 0
              ? void 0
              : _71.deltaBytes) !== null && _72 !== void 0
          ? _72
          : DEFAULT_SESSION_DELTA_BYTES,
      deltaMessages:
        (_78 =
          (_75 =
            (_74 =
              (_73 = overrides === null || overrides === void 0 ? void 0 : overrides.sync) ===
                null || _73 === void 0
                ? void 0
                : _73.sessions) === null || _74 === void 0
              ? void 0
              : _74.deltaMessages) !== null && _75 !== void 0
            ? _75
            : (_77 =
                  (_76 = defaults === null || defaults === void 0 ? void 0 : defaults.sync) ===
                    null || _76 === void 0
                    ? void 0
                    : _76.sessions) === null || _77 === void 0
              ? void 0
              : _77.deltaMessages) !== null && _78 !== void 0
          ? _78
          : DEFAULT_SESSION_DELTA_MESSAGES,
    },
  };
  var query = {
    maxResults:
      (_82 =
        (_80 =
          (_79 = overrides === null || overrides === void 0 ? void 0 : overrides.query) === null ||
          _79 === void 0
            ? void 0
            : _79.maxResults) !== null && _80 !== void 0
          ? _80
          : (_81 = defaults === null || defaults === void 0 ? void 0 : defaults.query) === null ||
              _81 === void 0
            ? void 0
            : _81.maxResults) !== null && _82 !== void 0
        ? _82
        : DEFAULT_MAX_RESULTS,
    minScore:
      (_86 =
        (_84 =
          (_83 = overrides === null || overrides === void 0 ? void 0 : overrides.query) === null ||
          _83 === void 0
            ? void 0
            : _83.minScore) !== null && _84 !== void 0
          ? _84
          : (_85 = defaults === null || defaults === void 0 ? void 0 : defaults.query) === null ||
              _85 === void 0
            ? void 0
            : _85.minScore) !== null && _86 !== void 0
        ? _86
        : DEFAULT_MIN_SCORE,
  };
  var hybrid = {
    enabled:
      (_92 =
        (_89 =
          (_88 =
            (_87 = overrides === null || overrides === void 0 ? void 0 : overrides.query) ===
              null || _87 === void 0
              ? void 0
              : _87.hybrid) === null || _88 === void 0
            ? void 0
            : _88.enabled) !== null && _89 !== void 0
          ? _89
          : (_91 =
                (_90 = defaults === null || defaults === void 0 ? void 0 : defaults.query) ===
                  null || _90 === void 0
                  ? void 0
                  : _90.hybrid) === null || _91 === void 0
            ? void 0
            : _91.enabled) !== null && _92 !== void 0
        ? _92
        : DEFAULT_HYBRID_ENABLED,
    vectorWeight:
      (_98 =
        (_95 =
          (_94 =
            (_93 = overrides === null || overrides === void 0 ? void 0 : overrides.query) ===
              null || _93 === void 0
              ? void 0
              : _93.hybrid) === null || _94 === void 0
            ? void 0
            : _94.vectorWeight) !== null && _95 !== void 0
          ? _95
          : (_97 =
                (_96 = defaults === null || defaults === void 0 ? void 0 : defaults.query) ===
                  null || _96 === void 0
                  ? void 0
                  : _96.hybrid) === null || _97 === void 0
            ? void 0
            : _97.vectorWeight) !== null && _98 !== void 0
        ? _98
        : DEFAULT_HYBRID_VECTOR_WEIGHT,
    textWeight:
      (_104 =
        (_101 =
          (_100 =
            (_99 = overrides === null || overrides === void 0 ? void 0 : overrides.query) ===
              null || _99 === void 0
              ? void 0
              : _99.hybrid) === null || _100 === void 0
            ? void 0
            : _100.textWeight) !== null && _101 !== void 0
          ? _101
          : (_103 =
                (_102 = defaults === null || defaults === void 0 ? void 0 : defaults.query) ===
                  null || _102 === void 0
                  ? void 0
                  : _102.hybrid) === null || _103 === void 0
            ? void 0
            : _103.textWeight) !== null && _104 !== void 0
        ? _104
        : DEFAULT_HYBRID_TEXT_WEIGHT,
    candidateMultiplier:
      (_110 =
        (_107 =
          (_106 =
            (_105 = overrides === null || overrides === void 0 ? void 0 : overrides.query) ===
              null || _105 === void 0
              ? void 0
              : _105.hybrid) === null || _106 === void 0
            ? void 0
            : _106.candidateMultiplier) !== null && _107 !== void 0
          ? _107
          : (_109 =
                (_108 = defaults === null || defaults === void 0 ? void 0 : defaults.query) ===
                  null || _108 === void 0
                  ? void 0
                  : _108.hybrid) === null || _109 === void 0
            ? void 0
            : _109.candidateMultiplier) !== null && _110 !== void 0
        ? _110
        : DEFAULT_HYBRID_CANDIDATE_MULTIPLIER,
  };
  var cache = {
    enabled:
      (_114 =
        (_112 =
          (_111 = overrides === null || overrides === void 0 ? void 0 : overrides.cache) === null ||
          _111 === void 0
            ? void 0
            : _111.enabled) !== null && _112 !== void 0
          ? _112
          : (_113 = defaults === null || defaults === void 0 ? void 0 : defaults.cache) === null ||
              _113 === void 0
            ? void 0
            : _113.enabled) !== null && _114 !== void 0
        ? _114
        : DEFAULT_CACHE_ENABLED,
    maxEntries:
      (_116 =
        (_115 = overrides === null || overrides === void 0 ? void 0 : overrides.cache) === null ||
        _115 === void 0
          ? void 0
          : _115.maxEntries) !== null && _116 !== void 0
        ? _116
        : (_117 = defaults === null || defaults === void 0 ? void 0 : defaults.cache) === null ||
            _117 === void 0
          ? void 0
          : _117.maxEntries,
  };
  var overlap = (0, utils_js_1.clampNumber)(chunking.overlap, 0, Math.max(0, chunking.tokens - 1));
  var minScore = (0, utils_js_1.clampNumber)(query.minScore, 0, 1);
  var vectorWeight = (0, utils_js_1.clampNumber)(hybrid.vectorWeight, 0, 1);
  var textWeight = (0, utils_js_1.clampNumber)(hybrid.textWeight, 0, 1);
  var sum = vectorWeight + textWeight;
  var normalizedVectorWeight = sum > 0 ? vectorWeight / sum : DEFAULT_HYBRID_VECTOR_WEIGHT;
  var normalizedTextWeight = sum > 0 ? textWeight / sum : DEFAULT_HYBRID_TEXT_WEIGHT;
  var candidateMultiplier = (0, utils_js_1.clampInt)(hybrid.candidateMultiplier, 1, 20);
  var deltaBytes = (0, utils_js_1.clampInt)(sync.sessions.deltaBytes, 0, Number.MAX_SAFE_INTEGER);
  var deltaMessages = (0, utils_js_1.clampInt)(
    sync.sessions.deltaMessages,
    0,
    Number.MAX_SAFE_INTEGER,
  );
  return {
    enabled: enabled,
    sources: sources,
    extraPaths: extraPaths,
    provider: provider,
    remote: remote,
    experimental: {
      sessionMemory: sessionMemory,
    },
    fallback: fallback,
    model: model,
    local: local,
    store: store,
    chunking: { tokens: Math.max(1, chunking.tokens), overlap: overlap },
    sync: __assign(__assign({}, sync), {
      sessions: {
        deltaBytes: deltaBytes,
        deltaMessages: deltaMessages,
      },
    }),
    query: __assign(__assign({}, query), {
      minScore: minScore,
      hybrid: {
        enabled: Boolean(hybrid.enabled),
        vectorWeight: normalizedVectorWeight,
        textWeight: normalizedTextWeight,
        candidateMultiplier: candidateMultiplier,
      },
    }),
    cache: {
      enabled: Boolean(cache.enabled),
      maxEntries:
        typeof cache.maxEntries === "number" && Number.isFinite(cache.maxEntries)
          ? Math.max(1, Math.floor(cache.maxEntries))
          : undefined,
    },
  };
}
function resolveMemorySearchConfig(cfg, agentId) {
  var _a, _b, _c;
  var defaults =
    (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
    _b === void 0
      ? void 0
      : _b.memorySearch;
  var overrides =
    (_c = (0, agent_scope_js_1.resolveAgentConfig)(cfg, agentId)) === null || _c === void 0
      ? void 0
      : _c.memorySearch;
  var resolved = mergeConfig(defaults, overrides, agentId);
  if (!resolved.enabled) {
    return null;
  }
  return resolved;
}
