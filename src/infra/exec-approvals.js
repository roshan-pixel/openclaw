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
exports.DEFAULT_SAFE_BINS = void 0;
exports.resolveExecApprovalsPath = resolveExecApprovalsPath;
exports.resolveExecApprovalsSocketPath = resolveExecApprovalsSocketPath;
exports.normalizeExecApprovals = normalizeExecApprovals;
exports.readExecApprovalsSnapshot = readExecApprovalsSnapshot;
exports.loadExecApprovals = loadExecApprovals;
exports.saveExecApprovals = saveExecApprovals;
exports.ensureExecApprovals = ensureExecApprovals;
exports.resolveExecApprovals = resolveExecApprovals;
exports.resolveExecApprovalsFromFile = resolveExecApprovalsFromFile;
exports.resolveCommandResolution = resolveCommandResolution;
exports.resolveCommandResolutionFromArgv = resolveCommandResolutionFromArgv;
exports.matchAllowlist = matchAllowlist;
exports.analyzeShellCommand = analyzeShellCommand;
exports.analyzeArgvCommand = analyzeArgvCommand;
exports.normalizeSafeBins = normalizeSafeBins;
exports.resolveSafeBins = resolveSafeBins;
exports.isSafeBinUsage = isSafeBinUsage;
exports.evaluateExecAllowlist = evaluateExecAllowlist;
exports.evaluateShellAllowlist = evaluateShellAllowlist;
exports.requiresExecApproval = requiresExecApproval;
exports.recordAllowlistUse = recordAllowlistUse;
exports.addAllowlistEntry = addAllowlistEntry;
exports.minSecurity = minSecurity;
exports.maxAsk = maxAsk;
exports.requestExecApprovalViaSocket = requestExecApprovalViaSocket;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_net_1 = require("node:net");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var session_key_js_1 = require("../routing/session-key.js");
var DEFAULT_SECURITY = "deny";
var DEFAULT_ASK = "on-miss";
var DEFAULT_ASK_FALLBACK = "deny";
var DEFAULT_AUTO_ALLOW_SKILLS = false;
var DEFAULT_SOCKET = "~/.openclaw/exec-approvals.sock";
var DEFAULT_FILE = "~/.openclaw/exec-approvals.json";
exports.DEFAULT_SAFE_BINS = ["jq", "grep", "cut", "sort", "uniq", "head", "tail", "tr", "wc"];
function hashExecApprovalsRaw(raw) {
  return node_crypto_1.default
    .createHash("sha256")
    .update(raw !== null && raw !== void 0 ? raw : "")
    .digest("hex");
}
function expandHome(value) {
  if (!value) {
    return value;
  }
  if (value === "~") {
    return node_os_1.default.homedir();
  }
  if (value.startsWith("~/")) {
    return node_path_1.default.join(node_os_1.default.homedir(), value.slice(2));
  }
  return value;
}
function resolveExecApprovalsPath() {
  return expandHome(DEFAULT_FILE);
}
function resolveExecApprovalsSocketPath() {
  return expandHome(DEFAULT_SOCKET);
}
function normalizeAllowlistPattern(value) {
  var _a;
  var trimmed =
    (_a = value === null || value === void 0 ? void 0 : value.trim()) !== null && _a !== void 0
      ? _a
      : "";
  return trimmed ? trimmed.toLowerCase() : null;
}
function mergeLegacyAgent(current, legacy) {
  var _a, _b, _c, _d, _e, _f;
  var allowlist = [];
  var seen = new Set();
  var pushEntry = function (entry) {
    var key = normalizeAllowlistPattern(entry.pattern);
    if (!key || seen.has(key)) {
      return;
    }
    seen.add(key);
    allowlist.push(entry);
  };
  for (
    var _i = 0, _g = (_a = current.allowlist) !== null && _a !== void 0 ? _a : [];
    _i < _g.length;
    _i++
  ) {
    var entry = _g[_i];
    pushEntry(entry);
  }
  for (
    var _h = 0, _j = (_b = legacy.allowlist) !== null && _b !== void 0 ? _b : [];
    _h < _j.length;
    _h++
  ) {
    var entry = _j[_h];
    pushEntry(entry);
  }
  return {
    security: (_c = current.security) !== null && _c !== void 0 ? _c : legacy.security,
    ask: (_d = current.ask) !== null && _d !== void 0 ? _d : legacy.ask,
    askFallback: (_e = current.askFallback) !== null && _e !== void 0 ? _e : legacy.askFallback,
    autoAllowSkills:
      (_f = current.autoAllowSkills) !== null && _f !== void 0 ? _f : legacy.autoAllowSkills,
    allowlist: allowlist.length > 0 ? allowlist : undefined,
  };
}
function ensureDir(filePath) {
  var dir = node_path_1.default.dirname(filePath);
  node_fs_1.default.mkdirSync(dir, { recursive: true });
}
function ensureAllowlistIds(allowlist) {
  if (!Array.isArray(allowlist) || allowlist.length === 0) {
    return allowlist;
  }
  var changed = false;
  var next = allowlist.map(function (entry) {
    if (entry.id) {
      return entry;
    }
    changed = true;
    return __assign(__assign({}, entry), { id: node_crypto_1.default.randomUUID() });
  });
  return changed ? next : allowlist;
}
function normalizeExecApprovals(file) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var socketPath =
    (_b = (_a = file.socket) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0
      ? void 0
      : _b.trim();
  var token =
    (_d = (_c = file.socket) === null || _c === void 0 ? void 0 : _c.token) === null ||
    _d === void 0
      ? void 0
      : _d.trim();
  var agents = __assign({}, file.agents);
  var legacyDefault = agents.default;
  if (legacyDefault) {
    var main = agents[session_key_js_1.DEFAULT_AGENT_ID];
    agents[session_key_js_1.DEFAULT_AGENT_ID] = main
      ? mergeLegacyAgent(main, legacyDefault)
      : legacyDefault;
    delete agents.default;
  }
  for (var _i = 0, _j = Object.entries(agents); _i < _j.length; _i++) {
    var _k = _j[_i],
      key = _k[0],
      agent = _k[1];
    var allowlist = ensureAllowlistIds(agent.allowlist);
    if (allowlist !== agent.allowlist) {
      agents[key] = __assign(__assign({}, agent), { allowlist: allowlist });
    }
  }
  var normalized = {
    version: 1,
    socket: {
      path: socketPath && socketPath.length > 0 ? socketPath : undefined,
      token: token && token.length > 0 ? token : undefined,
    },
    defaults: {
      security: (_e = file.defaults) === null || _e === void 0 ? void 0 : _e.security,
      ask: (_f = file.defaults) === null || _f === void 0 ? void 0 : _f.ask,
      askFallback: (_g = file.defaults) === null || _g === void 0 ? void 0 : _g.askFallback,
      autoAllowSkills: (_h = file.defaults) === null || _h === void 0 ? void 0 : _h.autoAllowSkills,
    },
    agents: agents,
  };
  return normalized;
}
function generateToken() {
  return node_crypto_1.default.randomBytes(24).toString("base64url");
}
function readExecApprovalsSnapshot() {
  var filePath = resolveExecApprovalsPath();
  if (!node_fs_1.default.existsSync(filePath)) {
    var file_1 = normalizeExecApprovals({ version: 1, agents: {} });
    return {
      path: filePath,
      exists: false,
      raw: null,
      file: file_1,
      hash: hashExecApprovalsRaw(null),
    };
  }
  var raw = node_fs_1.default.readFileSync(filePath, "utf8");
  var parsed = null;
  try {
    parsed = JSON.parse(raw);
  } catch (_a) {
    parsed = null;
  }
  var file =
    (parsed === null || parsed === void 0 ? void 0 : parsed.version) === 1
      ? normalizeExecApprovals(parsed)
      : normalizeExecApprovals({ version: 1, agents: {} });
  return {
    path: filePath,
    exists: true,
    raw: raw,
    file: file,
    hash: hashExecApprovalsRaw(raw),
  };
}
function loadExecApprovals() {
  var filePath = resolveExecApprovalsPath();
  try {
    if (!node_fs_1.default.existsSync(filePath)) {
      return normalizeExecApprovals({ version: 1, agents: {} });
    }
    var raw = node_fs_1.default.readFileSync(filePath, "utf8");
    var parsed = JSON.parse(raw);
    if ((parsed === null || parsed === void 0 ? void 0 : parsed.version) !== 1) {
      return normalizeExecApprovals({ version: 1, agents: {} });
    }
    return normalizeExecApprovals(parsed);
  } catch (_a) {
    return normalizeExecApprovals({ version: 1, agents: {} });
  }
}
function saveExecApprovals(file) {
  var filePath = resolveExecApprovalsPath();
  ensureDir(filePath);
  node_fs_1.default.writeFileSync(filePath, "".concat(JSON.stringify(file, null, 2), "\n"), {
    mode: 384,
  });
  try {
    node_fs_1.default.chmodSync(filePath, 384);
  } catch (_a) {
    // best-effort on platforms without chmod
  }
}
function ensureExecApprovals() {
  var _a, _b, _c, _d;
  var loaded = loadExecApprovals();
  var next = normalizeExecApprovals(loaded);
  var socketPath =
    (_b = (_a = next.socket) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0
      ? void 0
      : _b.trim();
  var token =
    (_d = (_c = next.socket) === null || _c === void 0 ? void 0 : _c.token) === null ||
    _d === void 0
      ? void 0
      : _d.trim();
  var updated = __assign(__assign({}, next), {
    socket: {
      path: socketPath && socketPath.length > 0 ? socketPath : resolveExecApprovalsSocketPath(),
      token: token && token.length > 0 ? token : generateToken(),
    },
  });
  saveExecApprovals(updated);
  return updated;
}
function normalizeSecurity(value, fallback) {
  if (value === "allowlist" || value === "full" || value === "deny") {
    return value;
  }
  return fallback;
}
function normalizeAsk(value, fallback) {
  if (value === "always" || value === "off" || value === "on-miss") {
    return value;
  }
  return fallback;
}
function resolveExecApprovals(agentId, overrides) {
  var _a, _b, _c, _d;
  var file = ensureExecApprovals();
  return resolveExecApprovalsFromFile({
    file: file,
    agentId: agentId,
    overrides: overrides,
    path: resolveExecApprovalsPath(),
    socketPath: expandHome(
      (_b = (_a = file.socket) === null || _a === void 0 ? void 0 : _a.path) !== null &&
        _b !== void 0
        ? _b
        : resolveExecApprovalsSocketPath(),
    ),
    token:
      (_d = (_c = file.socket) === null || _c === void 0 ? void 0 : _c.token) !== null &&
      _d !== void 0
        ? _d
        : "",
  });
}
function resolveExecApprovalsFromFile(params) {
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
    _6;
  var file = normalizeExecApprovals(params.file);
  var defaults = (_a = file.defaults) !== null && _a !== void 0 ? _a : {};
  var agentKey =
    (_b = params.agentId) !== null && _b !== void 0 ? _b : session_key_js_1.DEFAULT_AGENT_ID;
  var agent =
    (_d = (_c = file.agents) === null || _c === void 0 ? void 0 : _c[agentKey]) !== null &&
    _d !== void 0
      ? _d
      : {};
  var wildcard =
    (_f = (_e = file.agents) === null || _e === void 0 ? void 0 : _e["*"]) !== null && _f !== void 0
      ? _f
      : {};
  var fallbackSecurity =
    (_h = (_g = params.overrides) === null || _g === void 0 ? void 0 : _g.security) !== null &&
    _h !== void 0
      ? _h
      : DEFAULT_SECURITY;
  var fallbackAsk =
    (_k = (_j = params.overrides) === null || _j === void 0 ? void 0 : _j.ask) !== null &&
    _k !== void 0
      ? _k
      : DEFAULT_ASK;
  var fallbackAskFallback =
    (_m = (_l = params.overrides) === null || _l === void 0 ? void 0 : _l.askFallback) !== null &&
    _m !== void 0
      ? _m
      : DEFAULT_ASK_FALLBACK;
  var fallbackAutoAllowSkills =
    (_p = (_o = params.overrides) === null || _o === void 0 ? void 0 : _o.autoAllowSkills) !==
      null && _p !== void 0
      ? _p
      : DEFAULT_AUTO_ALLOW_SKILLS;
  var resolvedDefaults = {
    security: normalizeSecurity(defaults.security, fallbackSecurity),
    ask: normalizeAsk(defaults.ask, fallbackAsk),
    askFallback: normalizeSecurity(
      (_q = defaults.askFallback) !== null && _q !== void 0 ? _q : fallbackAskFallback,
      fallbackAskFallback,
    ),
    autoAllowSkills: Boolean(
      (_r = defaults.autoAllowSkills) !== null && _r !== void 0 ? _r : fallbackAutoAllowSkills,
    ),
  };
  var resolvedAgent = {
    security: normalizeSecurity(
      (_t = (_s = agent.security) !== null && _s !== void 0 ? _s : wildcard.security) !== null &&
        _t !== void 0
        ? _t
        : resolvedDefaults.security,
      resolvedDefaults.security,
    ),
    ask: normalizeAsk(
      (_v = (_u = agent.ask) !== null && _u !== void 0 ? _u : wildcard.ask) !== null &&
        _v !== void 0
        ? _v
        : resolvedDefaults.ask,
      resolvedDefaults.ask,
    ),
    askFallback: normalizeSecurity(
      (_x = (_w = agent.askFallback) !== null && _w !== void 0 ? _w : wildcard.askFallback) !==
        null && _x !== void 0
        ? _x
        : resolvedDefaults.askFallback,
      resolvedDefaults.askFallback,
    ),
    autoAllowSkills: Boolean(
      (_z =
        (_y = agent.autoAllowSkills) !== null && _y !== void 0 ? _y : wildcard.autoAllowSkills) !==
        null && _z !== void 0
        ? _z
        : resolvedDefaults.autoAllowSkills,
    ),
  };
  var allowlist = __spreadArray(
    __spreadArray([], Array.isArray(wildcard.allowlist) ? wildcard.allowlist : [], true),
    Array.isArray(agent.allowlist) ? agent.allowlist : [],
    true,
  );
  return {
    path: (_0 = params.path) !== null && _0 !== void 0 ? _0 : resolveExecApprovalsPath(),
    socketPath: expandHome(
      (_3 =
        (_1 = params.socketPath) !== null && _1 !== void 0
          ? _1
          : (_2 = file.socket) === null || _2 === void 0
            ? void 0
            : _2.path) !== null && _3 !== void 0
        ? _3
        : resolveExecApprovalsSocketPath(),
    ),
    token:
      (_6 =
        (_4 = params.token) !== null && _4 !== void 0
          ? _4
          : (_5 = file.socket) === null || _5 === void 0
            ? void 0
            : _5.token) !== null && _6 !== void 0
        ? _6
        : "",
    defaults: resolvedDefaults,
    agent: resolvedAgent,
    allowlist: allowlist,
    file: file,
  };
}
function isExecutableFile(filePath) {
  try {
    var stat = node_fs_1.default.statSync(filePath);
    if (!stat.isFile()) {
      return false;
    }
    if (process.platform !== "win32") {
      node_fs_1.default.accessSync(filePath, node_fs_1.default.constants.X_OK);
    }
    return true;
  } catch (_a) {
    return false;
  }
}
function parseFirstToken(command) {
  var trimmed = command.trim();
  if (!trimmed) {
    return null;
  }
  var first = trimmed[0];
  if (first === '"' || first === "'") {
    var end = trimmed.indexOf(first, 1);
    if (end > 1) {
      return trimmed.slice(1, end);
    }
    return trimmed.slice(1);
  }
  var match = /^[^\s]+/.exec(trimmed);
  return match ? match[0] : null;
}
function resolveExecutablePath(rawExecutable, cwd, env) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var expanded = rawExecutable.startsWith("~") ? expandHome(rawExecutable) : rawExecutable;
  if (expanded.includes("/") || expanded.includes("\\")) {
    if (node_path_1.default.isAbsolute(expanded)) {
      return isExecutableFile(expanded) ? expanded : undefined;
    }
    var base = cwd && cwd.trim() ? cwd.trim() : process.cwd();
    var candidate = node_path_1.default.resolve(base, expanded);
    return isExecutableFile(candidate) ? candidate : undefined;
  }
  var envPath =
    (_d =
      (_c =
        (_b =
          (_a = env === null || env === void 0 ? void 0 : env.PATH) !== null && _a !== void 0
            ? _a
            : env === null || env === void 0
              ? void 0
              : env.Path) !== null && _b !== void 0
          ? _b
          : process.env.PATH) !== null && _c !== void 0
        ? _c
        : process.env.Path) !== null && _d !== void 0
      ? _d
      : "";
  var entries = envPath.split(node_path_1.default.delimiter).filter(Boolean);
  var hasExtension =
    process.platform === "win32" && node_path_1.default.extname(expanded).length > 0;
  var extensions =
    process.platform === "win32"
      ? hasExtension
        ? [""]
        : ((_h =
            (_g =
              (_f =
                (_e = env === null || env === void 0 ? void 0 : env.PATHEXT) !== null &&
                _e !== void 0
                  ? _e
                  : env === null || env === void 0
                    ? void 0
                    : env.Pathext) !== null && _f !== void 0
                ? _f
                : process.env.PATHEXT) !== null && _g !== void 0
              ? _g
              : process.env.Pathext) !== null && _h !== void 0
            ? _h
            : ".EXE;.CMD;.BAT;.COM"
          )
            .split(";")
            .map(function (ext) {
              return ext.toLowerCase();
            })
      : [""];
  for (var _i = 0, entries_1 = entries; _i < entries_1.length; _i++) {
    var entry = entries_1[_i];
    for (var _j = 0, extensions_1 = extensions; _j < extensions_1.length; _j++) {
      var ext = extensions_1[_j];
      var candidate = node_path_1.default.join(entry, expanded + ext);
      if (isExecutableFile(candidate)) {
        return candidate;
      }
    }
  }
  return undefined;
}
function resolveCommandResolution(command, cwd, env) {
  var rawExecutable = parseFirstToken(command);
  if (!rawExecutable) {
    return null;
  }
  var resolvedPath = resolveExecutablePath(rawExecutable, cwd, env);
  var executableName = resolvedPath ? node_path_1.default.basename(resolvedPath) : rawExecutable;
  return {
    rawExecutable: rawExecutable,
    resolvedPath: resolvedPath,
    executableName: executableName,
  };
}
function resolveCommandResolutionFromArgv(argv, cwd, env) {
  var _a;
  var rawExecutable = (_a = argv[0]) === null || _a === void 0 ? void 0 : _a.trim();
  if (!rawExecutable) {
    return null;
  }
  var resolvedPath = resolveExecutablePath(rawExecutable, cwd, env);
  var executableName = resolvedPath ? node_path_1.default.basename(resolvedPath) : rawExecutable;
  return {
    rawExecutable: rawExecutable,
    resolvedPath: resolvedPath,
    executableName: executableName,
  };
}
function normalizeMatchTarget(value) {
  if (process.platform === "win32") {
    var stripped = value.replace(/^\\\\[?.]\\/, "");
    return stripped.replace(/\\/g, "/").toLowerCase();
  }
  return value.replace(/\\\\/g, "/").toLowerCase();
}
function tryRealpath(value) {
  try {
    return node_fs_1.default.realpathSync(value);
  } catch (_a) {
    return null;
  }
}
function globToRegExp(pattern) {
  var regex = "^";
  var i = 0;
  while (i < pattern.length) {
    var ch = pattern[i];
    if (ch === "*") {
      var next = pattern[i + 1];
      if (next === "*") {
        regex += ".*";
        i += 2;
        continue;
      }
      regex += "[^/]*";
      i += 1;
      continue;
    }
    if (ch === "?") {
      regex += ".";
      i += 1;
      continue;
    }
    regex += ch.replace(/[.*+?^${}()|[\\]\\\\]/g, "\\$&");
    i += 1;
  }
  regex += "$";
  return new RegExp(regex, "i");
}
function matchesPattern(pattern, target) {
  var _a, _b;
  var trimmed = pattern.trim();
  if (!trimmed) {
    return false;
  }
  var expanded = trimmed.startsWith("~") ? expandHome(trimmed) : trimmed;
  var hasWildcard = /[*?]/.test(expanded);
  var normalizedPattern = expanded;
  var normalizedTarget = target;
  if (process.platform === "win32" && !hasWildcard) {
    normalizedPattern = (_a = tryRealpath(expanded)) !== null && _a !== void 0 ? _a : expanded;
    normalizedTarget = (_b = tryRealpath(target)) !== null && _b !== void 0 ? _b : target;
  }
  normalizedPattern = normalizeMatchTarget(normalizedPattern);
  normalizedTarget = normalizeMatchTarget(normalizedTarget);
  var regex = globToRegExp(normalizedPattern);
  return regex.test(normalizedTarget);
}
function resolveAllowlistCandidatePath(resolution, cwd) {
  var _a;
  if (!resolution) {
    return undefined;
  }
  if (resolution.resolvedPath) {
    return resolution.resolvedPath;
  }
  var raw = (_a = resolution.rawExecutable) === null || _a === void 0 ? void 0 : _a.trim();
  if (!raw) {
    return undefined;
  }
  var expanded = raw.startsWith("~") ? expandHome(raw) : raw;
  if (!expanded.includes("/") && !expanded.includes("\\")) {
    return undefined;
  }
  if (node_path_1.default.isAbsolute(expanded)) {
    return expanded;
  }
  var base = cwd && cwd.trim() ? cwd.trim() : process.cwd();
  return node_path_1.default.resolve(base, expanded);
}
function matchAllowlist(entries, resolution) {
  var _a;
  if (
    !entries.length ||
    !(resolution === null || resolution === void 0 ? void 0 : resolution.resolvedPath)
  ) {
    return null;
  }
  var resolvedPath = resolution.resolvedPath;
  for (var _i = 0, entries_2 = entries; _i < entries_2.length; _i++) {
    var entry = entries_2[_i];
    var pattern = (_a = entry.pattern) === null || _a === void 0 ? void 0 : _a.trim();
    if (!pattern) {
      continue;
    }
    var hasPath = pattern.includes("/") || pattern.includes("\\") || pattern.includes("~");
    if (!hasPath) {
      continue;
    }
    if (matchesPattern(pattern, resolvedPath)) {
      return entry;
    }
  }
  return null;
}
var DISALLOWED_PIPELINE_TOKENS = new Set([">", "<", "`", "\n", "\r", "(", ")"]);
/**
 * Iterates through a command string while respecting shell quoting rules.
 * The callback receives each character and the next character, and returns an action:
 * - "split": push current buffer as a segment and start a new one
 * - "skip": skip this character (and optionally the next via skip count)
 * - "include": add this character to the buffer
 * - { reject: reason }: abort with an error
 */
function iterateQuoteAware(command, onChar) {
  var parts = [];
  var buf = "";
  var inSingle = false;
  var inDouble = false;
  var escaped = false;
  var hasSplit = false;
  var pushPart = function () {
    var trimmed = buf.trim();
    if (trimmed) {
      parts.push(trimmed);
    }
    buf = "";
  };
  for (var i = 0; i < command.length; i += 1) {
    var ch = command[i];
    var next = command[i + 1];
    if (escaped) {
      buf += ch;
      escaped = false;
      continue;
    }
    if (!inSingle && !inDouble && ch === "\\") {
      escaped = true;
      buf += ch;
      continue;
    }
    if (inSingle) {
      if (ch === "'") {
        inSingle = false;
      }
      buf += ch;
      continue;
    }
    if (inDouble) {
      if (ch === '"') {
        inDouble = false;
      }
      buf += ch;
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      buf += ch;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      buf += ch;
      continue;
    }
    var action = onChar(ch, next, i);
    if (typeof action === "object" && "reject" in action) {
      return { ok: false, reason: action.reject };
    }
    if (action === "split") {
      pushPart();
      hasSplit = true;
      continue;
    }
    if (action === "skip") {
      continue;
    }
    buf += ch;
  }
  if (escaped || inSingle || inDouble) {
    return { ok: false, reason: "unterminated shell quote/escape" };
  }
  pushPart();
  return { ok: true, parts: parts, hasSplit: hasSplit };
}
function splitShellPipeline(command) {
  var emptySegment = false;
  var result = iterateQuoteAware(command, function (ch, next) {
    if (ch === "|" && next === "|") {
      return { reject: "unsupported shell token: ||" };
    }
    if (ch === "|" && next === "&") {
      return { reject: "unsupported shell token: |&" };
    }
    if (ch === "|") {
      emptySegment = true;
      return "split";
    }
    if (ch === "&" || ch === ";") {
      return { reject: "unsupported shell token: ".concat(ch) };
    }
    if (DISALLOWED_PIPELINE_TOKENS.has(ch)) {
      return { reject: "unsupported shell token: ".concat(ch) };
    }
    if (ch === "$" && next === "(") {
      return { reject: "unsupported shell token: $()" };
    }
    emptySegment = false;
    return "include";
  });
  if (!result.ok) {
    return { ok: false, reason: result.reason, segments: [] };
  }
  if (emptySegment || result.parts.length === 0) {
    return {
      ok: false,
      reason: result.parts.length === 0 ? "empty command" : "empty pipeline segment",
      segments: [],
    };
  }
  return { ok: true, segments: result.parts };
}
function tokenizeShellSegment(segment) {
  var tokens = [];
  var buf = "";
  var inSingle = false;
  var inDouble = false;
  var escaped = false;
  var pushToken = function () {
    if (buf.length > 0) {
      tokens.push(buf);
      buf = "";
    }
  };
  for (var i = 0; i < segment.length; i += 1) {
    var ch = segment[i];
    if (escaped) {
      buf += ch;
      escaped = false;
      continue;
    }
    if (!inSingle && !inDouble && ch === "\\") {
      escaped = true;
      continue;
    }
    if (inSingle) {
      if (ch === "'") {
        inSingle = false;
      } else {
        buf += ch;
      }
      continue;
    }
    if (inDouble) {
      if (ch === '"') {
        inDouble = false;
      } else {
        buf += ch;
      }
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      continue;
    }
    if (/\s/.test(ch)) {
      pushToken();
      continue;
    }
    buf += ch;
  }
  if (escaped || inSingle || inDouble) {
    return null;
  }
  pushToken();
  return tokens;
}
function parseSegmentsFromParts(parts, cwd, env) {
  var segments = [];
  for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
    var raw = parts_1[_i];
    var argv = tokenizeShellSegment(raw);
    if (!argv || argv.length === 0) {
      return null;
    }
    segments.push({
      raw: raw,
      argv: argv,
      resolution: resolveCommandResolutionFromArgv(argv, cwd, env),
    });
  }
  return segments;
}
function analyzeShellCommand(params) {
  // First try splitting by chain operators (&&, ||, ;)
  var chainParts = splitCommandChain(params.command);
  if (chainParts) {
    var chains = [];
    var allSegments = [];
    for (var _i = 0, chainParts_1 = chainParts; _i < chainParts_1.length; _i++) {
      var part = chainParts_1[_i];
      var pipelineSplit = splitShellPipeline(part);
      if (!pipelineSplit.ok) {
        return { ok: false, reason: pipelineSplit.reason, segments: [] };
      }
      var segments_1 = parseSegmentsFromParts(pipelineSplit.segments, params.cwd, params.env);
      if (!segments_1) {
        return { ok: false, reason: "unable to parse shell segment", segments: [] };
      }
      chains.push(segments_1);
      allSegments.push.apply(allSegments, segments_1);
    }
    return { ok: true, segments: allSegments, chains: chains };
  }
  // No chain operators, parse as simple pipeline
  var split = splitShellPipeline(params.command);
  if (!split.ok) {
    return { ok: false, reason: split.reason, segments: [] };
  }
  var segments = parseSegmentsFromParts(split.segments, params.cwd, params.env);
  if (!segments) {
    return { ok: false, reason: "unable to parse shell segment", segments: [] };
  }
  return { ok: true, segments: segments };
}
function analyzeArgvCommand(params) {
  var argv = params.argv.filter(function (entry) {
    return entry.trim().length > 0;
  });
  if (argv.length === 0) {
    return { ok: false, reason: "empty argv", segments: [] };
  }
  return {
    ok: true,
    segments: [
      {
        raw: argv.join(" "),
        argv: argv,
        resolution: resolveCommandResolutionFromArgv(argv, params.cwd, params.env),
      },
    ],
  };
}
function isPathLikeToken(value) {
  var trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  if (trimmed === "-") {
    return false;
  }
  if (trimmed.startsWith("./") || trimmed.startsWith("../") || trimmed.startsWith("~")) {
    return true;
  }
  if (trimmed.startsWith("/")) {
    return true;
  }
  return /^[A-Za-z]:[\\/]/.test(trimmed);
}
function defaultFileExists(filePath) {
  try {
    return node_fs_1.default.existsSync(filePath);
  } catch (_a) {
    return false;
  }
}
function normalizeSafeBins(entries) {
  if (!Array.isArray(entries)) {
    return new Set();
  }
  var normalized = entries
    .map(function (entry) {
      return entry.trim().toLowerCase();
    })
    .filter(function (entry) {
      return entry.length > 0;
    });
  return new Set(normalized);
}
function resolveSafeBins(entries) {
  if (entries === undefined) {
    return normalizeSafeBins(exports.DEFAULT_SAFE_BINS);
  }
  return normalizeSafeBins(entries !== null && entries !== void 0 ? entries : []);
}
function isSafeBinUsage(params) {
  var _a, _b, _c;
  if (params.safeBins.size === 0) {
    return false;
  }
  var resolution = params.resolution;
  var execName =
    (_a = resolution === null || resolution === void 0 ? void 0 : resolution.executableName) ===
      null || _a === void 0
      ? void 0
      : _a.toLowerCase();
  if (!execName) {
    return false;
  }
  var matchesSafeBin =
    params.safeBins.has(execName) ||
    (process.platform === "win32" && params.safeBins.has(node_path_1.default.parse(execName).name));
  if (!matchesSafeBin) {
    return false;
  }
  if (!(resolution === null || resolution === void 0 ? void 0 : resolution.resolvedPath)) {
    return false;
  }
  var cwd = (_b = params.cwd) !== null && _b !== void 0 ? _b : process.cwd();
  var exists = (_c = params.fileExists) !== null && _c !== void 0 ? _c : defaultFileExists;
  var argv = params.argv.slice(1);
  for (var i = 0; i < argv.length; i += 1) {
    var token = argv[i];
    if (!token) {
      continue;
    }
    if (token === "-") {
      continue;
    }
    if (token.startsWith("-")) {
      var eqIndex = token.indexOf("=");
      if (eqIndex > 0) {
        var value = token.slice(eqIndex + 1);
        if (value && (isPathLikeToken(value) || exists(node_path_1.default.resolve(cwd, value)))) {
          return false;
        }
      }
      continue;
    }
    if (isPathLikeToken(token)) {
      return false;
    }
    if (exists(node_path_1.default.resolve(cwd, token))) {
      return false;
    }
  }
  return true;
}
function evaluateSegments(segments, params) {
  var _a, _b;
  var matches = [];
  var allowSkills =
    params.autoAllowSkills === true &&
    ((_b = (_a = params.skillBins) === null || _a === void 0 ? void 0 : _a.size) !== null &&
    _b !== void 0
      ? _b
      : 0) > 0;
  var satisfied = segments.every(function (segment) {
    var _a, _b;
    var candidatePath = resolveAllowlistCandidatePath(segment.resolution, params.cwd);
    var candidateResolution =
      candidatePath && segment.resolution
        ? __assign(__assign({}, segment.resolution), { resolvedPath: candidatePath })
        : segment.resolution;
    var match = matchAllowlist(params.allowlist, candidateResolution);
    if (match) {
      matches.push(match);
    }
    var safe = isSafeBinUsage({
      argv: segment.argv,
      resolution: segment.resolution,
      safeBins: params.safeBins,
      cwd: params.cwd,
    });
    var skillAllow =
      allowSkills &&
      ((_a = segment.resolution) === null || _a === void 0 ? void 0 : _a.executableName)
        ? (_b = params.skillBins) === null || _b === void 0
          ? void 0
          : _b.has(segment.resolution.executableName)
        : false;
    return Boolean(match || safe || skillAllow);
  });
  return { satisfied: satisfied, matches: matches };
}
function evaluateExecAllowlist(params) {
  var allowlistMatches = [];
  if (!params.analysis.ok || params.analysis.segments.length === 0) {
    return { allowlistSatisfied: false, allowlistMatches: allowlistMatches };
  }
  // If the analysis contains chains, evaluate each chain part separately
  if (params.analysis.chains) {
    for (var _i = 0, _a = params.analysis.chains; _i < _a.length; _i++) {
      var chainSegments = _a[_i];
      var result_1 = evaluateSegments(chainSegments, {
        allowlist: params.allowlist,
        safeBins: params.safeBins,
        cwd: params.cwd,
        skillBins: params.skillBins,
        autoAllowSkills: params.autoAllowSkills,
      });
      if (!result_1.satisfied) {
        return { allowlistSatisfied: false, allowlistMatches: [] };
      }
      allowlistMatches.push.apply(allowlistMatches, result_1.matches);
    }
    return { allowlistSatisfied: true, allowlistMatches: allowlistMatches };
  }
  // No chains, evaluate all segments together
  var result = evaluateSegments(params.analysis.segments, {
    allowlist: params.allowlist,
    safeBins: params.safeBins,
    cwd: params.cwd,
    skillBins: params.skillBins,
    autoAllowSkills: params.autoAllowSkills,
  });
  return { allowlistSatisfied: result.satisfied, allowlistMatches: result.matches };
}
/**
 * Splits a command string by chain operators (&&, ||, ;) while respecting quotes.
 * Returns null when no chain is present or when the chain is malformed.
 */
function splitCommandChain(command) {
  var parts = [];
  var buf = "";
  var inSingle = false;
  var inDouble = false;
  var escaped = false;
  var foundChain = false;
  var invalidChain = false;
  var pushPart = function () {
    var trimmed = buf.trim();
    if (trimmed) {
      parts.push(trimmed);
      buf = "";
      return true;
    }
    buf = "";
    return false;
  };
  for (var i = 0; i < command.length; i += 1) {
    var ch = command[i];
    if (escaped) {
      buf += ch;
      escaped = false;
      continue;
    }
    if (!inSingle && !inDouble && ch === "\\") {
      escaped = true;
      buf += ch;
      continue;
    }
    if (inSingle) {
      if (ch === "'") {
        inSingle = false;
      }
      buf += ch;
      continue;
    }
    if (inDouble) {
      if (ch === '"') {
        inDouble = false;
      }
      buf += ch;
      continue;
    }
    if (ch === "'") {
      inSingle = true;
      buf += ch;
      continue;
    }
    if (ch === '"') {
      inDouble = true;
      buf += ch;
      continue;
    }
    if (ch === "&" && command[i + 1] === "&") {
      if (!pushPart()) {
        invalidChain = true;
      }
      i += 1;
      foundChain = true;
      continue;
    }
    if (ch === "|" && command[i + 1] === "|") {
      if (!pushPart()) {
        invalidChain = true;
      }
      i += 1;
      foundChain = true;
      continue;
    }
    if (ch === ";") {
      if (!pushPart()) {
        invalidChain = true;
      }
      foundChain = true;
      continue;
    }
    buf += ch;
  }
  var pushedFinal = pushPart();
  if (!foundChain) {
    return null;
  }
  if (invalidChain || !pushedFinal) {
    return null;
  }
  return parts.length > 0 ? parts : null;
}
/**
 * Evaluates allowlist for shell commands (including &&, ||, ;) and returns analysis metadata.
 */
function evaluateShellAllowlist(params) {
  var chainParts = splitCommandChain(params.command);
  if (!chainParts) {
    var analysis = analyzeShellCommand({
      command: params.command,
      cwd: params.cwd,
      env: params.env,
    });
    if (!analysis.ok) {
      return {
        analysisOk: false,
        allowlistSatisfied: false,
        allowlistMatches: [],
        segments: [],
      };
    }
    var evaluation = evaluateExecAllowlist({
      analysis: analysis,
      allowlist: params.allowlist,
      safeBins: params.safeBins,
      cwd: params.cwd,
      skillBins: params.skillBins,
      autoAllowSkills: params.autoAllowSkills,
    });
    return {
      analysisOk: true,
      allowlistSatisfied: evaluation.allowlistSatisfied,
      allowlistMatches: evaluation.allowlistMatches,
      segments: analysis.segments,
    };
  }
  var allowlistMatches = [];
  var segments = [];
  for (var _i = 0, chainParts_2 = chainParts; _i < chainParts_2.length; _i++) {
    var part = chainParts_2[_i];
    var analysis = analyzeShellCommand({
      command: part,
      cwd: params.cwd,
      env: params.env,
    });
    if (!analysis.ok) {
      return {
        analysisOk: false,
        allowlistSatisfied: false,
        allowlistMatches: [],
        segments: [],
      };
    }
    segments.push.apply(segments, analysis.segments);
    var evaluation = evaluateExecAllowlist({
      analysis: analysis,
      allowlist: params.allowlist,
      safeBins: params.safeBins,
      cwd: params.cwd,
      skillBins: params.skillBins,
      autoAllowSkills: params.autoAllowSkills,
    });
    allowlistMatches.push.apply(allowlistMatches, evaluation.allowlistMatches);
    if (!evaluation.allowlistSatisfied) {
      return {
        analysisOk: true,
        allowlistSatisfied: false,
        allowlistMatches: allowlistMatches,
        segments: segments,
      };
    }
  }
  return {
    analysisOk: true,
    allowlistSatisfied: true,
    allowlistMatches: allowlistMatches,
    segments: segments,
  };
}
function requiresExecApproval(params) {
  return (
    params.ask === "always" ||
    (params.ask === "on-miss" &&
      params.security === "allowlist" &&
      (!params.analysisOk || !params.allowlistSatisfied))
  );
}
function recordAllowlistUse(approvals, agentId, entry, command, resolvedPath) {
  var _a, _b;
  var target = agentId !== null && agentId !== void 0 ? agentId : session_key_js_1.DEFAULT_AGENT_ID;
  var agents = (_a = approvals.agents) !== null && _a !== void 0 ? _a : {};
  var existing = (_b = agents[target]) !== null && _b !== void 0 ? _b : {};
  var allowlist = Array.isArray(existing.allowlist) ? existing.allowlist : [];
  var nextAllowlist = allowlist.map(function (item) {
    var _a;
    return item.pattern === entry.pattern
      ? __assign(__assign({}, item), {
          id: (_a = item.id) !== null && _a !== void 0 ? _a : node_crypto_1.default.randomUUID(),
          lastUsedAt: Date.now(),
          lastUsedCommand: command,
          lastResolvedPath: resolvedPath,
        })
      : item;
  });
  agents[target] = __assign(__assign({}, existing), { allowlist: nextAllowlist });
  approvals.agents = agents;
  saveExecApprovals(approvals);
}
function addAllowlistEntry(approvals, agentId, pattern) {
  var _a, _b;
  var target = agentId !== null && agentId !== void 0 ? agentId : session_key_js_1.DEFAULT_AGENT_ID;
  var agents = (_a = approvals.agents) !== null && _a !== void 0 ? _a : {};
  var existing = (_b = agents[target]) !== null && _b !== void 0 ? _b : {};
  var allowlist = Array.isArray(existing.allowlist) ? existing.allowlist : [];
  var trimmed = pattern.trim();
  if (!trimmed) {
    return;
  }
  if (
    allowlist.some(function (entry) {
      return entry.pattern === trimmed;
    })
  ) {
    return;
  }
  allowlist.push({
    id: node_crypto_1.default.randomUUID(),
    pattern: trimmed,
    lastUsedAt: Date.now(),
  });
  agents[target] = __assign(__assign({}, existing), { allowlist: allowlist });
  approvals.agents = agents;
  saveExecApprovals(approvals);
}
function minSecurity(a, b) {
  var order = { deny: 0, allowlist: 1, full: 2 };
  return order[a] <= order[b] ? a : b;
}
function maxAsk(a, b) {
  var order = { off: 0, "on-miss": 1, always: 2 };
  return order[a] >= order[b] ? a : b;
}
function requestExecApprovalViaSocket(params) {
  return __awaiter(this, void 0, void 0, function () {
    var socketPath, token, request, timeoutMs;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ((socketPath = params.socketPath), (token = params.token), (request = params.request));
          if (!socketPath || !token) {
            return [2 /*return*/, null];
          }
          timeoutMs = (_a = params.timeoutMs) !== null && _a !== void 0 ? _a : 15000;
          return [
            4 /*yield*/,
            new Promise(function (resolve) {
              var client = new node_net_1.default.Socket();
              var settled = false;
              var buffer = "";
              var finish = function (value) {
                if (settled) {
                  return;
                }
                settled = true;
                try {
                  client.destroy();
                } catch (_a) {
                  // ignore
                }
                resolve(value);
              };
              var timer = setTimeout(function () {
                return finish(null);
              }, timeoutMs);
              var payload = JSON.stringify({
                type: "request",
                token: token,
                id: node_crypto_1.default.randomUUID(),
                request: request,
              });
              client.on("error", function () {
                return finish(null);
              });
              client.connect(socketPath, function () {
                client.write("".concat(payload, "\n"));
              });
              client.on("data", function (data) {
                buffer += data.toString("utf8");
                var idx = buffer.indexOf("\n");
                while (idx !== -1) {
                  var line = buffer.slice(0, idx).trim();
                  buffer = buffer.slice(idx + 1);
                  idx = buffer.indexOf("\n");
                  if (!line) {
                    continue;
                  }
                  try {
                    var msg = JSON.parse(line);
                    if (
                      (msg === null || msg === void 0 ? void 0 : msg.type) === "decision" &&
                      msg.decision
                    ) {
                      clearTimeout(timer);
                      finish(msg.decision);
                      return;
                    }
                  } catch (_a) {
                    // ignore
                  }
                }
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
