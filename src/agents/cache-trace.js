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
exports.createCacheTrace = createCacheTrace;
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var paths_js_1 = require("../config/paths.js");
var boolean_js_1 = require("../utils/boolean.js");
var utils_js_1 = require("../utils.js");
var writers = new Map();
function resolveCacheTraceConfig(params) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j;
  var env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
  var config =
    (_c = (_b = params.cfg) === null || _b === void 0 ? void 0 : _b.diagnostics) === null ||
    _c === void 0
      ? void 0
      : _c.cacheTrace;
  var envEnabled = (0, boolean_js_1.parseBooleanValue)(env.OPENCLAW_CACHE_TRACE);
  var enabled =
    (_d =
      envEnabled !== null && envEnabled !== void 0
        ? envEnabled
        : config === null || config === void 0
          ? void 0
          : config.enabled) !== null && _d !== void 0
      ? _d
      : false;
  var fileOverride =
    ((_e = config === null || config === void 0 ? void 0 : config.filePath) === null ||
    _e === void 0
      ? void 0
      : _e.trim()) ||
    ((_f = env.OPENCLAW_CACHE_TRACE_FILE) === null || _f === void 0 ? void 0 : _f.trim());
  var filePath = fileOverride
    ? (0, utils_js_1.resolveUserPath)(fileOverride)
    : node_path_1.default.join((0, paths_js_1.resolveStateDir)(env), "logs", "cache-trace.jsonl");
  var includeMessages =
    (_g = (0, boolean_js_1.parseBooleanValue)(env.OPENCLAW_CACHE_TRACE_MESSAGES)) !== null &&
    _g !== void 0
      ? _g
      : config === null || config === void 0
        ? void 0
        : config.includeMessages;
  var includePrompt =
    (_h = (0, boolean_js_1.parseBooleanValue)(env.OPENCLAW_CACHE_TRACE_PROMPT)) !== null &&
    _h !== void 0
      ? _h
      : config === null || config === void 0
        ? void 0
        : config.includePrompt;
  var includeSystem =
    (_j = (0, boolean_js_1.parseBooleanValue)(env.OPENCLAW_CACHE_TRACE_SYSTEM)) !== null &&
    _j !== void 0
      ? _j
      : config === null || config === void 0
        ? void 0
        : config.includeSystem;
  return {
    enabled: enabled,
    filePath: filePath,
    includeMessages:
      includeMessages !== null && includeMessages !== void 0 ? includeMessages : true,
    includePrompt: includePrompt !== null && includePrompt !== void 0 ? includePrompt : true,
    includeSystem: includeSystem !== null && includeSystem !== void 0 ? includeSystem : true,
  };
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
function stableStringify(value) {
  var _a;
  if (value === null || value === undefined) {
    return String(value);
  }
  if (typeof value === "number" && !Number.isFinite(value)) {
    return JSON.stringify(String(value));
  }
  if (typeof value === "bigint") {
    return JSON.stringify(value.toString());
  }
  if (typeof value !== "object") {
    return (_a = JSON.stringify(value)) !== null && _a !== void 0 ? _a : "null";
  }
  if (value instanceof Error) {
    return stableStringify({
      name: value.name,
      message: value.message,
      stack: value.stack,
    });
  }
  if (value instanceof Uint8Array) {
    return stableStringify({
      type: "Uint8Array",
      data: Buffer.from(value).toString("base64"),
    });
  }
  if (Array.isArray(value)) {
    return "[".concat(
      value
        .map(function (entry) {
          return stableStringify(entry);
        })
        .join(","),
      "]",
    );
  }
  var record = value;
  var keys = Object.keys(record).toSorted();
  var entries = keys.map(function (key) {
    return "".concat(JSON.stringify(key), ":").concat(stableStringify(record[key]));
  });
  return "{".concat(entries.join(","), "}");
}
function digest(value) {
  var serialized = stableStringify(value);
  return node_crypto_1.default.createHash("sha256").update(serialized).digest("hex");
}
function summarizeMessages(messages) {
  var messageFingerprints = messages.map(function (msg) {
    return digest(msg);
  });
  return {
    messageCount: messages.length,
    messageRoles: messages.map(function (msg) {
      return msg.role;
    }),
    messageFingerprints: messageFingerprints,
    messagesDigest: digest(messageFingerprints.join("|")),
  };
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
function createCacheTrace(params) {
  var _a;
  var cfg = resolveCacheTraceConfig(params);
  if (!cfg.enabled) {
    return null;
  }
  var writer = (_a = params.writer) !== null && _a !== void 0 ? _a : getWriter(cfg.filePath);
  var seq = 0;
  var base = {
    runId: params.runId,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    provider: params.provider,
    modelId: params.modelId,
    modelApi: params.modelApi,
    workspaceDir: params.workspaceDir,
  };
  var recordStage = function (stage, payload) {
    if (payload === void 0) {
      payload = {};
    }
    var event = __assign(__assign({}, base), {
      ts: new Date().toISOString(),
      seq: (seq += 1),
      stage: stage,
    });
    if (payload.prompt !== undefined && cfg.includePrompt) {
      event.prompt = payload.prompt;
    }
    if (payload.system !== undefined && cfg.includeSystem) {
      event.system = payload.system;
      event.systemDigest = digest(payload.system);
    }
    if (payload.options) {
      event.options = payload.options;
    }
    if (payload.model) {
      event.model = payload.model;
    }
    var messages = payload.messages;
    if (Array.isArray(messages)) {
      var summary = summarizeMessages(messages);
      event.messageCount = summary.messageCount;
      event.messageRoles = summary.messageRoles;
      event.messageFingerprints = summary.messageFingerprints;
      event.messagesDigest = summary.messagesDigest;
      if (cfg.includeMessages) {
        event.messages = messages;
      }
    }
    if (payload.note) {
      event.note = payload.note;
    }
    if (payload.error) {
      event.error = payload.error;
    }
    var line = safeJsonStringify(event);
    if (!line) {
      return;
    }
    writer.write("".concat(line, "\n"));
  };
  var wrapStreamFn = function (streamFn) {
    var wrapped = function (model, context, options) {
      var _a;
      recordStage("stream:context", {
        model: {
          id: model === null || model === void 0 ? void 0 : model.id,
          provider: model === null || model === void 0 ? void 0 : model.provider,
          api: model === null || model === void 0 ? void 0 : model.api,
        },
        system: context.system,
        messages: (_a = context.messages) !== null && _a !== void 0 ? _a : [],
        options: options !== null && options !== void 0 ? options : {},
      });
      return streamFn(model, context, options);
    };
    return wrapped;
  };
  return {
    enabled: true,
    filePath: cfg.filePath,
    recordStage: recordStage,
    wrapStreamFn: wrapStreamFn,
  };
}
