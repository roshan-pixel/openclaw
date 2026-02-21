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
exports.buildInlineKeyboard = buildInlineKeyboard;
exports.sendMessageTelegram = sendMessageTelegram;
exports.reactMessageTelegram = reactMessageTelegram;
exports.deleteMessageTelegram = deleteMessageTelegram;
exports.editMessageTelegram = editMessageTelegram;
exports.sendStickerTelegram = sendStickerTelegram;
var grammy_1 = require("grammy");
var config_js_1 = require("../config/config.js");
var globals_js_1 = require("../globals.js");
var channel_activity_js_1 = require("../infra/channel-activity.js");
var api_logging_js_1 = require("./api-logging.js");
var errors_js_1 = require("../infra/errors.js");
var diagnostic_flags_js_1 = require("../infra/diagnostic-flags.js");
var retry_policy_js_1 = require("../infra/retry-policy.js");
var redact_js_1 = require("../logging/redact.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var constants_js_1 = require("../media/constants.js");
var mime_js_1 = require("../media/mime.js");
var media_js_1 = require("../web/media.js");
var accounts_js_1 = require("./accounts.js");
var fetch_js_1 = require("./fetch.js");
var proxy_js_1 = require("./proxy.js");
var format_js_1 = require("./format.js");
var markdown_tables_js_1 = require("../config/markdown-tables.js");
var network_errors_js_1 = require("./network-errors.js");
var caption_js_1 = require("./caption.js");
var sent_message_cache_js_1 = require("./sent-message-cache.js");
var targets_js_1 = require("./targets.js");
var voice_js_1 = require("./voice.js");
var helpers_js_1 = require("./bot/helpers.js");
var PARSE_ERR_RE = /can't parse entities|parse entities|find end of the entity/i;
var diagLogger = (0, subsystem_js_1.createSubsystemLogger)("telegram/diagnostic");
function createTelegramHttpLogger(cfg) {
  var enabled = (0, diagnostic_flags_js_1.isDiagnosticFlagEnabled)("telegram.http", cfg);
  if (!enabled) {
    return function () {};
  }
  return function (label, err) {
    var _a;
    if (!(err instanceof grammy_1.HttpError)) {
      return;
    }
    var detail = (0, redact_js_1.redactSensitiveText)(
      (0, errors_js_1.formatUncaughtError)((_a = err.error) !== null && _a !== void 0 ? _a : err),
    );
    diagLogger.warn("telegram http error (".concat(label, "): ").concat(detail));
  };
}
function resolveTelegramClientOptions(account) {
  var _a;
  var proxyUrl = (_a = account.config.proxy) === null || _a === void 0 ? void 0 : _a.trim();
  var proxyFetch = proxyUrl ? (0, proxy_js_1.makeProxyFetch)(proxyUrl) : undefined;
  var fetchImpl = (0, fetch_js_1.resolveTelegramFetch)(proxyFetch, {
    network: account.config.network,
  });
  var timeoutSeconds =
    typeof account.config.timeoutSeconds === "number" &&
    Number.isFinite(account.config.timeoutSeconds)
      ? Math.max(1, Math.floor(account.config.timeoutSeconds))
      : undefined;
  return fetchImpl || timeoutSeconds
    ? __assign(
        __assign({}, fetchImpl ? { fetch: fetchImpl } : {}),
        timeoutSeconds ? { timeoutSeconds: timeoutSeconds } : {},
      )
    : undefined;
}
function resolveToken(explicit, params) {
  if (explicit === null || explicit === void 0 ? void 0 : explicit.trim()) {
    return explicit.trim();
  }
  if (!params.token) {
    throw new Error(
      'Telegram bot token missing for account "'
        .concat(params.accountId, '" (set channels.telegram.accounts.')
        .concat(params.accountId, ".botToken/tokenFile or TELEGRAM_BOT_TOKEN for default)."),
    );
  }
  return params.token.trim();
}
function normalizeChatId(to) {
  var _a;
  var trimmed = to.trim();
  if (!trimmed) {
    throw new Error("Recipient is required for Telegram sends");
  }
  // Common internal prefixes that sometimes leak into outbound sends.
  // - ctx.To uses `telegram:<id>`
  // - group sessions often use `telegram:group:<id>`
  var normalized = (0, targets_js_1.stripTelegramInternalPrefixes)(trimmed);
  // Accept t.me links for public chats/channels.
  // (Invite links like `t.me/+...` are not resolvable via Bot API.)
  var m =
    (_a = /^https?:\/\/t\.me\/([A-Za-z0-9_]+)$/i.exec(normalized)) !== null && _a !== void 0
      ? _a
      : /^t\.me\/([A-Za-z0-9_]+)$/i.exec(normalized);
  if (m === null || m === void 0 ? void 0 : m[1]) {
    normalized = "@".concat(m[1]);
  }
  if (!normalized) {
    throw new Error("Recipient is required for Telegram sends");
  }
  if (normalized.startsWith("@")) {
    return normalized;
  }
  if (/^-?\d+$/.test(normalized)) {
    return normalized;
  }
  // If the user passed a username without `@`, assume they meant a public chat/channel.
  if (/^[A-Za-z0-9_]{5,}$/i.test(normalized)) {
    return "@".concat(normalized);
  }
  return normalized;
}
function normalizeMessageId(raw) {
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return Math.trunc(raw);
  }
  if (typeof raw === "string") {
    var value = raw.trim();
    if (!value) {
      throw new Error("Message id is required for Telegram actions");
    }
    var parsed = Number.parseInt(value, 10);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  throw new Error("Message id is required for Telegram actions");
}
function buildInlineKeyboard(buttons) {
  if (!(buttons === null || buttons === void 0 ? void 0 : buttons.length)) {
    return undefined;
  }
  var rows = buttons
    .map(function (row) {
      return row
        .filter(function (button) {
          return (
            (button === null || button === void 0 ? void 0 : button.text) &&
            (button === null || button === void 0 ? void 0 : button.callback_data)
          );
        })
        .map(function (button) {
          return {
            text: button.text,
            callback_data: button.callback_data,
          };
        });
    })
    .filter(function (row) {
      return row.length > 0;
    });
  if (rows.length === 0) {
    return undefined;
  }
  return { inline_keyboard: rows };
}
function sendMessageTelegram(to_1, text_1) {
  return __awaiter(this, arguments, void 0, function (to, text, opts) {
    var cfg,
      account,
      token,
      target,
      chatId,
      client,
      api,
      mediaUrl,
      replyMarkup,
      messageThreadId,
      threadIdParams,
      threadParams,
      quoteText,
      hasThreadParams,
      request,
      logHttpError,
      requestWithDiag,
      wrapChatNotFound,
      textMode,
      tableMode,
      renderHtmlText,
      linkPreviewEnabled,
      linkPreviewOptions,
      sendTelegramText,
      media,
      kind,
      isGif,
      fileName,
      file_1,
      _a,
      caption,
      followUpText,
      htmlCaption,
      needsSeparateText,
      baseMediaParams,
      mediaParams_1,
      result,
      useVoice,
      mediaMessageId,
      resolvedChatId,
      textParams_1,
      textRes,
      textParams,
      res,
      messageId;
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_s) {
      switch (_s.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveTelegramAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken(opts.token, account);
          target = (0, targets_js_1.parseTelegramTarget)(to);
          chatId = normalizeChatId(target.chatId);
          client = resolveTelegramClientOptions(account);
          api =
            (_b = opts.api) !== null && _b !== void 0
              ? _b
              : new grammy_1.Bot(token, client ? { client: client } : undefined).api;
          mediaUrl = (_c = opts.mediaUrl) === null || _c === void 0 ? void 0 : _c.trim();
          replyMarkup = buildInlineKeyboard(opts.buttons);
          messageThreadId =
            opts.messageThreadId != null ? opts.messageThreadId : target.messageThreadId;
          threadIdParams = (0, helpers_js_1.buildTelegramThreadParams)(messageThreadId);
          threadParams = threadIdParams ? __assign({}, threadIdParams) : {};
          quoteText = (_d = opts.quoteText) === null || _d === void 0 ? void 0 : _d.trim();
          if (opts.replyToMessageId != null) {
            if (quoteText) {
              threadParams.reply_parameters = {
                message_id: Math.trunc(opts.replyToMessageId),
                quote: quoteText,
              };
            } else {
              threadParams.reply_to_message_id = Math.trunc(opts.replyToMessageId);
            }
          }
          hasThreadParams = Object.keys(threadParams).length > 0;
          request = (0, retry_policy_js_1.createTelegramRetryRunner)({
            retry: opts.retry,
            configRetry: account.config.retry,
            verbose: opts.verbose,
            shouldRetry: function (err) {
              return (0, network_errors_js_1.isRecoverableTelegramNetworkError)(err, {
                context: "send",
              });
            },
          });
          logHttpError = createTelegramHttpLogger(cfg);
          requestWithDiag = function (fn, label) {
            return (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: label !== null && label !== void 0 ? label : "request",
              fn: function () {
                return request(fn, label);
              },
            }).catch(function (err) {
              logHttpError(label !== null && label !== void 0 ? label : "request", err);
              throw err;
            });
          };
          wrapChatNotFound = function (err) {
            if (
              !/400: Bad Request: chat not found/i.test((0, errors_js_1.formatErrorMessage)(err))
            ) {
              return err;
            }
            return new Error(
              [
                "Telegram send failed: chat not found (chat_id=".concat(chatId, ")."),
                "Likely: bot not started in DM, bot removed from group/channel, group migrated (new -100… id), or wrong bot token.",
                "Input was: ".concat(JSON.stringify(to), "."),
              ].join(" "),
            );
          };
          textMode = (_e = opts.textMode) !== null && _e !== void 0 ? _e : "markdown";
          tableMode = (0, markdown_tables_js_1.resolveMarkdownTableMode)({
            cfg: cfg,
            channel: "telegram",
            accountId: account.accountId,
          });
          renderHtmlText = function (value) {
            return (0, format_js_1.renderTelegramHtmlText)(value, {
              textMode: textMode,
              tableMode: tableMode,
            });
          };
          linkPreviewEnabled =
            (_f = account.config.linkPreview) !== null && _f !== void 0 ? _f : true;
          linkPreviewOptions = linkPreviewEnabled ? undefined : { is_disabled: true };
          sendTelegramText = function (rawText, params, fallbackText) {
            return __awaiter(_this, void 0, void 0, function () {
              var htmlText, baseParams, hasBaseParams, sendParams, res;
              var _this = this;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    htmlText = renderHtmlText(rawText);
                    baseParams = params ? __assign({}, params) : {};
                    if (linkPreviewOptions) {
                      baseParams.link_preview_options = linkPreviewOptions;
                    }
                    hasBaseParams = Object.keys(baseParams).length > 0;
                    sendParams = __assign(
                      __assign({ parse_mode: "HTML" }, baseParams),
                      opts.silent === true ? { disable_notification: true } : {},
                    );
                    return [
                      4 /*yield*/,
                      requestWithDiag(function () {
                        return api.sendMessage(chatId, htmlText, sendParams);
                      }, "message").catch(function (err) {
                        return __awaiter(_this, void 0, void 0, function () {
                          var errText, fallback_1, plainParams_1;
                          return __generator(this, function (_a) {
                            switch (_a.label) {
                              case 0:
                                errText = (0, errors_js_1.formatErrorMessage)(err);
                                if (!PARSE_ERR_RE.test(errText)) {
                                  return [3 /*break*/, 2];
                                }
                                if (opts.verbose) {
                                  console.warn(
                                    "telegram HTML parse failed, retrying as plain text: ".concat(
                                      errText,
                                    ),
                                  );
                                }
                                fallback_1 =
                                  fallbackText !== null && fallbackText !== void 0
                                    ? fallbackText
                                    : rawText;
                                plainParams_1 = hasBaseParams ? baseParams : undefined;
                                return [
                                  4 /*yield*/,
                                  requestWithDiag(function () {
                                    return plainParams_1
                                      ? api.sendMessage(chatId, fallback_1, plainParams_1)
                                      : api.sendMessage(chatId, fallback_1);
                                  }, "message-plain").catch(function (err2) {
                                    throw wrapChatNotFound(err2);
                                  }),
                                ];
                              case 1:
                                return [2 /*return*/, _a.sent()];
                              case 2:
                                throw wrapChatNotFound(err);
                            }
                          });
                        });
                      }),
                    ];
                  case 1:
                    res = _a.sent();
                    return [2 /*return*/, res];
                }
              });
            });
          };
          if (!mediaUrl) {
            return [3 /*break*/, 17];
          }
          return [4 /*yield*/, (0, media_js_1.loadWebMedia)(mediaUrl, opts.maxBytes)];
        case 1:
          media = _s.sent();
          kind = (0, constants_js_1.mediaKindFromMime)(
            (_g = media.contentType) !== null && _g !== void 0 ? _g : undefined,
          );
          isGif = (0, mime_js_1.isGifMedia)({
            contentType: media.contentType,
            fileName: media.fileName,
          });
          fileName =
            (_j =
              (_h = media.fileName) !== null && _h !== void 0
                ? _h
                : isGif
                  ? "animation.gif"
                  : inferFilename(kind)) !== null && _j !== void 0
              ? _j
              : "file";
          file_1 = new grammy_1.InputFile(media.buffer, fileName);
          ((_a = (0, caption_js_1.splitTelegramCaption)(text)),
            (caption = _a.caption),
            (followUpText = _a.followUpText));
          htmlCaption = caption ? renderHtmlText(caption) : undefined;
          needsSeparateText = Boolean(followUpText);
          baseMediaParams = __assign(
            __assign({}, hasThreadParams ? threadParams : {}),
            !needsSeparateText && replyMarkup ? { reply_markup: replyMarkup } : {},
          );
          mediaParams_1 = __assign(
            __assign(
              __assign({ caption: htmlCaption }, htmlCaption ? { parse_mode: "HTML" } : {}),
              baseMediaParams,
            ),
            opts.silent === true ? { disable_notification: true } : {},
          );
          result = void 0;
          if (!isGif) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            requestWithDiag(function () {
              return api.sendAnimation(chatId, file_1, mediaParams_1);
            }, "animation").catch(function (err) {
              throw wrapChatNotFound(err);
            }),
          ];
        case 2:
          result = _s.sent();
          return [3 /*break*/, 14];
        case 3:
          if (!(kind === "image")) {
            return [3 /*break*/, 5];
          }
          return [
            4 /*yield*/,
            requestWithDiag(function () {
              return api.sendPhoto(chatId, file_1, mediaParams_1);
            }, "photo").catch(function (err) {
              throw wrapChatNotFound(err);
            }),
          ];
        case 4:
          result = _s.sent();
          return [3 /*break*/, 14];
        case 5:
          if (!(kind === "video")) {
            return [3 /*break*/, 7];
          }
          return [
            4 /*yield*/,
            requestWithDiag(function () {
              return api.sendVideo(chatId, file_1, mediaParams_1);
            }, "video").catch(function (err) {
              throw wrapChatNotFound(err);
            }),
          ];
        case 6:
          result = _s.sent();
          return [3 /*break*/, 14];
        case 7:
          if (!(kind === "audio")) {
            return [3 /*break*/, 12];
          }
          useVoice = (0, voice_js_1.resolveTelegramVoiceSend)({
            wantsVoice: opts.asVoice === true, // default false (backward compatible)
            contentType: media.contentType,
            fileName: fileName,
            logFallback: globals_js_1.logVerbose,
          }).useVoice;
          if (!useVoice) {
            return [3 /*break*/, 9];
          }
          return [
            4 /*yield*/,
            requestWithDiag(function () {
              return api.sendVoice(chatId, file_1, mediaParams_1);
            }, "voice").catch(function (err) {
              throw wrapChatNotFound(err);
            }),
          ];
        case 8:
          result = _s.sent();
          return [3 /*break*/, 11];
        case 9:
          return [
            4 /*yield*/,
            requestWithDiag(function () {
              return api.sendAudio(chatId, file_1, mediaParams_1);
            }, "audio").catch(function (err) {
              throw wrapChatNotFound(err);
            }),
          ];
        case 10:
          result = _s.sent();
          _s.label = 11;
        case 11:
          return [3 /*break*/, 14];
        case 12:
          return [
            4 /*yield*/,
            requestWithDiag(function () {
              return api.sendDocument(chatId, file_1, mediaParams_1);
            }, "document").catch(function (err) {
              throw wrapChatNotFound(err);
            }),
          ];
        case 13:
          result = _s.sent();
          _s.label = 14;
        case 14:
          mediaMessageId = String(
            (_k = result === null || result === void 0 ? void 0 : result.message_id) !== null &&
              _k !== void 0
              ? _k
              : "unknown",
          );
          resolvedChatId = String(
            (_m =
              (_l = result === null || result === void 0 ? void 0 : result.chat) === null ||
              _l === void 0
                ? void 0
                : _l.id) !== null && _m !== void 0
              ? _m
              : chatId,
          );
          if (result === null || result === void 0 ? void 0 : result.message_id) {
            (0, sent_message_cache_js_1.recordSentMessage)(chatId, result.message_id);
          }
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "telegram",
            accountId: account.accountId,
            direction: "outbound",
          });
          if (!(needsSeparateText && followUpText)) {
            return [3 /*break*/, 16];
          }
          textParams_1 =
            hasThreadParams || replyMarkup
              ? __assign(
                  __assign({}, threadParams),
                  replyMarkup ? { reply_markup: replyMarkup } : {},
                )
              : undefined;
          return [4 /*yield*/, sendTelegramText(followUpText, textParams_1)];
        case 15:
          textRes = _s.sent();
          // Return the text message ID as the "main" message (it's the actual content).
          return [
            2 /*return*/,
            {
              messageId: String(
                (_o = textRes === null || textRes === void 0 ? void 0 : textRes.message_id) !==
                  null && _o !== void 0
                  ? _o
                  : mediaMessageId,
              ),
              chatId: resolvedChatId,
            },
          ];
        case 16:
          return [2 /*return*/, { messageId: mediaMessageId, chatId: resolvedChatId }];
        case 17:
          if (!text || !text.trim()) {
            throw new Error("Message must be non-empty for Telegram sends");
          }
          textParams =
            hasThreadParams || replyMarkup
              ? __assign(
                  __assign({}, threadParams),
                  replyMarkup ? { reply_markup: replyMarkup } : {},
                )
              : undefined;
          return [4 /*yield*/, sendTelegramText(text, textParams, opts.plainText)];
        case 18:
          res = _s.sent();
          messageId = String(
            (_p = res === null || res === void 0 ? void 0 : res.message_id) !== null &&
              _p !== void 0
              ? _p
              : "unknown",
          );
          if (res === null || res === void 0 ? void 0 : res.message_id) {
            (0, sent_message_cache_js_1.recordSentMessage)(chatId, res.message_id);
          }
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "telegram",
            accountId: account.accountId,
            direction: "outbound",
          });
          return [
            2 /*return*/,
            {
              messageId: messageId,
              chatId: String(
                (_r =
                  (_q = res === null || res === void 0 ? void 0 : res.chat) === null ||
                  _q === void 0
                    ? void 0
                    : _q.id) !== null && _r !== void 0
                  ? _r
                  : chatId,
              ),
            },
          ];
      }
    });
  });
}
function reactMessageTelegram(chatIdInput_1, messageIdInput_1, emoji_1) {
  return __awaiter(this, arguments, void 0, function (chatIdInput, messageIdInput, emoji, opts) {
    var cfg,
      account,
      token,
      chatId,
      messageId,
      client,
      api,
      request,
      logHttpError,
      requestWithDiag,
      remove,
      trimmedEmoji,
      reactions;
    var _a;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveTelegramAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken(opts.token, account);
          chatId = normalizeChatId(String(chatIdInput));
          messageId = normalizeMessageId(messageIdInput);
          client = resolveTelegramClientOptions(account);
          api =
            (_a = opts.api) !== null && _a !== void 0
              ? _a
              : new grammy_1.Bot(token, client ? { client: client } : undefined).api;
          request = (0, retry_policy_js_1.createTelegramRetryRunner)({
            retry: opts.retry,
            configRetry: account.config.retry,
            verbose: opts.verbose,
            shouldRetry: function (err) {
              return (0, network_errors_js_1.isRecoverableTelegramNetworkError)(err, {
                context: "send",
              });
            },
          });
          logHttpError = createTelegramHttpLogger(cfg);
          requestWithDiag = function (fn, label) {
            return (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: label !== null && label !== void 0 ? label : "request",
              fn: function () {
                return request(fn, label);
              },
            }).catch(function (err) {
              logHttpError(label !== null && label !== void 0 ? label : "request", err);
              throw err;
            });
          };
          remove = opts.remove === true;
          trimmedEmoji = emoji.trim();
          reactions = remove || !trimmedEmoji ? [] : [{ type: "emoji", emoji: trimmedEmoji }];
          if (typeof api.setMessageReaction !== "function") {
            throw new Error("Telegram reactions are unavailable in this bot API.");
          }
          return [
            4 /*yield*/,
            requestWithDiag(function () {
              return api.setMessageReaction(chatId, messageId, reactions);
            }, "reaction"),
          ];
        case 1:
          _b.sent();
          return [2 /*return*/, { ok: true }];
      }
    });
  });
}
function deleteMessageTelegram(chatIdInput_1, messageIdInput_1) {
  return __awaiter(this, arguments, void 0, function (chatIdInput, messageIdInput, opts) {
    var cfg, account, token, chatId, messageId, client, api, request, logHttpError, requestWithDiag;
    var _a;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveTelegramAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken(opts.token, account);
          chatId = normalizeChatId(String(chatIdInput));
          messageId = normalizeMessageId(messageIdInput);
          client = resolveTelegramClientOptions(account);
          api =
            (_a = opts.api) !== null && _a !== void 0
              ? _a
              : new grammy_1.Bot(token, client ? { client: client } : undefined).api;
          request = (0, retry_policy_js_1.createTelegramRetryRunner)({
            retry: opts.retry,
            configRetry: account.config.retry,
            verbose: opts.verbose,
            shouldRetry: function (err) {
              return (0, network_errors_js_1.isRecoverableTelegramNetworkError)(err, {
                context: "send",
              });
            },
          });
          logHttpError = createTelegramHttpLogger(cfg);
          requestWithDiag = function (fn, label) {
            return (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: label !== null && label !== void 0 ? label : "request",
              fn: function () {
                return request(fn, label);
              },
            }).catch(function (err) {
              logHttpError(label !== null && label !== void 0 ? label : "request", err);
              throw err;
            });
          };
          return [
            4 /*yield*/,
            requestWithDiag(function () {
              return api.deleteMessage(chatId, messageId);
            }, "deleteMessage"),
          ];
        case 1:
          _b.sent();
          (0, globals_js_1.logVerbose)(
            "[telegram] Deleted message ".concat(messageId, " from chat ").concat(chatId),
          );
          return [2 /*return*/, { ok: true }];
      }
    });
  });
}
function editMessageTelegram(chatIdInput_1, messageIdInput_1, text_1) {
  return __awaiter(this, arguments, void 0, function (chatIdInput, messageIdInput, text, opts) {
    var cfg,
      account,
      token,
      chatId,
      messageId,
      client,
      api,
      request,
      logHttpError,
      requestWithDiag,
      textMode,
      tableMode,
      htmlText,
      shouldTouchButtons,
      builtKeyboard,
      replyMarkup,
      editParams;
    var _this = this;
    var _a, _b, _c;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          cfg = (_a = opts.cfg) !== null && _a !== void 0 ? _a : (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveTelegramAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken(opts.token, account);
          chatId = normalizeChatId(String(chatIdInput));
          messageId = normalizeMessageId(messageIdInput);
          client = resolveTelegramClientOptions(account);
          api =
            (_b = opts.api) !== null && _b !== void 0
              ? _b
              : new grammy_1.Bot(token, client ? { client: client } : undefined).api;
          request = (0, retry_policy_js_1.createTelegramRetryRunner)({
            retry: opts.retry,
            configRetry: account.config.retry,
            verbose: opts.verbose,
          });
          logHttpError = createTelegramHttpLogger(cfg);
          requestWithDiag = function (fn, label) {
            return (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: label !== null && label !== void 0 ? label : "request",
              fn: function () {
                return request(fn, label);
              },
            }).catch(function (err) {
              logHttpError(label !== null && label !== void 0 ? label : "request", err);
              throw err;
            });
          };
          textMode = (_c = opts.textMode) !== null && _c !== void 0 ? _c : "markdown";
          tableMode = (0, markdown_tables_js_1.resolveMarkdownTableMode)({
            cfg: cfg,
            channel: "telegram",
            accountId: account.accountId,
          });
          htmlText = (0, format_js_1.renderTelegramHtmlText)(text, {
            textMode: textMode,
            tableMode: tableMode,
          });
          shouldTouchButtons = opts.buttons !== undefined;
          builtKeyboard = shouldTouchButtons ? buildInlineKeyboard(opts.buttons) : undefined;
          replyMarkup = shouldTouchButtons
            ? builtKeyboard !== null && builtKeyboard !== void 0
              ? builtKeyboard
              : { inline_keyboard: [] }
            : undefined;
          editParams = {
            parse_mode: "HTML",
          };
          if (replyMarkup !== undefined) {
            editParams.reply_markup = replyMarkup;
          }
          return [
            4 /*yield*/,
            requestWithDiag(function () {
              return api.editMessageText(chatId, messageId, htmlText, editParams);
            }, "editMessage").catch(function (err) {
              return __awaiter(_this, void 0, void 0, function () {
                var errText, plainParams_2;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      errText = (0, errors_js_1.formatErrorMessage)(err);
                      if (!PARSE_ERR_RE.test(errText)) {
                        return [3 /*break*/, 2];
                      }
                      if (opts.verbose) {
                        console.warn(
                          "telegram HTML parse failed, retrying as plain text: ".concat(errText),
                        );
                      }
                      plainParams_2 = {};
                      if (replyMarkup !== undefined) {
                        plainParams_2.reply_markup = replyMarkup;
                      }
                      return [
                        4 /*yield*/,
                        requestWithDiag(function () {
                          return Object.keys(plainParams_2).length > 0
                            ? api.editMessageText(chatId, messageId, text, plainParams_2)
                            : api.editMessageText(chatId, messageId, text);
                        }, "editMessage-plain"),
                      ];
                    case 1:
                      return [2 /*return*/, _a.sent()];
                    case 2:
                      throw err;
                  }
                });
              });
            }),
          ];
        case 1:
          _d.sent();
          (0, globals_js_1.logVerbose)(
            "[telegram] Edited message ".concat(messageId, " in chat ").concat(chatId),
          );
          return [2 /*return*/, { ok: true, messageId: String(messageId), chatId: chatId }];
      }
    });
  });
}
function inferFilename(kind) {
  switch (kind) {
    case "image":
      return "image.jpg";
    case "video":
      return "video.mp4";
    case "audio":
      return "audio.ogg";
    default:
      return "file.bin";
  }
}
/**
 * Send a sticker to a Telegram chat by file_id.
 * @param to - Chat ID or username (e.g., "123456789" or "@username")
 * @param fileId - Telegram file_id of the sticker to send
 * @param opts - Optional configuration
 */
function sendStickerTelegram(to_1, fileId_1) {
  return __awaiter(this, arguments, void 0, function (to, fileId, opts) {
    var cfg,
      account,
      token,
      target,
      chatId,
      client,
      api,
      messageThreadId,
      threadIdParams,
      threadParams,
      hasThreadParams,
      request,
      logHttpError,
      requestWithDiag,
      wrapChatNotFound,
      stickerParams,
      result,
      messageId,
      resolvedChatId;
    var _a, _b, _c, _d;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          if (!(fileId === null || fileId === void 0 ? void 0 : fileId.trim())) {
            throw new Error("Telegram sticker file_id is required");
          }
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveTelegramAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken(opts.token, account);
          target = (0, targets_js_1.parseTelegramTarget)(to);
          chatId = normalizeChatId(target.chatId);
          client = resolveTelegramClientOptions(account);
          api =
            (_a = opts.api) !== null && _a !== void 0
              ? _a
              : new grammy_1.Bot(token, client ? { client: client } : undefined).api;
          messageThreadId =
            opts.messageThreadId != null ? opts.messageThreadId : target.messageThreadId;
          threadIdParams = (0, helpers_js_1.buildTelegramThreadParams)(messageThreadId);
          threadParams = threadIdParams ? __assign({}, threadIdParams) : {};
          if (opts.replyToMessageId != null) {
            threadParams.reply_to_message_id = Math.trunc(opts.replyToMessageId);
          }
          hasThreadParams = Object.keys(threadParams).length > 0;
          request = (0, retry_policy_js_1.createTelegramRetryRunner)({
            retry: opts.retry,
            configRetry: account.config.retry,
            verbose: opts.verbose,
          });
          logHttpError = createTelegramHttpLogger(cfg);
          requestWithDiag = function (fn, label) {
            return request(fn, label).catch(function (err) {
              logHttpError(label !== null && label !== void 0 ? label : "request", err);
              throw err;
            });
          };
          wrapChatNotFound = function (err) {
            if (
              !/400: Bad Request: chat not found/i.test((0, errors_js_1.formatErrorMessage)(err))
            ) {
              return err;
            }
            return new Error(
              [
                "Telegram send failed: chat not found (chat_id=".concat(chatId, ")."),
                "Likely: bot not started in DM, bot removed from group/channel, group migrated (new -100… id), or wrong bot token.",
                "Input was: ".concat(JSON.stringify(to), "."),
              ].join(" "),
            );
          };
          stickerParams = hasThreadParams ? threadParams : undefined;
          return [
            4 /*yield*/,
            requestWithDiag(function () {
              return api.sendSticker(chatId, fileId.trim(), stickerParams);
            }, "sticker").catch(function (err) {
              throw wrapChatNotFound(err);
            }),
          ];
        case 1:
          result = _e.sent();
          messageId = String(
            (_b = result === null || result === void 0 ? void 0 : result.message_id) !== null &&
              _b !== void 0
              ? _b
              : "unknown",
          );
          resolvedChatId = String(
            (_d =
              (_c = result === null || result === void 0 ? void 0 : result.chat) === null ||
              _c === void 0
                ? void 0
                : _c.id) !== null && _d !== void 0
              ? _d
              : chatId,
          );
          if (result === null || result === void 0 ? void 0 : result.message_id) {
            (0, sent_message_cache_js_1.recordSentMessage)(chatId, result.message_id);
          }
          (0, channel_activity_js_1.recordChannelActivity)({
            channel: "telegram",
            accountId: account.accountId,
            direction: "outbound",
          });
          return [2 /*return*/, { messageId: messageId, chatId: resolvedChatId }];
      }
    });
  });
}
