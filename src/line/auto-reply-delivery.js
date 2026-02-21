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
exports.deliverLineAutoReply = deliverLineAutoReply;
function deliverLineAutoReply(params) {
  return __awaiter(this, void 0, void 0, function () {
    var payload,
      lineData,
      replyToken,
      accountId,
      to,
      textLimit,
      deps,
      replyTokenUsed,
      pushLineMessages,
      sendLineMessages,
      richMessages,
      hasQuickReplies,
      templateMsg,
      processed,
      _i,
      _a,
      flexMsg,
      chunks,
      mediaUrls,
      mediaMessages,
      hasRichOrMedia,
      err_1,
      nextReplyTokenUsed,
      combined,
      quickReply,
      targetIndex,
      target;
    var _this = this;
    var _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          ((payload = params.payload),
            (lineData = params.lineData),
            (replyToken = params.replyToken),
            (accountId = params.accountId),
            (to = params.to),
            (textLimit = params.textLimit),
            (deps = params.deps));
          replyTokenUsed = params.replyTokenUsed;
          pushLineMessages = function (messages) {
            return __awaiter(_this, void 0, void 0, function () {
              var i;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    if (messages.length === 0) {
                      return [2 /*return*/];
                    }
                    i = 0;
                    _a.label = 1;
                  case 1:
                    if (!(i < messages.length)) {
                      return [3 /*break*/, 4];
                    }
                    return [
                      4 /*yield*/,
                      deps.pushMessagesLine(to, messages.slice(i, i + 5), {
                        accountId: accountId,
                      }),
                    ];
                  case 2:
                    _a.sent();
                    _a.label = 3;
                  case 3:
                    i += 5;
                    return [3 /*break*/, 1];
                  case 4:
                    return [2 /*return*/];
                }
              });
            });
          };
          sendLineMessages = function (messages, allowReplyToken) {
            return __awaiter(_this, void 0, void 0, function () {
              var remaining, replyBatch, err_2;
              var _a;
              return __generator(this, function (_b) {
                switch (_b.label) {
                  case 0:
                    if (messages.length === 0) {
                      return [2 /*return*/];
                    }
                    remaining = messages;
                    if (!(allowReplyToken && replyToken && !replyTokenUsed)) {
                      return [3 /*break*/, 6];
                    }
                    replyBatch = remaining.slice(0, 5);
                    _b.label = 1;
                  case 1:
                    _b.trys.push([1, 3, , 5]);
                    return [
                      4 /*yield*/,
                      deps.replyMessageLine(replyToken, replyBatch, {
                        accountId: accountId,
                      }),
                    ];
                  case 2:
                    _b.sent();
                    return [3 /*break*/, 5];
                  case 3:
                    err_2 = _b.sent();
                    (_a = deps.onReplyError) === null || _a === void 0
                      ? void 0
                      : _a.call(deps, err_2);
                    return [4 /*yield*/, pushLineMessages(replyBatch)];
                  case 4:
                    _b.sent();
                    return [3 /*break*/, 5];
                  case 5:
                    replyTokenUsed = true;
                    remaining = remaining.slice(replyBatch.length);
                    _b.label = 6;
                  case 6:
                    if (!(remaining.length > 0)) {
                      return [3 /*break*/, 8];
                    }
                    return [4 /*yield*/, pushLineMessages(remaining)];
                  case 7:
                    _b.sent();
                    _b.label = 8;
                  case 8:
                    return [2 /*return*/];
                }
              });
            });
          };
          richMessages = [];
          hasQuickReplies = Boolean(
            (_b = lineData.quickReplies) === null || _b === void 0 ? void 0 : _b.length,
          );
          if (lineData.flexMessage) {
            richMessages.push(
              deps.createFlexMessage(
                lineData.flexMessage.altText.slice(0, 400),
                lineData.flexMessage.contents,
              ),
            );
          }
          if (lineData.templateMessage) {
            templateMsg = deps.buildTemplateMessageFromPayload(lineData.templateMessage);
            if (templateMsg) {
              richMessages.push(templateMsg);
            }
          }
          if (lineData.location) {
            richMessages.push(deps.createLocationMessage(lineData.location));
          }
          processed = payload.text
            ? deps.processLineMessage(payload.text)
            : { text: "", flexMessages: [] };
          for (_i = 0, _a = processed.flexMessages; _i < _a.length; _i++) {
            flexMsg = _a[_i];
            richMessages.push(
              deps.createFlexMessage(flexMsg.altText.slice(0, 400), flexMsg.contents),
            );
          }
          chunks = processed.text ? deps.chunkMarkdownText(processed.text, textLimit) : [];
          mediaUrls =
            (_c = payload.mediaUrls) !== null && _c !== void 0
              ? _c
              : payload.mediaUrl
                ? [payload.mediaUrl]
                : [];
          mediaMessages = mediaUrls
            .map(function (url) {
              return url === null || url === void 0 ? void 0 : url.trim();
            })
            .filter(function (url) {
              return Boolean(url);
            })
            .map(function (url) {
              return deps.createImageMessage(url);
            });
          if (!(chunks.length > 0)) {
            return [3 /*break*/, 9];
          }
          hasRichOrMedia = richMessages.length > 0 || mediaMessages.length > 0;
          if (!(hasQuickReplies && hasRichOrMedia)) {
            return [3 /*break*/, 4];
          }
          _e.label = 1;
        case 1:
          _e.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            sendLineMessages(
              __spreadArray(__spreadArray([], richMessages, true), mediaMessages, true),
              false,
            ),
          ];
        case 2:
          _e.sent();
          return [3 /*break*/, 4];
        case 3:
          err_1 = _e.sent();
          (_d = deps.onReplyError) === null || _d === void 0 ? void 0 : _d.call(deps, err_1);
          return [3 /*break*/, 4];
        case 4:
          return [
            4 /*yield*/,
            deps.sendLineReplyChunks({
              to: to,
              chunks: chunks,
              quickReplies: lineData.quickReplies,
              replyToken: replyToken,
              replyTokenUsed: replyTokenUsed,
              accountId: accountId,
              replyMessageLine: deps.replyMessageLine,
              pushMessageLine: deps.pushMessageLine,
              pushTextMessageWithQuickReplies: deps.pushTextMessageWithQuickReplies,
              createTextMessageWithQuickReplies: deps.createTextMessageWithQuickReplies,
            }),
          ];
        case 5:
          nextReplyTokenUsed = _e.sent().replyTokenUsed;
          replyTokenUsed = nextReplyTokenUsed;
          if (!(!hasQuickReplies || !hasRichOrMedia)) {
            return [3 /*break*/, 8];
          }
          return [4 /*yield*/, sendLineMessages(richMessages, false)];
        case 6:
          _e.sent();
          if (!(mediaMessages.length > 0)) {
            return [3 /*break*/, 8];
          }
          return [4 /*yield*/, sendLineMessages(mediaMessages, false)];
        case 7:
          _e.sent();
          _e.label = 8;
        case 8:
          return [3 /*break*/, 11];
        case 9:
          combined = __spreadArray(__spreadArray([], richMessages, true), mediaMessages, true);
          if (hasQuickReplies && combined.length > 0) {
            quickReply = deps.createQuickReplyItems(lineData.quickReplies);
            targetIndex =
              replyToken && !replyTokenUsed
                ? Math.min(4, combined.length - 1)
                : combined.length - 1;
            target = combined[targetIndex];
            combined[targetIndex] = __assign(__assign({}, target), { quickReply: quickReply });
          }
          return [4 /*yield*/, sendLineMessages(combined, true)];
        case 10:
          _e.sent();
          _e.label = 11;
        case 11:
          return [2 /*return*/, { replyTokenUsed: replyTokenUsed }];
      }
    });
  });
}
