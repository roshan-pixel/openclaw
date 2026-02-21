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
exports.normalizeOutboundPayloads = void 0;
exports.deliverOutboundPayloads = deliverOutboundPayloads;
var chunk_js_1 = require("../../auto-reply/chunk.js");
var media_limits_js_1 = require("../../channels/plugins/media-limits.js");
var load_js_1 = require("../../channels/plugins/outbound/load.js");
var markdown_tables_js_1 = require("../../config/markdown-tables.js");
var format_js_1 = require("../../signal/format.js");
var send_js_1 = require("../../signal/send.js");
var sessions_js_1 = require("../../config/sessions.js");
var payloads_js_1 = require("./payloads.js");
var payloads_js_2 = require("./payloads.js");
Object.defineProperty(exports, "normalizeOutboundPayloads", {
  enumerable: true,
  get: function () {
    return payloads_js_2.normalizeOutboundPayloads;
  },
});
function throwIfAborted(abortSignal) {
  if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
    throw new Error("Outbound delivery aborted");
  }
}
// Channel docking: outbound delivery delegates to plugin.outbound adapters.
function createChannelHandler(params) {
  return __awaiter(this, void 0, void 0, function () {
    var outbound, handler;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, load_js_1.loadChannelOutboundAdapter)(params.channel)];
        case 1:
          outbound = _a.sent();
          if (
            !(outbound === null || outbound === void 0 ? void 0 : outbound.sendText) ||
            !(outbound === null || outbound === void 0 ? void 0 : outbound.sendMedia)
          ) {
            throw new Error("Outbound not configured for channel: ".concat(params.channel));
          }
          handler = createPluginHandler({
            outbound: outbound,
            cfg: params.cfg,
            channel: params.channel,
            to: params.to,
            accountId: params.accountId,
            replyToId: params.replyToId,
            threadId: params.threadId,
            deps: params.deps,
            gifPlayback: params.gifPlayback,
          });
          if (!handler) {
            throw new Error("Outbound not configured for channel: ".concat(params.channel));
          }
          return [2 /*return*/, handler];
      }
    });
  });
}
function createPluginHandler(params) {
  var _this = this;
  var _a;
  var outbound = params.outbound;
  if (
    !(outbound === null || outbound === void 0 ? void 0 : outbound.sendText) ||
    !(outbound === null || outbound === void 0 ? void 0 : outbound.sendMedia)
  ) {
    return null;
  }
  var sendText = outbound.sendText;
  var sendMedia = outbound.sendMedia;
  var chunker = (_a = outbound.chunker) !== null && _a !== void 0 ? _a : null;
  var chunkerMode = outbound.chunkerMode;
  return {
    chunker: chunker,
    chunkerMode: chunkerMode,
    textChunkLimit: outbound.textChunkLimit,
    sendPayload: outbound.sendPayload
      ? function (payload) {
          return __awaiter(_this, void 0, void 0, function () {
            var _a;
            return __generator(this, function (_b) {
              return [
                2 /*return*/,
                outbound.sendPayload({
                  cfg: params.cfg,
                  to: params.to,
                  text: (_a = payload.text) !== null && _a !== void 0 ? _a : "",
                  mediaUrl: payload.mediaUrl,
                  accountId: params.accountId,
                  replyToId: params.replyToId,
                  threadId: params.threadId,
                  gifPlayback: params.gifPlayback,
                  deps: params.deps,
                  payload: payload,
                }),
              ];
            });
          });
        }
      : undefined,
    sendText: function (text) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [
            2 /*return*/,
            sendText({
              cfg: params.cfg,
              to: params.to,
              text: text,
              accountId: params.accountId,
              replyToId: params.replyToId,
              threadId: params.threadId,
              gifPlayback: params.gifPlayback,
              deps: params.deps,
            }),
          ];
        });
      });
    },
    sendMedia: function (caption, mediaUrl) {
      return __awaiter(_this, void 0, void 0, function () {
        return __generator(this, function (_a) {
          return [
            2 /*return*/,
            sendMedia({
              cfg: params.cfg,
              to: params.to,
              text: caption,
              mediaUrl: mediaUrl,
              accountId: params.accountId,
              replyToId: params.replyToId,
              threadId: params.threadId,
              gifPlayback: params.gifPlayback,
              deps: params.deps,
            }),
          ];
        });
      });
    },
  };
}
function deliverOutboundPayloads(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      channel,
      to,
      payloads,
      accountId,
      deps,
      abortSignal,
      sendSignal,
      results,
      handler,
      textLimit,
      chunkMode,
      isSignalChannel,
      signalTableMode,
      signalMaxBytes,
      sendTextChunks,
      sendSignalText,
      sendSignalTextChunks,
      sendSignalMedia,
      normalizedPayloads,
      _i,
      normalizedPayloads_1,
      payload,
      payloadSummary,
      _a,
      _b,
      first,
      _c,
      _d,
      url,
      caption,
      _e,
      _f,
      _g,
      _h,
      err_1,
      mirrorText;
    var _this = this;
    var _j, _k, _l, _m, _o, _p;
    return __generator(this, function (_q) {
      switch (_q.label) {
        case 0:
          ((cfg = params.cfg),
            (channel = params.channel),
            (to = params.to),
            (payloads = params.payloads));
          accountId = params.accountId;
          deps = params.deps;
          abortSignal = params.abortSignal;
          sendSignal =
            (_k = (_j = params.deps) === null || _j === void 0 ? void 0 : _j.sendSignal) !== null &&
            _k !== void 0
              ? _k
              : send_js_1.sendMessageSignal;
          results = [];
          return [
            4 /*yield*/,
            createChannelHandler({
              cfg: cfg,
              channel: channel,
              to: to,
              deps: deps,
              accountId: accountId,
              replyToId: params.replyToId,
              threadId: params.threadId,
              gifPlayback: params.gifPlayback,
            }),
          ];
        case 1:
          handler = _q.sent();
          textLimit = handler.chunker
            ? (0, chunk_js_1.resolveTextChunkLimit)(cfg, channel, accountId, {
                fallbackLimit: handler.textChunkLimit,
              })
            : undefined;
          chunkMode = handler.chunker
            ? (0, chunk_js_1.resolveChunkMode)(cfg, channel, accountId)
            : "length";
          isSignalChannel = channel === "signal";
          signalTableMode = isSignalChannel
            ? (0, markdown_tables_js_1.resolveMarkdownTableMode)({
                cfg: cfg,
                channel: "signal",
                accountId: accountId,
              })
            : "code";
          signalMaxBytes = isSignalChannel
            ? (0, media_limits_js_1.resolveChannelMediaMaxBytes)({
                cfg: cfg,
                resolveChannelLimitMb: function (_a) {
                  var _b, _c, _d, _e, _f, _g, _h;
                  var cfg = _a.cfg,
                    accountId = _a.accountId;
                  return (_f =
                    (_e =
                      (_d =
                        (_c =
                          (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.signal) ===
                          null || _c === void 0
                          ? void 0
                          : _c.accounts) === null || _d === void 0
                        ? void 0
                        : _d[accountId]) === null || _e === void 0
                      ? void 0
                      : _e.mediaMaxMb) !== null && _f !== void 0
                    ? _f
                    : (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.signal) ===
                          null || _h === void 0
                      ? void 0
                      : _h.mediaMaxMb;
                },
                accountId: accountId,
              })
            : undefined;
          sendTextChunks = function (text) {
            return __awaiter(_this, void 0, void 0, function () {
              var _a,
                _b,
                mode,
                blockChunks,
                _i,
                blockChunks_1,
                blockChunk,
                chunks_3,
                _c,
                chunks_1,
                chunk,
                _d,
                _e,
                chunks,
                _f,
                chunks_2,
                chunk,
                _g,
                _h;
              var _j;
              return __generator(this, function (_k) {
                switch (_k.label) {
                  case 0:
                    throwIfAborted(abortSignal);
                    if (!(!handler.chunker || textLimit === undefined)) {
                      return [3 /*break*/, 2];
                    }
                    _b = (_a = results).push;
                    return [4 /*yield*/, handler.sendText(text)];
                  case 1:
                    _b.apply(_a, [_k.sent()]);
                    return [2 /*return*/];
                  case 2:
                    if (!(chunkMode === "newline")) {
                      return [3 /*break*/, 9];
                    }
                    mode = (_j = handler.chunkerMode) !== null && _j !== void 0 ? _j : "text";
                    blockChunks =
                      mode === "markdown"
                        ? (0, chunk_js_1.chunkMarkdownTextWithMode)(text, textLimit, "newline")
                        : (0, chunk_js_1.chunkByParagraph)(text, textLimit);
                    if (!blockChunks.length && text) {
                      blockChunks.push(text);
                    }
                    ((_i = 0), (blockChunks_1 = blockChunks));
                    _k.label = 3;
                  case 3:
                    if (!(_i < blockChunks_1.length)) {
                      return [3 /*break*/, 8];
                    }
                    blockChunk = blockChunks_1[_i];
                    chunks_3 = handler.chunker(blockChunk, textLimit);
                    if (!chunks_3.length && blockChunk) {
                      chunks_3.push(blockChunk);
                    }
                    ((_c = 0), (chunks_1 = chunks_3));
                    _k.label = 4;
                  case 4:
                    if (!(_c < chunks_1.length)) {
                      return [3 /*break*/, 7];
                    }
                    chunk = chunks_1[_c];
                    throwIfAborted(abortSignal);
                    _e = (_d = results).push;
                    return [4 /*yield*/, handler.sendText(chunk)];
                  case 5:
                    _e.apply(_d, [_k.sent()]);
                    _k.label = 6;
                  case 6:
                    _c++;
                    return [3 /*break*/, 4];
                  case 7:
                    _i++;
                    return [3 /*break*/, 3];
                  case 8:
                    return [2 /*return*/];
                  case 9:
                    chunks = handler.chunker(text, textLimit);
                    ((_f = 0), (chunks_2 = chunks));
                    _k.label = 10;
                  case 10:
                    if (!(_f < chunks_2.length)) {
                      return [3 /*break*/, 13];
                    }
                    chunk = chunks_2[_f];
                    throwIfAborted(abortSignal);
                    _h = (_g = results).push;
                    return [4 /*yield*/, handler.sendText(chunk)];
                  case 11:
                    _h.apply(_g, [_k.sent()]);
                    _k.label = 12;
                  case 12:
                    _f++;
                    return [3 /*break*/, 10];
                  case 13:
                    return [2 /*return*/];
                }
              });
            });
          };
          sendSignalText = function (text, styles) {
            return __awaiter(_this, void 0, void 0, function () {
              var _a;
              return __generator(this, function (_b) {
                switch (_b.label) {
                  case 0:
                    throwIfAborted(abortSignal);
                    _a = [{ channel: "signal" }];
                    return [
                      4 /*yield*/,
                      sendSignal(to, text, {
                        maxBytes: signalMaxBytes,
                        accountId:
                          accountId !== null && accountId !== void 0 ? accountId : undefined,
                        textMode: "plain",
                        textStyles: styles,
                      }),
                    ];
                  case 1:
                    return [2 /*return*/, __assign.apply(void 0, _a.concat([_b.sent()]))];
                }
              });
            });
          };
          sendSignalTextChunks = function (text) {
            return __awaiter(_this, void 0, void 0, function () {
              var signalChunks, _i, signalChunks_1, chunk, _a, _b;
              return __generator(this, function (_c) {
                switch (_c.label) {
                  case 0:
                    throwIfAborted(abortSignal);
                    signalChunks =
                      textLimit === undefined
                        ? (0, format_js_1.markdownToSignalTextChunks)(
                            text,
                            Number.POSITIVE_INFINITY,
                            {
                              tableMode: signalTableMode,
                            },
                          )
                        : (0, format_js_1.markdownToSignalTextChunks)(text, textLimit, {
                            tableMode: signalTableMode,
                          });
                    if (signalChunks.length === 0 && text) {
                      signalChunks = [{ text: text, styles: [] }];
                    }
                    ((_i = 0), (signalChunks_1 = signalChunks));
                    _c.label = 1;
                  case 1:
                    if (!(_i < signalChunks_1.length)) {
                      return [3 /*break*/, 4];
                    }
                    chunk = signalChunks_1[_i];
                    throwIfAborted(abortSignal);
                    _b = (_a = results).push;
                    return [4 /*yield*/, sendSignalText(chunk.text, chunk.styles)];
                  case 2:
                    _b.apply(_a, [_c.sent()]);
                    _c.label = 3;
                  case 3:
                    _i++;
                    return [3 /*break*/, 1];
                  case 4:
                    return [2 /*return*/];
                }
              });
            });
          };
          sendSignalMedia = function (caption, mediaUrl) {
            return __awaiter(_this, void 0, void 0, function () {
              var formatted, _a;
              var _b;
              return __generator(this, function (_c) {
                switch (_c.label) {
                  case 0:
                    throwIfAborted(abortSignal);
                    formatted =
                      (_b = (0, format_js_1.markdownToSignalTextChunks)(
                        caption,
                        Number.POSITIVE_INFINITY,
                        {
                          tableMode: signalTableMode,
                        },
                      )[0]) !== null && _b !== void 0
                        ? _b
                        : {
                            text: caption,
                            styles: [],
                          };
                    _a = [{ channel: "signal" }];
                    return [
                      4 /*yield*/,
                      sendSignal(to, formatted.text, {
                        mediaUrl: mediaUrl,
                        maxBytes: signalMaxBytes,
                        accountId:
                          accountId !== null && accountId !== void 0 ? accountId : undefined,
                        textMode: "plain",
                        textStyles: formatted.styles,
                      }),
                    ];
                  case 1:
                    return [2 /*return*/, __assign.apply(void 0, _a.concat([_c.sent()]))];
                }
              });
            });
          };
          normalizedPayloads = (0, payloads_js_1.normalizeReplyPayloadsForDelivery)(payloads);
          ((_i = 0), (normalizedPayloads_1 = normalizedPayloads));
          _q.label = 2;
        case 2:
          if (!(_i < normalizedPayloads_1.length)) {
            return [3 /*break*/, 19];
          }
          payload = normalizedPayloads_1[_i];
          payloadSummary = {
            text: (_l = payload.text) !== null && _l !== void 0 ? _l : "",
            mediaUrls:
              (_m = payload.mediaUrls) !== null && _m !== void 0
                ? _m
                : payload.mediaUrl
                  ? [payload.mediaUrl]
                  : [],
            channelData: payload.channelData,
          };
          _q.label = 3;
        case 3:
          _q.trys.push([3, 17, , 18]);
          throwIfAborted(abortSignal);
          (_o = params.onPayload) === null || _o === void 0
            ? void 0
            : _o.call(params, payloadSummary);
          if (!(handler.sendPayload && payload.channelData)) {
            return [3 /*break*/, 5];
          }
          _b = (_a = results).push;
          return [4 /*yield*/, handler.sendPayload(payload)];
        case 4:
          _b.apply(_a, [_q.sent()]);
          return [3 /*break*/, 18];
        case 5:
          if (!(payloadSummary.mediaUrls.length === 0)) {
            return [3 /*break*/, 10];
          }
          if (!isSignalChannel) {
            return [3 /*break*/, 7];
          }
          return [4 /*yield*/, sendSignalTextChunks(payloadSummary.text)];
        case 6:
          _q.sent();
          return [3 /*break*/, 9];
        case 7:
          return [4 /*yield*/, sendTextChunks(payloadSummary.text)];
        case 8:
          _q.sent();
          _q.label = 9;
        case 9:
          return [3 /*break*/, 18];
        case 10:
          first = true;
          ((_c = 0), (_d = payloadSummary.mediaUrls));
          _q.label = 11;
        case 11:
          if (!(_c < _d.length)) {
            return [3 /*break*/, 16];
          }
          url = _d[_c];
          throwIfAborted(abortSignal);
          caption = first ? payloadSummary.text : "";
          first = false;
          if (!isSignalChannel) {
            return [3 /*break*/, 13];
          }
          _f = (_e = results).push;
          return [4 /*yield*/, sendSignalMedia(caption, url)];
        case 12:
          _f.apply(_e, [_q.sent()]);
          return [3 /*break*/, 15];
        case 13:
          _h = (_g = results).push;
          return [4 /*yield*/, handler.sendMedia(caption, url)];
        case 14:
          _h.apply(_g, [_q.sent()]);
          _q.label = 15;
        case 15:
          _c++;
          return [3 /*break*/, 11];
        case 16:
          return [3 /*break*/, 18];
        case 17:
          err_1 = _q.sent();
          if (!params.bestEffort) {
            throw err_1;
          }
          (_p = params.onError) === null || _p === void 0
            ? void 0
            : _p.call(params, err_1, payloadSummary);
          return [3 /*break*/, 18];
        case 18:
          _i++;
          return [3 /*break*/, 2];
        case 19:
          if (!(params.mirror && results.length > 0)) {
            return [3 /*break*/, 21];
          }
          mirrorText = (0, sessions_js_1.resolveMirroredTranscriptText)({
            text: params.mirror.text,
            mediaUrls: params.mirror.mediaUrls,
          });
          if (!mirrorText) {
            return [3 /*break*/, 21];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.appendAssistantMessageToSessionTranscript)({
              agentId: params.mirror.agentId,
              sessionKey: params.mirror.sessionKey,
              text: mirrorText,
            }),
          ];
        case 20:
          _q.sent();
          _q.label = 21;
        case 21:
          return [2 /*return*/, results];
      }
    });
  });
}
