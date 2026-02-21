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
exports.signalMessageActions = void 0;
var common_js_1 = require("../../../agents/tools/common.js");
var accounts_js_1 = require("../../../signal/accounts.js");
var reaction_level_js_1 = require("../../../signal/reaction-level.js");
var send_reactions_js_1 = require("../../../signal/send-reactions.js");
var providerId = "signal";
var GROUP_PREFIX = "group:";
function normalizeSignalReactionRecipient(raw) {
  var trimmed = raw.trim();
  if (!trimmed) {
    return trimmed;
  }
  var withoutSignal = trimmed.replace(/^signal:/i, "").trim();
  if (!withoutSignal) {
    return withoutSignal;
  }
  if (withoutSignal.toLowerCase().startsWith("uuid:")) {
    return withoutSignal.slice("uuid:".length).trim();
  }
  return withoutSignal;
}
function resolveSignalReactionTarget(raw) {
  var trimmed = raw.trim();
  if (!trimmed) {
    return {};
  }
  var withoutSignal = trimmed.replace(/^signal:/i, "").trim();
  if (!withoutSignal) {
    return {};
  }
  if (withoutSignal.toLowerCase().startsWith(GROUP_PREFIX)) {
    var groupId = withoutSignal.slice(GROUP_PREFIX.length).trim();
    return groupId ? { groupId: groupId } : {};
  }
  return { recipient: normalizeSignalReactionRecipient(withoutSignal) };
}
exports.signalMessageActions = {
  listActions: function (_a) {
    var cfg = _a.cfg;
    var accounts = (0, accounts_js_1.listEnabledSignalAccounts)(cfg);
    if (accounts.length === 0) {
      return [];
    }
    var configuredAccounts = accounts.filter(function (account) {
      return account.configured;
    });
    if (configuredAccounts.length === 0) {
      return [];
    }
    var actions = new Set(["send"]);
    var reactionsEnabled = configuredAccounts.some(function (account) {
      return (0, common_js_1.createActionGate)(account.config.actions)("reactions");
    });
    if (reactionsEnabled) {
      actions.add("react");
    }
    return Array.from(actions);
  },
  supportsAction: function (_a) {
    var action = _a.action;
    return action !== "send";
  },
  handleAction: function (_a) {
    return __awaiter(void 0, [_a], void 0, function (_b) {
      var reactionLevelInfo,
        actionConfig,
        isActionEnabled,
        recipientRaw,
        target,
        messageId,
        targetAuthor,
        targetAuthorUuid,
        emoji,
        remove,
        timestamp;
      var _c, _d, _e;
      var action = _b.action,
        params = _b.params,
        cfg = _b.cfg,
        accountId = _b.accountId;
      return __generator(this, function (_f) {
        switch (_f.label) {
          case 0:
            if (action === "send") {
              throw new Error("Send should be handled by outbound, not actions handler.");
            }
            if (!(action === "react")) {
              return [3 /*break*/, 4];
            }
            reactionLevelInfo = (0, reaction_level_js_1.resolveSignalReactionLevel)({
              cfg: cfg,
              accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
            });
            if (!reactionLevelInfo.agentReactionsEnabled) {
              throw new Error(
                'Signal agent reactions disabled (reactionLevel="'.concat(
                  reactionLevelInfo.level,
                  '"). ',
                ) + 'Set channels.signal.reactionLevel to "minimal" or "extensive" to enable.',
              );
            }
            actionConfig = (0, accounts_js_1.resolveSignalAccount)({
              cfg: cfg,
              accountId: accountId,
            }).config.actions;
            isActionEnabled = (0, common_js_1.createActionGate)(actionConfig);
            if (!isActionEnabled("reactions")) {
              throw new Error("Signal reactions are disabled via actions.reactions.");
            }
            recipientRaw =
              (_c = (0, common_js_1.readStringParam)(params, "recipient")) !== null && _c !== void 0
                ? _c
                : (0, common_js_1.readStringParam)(params, "to", {
                    required: true,
                    label: "recipient (UUID, phone number, or group)",
                  });
            target = resolveSignalReactionTarget(recipientRaw);
            if (!target.recipient && !target.groupId) {
              throw new Error("recipient or group required");
            }
            messageId = (0, common_js_1.readStringParam)(params, "messageId", {
              required: true,
              label: "messageId (timestamp)",
            });
            targetAuthor = (0, common_js_1.readStringParam)(params, "targetAuthor");
            targetAuthorUuid = (0, common_js_1.readStringParam)(params, "targetAuthorUuid");
            if (target.groupId && !targetAuthor && !targetAuthorUuid) {
              throw new Error("targetAuthor or targetAuthorUuid required for group reactions.");
            }
            emoji = (0, common_js_1.readStringParam)(params, "emoji", { allowEmpty: true });
            remove = typeof params.remove === "boolean" ? params.remove : undefined;
            timestamp = parseInt(messageId, 10);
            if (!Number.isFinite(timestamp)) {
              throw new Error(
                "Invalid messageId: ".concat(messageId, ". Expected numeric timestamp."),
              );
            }
            if (!remove) {
              return [3 /*break*/, 2];
            }
            if (!emoji) {
              throw new Error("Emoji required to remove reaction.");
            }
            return [
              4 /*yield*/,
              (0, send_reactions_js_1.removeReactionSignal)(
                (_d = target.recipient) !== null && _d !== void 0 ? _d : "",
                timestamp,
                emoji,
                {
                  accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                  groupId: target.groupId,
                  targetAuthor: targetAuthor,
                  targetAuthorUuid: targetAuthorUuid,
                },
              ),
            ];
          case 1:
            _f.sent();
            return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, removed: emoji })];
          case 2:
            if (!emoji) {
              throw new Error("Emoji required to add reaction.");
            }
            return [
              4 /*yield*/,
              (0, send_reactions_js_1.sendReactionSignal)(
                (_e = target.recipient) !== null && _e !== void 0 ? _e : "",
                timestamp,
                emoji,
                {
                  accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                  groupId: target.groupId,
                  targetAuthor: targetAuthor,
                  targetAuthorUuid: targetAuthorUuid,
                },
              ),
            ];
          case 3:
            _f.sent();
            return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, added: emoji })];
          case 4:
            throw new Error(
              "Action ".concat(action, " not supported for ").concat(providerId, "."),
            );
        }
      });
    });
  },
};
