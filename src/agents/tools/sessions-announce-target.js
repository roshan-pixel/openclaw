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
exports.resolveAnnounceTarget = resolveAnnounceTarget;
var index_js_1 = require("../../channels/plugins/index.js");
var call_js_1 = require("../../gateway/call.js");
var sessions_send_helpers_js_1 = require("./sessions-send-helpers.js");
function resolveAnnounceTarget(params) {
  return __awaiter(this, void 0, void 0, function () {
    var parsed,
      parsedDisplay,
      fallback,
      normalized,
      plugin,
      list,
      sessions,
      match,
      deliveryContext,
      channel,
      to,
      accountId,
      _a;
    var _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          parsed = (0, sessions_send_helpers_js_1.resolveAnnounceTargetFromKey)(params.sessionKey);
          parsedDisplay = (0, sessions_send_helpers_js_1.resolveAnnounceTargetFromKey)(
            params.displayKey,
          );
          fallback =
            (_b = parsed !== null && parsed !== void 0 ? parsed : parsedDisplay) !== null &&
            _b !== void 0
              ? _b
              : null;
          if (fallback) {
            normalized = (0, index_js_1.normalizeChannelId)(fallback.channel);
            plugin = normalized ? (0, index_js_1.getChannelPlugin)(normalized) : null;
            if (
              !((_c = plugin === null || plugin === void 0 ? void 0 : plugin.meta) === null ||
              _c === void 0
                ? void 0
                : _c.preferSessionLookupForAnnounceTarget)
            ) {
              return [2 /*return*/, fallback];
            }
          }
          _h.label = 1;
        case 1:
          _h.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            (0, call_js_1.callGateway)({
              method: "sessions.list",
              params: {
                includeGlobal: true,
                includeUnknown: true,
                limit: 200,
              },
            }),
          ];
        case 2:
          list = _h.sent();
          sessions = Array.isArray(list === null || list === void 0 ? void 0 : list.sessions)
            ? list.sessions
            : [];
          match =
            (_d = sessions.find(function (entry) {
              return (
                (entry === null || entry === void 0 ? void 0 : entry.key) === params.sessionKey
              );
            })) !== null && _d !== void 0
              ? _d
              : sessions.find(function (entry) {
                  return (
                    (entry === null || entry === void 0 ? void 0 : entry.key) === params.displayKey
                  );
                });
          deliveryContext =
            (match === null || match === void 0 ? void 0 : match.deliveryContext) &&
            typeof match.deliveryContext === "object"
              ? match.deliveryContext
              : undefined;
          channel =
            (_e =
              typeof (deliveryContext === null || deliveryContext === void 0
                ? void 0
                : deliveryContext.channel) === "string"
                ? deliveryContext.channel
                : undefined) !== null && _e !== void 0
              ? _e
              : typeof (match === null || match === void 0 ? void 0 : match.lastChannel) ===
                  "string"
                ? match.lastChannel
                : undefined;
          to =
            (_f =
              typeof (deliveryContext === null || deliveryContext === void 0
                ? void 0
                : deliveryContext.to) === "string"
                ? deliveryContext.to
                : undefined) !== null && _f !== void 0
              ? _f
              : typeof (match === null || match === void 0 ? void 0 : match.lastTo) === "string"
                ? match.lastTo
                : undefined;
          accountId =
            (_g =
              typeof (deliveryContext === null || deliveryContext === void 0
                ? void 0
                : deliveryContext.accountId) === "string"
                ? deliveryContext.accountId
                : undefined) !== null && _g !== void 0
              ? _g
              : typeof (match === null || match === void 0 ? void 0 : match.lastAccountId) ===
                  "string"
                ? match.lastAccountId
                : undefined;
          if (channel && to) {
            return [2 /*return*/, { channel: channel, to: to, accountId: accountId }];
          }
          return [3 /*break*/, 4];
        case 3:
          _a = _h.sent();
          return [3 /*break*/, 4];
        case 4:
          return [2 /*return*/, fallback];
      }
    });
  });
}
