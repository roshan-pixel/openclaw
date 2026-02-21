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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.deliverWebReply = deliverWebReply;
var chunk_js_1 = require("../../auto-reply/chunk.js");
var tables_js_1 = require("../../markdown/tables.js");
var globals_js_1 = require("../../globals.js");
var media_js_1 = require("../media.js");
var reconnect_js_1 = require("../reconnect.js");
var session_js_1 = require("../session.js");
var loggers_js_1 = require("./loggers.js");
var util_js_1 = require("./util.js");
function deliverWebReply(params) {
  return __awaiter(this, void 0, void 0, function () {
    var replyResult,
      msg,
      maxMediaBytes,
      textLimit,
      replyLogger,
      connectionId,
      skipLog,
      replyStarted,
      tableMode,
      chunkMode,
      convertedText,
      textChunks,
      mediaList,
      sleep,
      sendWithRetry,
      totalChunks,
      _loop_1,
      _i,
      _a,
      _b,
      index,
      chunk,
      remainingText,
      _loop_2,
      _c,
      _d,
      _e,
      index,
      mediaUrl,
      _f,
      remainingText_1,
      chunk;
    var _this = this;
    var _g, _h, _j, _k, _l, _m, _o, _p, _q, _r;
    return __generator(this, function (_s) {
      switch (_s.label) {
        case 0:
          ((replyResult = params.replyResult),
            (msg = params.msg),
            (maxMediaBytes = params.maxMediaBytes),
            (textLimit = params.textLimit),
            (replyLogger = params.replyLogger),
            (connectionId = params.connectionId),
            (skipLog = params.skipLog));
          replyStarted = Date.now();
          tableMode = (_g = params.tableMode) !== null && _g !== void 0 ? _g : "code";
          chunkMode = (_h = params.chunkMode) !== null && _h !== void 0 ? _h : "length";
          convertedText = (0, tables_js_1.convertMarkdownTables)(replyResult.text || "", tableMode);
          textChunks = (0, chunk_js_1.chunkMarkdownTextWithMode)(
            convertedText,
            textLimit,
            chunkMode,
          );
          mediaList = ((_j = replyResult.mediaUrls) === null || _j === void 0 ? void 0 : _j.length)
            ? replyResult.mediaUrls
            : replyResult.mediaUrl
              ? [replyResult.mediaUrl]
              : [];
          sleep = function (ms) {
            return new Promise(function (resolve) {
              return setTimeout(resolve, ms);
            });
          };
          sendWithRetry = function (fn_1, label_1) {
            var args_1 = [];
            for (var _i = 2; _i < arguments.length; _i++) {
              args_1[_i - 2] = arguments[_i];
            }
            return __awaiter(
              _this,
              __spreadArray([fn_1, label_1], args_1, true),
              void 0,
              function (fn, label, maxAttempts) {
                var lastErr, attempt, err_1, errText, isLast, shouldRetry, backoffMs;
                if (maxAttempts === void 0) {
                  maxAttempts = 3;
                }
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      attempt = 1;
                      _a.label = 1;
                    case 1:
                      if (!(attempt <= maxAttempts)) {
                        return [3 /*break*/, 7];
                      }
                      _a.label = 2;
                    case 2:
                      _a.trys.push([2, 4, , 6]);
                      return [4 /*yield*/, fn()];
                    case 3:
                      return [2 /*return*/, _a.sent()];
                    case 4:
                      err_1 = _a.sent();
                      lastErr = err_1;
                      errText = (0, session_js_1.formatError)(err_1);
                      isLast = attempt === maxAttempts;
                      shouldRetry = /closed|reset|timed\\s*out|disconnect/i.test(errText);
                      if (!shouldRetry || isLast) {
                        throw err_1;
                      }
                      backoffMs = 500 * attempt;
                      (0, globals_js_1.logVerbose)(
                        "Retrying "
                          .concat(label, " to ")
                          .concat(msg.from, " after failure (")
                          .concat(attempt, "/")
                          .concat(maxAttempts - 1, ") in ")
                          .concat(backoffMs, "ms: ")
                          .concat(errText),
                      );
                      return [4 /*yield*/, sleep(backoffMs)];
                    case 5:
                      _a.sent();
                      return [3 /*break*/, 6];
                    case 6:
                      attempt++;
                      return [3 /*break*/, 1];
                    case 7:
                      throw lastErr;
                  }
                });
              },
            );
          };
          if (!(mediaList.length === 0 && textChunks.length)) {
            return [3 /*break*/, 5];
          }
          totalChunks = textChunks.length;
          _loop_1 = function (index, chunk) {
            var chunkStarted, durationMs;
            return __generator(this, function (_t) {
              switch (_t.label) {
                case 0:
                  chunkStarted = Date.now();
                  return [
                    4 /*yield*/,
                    sendWithRetry(function () {
                      return msg.reply(chunk);
                    }, "text"),
                  ];
                case 1:
                  _t.sent();
                  if (!skipLog) {
                    durationMs = Date.now() - chunkStarted;
                    loggers_js_1.whatsappOutboundLog.debug(
                      "Sent chunk "
                        .concat(index + 1, "/")
                        .concat(totalChunks, " to ")
                        .concat(msg.from, " (")
                        .concat(durationMs.toFixed(0), "ms)"),
                    );
                  }
                  return [2 /*return*/];
              }
            });
          };
          ((_i = 0), (_a = textChunks.entries()));
          _s.label = 1;
        case 1:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 4];
          }
          ((_b = _a[_i]), (index = _b[0]), (chunk = _b[1]));
          return [5 /*yield**/, _loop_1(index, chunk)];
        case 2:
          _s.sent();
          _s.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          replyLogger.info(
            {
              correlationId:
                (_k = msg.id) !== null && _k !== void 0
                  ? _k
                  : (0, reconnect_js_1.newConnectionId)(),
              connectionId: connectionId !== null && connectionId !== void 0 ? connectionId : null,
              to: msg.from,
              from: msg.to,
              text: (0, util_js_1.elide)(replyResult.text, 240),
              mediaUrl: null,
              mediaSizeBytes: null,
              mediaKind: null,
              durationMs: Date.now() - replyStarted,
            },
            "auto-reply sent (text)",
          );
          return [2 /*return*/];
        case 5:
          remainingText = __spreadArray([], textChunks, true);
          _loop_2 = function (index, mediaUrl) {
            var caption,
              media_1,
              fileName_1,
              mimetype_1,
              err_2,
              warning,
              fallbackTextParts,
              fallbackText;
            return __generator(this, function (_u) {
              switch (_u.label) {
                case 0:
                  caption = index === 0 ? remainingText.shift() || undefined : undefined;
                  _u.label = 1;
                case 1:
                  _u.trys.push([1, 11, , 14]);
                  return [4 /*yield*/, (0, media_js_1.loadWebMedia)(mediaUrl, maxMediaBytes)];
                case 2:
                  media_1 = _u.sent();
                  if ((0, globals_js_1.shouldLogVerbose)()) {
                    (0, globals_js_1.logVerbose)(
                      "Web auto-reply media size: ".concat(
                        (media_1.buffer.length / (1024 * 1024)).toFixed(2),
                        "MB",
                      ),
                    );
                    (0, globals_js_1.logVerbose)(
                      "Web auto-reply media source: "
                        .concat(mediaUrl, " (kind ")
                        .concat(media_1.kind, ")"),
                    );
                  }
                  if (!(media_1.kind === "image")) {
                    return [3 /*break*/, 4];
                  }
                  return [
                    4 /*yield*/,
                    sendWithRetry(function () {
                      return msg.sendMedia({
                        image: media_1.buffer,
                        caption: caption,
                        mimetype: media_1.contentType,
                      });
                    }, "media:image"),
                  ];
                case 3:
                  _u.sent();
                  return [3 /*break*/, 10];
                case 4:
                  if (!(media_1.kind === "audio")) {
                    return [3 /*break*/, 6];
                  }
                  return [
                    4 /*yield*/,
                    sendWithRetry(function () {
                      return msg.sendMedia({
                        audio: media_1.buffer,
                        ptt: true,
                        mimetype: media_1.contentType,
                        caption: caption,
                      });
                    }, "media:audio"),
                  ];
                case 5:
                  _u.sent();
                  return [3 /*break*/, 10];
                case 6:
                  if (!(media_1.kind === "video")) {
                    return [3 /*break*/, 8];
                  }
                  return [
                    4 /*yield*/,
                    sendWithRetry(function () {
                      return msg.sendMedia({
                        video: media_1.buffer,
                        caption: caption,
                        mimetype: media_1.contentType,
                      });
                    }, "media:video"),
                  ];
                case 7:
                  _u.sent();
                  return [3 /*break*/, 10];
                case 8:
                  fileName_1 =
                    (_m =
                      (_l = media_1.fileName) !== null && _l !== void 0
                        ? _l
                        : mediaUrl.split("/").pop()) !== null && _m !== void 0
                      ? _m
                      : "file";
                  mimetype_1 =
                    (_o = media_1.contentType) !== null && _o !== void 0
                      ? _o
                      : "application/octet-stream";
                  return [
                    4 /*yield*/,
                    sendWithRetry(function () {
                      return msg.sendMedia({
                        document: media_1.buffer,
                        fileName: fileName_1,
                        caption: caption,
                        mimetype: mimetype_1,
                      });
                    }, "media:document"),
                  ];
                case 9:
                  _u.sent();
                  _u.label = 10;
                case 10:
                  loggers_js_1.whatsappOutboundLog.info(
                    "Sent media reply to "
                      .concat(msg.from, " (")
                      .concat((media_1.buffer.length / (1024 * 1024)).toFixed(2), "MB)"),
                  );
                  replyLogger.info(
                    {
                      correlationId:
                        (_p = msg.id) !== null && _p !== void 0
                          ? _p
                          : (0, reconnect_js_1.newConnectionId)(),
                      connectionId:
                        connectionId !== null && connectionId !== void 0 ? connectionId : null,
                      to: msg.from,
                      from: msg.to,
                      text: caption !== null && caption !== void 0 ? caption : null,
                      mediaUrl: mediaUrl,
                      mediaSizeBytes: media_1.buffer.length,
                      mediaKind: media_1.kind,
                      durationMs: Date.now() - replyStarted,
                    },
                    "auto-reply sent (media)",
                  );
                  return [3 /*break*/, 14];
                case 11:
                  err_2 = _u.sent();
                  loggers_js_1.whatsappOutboundLog.error(
                    "Failed sending web media to "
                      .concat(msg.from, ": ")
                      .concat((0, session_js_1.formatError)(err_2)),
                  );
                  replyLogger.warn(
                    { err: err_2, mediaUrl: mediaUrl },
                    "failed to send web media reply",
                  );
                  if (!(index === 0)) {
                    return [3 /*break*/, 13];
                  }
                  warning =
                    err_2 instanceof Error
                      ? "\u26A0\uFE0F Media failed: ".concat(err_2.message)
                      : "⚠️ Media failed.";
                  fallbackTextParts = [
                    (_r = (_q = remainingText.shift()) !== null && _q !== void 0 ? _q : caption) !==
                      null && _r !== void 0
                      ? _r
                      : "",
                    warning,
                  ].filter(Boolean);
                  fallbackText = fallbackTextParts.join("\n");
                  if (!fallbackText) {
                    return [3 /*break*/, 13];
                  }
                  loggers_js_1.whatsappOutboundLog.warn(
                    "Media skipped; sent text-only to ".concat(msg.from),
                  );
                  return [4 /*yield*/, msg.reply(fallbackText)];
                case 12:
                  _u.sent();
                  _u.label = 13;
                case 13:
                  return [3 /*break*/, 14];
                case 14:
                  return [2 /*return*/];
              }
            });
          };
          ((_c = 0), (_d = mediaList.entries()));
          _s.label = 6;
        case 6:
          if (!(_c < _d.length)) {
            return [3 /*break*/, 9];
          }
          ((_e = _d[_c]), (index = _e[0]), (mediaUrl = _e[1]));
          return [5 /*yield**/, _loop_2(index, mediaUrl)];
        case 7:
          _s.sent();
          _s.label = 8;
        case 8:
          _c++;
          return [3 /*break*/, 6];
        case 9:
          ((_f = 0), (remainingText_1 = remainingText));
          _s.label = 10;
        case 10:
          if (!(_f < remainingText_1.length)) {
            return [3 /*break*/, 13];
          }
          chunk = remainingText_1[_f];
          return [4 /*yield*/, msg.reply(chunk)];
        case 11:
          _s.sent();
          _s.label = 12;
        case 12:
          _f++;
          return [3 /*break*/, 10];
        case 13:
          return [2 /*return*/];
      }
    });
  });
}
