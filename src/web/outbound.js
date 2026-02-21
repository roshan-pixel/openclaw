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
exports.sendMessageWhatsApp = sendMessageWhatsApp;
exports.sendReactionWhatsApp = sendReactionWhatsApp;
exports.sendPollWhatsApp = sendPollWhatsApp;
var node_crypto_1 = require("node:crypto");
var logger_js_1 = require("../logging/logger.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var polls_js_1 = require("../polls.js");
var utils_js_1 = require("../utils.js");
var config_js_1 = require("../config/config.js");
var markdown_tables_js_1 = require("../config/markdown-tables.js");
var tables_js_1 = require("../markdown/tables.js");
var active_listener_js_1 = require("./active-listener.js");
var media_js_1 = require("./media.js");
var outboundLog = (0, subsystem_js_1.createSubsystemLogger)("gateway/channels/whatsapp").child(
  "outbound",
);
function sendMessageWhatsApp(to, body, options) {
  return __awaiter(this, void 0, void 0, function () {
    var text,
      correlationId,
      startedAt,
      _a,
      active,
      resolvedAccountId,
      cfg,
      tableMode,
      logger,
      jid,
      mediaBuffer,
      mediaType,
      media,
      caption,
      hasExplicitAccountId,
      accountId,
      sendOptions,
      result,
      _b,
      messageId,
      durationMs,
      err_1;
    var _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          text = body;
          correlationId = (0, node_crypto_1.randomUUID)();
          startedAt = Date.now();
          ((_a = (0, active_listener_js_1.requireActiveWebListener)(options.accountId)),
            (active = _a.listener),
            (resolvedAccountId = _a.accountId));
          cfg = (0, config_js_1.loadConfig)();
          tableMode = (0, markdown_tables_js_1.resolveMarkdownTableMode)({
            cfg: cfg,
            channel: "whatsapp",
            accountId:
              resolvedAccountId !== null && resolvedAccountId !== void 0
                ? resolvedAccountId
                : options.accountId,
          });
          text = (0, tables_js_1.convertMarkdownTables)(
            text !== null && text !== void 0 ? text : "",
            tableMode,
          );
          logger = (0, logger_js_1.getChildLogger)({
            module: "web-outbound",
            correlationId: correlationId,
            to: to,
          });
          _f.label = 1;
        case 1:
          _f.trys.push([1, 9, , 10]);
          jid = (0, utils_js_1.toWhatsappJid)(to);
          mediaBuffer = void 0;
          mediaType = void 0;
          if (!options.mediaUrl) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, (0, media_js_1.loadWebMedia)(options.mediaUrl)];
        case 2:
          media = _f.sent();
          caption = text || undefined;
          mediaBuffer = media.buffer;
          mediaType = media.contentType;
          if (media.kind === "audio") {
            // WhatsApp expects explicit opus codec for PTT voice notes.
            mediaType =
              media.contentType === "audio/ogg"
                ? "audio/ogg; codecs=opus"
                : (_c = media.contentType) !== null && _c !== void 0
                  ? _c
                  : "application/octet-stream";
          } else if (media.kind === "video") {
            text = caption !== null && caption !== void 0 ? caption : "";
          } else if (media.kind === "image") {
            text = caption !== null && caption !== void 0 ? caption : "";
          } else {
            text = caption !== null && caption !== void 0 ? caption : "";
          }
          _f.label = 3;
        case 3:
          outboundLog.info(
            "Sending message -> ".concat(jid).concat(options.mediaUrl ? " (media)" : ""),
          );
          logger.info({ jid: jid, hasMedia: Boolean(options.mediaUrl) }, "sending message");
          return [4 /*yield*/, active.sendComposingTo(to)];
        case 4:
          _f.sent();
          hasExplicitAccountId = Boolean(
            (_d = options.accountId) === null || _d === void 0 ? void 0 : _d.trim(),
          );
          accountId = hasExplicitAccountId ? resolvedAccountId : undefined;
          sendOptions =
            options.gifPlayback || accountId
              ? __assign(__assign({}, options.gifPlayback ? { gifPlayback: true } : {}), {
                  accountId: accountId,
                })
              : undefined;
          if (!sendOptions) {
            return [3 /*break*/, 6];
          }
          return [4 /*yield*/, active.sendMessage(to, text, mediaBuffer, mediaType, sendOptions)];
        case 5:
          _b = _f.sent();
          return [3 /*break*/, 8];
        case 6:
          return [4 /*yield*/, active.sendMessage(to, text, mediaBuffer, mediaType)];
        case 7:
          _b = _f.sent();
          _f.label = 8;
        case 8:
          result = _b;
          messageId =
            (_e = result === null || result === void 0 ? void 0 : result.messageId) !== null &&
            _e !== void 0
              ? _e
              : "unknown";
          durationMs = Date.now() - startedAt;
          outboundLog.info(
            "Sent message "
              .concat(messageId, " -> ")
              .concat(jid)
              .concat(options.mediaUrl ? " (media)" : "", " (")
              .concat(durationMs, "ms)"),
          );
          logger.info({ jid: jid, messageId: messageId }, "sent message");
          return [2 /*return*/, { messageId: messageId, toJid: jid }];
        case 9:
          err_1 = _f.sent();
          logger.error(
            { err: String(err_1), to: to, hasMedia: Boolean(options.mediaUrl) },
            "failed to send via web session",
          );
          throw err_1;
        case 10:
          return [2 /*return*/];
      }
    });
  });
}
function sendReactionWhatsApp(chatJid, messageId, emoji, options) {
  return __awaiter(this, void 0, void 0, function () {
    var correlationId, active, logger, jid, err_2;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          correlationId = (0, node_crypto_1.randomUUID)();
          active = (0, active_listener_js_1.requireActiveWebListener)(options.accountId).listener;
          logger = (0, logger_js_1.getChildLogger)({
            module: "web-outbound",
            correlationId: correlationId,
            chatJid: chatJid,
            messageId: messageId,
          });
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          jid = (0, utils_js_1.toWhatsappJid)(chatJid);
          outboundLog.info('Sending reaction "'.concat(emoji, '" -> message ').concat(messageId));
          logger.info({ chatJid: jid, messageId: messageId, emoji: emoji }, "sending reaction");
          return [
            4 /*yield*/,
            active.sendReaction(
              chatJid,
              messageId,
              emoji,
              (_a = options.fromMe) !== null && _a !== void 0 ? _a : false,
              options.participant,
            ),
          ];
        case 2:
          _b.sent();
          outboundLog.info('Sent reaction "'.concat(emoji, '" -> message ').concat(messageId));
          logger.info({ chatJid: jid, messageId: messageId, emoji: emoji }, "sent reaction");
          return [3 /*break*/, 4];
        case 3:
          err_2 = _b.sent();
          logger.error(
            { err: String(err_2), chatJid: chatJid, messageId: messageId, emoji: emoji },
            "failed to send reaction via web session",
          );
          throw err_2;
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function sendPollWhatsApp(to, poll, options) {
  return __awaiter(this, void 0, void 0, function () {
    var correlationId,
      startedAt,
      active,
      logger,
      jid,
      normalized,
      result,
      messageId,
      durationMs,
      err_3;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          correlationId = (0, node_crypto_1.randomUUID)();
          startedAt = Date.now();
          active = (0, active_listener_js_1.requireActiveWebListener)(options.accountId).listener;
          logger = (0, logger_js_1.getChildLogger)({
            module: "web-outbound",
            correlationId: correlationId,
            to: to,
          });
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          jid = (0, utils_js_1.toWhatsappJid)(to);
          normalized = (0, polls_js_1.normalizePollInput)(poll, { maxOptions: 12 });
          outboundLog.info("Sending poll -> ".concat(jid, ': "').concat(normalized.question, '"'));
          logger.info(
            {
              jid: jid,
              question: normalized.question,
              optionCount: normalized.options.length,
              maxSelections: normalized.maxSelections,
            },
            "sending poll",
          );
          return [4 /*yield*/, active.sendPoll(to, normalized)];
        case 2:
          result = _b.sent();
          messageId =
            (_a = result === null || result === void 0 ? void 0 : result.messageId) !== null &&
            _a !== void 0
              ? _a
              : "unknown";
          durationMs = Date.now() - startedAt;
          outboundLog.info(
            "Sent poll ".concat(messageId, " -> ").concat(jid, " (").concat(durationMs, "ms)"),
          );
          logger.info({ jid: jid, messageId: messageId }, "sent poll");
          return [2 /*return*/, { messageId: messageId, toJid: jid }];
        case 3:
          err_3 = _b.sent();
          logger.error(
            { err: String(err_3), to: to, question: poll.question },
            "failed to send poll via web session",
          );
          throw err_3;
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
