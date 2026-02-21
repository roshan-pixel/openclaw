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
exports.createWebOnMessageHandler = createWebOnMessageHandler;
var globals_js_1 = require("../../../globals.js");
var resolve_route_js_1 = require("../../../routing/resolve-route.js");
var session_key_js_1 = require("../../../routing/session-key.js");
var utils_js_1 = require("../../../utils.js");
var broadcast_js_1 = require("./broadcast.js");
var group_gating_js_1 = require("./group-gating.js");
var last_route_js_1 = require("./last-route.js");
var peer_js_1 = require("./peer.js");
var process_message_js_1 = require("./process-message.js");
function createWebOnMessageHandler(params) {
  var _this = this;
  var processForRoute = function (msg, route, groupHistoryKey, opts) {
    return __awaiter(_this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        return [
          2 /*return*/,
          (0, process_message_js_1.processMessage)({
            cfg: params.cfg,
            msg: msg,
            route: route,
            groupHistoryKey: groupHistoryKey,
            groupHistories: params.groupHistories,
            groupMemberNames: params.groupMemberNames,
            connectionId: params.connectionId,
            verbose: params.verbose,
            maxMediaBytes: params.maxMediaBytes,
            replyResolver: params.replyResolver,
            replyLogger: params.replyLogger,
            backgroundTasks: params.backgroundTasks,
            rememberSentText: params.echoTracker.rememberText,
            echoHas: params.echoTracker.has,
            echoForget: params.echoTracker.forget,
            buildCombinedEchoKey: params.echoTracker.buildCombinedKey,
            groupHistory: opts === null || opts === void 0 ? void 0 : opts.groupHistory,
            suppressGroupHistoryClear:
              opts === null || opts === void 0 ? void 0 : opts.suppressGroupHistoryClear,
          }),
        ];
      });
    });
  };
  return function (msg) {
    return __awaiter(_this, void 0, void 0, function () {
      var conversationId, peerId, route, groupHistoryKey, metaCtx, gating;
      var _a, _b, _c;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            conversationId = (_a = msg.conversationId) !== null && _a !== void 0 ? _a : msg.from;
            peerId = (0, peer_js_1.resolvePeerId)(msg);
            route = (0, resolve_route_js_1.resolveAgentRoute)({
              cfg: params.cfg,
              channel: "whatsapp",
              accountId: msg.accountId,
              peer: {
                kind: msg.chatType === "group" ? "group" : "dm",
                id: peerId,
              },
            });
            groupHistoryKey =
              msg.chatType === "group"
                ? (0, session_key_js_1.buildGroupHistoryKey)({
                    channel: "whatsapp",
                    accountId: route.accountId,
                    peerKind: "group",
                    peerId: peerId,
                  })
                : route.sessionKey;
            // Same-phone mode logging retained
            if (msg.from === msg.to) {
              (0, globals_js_1.logVerbose)(
                "\uD83D\uDCF1 Same-phone mode detected (from === to: ".concat(msg.from, ")"),
              );
            }
            // Skip if this is a message we just sent (echo detection)
            if (params.echoTracker.has(msg.body)) {
              (0, globals_js_1.logVerbose)(
                "Skipping auto-reply: detected echo (message matches recently sent text)",
              );
              params.echoTracker.forget(msg.body);
              return [2 /*return*/];
            }
            if (msg.chatType === "group") {
              metaCtx = {
                From: msg.from,
                To: msg.to,
                SessionKey: route.sessionKey,
                AccountId: route.accountId,
                ChatType: msg.chatType,
                ConversationLabel: conversationId,
                GroupSubject: msg.groupSubject,
                SenderName: msg.senderName,
                SenderId:
                  ((_b = msg.senderJid) === null || _b === void 0 ? void 0 : _b.trim()) ||
                  msg.senderE164,
                SenderE164: msg.senderE164,
                Provider: "whatsapp",
                Surface: "whatsapp",
                OriginatingChannel: "whatsapp",
                OriginatingTo: conversationId,
              };
              (0, last_route_js_1.updateLastRouteInBackground)({
                cfg: params.cfg,
                backgroundTasks: params.backgroundTasks,
                storeAgentId: route.agentId,
                sessionKey: route.sessionKey,
                channel: "whatsapp",
                to: conversationId,
                accountId: route.accountId,
                ctx: metaCtx,
                warn: params.replyLogger.warn.bind(params.replyLogger),
              });
              gating = (0, group_gating_js_1.applyGroupGating)({
                cfg: params.cfg,
                msg: msg,
                conversationId: conversationId,
                groupHistoryKey: groupHistoryKey,
                agentId: route.agentId,
                sessionKey: route.sessionKey,
                baseMentionConfig: params.baseMentionConfig,
                authDir: params.account.authDir,
                groupHistories: params.groupHistories,
                groupHistoryLimit: params.groupHistoryLimit,
                groupMemberNames: params.groupMemberNames,
                logVerbose: globals_js_1.logVerbose,
                replyLogger: params.replyLogger,
              });
              if (!gating.shouldProcess) {
                return [2 /*return*/];
              }
            } else {
              // Ensure `peerId` for DMs is stable and stored as E.164 when possible.
              if (!msg.senderE164 && peerId && peerId.startsWith("+")) {
                msg.senderE164 =
                  (_c = (0, utils_js_1.normalizeE164)(peerId)) !== null && _c !== void 0
                    ? _c
                    : msg.senderE164;
              }
            }
            return [
              4 /*yield*/,
              (0, broadcast_js_1.maybeBroadcastMessage)({
                cfg: params.cfg,
                msg: msg,
                peerId: peerId,
                route: route,
                groupHistoryKey: groupHistoryKey,
                groupHistories: params.groupHistories,
                processMessage: processForRoute,
              }),
            ];
          case 1:
            // Broadcast groups: when we'd reply anyway, run multiple agents.
            // Does not bypass group mention/activation gating above.
            if (_d.sent()) {
              return [2 /*return*/];
            }
            return [4 /*yield*/, processForRoute(msg, route, groupHistoryKey)];
          case 2:
            _d.sent();
            return [2 /*return*/];
        }
      });
    });
  };
}
