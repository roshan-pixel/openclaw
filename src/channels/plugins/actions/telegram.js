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
exports.telegramMessageActions = void 0;
var common_js_1 = require("../../../agents/tools/common.js");
var telegram_actions_js_1 = require("../../../agents/tools/telegram-actions.js");
var accounts_js_1 = require("../../../telegram/accounts.js");
var inline_buttons_js_1 = require("../../../telegram/inline-buttons.js");
var providerId = "telegram";
function readTelegramSendParams(params) {
  var to = (0, common_js_1.readStringParam)(params, "to", { required: true });
  var mediaUrl = (0, common_js_1.readStringParam)(params, "media", { trim: false });
  var message = (0, common_js_1.readStringParam)(params, "message", {
    required: !mediaUrl,
    allowEmpty: true,
  });
  var caption = (0, common_js_1.readStringParam)(params, "caption", { allowEmpty: true });
  var content = message || caption || "";
  var replyTo = (0, common_js_1.readStringParam)(params, "replyTo");
  var threadId = (0, common_js_1.readStringParam)(params, "threadId");
  var buttons = params.buttons;
  var asVoice = typeof params.asVoice === "boolean" ? params.asVoice : undefined;
  var silent = typeof params.silent === "boolean" ? params.silent : undefined;
  var quoteText = (0, common_js_1.readStringParam)(params, "quoteText");
  return {
    to: to,
    content: content,
    mediaUrl: mediaUrl !== null && mediaUrl !== void 0 ? mediaUrl : undefined,
    replyToMessageId: replyTo !== null && replyTo !== void 0 ? replyTo : undefined,
    messageThreadId: threadId !== null && threadId !== void 0 ? threadId : undefined,
    buttons: buttons,
    asVoice: asVoice,
    silent: silent,
    quoteText: quoteText !== null && quoteText !== void 0 ? quoteText : undefined,
  };
}
exports.telegramMessageActions = {
  listActions: function (_a) {
    var _b, _c;
    var cfg = _a.cfg;
    var accounts = (0, accounts_js_1.listEnabledTelegramAccounts)(cfg).filter(function (account) {
      return account.tokenSource !== "none";
    });
    if (accounts.length === 0) {
      return [];
    }
    var gate = (0, common_js_1.createActionGate)(
      (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.telegram) === null ||
        _c === void 0
        ? void 0
        : _c.actions,
    );
    var actions = new Set(["send"]);
    if (gate("reactions")) {
      actions.add("react");
    }
    if (gate("deleteMessage")) {
      actions.add("delete");
    }
    if (gate("editMessage")) {
      actions.add("edit");
    }
    if (gate("sticker", false)) {
      actions.add("sticker");
      actions.add("sticker-search");
    }
    return Array.from(actions);
  },
  supportsButtons: function (_a) {
    var cfg = _a.cfg;
    var accounts = (0, accounts_js_1.listEnabledTelegramAccounts)(cfg).filter(function (account) {
      return account.tokenSource !== "none";
    });
    if (accounts.length === 0) {
      return false;
    }
    return accounts.some(function (account) {
      return (0, inline_buttons_js_1.isTelegramInlineButtonsEnabled)({
        cfg: cfg,
        accountId: account.accountId,
      });
    });
  },
  extractToolSend: function (_a) {
    var args = _a.args;
    var action = typeof args.action === "string" ? args.action.trim() : "";
    if (action !== "sendMessage") {
      return null;
    }
    var to = typeof args.to === "string" ? args.to : undefined;
    if (!to) {
      return null;
    }
    var accountId = typeof args.accountId === "string" ? args.accountId.trim() : undefined;
    return { to: to, accountId: accountId };
  },
  handleAction: function (_a) {
    return __awaiter(void 0, [_a], void 0, function (_b) {
      var sendParams,
        messageId,
        emoji,
        remove,
        chatId,
        messageId,
        chatId,
        messageId,
        message,
        buttons,
        to,
        stickerIds,
        fileId,
        replyToMessageId,
        messageThreadId,
        query,
        limit;
      var _c, _d, _e, _f, _g, _h, _j, _k;
      var action = _b.action,
        params = _b.params,
        cfg = _b.cfg,
        accountId = _b.accountId;
      return __generator(this, function (_l) {
        switch (_l.label) {
          case 0:
            if (!(action === "send")) {
              return [3 /*break*/, 2];
            }
            sendParams = readTelegramSendParams(params);
            return [
              4 /*yield*/,
              (0, telegram_actions_js_1.handleTelegramAction)(
                __assign(__assign({ action: "sendMessage" }, sendParams), {
                  accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                }),
                cfg,
              ),
            ];
          case 1:
            return [2 /*return*/, _l.sent()];
          case 2:
            if (!(action === "react")) {
              return [3 /*break*/, 4];
            }
            messageId = (0, common_js_1.readStringOrNumberParam)(params, "messageId", {
              required: true,
            });
            emoji = (0, common_js_1.readStringParam)(params, "emoji", { allowEmpty: true });
            remove = typeof params.remove === "boolean" ? params.remove : undefined;
            return [
              4 /*yield*/,
              (0, telegram_actions_js_1.handleTelegramAction)(
                {
                  action: "react",
                  chatId:
                    (_d =
                      (_c = (0, common_js_1.readStringOrNumberParam)(params, "chatId")) !== null &&
                      _c !== void 0
                        ? _c
                        : (0, common_js_1.readStringOrNumberParam)(params, "channelId")) !== null &&
                    _d !== void 0
                      ? _d
                      : (0, common_js_1.readStringParam)(params, "to", { required: true }),
                  messageId: messageId,
                  emoji: emoji,
                  remove: remove,
                  accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                },
                cfg,
              ),
            ];
          case 3:
            return [2 /*return*/, _l.sent()];
          case 4:
            if (!(action === "delete")) {
              return [3 /*break*/, 6];
            }
            chatId =
              (_f =
                (_e = (0, common_js_1.readStringOrNumberParam)(params, "chatId")) !== null &&
                _e !== void 0
                  ? _e
                  : (0, common_js_1.readStringOrNumberParam)(params, "channelId")) !== null &&
              _f !== void 0
                ? _f
                : (0, common_js_1.readStringParam)(params, "to", { required: true });
            messageId = (0, common_js_1.readNumberParam)(params, "messageId", {
              required: true,
              integer: true,
            });
            return [
              4 /*yield*/,
              (0, telegram_actions_js_1.handleTelegramAction)(
                {
                  action: "deleteMessage",
                  chatId: chatId,
                  messageId: messageId,
                  accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                },
                cfg,
              ),
            ];
          case 5:
            return [2 /*return*/, _l.sent()];
          case 6:
            if (!(action === "edit")) {
              return [3 /*break*/, 8];
            }
            chatId =
              (_h =
                (_g = (0, common_js_1.readStringOrNumberParam)(params, "chatId")) !== null &&
                _g !== void 0
                  ? _g
                  : (0, common_js_1.readStringOrNumberParam)(params, "channelId")) !== null &&
              _h !== void 0
                ? _h
                : (0, common_js_1.readStringParam)(params, "to", { required: true });
            messageId = (0, common_js_1.readNumberParam)(params, "messageId", {
              required: true,
              integer: true,
            });
            message = (0, common_js_1.readStringParam)(params, "message", {
              required: true,
              allowEmpty: false,
            });
            buttons = params.buttons;
            return [
              4 /*yield*/,
              (0, telegram_actions_js_1.handleTelegramAction)(
                {
                  action: "editMessage",
                  chatId: chatId,
                  messageId: messageId,
                  content: message,
                  buttons: buttons,
                  accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                },
                cfg,
              ),
            ];
          case 7:
            return [2 /*return*/, _l.sent()];
          case 8:
            if (!(action === "sticker")) {
              return [3 /*break*/, 10];
            }
            to =
              (_j = (0, common_js_1.readStringParam)(params, "to")) !== null && _j !== void 0
                ? _j
                : (0, common_js_1.readStringParam)(params, "target", { required: true });
            stickerIds = (0, common_js_1.readStringArrayParam)(params, "stickerId");
            fileId =
              (_k = stickerIds === null || stickerIds === void 0 ? void 0 : stickerIds[0]) !==
                null && _k !== void 0
                ? _k
                : (0, common_js_1.readStringParam)(params, "fileId", { required: true });
            replyToMessageId = (0, common_js_1.readNumberParam)(params, "replyTo", {
              integer: true,
            });
            messageThreadId = (0, common_js_1.readNumberParam)(params, "threadId", {
              integer: true,
            });
            return [
              4 /*yield*/,
              (0, telegram_actions_js_1.handleTelegramAction)(
                {
                  action: "sendSticker",
                  to: to,
                  fileId: fileId,
                  replyToMessageId:
                    replyToMessageId !== null && replyToMessageId !== void 0
                      ? replyToMessageId
                      : undefined,
                  messageThreadId:
                    messageThreadId !== null && messageThreadId !== void 0
                      ? messageThreadId
                      : undefined,
                  accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                },
                cfg,
              ),
            ];
          case 9:
            return [2 /*return*/, _l.sent()];
          case 10:
            if (!(action === "sticker-search")) {
              return [3 /*break*/, 12];
            }
            query = (0, common_js_1.readStringParam)(params, "query", { required: true });
            limit = (0, common_js_1.readNumberParam)(params, "limit", { integer: true });
            return [
              4 /*yield*/,
              (0, telegram_actions_js_1.handleTelegramAction)(
                {
                  action: "searchSticker",
                  query: query,
                  limit: limit !== null && limit !== void 0 ? limit : undefined,
                  accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                },
                cfg,
              ),
            ];
          case 11:
            return [2 /*return*/, _l.sent()];
          case 12:
            throw new Error(
              "Action ".concat(action, " is not supported for provider ").concat(providerId, "."),
            );
        }
      });
    });
  },
};
