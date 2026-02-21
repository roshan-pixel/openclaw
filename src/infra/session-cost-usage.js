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
var __asyncValues =
  (this && this.__asyncValues) ||
  function (o) {
    if (!Symbol.asyncIterator) {
      throw new TypeError("Symbol.asyncIterator is not defined.");
    }
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o = typeof __values === "function" ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb("next"),
        verb("throw"),
        verb("return"),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            ((v = o[n](v)), settle(resolve, reject, v.done, v.value));
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadCostUsageSummary = loadCostUsageSummary;
exports.loadSessionCostSummary = loadSessionCostSummary;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_readline_1 = require("node:readline");
var usage_js_1 = require("../agents/usage.js");
var paths_js_1 = require("../config/sessions/paths.js");
var usage_format_js_1 = require("../utils/usage-format.js");
var emptyTotals = function () {
  return {
    input: 0,
    output: 0,
    cacheRead: 0,
    cacheWrite: 0,
    totalTokens: 0,
    totalCost: 0,
    missingCostEntries: 0,
  };
};
var toFiniteNumber = function (value) {
  if (typeof value !== "number") {
    return undefined;
  }
  if (!Number.isFinite(value)) {
    return undefined;
  }
  return value;
};
var extractCostTotal = function (usageRaw) {
  if (!usageRaw || typeof usageRaw !== "object") {
    return undefined;
  }
  var record = usageRaw;
  var cost = record.cost;
  var total = toFiniteNumber(cost === null || cost === void 0 ? void 0 : cost.total);
  if (total === undefined) {
    return undefined;
  }
  if (total < 0) {
    return undefined;
  }
  return total;
};
var parseTimestamp = function (entry) {
  var raw = entry.timestamp;
  if (typeof raw === "string") {
    var parsed = new Date(raw);
    if (!Number.isNaN(parsed.valueOf())) {
      return parsed;
    }
  }
  var message = entry.message;
  var messageTimestamp = toFiniteNumber(
    message === null || message === void 0 ? void 0 : message.timestamp,
  );
  if (messageTimestamp !== undefined) {
    var parsed = new Date(messageTimestamp);
    if (!Number.isNaN(parsed.valueOf())) {
      return parsed;
    }
  }
  return undefined;
};
var parseUsageEntry = function (entry) {
  var _a, _b, _c;
  var message = entry.message;
  var role = message === null || message === void 0 ? void 0 : message.role;
  if (role !== "assistant") {
    return null;
  }
  var usageRaw =
    (_a = message === null || message === void 0 ? void 0 : message.usage) !== null && _a !== void 0
      ? _a
      : entry.usage;
  var usage = (0, usage_js_1.normalizeUsage)(usageRaw);
  if (!usage) {
    return null;
  }
  var provider =
    (_b =
      typeof (message === null || message === void 0 ? void 0 : message.provider) === "string"
        ? message === null || message === void 0
          ? void 0
          : message.provider
        : undefined) !== null && _b !== void 0
      ? _b
      : typeof entry.provider === "string"
        ? entry.provider
        : undefined;
  var model =
    (_c =
      typeof (message === null || message === void 0 ? void 0 : message.model) === "string"
        ? message === null || message === void 0
          ? void 0
          : message.model
        : undefined) !== null && _c !== void 0
      ? _c
      : typeof entry.model === "string"
        ? entry.model
        : undefined;
  return {
    usage: usage,
    costTotal: extractCostTotal(usageRaw),
    provider: provider,
    model: model,
    timestamp: parseTimestamp(entry),
  };
};
var formatDayKey = function (date) {
  return date.toLocaleDateString("en-CA", {
    timeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
  });
};
var applyUsageTotals = function (totals, usage) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j;
  totals.input += (_a = usage.input) !== null && _a !== void 0 ? _a : 0;
  totals.output += (_b = usage.output) !== null && _b !== void 0 ? _b : 0;
  totals.cacheRead += (_c = usage.cacheRead) !== null && _c !== void 0 ? _c : 0;
  totals.cacheWrite += (_d = usage.cacheWrite) !== null && _d !== void 0 ? _d : 0;
  var totalTokens =
    (_e = usage.total) !== null && _e !== void 0
      ? _e
      : ((_f = usage.input) !== null && _f !== void 0 ? _f : 0) +
        ((_g = usage.output) !== null && _g !== void 0 ? _g : 0) +
        ((_h = usage.cacheRead) !== null && _h !== void 0 ? _h : 0) +
        ((_j = usage.cacheWrite) !== null && _j !== void 0 ? _j : 0);
  totals.totalTokens += totalTokens;
};
var applyCostTotal = function (totals, costTotal) {
  if (costTotal === undefined) {
    totals.missingCostEntries += 1;
    return;
  }
  totals.totalCost += costTotal;
};
function scanUsageFile(params) {
  return __awaiter(this, void 0, void 0, function () {
    var fileStream, rl, _a, rl_1, rl_1_1, line, trimmed, parsed, entry, cost, e_1_1;
    var _b, e_1, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          fileStream = node_fs_1.default.createReadStream(params.filePath, { encoding: "utf-8" });
          rl = node_readline_1.default.createInterface({ input: fileStream, crlfDelay: Infinity });
          _e.label = 1;
        case 1:
          _e.trys.push([1, 6, 7, 12]);
          ((_a = true), (rl_1 = __asyncValues(rl)));
          _e.label = 2;
        case 2:
          return [4 /*yield*/, rl_1.next()];
        case 3:
          if (!((rl_1_1 = _e.sent()), (_b = rl_1_1.done), !_b)) {
            return [3 /*break*/, 5];
          }
          _d = rl_1_1.value;
          _a = false;
          line = _d;
          trimmed = line.trim();
          if (!trimmed) {
            return [3 /*break*/, 4];
          }
          try {
            parsed = JSON.parse(trimmed);
            entry = parseUsageEntry(parsed);
            if (!entry) {
              return [3 /*break*/, 4];
            }
            if (entry.costTotal === undefined) {
              cost = (0, usage_format_js_1.resolveModelCostConfig)({
                provider: entry.provider,
                model: entry.model,
                config: params.config,
              });
              entry.costTotal = (0, usage_format_js_1.estimateUsageCost)({
                usage: entry.usage,
                cost: cost,
              });
            }
            params.onEntry(entry);
          } catch (_f) {
            // Ignore malformed lines
          }
          _e.label = 4;
        case 4:
          _a = true;
          return [3 /*break*/, 2];
        case 5:
          return [3 /*break*/, 12];
        case 6:
          e_1_1 = _e.sent();
          e_1 = { error: e_1_1 };
          return [3 /*break*/, 12];
        case 7:
          _e.trys.push([7, , 10, 11]);
          if (!(!_a && !_b && (_c = rl_1.return))) {
            return [3 /*break*/, 9];
          }
          return [4 /*yield*/, _c.call(rl_1)];
        case 8:
          _e.sent();
          _e.label = 9;
        case 9:
          return [3 /*break*/, 11];
        case 10:
          if (e_1) {
            throw e_1.error;
          }
          return [7 /*endfinally*/];
        case 11:
          return [7 /*endfinally*/];
        case 12:
          return [2 /*return*/];
      }
    });
  });
}
function loadCostUsageSummary(params) {
  return __awaiter(this, void 0, void 0, function () {
    var days,
      now,
      since,
      sinceTime,
      dailyMap,
      totals,
      sessionsDir,
      entries,
      files,
      _i,
      files_1,
      filePath,
      daily;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          days = Math.max(
            1,
            Math.floor(
              (_a = params === null || params === void 0 ? void 0 : params.days) !== null &&
                _a !== void 0
                ? _a
                : 30,
            ),
          );
          now = new Date();
          since = new Date(now);
          since.setDate(since.getDate() - (days - 1));
          sinceTime = since.getTime();
          dailyMap = new Map();
          totals = emptyTotals();
          sessionsDir = (0, paths_js_1.resolveSessionTranscriptsDirForAgent)(
            params === null || params === void 0 ? void 0 : params.agentId,
          );
          return [
            4 /*yield*/,
            node_fs_1.default.promises
              .readdir(sessionsDir, { withFileTypes: true })
              .catch(function () {
                return [];
              }),
          ];
        case 1:
          entries = _b.sent();
          return [
            4 /*yield*/,
            Promise.all(
              entries
                .filter(function (entry) {
                  return entry.isFile() && entry.name.endsWith(".jsonl");
                })
                .map(function (entry) {
                  return __awaiter(_this, void 0, void 0, function () {
                    var filePath, stats;
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          filePath = node_path_1.default.join(sessionsDir, entry.name);
                          return [
                            4 /*yield*/,
                            node_fs_1.default.promises.stat(filePath).catch(function () {
                              return null;
                            }),
                          ];
                        case 1:
                          stats = _a.sent();
                          if (!stats) {
                            return [2 /*return*/, null];
                          }
                          if (stats.mtimeMs < sinceTime) {
                            return [2 /*return*/, null];
                          }
                          return [2 /*return*/, filePath];
                      }
                    });
                  });
                }),
            ),
          ];
        case 2:
          files = _b.sent().filter(function (filePath) {
            return Boolean(filePath);
          });
          ((_i = 0), (files_1 = files));
          _b.label = 3;
        case 3:
          if (!(_i < files_1.length)) {
            return [3 /*break*/, 6];
          }
          filePath = files_1[_i];
          return [
            4 /*yield*/,
            scanUsageFile({
              filePath: filePath,
              config: params === null || params === void 0 ? void 0 : params.config,
              onEntry: function (entry) {
                var _a, _b, _c;
                var ts = (_a = entry.timestamp) === null || _a === void 0 ? void 0 : _a.getTime();
                if (!ts || ts < sinceTime) {
                  return;
                }
                var dayKey = formatDayKey(
                  (_b = entry.timestamp) !== null && _b !== void 0 ? _b : now,
                );
                var bucket =
                  (_c = dailyMap.get(dayKey)) !== null && _c !== void 0 ? _c : emptyTotals();
                applyUsageTotals(bucket, entry.usage);
                applyCostTotal(bucket, entry.costTotal);
                dailyMap.set(dayKey, bucket);
                applyUsageTotals(totals, entry.usage);
                applyCostTotal(totals, entry.costTotal);
              },
            }),
          ];
        case 4:
          _b.sent();
          _b.label = 5;
        case 5:
          _i++;
          return [3 /*break*/, 3];
        case 6:
          daily = Array.from(dailyMap.entries())
            .map(function (_a) {
              var date = _a[0],
                bucket = _a[1];
              return __assign({ date: date }, bucket);
            })
            .toSorted(function (a, b) {
              return a.date.localeCompare(b.date);
            });
          return [
            2 /*return*/,
            {
              updatedAt: Date.now(),
              days: days,
              daily: daily,
              totals: totals,
            },
          ];
      }
    });
  });
}
function loadSessionCostSummary(params) {
  return __awaiter(this, void 0, void 0, function () {
    var sessionFile, totals, lastActivity;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          sessionFile =
            (_a = params.sessionFile) !== null && _a !== void 0
              ? _a
              : params.sessionId
                ? (0, paths_js_1.resolveSessionFilePath)(params.sessionId, params.sessionEntry)
                : undefined;
          if (!sessionFile || !node_fs_1.default.existsSync(sessionFile)) {
            return [2 /*return*/, null];
          }
          totals = emptyTotals();
          return [
            4 /*yield*/,
            scanUsageFile({
              filePath: sessionFile,
              config: params.config,
              onEntry: function (entry) {
                var _a;
                applyUsageTotals(totals, entry.usage);
                applyCostTotal(totals, entry.costTotal);
                var ts = (_a = entry.timestamp) === null || _a === void 0 ? void 0 : _a.getTime();
                if (ts && (!lastActivity || ts > lastActivity)) {
                  lastActivity = ts;
                }
              },
            }),
          ];
        case 1:
          _b.sent();
          return [
            2 /*return*/,
            __assign(
              { sessionId: params.sessionId, sessionFile: sessionFile, lastActivity: lastActivity },
              totals,
            ),
          ];
      }
    });
  });
}
