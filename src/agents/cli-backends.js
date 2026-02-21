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
exports.resolveCliBackendIds = resolveCliBackendIds;
exports.resolveCliBackendConfig = resolveCliBackendConfig;
var model_selection_js_1 = require("./model-selection.js");
var CLAUDE_MODEL_ALIASES = {
  opus: "opus",
  "opus-4.5": "opus",
  "opus-4": "opus",
  "claude-opus-4-5": "opus",
  "claude-opus-4": "opus",
  sonnet: "sonnet",
  "sonnet-4.5": "sonnet",
  "sonnet-4.1": "sonnet",
  "sonnet-4.0": "sonnet",
  "claude-sonnet-4-5": "sonnet",
  "claude-sonnet-4-1": "sonnet",
  "claude-sonnet-4-0": "sonnet",
  haiku: "haiku",
  "haiku-3.5": "haiku",
  "claude-haiku-3-5": "haiku",
};
var DEFAULT_CLAUDE_BACKEND = {
  command: "claude",
  args: ["-p", "--output-format", "json", "--dangerously-skip-permissions"],
  resumeArgs: [
    "-p",
    "--output-format",
    "json",
    "--dangerously-skip-permissions",
    "--resume",
    "{sessionId}",
  ],
  output: "json",
  input: "arg",
  modelArg: "--model",
  modelAliases: CLAUDE_MODEL_ALIASES,
  sessionArg: "--session-id",
  sessionMode: "always",
  sessionIdFields: ["session_id", "sessionId", "conversation_id", "conversationId"],
  systemPromptArg: "--append-system-prompt",
  systemPromptMode: "append",
  systemPromptWhen: "first",
  clearEnv: ["ANTHROPIC_API_KEY", "ANTHROPIC_API_KEY_OLD"],
  serialize: true,
};
var DEFAULT_CODEX_BACKEND = {
  command: "codex",
  args: ["exec", "--json", "--color", "never", "--sandbox", "read-only", "--skip-git-repo-check"],
  resumeArgs: [
    "exec",
    "resume",
    "{sessionId}",
    "--color",
    "never",
    "--sandbox",
    "read-only",
    "--skip-git-repo-check",
  ],
  output: "jsonl",
  resumeOutput: "text",
  input: "arg",
  modelArg: "--model",
  sessionIdFields: ["thread_id"],
  sessionMode: "existing",
  imageArg: "--image",
  imageMode: "repeat",
  serialize: true,
};
function normalizeBackendKey(key) {
  return (0, model_selection_js_1.normalizeProviderId)(key);
}
function pickBackendConfig(config, normalizedId) {
  for (var _i = 0, _a = Object.entries(config); _i < _a.length; _i++) {
    var _b = _a[_i],
      key = _b[0],
      entry = _b[1];
    if (normalizeBackendKey(key) === normalizedId) {
      return entry;
    }
  }
  return undefined;
}
function mergeBackendConfig(base, override) {
  var _a, _b, _c, _d, _e, _f;
  if (!override) {
    return __assign({}, base);
  }
  return __assign(__assign(__assign({}, base), override), {
    args: (_a = override.args) !== null && _a !== void 0 ? _a : base.args,
    env: __assign(__assign({}, base.env), override.env),
    modelAliases: __assign(__assign({}, base.modelAliases), override.modelAliases),
    clearEnv: Array.from(
      new Set(
        __spreadArray(
          __spreadArray([], (_b = base.clearEnv) !== null && _b !== void 0 ? _b : [], true),
          (_c = override.clearEnv) !== null && _c !== void 0 ? _c : [],
          true,
        ),
      ),
    ),
    sessionIdFields:
      (_d = override.sessionIdFields) !== null && _d !== void 0 ? _d : base.sessionIdFields,
    sessionArgs: (_e = override.sessionArgs) !== null && _e !== void 0 ? _e : base.sessionArgs,
    resumeArgs: (_f = override.resumeArgs) !== null && _f !== void 0 ? _f : base.resumeArgs,
  });
}
function resolveCliBackendIds(cfg) {
  var _a, _b, _c;
  var ids = new Set([normalizeBackendKey("claude-cli"), normalizeBackendKey("codex-cli")]);
  var configured =
    (_c =
      (_b =
        (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0
          ? void 0
          : _a.defaults) === null || _b === void 0
        ? void 0
        : _b.cliBackends) !== null && _c !== void 0
      ? _c
      : {};
  for (var _i = 0, _d = Object.keys(configured); _i < _d.length; _i++) {
    var key = _d[_i];
    ids.add(normalizeBackendKey(key));
  }
  return ids;
}
function resolveCliBackendConfig(provider, cfg) {
  var _a, _b, _c, _d, _e, _f;
  var normalized = normalizeBackendKey(provider);
  var configured =
    (_c =
      (_b =
        (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0
          ? void 0
          : _a.defaults) === null || _b === void 0
        ? void 0
        : _b.cliBackends) !== null && _c !== void 0
      ? _c
      : {};
  var override = pickBackendConfig(configured, normalized);
  if (normalized === "claude-cli") {
    var merged = mergeBackendConfig(DEFAULT_CLAUDE_BACKEND, override);
    var command_1 = (_d = merged.command) === null || _d === void 0 ? void 0 : _d.trim();
    if (!command_1) {
      return null;
    }
    return { id: normalized, config: __assign(__assign({}, merged), { command: command_1 }) };
  }
  if (normalized === "codex-cli") {
    var merged = mergeBackendConfig(DEFAULT_CODEX_BACKEND, override);
    var command_2 = (_e = merged.command) === null || _e === void 0 ? void 0 : _e.trim();
    if (!command_2) {
      return null;
    }
    return { id: normalized, config: __assign(__assign({}, merged), { command: command_2 }) };
  }
  if (!override) {
    return null;
  }
  var command = (_f = override.command) === null || _f === void 0 ? void 0 : _f.trim();
  if (!command) {
    return null;
  }
  return { id: normalized, config: __assign(__assign({}, override), { command: command }) };
}
