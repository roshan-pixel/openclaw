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
exports.parseDiscordTarget = parseDiscordTarget;
exports.resolveDiscordChannelId = resolveDiscordChannelId;
exports.resolveDiscordTarget = resolveDiscordTarget;
var targets_js_1 = require("../channels/targets.js");
var directory_live_js_1 = require("./directory-live.js");
function parseDiscordTarget(raw, options) {
  var _a;
  if (options === void 0) {
    options = {};
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    return undefined;
  }
  var mentionMatch = trimmed.match(/^<@!?(\d+)>$/);
  if (mentionMatch) {
    return (0, targets_js_1.buildMessagingTarget)("user", mentionMatch[1], trimmed);
  }
  if (trimmed.startsWith("user:")) {
    var id = trimmed.slice("user:".length).trim();
    return id ? (0, targets_js_1.buildMessagingTarget)("user", id, trimmed) : undefined;
  }
  if (trimmed.startsWith("channel:")) {
    var id = trimmed.slice("channel:".length).trim();
    return id ? (0, targets_js_1.buildMessagingTarget)("channel", id, trimmed) : undefined;
  }
  if (trimmed.startsWith("discord:")) {
    var id = trimmed.slice("discord:".length).trim();
    return id ? (0, targets_js_1.buildMessagingTarget)("user", id, trimmed) : undefined;
  }
  if (trimmed.startsWith("@")) {
    var candidate = trimmed.slice(1).trim();
    var id = (0, targets_js_1.ensureTargetId)({
      candidate: candidate,
      pattern: /^\d+$/,
      errorMessage: "Discord DMs require a user id (use user:<id> or a <@id> mention)",
    });
    return (0, targets_js_1.buildMessagingTarget)("user", id, trimmed);
  }
  if (/^\d+$/.test(trimmed)) {
    if (options.defaultKind) {
      return (0, targets_js_1.buildMessagingTarget)(options.defaultKind, trimmed, trimmed);
    }
    throw new Error(
      (_a = options.ambiguousMessage) !== null && _a !== void 0
        ? _a
        : 'Ambiguous Discord recipient "'
            .concat(trimmed, '". Use "user:')
            .concat(trimmed, '" for DMs or "channel:')
            .concat(trimmed, '" for channel messages.'),
    );
  }
  return (0, targets_js_1.buildMessagingTarget)("channel", trimmed, trimmed);
}
function resolveDiscordChannelId(raw) {
  var target = parseDiscordTarget(raw, { defaultKind: "channel" });
  return (0, targets_js_1.requireTargetKind)({
    platform: "Discord",
    target: target,
    kind: "channel",
  });
}
/**
 * Resolve a Discord username to user ID using the directory lookup.
 * This enables sending DMs by username instead of requiring explicit user IDs.
 *
 * @param raw - The username or raw target string (e.g., "john.doe")
 * @param options - Directory configuration params (cfg, accountId, limit)
 * @param parseOptions - Messaging target parsing options (defaults, ambiguity message)
 * @returns Parsed MessagingTarget with user ID, or undefined if not found
 */
function resolveDiscordTarget(raw_1, options_1) {
  return __awaiter(this, arguments, void 0, function (raw, options, parseOptions) {
    var trimmed, likelyUsername, shouldLookup, directParse, directoryEntries, match, userId, _a;
    if (parseOptions === void 0) {
      parseOptions = {};
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          trimmed = raw.trim();
          if (!trimmed) {
            return [2 /*return*/, undefined];
          }
          likelyUsername = isLikelyUsername(trimmed);
          shouldLookup = isExplicitUserLookup(trimmed, parseOptions) || likelyUsername;
          directParse = safeParseDiscordTarget(trimmed, parseOptions);
          if (directParse && directParse.kind !== "channel" && !likelyUsername) {
            return [2 /*return*/, directParse];
          }
          if (!shouldLookup) {
            return [
              2 /*return*/,
              directParse !== null && directParse !== void 0
                ? directParse
                : parseDiscordTarget(trimmed, parseOptions),
            ];
          }
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            (0, directory_live_js_1.listDiscordDirectoryPeersLive)(
              __assign(__assign({}, options), { query: trimmed, limit: 1 }),
            ),
          ];
        case 2:
          directoryEntries = _b.sent();
          match = directoryEntries[0];
          if (match && match.kind === "user") {
            userId = match.id.replace(/^user:/, "");
            return [2 /*return*/, (0, targets_js_1.buildMessagingTarget)("user", userId, trimmed)];
          }
          return [3 /*break*/, 4];
        case 3:
          _a = _b.sent();
          return [3 /*break*/, 4];
        case 4:
          // Fallback to original parsing (for channels, etc.)
          return [2 /*return*/, parseDiscordTarget(trimmed, parseOptions)];
      }
    });
  });
}
function safeParseDiscordTarget(input, options) {
  try {
    return parseDiscordTarget(input, options);
  } catch (_a) {
    return undefined;
  }
}
function isExplicitUserLookup(input, options) {
  if (/^<@!?(\d+)>$/.test(input)) {
    return true;
  }
  if (/^(user:|discord:)/.test(input)) {
    return true;
  }
  if (input.startsWith("@")) {
    return true;
  }
  if (/^\d+$/.test(input)) {
    return options.defaultKind === "user";
  }
  return false;
}
/**
 * Check if a string looks like a Discord username (not a mention, prefix, or ID).
 * Usernames typically don't start with special characters except underscore.
 */
function isLikelyUsername(input) {
  // Skip if it's already a known format
  if (/^(user:|channel:|discord:|@|<@!?)|[\d]+$/.test(input)) {
    return false;
  }
  // Likely a username if it doesn't match known patterns
  return true;
}
