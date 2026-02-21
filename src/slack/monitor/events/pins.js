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
exports.registerSlackPinEvents = registerSlackPinEvents;
var globals_js_1 = require("../../../globals.js");
var system_events_js_1 = require("../../../infra/system-events.js");
var channel_config_js_1 = require("../channel-config.js");
function registerSlackPinEvents(params) {
  var _this = this;
  var ctx = params.ctx;
  ctx.app.event("pin_added", function (_a) {
    return __awaiter(_this, [_a], void 0, function (_b) {
      var payload,
        channelId,
        channelInfo,
        _c,
        label,
        userInfo,
        _d,
        userLabel,
        itemType,
        messageId,
        sessionKey,
        err_1;
      var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
      var event = _b.event,
        body = _b.body;
      return __generator(this, function (_q) {
        switch (_q.label) {
          case 0:
            _q.trys.push([0, 7, , 8]);
            if (ctx.shouldDropMismatchedSlackEvent(body)) {
              return [2 /*return*/];
            }
            payload = event;
            channelId = payload.channel_id;
            if (!channelId) {
              return [3 /*break*/, 2];
            }
            return [4 /*yield*/, ctx.resolveChannelName(channelId)];
          case 1:
            _c = _q.sent();
            return [3 /*break*/, 3];
          case 2:
            _c = {};
            _q.label = 3;
          case 3:
            channelInfo = _c;
            if (
              !ctx.isChannelAllowed({
                channelId: channelId,
                channelName:
                  channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name,
                channelType:
                  channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.type,
              })
            ) {
              return [2 /*return*/];
            }
            label = (0, channel_config_js_1.resolveSlackChannelLabel)({
              channelId: channelId,
              channelName:
                channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name,
            });
            if (!payload.user) {
              return [3 /*break*/, 5];
            }
            return [4 /*yield*/, ctx.resolveUserName(payload.user)];
          case 4:
            _d = _q.sent();
            return [3 /*break*/, 6];
          case 5:
            _d = {};
            _q.label = 6;
          case 6:
            userInfo = _d;
            userLabel =
              (_f =
                (_e = userInfo === null || userInfo === void 0 ? void 0 : userInfo.name) !== null &&
                _e !== void 0
                  ? _e
                  : payload.user) !== null && _f !== void 0
                ? _f
                : "someone";
            itemType =
              (_h = (_g = payload.item) === null || _g === void 0 ? void 0 : _g.type) !== null &&
              _h !== void 0
                ? _h
                : "item";
            messageId =
              (_l =
                (_k = (_j = payload.item) === null || _j === void 0 ? void 0 : _j.message) ===
                  null || _k === void 0
                  ? void 0
                  : _k.ts) !== null && _l !== void 0
                ? _l
                : payload.event_ts;
            sessionKey = ctx.resolveSlackSystemEventSessionKey({
              channelId: channelId,
              channelType:
                (_m =
                  channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.type) !==
                  null && _m !== void 0
                  ? _m
                  : undefined,
            });
            (0, system_events_js_1.enqueueSystemEvent)(
              "Slack: ".concat(userLabel, " pinned a ").concat(itemType, " in ").concat(label, "."),
              {
                sessionKey: sessionKey,
                contextKey: "slack:pin:added:"
                  .concat(channelId !== null && channelId !== void 0 ? channelId : "unknown", ":")
                  .concat(messageId !== null && messageId !== void 0 ? messageId : "unknown"),
              },
            );
            return [3 /*break*/, 8];
          case 7:
            err_1 = _q.sent();
            (_p = (_o = ctx.runtime).error) === null || _p === void 0
              ? void 0
              : _p.call(
                  _o,
                  (0, globals_js_1.danger)(
                    "slack pin added handler failed: ".concat(String(err_1)),
                  ),
                );
            return [3 /*break*/, 8];
          case 8:
            return [2 /*return*/];
        }
      });
    });
  });
  ctx.app.event("pin_removed", function (_a) {
    return __awaiter(_this, [_a], void 0, function (_b) {
      var payload,
        channelId,
        channelInfo,
        _c,
        label,
        userInfo,
        _d,
        userLabel,
        itemType,
        messageId,
        sessionKey,
        err_2;
      var _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
      var event = _b.event,
        body = _b.body;
      return __generator(this, function (_q) {
        switch (_q.label) {
          case 0:
            _q.trys.push([0, 7, , 8]);
            if (ctx.shouldDropMismatchedSlackEvent(body)) {
              return [2 /*return*/];
            }
            payload = event;
            channelId = payload.channel_id;
            if (!channelId) {
              return [3 /*break*/, 2];
            }
            return [4 /*yield*/, ctx.resolveChannelName(channelId)];
          case 1:
            _c = _q.sent();
            return [3 /*break*/, 3];
          case 2:
            _c = {};
            _q.label = 3;
          case 3:
            channelInfo = _c;
            if (
              !ctx.isChannelAllowed({
                channelId: channelId,
                channelName:
                  channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name,
                channelType:
                  channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.type,
              })
            ) {
              return [2 /*return*/];
            }
            label = (0, channel_config_js_1.resolveSlackChannelLabel)({
              channelId: channelId,
              channelName:
                channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name,
            });
            if (!payload.user) {
              return [3 /*break*/, 5];
            }
            return [4 /*yield*/, ctx.resolveUserName(payload.user)];
          case 4:
            _d = _q.sent();
            return [3 /*break*/, 6];
          case 5:
            _d = {};
            _q.label = 6;
          case 6:
            userInfo = _d;
            userLabel =
              (_f =
                (_e = userInfo === null || userInfo === void 0 ? void 0 : userInfo.name) !== null &&
                _e !== void 0
                  ? _e
                  : payload.user) !== null && _f !== void 0
                ? _f
                : "someone";
            itemType =
              (_h = (_g = payload.item) === null || _g === void 0 ? void 0 : _g.type) !== null &&
              _h !== void 0
                ? _h
                : "item";
            messageId =
              (_l =
                (_k = (_j = payload.item) === null || _j === void 0 ? void 0 : _j.message) ===
                  null || _k === void 0
                  ? void 0
                  : _k.ts) !== null && _l !== void 0
                ? _l
                : payload.event_ts;
            sessionKey = ctx.resolveSlackSystemEventSessionKey({
              channelId: channelId,
              channelType:
                (_m =
                  channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.type) !==
                  null && _m !== void 0
                  ? _m
                  : undefined,
            });
            (0, system_events_js_1.enqueueSystemEvent)(
              "Slack: "
                .concat(userLabel, " unpinned a ")
                .concat(itemType, " in ")
                .concat(label, "."),
              {
                sessionKey: sessionKey,
                contextKey: "slack:pin:removed:"
                  .concat(channelId !== null && channelId !== void 0 ? channelId : "unknown", ":")
                  .concat(messageId !== null && messageId !== void 0 ? messageId : "unknown"),
              },
            );
            return [3 /*break*/, 8];
          case 7:
            err_2 = _q.sent();
            (_p = (_o = ctx.runtime).error) === null || _p === void 0
              ? void 0
              : _p.call(
                  _o,
                  (0, globals_js_1.danger)(
                    "slack pin removed handler failed: ".concat(String(err_2)),
                  ),
                );
            return [3 /*break*/, 8];
          case 8:
            return [2 /*return*/];
        }
      });
    });
  });
}
