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
exports.sendMessageSlack = sendMessageSlack;
var chunk_js_1 = require("../auto-reply/chunk.js");
var config_js_1 = require("../config/config.js");
var globals_js_1 = require("../globals.js");
var media_js_1 = require("../web/media.js");
var accounts_js_1 = require("./accounts.js");
var client_js_1 = require("./client.js");
var format_js_1 = require("./format.js");
var markdown_tables_js_1 = require("../config/markdown-tables.js");
var targets_js_1 = require("./targets.js");
var token_js_1 = require("./token.js");
var SLACK_TEXT_LIMIT = 4000;
function resolveToken(params) {
  var _a;
  var explicit = (0, token_js_1.resolveSlackBotToken)(params.explicit);
  if (explicit) {
    return explicit;
  }
  var fallback = (0, token_js_1.resolveSlackBotToken)(params.fallbackToken);
  if (!fallback) {
    (0, globals_js_1.logVerbose)(
      "slack send: missing bot token for account="
        .concat(params.accountId, " explicit=")
        .concat(Boolean(params.explicit), " source=")
        .concat((_a = params.fallbackSource) !== null && _a !== void 0 ? _a : "unknown"),
    );
    throw new Error(
      'Slack bot token missing for account "'
        .concat(params.accountId, '" (set channels.slack.accounts.')
        .concat(params.accountId, ".botToken or SLACK_BOT_TOKEN for default)."),
    );
  }
  return fallback;
}
function parseRecipient(raw) {
  var target = (0, targets_js_1.parseSlackTarget)(raw);
  if (!target) {
    throw new Error("Recipient is required for Slack sends");
  }
  return { kind: target.kind, id: target.id };
}
function resolveChannelId(client, recipient) {
  return __awaiter(this, void 0, void 0, function () {
    var response, channelId;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (recipient.kind === "channel") {
            return [2 /*return*/, { channelId: recipient.id }];
          }
          return [4 /*yield*/, client.conversations.open({ users: recipient.id })];
        case 1:
          response = _b.sent();
          channelId = (_a = response.channel) === null || _a === void 0 ? void 0 : _a.id;
          if (!channelId) {
            throw new Error("Failed to open Slack DM channel");
          }
          return [2 /*return*/, { channelId: channelId, isDm: true }];
      }
    });
  });
}
function uploadSlackFile(params) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, buffer, _contentType, fileName, basePayload, payload, response, parsed, fileId;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
      switch (_m.label) {
        case 0:
          return [4 /*yield*/, (0, media_js_1.loadWebMedia)(params.mediaUrl, params.maxBytes)];
        case 1:
          ((_a = _m.sent()),
            (buffer = _a.buffer),
            (_contentType = _a.contentType),
            (fileName = _a.fileName));
          basePayload = __assign(
            { channel_id: params.channelId, file: buffer, filename: fileName },
            params.caption ? { initial_comment: params.caption } : {},
          );
          payload = params.threadTs
            ? __assign(__assign({}, basePayload), { thread_ts: params.threadTs })
            : basePayload;
          return [4 /*yield*/, params.client.files.uploadV2(payload)];
        case 2:
          response = _m.sent();
          parsed = response;
          fileId =
            (_l =
              (_j =
                (_f =
                  (_d =
                    (_c = (_b = parsed.files) === null || _b === void 0 ? void 0 : _b[0]) ===
                      null || _c === void 0
                      ? void 0
                      : _c.id) !== null && _d !== void 0
                    ? _d
                    : (_e = parsed.file) === null || _e === void 0
                      ? void 0
                      : _e.id) !== null && _f !== void 0
                  ? _f
                  : (_h = (_g = parsed.files) === null || _g === void 0 ? void 0 : _g[0]) ===
                        null || _h === void 0
                    ? void 0
                    : _h.name) !== null && _j !== void 0
                ? _j
                : (_k = parsed.file) === null || _k === void 0
                  ? void 0
                  : _k.name) !== null && _l !== void 0
              ? _l
              : "unknown";
          return [2 /*return*/, fileId];
      }
    });
  });
}
function sendMessageSlack(to_1, message_1) {
  return __awaiter(this, arguments, void 0, function (to, message, opts) {
    var trimmedMessage,
      cfg,
      account,
      token,
      client,
      recipient,
      channelId,
      textLimit,
      chunkLimit,
      tableMode,
      chunkMode,
      markdownChunks,
      chunks,
      mediaMaxBytes,
      lastMessageId,
      firstChunk,
      rest,
      _i,
      rest_1,
      chunk,
      response,
      _a,
      _b,
      chunk,
      response;
    var _c, _d, _e, _f;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          trimmedMessage =
            (_c = message === null || message === void 0 ? void 0 : message.trim()) !== null &&
            _c !== void 0
              ? _c
              : "";
          if (!trimmedMessage && !opts.mediaUrl) {
            throw new Error("Slack send requires text or media");
          }
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveSlackAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          token = resolveToken({
            explicit: opts.token,
            accountId: account.accountId,
            fallbackToken: account.botToken,
            fallbackSource: account.botTokenSource,
          });
          client =
            (_d = opts.client) !== null && _d !== void 0
              ? _d
              : (0, client_js_1.createSlackWebClient)(token);
          recipient = parseRecipient(to);
          return [4 /*yield*/, resolveChannelId(client, recipient)];
        case 1:
          channelId = _g.sent().channelId;
          textLimit = (0, chunk_js_1.resolveTextChunkLimit)(cfg, "slack", account.accountId);
          chunkLimit = Math.min(textLimit, SLACK_TEXT_LIMIT);
          tableMode = (0, markdown_tables_js_1.resolveMarkdownTableMode)({
            cfg: cfg,
            channel: "slack",
            accountId: account.accountId,
          });
          chunkMode = (0, chunk_js_1.resolveChunkMode)(cfg, "slack", account.accountId);
          markdownChunks =
            chunkMode === "newline"
              ? (0, chunk_js_1.chunkMarkdownTextWithMode)(trimmedMessage, chunkLimit, chunkMode)
              : [trimmedMessage];
          chunks = markdownChunks.flatMap(function (markdown) {
            return (0, format_js_1.markdownToSlackMrkdwnChunks)(markdown, chunkLimit, {
              tableMode: tableMode,
            });
          });
          if (!chunks.length && trimmedMessage) {
            chunks.push(trimmedMessage);
          }
          mediaMaxBytes =
            typeof account.config.mediaMaxMb === "number"
              ? account.config.mediaMaxMb * 1024 * 1024
              : undefined;
          lastMessageId = "";
          if (!opts.mediaUrl) {
            return [3 /*break*/, 7];
          }
          ((firstChunk = chunks[0]), (rest = chunks.slice(1)));
          return [
            4 /*yield*/,
            uploadSlackFile({
              client: client,
              channelId: channelId,
              mediaUrl: opts.mediaUrl,
              caption: firstChunk,
              threadTs: opts.threadTs,
              maxBytes: mediaMaxBytes,
            }),
          ];
        case 2:
          lastMessageId = _g.sent();
          ((_i = 0), (rest_1 = rest));
          _g.label = 3;
        case 3:
          if (!(_i < rest_1.length)) {
            return [3 /*break*/, 6];
          }
          chunk = rest_1[_i];
          return [
            4 /*yield*/,
            client.chat.postMessage({
              channel: channelId,
              text: chunk,
              thread_ts: opts.threadTs,
            }),
          ];
        case 4:
          response = _g.sent();
          lastMessageId = (_e = response.ts) !== null && _e !== void 0 ? _e : lastMessageId;
          _g.label = 5;
        case 5:
          _i++;
          return [3 /*break*/, 3];
        case 6:
          return [3 /*break*/, 11];
        case 7:
          ((_a = 0), (_b = chunks.length ? chunks : [""]));
          _g.label = 8;
        case 8:
          if (!(_a < _b.length)) {
            return [3 /*break*/, 11];
          }
          chunk = _b[_a];
          return [
            4 /*yield*/,
            client.chat.postMessage({
              channel: channelId,
              text: chunk,
              thread_ts: opts.threadTs,
            }),
          ];
        case 9:
          response = _g.sent();
          lastMessageId = (_f = response.ts) !== null && _f !== void 0 ? _f : lastMessageId;
          _g.label = 10;
        case 10:
          _a++;
          return [3 /*break*/, 8];
        case 11:
          return [
            2 /*return*/,
            {
              messageId: lastMessageId || "unknown",
              channelId: channelId,
            },
          ];
      }
    });
  });
}
