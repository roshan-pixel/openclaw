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
exports.sendMessageIMessage = sendMessageIMessage;
var config_js_1 = require("../config/config.js");
var markdown_tables_js_1 = require("../config/markdown-tables.js");
var constants_js_1 = require("../media/constants.js");
var store_js_1 = require("../media/store.js");
var media_js_1 = require("../web/media.js");
var tables_js_1 = require("../markdown/tables.js");
var accounts_js_1 = require("./accounts.js");
var client_js_1 = require("./client.js");
var targets_js_1 = require("./targets.js");
function resolveMessageId(result) {
  if (!result) {
    return null;
  }
  var raw =
    (typeof result.messageId === "string" && result.messageId.trim()) ||
    (typeof result.message_id === "string" && result.message_id.trim()) ||
    (typeof result.id === "string" && result.id.trim()) ||
    (typeof result.guid === "string" && result.guid.trim()) ||
    (typeof result.message_id === "number" ? String(result.message_id) : null) ||
    (typeof result.id === "number" ? String(result.id) : null);
  return raw ? String(raw).trim() : null;
}
function resolveAttachment(mediaUrl, maxBytes) {
  return __awaiter(this, void 0, void 0, function () {
    var media, saved;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, (0, media_js_1.loadWebMedia)(mediaUrl, maxBytes)];
        case 1:
          media = _b.sent();
          return [
            4 /*yield*/,
            (0, store_js_1.saveMediaBuffer)(
              media.buffer,
              (_a = media.contentType) !== null && _a !== void 0 ? _a : undefined,
              "outbound",
              maxBytes,
            ),
          ];
        case 2:
          saved = _b.sent();
          return [2 /*return*/, { path: saved.path, contentType: saved.contentType }];
      }
    });
  });
}
function sendMessageIMessage(to_1, text_1) {
  return __awaiter(this, arguments, void 0, function (to, text, opts) {
    var cfg,
      account,
      cliPath,
      dbPath,
      target,
      service,
      region,
      maxBytes,
      message,
      filePath,
      resolved,
      kind,
      tableMode,
      params,
      client,
      _a,
      shouldClose,
      result,
      resolvedId;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_o) {
      switch (_o.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveIMessageAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          cliPath =
            ((_b = opts.cliPath) === null || _b === void 0 ? void 0 : _b.trim()) ||
            ((_c = account.config.cliPath) === null || _c === void 0 ? void 0 : _c.trim()) ||
            "imsg";
          dbPath =
            ((_d = opts.dbPath) === null || _d === void 0 ? void 0 : _d.trim()) ||
            ((_e = account.config.dbPath) === null || _e === void 0 ? void 0 : _e.trim());
          target = (0, targets_js_1.parseIMessageTarget)(
            opts.chatId ? (0, targets_js_1.formatIMessageChatTarget)(opts.chatId) : to,
          );
          service =
            (_g =
              (_f = opts.service) !== null && _f !== void 0
                ? _f
                : target.kind === "handle"
                  ? target.service
                  : undefined) !== null && _g !== void 0
              ? _g
              : account.config.service;
          region =
            ((_h = opts.region) === null || _h === void 0 ? void 0 : _h.trim()) ||
            ((_j = account.config.region) === null || _j === void 0 ? void 0 : _j.trim()) ||
            "US";
          maxBytes =
            typeof opts.maxBytes === "number"
              ? opts.maxBytes
              : typeof account.config.mediaMaxMb === "number"
                ? account.config.mediaMaxMb * 1024 * 1024
                : 16 * 1024 * 1024;
          message = text !== null && text !== void 0 ? text : "";
          if (!((_k = opts.mediaUrl) === null || _k === void 0 ? void 0 : _k.trim())) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, resolveAttachment(opts.mediaUrl.trim(), maxBytes)];
        case 1:
          resolved = _o.sent();
          filePath = resolved.path;
          if (!message.trim()) {
            kind = (0, constants_js_1.mediaKindFromMime)(
              (_l = resolved.contentType) !== null && _l !== void 0 ? _l : undefined,
            );
            if (kind) {
              message = kind === "image" ? "<media:image>" : "<media:".concat(kind, ">");
            }
          }
          _o.label = 2;
        case 2:
          if (!message.trim() && !filePath) {
            throw new Error("iMessage send requires text or media");
          }
          if (message.trim()) {
            tableMode = (0, markdown_tables_js_1.resolveMarkdownTableMode)({
              cfg: cfg,
              channel: "imessage",
              accountId: account.accountId,
            });
            message = (0, tables_js_1.convertMarkdownTables)(message, tableMode);
          }
          params = {
            text: message,
            service: service || "auto",
            region: region,
          };
          if (filePath) {
            params.file = filePath;
          }
          if (target.kind === "chat_id") {
            params.chat_id = target.chatId;
          } else if (target.kind === "chat_guid") {
            params.chat_guid = target.chatGuid;
          } else if (target.kind === "chat_identifier") {
            params.chat_identifier = target.chatIdentifier;
          } else {
            params.to = target.to;
          }
          if (!((_m = opts.client) !== null && _m !== void 0)) {
            return [3 /*break*/, 3];
          }
          _a = _m;
          return [3 /*break*/, 5];
        case 3:
          return [
            4 /*yield*/,
            (0, client_js_1.createIMessageRpcClient)({ cliPath: cliPath, dbPath: dbPath }),
          ];
        case 4:
          _a = _o.sent();
          _o.label = 5;
        case 5:
          client = _a;
          shouldClose = !opts.client;
          _o.label = 6;
        case 6:
          _o.trys.push([6, , 8, 11]);
          return [
            4 /*yield*/,
            client.request("send", params, {
              timeoutMs: opts.timeoutMs,
            }),
          ];
        case 7:
          result = _o.sent();
          resolvedId = resolveMessageId(result);
          return [
            2 /*return*/,
            {
              messageId:
                resolvedId !== null && resolvedId !== void 0
                  ? resolvedId
                  : (result === null || result === void 0 ? void 0 : result.ok)
                    ? "ok"
                    : "unknown",
            },
          ];
        case 8:
          if (!shouldClose) {
            return [3 /*break*/, 10];
          }
          return [4 /*yield*/, client.stop()];
        case 9:
          _o.sent();
          _o.label = 10;
        case 10:
          return [7 /*endfinally*/];
        case 11:
          return [2 /*return*/];
      }
    });
  });
}
