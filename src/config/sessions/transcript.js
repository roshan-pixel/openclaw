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
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveMirroredTranscriptText = resolveMirroredTranscriptText;
exports.appendAssistantMessageToSessionTranscript = appendAssistantMessageToSessionTranscript;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var store_js_1 = require("./store.js");
var paths_js_1 = require("./paths.js");
var transcript_events_js_1 = require("../../sessions/transcript-events.js");
function stripQuery(value) {
  var _a, _b;
  var noHash = (_a = value.split("#")[0]) !== null && _a !== void 0 ? _a : value;
  return (_b = noHash.split("?")[0]) !== null && _b !== void 0 ? _b : noHash;
}
function extractFileNameFromMediaUrl(value) {
  var trimmed = value.trim();
  if (!trimmed) {
    return null;
  }
  var cleaned = stripQuery(trimmed);
  try {
    var parsed = new URL(cleaned);
    var base = node_path_1.default.basename(parsed.pathname);
    if (!base) {
      return null;
    }
    try {
      return decodeURIComponent(base);
    } catch (_a) {
      return base;
    }
  } catch (_b) {
    var base = node_path_1.default.basename(cleaned);
    if (!base || base === "/" || base === ".") {
      return null;
    }
    return base;
  }
}
function resolveMirroredTranscriptText(params) {
  var _a, _b, _c;
  var mediaUrls =
    (_b =
      (_a = params.mediaUrls) === null || _a === void 0
        ? void 0
        : _a.filter(function (url) {
            return url && url.trim();
          })) !== null && _b !== void 0
      ? _b
      : [];
  if (mediaUrls.length > 0) {
    var names = mediaUrls
      .map(function (url) {
        return extractFileNameFromMediaUrl(url);
      })
      .filter(function (name) {
        return Boolean(name && name.trim());
      });
    if (names.length > 0) {
      return names.join(", ");
    }
    return "media";
  }
  var text = (_c = params.text) !== null && _c !== void 0 ? _c : "";
  var trimmed = text.trim();
  return trimmed ? trimmed : null;
}
function ensureSessionHeader(params) {
  return __awaiter(this, void 0, void 0, function () {
    var header;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (node_fs_1.default.existsSync(params.sessionFile)) {
            return [2 /*return*/];
          }
          return [
            4 /*yield*/,
            node_fs_1.default.promises.mkdir(node_path_1.default.dirname(params.sessionFile), {
              recursive: true,
            }),
          ];
        case 1:
          _a.sent();
          header = {
            type: "session",
            version: pi_coding_agent_1.CURRENT_SESSION_VERSION,
            id: params.sessionId,
            timestamp: new Date().toISOString(),
            cwd: process.cwd(),
          };
          return [
            4 /*yield*/,
            node_fs_1.default.promises.writeFile(
              params.sessionFile,
              "".concat(JSON.stringify(header), "\n"),
              "utf-8",
            ),
          ];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function appendAssistantMessageToSessionTranscript(params) {
  return __awaiter(this, void 0, void 0, function () {
    var sessionKey, mirrorText, storePath, store, entry, sessionFile, sessionManager;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          sessionKey = params.sessionKey.trim();
          if (!sessionKey) {
            return [2 /*return*/, { ok: false, reason: "missing sessionKey" }];
          }
          mirrorText = resolveMirroredTranscriptText({
            text: params.text,
            mediaUrls: params.mediaUrls,
          });
          if (!mirrorText) {
            return [2 /*return*/, { ok: false, reason: "empty text" }];
          }
          storePath =
            (_a = params.storePath) !== null && _a !== void 0
              ? _a
              : (0, paths_js_1.resolveDefaultSessionStorePath)(params.agentId);
          store = (0, store_js_1.loadSessionStore)(storePath, { skipCache: true });
          entry = store[sessionKey];
          if (!(entry === null || entry === void 0 ? void 0 : entry.sessionId)) {
            return [2 /*return*/, { ok: false, reason: "unknown sessionKey: ".concat(sessionKey) }];
          }
          sessionFile =
            ((_b = entry.sessionFile) === null || _b === void 0 ? void 0 : _b.trim()) ||
            (0, paths_js_1.resolveSessionTranscriptPath)(entry.sessionId, params.agentId);
          return [
            4 /*yield*/,
            ensureSessionHeader({ sessionFile: sessionFile, sessionId: entry.sessionId }),
          ];
        case 1:
          _c.sent();
          sessionManager = pi_coding_agent_1.SessionManager.open(sessionFile);
          sessionManager.appendMessage({
            role: "assistant",
            content: [{ type: "text", text: mirrorText }],
            api: "openai-responses",
            provider: "openclaw",
            model: "delivery-mirror",
            usage: {
              input: 0,
              output: 0,
              cacheRead: 0,
              cacheWrite: 0,
              totalTokens: 0,
              cost: {
                input: 0,
                output: 0,
                cacheRead: 0,
                cacheWrite: 0,
                total: 0,
              },
            },
            stopReason: "stop",
            timestamp: Date.now(),
          });
          if (!(!entry.sessionFile || entry.sessionFile !== sessionFile)) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            (0, store_js_1.updateSessionStore)(storePath, function (current) {
              current[sessionKey] = __assign(__assign({}, entry), { sessionFile: sessionFile });
            }),
          ];
        case 2:
          _c.sent();
          _c.label = 3;
        case 3:
          (0, transcript_events_js_1.emitSessionTranscriptUpdate)(sessionFile);
          return [2 /*return*/, { ok: true, sessionFile: sessionFile }];
      }
    });
  });
}
