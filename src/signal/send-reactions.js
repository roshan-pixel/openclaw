"use strict";
/**
 * Signal reactions via signal-cli JSON-RPC API
 */
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
exports.sendReactionSignal = sendReactionSignal;
exports.removeReactionSignal = removeReactionSignal;
var config_js_1 = require("../config/config.js");
var accounts_js_1 = require("./accounts.js");
var client_js_1 = require("./client.js");
function normalizeSignalId(raw) {
  var trimmed = raw.trim();
  if (!trimmed) {
    return "";
  }
  return trimmed.replace(/^signal:/i, "").trim();
}
function normalizeSignalUuid(raw) {
  var trimmed = normalizeSignalId(raw);
  if (!trimmed) {
    return "";
  }
  if (trimmed.toLowerCase().startsWith("uuid:")) {
    return trimmed.slice("uuid:".length).trim();
  }
  return trimmed;
}
function resolveTargetAuthorParams(params) {
  var candidates = [params.targetAuthor, params.targetAuthorUuid, params.fallback];
  for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
    var candidate = candidates_1[_i];
    var raw = candidate === null || candidate === void 0 ? void 0 : candidate.trim();
    if (!raw) {
      continue;
    }
    var normalized = normalizeSignalUuid(raw);
    if (normalized) {
      return { targetAuthor: normalized };
    }
  }
  return {};
}
function resolveReactionRpcContext(opts, accountInfo) {
  var _a, _b, _c, _d, _e;
  var hasBaseUrl = Boolean((_a = opts.baseUrl) === null || _a === void 0 ? void 0 : _a.trim());
  var hasAccount = Boolean((_b = opts.account) === null || _b === void 0 ? void 0 : _b.trim());
  var resolvedAccount =
    accountInfo ||
    (!hasBaseUrl || !hasAccount
      ? (0, accounts_js_1.resolveSignalAccount)({
          cfg: (0, config_js_1.loadConfig)(),
          accountId: opts.accountId,
        })
      : undefined);
  var baseUrl =
    ((_c = opts.baseUrl) === null || _c === void 0 ? void 0 : _c.trim()) ||
    (resolvedAccount === null || resolvedAccount === void 0 ? void 0 : resolvedAccount.baseUrl);
  if (!baseUrl) {
    throw new Error("Signal base URL is required");
  }
  var account =
    ((_d = opts.account) === null || _d === void 0 ? void 0 : _d.trim()) ||
    ((_e =
      resolvedAccount === null || resolvedAccount === void 0
        ? void 0
        : resolvedAccount.config.account) === null || _e === void 0
      ? void 0
      : _e.trim());
  return { baseUrl: baseUrl, account: account };
}
/**
 * Send a Signal reaction to a message
 * @param recipient - UUID or E.164 phone number of the message author
 * @param targetTimestamp - Message ID (timestamp) to react to
 * @param emoji - Emoji to react with
 * @param opts - Optional account/connection overrides
 */
function sendReactionSignal(recipient_1, targetTimestamp_1, emoji_1) {
  return __awaiter(this, arguments, void 0, function (recipient, targetTimestamp, emoji, opts) {
    var accountInfo,
      _a,
      baseUrl,
      account,
      normalizedRecipient,
      groupId,
      targetAuthorParams,
      params,
      result;
    var _b;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          accountInfo = (0, accounts_js_1.resolveSignalAccount)({
            cfg: (0, config_js_1.loadConfig)(),
            accountId: opts.accountId,
          });
          ((_a = resolveReactionRpcContext(opts, accountInfo)),
            (baseUrl = _a.baseUrl),
            (account = _a.account));
          normalizedRecipient = normalizeSignalUuid(recipient);
          groupId = (_b = opts.groupId) === null || _b === void 0 ? void 0 : _b.trim();
          if (!normalizedRecipient && !groupId) {
            throw new Error("Recipient or groupId is required for Signal reaction");
          }
          if (!Number.isFinite(targetTimestamp) || targetTimestamp <= 0) {
            throw new Error("Valid targetTimestamp is required for Signal reaction");
          }
          if (!(emoji === null || emoji === void 0 ? void 0 : emoji.trim())) {
            throw new Error("Emoji is required for Signal reaction");
          }
          targetAuthorParams = resolveTargetAuthorParams({
            targetAuthor: opts.targetAuthor,
            targetAuthorUuid: opts.targetAuthorUuid,
            fallback: normalizedRecipient,
          });
          if (groupId && !targetAuthorParams.targetAuthor) {
            throw new Error("targetAuthor is required for group reactions");
          }
          params = __assign(
            { emoji: emoji.trim(), targetTimestamp: targetTimestamp },
            targetAuthorParams,
          );
          if (normalizedRecipient) {
            params.recipients = [normalizedRecipient];
          }
          if (groupId) {
            params.groupIds = [groupId];
          }
          if (account) {
            params.account = account;
          }
          return [
            4 /*yield*/,
            (0, client_js_1.signalRpcRequest)("sendReaction", params, {
              baseUrl: baseUrl,
              timeoutMs: opts.timeoutMs,
            }),
          ];
        case 1:
          result = _c.sent();
          return [
            2 /*return*/,
            {
              ok: true,
              timestamp: result === null || result === void 0 ? void 0 : result.timestamp,
            },
          ];
      }
    });
  });
}
/**
 * Remove a Signal reaction from a message
 * @param recipient - UUID or E.164 phone number of the message author
 * @param targetTimestamp - Message ID (timestamp) to remove reaction from
 * @param emoji - Emoji to remove
 * @param opts - Optional account/connection overrides
 */
function removeReactionSignal(recipient_1, targetTimestamp_1, emoji_1) {
  return __awaiter(this, arguments, void 0, function (recipient, targetTimestamp, emoji, opts) {
    var accountInfo,
      _a,
      baseUrl,
      account,
      normalizedRecipient,
      groupId,
      targetAuthorParams,
      params,
      result;
    var _b;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          accountInfo = (0, accounts_js_1.resolveSignalAccount)({
            cfg: (0, config_js_1.loadConfig)(),
            accountId: opts.accountId,
          });
          ((_a = resolveReactionRpcContext(opts, accountInfo)),
            (baseUrl = _a.baseUrl),
            (account = _a.account));
          normalizedRecipient = normalizeSignalUuid(recipient);
          groupId = (_b = opts.groupId) === null || _b === void 0 ? void 0 : _b.trim();
          if (!normalizedRecipient && !groupId) {
            throw new Error("Recipient or groupId is required for Signal reaction removal");
          }
          if (!Number.isFinite(targetTimestamp) || targetTimestamp <= 0) {
            throw new Error("Valid targetTimestamp is required for Signal reaction removal");
          }
          if (!(emoji === null || emoji === void 0 ? void 0 : emoji.trim())) {
            throw new Error("Emoji is required for Signal reaction removal");
          }
          targetAuthorParams = resolveTargetAuthorParams({
            targetAuthor: opts.targetAuthor,
            targetAuthorUuid: opts.targetAuthorUuid,
            fallback: normalizedRecipient,
          });
          if (groupId && !targetAuthorParams.targetAuthor) {
            throw new Error("targetAuthor is required for group reaction removal");
          }
          params = __assign(
            { emoji: emoji.trim(), targetTimestamp: targetTimestamp, remove: true },
            targetAuthorParams,
          );
          if (normalizedRecipient) {
            params.recipients = [normalizedRecipient];
          }
          if (groupId) {
            params.groupIds = [groupId];
          }
          if (account) {
            params.account = account;
          }
          return [
            4 /*yield*/,
            (0, client_js_1.signalRpcRequest)("sendReaction", params, {
              baseUrl: baseUrl,
              timeoutMs: opts.timeoutMs,
            }),
          ];
        case 1:
          result = _c.sent();
          return [
            2 /*return*/,
            {
              ok: true,
              timestamp: result === null || result === void 0 ? void 0 : result.timestamp,
            },
          ];
      }
    });
  });
}
