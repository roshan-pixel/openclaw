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
exports.deliverReplies = deliverReplies;
exports.resolveMedia = resolveMedia;
var grammy_1 = require("grammy");
var format_js_1 = require("../format.js");
var api_logging_js_1 = require("../api-logging.js");
var chunk_js_1 = require("../../auto-reply/chunk.js");
var caption_js_1 = require("../caption.js");
var globals_js_1 = require("../../globals.js");
var errors_js_1 = require("../../infra/errors.js");
var constants_js_1 = require("../../media/constants.js");
var fetch_js_1 = require("../../media/fetch.js");
var mime_js_1 = require("../../media/mime.js");
var store_js_1 = require("../../media/store.js");
var media_js_1 = require("../../web/media.js");
var send_js_1 = require("../send.js");
var voice_js_1 = require("../voice.js");
var helpers_js_1 = require("./helpers.js");
var sticker_cache_js_1 = require("../sticker-cache.js");
var PARSE_ERR_RE = /can't parse entities|parse entities|find end of the entity/i;
var VOICE_FORBIDDEN_RE = /VOICE_MESSAGES_FORBIDDEN/;
function deliverReplies(params) {
  return __awaiter(this, void 0, void 0, function () {
    var replies,
      chatId,
      runtime,
      bot,
      replyToMode,
      textLimit,
      messageThreadId,
      linkPreview,
      replyQuoteText,
      chunkMode,
      hasReplied,
      hasDelivered,
      markDelivered,
      chunkText,
      _i,
      replies_1,
      reply,
      hasMedia,
      replyToId,
      mediaList,
      telegramData,
      replyMarkup,
      chunks,
      i,
      chunk,
      shouldAttachButtons,
      first,
      pendingFollowUpText,
      _loop_1,
      _a,
      mediaList_1,
      mediaUrl;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
      switch (_m.label) {
        case 0:
          ((replies = params.replies),
            (chatId = params.chatId),
            (runtime = params.runtime),
            (bot = params.bot),
            (replyToMode = params.replyToMode),
            (textLimit = params.textLimit),
            (messageThreadId = params.messageThreadId),
            (linkPreview = params.linkPreview),
            (replyQuoteText = params.replyQuoteText));
          chunkMode = (_b = params.chunkMode) !== null && _b !== void 0 ? _b : "length";
          hasReplied = false;
          hasDelivered = false;
          markDelivered = function () {
            hasDelivered = true;
          };
          chunkText = function (markdown) {
            var markdownChunks =
              chunkMode === "newline"
                ? (0, chunk_js_1.chunkMarkdownTextWithMode)(markdown, textLimit, chunkMode)
                : [markdown];
            var chunks = [];
            for (
              var _i = 0, markdownChunks_1 = markdownChunks;
              _i < markdownChunks_1.length;
              _i++
            ) {
              var chunk = markdownChunks_1[_i];
              var nested = (0, format_js_1.markdownToTelegramChunks)(chunk, textLimit, {
                tableMode: params.tableMode,
              });
              if (!nested.length && chunk) {
                chunks.push({
                  html: (0, format_js_1.markdownToTelegramHtml)(chunk, {
                    tableMode: params.tableMode,
                  }),
                  text: chunk,
                });
                continue;
              }
              chunks.push.apply(chunks, nested);
            }
            return chunks;
          };
          ((_i = 0), (replies_1 = replies));
          _m.label = 1;
        case 1:
          if (!(_i < replies_1.length)) {
            return [3 /*break*/, 11];
          }
          reply = replies_1[_i];
          hasMedia =
            Boolean(reply === null || reply === void 0 ? void 0 : reply.mediaUrl) ||
            ((_d =
              (_c = reply === null || reply === void 0 ? void 0 : reply.mediaUrls) === null ||
              _c === void 0
                ? void 0
                : _c.length) !== null && _d !== void 0
              ? _d
              : 0) > 0;
          if (!(reply === null || reply === void 0 ? void 0 : reply.text) && !hasMedia) {
            if (reply === null || reply === void 0 ? void 0 : reply.audioAsVoice) {
              (0, globals_js_1.logVerbose)(
                "telegram reply has audioAsVoice without media/text; skipping",
              );
              return [3 /*break*/, 10];
            }
            (_e = runtime.error) === null || _e === void 0
              ? void 0
              : _e.call(runtime, (0, globals_js_1.danger)("reply missing text/media"));
            return [3 /*break*/, 10];
          }
          replyToId =
            replyToMode === "off"
              ? undefined
              : (0, helpers_js_1.resolveTelegramReplyId)(reply.replyToId);
          mediaList = ((_f = reply.mediaUrls) === null || _f === void 0 ? void 0 : _f.length)
            ? reply.mediaUrls
            : reply.mediaUrl
              ? [reply.mediaUrl]
              : [];
          telegramData = (_g = reply.channelData) === null || _g === void 0 ? void 0 : _g.telegram;
          replyMarkup = (0, send_js_1.buildInlineKeyboard)(
            telegramData === null || telegramData === void 0 ? void 0 : telegramData.buttons,
          );
          if (!(mediaList.length === 0)) {
            return [3 /*break*/, 6];
          }
          chunks = chunkText(reply.text || "");
          i = 0;
          _m.label = 2;
        case 2:
          if (!(i < chunks.length)) {
            return [3 /*break*/, 5];
          }
          chunk = chunks[i];
          if (!chunk) {
            return [3 /*break*/, 4];
          }
          shouldAttachButtons = i === 0 && replyMarkup;
          return [
            4 /*yield*/,
            sendTelegramText(bot, chatId, chunk.html, runtime, {
              replyToMessageId:
                replyToId && (replyToMode === "all" || !hasReplied) ? replyToId : undefined,
              replyQuoteText: replyQuoteText,
              messageThreadId: messageThreadId,
              textMode: "html",
              plainText: chunk.text,
              linkPreview: linkPreview,
              replyMarkup: shouldAttachButtons ? replyMarkup : undefined,
            }),
          ];
        case 3:
          _m.sent();
          markDelivered();
          if (replyToId && !hasReplied) {
            hasReplied = true;
          }
          _m.label = 4;
        case 4:
          i += 1;
          return [3 /*break*/, 2];
        case 5:
          return [3 /*break*/, 10];
        case 6:
          first = true;
          pendingFollowUpText = void 0;
          _loop_1 = function (mediaUrl) {
            var isFirstMedia,
              media,
              kind,
              isGif,
              fileName,
              file,
              _o,
              caption,
              followUpText,
              htmlCaption,
              replyToMessageId,
              shouldAttachButtonsToMedia,
              mediaParams,
              useVoice,
              voiceErr_1,
              fallbackText,
              chunks,
              i,
              chunk,
              replyToMessageIdFollowup;
            return __generator(this, function (_p) {
              switch (_p.label) {
                case 0:
                  isFirstMedia = first;
                  return [4 /*yield*/, (0, media_js_1.loadWebMedia)(mediaUrl)];
                case 1:
                  media = _p.sent();
                  kind = (0, constants_js_1.mediaKindFromMime)(
                    (_h = media.contentType) !== null && _h !== void 0 ? _h : undefined,
                  );
                  isGif = (0, mime_js_1.isGifMedia)({
                    contentType: media.contentType,
                    fileName: media.fileName,
                  });
                  fileName =
                    (_j = media.fileName) !== null && _j !== void 0
                      ? _j
                      : isGif
                        ? "animation.gif"
                        : "file";
                  file = new grammy_1.InputFile(media.buffer, fileName);
                  ((_o = (0, caption_js_1.splitTelegramCaption)(
                    isFirstMedia
                      ? (_k = reply.text) !== null && _k !== void 0
                        ? _k
                        : undefined
                      : undefined,
                  )),
                    (caption = _o.caption),
                    (followUpText = _o.followUpText));
                  htmlCaption = caption
                    ? (0, format_js_1.renderTelegramHtmlText)(caption, {
                        tableMode: params.tableMode,
                      })
                    : undefined;
                  if (followUpText) {
                    pendingFollowUpText = followUpText;
                  }
                  first = false;
                  replyToMessageId =
                    replyToId && (replyToMode === "all" || !hasReplied) ? replyToId : undefined;
                  shouldAttachButtonsToMedia = isFirstMedia && replyMarkup && !followUpText;
                  mediaParams = __assign(
                    __assign(
                      __assign({ caption: htmlCaption }, htmlCaption ? { parse_mode: "HTML" } : {}),
                      shouldAttachButtonsToMedia ? { reply_markup: replyMarkup } : {},
                    ),
                    buildTelegramSendParams({
                      replyToMessageId: replyToMessageId,
                      messageThreadId: messageThreadId,
                      replyQuoteText: replyQuoteText,
                    }),
                  );
                  if (!isGif) {
                    return [3 /*break*/, 3];
                  }
                  return [
                    4 /*yield*/,
                    (0, api_logging_js_1.withTelegramApiErrorLogging)({
                      operation: "sendAnimation",
                      runtime: runtime,
                      fn: function () {
                        return bot.api.sendAnimation(chatId, file, __assign({}, mediaParams));
                      },
                    }),
                  ];
                case 2:
                  _p.sent();
                  markDelivered();
                  return [3 /*break*/, 20];
                case 3:
                  if (!(kind === "image")) {
                    return [3 /*break*/, 5];
                  }
                  return [
                    4 /*yield*/,
                    (0, api_logging_js_1.withTelegramApiErrorLogging)({
                      operation: "sendPhoto",
                      runtime: runtime,
                      fn: function () {
                        return bot.api.sendPhoto(chatId, file, __assign({}, mediaParams));
                      },
                    }),
                  ];
                case 4:
                  _p.sent();
                  markDelivered();
                  return [3 /*break*/, 20];
                case 5:
                  if (!(kind === "video")) {
                    return [3 /*break*/, 7];
                  }
                  return [
                    4 /*yield*/,
                    (0, api_logging_js_1.withTelegramApiErrorLogging)({
                      operation: "sendVideo",
                      runtime: runtime,
                      fn: function () {
                        return bot.api.sendVideo(chatId, file, __assign({}, mediaParams));
                      },
                    }),
                  ];
                case 6:
                  _p.sent();
                  markDelivered();
                  return [3 /*break*/, 20];
                case 7:
                  if (!(kind === "audio")) {
                    return [3 /*break*/, 18];
                  }
                  useVoice = (0, voice_js_1.resolveTelegramVoiceSend)({
                    wantsVoice: reply.audioAsVoice === true, // default false (backward compatible)
                    contentType: media.contentType,
                    fileName: fileName,
                    logFallback: globals_js_1.logVerbose,
                  }).useVoice;
                  if (!useVoice) {
                    return [3 /*break*/, 15];
                  }
                  // Voice message - displays as round playable bubble (opt-in via [[audio_as_voice]])
                  // Switch typing indicator to record_voice before sending.
                  return [
                    4 /*yield*/,
                    (_l = params.onVoiceRecording) === null || _l === void 0
                      ? void 0
                      : _l.call(params),
                  ];
                case 8:
                  // Voice message - displays as round playable bubble (opt-in via [[audio_as_voice]])
                  // Switch typing indicator to record_voice before sending.
                  _p.sent();
                  _p.label = 9;
                case 9:
                  _p.trys.push([9, 11, , 14]);
                  return [
                    4 /*yield*/,
                    (0, api_logging_js_1.withTelegramApiErrorLogging)({
                      operation: "sendVoice",
                      runtime: runtime,
                      shouldLog: function (err) {
                        return !isVoiceMessagesForbidden(err);
                      },
                      fn: function () {
                        return bot.api.sendVoice(chatId, file, __assign({}, mediaParams));
                      },
                    }),
                  ];
                case 10:
                  _p.sent();
                  markDelivered();
                  return [3 /*break*/, 14];
                case 11:
                  voiceErr_1 = _p.sent();
                  if (!isVoiceMessagesForbidden(voiceErr_1)) {
                    return [3 /*break*/, 13];
                  }
                  fallbackText = reply.text;
                  if (!fallbackText || !fallbackText.trim()) {
                    throw voiceErr_1;
                  }
                  (0, globals_js_1.logVerbose)(
                    "telegram sendVoice forbidden (recipient has voice messages blocked in privacy settings); falling back to text",
                  );
                  return [
                    4 /*yield*/,
                    sendTelegramVoiceFallbackText({
                      bot: bot,
                      chatId: chatId,
                      runtime: runtime,
                      text: fallbackText,
                      chunkText: chunkText,
                      replyToId: replyToId,
                      replyToMode: replyToMode,
                      hasReplied: hasReplied,
                      messageThreadId: messageThreadId,
                      linkPreview: linkPreview,
                      replyMarkup: replyMarkup,
                      replyQuoteText: replyQuoteText,
                    }),
                  ];
                case 12:
                  hasReplied = _p.sent();
                  markDelivered();
                  return [2 /*return*/, "continue"];
                case 13:
                  throw voiceErr_1;
                case 14:
                  return [3 /*break*/, 17];
                case 15:
                  // Audio file - displays with metadata (title, duration) - DEFAULT
                  return [
                    4 /*yield*/,
                    (0, api_logging_js_1.withTelegramApiErrorLogging)({
                      operation: "sendAudio",
                      runtime: runtime,
                      fn: function () {
                        return bot.api.sendAudio(chatId, file, __assign({}, mediaParams));
                      },
                    }),
                  ];
                case 16:
                  // Audio file - displays with metadata (title, duration) - DEFAULT
                  _p.sent();
                  markDelivered();
                  _p.label = 17;
                case 17:
                  return [3 /*break*/, 20];
                case 18:
                  return [
                    4 /*yield*/,
                    (0, api_logging_js_1.withTelegramApiErrorLogging)({
                      operation: "sendDocument",
                      runtime: runtime,
                      fn: function () {
                        return bot.api.sendDocument(chatId, file, __assign({}, mediaParams));
                      },
                    }),
                  ];
                case 19:
                  _p.sent();
                  markDelivered();
                  _p.label = 20;
                case 20:
                  if (replyToId && !hasReplied) {
                    hasReplied = true;
                  }
                  if (!(pendingFollowUpText && isFirstMedia)) {
                    return [3 /*break*/, 25];
                  }
                  chunks = chunkText(pendingFollowUpText);
                  i = 0;
                  _p.label = 21;
                case 21:
                  if (!(i < chunks.length)) {
                    return [3 /*break*/, 24];
                  }
                  chunk = chunks[i];
                  replyToMessageIdFollowup =
                    replyToId && (replyToMode === "all" || !hasReplied) ? replyToId : undefined;
                  return [
                    4 /*yield*/,
                    sendTelegramText(bot, chatId, chunk.html, runtime, {
                      replyToMessageId: replyToMessageIdFollowup,
                      messageThreadId: messageThreadId,
                      textMode: "html",
                      plainText: chunk.text,
                      linkPreview: linkPreview,
                      replyMarkup: i === 0 ? replyMarkup : undefined,
                    }),
                  ];
                case 22:
                  _p.sent();
                  markDelivered();
                  if (replyToId && !hasReplied) {
                    hasReplied = true;
                  }
                  _p.label = 23;
                case 23:
                  i += 1;
                  return [3 /*break*/, 21];
                case 24:
                  pendingFollowUpText = undefined;
                  _p.label = 25;
                case 25:
                  return [2 /*return*/];
              }
            });
          };
          ((_a = 0), (mediaList_1 = mediaList));
          _m.label = 7;
        case 7:
          if (!(_a < mediaList_1.length)) {
            return [3 /*break*/, 10];
          }
          mediaUrl = mediaList_1[_a];
          return [5 /*yield**/, _loop_1(mediaUrl)];
        case 8:
          _m.sent();
          _m.label = 9;
        case 9:
          _a++;
          return [3 /*break*/, 7];
        case 10:
          _i++;
          return [3 /*break*/, 1];
        case 11:
          return [2 /*return*/, { delivered: hasDelivered }];
      }
    });
  });
}
function resolveMedia(ctx, maxBytes, token, proxyFetch) {
  return __awaiter(this, void 0, void 0, function () {
    var msg,
      sticker,
      file_1,
      fetchImpl_1,
      url_1,
      fetched_1,
      originalName_1,
      saved_1,
      cached,
      fileId,
      emoji,
      setName,
      err_1,
      m,
      file,
      fetchImpl,
      url,
      fetched,
      originalName,
      saved,
      placeholder;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
    return __generator(this, function (_p) {
      switch (_p.label) {
        case 0:
          msg = ctx.message;
          if (!msg.sticker) {
            return [3 /*break*/, 6];
          }
          sticker = msg.sticker;
          // Skip animated (TGS) and video (WEBM) stickers - only static WEBP supported
          if (sticker.is_animated || sticker.is_video) {
            (0, globals_js_1.logVerbose)(
              "telegram: skipping animated/video sticker (only static stickers supported)",
            );
            return [2 /*return*/, null];
          }
          if (!sticker.file_id) {
            return [2 /*return*/, null];
          }
          _p.label = 1;
        case 1:
          _p.trys.push([1, 5, , 6]);
          return [4 /*yield*/, ctx.getFile()];
        case 2:
          file_1 = _p.sent();
          if (!file_1.file_path) {
            (0, globals_js_1.logVerbose)("telegram: getFile returned no file_path for sticker");
            return [2 /*return*/, null];
          }
          fetchImpl_1 =
            proxyFetch !== null && proxyFetch !== void 0 ? proxyFetch : globalThis.fetch;
          if (!fetchImpl_1) {
            (0, globals_js_1.logVerbose)("telegram: fetch not available for sticker download");
            return [2 /*return*/, null];
          }
          url_1 = "https://api.telegram.org/file/bot".concat(token, "/").concat(file_1.file_path);
          return [
            4 /*yield*/,
            (0, fetch_js_1.fetchRemoteMedia)({
              url: url_1,
              fetchImpl: fetchImpl_1,
              filePathHint: file_1.file_path,
            }),
          ];
        case 3:
          fetched_1 = _p.sent();
          originalName_1 =
            (_a = fetched_1.fileName) !== null && _a !== void 0 ? _a : file_1.file_path;
          return [
            4 /*yield*/,
            (0, store_js_1.saveMediaBuffer)(
              fetched_1.buffer,
              fetched_1.contentType,
              "inbound",
              maxBytes,
              originalName_1,
            ),
          ];
        case 4:
          saved_1 = _p.sent();
          cached = sticker.file_unique_id
            ? (0, sticker_cache_js_1.getCachedSticker)(sticker.file_unique_id)
            : null;
          if (cached) {
            (0, globals_js_1.logVerbose)(
              "telegram: sticker cache hit for ".concat(sticker.file_unique_id),
            );
            fileId = (_b = sticker.file_id) !== null && _b !== void 0 ? _b : cached.fileId;
            emoji = (_c = sticker.emoji) !== null && _c !== void 0 ? _c : cached.emoji;
            setName = (_d = sticker.set_name) !== null && _d !== void 0 ? _d : cached.setName;
            if (fileId !== cached.fileId || emoji !== cached.emoji || setName !== cached.setName) {
              // Refresh cached sticker metadata on hits so sends/searches use latest file_id.
              (0, sticker_cache_js_1.cacheSticker)(
                __assign(__assign({}, cached), { fileId: fileId, emoji: emoji, setName: setName }),
              );
            }
            return [
              2 /*return*/,
              {
                path: saved_1.path,
                contentType: saved_1.contentType,
                placeholder: "<media:sticker>",
                stickerMetadata: {
                  emoji: emoji,
                  setName: setName,
                  fileId: fileId,
                  fileUniqueId: sticker.file_unique_id,
                  cachedDescription: cached.description,
                },
              },
            ];
          }
          // Cache miss - return metadata for vision processing
          return [
            2 /*return*/,
            {
              path: saved_1.path,
              contentType: saved_1.contentType,
              placeholder: "<media:sticker>",
              stickerMetadata: {
                emoji: (_e = sticker.emoji) !== null && _e !== void 0 ? _e : undefined,
                setName: (_f = sticker.set_name) !== null && _f !== void 0 ? _f : undefined,
                fileId: sticker.file_id,
                fileUniqueId: sticker.file_unique_id,
              },
            },
          ];
        case 5:
          err_1 = _p.sent();
          (0, globals_js_1.logVerbose)(
            "telegram: failed to process sticker: ".concat(String(err_1)),
          );
          return [2 /*return*/, null];
        case 6:
          m =
            (_m =
              (_l =
                (_k =
                  (_j =
                    (_h =
                      (_g = msg.photo) === null || _g === void 0
                        ? void 0
                        : _g[msg.photo.length - 1]) !== null && _h !== void 0
                      ? _h
                      : msg.video) !== null && _j !== void 0
                    ? _j
                    : msg.video_note) !== null && _k !== void 0
                  ? _k
                  : msg.document) !== null && _l !== void 0
                ? _l
                : msg.audio) !== null && _m !== void 0
              ? _m
              : msg.voice;
          if (!(m === null || m === void 0 ? void 0 : m.file_id)) {
            return [2 /*return*/, null];
          }
          return [4 /*yield*/, ctx.getFile()];
        case 7:
          file = _p.sent();
          if (!file.file_path) {
            throw new Error("Telegram getFile returned no file_path");
          }
          fetchImpl = proxyFetch !== null && proxyFetch !== void 0 ? proxyFetch : globalThis.fetch;
          if (!fetchImpl) {
            throw new Error("fetch is not available; set channels.telegram.proxy in config");
          }
          url = "https://api.telegram.org/file/bot".concat(token, "/").concat(file.file_path);
          return [
            4 /*yield*/,
            (0, fetch_js_1.fetchRemoteMedia)({
              url: url,
              fetchImpl: fetchImpl,
              filePathHint: file.file_path,
            }),
          ];
        case 8:
          fetched = _p.sent();
          originalName = (_o = fetched.fileName) !== null && _o !== void 0 ? _o : file.file_path;
          return [
            4 /*yield*/,
            (0, store_js_1.saveMediaBuffer)(
              fetched.buffer,
              fetched.contentType,
              "inbound",
              maxBytes,
              originalName,
            ),
          ];
        case 9:
          saved = _p.sent();
          placeholder = "<media:document>";
          if (msg.photo) {
            placeholder = "<media:image>";
          } else if (msg.video) {
            placeholder = "<media:video>";
          } else if (msg.video_note) {
            placeholder = "<media:video>";
          } else if (msg.audio || msg.voice) {
            placeholder = "<media:audio>";
          }
          return [
            2 /*return*/,
            { path: saved.path, contentType: saved.contentType, placeholder: placeholder },
          ];
      }
    });
  });
}
function isVoiceMessagesForbidden(err) {
  if (err instanceof grammy_1.GrammyError) {
    return VOICE_FORBIDDEN_RE.test(err.description);
  }
  return VOICE_FORBIDDEN_RE.test((0, errors_js_1.formatErrorMessage)(err));
}
function sendTelegramVoiceFallbackText(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var chunks, hasReplied, i, chunk;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          chunks = opts.chunkText(opts.text);
          hasReplied = opts.hasReplied;
          i = 0;
          _a.label = 1;
        case 1:
          if (!(i < chunks.length)) {
            return [3 /*break*/, 4];
          }
          chunk = chunks[i];
          return [
            4 /*yield*/,
            sendTelegramText(opts.bot, opts.chatId, chunk.html, opts.runtime, {
              replyToMessageId:
                opts.replyToId && (opts.replyToMode === "all" || !hasReplied)
                  ? opts.replyToId
                  : undefined,
              replyQuoteText: opts.replyQuoteText,
              messageThreadId: opts.messageThreadId,
              textMode: "html",
              plainText: chunk.text,
              linkPreview: opts.linkPreview,
              replyMarkup: i === 0 ? opts.replyMarkup : undefined,
            }),
          ];
        case 2:
          _a.sent();
          if (opts.replyToId && !hasReplied) {
            hasReplied = true;
          }
          _a.label = 3;
        case 3:
          i += 1;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/, hasReplied];
      }
    });
  });
}
function buildTelegramSendParams(opts) {
  var _a;
  var threadParams = (0, helpers_js_1.buildTelegramThreadParams)(
    opts === null || opts === void 0 ? void 0 : opts.messageThreadId,
  );
  var params = {};
  var quoteText =
    (_a = opts === null || opts === void 0 ? void 0 : opts.replyQuoteText) === null || _a === void 0
      ? void 0
      : _a.trim();
  if (opts === null || opts === void 0 ? void 0 : opts.replyToMessageId) {
    if (quoteText) {
      params.reply_parameters = {
        message_id: Math.trunc(opts.replyToMessageId),
        quote: quoteText,
      };
    } else {
      params.reply_to_message_id = opts.replyToMessageId;
    }
  }
  if (threadParams) {
    params.message_thread_id = threadParams.message_thread_id;
  }
  return params;
}
function sendTelegramText(bot, chatId, text, runtime, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var baseParams,
      linkPreviewEnabled,
      linkPreviewOptions,
      textMode,
      htmlText,
      res,
      err_2,
      errText,
      fallbackText_1,
      res;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          baseParams = buildTelegramSendParams({
            replyToMessageId: opts === null || opts === void 0 ? void 0 : opts.replyToMessageId,
            replyQuoteText: opts === null || opts === void 0 ? void 0 : opts.replyQuoteText,
            messageThreadId: opts === null || opts === void 0 ? void 0 : opts.messageThreadId,
          });
          linkPreviewEnabled =
            (_a = opts === null || opts === void 0 ? void 0 : opts.linkPreview) !== null &&
            _a !== void 0
              ? _a
              : true;
          linkPreviewOptions = linkPreviewEnabled ? undefined : { is_disabled: true };
          textMode =
            (_b = opts === null || opts === void 0 ? void 0 : opts.textMode) !== null &&
            _b !== void 0
              ? _b
              : "markdown";
          htmlText = textMode === "html" ? text : (0, format_js_1.markdownToTelegramHtml)(text);
          _e.label = 1;
        case 1:
          _e.trys.push([1, 3, , 6]);
          return [
            4 /*yield*/,
            (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: "sendMessage",
              runtime: runtime,
              shouldLog: function (err) {
                return !PARSE_ERR_RE.test((0, errors_js_1.formatErrorMessage)(err));
              },
              fn: function () {
                return bot.api.sendMessage(
                  chatId,
                  htmlText,
                  __assign(
                    __assign(
                      __assign(
                        { parse_mode: "HTML" },
                        linkPreviewOptions ? { link_preview_options: linkPreviewOptions } : {},
                      ),
                      (opts === null || opts === void 0 ? void 0 : opts.replyMarkup)
                        ? { reply_markup: opts.replyMarkup }
                        : {},
                    ),
                    baseParams,
                  ),
                );
              },
            }),
          ];
        case 2:
          res = _e.sent();
          return [2 /*return*/, res.message_id];
        case 3:
          err_2 = _e.sent();
          errText = (0, errors_js_1.formatErrorMessage)(err_2);
          if (!PARSE_ERR_RE.test(errText)) {
            return [3 /*break*/, 5];
          }
          (_c = runtime.log) === null || _c === void 0
            ? void 0
            : _c.call(
                runtime,
                "telegram HTML parse failed; retrying without formatting: ".concat(errText),
              );
          fallbackText_1 =
            (_d = opts === null || opts === void 0 ? void 0 : opts.plainText) !== null &&
            _d !== void 0
              ? _d
              : text;
          return [
            4 /*yield*/,
            (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: "sendMessage",
              runtime: runtime,
              fn: function () {
                return bot.api.sendMessage(
                  chatId,
                  fallbackText_1,
                  __assign(
                    __assign(
                      __assign(
                        {},
                        linkPreviewOptions ? { link_preview_options: linkPreviewOptions } : {},
                      ),
                      (opts === null || opts === void 0 ? void 0 : opts.replyMarkup)
                        ? { reply_markup: opts.replyMarkup }
                        : {},
                    ),
                    baseParams,
                  ),
                );
              },
            }),
          ];
        case 4:
          res = _e.sent();
          return [2 /*return*/, res.message_id];
        case 5:
          throw err_2;
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
