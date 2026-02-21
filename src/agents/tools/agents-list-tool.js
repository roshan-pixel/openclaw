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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.createAgentsListTool = createAgentsListTool;
var typebox_1 = require("@sinclair/typebox");
var config_js_1 = require("../../config/config.js");
var session_key_js_1 = require("../../routing/session-key.js");
var agent_scope_js_1 = require("../agent-scope.js");
var common_js_1 = require("./common.js");
var sessions_helpers_js_1 = require("./sessions-helpers.js");
var AgentsListToolSchema = typebox_1.Type.Object({});
function createAgentsListTool(opts) {
  var _this = this;
  return {
    label: "Agents",
    name: "agents_list",
    description: "List agent ids you can target with sessions_spawn (based on allowlists).",
    parameters: AgentsListToolSchema,
    execute: function () {
      return __awaiter(_this, void 0, void 0, function () {
        var cfg,
          _a,
          mainKey,
          alias,
          requesterInternalKey,
          requesterAgentId,
          allowAgents,
          allowAny,
          allowSet,
          configuredAgents,
          configuredIds,
          configuredNameMap,
          _i,
          configuredAgents_1,
          entry,
          name_1,
          allowed,
          _b,
          configuredIds_1,
          id,
          _c,
          allowSet_1,
          id,
          all,
          rest,
          ordered,
          agents;
        var _d, _e, _f, _g, _h, _j, _k, _l, _m, _o;
        return __generator(this, function (_p) {
          cfg = (0, config_js_1.loadConfig)();
          ((_a = (0, sessions_helpers_js_1.resolveMainSessionAlias)(cfg)),
            (mainKey = _a.mainKey),
            (alias = _a.alias));
          requesterInternalKey =
            typeof (opts === null || opts === void 0 ? void 0 : opts.agentSessionKey) ===
              "string" && opts.agentSessionKey.trim()
              ? (0, sessions_helpers_js_1.resolveInternalSessionKey)({
                  key: opts.agentSessionKey,
                  alias: alias,
                  mainKey: mainKey,
                })
              : alias;
          requesterAgentId = (0, session_key_js_1.normalizeAgentId)(
            (_f =
              (_d = opts === null || opts === void 0 ? void 0 : opts.requesterAgentIdOverride) !==
                null && _d !== void 0
                ? _d
                : (_e = (0, session_key_js_1.parseAgentSessionKey)(requesterInternalKey)) ===
                      null || _e === void 0
                  ? void 0
                  : _e.agentId) !== null && _f !== void 0
              ? _f
              : session_key_js_1.DEFAULT_AGENT_ID,
          );
          allowAgents =
            (_j =
              (_h =
                (_g = (0, agent_scope_js_1.resolveAgentConfig)(cfg, requesterAgentId)) === null ||
                _g === void 0
                  ? void 0
                  : _g.subagents) === null || _h === void 0
                ? void 0
                : _h.allowAgents) !== null && _j !== void 0
              ? _j
              : [];
          allowAny = allowAgents.some(function (value) {
            return value.trim() === "*";
          });
          allowSet = new Set(
            allowAgents
              .filter(function (value) {
                return value.trim() && value.trim() !== "*";
              })
              .map(function (value) {
                return (0, session_key_js_1.normalizeAgentId)(value);
              }),
          );
          configuredAgents = Array.isArray(
            (_k = cfg.agents) === null || _k === void 0 ? void 0 : _k.list,
          )
            ? (_l = cfg.agents) === null || _l === void 0
              ? void 0
              : _l.list
            : [];
          configuredIds = configuredAgents.map(function (entry) {
            return (0, session_key_js_1.normalizeAgentId)(entry.id);
          });
          configuredNameMap = new Map();
          for (
            _i = 0, configuredAgents_1 = configuredAgents;
            _i < configuredAgents_1.length;
            _i++
          ) {
            entry = configuredAgents_1[_i];
            name_1 =
              (_o =
                (_m = entry === null || entry === void 0 ? void 0 : entry.name) === null ||
                _m === void 0
                  ? void 0
                  : _m.trim()) !== null && _o !== void 0
                ? _o
                : "";
            if (!name_1) {
              continue;
            }
            configuredNameMap.set((0, session_key_js_1.normalizeAgentId)(entry.id), name_1);
          }
          allowed = new Set();
          allowed.add(requesterAgentId);
          if (allowAny) {
            for (_b = 0, configuredIds_1 = configuredIds; _b < configuredIds_1.length; _b++) {
              id = configuredIds_1[_b];
              allowed.add(id);
            }
          } else {
            for (_c = 0, allowSet_1 = allowSet; _c < allowSet_1.length; _c++) {
              id = allowSet_1[_c];
              allowed.add(id);
            }
          }
          all = Array.from(allowed);
          rest = all
            .filter(function (id) {
              return id !== requesterAgentId;
            })
            .toSorted(function (a, b) {
              return a.localeCompare(b);
            });
          ordered = __spreadArray([requesterAgentId], rest, true);
          agents = ordered.map(function (id) {
            return {
              id: id,
              name: configuredNameMap.get(id),
              configured: configuredIds.includes(id),
            };
          });
          return [
            2 /*return*/,
            (0, common_js_1.jsonResult)({
              requester: requesterAgentId,
              allowAny: allowAny,
              agents: agents,
            }),
          ];
        });
      });
    },
  };
}
