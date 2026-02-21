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
exports.runMemoryStatus = runMemoryStatus;
exports.registerMemoryCli = registerMemoryCli;
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var config_js_1 = require("../config/config.js");
var paths_js_1 = require("../config/sessions/paths.js");
var globals_js_1 = require("../globals.js");
var progress_js_1 = require("./progress.js");
var cli_utils_js_1 = require("./cli-utils.js");
var index_js_1 = require("../memory/index.js");
var internal_js_1 = require("../memory/internal.js");
var runtime_js_1 = require("../runtime.js");
var links_js_1 = require("../terminal/links.js");
var theme_js_1 = require("../terminal/theme.js");
var paths_js_2 = require("../config/paths.js");
var utils_js_1 = require("../utils.js");
function formatSourceLabel(source, workspaceDir, agentId) {
  if (source === "memory") {
    return (0, utils_js_1.shortenHomeInString)(
      "memory (MEMORY.md + "
        .concat(node_path_1.default.join(workspaceDir, "memory"))
        .concat(node_path_1.default.sep, "*.md)"),
    );
  }
  if (source === "sessions") {
    var stateDir = (0, paths_js_2.resolveStateDir)(process.env, node_os_1.default.homedir);
    return (0, utils_js_1.shortenHomeInString)(
      "sessions ("
        .concat(node_path_1.default.join(stateDir, "agents", agentId, "sessions"))
        .concat(node_path_1.default.sep, "*.jsonl)"),
    );
  }
  return source;
}
function resolveAgent(cfg, agent) {
  var trimmed = agent === null || agent === void 0 ? void 0 : agent.trim();
  if (trimmed) {
    return trimmed;
  }
  return (0, agent_scope_js_1.resolveDefaultAgentId)(cfg);
}
function resolveAgentIds(cfg, agent) {
  var _a, _b;
  var trimmed = agent === null || agent === void 0 ? void 0 : agent.trim();
  if (trimmed) {
    return [trimmed];
  }
  var list =
    (_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.list) !== null && _b !== void 0
      ? _b
      : [];
  if (list.length > 0) {
    return list
      .map(function (entry) {
        return entry.id;
      })
      .filter(Boolean);
  }
  return [(0, agent_scope_js_1.resolveDefaultAgentId)(cfg)];
}
function formatExtraPaths(workspaceDir, extraPaths) {
  return (0, internal_js_1.normalizeExtraMemoryPaths)(workspaceDir, extraPaths).map(
    function (entry) {
      return (0, utils_js_1.shortenHomePath)(entry);
    },
  );
}
function checkReadableFile(pathname) {
  return __awaiter(this, void 0, void 0, function () {
    var err_1, code;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          return [
            4 /*yield*/,
            promises_1.default.access(pathname, node_fs_1.default.constants.R_OK),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/, { exists: true }];
        case 2:
          err_1 = _a.sent();
          code = err_1.code;
          if (code === "ENOENT") {
            return [2 /*return*/, { exists: false }];
          }
          return [
            2 /*return*/,
            {
              exists: true,
              issue: ""
                .concat((0, utils_js_1.shortenHomePath)(pathname), " not readable (")
                .concat(code !== null && code !== void 0 ? code : "error", ")"),
            },
          ];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function scanSessionFiles(agentId) {
  return __awaiter(this, void 0, void 0, function () {
    var issues, sessionsDir, entries, totalFiles, err_2, code;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          issues = [];
          sessionsDir = (0, paths_js_1.resolveSessionTranscriptsDirForAgent)(agentId);
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [4 /*yield*/, promises_1.default.readdir(sessionsDir, { withFileTypes: true })];
        case 2:
          entries = _a.sent();
          totalFiles = entries.filter(function (entry) {
            return entry.isFile() && entry.name.endsWith(".jsonl");
          }).length;
          return [2 /*return*/, { source: "sessions", totalFiles: totalFiles, issues: issues }];
        case 3:
          err_2 = _a.sent();
          code = err_2.code;
          if (code === "ENOENT") {
            issues.push(
              "sessions directory missing (".concat(
                (0, utils_js_1.shortenHomePath)(sessionsDir),
                ")",
              ),
            );
            return [2 /*return*/, { source: "sessions", totalFiles: 0, issues: issues }];
          }
          issues.push(
            "sessions directory not accessible ("
              .concat((0, utils_js_1.shortenHomePath)(sessionsDir), "): ")
              .concat(code !== null && code !== void 0 ? code : "error"),
          );
          return [2 /*return*/, { source: "sessions", totalFiles: null, issues: issues }];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function scanMemoryFiles(workspaceDir_1) {
  return __awaiter(this, arguments, void 0, function (workspaceDir, extraPaths) {
    var issues,
      memoryFile,
      altMemoryFile,
      memoryDir,
      primary,
      alt,
      resolvedExtraPaths,
      _i,
      resolvedExtraPaths_1,
      extraPath,
      stat,
      extraCheck,
      err_3,
      code,
      dirReadable,
      err_4,
      code,
      listed,
      listedOk,
      err_5,
      code,
      totalFiles,
      files;
    if (extraPaths === void 0) {
      extraPaths = [];
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          issues = [];
          memoryFile = node_path_1.default.join(workspaceDir, "MEMORY.md");
          altMemoryFile = node_path_1.default.join(workspaceDir, "memory.md");
          memoryDir = node_path_1.default.join(workspaceDir, "memory");
          return [4 /*yield*/, checkReadableFile(memoryFile)];
        case 1:
          primary = _a.sent();
          return [4 /*yield*/, checkReadableFile(altMemoryFile)];
        case 2:
          alt = _a.sent();
          if (primary.issue) {
            issues.push(primary.issue);
          }
          if (alt.issue) {
            issues.push(alt.issue);
          }
          resolvedExtraPaths = (0, internal_js_1.normalizeExtraMemoryPaths)(
            workspaceDir,
            extraPaths,
          );
          ((_i = 0), (resolvedExtraPaths_1 = resolvedExtraPaths));
          _a.label = 3;
        case 3:
          if (!(_i < resolvedExtraPaths_1.length)) {
            return [3 /*break*/, 9];
          }
          extraPath = resolvedExtraPaths_1[_i];
          _a.label = 4;
        case 4:
          _a.trys.push([4, 7, , 8]);
          return [4 /*yield*/, promises_1.default.lstat(extraPath)];
        case 5:
          stat = _a.sent();
          if (stat.isSymbolicLink()) {
            return [3 /*break*/, 8];
          }
          return [4 /*yield*/, checkReadableFile(extraPath)];
        case 6:
          extraCheck = _a.sent();
          if (extraCheck.issue) {
            issues.push(extraCheck.issue);
          }
          return [3 /*break*/, 8];
        case 7:
          err_3 = _a.sent();
          code = err_3.code;
          if (code === "ENOENT") {
            issues.push(
              "additional memory path missing (".concat(
                (0, utils_js_1.shortenHomePath)(extraPath),
                ")",
              ),
            );
          } else {
            issues.push(
              "additional memory path not accessible ("
                .concat((0, utils_js_1.shortenHomePath)(extraPath), "): ")
                .concat(code !== null && code !== void 0 ? code : "error"),
            );
          }
          return [3 /*break*/, 8];
        case 8:
          _i++;
          return [3 /*break*/, 3];
        case 9:
          dirReadable = null;
          _a.label = 10;
        case 10:
          _a.trys.push([10, 12, , 13]);
          return [
            4 /*yield*/,
            promises_1.default.access(memoryDir, node_fs_1.default.constants.R_OK),
          ];
        case 11:
          _a.sent();
          dirReadable = true;
          return [3 /*break*/, 13];
        case 12:
          err_4 = _a.sent();
          code = err_4.code;
          if (code === "ENOENT") {
            issues.push(
              "memory directory missing (".concat((0, utils_js_1.shortenHomePath)(memoryDir), ")"),
            );
            dirReadable = false;
          } else {
            issues.push(
              "memory directory not accessible ("
                .concat((0, utils_js_1.shortenHomePath)(memoryDir), "): ")
                .concat(code !== null && code !== void 0 ? code : "error"),
            );
            dirReadable = null;
          }
          return [3 /*break*/, 13];
        case 13:
          listed = [];
          listedOk = false;
          _a.label = 14;
        case 14:
          _a.trys.push([14, 16, , 17]);
          return [
            4 /*yield*/,
            (0, internal_js_1.listMemoryFiles)(workspaceDir, resolvedExtraPaths),
          ];
        case 15:
          listed = _a.sent();
          listedOk = true;
          return [3 /*break*/, 17];
        case 16:
          err_5 = _a.sent();
          code = err_5.code;
          if (dirReadable !== null) {
            issues.push(
              "memory directory scan failed ("
                .concat((0, utils_js_1.shortenHomePath)(memoryDir), "): ")
                .concat(code !== null && code !== void 0 ? code : "error"),
            );
            dirReadable = null;
          }
          return [3 /*break*/, 17];
        case 17:
          totalFiles = 0;
          if (dirReadable === null) {
            totalFiles = null;
          } else {
            files = new Set(listedOk ? listed : []);
            if (!listedOk) {
              if (primary.exists) {
                files.add(memoryFile);
              }
              if (alt.exists) {
                files.add(altMemoryFile);
              }
            }
            totalFiles = files.size;
          }
          if (
            (totalFiles !== null && totalFiles !== void 0 ? totalFiles : 0) === 0 &&
            issues.length === 0
          ) {
            issues.push(
              "no memory files found in ".concat((0, utils_js_1.shortenHomePath)(workspaceDir)),
            );
          }
          return [2 /*return*/, { source: "memory", totalFiles: totalFiles, issues: issues }];
      }
    });
  });
}
function scanMemorySources(params) {
  return __awaiter(this, void 0, void 0, function () {
    var scans,
      extraPaths,
      _i,
      _a,
      source,
      _b,
      _c,
      _d,
      _e,
      issues,
      totals,
      numericTotals,
      totalFiles;
    var _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          scans = [];
          extraPaths = (_f = params.extraPaths) !== null && _f !== void 0 ? _f : [];
          ((_i = 0), (_a = params.sources));
          _g.label = 1;
        case 1:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 6];
          }
          source = _a[_i];
          if (!(source === "memory")) {
            return [3 /*break*/, 3];
          }
          _c = (_b = scans).push;
          return [4 /*yield*/, scanMemoryFiles(params.workspaceDir, extraPaths)];
        case 2:
          _c.apply(_b, [_g.sent()]);
          _g.label = 3;
        case 3:
          if (!(source === "sessions")) {
            return [3 /*break*/, 5];
          }
          _e = (_d = scans).push;
          return [4 /*yield*/, scanSessionFiles(params.agentId)];
        case 4:
          _e.apply(_d, [_g.sent()]);
          _g.label = 5;
        case 5:
          _i++;
          return [3 /*break*/, 1];
        case 6:
          issues = scans.flatMap(function (scan) {
            return scan.issues;
          });
          totals = scans.map(function (scan) {
            return scan.totalFiles;
          });
          numericTotals = totals.filter(function (total) {
            return total !== null;
          });
          totalFiles = totals.some(function (total) {
            return total === null;
          })
            ? null
            : numericTotals.reduce(function (sum, total) {
                return sum + total;
              }, 0);
          return [2 /*return*/, { sources: scans, totalFiles: totalFiles, issues: issues }];
      }
    });
  });
}
function runMemoryStatus(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      agentIds,
      allResults,
      _loop_1,
      _i,
      agentIds_1,
      agentId,
      rich,
      heading,
      muted,
      info,
      success,
      warn,
      accent,
      label,
      _a,
      allResults_1,
      result,
      agentId,
      status_1,
      embeddingProbe,
      indexError,
      scan,
      totalFiles,
      indexedLabel,
      line,
      extraPaths,
      lines,
      state,
      stateColor,
      _loop_2,
      _b,
      _c,
      entry,
      vectorState,
      vectorColor,
      ftsState,
      ftsColor,
      cacheState,
      cacheColor,
      suffix,
      batchState,
      batchColor,
      batchSuffix,
      _d,
      _e,
      issue;
    var _this = this;
    var _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
      switch (_m.label) {
        case 0:
          (0, globals_js_1.setVerbose)(Boolean(opts.verbose));
          cfg = (0, config_js_1.loadConfig)();
          agentIds = resolveAgentIds(cfg, opts.agent);
          allResults = [];
          _loop_1 = function (agentId) {
            return __generator(this, function (_o) {
              switch (_o.label) {
                case 0:
                  return [
                    4 /*yield*/,
                    (0, cli_utils_js_1.withManager)({
                      getManager: function () {
                        return (0, index_js_1.getMemorySearchManager)({
                          cfg: cfg,
                          agentId: agentId,
                        });
                      },
                      onMissing: function (error) {
                        return runtime_js_1.defaultRuntime.log(
                          error !== null && error !== void 0 ? error : "Memory search disabled.",
                        );
                      },
                      onCloseError: function (err) {
                        return runtime_js_1.defaultRuntime.error(
                          "Memory manager close failed: ".concat(
                            (0, cli_utils_js_1.formatErrorMessage)(err),
                          ),
                        );
                      },
                      close: function (manager) {
                        return manager.close();
                      },
                      run: function (manager) {
                        return __awaiter(_this, void 0, void 0, function () {
                          var deep, embeddingProbe, indexError, status, sources, scan;
                          var _this = this;
                          var _a;
                          return __generator(this, function (_b) {
                            switch (_b.label) {
                              case 0:
                                deep = Boolean(opts.deep || opts.index);
                                if (!deep) {
                                  return [3 /*break*/, 4];
                                }
                                return [
                                  4 /*yield*/,
                                  (0, progress_js_1.withProgress)(
                                    { label: "Checking memory…", total: 2 },
                                    function (progress) {
                                      return __awaiter(_this, void 0, void 0, function () {
                                        return __generator(this, function (_a) {
                                          switch (_a.label) {
                                            case 0:
                                              progress.setLabel("Probing vector…");
                                              return [
                                                4 /*yield*/,
                                                manager.probeVectorAvailability(),
                                              ];
                                            case 1:
                                              _a.sent();
                                              progress.tick();
                                              progress.setLabel("Probing embeddings…");
                                              return [
                                                4 /*yield*/,
                                                manager.probeEmbeddingAvailability(),
                                              ];
                                            case 2:
                                              embeddingProbe = _a.sent();
                                              progress.tick();
                                              return [2 /*return*/];
                                          }
                                        });
                                      });
                                    },
                                  ),
                                ];
                              case 1:
                                _b.sent();
                                if (!opts.index) {
                                  return [3 /*break*/, 3];
                                }
                                return [
                                  4 /*yield*/,
                                  (0, progress_js_1.withProgressTotals)(
                                    {
                                      label: "Indexing memory…",
                                      total: 0,
                                      fallback: opts.verbose ? "line" : undefined,
                                    },
                                    function (update, progress) {
                                      return __awaiter(_this, void 0, void 0, function () {
                                        var err_6;
                                        return __generator(this, function (_a) {
                                          switch (_a.label) {
                                            case 0:
                                              _a.trys.push([0, 2, , 3]);
                                              return [
                                                4 /*yield*/,
                                                manager.sync({
                                                  reason: "cli",
                                                  progress: function (syncUpdate) {
                                                    update({
                                                      completed: syncUpdate.completed,
                                                      total: syncUpdate.total,
                                                      label: syncUpdate.label,
                                                    });
                                                    if (syncUpdate.label) {
                                                      progress.setLabel(syncUpdate.label);
                                                    }
                                                  },
                                                }),
                                              ];
                                            case 1:
                                              _a.sent();
                                              return [3 /*break*/, 3];
                                            case 2:
                                              err_6 = _a.sent();
                                              indexError = (0, cli_utils_js_1.formatErrorMessage)(
                                                err_6,
                                              );
                                              runtime_js_1.defaultRuntime.error(
                                                "Memory index failed: ".concat(indexError),
                                              );
                                              process.exitCode = 1;
                                              return [3 /*break*/, 3];
                                            case 3:
                                              return [2 /*return*/];
                                          }
                                        });
                                      });
                                    },
                                  ),
                                ];
                              case 2:
                                _b.sent();
                                _b.label = 3;
                              case 3:
                                return [3 /*break*/, 6];
                              case 4:
                                return [4 /*yield*/, manager.probeVectorAvailability()];
                              case 5:
                                _b.sent();
                                _b.label = 6;
                              case 6:
                                status = manager.status();
                                sources = (
                                  (_a = status.sources) === null || _a === void 0
                                    ? void 0
                                    : _a.length
                                )
                                  ? status.sources
                                  : ["memory"];
                                return [
                                  4 /*yield*/,
                                  scanMemorySources({
                                    workspaceDir: status.workspaceDir,
                                    agentId: agentId,
                                    sources: sources,
                                    extraPaths: status.extraPaths,
                                  }),
                                ];
                              case 7:
                                scan = _b.sent();
                                allResults.push({
                                  agentId: agentId,
                                  status: status,
                                  embeddingProbe: embeddingProbe,
                                  indexError: indexError,
                                  scan: scan,
                                });
                                return [2 /*return*/];
                            }
                          });
                        });
                      },
                    }),
                  ];
                case 1:
                  _o.sent();
                  return [2 /*return*/];
              }
            });
          };
          ((_i = 0), (agentIds_1 = agentIds));
          _m.label = 1;
        case 1:
          if (!(_i < agentIds_1.length)) {
            return [3 /*break*/, 4];
          }
          agentId = agentIds_1[_i];
          return [5 /*yield**/, _loop_1(agentId)];
        case 2:
          _m.sent();
          _m.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          if (opts.json) {
            runtime_js_1.defaultRuntime.log(JSON.stringify(allResults, null, 2));
            return [2 /*return*/];
          }
          rich = (0, theme_js_1.isRich)();
          heading = function (text) {
            return (0, theme_js_1.colorize)(rich, theme_js_1.theme.heading, text);
          };
          muted = function (text) {
            return (0, theme_js_1.colorize)(rich, theme_js_1.theme.muted, text);
          };
          info = function (text) {
            return (0, theme_js_1.colorize)(rich, theme_js_1.theme.info, text);
          };
          success = function (text) {
            return (0, theme_js_1.colorize)(rich, theme_js_1.theme.success, text);
          };
          warn = function (text) {
            return (0, theme_js_1.colorize)(rich, theme_js_1.theme.warn, text);
          };
          accent = function (text) {
            return (0, theme_js_1.colorize)(rich, theme_js_1.theme.accent, text);
          };
          label = function (text) {
            return muted("".concat(text, ":"));
          };
          for (_a = 0, allResults_1 = allResults; _a < allResults_1.length; _a++) {
            result = allResults_1[_a];
            ((agentId = result.agentId),
              (status_1 = result.status),
              (embeddingProbe = result.embeddingProbe),
              (indexError = result.indexError),
              (scan = result.scan));
            totalFiles =
              (_f = scan === null || scan === void 0 ? void 0 : scan.totalFiles) !== null &&
              _f !== void 0
                ? _f
                : null;
            indexedLabel =
              totalFiles === null
                ? "".concat(status_1.files, "/? files \u00B7 ").concat(status_1.chunks, " chunks")
                : ""
                    .concat(status_1.files, "/")
                    .concat(totalFiles, " files \u00B7 ")
                    .concat(status_1.chunks, " chunks");
            if (opts.index) {
              line = indexError
                ? "Memory index failed: ".concat(indexError)
                : "Memory index complete.";
              runtime_js_1.defaultRuntime.log(line);
            }
            extraPaths = formatExtraPaths(
              status_1.workspaceDir,
              (_g = status_1.extraPaths) !== null && _g !== void 0 ? _g : [],
            );
            lines = [
              "".concat(heading("Memory Search"), " ").concat(muted("(".concat(agentId, ")"))),
              ""
                .concat(label("Provider"), " ")
                .concat(info(status_1.provider), " ")
                .concat(muted("(requested: ".concat(status_1.requestedProvider, ")"))),
              "".concat(label("Model"), " ").concat(info(status_1.model)),
              ((_h = status_1.sources) === null || _h === void 0 ? void 0 : _h.length)
                ? "".concat(label("Sources"), " ").concat(info(status_1.sources.join(", ")))
                : null,
              extraPaths.length
                ? "".concat(label("Extra paths"), " ").concat(info(extraPaths.join(", ")))
                : null,
              "".concat(label("Indexed"), " ").concat(success(indexedLabel)),
              "".concat(label("Dirty"), " ").concat(status_1.dirty ? warn("yes") : muted("no")),
              ""
                .concat(label("Store"), " ")
                .concat(info((0, utils_js_1.shortenHomePath)(status_1.dbPath))),
              ""
                .concat(label("Workspace"), " ")
                .concat(info((0, utils_js_1.shortenHomePath)(status_1.workspaceDir))),
            ].filter(Boolean);
            if (embeddingProbe) {
              state = embeddingProbe.ok ? "ready" : "unavailable";
              stateColor = embeddingProbe.ok ? theme_js_1.theme.success : theme_js_1.theme.warn;
              lines.push(
                ""
                  .concat(label("Embeddings"), " ")
                  .concat((0, theme_js_1.colorize)(rich, stateColor, state)),
              );
              if (embeddingProbe.error) {
                lines.push(
                  "".concat(label("Embeddings error"), " ").concat(warn(embeddingProbe.error)),
                );
              }
            }
            if ((_j = status_1.sourceCounts) === null || _j === void 0 ? void 0 : _j.length) {
              lines.push(label("By source"));
              _loop_2 = function (entry) {
                var total =
                  (_k =
                    scan === null || scan === void 0
                      ? void 0
                      : scan.sources.find(function (scanEntry) {
                          return scanEntry.source === entry.source;
                        })) === null || _k === void 0
                    ? void 0
                    : _k.totalFiles;
                var counts =
                  total === null
                    ? "".concat(entry.files, "/? files \u00B7 ").concat(entry.chunks, " chunks")
                    : ""
                        .concat(entry.files, "/")
                        .concat(total, " files \u00B7 ")
                        .concat(entry.chunks, " chunks");
                lines.push(
                  "  "
                    .concat(accent(entry.source), " ")
                    .concat(muted("·"), " ")
                    .concat(muted(counts)),
                );
              };
              for (_b = 0, _c = status_1.sourceCounts; _b < _c.length; _b++) {
                entry = _c[_b];
                _loop_2(entry);
              }
            }
            if (status_1.fallback) {
              lines.push("".concat(label("Fallback"), " ").concat(warn(status_1.fallback.from)));
            }
            if (status_1.vector) {
              vectorState = status_1.vector.enabled
                ? status_1.vector.available === undefined
                  ? "unknown"
                  : status_1.vector.available
                    ? "ready"
                    : "unavailable"
                : "disabled";
              vectorColor =
                vectorState === "ready"
                  ? theme_js_1.theme.success
                  : vectorState === "unavailable"
                    ? theme_js_1.theme.warn
                    : theme_js_1.theme.muted;
              lines.push(
                ""
                  .concat(label("Vector"), " ")
                  .concat((0, theme_js_1.colorize)(rich, vectorColor, vectorState)),
              );
              if (status_1.vector.dims) {
                lines.push(
                  "".concat(label("Vector dims"), " ").concat(info(String(status_1.vector.dims))),
                );
              }
              if (status_1.vector.extensionPath) {
                lines.push(
                  ""
                    .concat(label("Vector path"), " ")
                    .concat(info((0, utils_js_1.shortenHomePath)(status_1.vector.extensionPath))),
                );
              }
              if (status_1.vector.loadError) {
                lines.push(
                  "".concat(label("Vector error"), " ").concat(warn(status_1.vector.loadError)),
                );
              }
            }
            if (status_1.fts) {
              ftsState = status_1.fts.enabled
                ? status_1.fts.available
                  ? "ready"
                  : "unavailable"
                : "disabled";
              ftsColor =
                ftsState === "ready"
                  ? theme_js_1.theme.success
                  : ftsState === "unavailable"
                    ? theme_js_1.theme.warn
                    : theme_js_1.theme.muted;
              lines.push(
                ""
                  .concat(label("FTS"), " ")
                  .concat((0, theme_js_1.colorize)(rich, ftsColor, ftsState)),
              );
              if (status_1.fts.error) {
                lines.push("".concat(label("FTS error"), " ").concat(warn(status_1.fts.error)));
              }
            }
            if (status_1.cache) {
              cacheState = status_1.cache.enabled ? "enabled" : "disabled";
              cacheColor = status_1.cache.enabled
                ? theme_js_1.theme.success
                : theme_js_1.theme.muted;
              suffix =
                status_1.cache.enabled && typeof status_1.cache.entries === "number"
                  ? " (".concat(status_1.cache.entries, " entries)")
                  : "";
              lines.push(
                ""
                  .concat(label("Embedding cache"), " ")
                  .concat((0, theme_js_1.colorize)(rich, cacheColor, cacheState))
                  .concat(suffix),
              );
              if (status_1.cache.enabled && typeof status_1.cache.maxEntries === "number") {
                lines.push(
                  ""
                    .concat(label("Cache cap"), " ")
                    .concat(info(String(status_1.cache.maxEntries))),
                );
              }
            }
            if (status_1.batch) {
              batchState = status_1.batch.enabled ? "enabled" : "disabled";
              batchColor = status_1.batch.enabled
                ? theme_js_1.theme.success
                : theme_js_1.theme.warn;
              batchSuffix = " (failures "
                .concat(status_1.batch.failures, "/")
                .concat(status_1.batch.limit, ")");
              lines.push(
                ""
                  .concat(label("Batch"), " ")
                  .concat((0, theme_js_1.colorize)(rich, batchColor, batchState))
                  .concat(muted(batchSuffix)),
              );
              if (status_1.batch.lastError) {
                lines.push(
                  "".concat(label("Batch error"), " ").concat(warn(status_1.batch.lastError)),
                );
              }
            }
            if ((_l = status_1.fallback) === null || _l === void 0 ? void 0 : _l.reason) {
              lines.push(muted(status_1.fallback.reason));
            }
            if (indexError) {
              lines.push("".concat(label("Index error"), " ").concat(warn(indexError)));
            }
            if (scan === null || scan === void 0 ? void 0 : scan.issues.length) {
              lines.push(label("Issues"));
              for (_d = 0, _e = scan.issues; _d < _e.length; _d++) {
                issue = _e[_d];
                lines.push("  ".concat(warn(issue)));
              }
            }
            runtime_js_1.defaultRuntime.log(lines.join("\n"));
            runtime_js_1.defaultRuntime.log("");
          }
          return [2 /*return*/];
      }
    });
  });
}
function registerMemoryCli(program) {
  var _this = this;
  var memory = program
    .command("memory")
    .description("Memory search tools")
    .addHelpText("after", function () {
      return "\n"
        .concat(theme_js_1.theme.muted("Docs:"), " ")
        .concat((0, links_js_1.formatDocsLink)("/cli/memory", "docs.openclaw.ai/cli/memory"), "\n");
    });
  memory
    .command("status")
    .description("Show memory search index status")
    .option("--agent <id>", "Agent id (default: default agent)")
    .option("--json", "Print JSON")
    .option("--deep", "Probe embedding provider availability")
    .option("--index", "Reindex if dirty (implies --deep)")
    .option("--verbose", "Verbose logging", false)
    .action(function (opts) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              return [4 /*yield*/, runMemoryStatus(opts)];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
  memory
    .command("index")
    .description("Reindex memory files")
    .option("--agent <id>", "Agent id (default: default agent)")
    .option("--force", "Force full reindex", false)
    .option("--verbose", "Verbose logging", false)
    .action(function (opts) {
      return __awaiter(_this, void 0, void 0, function () {
        var cfg, agentIds, _loop_3, _i, agentIds_2, agentId;
        var _this = this;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              (0, globals_js_1.setVerbose)(Boolean(opts.verbose));
              cfg = (0, config_js_1.loadConfig)();
              agentIds = resolveAgentIds(cfg, opts.agent);
              _loop_3 = function (agentId) {
                return __generator(this, function (_b) {
                  switch (_b.label) {
                    case 0:
                      return [
                        4 /*yield*/,
                        (0, cli_utils_js_1.withManager)({
                          getManager: function () {
                            return (0, index_js_1.getMemorySearchManager)({
                              cfg: cfg,
                              agentId: agentId,
                            });
                          },
                          onMissing: function (error) {
                            return runtime_js_1.defaultRuntime.log(
                              error !== null && error !== void 0
                                ? error
                                : "Memory search disabled.",
                            );
                          },
                          onCloseError: function (err) {
                            return runtime_js_1.defaultRuntime.error(
                              "Memory manager close failed: ".concat(
                                (0, cli_utils_js_1.formatErrorMessage)(err),
                              ),
                            );
                          },
                          close: function (manager) {
                            return manager.close();
                          },
                          run: function (manager) {
                            return __awaiter(_this, void 0, void 0, function () {
                              var status_2,
                                rich_1,
                                heading,
                                muted_1,
                                info,
                                warn,
                                label,
                                sourceLabels,
                                extraPaths,
                                lines,
                                startedAt_1,
                                lastLabel_1,
                                lastCompleted_1,
                                lastTotal_1,
                                formatElapsed_1,
                                formatEta_1,
                                buildLabel_1,
                                err_7,
                                message;
                              var _this = this;
                              var _a;
                              return __generator(this, function (_b) {
                                switch (_b.label) {
                                  case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    if (opts.verbose) {
                                      status_2 = manager.status();
                                      rich_1 = (0, theme_js_1.isRich)();
                                      heading = function (text) {
                                        return (0, theme_js_1.colorize)(
                                          rich_1,
                                          theme_js_1.theme.heading,
                                          text,
                                        );
                                      };
                                      muted_1 = function (text) {
                                        return (0, theme_js_1.colorize)(
                                          rich_1,
                                          theme_js_1.theme.muted,
                                          text,
                                        );
                                      };
                                      info = function (text) {
                                        return (0, theme_js_1.colorize)(
                                          rich_1,
                                          theme_js_1.theme.info,
                                          text,
                                        );
                                      };
                                      warn = function (text) {
                                        return (0, theme_js_1.colorize)(
                                          rich_1,
                                          theme_js_1.theme.warn,
                                          text,
                                        );
                                      };
                                      label = function (text) {
                                        return muted_1("".concat(text, ":"));
                                      };
                                      sourceLabels = status_2.sources.map(function (source) {
                                        return formatSourceLabel(
                                          source,
                                          status_2.workspaceDir,
                                          agentId,
                                        );
                                      });
                                      extraPaths = formatExtraPaths(
                                        status_2.workspaceDir,
                                        (_a = status_2.extraPaths) !== null && _a !== void 0
                                          ? _a
                                          : [],
                                      );
                                      lines = [
                                        ""
                                          .concat(heading("Memory Index"), " ")
                                          .concat(muted_1("(".concat(agentId, ")"))),
                                        ""
                                          .concat(label("Provider"), " ")
                                          .concat(info(status_2.provider), " ")
                                          .concat(
                                            muted_1(
                                              "(requested: ".concat(
                                                status_2.requestedProvider,
                                                ")",
                                              ),
                                            ),
                                          ),
                                        "".concat(label("Model"), " ").concat(info(status_2.model)),
                                        sourceLabels.length
                                          ? ""
                                              .concat(label("Sources"), " ")
                                              .concat(info(sourceLabels.join(", ")))
                                          : null,
                                        extraPaths.length
                                          ? ""
                                              .concat(label("Extra paths"), " ")
                                              .concat(info(extraPaths.join(", ")))
                                          : null,
                                      ].filter(Boolean);
                                      if (status_2.fallback) {
                                        lines.push(
                                          ""
                                            .concat(label("Fallback"), " ")
                                            .concat(warn(status_2.fallback.from)),
                                        );
                                      }
                                      runtime_js_1.defaultRuntime.log(lines.join("\n"));
                                      runtime_js_1.defaultRuntime.log("");
                                    }
                                    startedAt_1 = Date.now();
                                    lastLabel_1 = "Indexing memory…";
                                    lastCompleted_1 = 0;
                                    lastTotal_1 = 0;
                                    formatElapsed_1 = function () {
                                      var elapsedMs = Math.max(0, Date.now() - startedAt_1);
                                      var seconds = Math.floor(elapsedMs / 1000);
                                      var minutes = Math.floor(seconds / 60);
                                      var remainingSeconds = seconds % 60;
                                      return ""
                                        .concat(minutes, ":")
                                        .concat(String(remainingSeconds).padStart(2, "0"));
                                    };
                                    formatEta_1 = function () {
                                      if (lastTotal_1 <= 0 || lastCompleted_1 <= 0) {
                                        return null;
                                      }
                                      var elapsedMs = Math.max(1, Date.now() - startedAt_1);
                                      var rate = lastCompleted_1 / elapsedMs;
                                      if (!Number.isFinite(rate) || rate <= 0) {
                                        return null;
                                      }
                                      var remainingMs = Math.max(
                                        0,
                                        (lastTotal_1 - lastCompleted_1) / rate,
                                      );
                                      var seconds = Math.floor(remainingMs / 1000);
                                      var minutes = Math.floor(seconds / 60);
                                      var remainingSeconds = seconds % 60;
                                      return ""
                                        .concat(minutes, ":")
                                        .concat(String(remainingSeconds).padStart(2, "0"));
                                    };
                                    buildLabel_1 = function () {
                                      var elapsed = formatElapsed_1();
                                      var eta = formatEta_1();
                                      return eta
                                        ? ""
                                            .concat(lastLabel_1, " \u00B7 elapsed ")
                                            .concat(elapsed, " \u00B7 eta ")
                                            .concat(eta)
                                        : ""
                                            .concat(lastLabel_1, " \u00B7 elapsed ")
                                            .concat(elapsed);
                                    };
                                    return [
                                      4 /*yield*/,
                                      (0, progress_js_1.withProgressTotals)(
                                        {
                                          label: "Indexing memory…",
                                          total: 0,
                                          fallback: opts.verbose ? "line" : undefined,
                                        },
                                        function (update, progress) {
                                          return __awaiter(_this, void 0, void 0, function () {
                                            var interval;
                                            return __generator(this, function (_a) {
                                              switch (_a.label) {
                                                case 0:
                                                  interval = setInterval(function () {
                                                    progress.setLabel(buildLabel_1());
                                                  }, 1000);
                                                  _a.label = 1;
                                                case 1:
                                                  _a.trys.push([1, , 3, 4]);
                                                  return [
                                                    4 /*yield*/,
                                                    manager.sync({
                                                      reason: "cli",
                                                      force: opts.force,
                                                      progress: function (syncUpdate) {
                                                        if (syncUpdate.label) {
                                                          lastLabel_1 = syncUpdate.label;
                                                        }
                                                        lastCompleted_1 = syncUpdate.completed;
                                                        lastTotal_1 = syncUpdate.total;
                                                        update({
                                                          completed: syncUpdate.completed,
                                                          total: syncUpdate.total,
                                                          label: buildLabel_1(),
                                                        });
                                                        progress.setLabel(buildLabel_1());
                                                      },
                                                    }),
                                                  ];
                                                case 2:
                                                  _a.sent();
                                                  return [3 /*break*/, 4];
                                                case 3:
                                                  clearInterval(interval);
                                                  return [7 /*endfinally*/];
                                                case 4:
                                                  return [2 /*return*/];
                                              }
                                            });
                                          });
                                        },
                                      ),
                                    ];
                                  case 1:
                                    _b.sent();
                                    runtime_js_1.defaultRuntime.log(
                                      "Memory index updated (".concat(agentId, ")."),
                                    );
                                    return [3 /*break*/, 3];
                                  case 2:
                                    err_7 = _b.sent();
                                    message = (0, cli_utils_js_1.formatErrorMessage)(err_7);
                                    runtime_js_1.defaultRuntime.error(
                                      "Memory index failed ("
                                        .concat(agentId, "): ")
                                        .concat(message),
                                    );
                                    process.exitCode = 1;
                                    return [3 /*break*/, 3];
                                  case 3:
                                    return [2 /*return*/];
                                }
                              });
                            });
                          },
                        }),
                      ];
                    case 1:
                      _b.sent();
                      return [2 /*return*/];
                  }
                });
              };
              ((_i = 0), (agentIds_2 = agentIds));
              _a.label = 1;
            case 1:
              if (!(_i < agentIds_2.length)) {
                return [3 /*break*/, 4];
              }
              agentId = agentIds_2[_i];
              return [5 /*yield**/, _loop_3(agentId)];
            case 2:
              _a.sent();
              _a.label = 3;
            case 3:
              _i++;
              return [3 /*break*/, 1];
            case 4:
              return [2 /*return*/];
          }
        });
      });
    });
  memory
    .command("search")
    .description("Search memory files")
    .argument("<query>", "Search query")
    .option("--agent <id>", "Agent id (default: default agent)")
    .option("--max-results <n>", "Max results", function (value) {
      return Number(value);
    })
    .option("--min-score <n>", "Minimum score", function (value) {
      return Number(value);
    })
    .option("--json", "Print JSON")
    .action(function (query, opts) {
      return __awaiter(_this, void 0, void 0, function () {
        var cfg, agentId;
        var _this = this;
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              cfg = (0, config_js_1.loadConfig)();
              agentId = resolveAgent(cfg, opts.agent);
              return [
                4 /*yield*/,
                (0, cli_utils_js_1.withManager)({
                  getManager: function () {
                    return (0, index_js_1.getMemorySearchManager)({ cfg: cfg, agentId: agentId });
                  },
                  onMissing: function (error) {
                    return runtime_js_1.defaultRuntime.log(
                      error !== null && error !== void 0 ? error : "Memory search disabled.",
                    );
                  },
                  onCloseError: function (err) {
                    return runtime_js_1.defaultRuntime.error(
                      "Memory manager close failed: ".concat(
                        (0, cli_utils_js_1.formatErrorMessage)(err),
                      ),
                    );
                  },
                  close: function (manager) {
                    return manager.close();
                  },
                  run: function (manager) {
                    return __awaiter(_this, void 0, void 0, function () {
                      var results, err_8, message, rich, lines, _i, results_1, result;
                      return __generator(this, function (_a) {
                        switch (_a.label) {
                          case 0:
                            _a.trys.push([0, 2, , 3]);
                            return [
                              4 /*yield*/,
                              manager.search(query, {
                                maxResults: opts.maxResults,
                                minScore: opts.minScore,
                              }),
                            ];
                          case 1:
                            results = _a.sent();
                            return [3 /*break*/, 3];
                          case 2:
                            err_8 = _a.sent();
                            message = (0, cli_utils_js_1.formatErrorMessage)(err_8);
                            runtime_js_1.defaultRuntime.error(
                              "Memory search failed: ".concat(message),
                            );
                            process.exitCode = 1;
                            return [2 /*return*/];
                          case 3:
                            if (opts.json) {
                              runtime_js_1.defaultRuntime.log(
                                JSON.stringify({ results: results }, null, 2),
                              );
                              return [2 /*return*/];
                            }
                            if (results.length === 0) {
                              runtime_js_1.defaultRuntime.log("No matches.");
                              return [2 /*return*/];
                            }
                            rich = (0, theme_js_1.isRich)();
                            lines = [];
                            for (_i = 0, results_1 = results; _i < results_1.length; _i++) {
                              result = results_1[_i];
                              lines.push(
                                ""
                                  .concat(
                                    (0, theme_js_1.colorize)(
                                      rich,
                                      theme_js_1.theme.success,
                                      result.score.toFixed(3),
                                    ),
                                    " ",
                                  )
                                  .concat(
                                    (0, theme_js_1.colorize)(
                                      rich,
                                      theme_js_1.theme.accent,
                                      ""
                                        .concat((0, utils_js_1.shortenHomePath)(result.path), ":")
                                        .concat(result.startLine, "-")
                                        .concat(result.endLine),
                                    ),
                                  ),
                              );
                              lines.push(
                                (0, theme_js_1.colorize)(
                                  rich,
                                  theme_js_1.theme.muted,
                                  result.snippet,
                                ),
                              );
                              lines.push("");
                            }
                            runtime_js_1.defaultRuntime.log(lines.join("\n").trim());
                            return [2 /*return*/];
                        }
                      });
                    });
                  },
                }),
              ];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    });
}
