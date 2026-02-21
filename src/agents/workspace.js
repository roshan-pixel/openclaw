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
exports.DEFAULT_MEMORY_ALT_FILENAME =
  exports.DEFAULT_MEMORY_FILENAME =
  exports.DEFAULT_BOOTSTRAP_FILENAME =
  exports.DEFAULT_HEARTBEAT_FILENAME =
  exports.DEFAULT_USER_FILENAME =
  exports.DEFAULT_IDENTITY_FILENAME =
  exports.DEFAULT_TOOLS_FILENAME =
  exports.DEFAULT_SOUL_FILENAME =
  exports.DEFAULT_AGENTS_FILENAME =
  exports.DEFAULT_AGENT_WORKSPACE_DIR =
    void 0;
exports.resolveDefaultAgentWorkspaceDir = resolveDefaultAgentWorkspaceDir;
exports.ensureAgentWorkspace = ensureAgentWorkspace;
exports.loadWorkspaceBootstrapFiles = loadWorkspaceBootstrapFiles;
exports.filterBootstrapFilesForSession = filterBootstrapFilesForSession;
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var session_key_js_1 = require("../routing/session-key.js");
var exec_js_1 = require("../process/exec.js");
var utils_js_1 = require("../utils.js");
function resolveDefaultAgentWorkspaceDir(env, homedir) {
  var _a;
  if (env === void 0) {
    env = process.env;
  }
  if (homedir === void 0) {
    homedir = node_os_1.default.homedir;
  }
  var profile = (_a = env.OPENCLAW_PROFILE) === null || _a === void 0 ? void 0 : _a.trim();
  if (profile && profile.toLowerCase() !== "default") {
    return node_path_1.default.join(homedir(), ".openclaw", "workspace-".concat(profile));
  }
  return node_path_1.default.join(homedir(), ".openclaw", "workspace");
}
exports.DEFAULT_AGENT_WORKSPACE_DIR = resolveDefaultAgentWorkspaceDir();
exports.DEFAULT_AGENTS_FILENAME = "AGENTS.md";
exports.DEFAULT_SOUL_FILENAME = "SOUL.md";
exports.DEFAULT_TOOLS_FILENAME = "TOOLS.md";
exports.DEFAULT_IDENTITY_FILENAME = "IDENTITY.md";
exports.DEFAULT_USER_FILENAME = "USER.md";
exports.DEFAULT_HEARTBEAT_FILENAME = "HEARTBEAT.md";
exports.DEFAULT_BOOTSTRAP_FILENAME = "BOOTSTRAP.md";
exports.DEFAULT_MEMORY_FILENAME = "MEMORY.md";
exports.DEFAULT_MEMORY_ALT_FILENAME = "memory.md";
var TEMPLATE_DIR = node_path_1.default.resolve(
  node_path_1.default.dirname((0, node_url_1.fileURLToPath)(import.meta.url)),
  "../../docs/reference/templates",
);
function stripFrontMatter(content) {
  if (!content.startsWith("---")) {
    return content;
  }
  var endIndex = content.indexOf("\n---", 3);
  if (endIndex === -1) {
    return content;
  }
  var start = endIndex + "\n---".length;
  var trimmed = content.slice(start);
  trimmed = trimmed.replace(/^\s+/, "");
  return trimmed;
}
function loadTemplate(name) {
  return __awaiter(this, void 0, void 0, function () {
    var templatePath, content, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          templatePath = node_path_1.default.join(TEMPLATE_DIR, name);
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [4 /*yield*/, promises_1.default.readFile(templatePath, "utf-8")];
        case 2:
          content = _b.sent();
          return [2 /*return*/, stripFrontMatter(content)];
        case 3:
          _a = _b.sent();
          throw new Error(
            "Missing workspace template: "
              .concat(name, " (")
              .concat(templatePath, "). Ensure docs/reference/templates are packaged."),
          );
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function writeFileIfMissing(filePath, content) {
  return __awaiter(this, void 0, void 0, function () {
    var err_1, anyErr;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          return [
            4 /*yield*/,
            promises_1.default.writeFile(filePath, content, {
              encoding: "utf-8",
              flag: "wx",
            }),
          ];
        case 1:
          _a.sent();
          return [3 /*break*/, 3];
        case 2:
          err_1 = _a.sent();
          anyErr = err_1;
          if (anyErr.code !== "EEXIST") {
            throw err_1;
          }
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function hasGitRepo(dir) {
  return __awaiter(this, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [4 /*yield*/, promises_1.default.stat(node_path_1.default.join(dir, ".git"))];
        case 1:
          _b.sent();
          return [2 /*return*/, true];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, false];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function isGitAvailable() {
  return __awaiter(this, void 0, void 0, function () {
    var result, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [
            4 /*yield*/,
            (0, exec_js_1.runCommandWithTimeout)(["git", "--version"], { timeoutMs: 2000 }),
          ];
        case 1:
          result = _b.sent();
          return [2 /*return*/, result.code === 0];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, false];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function ensureGitRepo(dir, isBrandNewWorkspace) {
  return __awaiter(this, void 0, void 0, function () {
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (!isBrandNewWorkspace) {
            return [2 /*return*/];
          }
          return [4 /*yield*/, hasGitRepo(dir)];
        case 1:
          if (_b.sent()) {
            return [2 /*return*/];
          }
          return [4 /*yield*/, isGitAvailable()];
        case 2:
          if (!_b.sent()) {
            return [2 /*return*/];
          }
          _b.label = 3;
        case 3:
          _b.trys.push([3, 5, , 6]);
          return [
            4 /*yield*/,
            (0, exec_js_1.runCommandWithTimeout)(["git", "init"], { cwd: dir, timeoutMs: 10000 }),
          ];
        case 4:
          _b.sent();
          return [3 /*break*/, 6];
        case 5:
          _a = _b.sent();
          return [3 /*break*/, 6];
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
function ensureAgentWorkspace(params) {
  return __awaiter(this, void 0, void 0, function () {
    var rawDir,
      dir,
      agentsPath,
      soulPath,
      toolsPath,
      identityPath,
      userPath,
      heartbeatPath,
      bootstrapPath,
      isBrandNewWorkspace,
      agentsTemplate,
      soulTemplate,
      toolsTemplate,
      identityTemplate,
      userTemplate,
      heartbeatTemplate,
      bootstrapTemplate;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          rawDir = (
            (_a = params === null || params === void 0 ? void 0 : params.dir) === null ||
            _a === void 0
              ? void 0
              : _a.trim()
          )
            ? params.dir.trim()
            : exports.DEFAULT_AGENT_WORKSPACE_DIR;
          dir = (0, utils_js_1.resolveUserPath)(rawDir);
          return [4 /*yield*/, promises_1.default.mkdir(dir, { recursive: true })];
        case 1:
          _b.sent();
          if (!(params === null || params === void 0 ? void 0 : params.ensureBootstrapFiles)) {
            return [2 /*return*/, { dir: dir }];
          }
          agentsPath = node_path_1.default.join(dir, exports.DEFAULT_AGENTS_FILENAME);
          soulPath = node_path_1.default.join(dir, exports.DEFAULT_SOUL_FILENAME);
          toolsPath = node_path_1.default.join(dir, exports.DEFAULT_TOOLS_FILENAME);
          identityPath = node_path_1.default.join(dir, exports.DEFAULT_IDENTITY_FILENAME);
          userPath = node_path_1.default.join(dir, exports.DEFAULT_USER_FILENAME);
          heartbeatPath = node_path_1.default.join(dir, exports.DEFAULT_HEARTBEAT_FILENAME);
          bootstrapPath = node_path_1.default.join(dir, exports.DEFAULT_BOOTSTRAP_FILENAME);
          return [
            4 /*yield*/,
            (function () {
              return __awaiter(_this, void 0, void 0, function () {
                var paths, existing;
                var _this = this;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      paths = [
                        agentsPath,
                        soulPath,
                        toolsPath,
                        identityPath,
                        userPath,
                        heartbeatPath,
                      ];
                      return [
                        4 /*yield*/,
                        Promise.all(
                          paths.map(function (p) {
                            return __awaiter(_this, void 0, void 0, function () {
                              var _a;
                              return __generator(this, function (_b) {
                                switch (_b.label) {
                                  case 0:
                                    _b.trys.push([0, 2, , 3]);
                                    return [4 /*yield*/, promises_1.default.access(p)];
                                  case 1:
                                    _b.sent();
                                    return [2 /*return*/, true];
                                  case 2:
                                    _a = _b.sent();
                                    return [2 /*return*/, false];
                                  case 3:
                                    return [2 /*return*/];
                                }
                              });
                            });
                          }),
                        ),
                      ];
                    case 1:
                      existing = _a.sent();
                      return [
                        2 /*return*/,
                        existing.every(function (v) {
                          return !v;
                        }),
                      ];
                  }
                });
              });
            })(),
          ];
        case 2:
          isBrandNewWorkspace = _b.sent();
          return [4 /*yield*/, loadTemplate(exports.DEFAULT_AGENTS_FILENAME)];
        case 3:
          agentsTemplate = _b.sent();
          return [4 /*yield*/, loadTemplate(exports.DEFAULT_SOUL_FILENAME)];
        case 4:
          soulTemplate = _b.sent();
          return [4 /*yield*/, loadTemplate(exports.DEFAULT_TOOLS_FILENAME)];
        case 5:
          toolsTemplate = _b.sent();
          return [4 /*yield*/, loadTemplate(exports.DEFAULT_IDENTITY_FILENAME)];
        case 6:
          identityTemplate = _b.sent();
          return [4 /*yield*/, loadTemplate(exports.DEFAULT_USER_FILENAME)];
        case 7:
          userTemplate = _b.sent();
          return [4 /*yield*/, loadTemplate(exports.DEFAULT_HEARTBEAT_FILENAME)];
        case 8:
          heartbeatTemplate = _b.sent();
          return [4 /*yield*/, loadTemplate(exports.DEFAULT_BOOTSTRAP_FILENAME)];
        case 9:
          bootstrapTemplate = _b.sent();
          return [4 /*yield*/, writeFileIfMissing(agentsPath, agentsTemplate)];
        case 10:
          _b.sent();
          return [4 /*yield*/, writeFileIfMissing(soulPath, soulTemplate)];
        case 11:
          _b.sent();
          return [4 /*yield*/, writeFileIfMissing(toolsPath, toolsTemplate)];
        case 12:
          _b.sent();
          return [4 /*yield*/, writeFileIfMissing(identityPath, identityTemplate)];
        case 13:
          _b.sent();
          return [4 /*yield*/, writeFileIfMissing(userPath, userTemplate)];
        case 14:
          _b.sent();
          return [4 /*yield*/, writeFileIfMissing(heartbeatPath, heartbeatTemplate)];
        case 15:
          _b.sent();
          if (!isBrandNewWorkspace) {
            return [3 /*break*/, 17];
          }
          return [4 /*yield*/, writeFileIfMissing(bootstrapPath, bootstrapTemplate)];
        case 16:
          _b.sent();
          _b.label = 17;
        case 17:
          return [4 /*yield*/, ensureGitRepo(dir, isBrandNewWorkspace)];
        case 18:
          _b.sent();
          return [
            2 /*return*/,
            {
              dir: dir,
              agentsPath: agentsPath,
              soulPath: soulPath,
              toolsPath: toolsPath,
              identityPath: identityPath,
              userPath: userPath,
              heartbeatPath: heartbeatPath,
              bootstrapPath: bootstrapPath,
            },
          ];
      }
    });
  });
}
function resolveMemoryBootstrapEntries(resolvedDir) {
  return __awaiter(this, void 0, void 0, function () {
    var candidates,
      entries,
      _i,
      candidates_1,
      name_1,
      filePath,
      _a,
      seen,
      deduped,
      _b,
      entries_1,
      entry,
      key,
      _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          candidates = [exports.DEFAULT_MEMORY_FILENAME, exports.DEFAULT_MEMORY_ALT_FILENAME];
          entries = [];
          ((_i = 0), (candidates_1 = candidates));
          _d.label = 1;
        case 1:
          if (!(_i < candidates_1.length)) {
            return [3 /*break*/, 6];
          }
          name_1 = candidates_1[_i];
          filePath = node_path_1.default.join(resolvedDir, name_1);
          _d.label = 2;
        case 2:
          _d.trys.push([2, 4, , 5]);
          return [4 /*yield*/, promises_1.default.access(filePath)];
        case 3:
          _d.sent();
          entries.push({ name: name_1, filePath: filePath });
          return [3 /*break*/, 5];
        case 4:
          _a = _d.sent();
          return [3 /*break*/, 5];
        case 5:
          _i++;
          return [3 /*break*/, 1];
        case 6:
          if (entries.length <= 1) {
            return [2 /*return*/, entries];
          }
          seen = new Set();
          deduped = [];
          ((_b = 0), (entries_1 = entries));
          _d.label = 7;
        case 7:
          if (!(_b < entries_1.length)) {
            return [3 /*break*/, 13];
          }
          entry = entries_1[_b];
          key = entry.filePath;
          _d.label = 8;
        case 8:
          _d.trys.push([8, 10, , 11]);
          return [4 /*yield*/, promises_1.default.realpath(entry.filePath)];
        case 9:
          key = _d.sent();
          return [3 /*break*/, 11];
        case 10:
          _c = _d.sent();
          return [3 /*break*/, 11];
        case 11:
          if (seen.has(key)) {
            return [3 /*break*/, 12];
          }
          seen.add(key);
          deduped.push(entry);
          _d.label = 12;
        case 12:
          _b++;
          return [3 /*break*/, 7];
        case 13:
          return [2 /*return*/, deduped];
      }
    });
  });
}
function loadWorkspaceBootstrapFiles(dir) {
  return __awaiter(this, void 0, void 0, function () {
    var resolvedDir, entries, _a, _b, _c, result, _i, entries_2, entry, content, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          resolvedDir = (0, utils_js_1.resolveUserPath)(dir);
          entries = [
            {
              name: exports.DEFAULT_AGENTS_FILENAME,
              filePath: node_path_1.default.join(resolvedDir, exports.DEFAULT_AGENTS_FILENAME),
            },
            {
              name: exports.DEFAULT_SOUL_FILENAME,
              filePath: node_path_1.default.join(resolvedDir, exports.DEFAULT_SOUL_FILENAME),
            },
            {
              name: exports.DEFAULT_TOOLS_FILENAME,
              filePath: node_path_1.default.join(resolvedDir, exports.DEFAULT_TOOLS_FILENAME),
            },
            {
              name: exports.DEFAULT_IDENTITY_FILENAME,
              filePath: node_path_1.default.join(resolvedDir, exports.DEFAULT_IDENTITY_FILENAME),
            },
            {
              name: exports.DEFAULT_USER_FILENAME,
              filePath: node_path_1.default.join(resolvedDir, exports.DEFAULT_USER_FILENAME),
            },
            {
              name: exports.DEFAULT_HEARTBEAT_FILENAME,
              filePath: node_path_1.default.join(resolvedDir, exports.DEFAULT_HEARTBEAT_FILENAME),
            },
            {
              name: exports.DEFAULT_BOOTSTRAP_FILENAME,
              filePath: node_path_1.default.join(resolvedDir, exports.DEFAULT_BOOTSTRAP_FILENAME),
            },
          ];
          _b = (_a = entries.push).apply;
          _c = [entries];
          return [4 /*yield*/, resolveMemoryBootstrapEntries(resolvedDir)];
        case 1:
          _b.apply(_a, _c.concat([_e.sent()]));
          result = [];
          ((_i = 0), (entries_2 = entries));
          _e.label = 2;
        case 2:
          if (!(_i < entries_2.length)) {
            return [3 /*break*/, 7];
          }
          entry = entries_2[_i];
          _e.label = 3;
        case 3:
          _e.trys.push([3, 5, , 6]);
          return [4 /*yield*/, promises_1.default.readFile(entry.filePath, "utf-8")];
        case 4:
          content = _e.sent();
          result.push({
            name: entry.name,
            path: entry.filePath,
            content: content,
            missing: false,
          });
          return [3 /*break*/, 6];
        case 5:
          _d = _e.sent();
          result.push({ name: entry.name, path: entry.filePath, missing: true });
          return [3 /*break*/, 6];
        case 6:
          _i++;
          return [3 /*break*/, 2];
        case 7:
          return [2 /*return*/, result];
      }
    });
  });
}
var SUBAGENT_BOOTSTRAP_ALLOWLIST = new Set([
  exports.DEFAULT_AGENTS_FILENAME,
  exports.DEFAULT_TOOLS_FILENAME,
]);
function filterBootstrapFilesForSession(files, sessionKey) {
  if (!sessionKey || !(0, session_key_js_1.isSubagentSessionKey)(sessionKey)) {
    return files;
  }
  return files.filter(function (file) {
    return SUBAGENT_BOOTSTRAP_ALLOWLIST.has(file.name);
  });
}
