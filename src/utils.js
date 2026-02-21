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
exports.CONFIG_DIR = void 0;
exports.ensureDir = ensureDir;
exports.clampNumber = clampNumber;
exports.clampInt = clampInt;
exports.assertWebChannel = assertWebChannel;
exports.normalizePath = normalizePath;
exports.withWhatsAppPrefix = withWhatsAppPrefix;
exports.normalizeE164 = normalizeE164;
exports.isSelfChatMode = isSelfChatMode;
exports.toWhatsappJid = toWhatsappJid;
exports.jidToE164 = jidToE164;
exports.resolveJidToE164 = resolveJidToE164;
exports.sleep = sleep;
exports.sliceUtf16Safe = sliceUtf16Safe;
exports.truncateUtf16Safe = truncateUtf16Safe;
exports.resolveUserPath = resolveUserPath;
exports.resolveConfigDir = resolveConfigDir;
exports.resolveHomeDir = resolveHomeDir;
exports.shortenHomePath = shortenHomePath;
exports.shortenHomeInString = shortenHomeInString;
exports.displayPath = displayPath;
exports.displayString = displayString;
exports.formatTerminalLink = formatTerminalLink;
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var paths_js_1 = require("./config/paths.js");
var globals_js_1 = require("./globals.js");
function ensureDir(dir) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, node_fs_1.default.promises.mkdir(dir, { recursive: true })];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function clampNumber(value, min, max) {
  return Math.max(min, Math.min(max, value));
}
function clampInt(value, min, max) {
  return clampNumber(Math.floor(value), min, max);
}
function assertWebChannel(input) {
  if (input !== "web") {
    throw new Error("Web channel must be 'web'");
  }
}
function normalizePath(p) {
  if (!p.startsWith("/")) {
    return "/".concat(p);
  }
  return p;
}
function withWhatsAppPrefix(number) {
  return number.startsWith("whatsapp:") ? number : "whatsapp:".concat(number);
}
function normalizeE164(number) {
  var withoutPrefix = number.replace(/^whatsapp:/, "").trim();
  var digits = withoutPrefix.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) {
    return "+".concat(digits.slice(1));
  }
  return "+".concat(digits);
}
/**
 * "Self-chat mode" heuristic (single phone): the gateway is logged in as the owner's own WhatsApp account,
 * and `channels.whatsapp.allowFrom` includes that same number. Used to avoid side-effects that make no sense when the
 * "bot" and the human are the same WhatsApp identity (e.g. auto read receipts, @mention JID triggers).
 */
function isSelfChatMode(selfE164, allowFrom) {
  if (!selfE164) {
    return false;
  }
  if (!Array.isArray(allowFrom) || allowFrom.length === 0) {
    return false;
  }
  var normalizedSelf = normalizeE164(selfE164);
  return allowFrom.some(function (n) {
    if (n === "*") {
      return false;
    }
    try {
      return normalizeE164(String(n)) === normalizedSelf;
    } catch (_a) {
      return false;
    }
  });
}
function toWhatsappJid(number) {
  var withoutPrefix = number.replace(/^whatsapp:/, "").trim();
  if (withoutPrefix.includes("@")) {
    return withoutPrefix;
  }
  var e164 = normalizeE164(withoutPrefix);
  var digits = e164.replace(/\D/g, "");
  return "".concat(digits, "@s.whatsapp.net");
}
function resolveLidMappingDirs(opts) {
  var _a;
  var dirs = new Set();
  var addDir = function (dir) {
    if (!dir) {
      return;
    }
    dirs.add(resolveUserPath(dir));
  };
  addDir(opts === null || opts === void 0 ? void 0 : opts.authDir);
  for (
    var _i = 0,
      _b =
        (_a = opts === null || opts === void 0 ? void 0 : opts.lidMappingDirs) !== null &&
        _a !== void 0
          ? _a
          : [];
    _i < _b.length;
    _i++
  ) {
    var dir = _b[_i];
    addDir(dir);
  }
  addDir((0, paths_js_1.resolveOAuthDir)());
  addDir(node_path_1.default.join(exports.CONFIG_DIR, "credentials"));
  return __spreadArray([], dirs, true);
}
function readLidReverseMapping(lid, opts) {
  var mappingFilename = "lid-mapping-".concat(lid, "_reverse.json");
  var mappingDirs = resolveLidMappingDirs(opts);
  for (var _i = 0, mappingDirs_1 = mappingDirs; _i < mappingDirs_1.length; _i++) {
    var dir = mappingDirs_1[_i];
    var mappingPath = node_path_1.default.join(dir, mappingFilename);
    try {
      var data = node_fs_1.default.readFileSync(mappingPath, "utf8");
      var phone = JSON.parse(data);
      if (phone === null || phone === undefined) {
        continue;
      }
      return normalizeE164(String(phone));
    } catch (_a) {
      // Try the next location.
    }
  }
  return null;
}
function jidToE164(jid, opts) {
  var _a;
  // Convert a WhatsApp JID (with optional device suffix, e.g. 1234:1@s.whatsapp.net) back to +1234.
  var match = jid.match(/^(\d+)(?::\d+)?@(s\.whatsapp\.net|hosted)$/);
  if (match) {
    var digits = match[1];
    return "+".concat(digits);
  }
  // Support @lid format (WhatsApp Linked ID) - look up reverse mapping
  var lidMatch = jid.match(/^(\d+)(?::\d+)?@(lid|hosted\.lid)$/);
  if (lidMatch) {
    var lid = lidMatch[1];
    var phone = readLidReverseMapping(lid, opts);
    if (phone) {
      return phone;
    }
    var shouldLog =
      (_a = opts === null || opts === void 0 ? void 0 : opts.logMissing) !== null && _a !== void 0
        ? _a
        : (0, globals_js_1.shouldLogVerbose)();
    if (shouldLog) {
      (0, globals_js_1.logVerbose)(
        "LID mapping not found for ".concat(lid, "; skipping inbound message"),
      );
    }
  }
  return null;
}
function resolveJidToE164(jid, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var direct, pnJid, err_1;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (!jid) {
            return [2 /*return*/, null];
          }
          direct = jidToE164(jid, opts);
          if (direct) {
            return [2 /*return*/, direct];
          }
          if (!/(@lid|@hosted\.lid)$/.test(jid)) {
            return [2 /*return*/, null];
          }
          if (
            !((_a = opts === null || opts === void 0 ? void 0 : opts.lidLookup) === null ||
            _a === void 0
              ? void 0
              : _a.getPNForLID)
          ) {
            return [2 /*return*/, null];
          }
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [4 /*yield*/, opts.lidLookup.getPNForLID(jid)];
        case 2:
          pnJid = _b.sent();
          if (!pnJid) {
            return [2 /*return*/, null];
          }
          return [2 /*return*/, jidToE164(pnJid, opts)];
        case 3:
          err_1 = _b.sent();
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)(
              "LID mapping lookup failed for ".concat(jid, ": ").concat(String(err_1)),
            );
          }
          return [2 /*return*/, null];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function sleep(ms) {
  return new Promise(function (resolve) {
    return setTimeout(resolve, ms);
  });
}
function isHighSurrogate(codeUnit) {
  return codeUnit >= 0xd800 && codeUnit <= 0xdbff;
}
function isLowSurrogate(codeUnit) {
  return codeUnit >= 0xdc00 && codeUnit <= 0xdfff;
}
function sliceUtf16Safe(input, start, end) {
  var len = input.length;
  var from = start < 0 ? Math.max(len + start, 0) : Math.min(start, len);
  var to = end === undefined ? len : end < 0 ? Math.max(len + end, 0) : Math.min(end, len);
  if (to < from) {
    var tmp = from;
    from = to;
    to = tmp;
  }
  if (from > 0 && from < len) {
    var codeUnit = input.charCodeAt(from);
    if (isLowSurrogate(codeUnit) && isHighSurrogate(input.charCodeAt(from - 1))) {
      from += 1;
    }
  }
  if (to > 0 && to < len) {
    var codeUnit = input.charCodeAt(to - 1);
    if (isHighSurrogate(codeUnit) && isLowSurrogate(input.charCodeAt(to))) {
      to -= 1;
    }
  }
  return input.slice(from, to);
}
function truncateUtf16Safe(input, maxLen) {
  var limit = Math.max(0, Math.floor(maxLen));
  if (input.length <= limit) {
    return input;
  }
  return sliceUtf16Safe(input, 0, limit);
}
function resolveUserPath(input) {
  var trimmed = input.trim();
  if (!trimmed) {
    return trimmed;
  }
  if (trimmed.startsWith("~")) {
    var expanded = trimmed.replace(/^~(?=$|[\\/])/, node_os_1.default.homedir());
    return node_path_1.default.resolve(expanded);
  }
  return node_path_1.default.resolve(trimmed);
}
function resolveConfigDir(env, homedir) {
  var _a, _b;
  if (env === void 0) {
    env = process.env;
  }
  if (homedir === void 0) {
    homedir = node_os_1.default.homedir;
  }
  var override =
    ((_a = env.OPENCLAW_STATE_DIR) === null || _a === void 0 ? void 0 : _a.trim()) ||
    ((_b = env.CLAWDBOT_STATE_DIR) === null || _b === void 0 ? void 0 : _b.trim());
  if (override) {
    return resolveUserPath(override);
  }
  var newDir = node_path_1.default.join(homedir(), ".openclaw");
  try {
    var hasNew = node_fs_1.default.existsSync(newDir);
    if (hasNew) {
      return newDir;
    }
  } catch (_c) {
    // best-effort
  }
  return newDir;
}
function resolveHomeDir() {
  var _a, _b;
  var envHome = (_a = process.env.HOME) === null || _a === void 0 ? void 0 : _a.trim();
  if (envHome) {
    return envHome;
  }
  var envProfile = (_b = process.env.USERPROFILE) === null || _b === void 0 ? void 0 : _b.trim();
  if (envProfile) {
    return envProfile;
  }
  try {
    var home = node_os_1.default.homedir();
    return (home === null || home === void 0 ? void 0 : home.trim()) ? home : undefined;
  } catch (_c) {
    return undefined;
  }
}
function shortenHomePath(input) {
  if (!input) {
    return input;
  }
  var home = resolveHomeDir();
  if (!home) {
    return input;
  }
  if (input === home) {
    return "~";
  }
  if (input.startsWith("".concat(home, "/"))) {
    return "~".concat(input.slice(home.length));
  }
  return input;
}
function shortenHomeInString(input) {
  if (!input) {
    return input;
  }
  var home = resolveHomeDir();
  if (!home) {
    return input;
  }
  return input.split(home).join("~");
}
function displayPath(input) {
  return shortenHomePath(input);
}
function displayString(input) {
  return shortenHomeInString(input);
}
function formatTerminalLink(label, url, opts) {
  var _a;
  var esc = "\u001b";
  var safeLabel = label.replaceAll(esc, "");
  var safeUrl = url.replaceAll(esc, "");
  var allow =
    (opts === null || opts === void 0 ? void 0 : opts.force) === true
      ? true
      : (opts === null || opts === void 0 ? void 0 : opts.force) === false
        ? false
        : Boolean(process.stdout.isTTY);
  if (!allow) {
    return (_a = opts === null || opts === void 0 ? void 0 : opts.fallback) !== null &&
      _a !== void 0
      ? _a
      : "".concat(safeLabel, " (").concat(safeUrl, ")");
  }
  return "\u001B]8;;".concat(safeUrl, "\u0007").concat(safeLabel, "\u001B]8;;\u0007");
}
// Configuration root; can be overridden via OPENCLAW_STATE_DIR.
exports.CONFIG_DIR = resolveConfigDir();
