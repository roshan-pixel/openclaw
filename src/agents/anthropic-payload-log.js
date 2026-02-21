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
exports.createAnthropicPayloadLogger = createAnthropicPayloadLogger;
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var boolean_js_1 = require("../utils/boolean.js");
var utils_js_1 = require("../utils.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var writers = new Map();
var log = (0, subsystem_js_1.createSubsystemLogger)("agent/anthropic-payload");
function resolvePayloadLogConfig(env) {
  var _a, _b;
  var enabled =
    (_a = (0, boolean_js_1.parseBooleanValue)(env.OPENCLAW_ANTHROPIC_PAYLOAD_LOG)) !== null &&
    _a !== void 0
      ? _a
      : false;
  var fileOverride =
    (_b = env.OPENCLAW_ANTHROPIC_PAYLOAD_LOG_FILE) === null || _b === void 0 ? void 0 : _b.trim();
  var filePath = fileOverride
    ? (0, utils_js_1.resolveUserPath)(fileOverride)
    : node_path_1.default.join(
        (0, paths_js_1.resolveStateDir)(env),
        "logs",
        "anthropic-payload.jsonl",
      );
  return { enabled: enabled, filePath: filePath };
}
function getWriter(filePath) {
  var existing = writers.get(filePath);
  if (existing) {
    return existing;
  }
  var dir = node_path_1.default.dirname(filePath);
  var ready = promises_1.default.mkdir(dir, { recursive: true }).catch(function () {
    return undefined;
  });
  var queue = Promise.resolve();
  var writer = {
    filePath: filePath,
    write: function (line) {
      queue = queue
        .then(function () {
          return ready;
        })
        .then(function () {
          return promises_1.default.appendFile(filePath, line, "utf8");
        })
        .catch(function () {
          return undefined;
        });
    },
  };
  writers.set(filePath, writer);
  return writer;
}
function safeJsonStringify(value) {
  try {
    return JSON.stringify(value, function (_key, val) {
      if (typeof val === "bigint") {
        return val.toString();
      }
      if (typeof val === "function") {
        return "[Function]";
      }
      if (val instanceof Error) {
        return { name: val.name, message: val.message, stack: val.stack };
      }
      if (val instanceof Uint8Array) {
        return { type: "Uint8Array", data: Buffer.from(val).toString("base64") };
      }
      return val;
    });
  } catch (_a) {
    return null;
  }
}
function formatError(error) {
  var _a;
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === "string") {
    return error;
  }
  if (typeof error === "number" || typeof error === "boolean" || typeof error === "bigint") {
    return String(error);
  }
  if (error && typeof error === "object") {
    return (_a = safeJsonStringify(error)) !== null && _a !== void 0 ? _a : "unknown error";
  }
  return undefined;
}
function digest(value) {
  var serialized = safeJsonStringify(value);
  if (!serialized) {
    return undefined;
  }
  return node_crypto_1.default.createHash("sha256").update(serialized).digest("hex");
}
function isAnthropicModel(model) {
  return (model === null || model === void 0 ? void 0 : model.api) === "anthropic-messages";
}
function findLastAssistantUsage(messages) {
  for (var i = messages.length - 1; i >= 0; i -= 1) {
    var msg = messages[i];
    if (
      (msg === null || msg === void 0 ? void 0 : msg.role) === "assistant" &&
      msg.usage &&
      typeof msg.usage === "object"
    ) {
      return msg.usage;
    }
  }
  return null;
}
function createAnthropicPayloadLogger(params) {
  var _a;
  var env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
  var cfg = resolvePayloadLogConfig(env);
  if (!cfg.enabled) {
    return null;
  }
  var writer = getWriter(cfg.filePath);
  var base = {
    runId: params.runId,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    provider: params.provider,
    modelId: params.modelId,
    modelApi: params.modelApi,
    workspaceDir: params.workspaceDir,
  };
  var record = function (event) {
    var line = safeJsonStringify(event);
    if (!line) {
      return;
    }
    writer.write("".concat(line, "\n"));
  };
  var wrapStreamFn = function (streamFn) {
    var wrapped = function (model, context, options) {
      if (!isAnthropicModel(model)) {
        return streamFn(model, context, options);
      }
      var nextOnPayload = function (payload) {
        var _a;
        record(
          __assign(__assign({}, base), {
            ts: new Date().toISOString(),
            stage: "request",
            payload: payload,
            payloadDigest: digest(payload),
          }),
        );
        (_a = options === null || options === void 0 ? void 0 : options.onPayload) === null ||
        _a === void 0
          ? void 0
          : _a.call(options, payload);
      };
      return streamFn(
        model,
        context,
        __assign(__assign({}, options), { onPayload: nextOnPayload }),
      );
    };
    return wrapped;
  };
  var recordUsage = function (messages, error) {
    var usage = findLastAssistantUsage(messages);
    var errorMessage = formatError(error);
    if (!usage) {
      if (errorMessage) {
        record(
          __assign(__assign({}, base), {
            ts: new Date().toISOString(),
            stage: "usage",
            error: errorMessage,
          }),
        );
      }
      return;
    }
    record(
      __assign(__assign({}, base), {
        ts: new Date().toISOString(),
        stage: "usage",
        usage: usage,
        error: errorMessage,
      }),
    );
    log.info("anthropic usage", {
      runId: params.runId,
      sessionId: params.sessionId,
      usage: usage,
    });
  };
  log.info("anthropic payload logger enabled", { filePath: writer.filePath });
  return { enabled: true, wrapStreamFn: wrapStreamFn, recordUsage: recordUsage };
}
