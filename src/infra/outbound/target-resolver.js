"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) {
            throw t[1];
          }
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) {
        throw new TypeError("Generator is already executing.");
      }
      while ((g && ((g = 0), op[0] && (_ = 0)), _)) {
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      }
      if (op[0] & 5) {
        throw op[1];
      }
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveChannelTarget = resolveChannelTarget;
exports.resetDirectoryCache = resetDirectoryCache;
exports.formatTargetDisplay = formatTargetDisplay;
exports.resolveMessagingTarget = resolveMessagingTarget;
exports.lookupDirectoryDisplay = lookupDirectoryDisplay;
var index_js_1 = require("../../channels/plugins/index.js");
var runtime_js_1 = require("../../runtime.js");
var directory_cache_js_1 = require("./directory-cache.js");
var target_normalization_js_1 = require("./target-normalization.js");
var target_errors_js_1 = require("./target-errors.js");
function resolveChannelTarget(params) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [2 /*return*/, resolveMessagingTarget(params)];
    });
  });
}
var CACHE_TTL_MS = 30 * 60 * 1000;
var directoryCache = new directory_cache_js_1.DirectoryCache(CACHE_TTL_MS);
function resetDirectoryCache(params) {
  var _a;
  if (!(params === null || params === void 0 ? void 0 : params.channel)) {
    directoryCache.clear();
    return;
  }
  var channelKey = params.channel;
  var accountKey = (_a = params.accountId) !== null && _a !== void 0 ? _a : "default";
  directoryCache.clearMatching(function (key) {
    if (!key.startsWith("".concat(channelKey, ":"))) {
      return false;
    }
    if (!params.accountId) {
      return true;
    }
    return key.startsWith("".concat(channelKey, ":").concat(accountKey, ":"));
  });
}
function normalizeQuery(value) {
  return value.trim().toLowerCase();
}
function stripTargetPrefixes(value) {
  return value
    .replace(/^(channel|user):/i, "")
    .replace(/^[@#]/, "")
    .trim();
}
function formatTargetDisplay(params) {
  var _a, _b, _c;
  var plugin = (0, index_js_1.getChannelPlugin)(params.channel);
  if (
    (_a = plugin === null || plugin === void 0 ? void 0 : plugin.messaging) === null ||
    _a === void 0
      ? void 0
      : _a.formatTargetDisplay
  ) {
    return plugin.messaging.formatTargetDisplay({
      target: params.target,
      display: params.display,
      kind: params.kind,
    });
  }
  var trimmedTarget = params.target.trim();
  var lowered = trimmedTarget.toLowerCase();
  var display = (_b = params.display) === null || _b === void 0 ? void 0 : _b.trim();
  var kind =
    (_c = params.kind) !== null && _c !== void 0
      ? _c
      : lowered.startsWith("user:")
        ? "user"
        : lowered.startsWith("channel:")
          ? "group"
          : undefined;
  if (display) {
    if (display.startsWith("#") || display.startsWith("@")) {
      return display;
    }
    if (kind === "user") {
      return "@".concat(display);
    }
    if (kind === "group" || kind === "channel") {
      return "#".concat(display);
    }
    return display;
  }
  if (!trimmedTarget) {
    return trimmedTarget;
  }
  if (trimmedTarget.startsWith("#") || trimmedTarget.startsWith("@")) {
    return trimmedTarget;
  }
  var channelPrefix = "".concat(params.channel, ":");
  var withoutProvider = trimmedTarget.toLowerCase().startsWith(channelPrefix)
    ? trimmedTarget.slice(channelPrefix.length)
    : trimmedTarget;
  var withoutPrefix = withoutProvider.replace(/^telegram:/i, "");
  if (/^channel:/i.test(withoutPrefix)) {
    return "#".concat(withoutPrefix.replace(/^channel:/i, ""));
  }
  if (/^user:/i.test(withoutPrefix)) {
    return "@".concat(withoutPrefix.replace(/^user:/i, ""));
  }
  return withoutPrefix;
}
function preserveTargetCase(channel, raw, normalized) {
  if (channel !== "slack") {
    return normalized;
  }
  var trimmed = raw.trim();
  if (/^channel:/i.test(trimmed) || /^user:/i.test(trimmed)) {
    return trimmed;
  }
  if (trimmed.startsWith("#")) {
    return "channel:".concat(trimmed.slice(1).trim());
  }
  if (trimmed.startsWith("@")) {
    return "user:".concat(trimmed.slice(1).trim());
  }
  return trimmed;
}
function detectTargetKind(channel, raw, preferred) {
  if (preferred) {
    return preferred;
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    return "group";
  }
  if (trimmed.startsWith("@") || /^<@!?/.test(trimmed) || /^user:/i.test(trimmed)) {
    return "user";
  }
  if (trimmed.startsWith("#") || /^channel:/i.test(trimmed)) {
    return "group";
  }
  // For some channels (e.g., BlueBubbles/iMessage), bare phone numbers are almost always DM targets.
  if ((channel === "bluebubbles" || channel === "imessage") && /^\+?\d{6,}$/.test(trimmed)) {
    return "user";
  }
  return "group";
}
function normalizeDirectoryEntryId(channel, entry) {
  var normalized = (0, target_normalization_js_1.normalizeTargetForProvider)(channel, entry.id);
  return normalized !== null && normalized !== void 0 ? normalized : entry.id.trim();
}
function matchesDirectoryEntry(params) {
  var query = normalizeQuery(params.query);
  if (!query) {
    return false;
  }
  var id = stripTargetPrefixes(normalizeDirectoryEntryId(params.channel, params.entry));
  var name = params.entry.name ? stripTargetPrefixes(params.entry.name) : "";
  var handle = params.entry.handle ? stripTargetPrefixes(params.entry.handle) : "";
  var candidates = [id, name, handle]
    .map(function (value) {
      return normalizeQuery(value);
    })
    .filter(Boolean);
  return candidates.some(function (value) {
    return value === query || value.includes(query);
  });
}
function resolveMatch(params) {
  var matches = params.entries.filter(function (entry) {
    return matchesDirectoryEntry({ channel: params.channel, entry: entry, query: params.query });
  });
  if (matches.length === 0) {
    return { kind: "none" };
  }
  if (matches.length === 1) {
    return { kind: "single", entry: matches[0] };
  }
  return { kind: "ambiguous", entries: matches };
}
function listDirectoryEntries(params) {
  return __awaiter(this, void 0, void 0, function () {
    var plugin, directory, runtime, useLive, fn_1, fn;
    var _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          plugin = (0, index_js_1.getChannelPlugin)(params.channel);
          directory = plugin === null || plugin === void 0 ? void 0 : plugin.directory;
          if (!directory) {
            return [2 /*return*/, []];
          }
          runtime =
            (_a = params.runtime) !== null && _a !== void 0 ? _a : runtime_js_1.defaultRuntime;
          useLive = params.source === "live";
          if (!(params.kind === "user")) {
            return [3 /*break*/, 2];
          }
          fn_1 = useLive
            ? (_b = directory.listPeersLive) !== null && _b !== void 0
              ? _b
              : directory.listPeers
            : directory.listPeers;
          if (!fn_1) {
            return [2 /*return*/, []];
          }
          return [
            4 /*yield*/,
            fn_1({
              cfg: params.cfg,
              accountId: (_c = params.accountId) !== null && _c !== void 0 ? _c : undefined,
              query: (_d = params.query) !== null && _d !== void 0 ? _d : undefined,
              limit: undefined,
              runtime: runtime,
            }),
          ];
        case 1:
          return [2 /*return*/, _h.sent()];
        case 2:
          fn = useLive
            ? (_e = directory.listGroupsLive) !== null && _e !== void 0
              ? _e
              : directory.listGroups
            : directory.listGroups;
          if (!fn) {
            return [2 /*return*/, []];
          }
          return [
            4 /*yield*/,
            fn({
              cfg: params.cfg,
              accountId: (_f = params.accountId) !== null && _f !== void 0 ? _f : undefined,
              query: (_g = params.query) !== null && _g !== void 0 ? _g : undefined,
              limit: undefined,
              runtime: runtime,
            }),
          ];
        case 3:
          return [2 /*return*/, _h.sent()];
      }
    });
  });
}
function getDirectoryEntries(params) {
  return __awaiter(this, void 0, void 0, function () {
    var signature, cacheKey, cached, entries, liveKey, liveEntries;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          signature = (0, target_normalization_js_1.buildTargetResolverSignature)(params.channel);
          cacheKey = (0, directory_cache_js_1.buildDirectoryCacheKey)({
            channel: params.channel,
            accountId: params.accountId,
            kind: params.kind,
            source: "cache",
            signature: signature,
          });
          cached = directoryCache.get(cacheKey, params.cfg);
          if (cached) {
            return [2 /*return*/, cached];
          }
          return [
            4 /*yield*/,
            listDirectoryEntries({
              cfg: params.cfg,
              channel: params.channel,
              accountId: params.accountId,
              kind: params.kind,
              query: params.query,
              runtime: params.runtime,
              source: "cache",
            }),
          ];
        case 1:
          entries = _a.sent();
          if (entries.length > 0 || !params.preferLiveOnMiss) {
            directoryCache.set(cacheKey, entries, params.cfg);
            return [2 /*return*/, entries];
          }
          liveKey = (0, directory_cache_js_1.buildDirectoryCacheKey)({
            channel: params.channel,
            accountId: params.accountId,
            kind: params.kind,
            source: "live",
            signature: signature,
          });
          return [
            4 /*yield*/,
            listDirectoryEntries({
              cfg: params.cfg,
              channel: params.channel,
              accountId: params.accountId,
              kind: params.kind,
              query: params.query,
              runtime: params.runtime,
              source: "live",
            }),
          ];
        case 2:
          liveEntries = _a.sent();
          directoryCache.set(liveKey, liveEntries, params.cfg);
          directoryCache.set(cacheKey, liveEntries, params.cfg);
          return [2 /*return*/, liveEntries];
      }
    });
  });
}
function pickAmbiguousMatch(entries, mode) {
  var _a, _b, _c;
  if (entries.length === 0) {
    return null;
  }
  if (mode === "first") {
    return (_a = entries[0]) !== null && _a !== void 0 ? _a : null;
  }
  var ranked = entries.map(function (entry) {
    return {
      entry: entry,
      rank: typeof entry.rank === "number" ? entry.rank : 0,
    };
  });
  var bestRank = Math.max.apply(
    Math,
    ranked.map(function (item) {
      return item.rank;
    }),
  );
  var best =
    (_b = ranked.find(function (item) {
      return item.rank === bestRank;
    })) === null || _b === void 0
      ? void 0
      : _b.entry;
  return (_c = best !== null && best !== void 0 ? best : entries[0]) !== null && _c !== void 0
    ? _c
    : null;
}
function resolveMessagingTarget(params) {
  return __awaiter(this, void 0, void 0, function () {
    var raw,
      plugin,
      providerLabel,
      hint,
      kind,
      normalized,
      looksLikeTargetId,
      directTarget,
      query,
      entries,
      match,
      entry,
      mode,
      best,
      directTarget;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
    return __generator(this, function (_l) {
      switch (_l.label) {
        case 0:
          raw = (0, target_normalization_js_1.normalizeChannelTargetInput)(params.input);
          if (!raw) {
            return [2 /*return*/, { ok: false, error: new Error("Target is required") }];
          }
          plugin = (0, index_js_1.getChannelPlugin)(params.channel);
          providerLabel =
            (_b =
              (_a = plugin === null || plugin === void 0 ? void 0 : plugin.meta) === null ||
              _a === void 0
                ? void 0
                : _a.label) !== null && _b !== void 0
              ? _b
              : params.channel;
          hint =
            (_d =
              (_c = plugin === null || plugin === void 0 ? void 0 : plugin.messaging) === null ||
              _c === void 0
                ? void 0
                : _c.targetResolver) === null || _d === void 0
              ? void 0
              : _d.hint;
          kind = detectTargetKind(params.channel, raw, params.preferredKind);
          normalized =
            (_e = (0, target_normalization_js_1.normalizeTargetForProvider)(
              params.channel,
              raw,
            )) !== null && _e !== void 0
              ? _e
              : raw;
          looksLikeTargetId = function () {
            var _a, _b;
            var trimmed = raw.trim();
            if (!trimmed) {
              return false;
            }
            var lookup =
              (_b =
                (_a = plugin === null || plugin === void 0 ? void 0 : plugin.messaging) === null ||
                _a === void 0
                  ? void 0
                  : _a.targetResolver) === null || _b === void 0
                ? void 0
                : _b.looksLikeId;
            if (lookup) {
              return lookup(trimmed, normalized);
            }
            if (/^(channel|group|user):/i.test(trimmed)) {
              return true;
            }
            if (/^[@#]/.test(trimmed)) {
              return true;
            }
            if (/^\+?\d{6,}$/.test(trimmed)) {
              // BlueBubbles/iMessage phone numbers should usually resolve via the directory to a DM chat,
              // otherwise the provider may pick an existing group containing that handle.
              if (params.channel === "bluebubbles" || params.channel === "imessage") {
                return false;
              }
              return true;
            }
            if (trimmed.includes("@thread")) {
              return true;
            }
            if (/^(conversation|user):/i.test(trimmed)) {
              return true;
            }
            return false;
          };
          if (looksLikeTargetId()) {
            directTarget = preserveTargetCase(params.channel, raw, normalized);
            return [
              2 /*return*/,
              {
                ok: true,
                target: {
                  to: directTarget,
                  kind: kind,
                  display: stripTargetPrefixes(raw),
                  source: "normalized",
                },
              },
            ];
          }
          query = stripTargetPrefixes(raw);
          return [
            4 /*yield*/,
            getDirectoryEntries({
              cfg: params.cfg,
              channel: params.channel,
              accountId: params.accountId,
              kind: kind === "user" ? "user" : "group",
              query: query,
              runtime: params.runtime,
              preferLiveOnMiss: true,
            }),
          ];
        case 1:
          entries = _l.sent();
          match = resolveMatch({ channel: params.channel, entries: entries, query: query });
          if (match.kind === "single") {
            entry = match.entry;
            return [
              2 /*return*/,
              {
                ok: true,
                target: {
                  to: normalizeDirectoryEntryId(params.channel, entry),
                  kind: kind,
                  display:
                    (_g = (_f = entry.name) !== null && _f !== void 0 ? _f : entry.handle) !==
                      null && _g !== void 0
                      ? _g
                      : stripTargetPrefixes(entry.id),
                  source: "directory",
                },
              },
            ];
          }
          if (match.kind === "ambiguous") {
            mode = (_h = params.resolveAmbiguous) !== null && _h !== void 0 ? _h : "error";
            if (mode !== "error") {
              best = pickAmbiguousMatch(match.entries, mode);
              if (best) {
                return [
                  2 /*return*/,
                  {
                    ok: true,
                    target: {
                      to: normalizeDirectoryEntryId(params.channel, best),
                      kind: kind,
                      display:
                        (_k = (_j = best.name) !== null && _j !== void 0 ? _j : best.handle) !==
                          null && _k !== void 0
                          ? _k
                          : stripTargetPrefixes(best.id),
                      source: "directory",
                    },
                  },
                ];
              }
            }
            return [
              2 /*return*/,
              {
                ok: false,
                error: (0, target_errors_js_1.ambiguousTargetError)(providerLabel, raw, hint),
                candidates: match.entries,
              },
            ];
          }
          // For iMessage-style channels, allow sending directly to the normalized handle
          // even if the directory doesn't contain an entry yet.
          if (
            (params.channel === "bluebubbles" || params.channel === "imessage") &&
            /^\+?\d{6,}$/.test(query)
          ) {
            directTarget = preserveTargetCase(params.channel, raw, normalized);
            return [
              2 /*return*/,
              {
                ok: true,
                target: {
                  to: directTarget,
                  kind: kind,
                  display: stripTargetPrefixes(raw),
                  source: "normalized",
                },
              },
            ];
          }
          return [
            2 /*return*/,
            {
              ok: false,
              error: (0, target_errors_js_1.unknownTargetError)(providerLabel, raw, hint),
            },
          ];
      }
    });
  });
}
function lookupDirectoryDisplay(params) {
  return __awaiter(this, void 0, void 0, function () {
    var normalized, _a, groups, users, findMatch, entry;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          normalized =
            (_b = (0, target_normalization_js_1.normalizeTargetForProvider)(
              params.channel,
              params.targetId,
            )) !== null && _b !== void 0
              ? _b
              : params.targetId;
          return [
            4 /*yield*/,
            Promise.all([
              getDirectoryEntries({
                cfg: params.cfg,
                channel: params.channel,
                accountId: params.accountId,
                kind: "group",
                runtime: params.runtime,
                preferLiveOnMiss: false,
              }),
              getDirectoryEntries({
                cfg: params.cfg,
                channel: params.channel,
                accountId: params.accountId,
                kind: "user",
                runtime: params.runtime,
                preferLiveOnMiss: false,
              }),
            ]),
          ];
        case 1:
          ((_a = _f.sent()), (groups = _a[0]), (users = _a[1]));
          findMatch = function (candidates) {
            return candidates.find(function (candidate) {
              return normalizeDirectoryEntryId(params.channel, candidate) === normalized;
            });
          };
          entry = (_c = findMatch(groups)) !== null && _c !== void 0 ? _c : findMatch(users);
          return [
            2 /*return*/,
            (_e =
              (_d = entry === null || entry === void 0 ? void 0 : entry.name) !== null &&
              _d !== void 0
                ? _d
                : entry === null || entry === void 0
                  ? void 0
                  : entry.handle) !== null && _e !== void 0
              ? _e
              : undefined,
          ];
      }
    });
  });
}
