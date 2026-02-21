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
exports.deliverReplies = deliverReplies;
exports.resolveSlackThreadTs = resolveSlackThreadTs;
exports.createSlackReplyDeliveryPlan = createSlackReplyDeliveryPlan;
exports.deliverSlackSlashReplies = deliverSlackSlashReplies;
var reply_reference_js_1 = require("../../auto-reply/reply/reply-reference.js");
var tokens_js_1 = require("../../auto-reply/tokens.js");
var chunk_js_1 = require("../../auto-reply/chunk.js");
var format_js_1 = require("../format.js");
var send_js_1 = require("../send.js");
function deliverReplies(params) {
  return __awaiter(this, void 0, void 0, function () {
    var _i,
      _a,
      payload,
      threadTs,
      mediaList,
      text,
      trimmed,
      first,
      _b,
      mediaList_1,
      mediaUrl,
      caption;
    var _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          ((_i = 0), (_a = params.replies));
          _h.label = 1;
        case 1:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 9];
          }
          payload = _a[_i];
          threadTs = (_c = payload.replyToId) !== null && _c !== void 0 ? _c : params.replyThreadTs;
          mediaList =
            (_d = payload.mediaUrls) !== null && _d !== void 0
              ? _d
              : payload.mediaUrl
                ? [payload.mediaUrl]
                : [];
          text = (_e = payload.text) !== null && _e !== void 0 ? _e : "";
          if (!text && mediaList.length === 0) {
            return [3 /*break*/, 8];
          }
          if (!(mediaList.length === 0)) {
            return [3 /*break*/, 3];
          }
          trimmed = text.trim();
          if (
            !trimmed ||
            (0, tokens_js_1.isSilentReplyText)(trimmed, tokens_js_1.SILENT_REPLY_TOKEN)
          ) {
            return [3 /*break*/, 8];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageSlack)(params.target, trimmed, {
              token: params.token,
              threadTs: threadTs,
              accountId: params.accountId,
            }),
          ];
        case 2:
          _h.sent();
          return [3 /*break*/, 7];
        case 3:
          first = true;
          ((_b = 0), (mediaList_1 = mediaList));
          _h.label = 4;
        case 4:
          if (!(_b < mediaList_1.length)) {
            return [3 /*break*/, 7];
          }
          mediaUrl = mediaList_1[_b];
          caption = first ? text : "";
          first = false;
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageSlack)(params.target, caption, {
              token: params.token,
              mediaUrl: mediaUrl,
              threadTs: threadTs,
              accountId: params.accountId,
            }),
          ];
        case 5:
          _h.sent();
          _h.label = 6;
        case 6:
          _b++;
          return [3 /*break*/, 4];
        case 7:
          (_g = (_f = params.runtime).log) === null || _g === void 0
            ? void 0
            : _g.call(_f, "delivered reply to ".concat(params.target));
          _h.label = 8;
        case 8:
          _i++;
          return [3 /*break*/, 1];
        case 9:
          return [2 /*return*/];
      }
    });
  });
}
/**
 * Compute effective threadTs for a Slack reply based on replyToMode.
 * - "off": stay in thread if already in one, otherwise main channel
 * - "first": first reply goes to thread, subsequent replies to main channel
 * - "all": all replies go to thread
 */
function resolveSlackThreadTs(params) {
  var planner = createSlackReplyReferencePlanner({
    replyToMode: params.replyToMode,
    incomingThreadTs: params.incomingThreadTs,
    messageTs: params.messageTs,
    hasReplied: params.hasReplied,
  });
  return planner.use();
}
function createSlackReplyReferencePlanner(params) {
  return (0, reply_reference_js_1.createReplyReferencePlanner)({
    replyToMode: params.replyToMode,
    existingId: params.incomingThreadTs,
    startId: params.messageTs,
    hasReplied: params.hasReplied,
  });
}
function createSlackReplyDeliveryPlan(params) {
  var replyReference = createSlackReplyReferencePlanner({
    replyToMode: params.replyToMode,
    incomingThreadTs: params.incomingThreadTs,
    messageTs: params.messageTs,
    hasReplied: params.hasRepliedRef.value,
  });
  return {
    nextThreadTs: function () {
      return replyReference.use();
    },
    markSent: function () {
      replyReference.markSent();
      params.hasRepliedRef.value = replyReference.hasReplied();
    },
  };
}
function deliverSlackSlashReplies(params) {
  return __awaiter(this, void 0, void 0, function () {
    var messages,
      chunkLimit,
      _i,
      _a,
      payload,
      textRaw,
      text,
      mediaList,
      combined,
      chunkMode,
      markdownChunks,
      chunks,
      _b,
      chunks_1,
      chunk,
      responseType,
      _c,
      messages_1,
      text;
    var _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          messages = [];
          chunkLimit = Math.min(params.textLimit, 4000);
          for (_i = 0, _a = params.replies; _i < _a.length; _i++) {
            payload = _a[_i];
            textRaw =
              (_e = (_d = payload.text) === null || _d === void 0 ? void 0 : _d.trim()) !== null &&
              _e !== void 0
                ? _e
                : "";
            text =
              textRaw &&
              !(0, tokens_js_1.isSilentReplyText)(textRaw, tokens_js_1.SILENT_REPLY_TOKEN)
                ? textRaw
                : undefined;
            mediaList =
              (_f = payload.mediaUrls) !== null && _f !== void 0
                ? _f
                : payload.mediaUrl
                  ? [payload.mediaUrl]
                  : [];
            combined = __spreadArray(
              [text !== null && text !== void 0 ? text : ""],
              mediaList
                .map(function (url) {
                  return url.trim();
                })
                .filter(Boolean),
              true,
            )
              .filter(Boolean)
              .join("\n");
            if (!combined) {
              continue;
            }
            chunkMode = (_g = params.chunkMode) !== null && _g !== void 0 ? _g : "length";
            markdownChunks =
              chunkMode === "newline"
                ? (0, chunk_js_1.chunkMarkdownTextWithMode)(combined, chunkLimit, chunkMode)
                : [combined];
            chunks = markdownChunks.flatMap(function (markdown) {
              return (0, format_js_1.markdownToSlackMrkdwnChunks)(markdown, chunkLimit, {
                tableMode: params.tableMode,
              });
            });
            if (!chunks.length && combined) {
              chunks.push(combined);
            }
            for (_b = 0, chunks_1 = chunks; _b < chunks_1.length; _b++) {
              chunk = chunks_1[_b];
              messages.push(chunk);
            }
          }
          if (messages.length === 0) {
            return [2 /*return*/];
          }
          responseType = params.ephemeral ? "ephemeral" : "in_channel";
          ((_c = 0), (messages_1 = messages));
          _h.label = 1;
        case 1:
          if (!(_c < messages_1.length)) {
            return [3 /*break*/, 4];
          }
          text = messages_1[_c];
          return [4 /*yield*/, params.respond({ text: text, response_type: responseType })];
        case 2:
          _h.sent();
          _h.label = 3;
        case 3:
          _c++;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
