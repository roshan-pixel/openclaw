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
exports.sendMessage = sendMessage;
exports.sendPoll = sendPoll;
var index_js_1 = require("../../channels/plugins/index.js");
var config_js_1 = require("../../config/config.js");
var call_js_1 = require("../../gateway/call.js");
var polls_js_1 = require("../../polls.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var channel_selection_js_1 = require("./channel-selection.js");
var deliver_js_1 = require("./deliver.js");
var payloads_js_1 = require("./payloads.js");
var targets_js_1 = require("./targets.js");
function resolveGatewayOptions(opts) {
  var _a, _b;
  return {
    url: opts === null || opts === void 0 ? void 0 : opts.url,
    token: opts === null || opts === void 0 ? void 0 : opts.token,
    timeoutMs:
      typeof (opts === null || opts === void 0 ? void 0 : opts.timeoutMs) === "number" &&
      Number.isFinite(opts.timeoutMs)
        ? Math.max(1, Math.floor(opts.timeoutMs))
        : 10000,
    clientName:
      (_a = opts === null || opts === void 0 ? void 0 : opts.clientName) !== null && _a !== void 0
        ? _a
        : message_channel_js_1.GATEWAY_CLIENT_NAMES.CLI,
    clientDisplayName: opts === null || opts === void 0 ? void 0 : opts.clientDisplayName,
    mode:
      (_b = opts === null || opts === void 0 ? void 0 : opts.mode) !== null && _b !== void 0
        ? _b
        : message_channel_js_1.GATEWAY_CLIENT_MODES.CLI,
  };
}
function sendMessage(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      channel,
      _a,
      plugin,
      deliveryMode,
      normalizedPayloads,
      mirrorText,
      mirrorMediaUrls,
      primaryMediaUrl,
      outboundChannel,
      resolvedTarget,
      results,
      gateway,
      result;
    var _b, _c, _d, _e, _f, _g, _h, _j;
    return __generator(this, function (_k) {
      switch (_k.label) {
        case 0:
          cfg = (_b = params.cfg) !== null && _b !== void 0 ? _b : (0, config_js_1.loadConfig)();
          if (!((_c = params.channel) === null || _c === void 0 ? void 0 : _c.trim())) {
            return [3 /*break*/, 1];
          }
          _a = (0, index_js_1.normalizeChannelId)(params.channel);
          return [3 /*break*/, 3];
        case 1:
          return [
            4 /*yield*/,
            (0, channel_selection_js_1.resolveMessageChannelSelection)({ cfg: cfg }),
          ];
        case 2:
          _a = _k.sent().channel;
          _k.label = 3;
        case 3:
          channel = _a;
          if (!channel) {
            throw new Error("Unknown channel: ".concat(params.channel));
          }
          plugin = (0, index_js_1.getChannelPlugin)(channel);
          if (!plugin) {
            throw new Error("Unknown channel: ".concat(channel));
          }
          deliveryMode =
            (_e = (_d = plugin.outbound) === null || _d === void 0 ? void 0 : _d.deliveryMode) !==
              null && _e !== void 0
              ? _e
              : "direct";
          normalizedPayloads = (0, payloads_js_1.normalizeReplyPayloadsForDelivery)([
            {
              text: params.content,
              mediaUrl: params.mediaUrl,
              mediaUrls: params.mediaUrls,
            },
          ]);
          mirrorText = normalizedPayloads
            .map(function (payload) {
              return payload.text;
            })
            .filter(Boolean)
            .join("\n");
          mirrorMediaUrls = normalizedPayloads.flatMap(function (payload) {
            var _a;
            return (_a = payload.mediaUrls) !== null && _a !== void 0
              ? _a
              : payload.mediaUrl
                ? [payload.mediaUrl]
                : [];
          });
          primaryMediaUrl =
            (_g = (_f = mirrorMediaUrls[0]) !== null && _f !== void 0 ? _f : params.mediaUrl) !==
              null && _g !== void 0
              ? _g
              : null;
          if (params.dryRun) {
            return [
              2 /*return*/,
              {
                channel: channel,
                to: params.to,
                via: deliveryMode === "gateway" ? "gateway" : "direct",
                mediaUrl: primaryMediaUrl,
                mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : undefined,
                dryRun: true,
              },
            ];
          }
          if (!(deliveryMode !== "gateway")) {
            return [3 /*break*/, 5];
          }
          outboundChannel = channel;
          resolvedTarget = (0, targets_js_1.resolveOutboundTarget)({
            channel: outboundChannel,
            to: params.to,
            cfg: cfg,
            accountId: params.accountId,
            mode: "explicit",
          });
          if (!resolvedTarget.ok) {
            throw resolvedTarget.error;
          }
          return [
            4 /*yield*/,
            (0, deliver_js_1.deliverOutboundPayloads)({
              cfg: cfg,
              channel: outboundChannel,
              to: resolvedTarget.to,
              accountId: params.accountId,
              payloads: normalizedPayloads,
              gifPlayback: params.gifPlayback,
              deps: params.deps,
              bestEffort: params.bestEffort,
              abortSignal: params.abortSignal,
              mirror: params.mirror
                ? __assign(__assign({}, params.mirror), {
                    text: mirrorText || params.content,
                    mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : undefined,
                  })
                : undefined,
            }),
          ];
        case 4:
          results = _k.sent();
          return [
            2 /*return*/,
            {
              channel: channel,
              to: params.to,
              via: "direct",
              mediaUrl: primaryMediaUrl,
              mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : undefined,
              result: results.at(-1),
            },
          ];
        case 5:
          gateway = resolveGatewayOptions(params.gateway);
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              url: gateway.url,
              token: gateway.token,
              method: "send",
              params: {
                to: params.to,
                message: params.content,
                mediaUrl: params.mediaUrl,
                mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : params.mediaUrls,
                gifPlayback: params.gifPlayback,
                accountId: params.accountId,
                channel: channel,
                sessionKey: (_h = params.mirror) === null || _h === void 0 ? void 0 : _h.sessionKey,
                idempotencyKey:
                  (_j = params.idempotencyKey) !== null && _j !== void 0
                    ? _j
                    : (0, call_js_1.randomIdempotencyKey)(),
              },
              timeoutMs: gateway.timeoutMs,
              clientName: gateway.clientName,
              clientDisplayName: gateway.clientDisplayName,
              mode: gateway.mode,
            }),
          ];
        case 6:
          result = _k.sent();
          return [
            2 /*return*/,
            {
              channel: channel,
              to: params.to,
              via: "gateway",
              mediaUrl: primaryMediaUrl,
              mediaUrls: mirrorMediaUrls.length ? mirrorMediaUrls : undefined,
              result: result,
            },
          ];
      }
    });
  });
}
function sendPoll(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg, channel, _a, pollInput, plugin, outbound, normalized, gateway, result;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          cfg = (_b = params.cfg) !== null && _b !== void 0 ? _b : (0, config_js_1.loadConfig)();
          if (!((_c = params.channel) === null || _c === void 0 ? void 0 : _c.trim())) {
            return [3 /*break*/, 1];
          }
          _a = (0, index_js_1.normalizeChannelId)(params.channel);
          return [3 /*break*/, 3];
        case 1:
          return [
            4 /*yield*/,
            (0, channel_selection_js_1.resolveMessageChannelSelection)({ cfg: cfg }),
          ];
        case 2:
          _a = _g.sent().channel;
          _g.label = 3;
        case 3:
          channel = _a;
          if (!channel) {
            throw new Error("Unknown channel: ".concat(params.channel));
          }
          pollInput = {
            question: params.question,
            options: params.options,
            maxSelections: params.maxSelections,
            durationHours: params.durationHours,
          };
          plugin = (0, index_js_1.getChannelPlugin)(channel);
          outbound = plugin === null || plugin === void 0 ? void 0 : plugin.outbound;
          if (!(outbound === null || outbound === void 0 ? void 0 : outbound.sendPoll)) {
            throw new Error("Unsupported poll channel: ".concat(channel));
          }
          normalized = outbound.pollMaxOptions
            ? (0, polls_js_1.normalizePollInput)(pollInput, { maxOptions: outbound.pollMaxOptions })
            : (0, polls_js_1.normalizePollInput)(pollInput);
          if (params.dryRun) {
            return [
              2 /*return*/,
              {
                channel: channel,
                to: params.to,
                question: normalized.question,
                options: normalized.options,
                maxSelections: normalized.maxSelections,
                durationHours:
                  (_d = normalized.durationHours) !== null && _d !== void 0 ? _d : null,
                via: "gateway",
                dryRun: true,
              },
            ];
          }
          gateway = resolveGatewayOptions(params.gateway);
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              url: gateway.url,
              token: gateway.token,
              method: "poll",
              params: {
                to: params.to,
                question: normalized.question,
                options: normalized.options,
                maxSelections: normalized.maxSelections,
                durationHours: normalized.durationHours,
                channel: channel,
                idempotencyKey:
                  (_e = params.idempotencyKey) !== null && _e !== void 0
                    ? _e
                    : (0, call_js_1.randomIdempotencyKey)(),
              },
              timeoutMs: gateway.timeoutMs,
              clientName: gateway.clientName,
              clientDisplayName: gateway.clientDisplayName,
              mode: gateway.mode,
            }),
          ];
        case 4:
          result = _g.sent();
          return [
            2 /*return*/,
            {
              channel: channel,
              to: params.to,
              question: normalized.question,
              options: normalized.options,
              maxSelections: normalized.maxSelections,
              durationHours: (_f = normalized.durationHours) !== null && _f !== void 0 ? _f : null,
              via: "gateway",
              result: result,
            },
          ];
      }
    });
  });
}
