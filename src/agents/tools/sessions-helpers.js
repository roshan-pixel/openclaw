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
exports.resolveMainSessionAlias = resolveMainSessionAlias;
exports.resolveDisplaySessionKey = resolveDisplaySessionKey;
exports.resolveInternalSessionKey = resolveInternalSessionKey;
exports.createAgentToAgentPolicy = createAgentToAgentPolicy;
exports.looksLikeSessionId = looksLikeSessionId;
exports.looksLikeSessionKey = looksLikeSessionKey;
exports.shouldResolveSessionIdInput = shouldResolveSessionIdInput;
exports.resolveSessionReference = resolveSessionReference;
exports.classifySessionKind = classifySessionKind;
exports.deriveChannel = deriveChannel;
exports.stripToolMessages = stripToolMessages;
exports.sanitizeTextContent = sanitizeTextContent;
exports.extractAssistantText = extractAssistantText;
var call_js_1 = require("../../gateway/call.js");
var pi_embedded_helpers_js_1 = require("../pi-embedded-helpers.js");
var pi_embedded_utils_js_1 = require("../pi-embedded-utils.js");
var session_key_js_1 = require("../../routing/session-key.js");
function normalizeKey(value) {
  var trimmed = value === null || value === void 0 ? void 0 : value.trim();
  return trimmed ? trimmed : undefined;
}
function resolveMainSessionAlias(cfg) {
  var _a, _b, _c;
  var mainKey = (0, session_key_js_1.normalizeMainKey)(
    (_a = cfg.session) === null || _a === void 0 ? void 0 : _a.mainKey,
  );
  var scope =
    (_c = (_b = cfg.session) === null || _b === void 0 ? void 0 : _b.scope) !== null &&
    _c !== void 0
      ? _c
      : "per-sender";
  var alias = scope === "global" ? "global" : mainKey;
  return { mainKey: mainKey, alias: alias, scope: scope };
}
function resolveDisplaySessionKey(params) {
  if (params.key === params.alias) {
    return "main";
  }
  if (params.key === params.mainKey) {
    return "main";
  }
  return params.key;
}
function resolveInternalSessionKey(params) {
  if (params.key === "main") {
    return params.alias;
  }
  return params.key;
}
function createAgentToAgentPolicy(cfg) {
  var _a;
  var routingA2A = (_a = cfg.tools) === null || _a === void 0 ? void 0 : _a.agentToAgent;
  var enabled =
    (routingA2A === null || routingA2A === void 0 ? void 0 : routingA2A.enabled) === true;
  var allowPatterns = Array.isArray(
    routingA2A === null || routingA2A === void 0 ? void 0 : routingA2A.allow,
  )
    ? routingA2A.allow
    : [];
  var matchesAllow = function (agentId) {
    if (allowPatterns.length === 0) {
      return true;
    }
    return allowPatterns.some(function (pattern) {
      var raw = String(pattern !== null && pattern !== void 0 ? pattern : "").trim();
      if (!raw) {
        return false;
      }
      if (raw === "*") {
        return true;
      }
      if (!raw.includes("*")) {
        return raw === agentId;
      }
      var escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      var re = new RegExp("^".concat(escaped.replaceAll("\\*", ".*"), "$"), "i");
      return re.test(agentId);
    });
  };
  var isAllowed = function (requesterAgentId, targetAgentId) {
    if (requesterAgentId === targetAgentId) {
      return true;
    }
    if (!enabled) {
      return false;
    }
    return matchesAllow(requesterAgentId) && matchesAllow(targetAgentId);
  };
  return { enabled: enabled, matchesAllow: matchesAllow, isAllowed: isAllowed };
}
var SESSION_ID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
function looksLikeSessionId(value) {
  return SESSION_ID_RE.test(value.trim());
}
function looksLikeSessionKey(value) {
  var raw = value.trim();
  if (!raw) {
    return false;
  }
  // These are canonical key shapes that should never be treated as sessionIds.
  if (raw === "main" || raw === "global" || raw === "unknown") {
    return true;
  }
  if ((0, session_key_js_1.isAcpSessionKey)(raw)) {
    return true;
  }
  if (raw.startsWith("agent:")) {
    return true;
  }
  if (raw.startsWith("cron:") || raw.startsWith("hook:")) {
    return true;
  }
  if (raw.startsWith("node-") || raw.startsWith("node:")) {
    return true;
  }
  if (raw.includes(":group:") || raw.includes(":channel:")) {
    return true;
  }
  return false;
}
function shouldResolveSessionIdInput(value) {
  // Treat anything that doesn't look like a well-formed key as a sessionId candidate.
  return looksLikeSessionId(value) || !looksLikeSessionKey(value);
}
function resolveSessionKeyFromSessionId(params) {
  return __awaiter(this, void 0, void 0, function () {
    var result, key, err_1, message;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "sessions.resolve",
              params: {
                sessionId: params.sessionId,
                spawnedBy: params.restrictToSpawned ? params.requesterInternalKey : undefined,
                includeGlobal: !params.restrictToSpawned,
                includeUnknown: !params.restrictToSpawned,
              },
            }),
          ];
        case 1:
          result = _a.sent();
          key =
            typeof (result === null || result === void 0 ? void 0 : result.key) === "string"
              ? result.key.trim()
              : "";
          if (!key) {
            throw new Error(
              "Session not found: ".concat(
                params.sessionId,
                " (use the full sessionKey from sessions_list)",
              ),
            );
          }
          return [
            2 /*return*/,
            {
              ok: true,
              key: key,
              displayKey: resolveDisplaySessionKey({
                key: key,
                alias: params.alias,
                mainKey: params.mainKey,
              }),
              resolvedViaSessionId: true,
            },
          ];
        case 2:
          err_1 = _a.sent();
          if (params.restrictToSpawned) {
            return [
              2 /*return*/,
              {
                ok: false,
                status: "forbidden",
                error: "Session not visible from this sandboxed agent session: ".concat(
                  params.sessionId,
                ),
              },
            ];
          }
          message = err_1 instanceof Error ? err_1.message : String(err_1);
          return [
            2 /*return*/,
            {
              ok: false,
              status: "error",
              error:
                message ||
                "Session not found: ".concat(
                  params.sessionId,
                  " (use the full sessionKey from sessions_list)",
                ),
            },
          ];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function resolveSessionKeyFromKey(params) {
  return __awaiter(this, void 0, void 0, function () {
    var result, key, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "sessions.resolve",
              params: {
                key: params.key,
                spawnedBy: params.restrictToSpawned ? params.requesterInternalKey : undefined,
              },
            }),
          ];
        case 1:
          result = _b.sent();
          key =
            typeof (result === null || result === void 0 ? void 0 : result.key) === "string"
              ? result.key.trim()
              : "";
          if (!key) {
            return [2 /*return*/, null];
          }
          return [
            2 /*return*/,
            {
              ok: true,
              key: key,
              displayKey: resolveDisplaySessionKey({
                key: key,
                alias: params.alias,
                mainKey: params.mainKey,
              }),
              resolvedViaSessionId: false,
            },
          ];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, null];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function resolveSessionReference(params) {
  return __awaiter(this, void 0, void 0, function () {
    var raw, resolvedByKey, resolvedKey, displayKey;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          raw = params.sessionKey.trim();
          if (!shouldResolveSessionIdInput(raw)) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            resolveSessionKeyFromKey({
              key: raw,
              alias: params.alias,
              mainKey: params.mainKey,
              requesterInternalKey: params.requesterInternalKey,
              restrictToSpawned: params.restrictToSpawned,
            }),
          ];
        case 1:
          resolvedByKey = _a.sent();
          if (resolvedByKey) {
            return [2 /*return*/, resolvedByKey];
          }
          return [
            4 /*yield*/,
            resolveSessionKeyFromSessionId({
              sessionId: raw,
              alias: params.alias,
              mainKey: params.mainKey,
              requesterInternalKey: params.requesterInternalKey,
              restrictToSpawned: params.restrictToSpawned,
            }),
          ];
        case 2:
          return [2 /*return*/, _a.sent()];
        case 3:
          resolvedKey = resolveInternalSessionKey({
            key: raw,
            alias: params.alias,
            mainKey: params.mainKey,
          });
          displayKey = resolveDisplaySessionKey({
            key: resolvedKey,
            alias: params.alias,
            mainKey: params.mainKey,
          });
          return [
            2 /*return*/,
            { ok: true, key: resolvedKey, displayKey: displayKey, resolvedViaSessionId: false },
          ];
      }
    });
  });
}
function classifySessionKind(params) {
  var key = params.key;
  if (key === params.alias || key === params.mainKey) {
    return "main";
  }
  if (key.startsWith("cron:")) {
    return "cron";
  }
  if (key.startsWith("hook:")) {
    return "hook";
  }
  if (key.startsWith("node-") || key.startsWith("node:")) {
    return "node";
  }
  if (params.gatewayKind === "group") {
    return "group";
  }
  if (key.includes(":group:") || key.includes(":channel:")) {
    return "group";
  }
  return "other";
}
function deriveChannel(params) {
  var _a, _b;
  if (params.kind === "cron" || params.kind === "hook" || params.kind === "node") {
    return "internal";
  }
  var channel = normalizeKey((_a = params.channel) !== null && _a !== void 0 ? _a : undefined);
  if (channel) {
    return channel;
  }
  var lastChannel = normalizeKey(
    (_b = params.lastChannel) !== null && _b !== void 0 ? _b : undefined,
  );
  if (lastChannel) {
    return lastChannel;
  }
  var parts = params.key.split(":").filter(Boolean);
  if (parts.length >= 3 && (parts[1] === "group" || parts[1] === "channel")) {
    return parts[0];
  }
  return "unknown";
}
function stripToolMessages(messages) {
  return messages.filter(function (msg) {
    if (!msg || typeof msg !== "object") {
      return true;
    }
    var role = msg.role;
    return role !== "toolResult";
  });
}
/**
 * Sanitize text content to strip tool call markers and thinking tags.
 * This ensures user-facing text doesn't leak internal tool representations.
 */
function sanitizeTextContent(text) {
  if (!text) {
    return text;
  }
  return (0, pi_embedded_utils_js_1.stripThinkingTagsFromText)(
    (0, pi_embedded_utils_js_1.stripDowngradedToolCallText)(
      (0, pi_embedded_utils_js_1.stripMinimaxToolCallXml)(text),
    ),
  );
}
function extractAssistantText(message) {
  if (!message || typeof message !== "object") {
    return undefined;
  }
  if (message.role !== "assistant") {
    return undefined;
  }
  var content = message.content;
  if (!Array.isArray(content)) {
    return undefined;
  }
  var chunks = [];
  for (var _i = 0, content_1 = content; _i < content_1.length; _i++) {
    var block = content_1[_i];
    if (!block || typeof block !== "object") {
      continue;
    }
    if (block.type !== "text") {
      continue;
    }
    var text = block.text;
    if (typeof text === "string") {
      var sanitized = sanitizeTextContent(text);
      if (sanitized.trim()) {
        chunks.push(sanitized);
      }
    }
  }
  var joined = chunks.join("").trim();
  return joined ? (0, pi_embedded_helpers_js_1.sanitizeUserFacingText)(joined) : undefined;
}
