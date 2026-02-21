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
exports.DEFAULT_BOOTSTRAP_MAX_CHARS = void 0;
exports.stripThoughtSignatures = stripThoughtSignatures;
exports.resolveBootstrapMaxChars = resolveBootstrapMaxChars;
exports.ensureSessionHeader = ensureSessionHeader;
exports.buildBootstrapContextFiles = buildBootstrapContextFiles;
exports.sanitizeGoogleTurnOrdering = sanitizeGoogleTurnOrdering;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
function isBase64Signature(value) {
  var trimmed = value.trim();
  if (!trimmed) {
    return false;
  }
  var compact = trimmed.replace(/\s+/g, "");
  if (!/^[A-Za-z0-9+/=_-]+$/.test(compact)) {
    return false;
  }
  var isUrl = compact.includes("-") || compact.includes("_");
  try {
    var buf = Buffer.from(compact, isUrl ? "base64url" : "base64");
    if (buf.length === 0) {
      return false;
    }
    var encoded = buf.toString(isUrl ? "base64url" : "base64");
    var normalize = function (input) {
      return input.replace(/=+$/g, "");
    };
    return normalize(encoded) === normalize(compact);
  } catch (_a) {
    return false;
  }
}
/**
 * Strips Claude-style thought_signature fields from content blocks.
 *
 * Gemini expects thought signatures as base64-encoded bytes, but Claude stores message ids
 * like "msg_abc123...". We only strip "msg_*" to preserve any provider-valid signatures.
 */
function stripThoughtSignatures(content, options) {
  var _a, _b;
  if (!Array.isArray(content)) {
    return content;
  }
  var allowBase64Only =
    (_a = options === null || options === void 0 ? void 0 : options.allowBase64Only) !== null &&
    _a !== void 0
      ? _a
      : false;
  var includeCamelCase =
    (_b = options === null || options === void 0 ? void 0 : options.includeCamelCase) !== null &&
    _b !== void 0
      ? _b
      : false;
  var shouldStripSignature = function (value) {
    if (!allowBase64Only) {
      return typeof value === "string" && value.startsWith("msg_");
    }
    return typeof value !== "string" || !isBase64Signature(value);
  };
  return content.map(function (block) {
    if (!block || typeof block !== "object") {
      return block;
    }
    var rec = block;
    var stripSnake = shouldStripSignature(rec.thought_signature);
    var stripCamel = includeCamelCase ? shouldStripSignature(rec.thoughtSignature) : false;
    if (!stripSnake && !stripCamel) {
      return block;
    }
    var next = __assign({}, rec);
    if (stripSnake) {
      delete next.thought_signature;
    }
    if (stripCamel) {
      delete next.thoughtSignature;
    }
    return next;
  });
}
exports.DEFAULT_BOOTSTRAP_MAX_CHARS = 20000;
var BOOTSTRAP_HEAD_RATIO = 0.7;
var BOOTSTRAP_TAIL_RATIO = 0.2;
function resolveBootstrapMaxChars(cfg) {
  var _a, _b;
  var raw =
    (_b =
      (_a = cfg === null || cfg === void 0 ? void 0 : cfg.agents) === null || _a === void 0
        ? void 0
        : _a.defaults) === null || _b === void 0
      ? void 0
      : _b.bootstrapMaxChars;
  if (typeof raw === "number" && Number.isFinite(raw) && raw > 0) {
    return Math.floor(raw);
  }
  return exports.DEFAULT_BOOTSTRAP_MAX_CHARS;
}
function trimBootstrapContent(content, fileName, maxChars) {
  var trimmed = content.trimEnd();
  if (trimmed.length <= maxChars) {
    return {
      content: trimmed,
      truncated: false,
      maxChars: maxChars,
      originalLength: trimmed.length,
    };
  }
  var headChars = Math.floor(maxChars * BOOTSTRAP_HEAD_RATIO);
  var tailChars = Math.floor(maxChars * BOOTSTRAP_TAIL_RATIO);
  var head = trimmed.slice(0, headChars);
  var tail = trimmed.slice(-tailChars);
  var marker = [
    "",
    "[...truncated, read ".concat(fileName, " for full content...]"),
    "\u2026(truncated "
      .concat(fileName, ": kept ")
      .concat(headChars, "+")
      .concat(tailChars, " chars of ")
      .concat(trimmed.length, ")\u2026"),
    "",
  ].join("\n");
  var contentWithMarker = [head, marker, tail].join("\n");
  return {
    content: contentWithMarker,
    truncated: true,
    maxChars: maxChars,
    originalLength: trimmed.length,
  };
}
function ensureSessionHeader(params) {
  return __awaiter(this, void 0, void 0, function () {
    var file, _a, sessionVersion, entry;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          file = params.sessionFile;
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [4 /*yield*/, promises_1.default.stat(file)];
        case 2:
          _b.sent();
          return [2 /*return*/];
        case 3:
          _a = _b.sent();
          return [3 /*break*/, 4];
        case 4:
          return [
            4 /*yield*/,
            promises_1.default.mkdir(node_path_1.default.dirname(file), { recursive: true }),
          ];
        case 5:
          _b.sent();
          sessionVersion = 2;
          entry = {
            type: "session",
            version: sessionVersion,
            id: params.sessionId,
            timestamp: new Date().toISOString(),
            cwd: params.cwd,
          };
          return [
            4 /*yield*/,
            promises_1.default.writeFile(file, "".concat(JSON.stringify(entry), "\n"), "utf-8"),
          ];
        case 6:
          _b.sent();
          return [2 /*return*/];
      }
    });
  });
}
function buildBootstrapContextFiles(files, opts) {
  var _a, _b, _c;
  var maxChars =
    (_a = opts === null || opts === void 0 ? void 0 : opts.maxChars) !== null && _a !== void 0
      ? _a
      : exports.DEFAULT_BOOTSTRAP_MAX_CHARS;
  var result = [];
  for (var _i = 0, files_1 = files; _i < files_1.length; _i++) {
    var file = files_1[_i];
    if (file.missing) {
      result.push({
        path: file.name,
        content: "[MISSING] Expected at: ".concat(file.path),
      });
      continue;
    }
    var trimmed = trimBootstrapContent(
      (_b = file.content) !== null && _b !== void 0 ? _b : "",
      file.name,
      maxChars,
    );
    if (!trimmed.content) {
      continue;
    }
    if (trimmed.truncated) {
      (_c = opts === null || opts === void 0 ? void 0 : opts.warn) === null || _c === void 0
        ? void 0
        : _c.call(
            opts,
            "workspace bootstrap file "
              .concat(file.name, " is ")
              .concat(trimmed.originalLength, " chars (limit ")
              .concat(trimmed.maxChars, "); truncating in injected context"),
          );
    }
    result.push({
      path: file.name,
      content: trimmed.content,
    });
  }
  return result;
}
function sanitizeGoogleTurnOrdering(messages) {
  var GOOGLE_TURN_ORDER_BOOTSTRAP_TEXT = "(session bootstrap)";
  var first = messages[0];
  var role = first === null || first === void 0 ? void 0 : first.role;
  var content = first === null || first === void 0 ? void 0 : first.content;
  if (
    role === "user" &&
    typeof content === "string" &&
    content.trim() === GOOGLE_TURN_ORDER_BOOTSTRAP_TEXT
  ) {
    return messages;
  }
  if (role !== "assistant") {
    return messages;
  }
  // Cloud Code Assist rejects histories that begin with a model turn (tool call or text).
  // Prepend a tiny synthetic user turn so the rest of the transcript can be used.
  var bootstrap = {
    role: "user",
    content: GOOGLE_TURN_ORDER_BOOTSTRAP_TEXT,
    timestamp: Date.now(),
  };
  return __spreadArray([bootstrap], messages, true);
}
