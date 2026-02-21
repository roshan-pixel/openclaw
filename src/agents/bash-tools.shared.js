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
exports.buildSandboxEnv = buildSandboxEnv;
exports.coerceEnv = coerceEnv;
exports.buildDockerExecArgs = buildDockerExecArgs;
exports.resolveSandboxWorkdir = resolveSandboxWorkdir;
exports.killSession = killSession;
exports.resolveWorkdir = resolveWorkdir;
exports.clampNumber = clampNumber;
exports.readEnvInt = readEnvInt;
exports.chunkString = chunkString;
exports.truncateMiddle = truncateMiddle;
exports.sliceLogLines = sliceLogLines;
exports.deriveSessionName = deriveSessionName;
exports.formatDuration = formatDuration;
exports.pad = pad;
var node_fs_1 = require("node:fs");
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var utils_js_1 = require("../utils.js");
var sandbox_paths_js_1 = require("./sandbox-paths.js");
var shell_utils_js_1 = require("./shell-utils.js");
var CHUNK_LIMIT = 8 * 1024;
function buildSandboxEnv(params) {
  var _a, _b;
  var env = {
    PATH: params.defaultPath,
    HOME: params.containerWorkdir,
  };
  for (
    var _i = 0, _c = Object.entries((_a = params.sandboxEnv) !== null && _a !== void 0 ? _a : {});
    _i < _c.length;
    _i++
  ) {
    var _d = _c[_i],
      key = _d[0],
      value = _d[1];
    env[key] = value;
  }
  for (
    var _e = 0, _f = Object.entries((_b = params.paramsEnv) !== null && _b !== void 0 ? _b : {});
    _e < _f.length;
    _e++
  ) {
    var _g = _f[_e],
      key = _g[0],
      value = _g[1];
    env[key] = value;
  }
  return env;
}
function coerceEnv(env) {
  var record = {};
  if (!env) {
    return record;
  }
  for (var _i = 0, _a = Object.entries(env); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      value = _b[1];
    if (typeof value === "string") {
      record[key] = value;
    }
  }
  return record;
}
function buildDockerExecArgs(params) {
  var args = ["exec", "-i"];
  if (params.tty) {
    args.push("-t");
  }
  if (params.workdir) {
    args.push("-w", params.workdir);
  }
  for (var _i = 0, _a = Object.entries(params.env); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      value = _b[1];
    args.push("-e", "".concat(key, "=").concat(value));
  }
  var hasCustomPath = typeof params.env.PATH === "string" && params.env.PATH.length > 0;
  if (hasCustomPath) {
    // Avoid interpolating PATH into the shell command; pass it via env instead.
    args.push("-e", "OPENCLAW_PREPEND_PATH=".concat(params.env.PATH));
  }
  // Login shell (-l) sources /etc/profile which resets PATH to a minimal set,
  // overriding both Docker ENV and -e PATH=... environment variables.
  // Prepend custom PATH after profile sourcing to ensure custom tools are accessible
  // while preserving system paths that /etc/profile may have added.
  var pathExport = hasCustomPath
    ? 'export PATH="${OPENCLAW_PREPEND_PATH}:$PATH"; unset OPENCLAW_PREPEND_PATH; '
    : "";
  args.push(params.containerName, "sh", "-lc", "".concat(pathExport).concat(params.command));
  return args;
}
function resolveSandboxWorkdir(params) {
  return __awaiter(this, void 0, void 0, function () {
    var fallback, resolved, stats, relative, containerWorkdir, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          fallback = params.sandbox.workspaceDir;
          _b.label = 1;
        case 1:
          _b.trys.push([1, 4, , 5]);
          return [
            4 /*yield*/,
            (0, sandbox_paths_js_1.assertSandboxPath)({
              filePath: params.workdir,
              cwd: process.cwd(),
              root: params.sandbox.workspaceDir,
            }),
          ];
        case 2:
          resolved = _b.sent();
          return [4 /*yield*/, promises_1.default.stat(resolved.resolved)];
        case 3:
          stats = _b.sent();
          if (!stats.isDirectory()) {
            throw new Error("workdir is not a directory");
          }
          relative = resolved.relative
            ? resolved.relative.split(node_path_1.default.sep).join(node_path_1.default.posix.sep)
            : "";
          containerWorkdir = relative
            ? node_path_1.default.posix.join(params.sandbox.containerWorkdir, relative)
            : params.sandbox.containerWorkdir;
          return [
            2 /*return*/,
            { hostWorkdir: resolved.resolved, containerWorkdir: containerWorkdir },
          ];
        case 4:
          _a = _b.sent();
          params.warnings.push(
            'Warning: workdir "'
              .concat(params.workdir, '" is unavailable; using "')
              .concat(fallback, '".'),
          );
          return [
            2 /*return*/,
            {
              hostWorkdir: fallback,
              containerWorkdir: params.sandbox.containerWorkdir,
            },
          ];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function killSession(session) {
  var _a, _b;
  var pid =
    (_a = session.pid) !== null && _a !== void 0
      ? _a
      : (_b = session.child) === null || _b === void 0
        ? void 0
        : _b.pid;
  if (pid) {
    (0, shell_utils_js_1.killProcessTree)(pid);
  }
}
function resolveWorkdir(workdir, warnings) {
  var current = safeCwd();
  var fallback = current !== null && current !== void 0 ? current : (0, node_os_1.homedir)();
  try {
    var stats = (0, node_fs_1.statSync)(workdir);
    if (stats.isDirectory()) {
      return workdir;
    }
  } catch (_a) {
    // ignore, fallback below
  }
  warnings.push(
    'Warning: workdir "'.concat(workdir, '" is unavailable; using "').concat(fallback, '".'),
  );
  return fallback;
}
function safeCwd() {
  try {
    var cwd = process.cwd();
    return (0, node_fs_1.existsSync)(cwd) ? cwd : null;
  } catch (_a) {
    return null;
  }
}
function clampNumber(value, defaultValue, min, max) {
  if (value === undefined || Number.isNaN(value)) {
    return defaultValue;
  }
  return Math.min(Math.max(value, min), max);
}
function readEnvInt(key) {
  var raw = process.env[key];
  if (!raw) {
    return undefined;
  }
  var parsed = Number.parseInt(raw, 10);
  return Number.isFinite(parsed) ? parsed : undefined;
}
function chunkString(input, limit) {
  if (limit === void 0) {
    limit = CHUNK_LIMIT;
  }
  var chunks = [];
  for (var i = 0; i < input.length; i += limit) {
    chunks.push(input.slice(i, i + limit));
  }
  return chunks;
}
function truncateMiddle(str, max) {
  if (str.length <= max) {
    return str;
  }
  var half = Math.floor((max - 3) / 2);
  return ""
    .concat((0, utils_js_1.sliceUtf16Safe)(str, 0, half), "...")
    .concat((0, utils_js_1.sliceUtf16Safe)(str, -half));
}
function sliceLogLines(text, offset, limit) {
  if (!text) {
    return { slice: "", totalLines: 0, totalChars: 0 };
  }
  var normalized = text.replace(/\r\n/g, "\n");
  var lines = normalized.split("\n");
  if (lines.length > 0 && lines[lines.length - 1] === "") {
    lines.pop();
  }
  var totalLines = lines.length;
  var totalChars = text.length;
  var start =
    typeof offset === "number" && Number.isFinite(offset) ? Math.max(0, Math.floor(offset)) : 0;
  if (limit !== undefined && offset === undefined) {
    var tailCount = Math.max(0, Math.floor(limit));
    start = Math.max(totalLines - tailCount, 0);
  }
  var end =
    typeof limit === "number" && Number.isFinite(limit)
      ? start + Math.max(0, Math.floor(limit))
      : undefined;
  return {
    slice: lines.slice(start, end).join("\n"),
    totalLines: totalLines,
    totalChars: totalChars,
  };
}
function deriveSessionName(command) {
  var tokens = tokenizeCommand(command);
  if (tokens.length === 0) {
    return undefined;
  }
  var verb = tokens[0];
  var target = tokens.slice(1).find(function (t) {
    return !t.startsWith("-");
  });
  if (!target) {
    target = tokens[1];
  }
  if (!target) {
    return verb;
  }
  var cleaned = truncateMiddle(stripQuotes(target), 48);
  return "".concat(stripQuotes(verb), " ").concat(cleaned);
}
function tokenizeCommand(command) {
  var _a;
  var matches =
    (_a = command.match(/(?:[^\s"']+|"(?:\\.|[^"])*"|'(?:\\.|[^'])*')+/g)) !== null && _a !== void 0
      ? _a
      : [];
  return matches
    .map(function (token) {
      return stripQuotes(token);
    })
    .filter(Boolean);
}
function stripQuotes(value) {
  var trimmed = value.trim();
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}
function formatDuration(ms) {
  if (ms < 1000) {
    return "".concat(ms, "ms");
  }
  var seconds = Math.floor(ms / 1000);
  if (seconds < 60) {
    return "".concat(seconds, "s");
  }
  var minutes = Math.floor(seconds / 60);
  var rem = seconds % 60;
  return "".concat(minutes, "m").concat(rem.toString().padStart(2, "0"), "s");
}
function pad(str, width) {
  if (str.length >= width) {
    return str;
  }
  return str + " ".repeat(width - str.length);
}
