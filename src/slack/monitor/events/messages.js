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
exports.registerSlackMessageEvents = registerSlackMessageEvents;
var globals_js_1 = require("../../../globals.js");
var system_events_js_1 = require("../../../infra/system-events.js");
var channel_config_js_1 = require("../channel-config.js");
function registerSlackMessageEvents(params) {
  var _this = this;
  var ctx = params.ctx,
    handleSlackMessage = params.handleSlackMessage;
  ctx.app.event("message", function (_a) {
    return __awaiter(_this, [_a], void 0, function (_b) {
      var message,
        changed,
        channelId,
        channelInfo,
        _c,
        channelType,
        messageId,
        label,
        sessionKey,
        deleted,
        channelId,
        channelInfo,
        _d,
        channelType,
        label,
        sessionKey,
        thread,
        channelId,
        channelInfo,
        _e,
        channelType,
        label,
        messageId,
        sessionKey,
        err_1;
      var _f, _g, _h, _j, _k, _l, _m, _o, _p, _q;
      var event = _b.event,
        body = _b.body;
      return __generator(this, function (_r) {
        switch (_r.label) {
          case 0:
            _r.trys.push([0, 14, , 15]);
            if (ctx.shouldDropMismatchedSlackEvent(body)) {
              return [2 /*return*/];
            }
            message = event;
            if (!(message.subtype === "message_changed")) {
              return [3 /*break*/, 4];
            }
            changed = event;
            channelId = changed.channel;
            if (!channelId) {
              return [3 /*break*/, 2];
            }
            return [4 /*yield*/, ctx.resolveChannelName(channelId)];
          case 1:
            _c = _r.sent();
            return [3 /*break*/, 3];
          case 2:
            _c = {};
            _r.label = 3;
          case 3:
            channelInfo = _c;
            channelType =
              channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.type;
            if (
              !ctx.isChannelAllowed({
                channelId: channelId,
                channelName:
                  channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name,
                channelType: channelType,
              })
            ) {
              return [2 /*return*/];
            }
            messageId =
              (_g = (_f = changed.message) === null || _f === void 0 ? void 0 : _f.ts) !== null &&
              _g !== void 0
                ? _g
                : (_h = changed.previous_message) === null || _h === void 0
                  ? void 0
                  : _h.ts;
            label = (0, channel_config_js_1.resolveSlackChannelLabel)({
              channelId: channelId,
              channelName:
                channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name,
            });
            sessionKey = ctx.resolveSlackSystemEventSessionKey({
              channelId: channelId,
              channelType: channelType,
            });
            (0, system_events_js_1.enqueueSystemEvent)(
              "Slack message edited in ".concat(label, "."),
              {
                sessionKey: sessionKey,
                contextKey: "slack:message:changed:"
                  .concat(channelId !== null && channelId !== void 0 ? channelId : "unknown", ":")
                  .concat(
                    (_j =
                      messageId !== null && messageId !== void 0 ? messageId : changed.event_ts) !==
                      null && _j !== void 0
                      ? _j
                      : "unknown",
                  ),
              },
            );
            return [2 /*return*/];
          case 4:
            if (!(message.subtype === "message_deleted")) {
              return [3 /*break*/, 8];
            }
            deleted = event;
            channelId = deleted.channel;
            if (!channelId) {
              return [3 /*break*/, 6];
            }
            return [4 /*yield*/, ctx.resolveChannelName(channelId)];
          case 5:
            _d = _r.sent();
            return [3 /*break*/, 7];
          case 6:
            _d = {};
            _r.label = 7;
          case 7:
            channelInfo = _d;
            channelType =
              channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.type;
            if (
              !ctx.isChannelAllowed({
                channelId: channelId,
                channelName:
                  channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name,
                channelType: channelType,
              })
            ) {
              return [2 /*return*/];
            }
            label = (0, channel_config_js_1.resolveSlackChannelLabel)({
              channelId: channelId,
              channelName:
                channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name,
            });
            sessionKey = ctx.resolveSlackSystemEventSessionKey({
              channelId: channelId,
              channelType: channelType,
            });
            (0, system_events_js_1.enqueueSystemEvent)(
              "Slack message deleted in ".concat(label, "."),
              {
                sessionKey: sessionKey,
                contextKey: "slack:message:deleted:"
                  .concat(channelId !== null && channelId !== void 0 ? channelId : "unknown", ":")
                  .concat(
                    (_l =
                      (_k = deleted.deleted_ts) !== null && _k !== void 0
                        ? _k
                        : deleted.event_ts) !== null && _l !== void 0
                      ? _l
                      : "unknown",
                  ),
              },
            );
            return [2 /*return*/];
          case 8:
            if (!(message.subtype === "thread_broadcast")) {
              return [3 /*break*/, 12];
            }
            thread = event;
            channelId = thread.channel;
            if (!channelId) {
              return [3 /*break*/, 10];
            }
            return [4 /*yield*/, ctx.resolveChannelName(channelId)];
          case 9:
            _e = _r.sent();
            return [3 /*break*/, 11];
          case 10:
            _e = {};
            _r.label = 11;
          case 11:
            channelInfo = _e;
            channelType =
              channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.type;
            if (
              !ctx.isChannelAllowed({
                channelId: channelId,
                channelName:
                  channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name,
                channelType: channelType,
              })
            ) {
              return [2 /*return*/];
            }
            label = (0, channel_config_js_1.resolveSlackChannelLabel)({
              channelId: channelId,
              channelName:
                channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name,
            });
            messageId =
              (_o = (_m = thread.message) === null || _m === void 0 ? void 0 : _m.ts) !== null &&
              _o !== void 0
                ? _o
                : thread.event_ts;
            sessionKey = ctx.resolveSlackSystemEventSessionKey({
              channelId: channelId,
              channelType: channelType,
            });
            (0, system_events_js_1.enqueueSystemEvent)(
              "Slack thread reply broadcast in ".concat(label, "."),
              {
                sessionKey: sessionKey,
                contextKey: "slack:thread:broadcast:"
                  .concat(channelId !== null && channelId !== void 0 ? channelId : "unknown", ":")
                  .concat(messageId !== null && messageId !== void 0 ? messageId : "unknown"),
              },
            );
            return [2 /*return*/];
          case 12:
            return [4 /*yield*/, handleSlackMessage(message, { source: "message" })];
          case 13:
            _r.sent();
            return [3 /*break*/, 15];
          case 14:
            err_1 = _r.sent();
            (_q = (_p = ctx.runtime).error) === null || _q === void 0
              ? void 0
              : _q.call(
                  _p,
                  (0, globals_js_1.danger)("slack handler failed: ".concat(String(err_1))),
                );
            return [3 /*break*/, 15];
          case 15:
            return [2 /*return*/];
        }
      });
    });
  });
  ctx.app.event("app_mention", function (_a) {
    return __awaiter(_this, [_a], void 0, function (_b) {
      var mention, err_2;
      var _c, _d;
      var event = _b.event,
        body = _b.body;
      return __generator(this, function (_e) {
        switch (_e.label) {
          case 0:
            _e.trys.push([0, 2, , 3]);
            if (ctx.shouldDropMismatchedSlackEvent(body)) {
              return [2 /*return*/];
            }
            mention = event;
            return [
              4 /*yield*/,
              handleSlackMessage(mention, {
                source: "app_mention",
                wasMentioned: true,
              }),
            ];
          case 1:
            _e.sent();
            return [3 /*break*/, 3];
          case 2:
            err_2 = _e.sent();
            (_d = (_c = ctx.runtime).error) === null || _d === void 0
              ? void 0
              : _d.call(
                  _c,
                  (0, globals_js_1.danger)("slack mention handler failed: ".concat(String(err_2))),
                );
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  });
}
