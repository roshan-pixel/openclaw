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
exports.createTelegramMessageProcessor = void 0;
// @ts-nocheck
var bot_message_context_js_1 = require("./bot-message-context.js");
var bot_message_dispatch_js_1 = require("./bot-message-dispatch.js");
var createTelegramMessageProcessor = function (deps) {
  var bot = deps.bot,
    cfg = deps.cfg,
    account = deps.account,
    telegramCfg = deps.telegramCfg,
    historyLimit = deps.historyLimit,
    groupHistories = deps.groupHistories,
    dmPolicy = deps.dmPolicy,
    allowFrom = deps.allowFrom,
    groupAllowFrom = deps.groupAllowFrom,
    ackReactionScope = deps.ackReactionScope,
    logger = deps.logger,
    resolveGroupActivation = deps.resolveGroupActivation,
    resolveGroupRequireMention = deps.resolveGroupRequireMention,
    resolveTelegramGroupConfig = deps.resolveTelegramGroupConfig,
    runtime = deps.runtime,
    replyToMode = deps.replyToMode,
    streamMode = deps.streamMode,
    textLimit = deps.textLimit,
    opts = deps.opts,
    resolveBotTopicsEnabled = deps.resolveBotTopicsEnabled;
  return function (primaryCtx, allMedia, storeAllowFrom, options) {
    return __awaiter(void 0, void 0, void 0, function () {
      var context;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              (0, bot_message_context_js_1.buildTelegramMessageContext)({
                primaryCtx: primaryCtx,
                allMedia: allMedia,
                storeAllowFrom: storeAllowFrom,
                options: options,
                bot: bot,
                cfg: cfg,
                account: account,
                historyLimit: historyLimit,
                groupHistories: groupHistories,
                dmPolicy: dmPolicy,
                allowFrom: allowFrom,
                groupAllowFrom: groupAllowFrom,
                ackReactionScope: ackReactionScope,
                logger: logger,
                resolveGroupActivation: resolveGroupActivation,
                resolveGroupRequireMention: resolveGroupRequireMention,
                resolveTelegramGroupConfig: resolveTelegramGroupConfig,
              }),
            ];
          case 1:
            context = _a.sent();
            if (!context) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              (0, bot_message_dispatch_js_1.dispatchTelegramMessage)({
                context: context,
                bot: bot,
                cfg: cfg,
                runtime: runtime,
                replyToMode: replyToMode,
                streamMode: streamMode,
                textLimit: textLimit,
                telegramCfg: telegramCfg,
                opts: opts,
                resolveBotTopicsEnabled: resolveBotTopicsEnabled,
              }),
            ];
          case 2:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
};
exports.createTelegramMessageProcessor = createTelegramMessageProcessor;
