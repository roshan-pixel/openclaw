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
exports.prependSystemEvents = prependSystemEvents;
exports.ensureSkillSnapshot = ensureSkillSnapshot;
exports.incrementCompactionCount = incrementCompactionCount;
var node_crypto_1 = require("node:crypto");
var date_time_js_1 = require("../../agents/date-time.js");
var skills_js_1 = require("../../agents/skills.js");
var refresh_js_1 = require("../../agents/skills/refresh.js");
var sessions_js_1 = require("../../config/sessions.js");
var channel_summary_js_1 = require("../../infra/channel-summary.js");
var skills_remote_js_1 = require("../../infra/skills-remote.js");
var system_events_js_1 = require("../../infra/system-events.js");
function prependSystemEvents(params) {
  return __awaiter(this, void 0, void 0, function () {
    var compactSystemEvent,
      resolveExplicitTimezone,
      resolveSystemEventTimezone,
      formatUtcTimestamp,
      formatZonedTimestamp,
      formatSystemEventTimestamp,
      systemLines,
      queued,
      summary,
      block;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          compactSystemEvent = function (line) {
            var trimmed = line.trim();
            if (!trimmed) {
              return null;
            }
            var lower = trimmed.toLowerCase();
            if (lower.includes("reason periodic")) {
              return null;
            }
            // Filter out the actual heartbeat prompt, but not cron jobs that mention "heartbeat"
            // The heartbeat prompt starts with "Read HEARTBEAT.md" - cron payloads won't match this
            if (lower.startsWith("read heartbeat.md")) {
              return null;
            }
            // Also filter heartbeat poll/wake noise
            if (lower.includes("heartbeat poll") || lower.includes("heartbeat wake")) {
              return null;
            }
            if (trimmed.startsWith("Node:")) {
              return trimmed.replace(/ · last input [^·]+/i, "").trim();
            }
            return trimmed;
          };
          resolveExplicitTimezone = function (value) {
            try {
              new Intl.DateTimeFormat("en-US", { timeZone: value }).format(new Date());
              return value;
            } catch (_a) {
              return undefined;
            }
          };
          resolveSystemEventTimezone = function (cfg) {
            var _a, _b, _c, _d, _e;
            var raw =
              (_c =
                (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) ===
                  null || _b === void 0
                  ? void 0
                  : _b.envelopeTimezone) === null || _c === void 0
                ? void 0
                : _c.trim();
            if (!raw) {
              return { mode: "local" };
            }
            var lowered = raw.toLowerCase();
            if (lowered === "utc" || lowered === "gmt") {
              return { mode: "utc" };
            }
            if (lowered === "local" || lowered === "host") {
              return { mode: "local" };
            }
            if (lowered === "user") {
              return {
                mode: "iana",
                timeZone: (0, date_time_js_1.resolveUserTimezone)(
                  (_e = (_d = cfg.agents) === null || _d === void 0 ? void 0 : _d.defaults) ===
                    null || _e === void 0
                    ? void 0
                    : _e.userTimezone,
                ),
              };
            }
            var explicit = resolveExplicitTimezone(raw);
            return explicit ? { mode: "iana", timeZone: explicit } : { mode: "local" };
          };
          formatUtcTimestamp = function (date) {
            var yyyy = String(date.getUTCFullYear()).padStart(4, "0");
            var mm = String(date.getUTCMonth() + 1).padStart(2, "0");
            var dd = String(date.getUTCDate()).padStart(2, "0");
            var hh = String(date.getUTCHours()).padStart(2, "0");
            var min = String(date.getUTCMinutes()).padStart(2, "0");
            var sec = String(date.getUTCSeconds()).padStart(2, "0");
            return ""
              .concat(yyyy, "-")
              .concat(mm, "-")
              .concat(dd, "T")
              .concat(hh, ":")
              .concat(min, ":")
              .concat(sec, "Z");
          };
          formatZonedTimestamp = function (date, timeZone) {
            var _a, _b;
            var parts = new Intl.DateTimeFormat("en-US", {
              timeZone: timeZone,
              year: "numeric",
              month: "2-digit",
              day: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
              second: "2-digit",
              hourCycle: "h23",
              timeZoneName: "short",
            }).formatToParts(date);
            var pick = function (type) {
              var _a;
              return (_a = parts.find(function (part) {
                return part.type === type;
              })) === null || _a === void 0
                ? void 0
                : _a.value;
            };
            var yyyy = pick("year");
            var mm = pick("month");
            var dd = pick("day");
            var hh = pick("hour");
            var min = pick("minute");
            var sec = pick("second");
            var tz =
              (_b =
                (_a = __spreadArray([], parts, true)
                  .toReversed()
                  .find(function (part) {
                    return part.type === "timeZoneName";
                  })) === null || _a === void 0
                  ? void 0
                  : _a.value) === null || _b === void 0
                ? void 0
                : _b.trim();
            if (!yyyy || !mm || !dd || !hh || !min || !sec) {
              return undefined;
            }
            return ""
              .concat(yyyy, "-")
              .concat(mm, "-")
              .concat(dd, " ")
              .concat(hh, ":")
              .concat(min, ":")
              .concat(sec)
              .concat(tz ? " ".concat(tz) : "");
          };
          formatSystemEventTimestamp = function (ts, cfg) {
            var _a, _b;
            var date = new Date(ts);
            if (Number.isNaN(date.getTime())) {
              return "unknown-time";
            }
            var zone = resolveSystemEventTimezone(cfg);
            if (zone.mode === "utc") {
              return formatUtcTimestamp(date);
            }
            if (zone.mode === "local") {
              return (_a = formatZonedTimestamp(date)) !== null && _a !== void 0
                ? _a
                : "unknown-time";
            }
            return (_b = formatZonedTimestamp(date, zone.timeZone)) !== null && _b !== void 0
              ? _b
              : "unknown-time";
          };
          systemLines = [];
          queued = (0, system_events_js_1.drainSystemEventEntries)(params.sessionKey);
          systemLines.push.apply(
            systemLines,
            queued
              .map(function (event) {
                var compacted = compactSystemEvent(event.text);
                if (!compacted) {
                  return null;
                }
                return "["
                  .concat(formatSystemEventTimestamp(event.ts, params.cfg), "] ")
                  .concat(compacted);
              })
              .filter(function (v) {
                return Boolean(v);
              }),
          );
          if (!(params.isMainSession && params.isNewSession)) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, (0, channel_summary_js_1.buildChannelSummary)(params.cfg)];
        case 1:
          summary = _a.sent();
          if (summary.length > 0) {
            systemLines.unshift.apply(systemLines, summary);
          }
          _a.label = 2;
        case 2:
          if (systemLines.length === 0) {
            return [2 /*return*/, params.prefixedBodyBase];
          }
          block = systemLines
            .map(function (l) {
              return "System: ".concat(l);
            })
            .join("\n");
          return [2 /*return*/, "".concat(block, "\n\n").concat(params.prefixedBodyBase)];
      }
    });
  });
}
function ensureSkillSnapshot(params) {
  return __awaiter(this, void 0, void 0, function () {
    var sessionEntry,
      sessionStore,
      sessionKey,
      storePath,
      sessionId,
      isFirstTurnInSession,
      workspaceDir,
      cfg,
      skillFilter,
      nextEntry,
      systemSent,
      remoteEligibility,
      snapshotVersion,
      shouldRefreshSnapshot,
      current,
      skillSnapshot,
      skillsSnapshot,
      current;
    var _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          ((sessionEntry = params.sessionEntry),
            (sessionStore = params.sessionStore),
            (sessionKey = params.sessionKey),
            (storePath = params.storePath),
            (sessionId = params.sessionId),
            (isFirstTurnInSession = params.isFirstTurnInSession),
            (workspaceDir = params.workspaceDir),
            (cfg = params.cfg),
            (skillFilter = params.skillFilter));
          nextEntry = sessionEntry;
          systemSent =
            (_a =
              sessionEntry === null || sessionEntry === void 0
                ? void 0
                : sessionEntry.systemSent) !== null && _a !== void 0
              ? _a
              : false;
          remoteEligibility = (0, skills_remote_js_1.getRemoteSkillEligibility)();
          snapshotVersion = (0, refresh_js_1.getSkillsSnapshotVersion)(workspaceDir);
          (0, refresh_js_1.ensureSkillsWatcher)({ workspaceDir: workspaceDir, config: cfg });
          shouldRefreshSnapshot =
            snapshotVersion > 0 &&
            ((_c =
              (_b =
                nextEntry === null || nextEntry === void 0 ? void 0 : nextEntry.skillsSnapshot) ===
                null || _b === void 0
                ? void 0
                : _b.version) !== null && _c !== void 0
              ? _c
              : 0) < snapshotVersion;
          if (!(isFirstTurnInSession && sessionStore && sessionKey)) {
            return [3 /*break*/, 3];
          }
          current =
            (_d =
              nextEntry !== null && nextEntry !== void 0 ? nextEntry : sessionStore[sessionKey]) !==
              null && _d !== void 0
              ? _d
              : {
                  sessionId:
                    sessionId !== null && sessionId !== void 0
                      ? sessionId
                      : node_crypto_1.default.randomUUID(),
                  updatedAt: Date.now(),
                };
          skillSnapshot =
            isFirstTurnInSession || !current.skillsSnapshot || shouldRefreshSnapshot
              ? (0, skills_js_1.buildWorkspaceSkillSnapshot)(workspaceDir, {
                  config: cfg,
                  skillFilter: skillFilter,
                  eligibility: { remote: remoteEligibility },
                  snapshotVersion: snapshotVersion,
                })
              : current.skillsSnapshot;
          nextEntry = __assign(__assign({}, current), {
            sessionId:
              (_e = sessionId !== null && sessionId !== void 0 ? sessionId : current.sessionId) !==
                null && _e !== void 0
                ? _e
                : node_crypto_1.default.randomUUID(),
            updatedAt: Date.now(),
            systemSent: true,
            skillsSnapshot: skillSnapshot,
          });
          sessionStore[sessionKey] = __assign(__assign({}, sessionStore[sessionKey]), nextEntry);
          if (!storePath) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
              store[sessionKey] = __assign(__assign({}, store[sessionKey]), nextEntry);
            }),
          ];
        case 1:
          _h.sent();
          _h.label = 2;
        case 2:
          systemSent = true;
          _h.label = 3;
        case 3:
          skillsSnapshot = shouldRefreshSnapshot
            ? (0, skills_js_1.buildWorkspaceSkillSnapshot)(workspaceDir, {
                config: cfg,
                skillFilter: skillFilter,
                eligibility: { remote: remoteEligibility },
                snapshotVersion: snapshotVersion,
              })
            : (_f =
                  nextEntry === null || nextEntry === void 0
                    ? void 0
                    : nextEntry.skillsSnapshot) !== null && _f !== void 0
              ? _f
              : isFirstTurnInSession
                ? undefined
                : (0, skills_js_1.buildWorkspaceSkillSnapshot)(workspaceDir, {
                    config: cfg,
                    skillFilter: skillFilter,
                    eligibility: { remote: remoteEligibility },
                    snapshotVersion: snapshotVersion,
                  });
          if (
            !(
              skillsSnapshot &&
              sessionStore &&
              sessionKey &&
              !isFirstTurnInSession &&
              (!(nextEntry === null || nextEntry === void 0 ? void 0 : nextEntry.skillsSnapshot) ||
                shouldRefreshSnapshot)
            )
          ) {
            return [3 /*break*/, 5];
          }
          current =
            nextEntry !== null && nextEntry !== void 0
              ? nextEntry
              : {
                  sessionId:
                    sessionId !== null && sessionId !== void 0
                      ? sessionId
                      : node_crypto_1.default.randomUUID(),
                  updatedAt: Date.now(),
                };
          nextEntry = __assign(__assign({}, current), {
            sessionId:
              (_g = sessionId !== null && sessionId !== void 0 ? sessionId : current.sessionId) !==
                null && _g !== void 0
                ? _g
                : node_crypto_1.default.randomUUID(),
            updatedAt: Date.now(),
            skillsSnapshot: skillsSnapshot,
          });
          sessionStore[sessionKey] = __assign(__assign({}, sessionStore[sessionKey]), nextEntry);
          if (!storePath) {
            return [3 /*break*/, 5];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
              store[sessionKey] = __assign(__assign({}, store[sessionKey]), nextEntry);
            }),
          ];
        case 4:
          _h.sent();
          _h.label = 5;
        case 5:
          return [
            2 /*return*/,
            { sessionEntry: nextEntry, skillsSnapshot: skillsSnapshot, systemSent: systemSent },
          ];
      }
    });
  });
}
function incrementCompactionCount(params) {
  return __awaiter(this, void 0, void 0, function () {
    var sessionEntry,
      sessionStore,
      sessionKey,
      storePath,
      _a,
      now,
      tokensAfter,
      entry,
      nextCount,
      updates;
    var _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          ((sessionEntry = params.sessionEntry),
            (sessionStore = params.sessionStore),
            (sessionKey = params.sessionKey),
            (storePath = params.storePath),
            (_a = params.now),
            (now = _a === void 0 ? Date.now() : _a),
            (tokensAfter = params.tokensAfter));
          if (!sessionStore || !sessionKey) {
            return [2 /*return*/, undefined];
          }
          entry = (_b = sessionStore[sessionKey]) !== null && _b !== void 0 ? _b : sessionEntry;
          if (!entry) {
            return [2 /*return*/, undefined];
          }
          nextCount = ((_c = entry.compactionCount) !== null && _c !== void 0 ? _c : 0) + 1;
          updates = {
            compactionCount: nextCount,
            updatedAt: now,
          };
          // If tokensAfter is provided, update the cached token counts to reflect post-compaction state
          if (tokensAfter != null && tokensAfter > 0) {
            updates.totalTokens = tokensAfter;
            // Clear input/output breakdown since we only have the total estimate after compaction
            updates.inputTokens = undefined;
            updates.outputTokens = undefined;
          }
          sessionStore[sessionKey] = __assign(__assign({}, entry), updates);
          if (!storePath) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
              store[sessionKey] = __assign(__assign({}, store[sessionKey]), updates);
            }),
          ];
        case 1:
          _d.sent();
          _d.label = 2;
        case 2:
          return [2 /*return*/, nextCount];
      }
    });
  });
}
