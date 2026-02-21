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
exports.maybeBroadcastMessage = maybeBroadcastMessage;
var resolve_route_js_1 = require("../../../routing/resolve-route.js");
var session_key_js_1 = require("../../../routing/session-key.js");
var session_js_1 = require("../../session.js");
var loggers_js_1 = require("../loggers.js");
function maybeBroadcastMessage(params) {
  return __awaiter(this, void 0, void 0, function () {
    var broadcastAgents,
      strategy,
      agentIds,
      hasKnownAgents,
      groupHistorySnapshot,
      processForAgent,
      _i,
      broadcastAgents_1,
      agentId;
    var _this = this;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          broadcastAgents =
            (_a = params.cfg.broadcast) === null || _a === void 0 ? void 0 : _a[params.peerId];
          if (!broadcastAgents || !Array.isArray(broadcastAgents)) {
            return [2 /*return*/, false];
          }
          if (broadcastAgents.length === 0) {
            return [2 /*return*/, false];
          }
          strategy =
            ((_b = params.cfg.broadcast) === null || _b === void 0 ? void 0 : _b.strategy) ||
            "parallel";
          loggers_js_1.whatsappInboundLog.info(
            "Broadcasting message to "
              .concat(broadcastAgents.length, " agents (")
              .concat(strategy, ")"),
          );
          agentIds =
            (_d = (_c = params.cfg.agents) === null || _c === void 0 ? void 0 : _c.list) === null ||
            _d === void 0
              ? void 0
              : _d.map(function (agent) {
                  return (0, session_key_js_1.normalizeAgentId)(agent.id);
                });
          hasKnownAgents =
            ((_e = agentIds === null || agentIds === void 0 ? void 0 : agentIds.length) !== null &&
            _e !== void 0
              ? _e
              : 0) > 0;
          groupHistorySnapshot =
            params.msg.chatType === "group"
              ? (_f = params.groupHistories.get(params.groupHistoryKey)) !== null && _f !== void 0
                ? _f
                : []
              : undefined;
          processForAgent = function (agentId) {
            return __awaiter(_this, void 0, void 0, function () {
              var normalizedAgentId, agentRoute, err_1;
              var _a, _b;
              return __generator(this, function (_c) {
                switch (_c.label) {
                  case 0:
                    normalizedAgentId = (0, session_key_js_1.normalizeAgentId)(agentId);
                    if (
                      hasKnownAgents &&
                      !(agentIds === null || agentIds === void 0
                        ? void 0
                        : agentIds.includes(normalizedAgentId))
                    ) {
                      loggers_js_1.whatsappInboundLog.warn(
                        "Broadcast agent ".concat(agentId, " not found in agents.list; skipping"),
                      );
                      return [2 /*return*/, false];
                    }
                    agentRoute = __assign(__assign({}, params.route), {
                      agentId: normalizedAgentId,
                      sessionKey: (0, resolve_route_js_1.buildAgentSessionKey)({
                        agentId: normalizedAgentId,
                        channel: "whatsapp",
                        accountId: params.route.accountId,
                        peer: {
                          kind: params.msg.chatType === "group" ? "group" : "dm",
                          id: params.peerId,
                        },
                        dmScope:
                          (_a = params.cfg.session) === null || _a === void 0 ? void 0 : _a.dmScope,
                        identityLinks:
                          (_b = params.cfg.session) === null || _b === void 0
                            ? void 0
                            : _b.identityLinks,
                      }),
                      mainSessionKey: (0, session_key_js_1.buildAgentMainSessionKey)({
                        agentId: normalizedAgentId,
                        mainKey: session_key_js_1.DEFAULT_MAIN_KEY,
                      }),
                    });
                    _c.label = 1;
                  case 1:
                    _c.trys.push([1, 3, , 4]);
                    return [
                      4 /*yield*/,
                      params.processMessage(params.msg, agentRoute, params.groupHistoryKey, {
                        groupHistory: groupHistorySnapshot,
                        suppressGroupHistoryClear: true,
                      }),
                    ];
                  case 2:
                    return [2 /*return*/, _c.sent()];
                  case 3:
                    err_1 = _c.sent();
                    loggers_js_1.whatsappInboundLog.error(
                      "Broadcast agent "
                        .concat(agentId, " failed: ")
                        .concat((0, session_js_1.formatError)(err_1)),
                    );
                    return [2 /*return*/, false];
                  case 4:
                    return [2 /*return*/];
                }
              });
            });
          };
          if (!(strategy === "sequential")) {
            return [3 /*break*/, 5];
          }
          ((_i = 0), (broadcastAgents_1 = broadcastAgents));
          _g.label = 1;
        case 1:
          if (!(_i < broadcastAgents_1.length)) {
            return [3 /*break*/, 4];
          }
          agentId = broadcastAgents_1[_i];
          return [4 /*yield*/, processForAgent(agentId)];
        case 2:
          _g.sent();
          _g.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [3 /*break*/, 7];
        case 5:
          return [4 /*yield*/, Promise.allSettled(broadcastAgents.map(processForAgent))];
        case 6:
          _g.sent();
          _g.label = 7;
        case 7:
          if (params.msg.chatType === "group") {
            params.groupHistories.set(params.groupHistoryKey, []);
          }
          return [2 /*return*/, true];
      }
    });
  });
}
