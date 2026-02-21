"use strict";
/**
 * Provider-agnostic reply router.
 *
 * Routes replies to the originating channel based on OriginatingChannel/OriginatingTo
 * instead of using the session's lastChannel. This ensures replies go back to the
 * provider where the message originated, even when the main session is shared
 * across multiple providers.
 */
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
exports.routeReply = routeReply;
exports.isRoutableChannel = isRoutableChannel;
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var identity_js_1 = require("../../agents/identity.js");
var index_js_1 = require("../../channels/plugins/index.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var normalize_reply_js_1 = require("./normalize-reply.js");
/**
 * Routes a reply payload to the specified channel.
 *
 * This function provides a unified interface for sending messages to any
 * supported provider. It's used by the followup queue to route replies
 * back to the originating channel when OriginatingChannel/OriginatingTo
 * are set.
 */
function routeReply(params) {
  return __awaiter(this, void 0, void 0, function () {
    var payload,
      channel,
      to,
      accountId,
      threadId,
      cfg,
      abortSignal,
      responsePrefix,
      normalized,
      text,
      mediaUrls,
      replyToId,
      channelId,
      resolvedReplyToId,
      resolvedThreadId,
      deliverOutboundPayloads,
      results,
      last,
      err_1,
      message;
    var _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          ((payload = params.payload),
            (channel = params.channel),
            (to = params.to),
            (accountId = params.accountId),
            (threadId = params.threadId),
            (cfg = params.cfg),
            (abortSignal = params.abortSignal));
          responsePrefix = params.sessionKey
            ? (0, identity_js_1.resolveEffectiveMessagesConfig)(
                cfg,
                (0, agent_scope_js_1.resolveSessionAgentId)({
                  sessionKey: params.sessionKey,
                  config: cfg,
                }),
              ).responsePrefix
            : ((_a = cfg.messages) === null || _a === void 0 ? void 0 : _a.responsePrefix) ===
                "auto"
              ? undefined
              : (_b = cfg.messages) === null || _b === void 0
                ? void 0
                : _b.responsePrefix;
          normalized = (0, normalize_reply_js_1.normalizeReplyPayload)(payload, {
            responsePrefix: responsePrefix,
          });
          if (!normalized) {
            return [2 /*return*/, { ok: true }];
          }
          text = (_c = normalized.text) !== null && _c !== void 0 ? _c : "";
          mediaUrls = ((_e =
            (_d = normalized.mediaUrls) === null || _d === void 0 ? void 0 : _d.filter(Boolean)) !==
            null && _e !== void 0
            ? _e
            : []
          ).length
            ? (_f = normalized.mediaUrls) === null || _f === void 0
              ? void 0
              : _f.filter(Boolean)
            : normalized.mediaUrl
              ? [normalized.mediaUrl]
              : [];
          replyToId = normalized.replyToId;
          // Skip empty replies.
          if (!text.trim() && mediaUrls.length === 0) {
            return [2 /*return*/, { ok: true }];
          }
          if (channel === message_channel_js_1.INTERNAL_MESSAGE_CHANNEL) {
            return [
              2 /*return*/,
              {
                ok: false,
                error: "Webchat routing not supported for queued replies",
              },
            ];
          }
          channelId =
            (_g = (0, index_js_1.normalizeChannelId)(channel)) !== null && _g !== void 0
              ? _g
              : null;
          if (!channelId) {
            return [
              2 /*return*/,
              { ok: false, error: "Unknown channel: ".concat(String(channel)) },
            ];
          }
          if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
            return [2 /*return*/, { ok: false, error: "Reply routing aborted" }];
          }
          resolvedReplyToId =
            replyToId !== null && replyToId !== void 0
              ? replyToId
              : channelId === "slack" && threadId != null && threadId !== ""
                ? String(threadId)
                : undefined;
          resolvedThreadId =
            channelId === "slack"
              ? null
              : threadId !== null && threadId !== void 0
                ? threadId
                : null;
          _h.label = 1;
        case 1:
          _h.trys.push([1, 4, , 5]);
          return [
            4 /*yield*/,
            Promise.resolve().then(function () {
              return require("../../infra/outbound/deliver.js");
            }),
          ];
        case 2:
          deliverOutboundPayloads = _h.sent().deliverOutboundPayloads;
          return [
            4 /*yield*/,
            deliverOutboundPayloads({
              cfg: cfg,
              channel: channelId,
              to: to,
              accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
              payloads: [normalized],
              replyToId:
                resolvedReplyToId !== null && resolvedReplyToId !== void 0
                  ? resolvedReplyToId
                  : null,
              threadId: resolvedThreadId,
              abortSignal: abortSignal,
              mirror:
                params.mirror !== false && params.sessionKey
                  ? {
                      sessionKey: params.sessionKey,
                      agentId: (0, agent_scope_js_1.resolveSessionAgentId)({
                        sessionKey: params.sessionKey,
                        config: cfg,
                      }),
                      text: text,
                      mediaUrls: mediaUrls,
                    }
                  : undefined,
            }),
          ];
        case 3:
          results = _h.sent();
          last = results.at(-1);
          return [
            2 /*return*/,
            { ok: true, messageId: last === null || last === void 0 ? void 0 : last.messageId },
          ];
        case 4:
          err_1 = _h.sent();
          message = err_1 instanceof Error ? err_1.message : String(err_1);
          return [
            2 /*return*/,
            {
              ok: false,
              error: "Failed to route reply to ".concat(channel, ": ").concat(message),
            },
          ];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
/**
 * Checks if a channel type is routable via routeReply.
 *
 * Some channels (webchat) require special handling and cannot be routed through
 * this generic interface.
 */
function isRoutableChannel(channel) {
  if (!channel || channel === message_channel_js_1.INTERNAL_MESSAGE_CHANNEL) {
    return false;
  }
  return (0, index_js_1.normalizeChannelId)(channel) !== null;
}
