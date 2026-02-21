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
exports.applyChannelMatchMeta = applyChannelMatchMeta;
exports.resolveChannelMatchConfig = resolveChannelMatchConfig;
exports.normalizeChannelSlug = normalizeChannelSlug;
exports.buildChannelKeyCandidates = buildChannelKeyCandidates;
exports.resolveChannelEntryMatch = resolveChannelEntryMatch;
exports.resolveChannelEntryMatchWithFallback = resolveChannelEntryMatchWithFallback;
exports.resolveNestedAllowlistDecision = resolveNestedAllowlistDecision;
function applyChannelMatchMeta(result, match) {
  if (match.matchKey && match.matchSource) {
    result.matchKey = match.matchKey;
    result.matchSource = match.matchSource;
  }
  return result;
}
function resolveChannelMatchConfig(match, resolveEntry) {
  if (!match.entry) {
    return null;
  }
  return applyChannelMatchMeta(resolveEntry(match.entry), match);
}
function normalizeChannelSlug(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/^#/, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}
function buildChannelKeyCandidates() {
  var keys = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    keys[_i] = arguments[_i];
  }
  var seen = new Set();
  var candidates = [];
  for (var _a = 0, keys_1 = keys; _a < keys_1.length; _a++) {
    var key = keys_1[_a];
    if (typeof key !== "string") {
      continue;
    }
    var trimmed = key.trim();
    if (!trimmed || seen.has(trimmed)) {
      continue;
    }
    seen.add(trimmed);
    candidates.push(trimmed);
  }
  return candidates;
}
function resolveChannelEntryMatch(params) {
  var _a;
  var entries = (_a = params.entries) !== null && _a !== void 0 ? _a : {};
  var match = {};
  for (var _i = 0, _b = params.keys; _i < _b.length; _i++) {
    var key = _b[_i];
    if (!Object.prototype.hasOwnProperty.call(entries, key)) {
      continue;
    }
    match.entry = entries[key];
    match.key = key;
    break;
  }
  if (params.wildcardKey && Object.prototype.hasOwnProperty.call(entries, params.wildcardKey)) {
    match.wildcardEntry = entries[params.wildcardKey];
    match.wildcardKey = params.wildcardKey;
  }
  return match;
}
function resolveChannelEntryMatchWithFallback(params) {
  var _a, _b, _c;
  var direct = resolveChannelEntryMatch({
    entries: params.entries,
    keys: params.keys,
    wildcardKey: params.wildcardKey,
  });
  if (direct.entry && direct.key) {
    return __assign(__assign({}, direct), { matchKey: direct.key, matchSource: "direct" });
  }
  var normalizeKey = params.normalizeKey;
  if (normalizeKey) {
    var normalizedKeys = params.keys
      .map(function (key) {
        return normalizeKey(key);
      })
      .filter(Boolean);
    if (normalizedKeys.length > 0) {
      for (
        var _i = 0, _d = Object.entries((_a = params.entries) !== null && _a !== void 0 ? _a : {});
        _i < _d.length;
        _i++
      ) {
        var _e = _d[_i],
          entryKey = _e[0],
          entry = _e[1];
        var normalizedEntry = normalizeKey(entryKey);
        if (normalizedEntry && normalizedKeys.includes(normalizedEntry)) {
          return __assign(__assign({}, direct), {
            entry: entry,
            key: entryKey,
            matchKey: entryKey,
            matchSource: "direct",
          });
        }
      }
    }
  }
  var parentKeys = (_b = params.parentKeys) !== null && _b !== void 0 ? _b : [];
  if (parentKeys.length > 0) {
    var parent_1 = resolveChannelEntryMatch({ entries: params.entries, keys: parentKeys });
    if (parent_1.entry && parent_1.key) {
      return __assign(__assign({}, direct), {
        entry: parent_1.entry,
        key: parent_1.key,
        parentEntry: parent_1.entry,
        parentKey: parent_1.key,
        matchKey: parent_1.key,
        matchSource: "parent",
      });
    }
    if (normalizeKey) {
      var normalizedParentKeys = parentKeys
        .map(function (key) {
          return normalizeKey(key);
        })
        .filter(Boolean);
      if (normalizedParentKeys.length > 0) {
        for (
          var _f = 0,
            _g = Object.entries((_c = params.entries) !== null && _c !== void 0 ? _c : {});
          _f < _g.length;
          _f++
        ) {
          var _h = _g[_f],
            entryKey = _h[0],
            entry = _h[1];
          var normalizedEntry = normalizeKey(entryKey);
          if (normalizedEntry && normalizedParentKeys.includes(normalizedEntry)) {
            return __assign(__assign({}, direct), {
              entry: entry,
              key: entryKey,
              parentEntry: entry,
              parentKey: entryKey,
              matchKey: entryKey,
              matchSource: "parent",
            });
          }
        }
      }
    }
  }
  if (direct.wildcardEntry && direct.wildcardKey) {
    return __assign(__assign({}, direct), {
      entry: direct.wildcardEntry,
      key: direct.wildcardKey,
      matchKey: direct.wildcardKey,
      matchSource: "wildcard",
    });
  }
  return direct;
}
function resolveNestedAllowlistDecision(params) {
  if (!params.outerConfigured) {
    return true;
  }
  if (!params.outerMatched) {
    return false;
  }
  if (!params.innerConfigured) {
    return true;
  }
  return params.innerMatched;
}
