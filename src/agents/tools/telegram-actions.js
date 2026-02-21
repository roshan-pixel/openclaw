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
exports.readTelegramButtons = readTelegramButtons;
exports.handleTelegramAction = handleTelegramAction;
var reaction_level_js_1 = require("../../telegram/reaction-level.js");
var send_js_1 = require("../../telegram/send.js");
var sticker_cache_js_1 = require("../../telegram/sticker-cache.js");
var token_js_1 = require("../../telegram/token.js");
var inline_buttons_js_1 = require("../../telegram/inline-buttons.js");
var common_js_1 = require("./common.js");
function readTelegramButtons(params) {
  var raw = params.buttons;
  if (raw == null) {
    return undefined;
  }
  if (!Array.isArray(raw)) {
    throw new Error("buttons must be an array of button rows");
  }
  var rows = raw.map(function (row, rowIndex) {
    if (!Array.isArray(row)) {
      throw new Error("buttons[".concat(rowIndex, "] must be an array"));
    }
    return row.map(function (button, buttonIndex) {
      if (!button || typeof button !== "object") {
        throw new Error(
          "buttons[".concat(rowIndex, "][").concat(buttonIndex, "] must be an object"),
        );
      }
      var text = typeof button.text === "string" ? button.text.trim() : "";
      var callbackData =
        typeof button.callback_data === "string" ? button.callback_data.trim() : "";
      if (!text || !callbackData) {
        throw new Error(
          "buttons["
            .concat(rowIndex, "][")
            .concat(buttonIndex, "] requires text and callback_data"),
        );
      }
      if (callbackData.length > 64) {
        throw new Error(
          "buttons["
            .concat(rowIndex, "][")
            .concat(buttonIndex, "] callback_data too long (max 64 chars)"),
        );
      }
      return { text: text, callback_data: callbackData };
    });
  });
  var filtered = rows.filter(function (row) {
    return row.length > 0;
  });
  return filtered.length > 0 ? filtered : undefined;
}
function handleTelegramAction(params, cfg) {
  return __awaiter(this, void 0, void 0, function () {
    var action,
      accountId,
      isActionEnabled,
      reactionLevelInfo,
      chatId,
      messageId,
      _a,
      emoji,
      remove,
      isEmpty,
      token,
      to,
      mediaUrl,
      content,
      buttons,
      inlineButtonsScope,
      targetType,
      replyToMessageId,
      messageThreadId,
      quoteText,
      token,
      result,
      chatId,
      messageId,
      token,
      chatId,
      messageId,
      content,
      buttons,
      inlineButtonsScope,
      token,
      result,
      to,
      fileId,
      replyToMessageId,
      messageThreadId,
      token,
      result,
      query,
      limit,
      results,
      stats;
    var _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          action = (0, common_js_1.readStringParam)(params, "action", { required: true });
          accountId = (0, common_js_1.readStringParam)(params, "accountId");
          isActionEnabled = (0, common_js_1.createActionGate)(
            (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.telegram) === null ||
              _c === void 0
              ? void 0
              : _c.actions,
          );
          if (!(action === "react")) {
            return [3 /*break*/, 2];
          }
          reactionLevelInfo = (0, reaction_level_js_1.resolveTelegramReactionLevel)({
            cfg: cfg,
            accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
          });
          if (!reactionLevelInfo.agentReactionsEnabled) {
            throw new Error(
              'Telegram agent reactions disabled (reactionLevel="'.concat(
                reactionLevelInfo.level,
                '"). ',
              ) + 'Set channels.telegram.reactionLevel to "minimal" or "extensive" to enable.',
            );
          }
          // Also check the existing action gate for backward compatibility
          if (!isActionEnabled("reactions")) {
            throw new Error("Telegram reactions are disabled via actions.reactions.");
          }
          chatId = (0, common_js_1.readStringOrNumberParam)(params, "chatId", {
            required: true,
          });
          messageId = (0, common_js_1.readNumberParam)(params, "messageId", {
            required: true,
            integer: true,
          });
          ((_a = (0, common_js_1.readReactionParams)(params, {
            removeErrorMessage: "Emoji is required to remove a Telegram reaction.",
          })),
            (emoji = _a.emoji),
            (remove = _a.remove),
            (isEmpty = _a.isEmpty));
          token = (0, token_js_1.resolveTelegramToken)(cfg, { accountId: accountId }).token;
          if (!token) {
            throw new Error(
              "Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.",
            );
          }
          return [
            4 /*yield*/,
            (0, send_js_1.reactMessageTelegram)(
              chatId !== null && chatId !== void 0 ? chatId : "",
              messageId !== null && messageId !== void 0 ? messageId : 0,
              emoji !== null && emoji !== void 0 ? emoji : "",
              {
                token: token,
                remove: remove,
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
              },
            ),
          ];
        case 1:
          _f.sent();
          if (!remove && !isEmpty) {
            return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, added: emoji })];
          }
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, removed: true })];
        case 2:
          if (!(action === "sendMessage")) {
            return [3 /*break*/, 4];
          }
          if (!isActionEnabled("sendMessage")) {
            throw new Error("Telegram sendMessage is disabled.");
          }
          to = (0, common_js_1.readStringParam)(params, "to", { required: true });
          mediaUrl = (0, common_js_1.readStringParam)(params, "mediaUrl");
          content =
            (_d = (0, common_js_1.readStringParam)(params, "content", {
              required: !mediaUrl,
              allowEmpty: true,
            })) !== null && _d !== void 0
              ? _d
              : "";
          buttons = readTelegramButtons(params);
          if (buttons) {
            inlineButtonsScope = (0, inline_buttons_js_1.resolveTelegramInlineButtonsScope)({
              cfg: cfg,
              accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
            });
            if (inlineButtonsScope === "off") {
              throw new Error(
                'Telegram inline buttons are disabled. Set channels.telegram.capabilities.inlineButtons to "dm", "group", "all", or "allowlist".',
              );
            }
            if (inlineButtonsScope === "dm" || inlineButtonsScope === "group") {
              targetType = (0, inline_buttons_js_1.resolveTelegramTargetChatType)(to);
              if (targetType === "unknown") {
                throw new Error(
                  'Telegram inline buttons require a numeric chat id when inlineButtons="'.concat(
                    inlineButtonsScope,
                    '".',
                  ),
                );
              }
              if (inlineButtonsScope === "dm" && targetType !== "direct") {
                throw new Error(
                  'Telegram inline buttons are limited to DMs when inlineButtons="dm".',
                );
              }
              if (inlineButtonsScope === "group" && targetType !== "group") {
                throw new Error(
                  'Telegram inline buttons are limited to groups when inlineButtons="group".',
                );
              }
            }
          }
          replyToMessageId = (0, common_js_1.readNumberParam)(params, "replyToMessageId", {
            integer: true,
          });
          messageThreadId = (0, common_js_1.readNumberParam)(params, "messageThreadId", {
            integer: true,
          });
          quoteText = (0, common_js_1.readStringParam)(params, "quoteText");
          token = (0, token_js_1.resolveTelegramToken)(cfg, { accountId: accountId }).token;
          if (!token) {
            throw new Error(
              "Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.",
            );
          }
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageTelegram)(to, content, {
              token: token,
              accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
              mediaUrl: mediaUrl || undefined,
              buttons: buttons,
              replyToMessageId:
                replyToMessageId !== null && replyToMessageId !== void 0
                  ? replyToMessageId
                  : undefined,
              messageThreadId:
                messageThreadId !== null && messageThreadId !== void 0
                  ? messageThreadId
                  : undefined,
              quoteText: quoteText !== null && quoteText !== void 0 ? quoteText : undefined,
              asVoice: typeof params.asVoice === "boolean" ? params.asVoice : undefined,
              silent: typeof params.silent === "boolean" ? params.silent : undefined,
            }),
          ];
        case 3:
          result = _f.sent();
          return [
            2 /*return*/,
            (0, common_js_1.jsonResult)({
              ok: true,
              messageId: result.messageId,
              chatId: result.chatId,
            }),
          ];
        case 4:
          if (!(action === "deleteMessage")) {
            return [3 /*break*/, 6];
          }
          if (!isActionEnabled("deleteMessage")) {
            throw new Error("Telegram deleteMessage is disabled.");
          }
          chatId = (0, common_js_1.readStringOrNumberParam)(params, "chatId", {
            required: true,
          });
          messageId = (0, common_js_1.readNumberParam)(params, "messageId", {
            required: true,
            integer: true,
          });
          token = (0, token_js_1.resolveTelegramToken)(cfg, { accountId: accountId }).token;
          if (!token) {
            throw new Error(
              "Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.",
            );
          }
          return [
            4 /*yield*/,
            (0, send_js_1.deleteMessageTelegram)(
              chatId !== null && chatId !== void 0 ? chatId : "",
              messageId !== null && messageId !== void 0 ? messageId : 0,
              {
                token: token,
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
              },
            ),
          ];
        case 5:
          _f.sent();
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, deleted: true })];
        case 6:
          if (!(action === "editMessage")) {
            return [3 /*break*/, 8];
          }
          if (!isActionEnabled("editMessage")) {
            throw new Error("Telegram editMessage is disabled.");
          }
          chatId = (0, common_js_1.readStringOrNumberParam)(params, "chatId", {
            required: true,
          });
          messageId = (0, common_js_1.readNumberParam)(params, "messageId", {
            required: true,
            integer: true,
          });
          content = (0, common_js_1.readStringParam)(params, "content", {
            required: true,
            allowEmpty: false,
          });
          buttons = readTelegramButtons(params);
          if (buttons) {
            inlineButtonsScope = (0, inline_buttons_js_1.resolveTelegramInlineButtonsScope)({
              cfg: cfg,
              accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
            });
            if (inlineButtonsScope === "off") {
              throw new Error(
                'Telegram inline buttons are disabled. Set channels.telegram.capabilities.inlineButtons to "dm", "group", "all", or "allowlist".',
              );
            }
          }
          token = (0, token_js_1.resolveTelegramToken)(cfg, { accountId: accountId }).token;
          if (!token) {
            throw new Error(
              "Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.",
            );
          }
          return [
            4 /*yield*/,
            (0, send_js_1.editMessageTelegram)(
              chatId !== null && chatId !== void 0 ? chatId : "",
              messageId !== null && messageId !== void 0 ? messageId : 0,
              content,
              {
                token: token,
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                buttons: buttons,
              },
            ),
          ];
        case 7:
          result = _f.sent();
          return [
            2 /*return*/,
            (0, common_js_1.jsonResult)({
              ok: true,
              messageId: result.messageId,
              chatId: result.chatId,
            }),
          ];
        case 8:
          if (!(action === "sendSticker")) {
            return [3 /*break*/, 10];
          }
          if (!isActionEnabled("sticker", false)) {
            throw new Error(
              "Telegram sticker actions are disabled. Set channels.telegram.actions.sticker to true.",
            );
          }
          to = (0, common_js_1.readStringParam)(params, "to", { required: true });
          fileId = (0, common_js_1.readStringParam)(params, "fileId", { required: true });
          replyToMessageId = (0, common_js_1.readNumberParam)(params, "replyToMessageId", {
            integer: true,
          });
          messageThreadId = (0, common_js_1.readNumberParam)(params, "messageThreadId", {
            integer: true,
          });
          token = (0, token_js_1.resolveTelegramToken)(cfg, { accountId: accountId }).token;
          if (!token) {
            throw new Error(
              "Telegram bot token missing. Set TELEGRAM_BOT_TOKEN or channels.telegram.botToken.",
            );
          }
          return [
            4 /*yield*/,
            (0, send_js_1.sendStickerTelegram)(to, fileId, {
              token: token,
              accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
              replyToMessageId:
                replyToMessageId !== null && replyToMessageId !== void 0
                  ? replyToMessageId
                  : undefined,
              messageThreadId:
                messageThreadId !== null && messageThreadId !== void 0
                  ? messageThreadId
                  : undefined,
            }),
          ];
        case 9:
          result = _f.sent();
          return [
            2 /*return*/,
            (0, common_js_1.jsonResult)({
              ok: true,
              messageId: result.messageId,
              chatId: result.chatId,
            }),
          ];
        case 10:
          if (action === "searchSticker") {
            if (!isActionEnabled("sticker", false)) {
              throw new Error(
                "Telegram sticker actions are disabled. Set channels.telegram.actions.sticker to true.",
              );
            }
            query = (0, common_js_1.readStringParam)(params, "query", { required: true });
            limit =
              (_e = (0, common_js_1.readNumberParam)(params, "limit", { integer: true })) !==
                null && _e !== void 0
                ? _e
                : 5;
            results = (0, sticker_cache_js_1.searchStickers)(query, limit);
            return [
              2 /*return*/,
              (0, common_js_1.jsonResult)({
                ok: true,
                count: results.length,
                stickers: results.map(function (s) {
                  return {
                    fileId: s.fileId,
                    emoji: s.emoji,
                    description: s.description,
                    setName: s.setName,
                  };
                }),
              }),
            ];
          }
          if (action === "stickerCacheStats") {
            stats = (0, sticker_cache_js_1.getCacheStats)();
            return [2 /*return*/, (0, common_js_1.jsonResult)(__assign({ ok: true }, stats))];
          }
          throw new Error("Unsupported Telegram action: ".concat(action));
      }
    });
  });
}
