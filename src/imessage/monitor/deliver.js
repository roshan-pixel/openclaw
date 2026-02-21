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
exports.deliverReplies = deliverReplies;
var chunk_js_1 = require("../../auto-reply/chunk.js");
var config_js_1 = require("../../config/config.js");
var markdown_tables_js_1 = require("../../config/markdown-tables.js");
var tables_js_1 = require("../../markdown/tables.js");
var send_js_1 = require("../send.js");
function deliverReplies(params) {
  return __awaiter(this, void 0, void 0, function () {
    var replies,
      target,
      client,
      runtime,
      maxBytes,
      textLimit,
      accountId,
      cfg,
      tableMode,
      chunkMode,
      _i,
      replies_1,
      payload,
      mediaList,
      rawText,
      text,
      _a,
      _b,
      chunk,
      first,
      _c,
      mediaList_1,
      url,
      caption;
    var _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          ((replies = params.replies),
            (target = params.target),
            (client = params.client),
            (runtime = params.runtime),
            (maxBytes = params.maxBytes),
            (textLimit = params.textLimit),
            (accountId = params.accountId));
          cfg = (0, config_js_1.loadConfig)();
          tableMode = (0, markdown_tables_js_1.resolveMarkdownTableMode)({
            cfg: cfg,
            channel: "imessage",
            accountId: accountId,
          });
          chunkMode = (0, chunk_js_1.resolveChunkMode)(cfg, "imessage", accountId);
          ((_i = 0), (replies_1 = replies));
          _g.label = 1;
        case 1:
          if (!(_i < replies_1.length)) {
            return [3 /*break*/, 12];
          }
          payload = replies_1[_i];
          mediaList =
            (_d = payload.mediaUrls) !== null && _d !== void 0
              ? _d
              : payload.mediaUrl
                ? [payload.mediaUrl]
                : [];
          rawText = (_e = payload.text) !== null && _e !== void 0 ? _e : "";
          text = (0, tables_js_1.convertMarkdownTables)(rawText, tableMode);
          if (!text && mediaList.length === 0) {
            return [3 /*break*/, 11];
          }
          if (!(mediaList.length === 0)) {
            return [3 /*break*/, 6];
          }
          ((_a = 0), (_b = (0, chunk_js_1.chunkTextWithMode)(text, textLimit, chunkMode)));
          _g.label = 2;
        case 2:
          if (!(_a < _b.length)) {
            return [3 /*break*/, 5];
          }
          chunk = _b[_a];
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageIMessage)(target, chunk, {
              maxBytes: maxBytes,
              client: client,
              accountId: accountId,
            }),
          ];
        case 3:
          _g.sent();
          _g.label = 4;
        case 4:
          _a++;
          return [3 /*break*/, 2];
        case 5:
          return [3 /*break*/, 10];
        case 6:
          first = true;
          ((_c = 0), (mediaList_1 = mediaList));
          _g.label = 7;
        case 7:
          if (!(_c < mediaList_1.length)) {
            return [3 /*break*/, 10];
          }
          url = mediaList_1[_c];
          caption = first ? text : "";
          first = false;
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageIMessage)(target, caption, {
              mediaUrl: url,
              maxBytes: maxBytes,
              client: client,
              accountId: accountId,
            }),
          ];
        case 8:
          _g.sent();
          _g.label = 9;
        case 9:
          _c++;
          return [3 /*break*/, 7];
        case 10:
          (_f = runtime.log) === null || _f === void 0
            ? void 0
            : _f.call(runtime, "imessage: delivered reply to ".concat(target));
          _g.label = 11;
        case 11:
          _i++;
          return [3 /*break*/, 1];
        case 12:
          return [2 /*return*/];
      }
    });
  });
}
