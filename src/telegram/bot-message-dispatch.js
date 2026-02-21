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
exports.dispatchTelegramMessage = void 0;
// @ts-nocheck
var pi_embedded_block_chunker_js_1 = require("../agents/pi-embedded-block-chunker.js");
var model_catalog_js_1 = require("../agents/model-catalog.js");
var model_selection_js_1 = require("../agents/model-selection.js");
var chunk_js_1 = require("../auto-reply/chunk.js");
var history_js_1 = require("../auto-reply/reply/history.js");
var provider_dispatcher_js_1 = require("../auto-reply/reply/provider-dispatcher.js");
var ack_reactions_js_1 = require("../channels/ack-reactions.js");
var logging_js_1 = require("../channels/logging.js");
var reply_prefix_js_1 = require("../channels/reply-prefix.js");
var typing_js_1 = require("../channels/typing.js");
var globals_js_1 = require("../globals.js");
var markdown_tables_js_1 = require("../config/markdown-tables.js");
var delivery_js_1 = require("./bot/delivery.js");
var draft_chunking_js_1 = require("./draft-chunking.js");
var draft_stream_js_1 = require("./draft-stream.js");
var sticker_cache_js_1 = require("./sticker-cache.js");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var EMPTY_RESPONSE_FALLBACK = "No response generated. Please try again.";
function resolveStickerVisionSupport(cfg, agentId) {
  return __awaiter(this, void 0, void 0, function () {
    var catalog, defaultModel, entry, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [4 /*yield*/, (0, model_catalog_js_1.loadModelCatalog)({ config: cfg })];
        case 1:
          catalog = _b.sent();
          defaultModel = (0, model_selection_js_1.resolveDefaultModelForAgent)({
            cfg: cfg,
            agentId: agentId,
          });
          entry = (0, model_catalog_js_1.findModelInCatalog)(
            catalog,
            defaultModel.provider,
            defaultModel.model,
          );
          if (!entry) {
            return [2 /*return*/, false];
          }
          return [2 /*return*/, (0, model_catalog_js_1.modelSupportsVision)(entry)];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, false];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
var dispatchTelegramMessage = function (_a) {
  return __awaiter(void 0, [_a], void 0, function (_b) {
    var ctxPayload,
      primaryCtx,
      msg,
      chatId,
      isGroup,
      resolvedThreadId,
      historyKey,
      historyLimit,
      groupHistories,
      route,
      skillFilter,
      sendTyping,
      sendRecordVoice,
      ackReactionPromise,
      reactionApi,
      removeAckAfterReply,
      isPrivateChat,
      draftMaxChars,
      canStreamDraft,
      _c,
      draftStream,
      draftChunking,
      draftChunker,
      lastPartialText,
      draftText,
      updateDraftFromPartial,
      flushDraft,
      disableBlockStreaming,
      prefixContext,
      tableMode,
      chunkMode,
      sticker,
      agentDir,
      stickerSupportsVision,
      description,
      stickerContext,
      formattedDesc,
      replyQuoteText,
      deliveryState,
      queuedFinal,
      sentFallback,
      result,
      hasFinalResponse;
    var _d;
    var context = _b.context,
      bot = _b.bot,
      cfg = _b.cfg,
      runtime = _b.runtime,
      replyToMode = _b.replyToMode,
      streamMode = _b.streamMode,
      textLimit = _b.textLimit,
      telegramCfg = _b.telegramCfg,
      opts = _b.opts,
      resolveBotTopicsEnabled = _b.resolveBotTopicsEnabled;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          ((ctxPayload = context.ctxPayload),
            (primaryCtx = context.primaryCtx),
            (msg = context.msg),
            (chatId = context.chatId),
            (isGroup = context.isGroup),
            (resolvedThreadId = context.resolvedThreadId),
            (historyKey = context.historyKey),
            (historyLimit = context.historyLimit),
            (groupHistories = context.groupHistories),
            (route = context.route),
            (skillFilter = context.skillFilter),
            (sendTyping = context.sendTyping),
            (sendRecordVoice = context.sendRecordVoice),
            (ackReactionPromise = context.ackReactionPromise),
            (reactionApi = context.reactionApi),
            (removeAckAfterReply = context.removeAckAfterReply));
          isPrivateChat = msg.chat.type === "private";
          draftMaxChars = Math.min(textLimit, 4096);
          _c = streamMode !== "off" && isPrivateChat && typeof resolvedThreadId === "number";
          if (!_c) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, resolveBotTopicsEnabled(primaryCtx)];
        case 1:
          _c = _e.sent();
          _e.label = 2;
        case 2:
          canStreamDraft = _c;
          draftStream = canStreamDraft
            ? (0, draft_stream_js_1.createTelegramDraftStream)({
                api: bot.api,
                chatId: chatId,
                draftId: msg.message_id || Date.now(),
                maxChars: draftMaxChars,
                messageThreadId: resolvedThreadId,
                log: globals_js_1.logVerbose,
                warn: globals_js_1.logVerbose,
              })
            : undefined;
          draftChunking =
            draftStream && streamMode === "block"
              ? (0, draft_chunking_js_1.resolveTelegramDraftStreamingChunking)(cfg, route.accountId)
              : undefined;
          draftChunker = draftChunking
            ? new pi_embedded_block_chunker_js_1.EmbeddedBlockChunker(draftChunking)
            : undefined;
          lastPartialText = "";
          draftText = "";
          updateDraftFromPartial = function (text) {
            if (!draftStream || !text) {
              return;
            }
            if (text === lastPartialText) {
              return;
            }
            if (streamMode === "partial") {
              lastPartialText = text;
              draftStream.update(text);
              return;
            }
            var delta = text;
            if (text.startsWith(lastPartialText)) {
              delta = text.slice(lastPartialText.length);
            } else {
              // Streaming buffer reset (or non-monotonic stream). Start fresh.
              draftChunker === null || draftChunker === void 0 ? void 0 : draftChunker.reset();
              draftText = "";
            }
            lastPartialText = text;
            if (!delta) {
              return;
            }
            if (!draftChunker) {
              draftText = text;
              draftStream.update(draftText);
              return;
            }
            draftChunker.append(delta);
            draftChunker.drain({
              force: false,
              emit: function (chunk) {
                draftText += chunk;
                draftStream.update(draftText);
              },
            });
          };
          flushDraft = function () {
            return __awaiter(void 0, void 0, void 0, function () {
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    if (!draftStream) {
                      return [2 /*return*/];
                    }
                    if (
                      draftChunker === null || draftChunker === void 0
                        ? void 0
                        : draftChunker.hasBuffered()
                    ) {
                      draftChunker.drain({
                        force: true,
                        emit: function (chunk) {
                          draftText += chunk;
                        },
                      });
                      draftChunker.reset();
                      if (draftText) {
                        draftStream.update(draftText);
                      }
                    }
                    return [4 /*yield*/, draftStream.flush()];
                  case 1:
                    _a.sent();
                    return [2 /*return*/];
                }
              });
            });
          };
          disableBlockStreaming =
            Boolean(draftStream) ||
            (typeof telegramCfg.blockStreaming === "boolean"
              ? !telegramCfg.blockStreaming
              : undefined);
          prefixContext = (0, reply_prefix_js_1.createReplyPrefixContext)({
            cfg: cfg,
            agentId: route.agentId,
          });
          tableMode = (0, markdown_tables_js_1.resolveMarkdownTableMode)({
            cfg: cfg,
            channel: "telegram",
            accountId: route.accountId,
          });
          chunkMode = (0, chunk_js_1.resolveChunkMode)(cfg, "telegram", route.accountId);
          sticker = ctxPayload.Sticker;
          if (
            !(
              (sticker === null || sticker === void 0 ? void 0 : sticker.fileUniqueId) &&
              ctxPayload.MediaPath
            )
          ) {
            return [3 /*break*/, 6];
          }
          agentDir = (0, agent_scope_js_1.resolveAgentDir)(cfg, route.agentId);
          return [4 /*yield*/, resolveStickerVisionSupport(cfg, route.agentId)];
        case 3:
          stickerSupportsVision = _e.sent();
          description = (_d = sticker.cachedDescription) !== null && _d !== void 0 ? _d : null;
          if (!!description) {
            return [3 /*break*/, 5];
          }
          return [
            4 /*yield*/,
            (0, sticker_cache_js_1.describeStickerImage)({
              imagePath: ctxPayload.MediaPath,
              cfg: cfg,
              agentDir: agentDir,
              agentId: route.agentId,
            }),
          ];
        case 4:
          description = _e.sent();
          _e.label = 5;
        case 5:
          if (description) {
            stickerContext = [
              sticker.emoji,
              sticker.setName ? 'from "'.concat(sticker.setName, '"') : null,
            ]
              .filter(Boolean)
              .join(" ");
            formattedDesc = "[Sticker"
              .concat(stickerContext ? " ".concat(stickerContext) : "", "] ")
              .concat(description);
            sticker.cachedDescription = description;
            if (!stickerSupportsVision) {
              // Update context to use description instead of image
              ctxPayload.Body = formattedDesc;
              ctxPayload.BodyForAgent = formattedDesc;
              // Clear media paths so native vision doesn't process the image again
              ctxPayload.MediaPath = undefined;
              ctxPayload.MediaType = undefined;
              ctxPayload.MediaUrl = undefined;
              ctxPayload.MediaPaths = undefined;
              ctxPayload.MediaUrls = undefined;
              ctxPayload.MediaTypes = undefined;
            }
            // Cache the description for future encounters
            (0, sticker_cache_js_1.cacheSticker)({
              fileId: sticker.fileId,
              fileUniqueId: sticker.fileUniqueId,
              emoji: sticker.emoji,
              setName: sticker.setName,
              description: description,
              cachedAt: new Date().toISOString(),
              receivedFrom: ctxPayload.From,
            });
            (0, globals_js_1.logVerbose)(
              "telegram: cached sticker description for ".concat(sticker.fileUniqueId),
            );
          }
          _e.label = 6;
        case 6:
          replyQuoteText =
            ctxPayload.ReplyToIsQuote && ctxPayload.ReplyToBody
              ? ctxPayload.ReplyToBody.trim() || undefined
              : undefined;
          deliveryState = {
            delivered: false,
            skippedNonSilent: 0,
          };
          return [
            4 /*yield*/,
            (0, provider_dispatcher_js_1.dispatchReplyWithBufferedBlockDispatcher)({
              ctx: ctxPayload,
              cfg: cfg,
              dispatcherOptions: {
                responsePrefix: prefixContext.responsePrefix,
                responsePrefixContextProvider: prefixContext.responsePrefixContextProvider,
                deliver: function (payload, info) {
                  return __awaiter(void 0, void 0, void 0, function () {
                    var result;
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          if (!(info.kind === "final")) {
                            return [3 /*break*/, 2];
                          }
                          return [4 /*yield*/, flushDraft()];
                        case 1:
                          _a.sent();
                          draftStream === null || draftStream === void 0
                            ? void 0
                            : draftStream.stop();
                          _a.label = 2;
                        case 2:
                          return [
                            4 /*yield*/,
                            (0, delivery_js_1.deliverReplies)({
                              replies: [payload],
                              chatId: String(chatId),
                              token: opts.token,
                              runtime: runtime,
                              bot: bot,
                              replyToMode: replyToMode,
                              textLimit: textLimit,
                              messageThreadId: resolvedThreadId,
                              tableMode: tableMode,
                              chunkMode: chunkMode,
                              onVoiceRecording: sendRecordVoice,
                              linkPreview: telegramCfg.linkPreview,
                              replyQuoteText: replyQuoteText,
                            }),
                          ];
                        case 3:
                          result = _a.sent();
                          if (result.delivered) {
                            deliveryState.delivered = true;
                          }
                          return [2 /*return*/];
                      }
                    });
                  });
                },
                onSkip: function (_payload, info) {
                  if (info.reason !== "silent") {
                    deliveryState.skippedNonSilent += 1;
                  }
                },
                onError: function (err, info) {
                  var _a;
                  (_a = runtime.error) === null || _a === void 0
                    ? void 0
                    : _a.call(
                        runtime,
                        (0, globals_js_1.danger)(
                          "telegram ".concat(info.kind, " reply failed: ").concat(String(err)),
                        ),
                      );
                },
                onReplyStart: (0, typing_js_1.createTypingCallbacks)({
                  start: sendTyping,
                  onStartError: function (err) {
                    (0, logging_js_1.logTypingFailure)({
                      log: globals_js_1.logVerbose,
                      channel: "telegram",
                      target: String(chatId),
                      error: err,
                    });
                  },
                }).onReplyStart,
              },
              replyOptions: {
                skillFilter: skillFilter,
                onPartialReply: draftStream
                  ? function (payload) {
                      return updateDraftFromPartial(payload.text);
                    }
                  : undefined,
                onReasoningStream: draftStream
                  ? function (payload) {
                      if (payload.text) {
                        draftStream.update(payload.text);
                      }
                    }
                  : undefined,
                disableBlockStreaming: disableBlockStreaming,
                onModelSelected: function (ctx) {
                  prefixContext.onModelSelected(ctx);
                },
              },
            }),
          ];
        case 7:
          queuedFinal = _e.sent().queuedFinal;
          draftStream === null || draftStream === void 0 ? void 0 : draftStream.stop();
          sentFallback = false;
          if (!(!deliveryState.delivered && deliveryState.skippedNonSilent > 0)) {
            return [3 /*break*/, 9];
          }
          return [
            4 /*yield*/,
            (0, delivery_js_1.deliverReplies)({
              replies: [{ text: EMPTY_RESPONSE_FALLBACK }],
              chatId: String(chatId),
              token: opts.token,
              runtime: runtime,
              bot: bot,
              replyToMode: replyToMode,
              textLimit: textLimit,
              messageThreadId: resolvedThreadId,
              tableMode: tableMode,
              chunkMode: chunkMode,
              linkPreview: telegramCfg.linkPreview,
              replyQuoteText: replyQuoteText,
            }),
          ];
        case 8:
          result = _e.sent();
          sentFallback = result.delivered;
          _e.label = 9;
        case 9:
          hasFinalResponse = queuedFinal || sentFallback;
          if (!hasFinalResponse) {
            if (isGroup && historyKey) {
              (0, history_js_1.clearHistoryEntriesIfEnabled)({
                historyMap: groupHistories,
                historyKey: historyKey,
                limit: historyLimit,
              });
            }
            return [2 /*return*/];
          }
          (0, ack_reactions_js_1.removeAckReactionAfterReply)({
            removeAfterReply: removeAckAfterReply,
            ackReactionPromise: ackReactionPromise,
            ackReactionValue: ackReactionPromise ? "ack" : null,
            remove: function () {
              var _a, _b;
              return (_b =
                reactionApi === null || reactionApi === void 0
                  ? void 0
                  : reactionApi(
                      chatId,
                      (_a = msg.message_id) !== null && _a !== void 0 ? _a : 0,
                      [],
                    )) !== null && _b !== void 0
                ? _b
                : Promise.resolve();
            },
            onError: function (err) {
              if (!msg.message_id) {
                return;
              }
              (0, logging_js_1.logAckFailure)({
                log: globals_js_1.logVerbose,
                channel: "telegram",
                target: "".concat(chatId, "/").concat(msg.message_id),
                error: err,
              });
            },
          });
          if (isGroup && historyKey) {
            (0, history_js_1.clearHistoryEntriesIfEnabled)({
              historyMap: groupHistories,
              historyKey: historyKey,
              limit: historyLimit,
            });
          }
          return [2 /*return*/];
      }
    });
  });
};
exports.dispatchTelegramMessage = dispatchTelegramMessage;
