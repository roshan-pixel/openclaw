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
exports.registerSlackChannelEvents = registerSlackChannelEvents;
var config_js_1 = require("../../../config/config.js");
var config_writes_js_1 = require("../../../channels/plugins/config-writes.js");
var globals_js_1 = require("../../../globals.js");
var system_events_js_1 = require("../../../infra/system-events.js");
var channel_config_js_1 = require("../channel-config.js");
var channel_migration_js_1 = require("../../channel-migration.js");
function registerSlackChannelEvents(params) {
  var _this = this;
  var ctx = params.ctx;
  ctx.app.event("channel_created", function (_a) {
    return __awaiter(_this, [_a], void 0, function (_b) {
      var payload, channelId, channelName, label, sessionKey;
      var _c, _d, _e, _f, _g;
      var event = _b.event,
        body = _b.body;
      return __generator(this, function (_h) {
        try {
          if (ctx.shouldDropMismatchedSlackEvent(body)) {
            return [2 /*return*/];
          }
          payload = event;
          channelId = (_c = payload.channel) === null || _c === void 0 ? void 0 : _c.id;
          channelName = (_d = payload.channel) === null || _d === void 0 ? void 0 : _d.name;
          if (
            !ctx.isChannelAllowed({
              channelId: channelId,
              channelName: channelName,
              channelType: "channel",
            })
          ) {
            return [2 /*return*/];
          }
          label = (0, channel_config_js_1.resolveSlackChannelLabel)({
            channelId: channelId,
            channelName: channelName,
          });
          sessionKey = ctx.resolveSlackSystemEventSessionKey({
            channelId: channelId,
            channelType: "channel",
          });
          (0, system_events_js_1.enqueueSystemEvent)("Slack channel created: ".concat(label, "."), {
            sessionKey: sessionKey,
            contextKey: "slack:channel:created:".concat(
              (_e = channelId !== null && channelId !== void 0 ? channelId : channelName) !==
                null && _e !== void 0
                ? _e
                : "unknown",
            ),
          });
        } catch (err) {
          (_g = (_f = ctx.runtime).error) === null || _g === void 0
            ? void 0
            : _g.call(
                _f,
                (0, globals_js_1.danger)(
                  "slack channel created handler failed: ".concat(String(err)),
                ),
              );
        }
        return [2 /*return*/];
      });
    });
  });
  ctx.app.event("channel_rename", function (_a) {
    return __awaiter(_this, [_a], void 0, function (_b) {
      var payload, channelId, channelName, label, sessionKey;
      var _c, _d, _e, _f, _g, _h, _j;
      var event = _b.event,
        body = _b.body;
      return __generator(this, function (_k) {
        try {
          if (ctx.shouldDropMismatchedSlackEvent(body)) {
            return [2 /*return*/];
          }
          payload = event;
          channelId = (_c = payload.channel) === null || _c === void 0 ? void 0 : _c.id;
          channelName =
            (_e =
              (_d = payload.channel) === null || _d === void 0 ? void 0 : _d.name_normalized) !==
              null && _e !== void 0
              ? _e
              : (_f = payload.channel) === null || _f === void 0
                ? void 0
                : _f.name;
          if (
            !ctx.isChannelAllowed({
              channelId: channelId,
              channelName: channelName,
              channelType: "channel",
            })
          ) {
            return [2 /*return*/];
          }
          label = (0, channel_config_js_1.resolveSlackChannelLabel)({
            channelId: channelId,
            channelName: channelName,
          });
          sessionKey = ctx.resolveSlackSystemEventSessionKey({
            channelId: channelId,
            channelType: "channel",
          });
          (0, system_events_js_1.enqueueSystemEvent)("Slack channel renamed: ".concat(label, "."), {
            sessionKey: sessionKey,
            contextKey: "slack:channel:renamed:".concat(
              (_g = channelId !== null && channelId !== void 0 ? channelId : channelName) !==
                null && _g !== void 0
                ? _g
                : "unknown",
            ),
          });
        } catch (err) {
          (_j = (_h = ctx.runtime).error) === null || _j === void 0
            ? void 0
            : _j.call(
                _h,
                (0, globals_js_1.danger)(
                  "slack channel rename handler failed: ".concat(String(err)),
                ),
              );
        }
        return [2 /*return*/];
      });
    });
  });
  ctx.app.event("channel_id_changed", function (_a) {
    return __awaiter(_this, [_a], void 0, function (_b) {
      var payload, oldChannelId, newChannelId, channelInfo, label, currentConfig, migration, err_1;
      var _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p;
      var event = _b.event,
        body = _b.body;
      return __generator(this, function (_q) {
        switch (_q.label) {
          case 0:
            _q.trys.push([0, 5, , 6]);
            if (ctx.shouldDropMismatchedSlackEvent(body)) {
              return [2 /*return*/];
            }
            payload = event;
            oldChannelId = payload.old_channel_id;
            newChannelId = payload.new_channel_id;
            if (!oldChannelId || !newChannelId) {
              return [2 /*return*/];
            }
            return [4 /*yield*/, ctx.resolveChannelName(newChannelId)];
          case 1:
            channelInfo = _q.sent();
            label = (0, channel_config_js_1.resolveSlackChannelLabel)({
              channelId: newChannelId,
              channelName:
                channelInfo === null || channelInfo === void 0 ? void 0 : channelInfo.name,
            });
            (_d = (_c = ctx.runtime).log) === null || _d === void 0
              ? void 0
              : _d.call(
                  _c,
                  (0, globals_js_1.warn)(
                    "[slack] Channel ID changed: "
                      .concat(oldChannelId, " \u2192 ")
                      .concat(newChannelId, " (")
                      .concat(label, ")"),
                  ),
                );
            if (
              !(0, config_writes_js_1.resolveChannelConfigWrites)({
                cfg: ctx.cfg,
                channelId: "slack",
                accountId: ctx.accountId,
              })
            ) {
              (_f = (_e = ctx.runtime).log) === null || _f === void 0
                ? void 0
                : _f.call(
                    _e,
                    (0, globals_js_1.warn)(
                      "[slack] Config writes disabled; skipping channel config migration.",
                    ),
                  );
              return [2 /*return*/];
            }
            currentConfig = (0, config_js_1.loadConfig)();
            migration = (0, channel_migration_js_1.migrateSlackChannelConfig)({
              cfg: currentConfig,
              accountId: ctx.accountId,
              oldChannelId: oldChannelId,
              newChannelId: newChannelId,
            });
            if (!migration.migrated) {
              return [3 /*break*/, 3];
            }
            (0, channel_migration_js_1.migrateSlackChannelConfig)({
              cfg: ctx.cfg,
              accountId: ctx.accountId,
              oldChannelId: oldChannelId,
              newChannelId: newChannelId,
            });
            return [4 /*yield*/, (0, config_js_1.writeConfigFile)(currentConfig)];
          case 2:
            _q.sent();
            (_h = (_g = ctx.runtime).log) === null || _h === void 0
              ? void 0
              : _h.call(
                  _g,
                  (0, globals_js_1.warn)("[slack] Channel config migrated and saved successfully."),
                );
            return [3 /*break*/, 4];
          case 3:
            if (migration.skippedExisting) {
              (_k = (_j = ctx.runtime).log) === null || _k === void 0
                ? void 0
                : _k.call(
                    _j,
                    (0, globals_js_1.warn)(
                      "[slack] Channel config already exists for "
                        .concat(newChannelId, "; leaving ")
                        .concat(oldChannelId, " unchanged"),
                    ),
                  );
            } else {
              (_m = (_l = ctx.runtime).log) === null || _m === void 0
                ? void 0
                : _m.call(
                    _l,
                    (0, globals_js_1.warn)(
                      "[slack] No config found for old channel ID ".concat(
                        oldChannelId,
                        "; migration logged only",
                      ),
                    ),
                  );
            }
            _q.label = 4;
          case 4:
            return [3 /*break*/, 6];
          case 5:
            err_1 = _q.sent();
            (_p = (_o = ctx.runtime).error) === null || _p === void 0
              ? void 0
              : _p.call(
                  _o,
                  (0, globals_js_1.danger)(
                    "slack channel_id_changed handler failed: ".concat(String(err_1)),
                  ),
                );
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
}
