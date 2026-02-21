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
exports.deliverDiscordReply = deliverDiscordReply;
var tables_js_1 = require("../../markdown/tables.js");
var chunk_js_1 = require("../chunk.js");
var send_js_1 = require("../send.js");
function deliverDiscordReply(params) {
  return __awaiter(this, void 0, void 0, function () {
    var chunkLimit,
      _i,
      _a,
      payload,
      mediaList,
      rawText,
      tableMode,
      text,
      replyTo,
      isFirstChunk,
      mode,
      chunks,
      _b,
      chunks_1,
      chunk,
      trimmed,
      firstMedia,
      _c,
      _d,
      extra;
    var _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
      switch (_k.label) {
        case 0:
          chunkLimit = Math.min(params.textLimit, 2000);
          ((_i = 0), (_a = params.replies));
          _k.label = 1;
        case 1:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 12];
          }
          payload = _a[_i];
          mediaList =
            (_e = payload.mediaUrls) !== null && _e !== void 0
              ? _e
              : payload.mediaUrl
                ? [payload.mediaUrl]
                : [];
          rawText = (_f = payload.text) !== null && _f !== void 0 ? _f : "";
          tableMode = (_g = params.tableMode) !== null && _g !== void 0 ? _g : "code";
          text = (0, tables_js_1.convertMarkdownTables)(rawText, tableMode);
          if (!text && mediaList.length === 0) {
            return [3 /*break*/, 11];
          }
          replyTo =
            ((_h = params.replyToId) === null || _h === void 0 ? void 0 : _h.trim()) || undefined;
          if (!(mediaList.length === 0)) {
            return [3 /*break*/, 6];
          }
          isFirstChunk = true;
          mode = (_j = params.chunkMode) !== null && _j !== void 0 ? _j : "length";
          chunks = (0, chunk_js_1.chunkDiscordTextWithMode)(text, {
            maxChars: chunkLimit,
            maxLines: params.maxLinesPerMessage,
            chunkMode: mode,
          });
          if (!chunks.length && text) {
            chunks.push(text);
          }
          ((_b = 0), (chunks_1 = chunks));
          _k.label = 2;
        case 2:
          if (!(_b < chunks_1.length)) {
            return [3 /*break*/, 5];
          }
          chunk = chunks_1[_b];
          trimmed = chunk.trim();
          if (!trimmed) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageDiscord)(params.target, trimmed, {
              token: params.token,
              rest: params.rest,
              accountId: params.accountId,
              replyTo: isFirstChunk ? replyTo : undefined,
            }),
          ];
        case 3:
          _k.sent();
          isFirstChunk = false;
          _k.label = 4;
        case 4:
          _b++;
          return [3 /*break*/, 2];
        case 5:
          return [3 /*break*/, 11];
        case 6:
          firstMedia = mediaList[0];
          if (!firstMedia) {
            return [3 /*break*/, 11];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageDiscord)(params.target, text, {
              token: params.token,
              rest: params.rest,
              mediaUrl: firstMedia,
              accountId: params.accountId,
              replyTo: replyTo,
            }),
          ];
        case 7:
          _k.sent();
          ((_c = 0), (_d = mediaList.slice(1)));
          _k.label = 8;
        case 8:
          if (!(_c < _d.length)) {
            return [3 /*break*/, 11];
          }
          extra = _d[_c];
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageDiscord)(params.target, "", {
              token: params.token,
              rest: params.rest,
              mediaUrl: extra,
              accountId: params.accountId,
            }),
          ];
        case 9:
          _k.sent();
          _k.label = 10;
        case 10:
          _c++;
          return [3 /*break*/, 8];
        case 11:
          _i++;
          return [3 /*break*/, 1];
        case 12:
          return [2 /*return*/];
      }
    });
  });
}
