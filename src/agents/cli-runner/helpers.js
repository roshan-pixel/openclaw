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
exports.cleanupResumeProcesses = cleanupResumeProcesses;
exports.cleanupSuspendedCliProcesses = cleanupSuspendedCliProcesses;
exports.enqueueCliRun = enqueueCliRun;
exports.buildSystemPrompt = buildSystemPrompt;
exports.normalizeCliModel = normalizeCliModel;
exports.parseCliJson = parseCliJson;
exports.parseCliJsonl = parseCliJsonl;
exports.resolveSystemPromptUsage = resolveSystemPromptUsage;
exports.resolveSessionIdToSend = resolveSessionIdToSend;
exports.resolvePromptInput = resolvePromptInput;
exports.appendImagePathsToPrompt = appendImagePathsToPrompt;
exports.writeCliImages = writeCliImages;
exports.buildCliArgs = buildCliArgs;
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var exec_js_1 = require("../../process/exec.js");
var system_prompt_params_js_1 = require("../system-prompt-params.js");
var model_selection_js_1 = require("../model-selection.js");
var system_prompt_js_1 = require("../system-prompt.js");
var tts_js_1 = require("../../tts/tts.js");
var CLI_RUN_QUEUE = new Map();
function escapeRegex(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function cleanupResumeProcesses(backend, sessionId) {
  return __awaiter(this, void 0, void 0, function () {
    var resumeArgs, commandToken, resumeTokens, pattern, _a;
    var _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          if (process.platform === "win32") {
            return [2 /*return*/];
          }
          resumeArgs = (_b = backend.resumeArgs) !== null && _b !== void 0 ? _b : [];
          if (resumeArgs.length === 0) {
            return [2 /*return*/];
          }
          if (
            !resumeArgs.some(function (arg) {
              return arg.includes("{sessionId}");
            })
          ) {
            return [2 /*return*/];
          }
          commandToken = node_path_1.default
            .basename((_c = backend.command) !== null && _c !== void 0 ? _c : "")
            .trim();
          if (!commandToken) {
            return [2 /*return*/];
          }
          resumeTokens = resumeArgs.map(function (arg) {
            return arg.replaceAll("{sessionId}", sessionId);
          });
          pattern = __spreadArray([commandToken], resumeTokens, true)
            .filter(Boolean)
            .map(function (token) {
              return escapeRegex(token);
            })
            .join(".*");
          if (!pattern) {
            return [2 /*return*/];
          }
          _d.label = 1;
        case 1:
          _d.trys.push([1, 3, , 4]);
          return [4 /*yield*/, (0, exec_js_1.runExec)("pkill", ["-f", pattern])];
        case 2:
          _d.sent();
          return [3 /*break*/, 4];
        case 3:
          _a = _d.sent();
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function buildSessionMatchers(backend) {
  var _a, _b, _c, _d;
  var commandToken = node_path_1.default
    .basename((_a = backend.command) !== null && _a !== void 0 ? _a : "")
    .trim();
  if (!commandToken) {
    return [];
  }
  var matchers = [];
  var sessionArg = (_b = backend.sessionArg) === null || _b === void 0 ? void 0 : _b.trim();
  var sessionArgs = (_c = backend.sessionArgs) !== null && _c !== void 0 ? _c : [];
  var resumeArgs = (_d = backend.resumeArgs) !== null && _d !== void 0 ? _d : [];
  var addMatcher = function (args) {
    if (args.length === 0) {
      return;
    }
    var tokens = __spreadArray([commandToken], args, true);
    var pattern = tokens
      .map(function (token, index) {
        var tokenPattern = tokenToRegex(token);
        return index === 0 ? "(?:^|\\s)".concat(tokenPattern) : "\\s+".concat(tokenPattern);
      })
      .join("");
    matchers.push(new RegExp(pattern));
  };
  if (
    sessionArgs.some(function (arg) {
      return arg.includes("{sessionId}");
    })
  ) {
    addMatcher(sessionArgs);
  } else if (sessionArg) {
    addMatcher([sessionArg, "{sessionId}"]);
  }
  if (
    resumeArgs.some(function (arg) {
      return arg.includes("{sessionId}");
    })
  ) {
    addMatcher(resumeArgs);
  }
  return matchers;
}
function tokenToRegex(token) {
  if (!token.includes("{sessionId}")) {
    return escapeRegex(token);
  }
  var parts = token.split("{sessionId}").map(function (part) {
    return escapeRegex(part);
  });
  return parts.join("\\S+");
}
/**
 * Cleanup suspended OpenClaw CLI processes that have accumulated.
 * Only cleans up if there are more than the threshold (default: 10).
 */
function cleanupSuspendedCliProcesses(backend_1) {
  return __awaiter(this, arguments, void 0, function (backend, threshold) {
    var matchers, stdout, suspended, _loop_1, _i, _a, line, _b;
    var _c, _d;
    if (threshold === void 0) {
      threshold = 10;
    }
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          if (process.platform === "win32") {
            return [2 /*return*/];
          }
          matchers = buildSessionMatchers(backend);
          if (matchers.length === 0) {
            return [2 /*return*/];
          }
          _e.label = 1;
        case 1:
          _e.trys.push([1, 5, , 6]);
          return [4 /*yield*/, (0, exec_js_1.runExec)("ps", ["-ax", "-o", "pid=,stat=,command="])];
        case 2:
          stdout = _e.sent().stdout;
          suspended = [];
          _loop_1 = function (line) {
            var trimmed = line.trim();
            if (!trimmed) {
              return "continue";
            }
            var match = /^(\d+)\s+(\S+)\s+(.*)$/.exec(trimmed);
            if (!match) {
              return "continue";
            }
            var pid = Number(match[1]);
            var stat = (_c = match[2]) !== null && _c !== void 0 ? _c : "";
            var command = (_d = match[3]) !== null && _d !== void 0 ? _d : "";
            if (!Number.isFinite(pid)) {
              return "continue";
            }
            if (!stat.includes("T")) {
              return "continue";
            }
            if (
              !matchers.some(function (matcher) {
                return matcher.test(command);
              })
            ) {
              return "continue";
            }
            suspended.push(pid);
          };
          for (_i = 0, _a = stdout.split("\n"); _i < _a.length; _i++) {
            line = _a[_i];
            _loop_1(line);
          }
          if (!(suspended.length > threshold)) {
            return [3 /*break*/, 4];
          }
          // Verified locally: stopped (T) processes ignore SIGTERM, so use SIGKILL.
          return [
            4 /*yield*/,
            (0, exec_js_1.runExec)(
              "kill",
              __spreadArray(
                ["-9"],
                suspended.map(function (pid) {
                  return String(pid);
                }),
                true,
              ),
            ),
          ];
        case 3:
          // Verified locally: stopped (T) processes ignore SIGTERM, so use SIGKILL.
          _e.sent();
          _e.label = 4;
        case 4:
          return [3 /*break*/, 6];
        case 5:
          _b = _e.sent();
          return [3 /*break*/, 6];
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
function enqueueCliRun(key, task) {
  var _a;
  var prior = (_a = CLI_RUN_QUEUE.get(key)) !== null && _a !== void 0 ? _a : Promise.resolve();
  var chained = prior
    .catch(function () {
      return undefined;
    })
    .then(task);
  var tracked = chained.finally(function () {
    if (CLI_RUN_QUEUE.get(key) === tracked) {
      CLI_RUN_QUEUE.delete(key);
    }
  });
  CLI_RUN_QUEUE.set(key, tracked);
  return chained;
}
function buildModelAliasLines(cfg) {
  var _a, _b, _c, _d;
  var models =
    (_c =
      (_b =
        (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0
          ? void 0
          : _a.defaults) === null || _b === void 0
        ? void 0
        : _b.models) !== null && _c !== void 0
      ? _c
      : {};
  var entries = [];
  for (var _i = 0, _e = Object.entries(models); _i < _e.length; _i++) {
    var _f = _e[_i],
      keyRaw = _f[0],
      entryRaw = _f[1];
    var model = String(keyRaw !== null && keyRaw !== void 0 ? keyRaw : "").trim();
    if (!model) {
      continue;
    }
    var alias = String(
      (_d = entryRaw === null || entryRaw === void 0 ? void 0 : entryRaw.alias) !== null &&
        _d !== void 0
        ? _d
        : "",
    ).trim();
    if (!alias) {
      continue;
    }
    entries.push({ alias: alias, model: model });
  }
  return entries
    .toSorted(function (a, b) {
      return a.alias.localeCompare(b.alias);
    })
    .map(function (entry) {
      return "- ".concat(entry.alias, ": ").concat(entry.model);
    });
}
function buildSystemPrompt(params) {
  var _a;
  var defaultModelRef = (0, model_selection_js_1.resolveDefaultModelForAgent)({
    cfg: (_a = params.config) !== null && _a !== void 0 ? _a : {},
    agentId: params.agentId,
  });
  var defaultModelLabel = "".concat(defaultModelRef.provider, "/").concat(defaultModelRef.model);
  var _b = (0, system_prompt_params_js_1.buildSystemPromptParams)({
      config: params.config,
      agentId: params.agentId,
      workspaceDir: params.workspaceDir,
      cwd: process.cwd(),
      runtime: {
        host: "openclaw",
        os: "".concat(node_os_1.default.type(), " ").concat(node_os_1.default.release()),
        arch: node_os_1.default.arch(),
        node: process.version,
        model: params.modelDisplay,
        defaultModel: defaultModelLabel,
      },
    }),
    runtimeInfo = _b.runtimeInfo,
    userTimezone = _b.userTimezone,
    userTime = _b.userTime,
    userTimeFormat = _b.userTimeFormat;
  var ttsHint = params.config ? (0, tts_js_1.buildTtsSystemPromptHint)(params.config) : undefined;
  return (0, system_prompt_js_1.buildAgentSystemPrompt)({
    workspaceDir: params.workspaceDir,
    defaultThinkLevel: params.defaultThinkLevel,
    extraSystemPrompt: params.extraSystemPrompt,
    ownerNumbers: params.ownerNumbers,
    reasoningTagHint: false,
    heartbeatPrompt: params.heartbeatPrompt,
    docsPath: params.docsPath,
    runtimeInfo: runtimeInfo,
    toolNames: params.tools.map(function (tool) {
      return tool.name;
    }),
    modelAliasLines: buildModelAliasLines(params.config),
    userTimezone: userTimezone,
    userTime: userTime,
    userTimeFormat: userTimeFormat,
    contextFiles: params.contextFiles,
    ttsHint: ttsHint,
  });
}
function normalizeCliModel(modelId, backend) {
  var _a, _b;
  var trimmed = modelId.trim();
  if (!trimmed) {
    return trimmed;
  }
  var direct = (_a = backend.modelAliases) === null || _a === void 0 ? void 0 : _a[trimmed];
  if (direct) {
    return direct;
  }
  var lower = trimmed.toLowerCase();
  var mapped = (_b = backend.modelAliases) === null || _b === void 0 ? void 0 : _b[lower];
  if (mapped) {
    return mapped;
  }
  return trimmed;
}
function toUsage(raw) {
  var _a, _b, _c, _d, _e, _f;
  var pick = function (key) {
    return typeof raw[key] === "number" && raw[key] > 0 ? raw[key] : undefined;
  };
  var input = (_a = pick("input_tokens")) !== null && _a !== void 0 ? _a : pick("inputTokens");
  var output = (_b = pick("output_tokens")) !== null && _b !== void 0 ? _b : pick("outputTokens");
  var cacheRead =
    (_d =
      (_c = pick("cache_read_input_tokens")) !== null && _c !== void 0
        ? _c
        : pick("cached_input_tokens")) !== null && _d !== void 0
      ? _d
      : pick("cacheRead");
  var cacheWrite =
    (_e = pick("cache_write_input_tokens")) !== null && _e !== void 0 ? _e : pick("cacheWrite");
  var total = (_f = pick("total_tokens")) !== null && _f !== void 0 ? _f : pick("total");
  if (!input && !output && !cacheRead && !cacheWrite && !total) {
    return undefined;
  }
  return {
    input: input,
    output: output,
    cacheRead: cacheRead,
    cacheWrite: cacheWrite,
    total: total,
  };
}
function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function collectText(value) {
  if (!value) {
    return "";
  }
  if (typeof value === "string") {
    return value;
  }
  if (Array.isArray(value)) {
    return value
      .map(function (entry) {
        return collectText(entry);
      })
      .join("");
  }
  if (!isRecord(value)) {
    return "";
  }
  if (typeof value.text === "string") {
    return value.text;
  }
  if (typeof value.content === "string") {
    return value.content;
  }
  if (Array.isArray(value.content)) {
    return value.content
      .map(function (entry) {
        return collectText(entry);
      })
      .join("");
  }
  if (isRecord(value.message)) {
    return collectText(value.message);
  }
  return "";
}
function pickSessionId(parsed, backend) {
  var _a;
  var fields =
    (_a = backend.sessionIdFields) !== null && _a !== void 0
      ? _a
      : ["session_id", "sessionId", "conversation_id", "conversationId"];
  for (var _i = 0, fields_1 = fields; _i < fields_1.length; _i++) {
    var field = fields_1[_i];
    var value = parsed[field];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }
  return undefined;
}
function parseCliJson(raw, backend) {
  var trimmed = raw.trim();
  if (!trimmed) {
    return null;
  }
  var parsed;
  try {
    parsed = JSON.parse(trimmed);
  } catch (_a) {
    return null;
  }
  if (!isRecord(parsed)) {
    return null;
  }
  var sessionId = pickSessionId(parsed, backend);
  var usage = isRecord(parsed.usage) ? toUsage(parsed.usage) : undefined;
  var text =
    collectText(parsed.message) ||
    collectText(parsed.content) ||
    collectText(parsed.result) ||
    collectText(parsed);
  return { text: text.trim(), sessionId: sessionId, usage: usage };
}
function parseCliJsonl(raw, backend) {
  var _a;
  var lines = raw
    .split(/\r?\n/g)
    .map(function (line) {
      return line.trim();
    })
    .filter(Boolean);
  if (lines.length === 0) {
    return null;
  }
  var sessionId;
  var usage;
  var texts = [];
  for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var line = lines_1[_i];
    var parsed = void 0;
    try {
      parsed = JSON.parse(line);
    } catch (_b) {
      continue;
    }
    if (!isRecord(parsed)) {
      continue;
    }
    if (!sessionId) {
      sessionId = pickSessionId(parsed, backend);
    }
    if (!sessionId && typeof parsed.thread_id === "string") {
      sessionId = parsed.thread_id.trim();
    }
    if (isRecord(parsed.usage)) {
      usage = (_a = toUsage(parsed.usage)) !== null && _a !== void 0 ? _a : usage;
    }
    var item = isRecord(parsed.item) ? parsed.item : null;
    if (item && typeof item.text === "string") {
      var type = typeof item.type === "string" ? item.type.toLowerCase() : "";
      if (!type || type.includes("message")) {
        texts.push(item.text);
      }
    }
  }
  var text = texts.join("\n").trim();
  if (!text) {
    return null;
  }
  return { text: text, sessionId: sessionId, usage: usage };
}
function resolveSystemPromptUsage(params) {
  var _a, _b, _c;
  var systemPrompt = (_a = params.systemPrompt) === null || _a === void 0 ? void 0 : _a.trim();
  if (!systemPrompt) {
    return null;
  }
  var when = (_b = params.backend.systemPromptWhen) !== null && _b !== void 0 ? _b : "first";
  if (when === "never") {
    return null;
  }
  if (when === "first" && !params.isNewSession) {
    return null;
  }
  if (!((_c = params.backend.systemPromptArg) === null || _c === void 0 ? void 0 : _c.trim())) {
    return null;
  }
  return systemPrompt;
}
function resolveSessionIdToSend(params) {
  var _a, _b;
  var mode = (_a = params.backend.sessionMode) !== null && _a !== void 0 ? _a : "always";
  var existing = (_b = params.cliSessionId) === null || _b === void 0 ? void 0 : _b.trim();
  if (mode === "none") {
    return { sessionId: undefined, isNew: !existing };
  }
  if (mode === "existing") {
    return { sessionId: existing, isNew: !existing };
  }
  if (existing) {
    return { sessionId: existing, isNew: false };
  }
  return { sessionId: node_crypto_1.default.randomUUID(), isNew: true };
}
function resolvePromptInput(params) {
  var _a;
  var inputMode = (_a = params.backend.input) !== null && _a !== void 0 ? _a : "arg";
  if (inputMode === "stdin") {
    return { stdin: params.prompt };
  }
  if (params.backend.maxPromptArgChars && params.prompt.length > params.backend.maxPromptArgChars) {
    return { stdin: params.prompt };
  }
  return { argsPrompt: params.prompt };
}
function resolveImageExtension(mimeType) {
  var normalized = mimeType.toLowerCase();
  if (normalized.includes("png")) {
    return "png";
  }
  if (normalized.includes("jpeg") || normalized.includes("jpg")) {
    return "jpg";
  }
  if (normalized.includes("gif")) {
    return "gif";
  }
  if (normalized.includes("webp")) {
    return "webp";
  }
  return "bin";
}
function appendImagePathsToPrompt(prompt, paths) {
  if (!paths.length) {
    return prompt;
  }
  var trimmed = prompt.trimEnd();
  var separator = trimmed ? "\n\n" : "";
  return "".concat(trimmed).concat(separator).concat(paths.join("\n"));
}
function writeCliImages(images) {
  return __awaiter(this, void 0, void 0, function () {
    var tempDir, paths, i, image, ext, filePath, buffer, cleanup;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            promises_1.default.mkdtemp(
              node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-cli-images-"),
            ),
          ];
        case 1:
          tempDir = _a.sent();
          paths = [];
          i = 0;
          _a.label = 2;
        case 2:
          if (!(i < images.length)) {
            return [3 /*break*/, 5];
          }
          image = images[i];
          ext = resolveImageExtension(image.mimeType);
          filePath = node_path_1.default.join(tempDir, "image-".concat(i + 1, ".").concat(ext));
          buffer = Buffer.from(image.data, "base64");
          return [4 /*yield*/, promises_1.default.writeFile(filePath, buffer, { mode: 384 })];
        case 3:
          _a.sent();
          paths.push(filePath);
          _a.label = 4;
        case 4:
          i += 1;
          return [3 /*break*/, 2];
        case 5:
          cleanup = function () {
            return __awaiter(_this, void 0, void 0, function () {
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    return [
                      4 /*yield*/,
                      promises_1.default.rm(tempDir, { recursive: true, force: true }),
                    ];
                  case 1:
                    _a.sent();
                    return [2 /*return*/];
                }
              });
            });
          };
          return [2 /*return*/, { paths: paths, cleanup: cleanup }];
      }
    });
  });
}
function buildCliArgs(params) {
  var _a;
  var args = __spreadArray([], params.baseArgs, true);
  if (!params.useResume && params.backend.modelArg && params.modelId) {
    args.push(params.backend.modelArg, params.modelId);
  }
  if (!params.useResume && params.systemPrompt && params.backend.systemPromptArg) {
    args.push(params.backend.systemPromptArg, params.systemPrompt);
  }
  if (!params.useResume && params.sessionId) {
    if (params.backend.sessionArgs && params.backend.sessionArgs.length > 0) {
      for (var _i = 0, _b = params.backend.sessionArgs; _i < _b.length; _i++) {
        var entry = _b[_i];
        args.push(entry.replaceAll("{sessionId}", params.sessionId));
      }
    } else if (params.backend.sessionArg) {
      args.push(params.backend.sessionArg, params.sessionId);
    }
  }
  if (params.imagePaths && params.imagePaths.length > 0) {
    var mode = (_a = params.backend.imageMode) !== null && _a !== void 0 ? _a : "repeat";
    var imageArg = params.backend.imageArg;
    if (imageArg) {
      if (mode === "list") {
        args.push(imageArg, params.imagePaths.join(","));
      } else {
        for (var _c = 0, _d = params.imagePaths; _c < _d.length; _c++) {
          var imagePath = _d[_c];
          args.push(imageArg, imagePath);
        }
      }
    }
  }
  if (params.promptArg !== undefined) {
    args.push(params.promptArg);
  }
  return args;
}
