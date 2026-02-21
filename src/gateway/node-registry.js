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
exports.NodeRegistry = void 0;
var node_crypto_1 = require("node:crypto");
var NodeRegistry = /** @class */ (function () {
  function NodeRegistry() {
    this.nodesById = new Map();
    this.nodesByConn = new Map();
    this.pendingInvokes = new Map();
  }
  NodeRegistry.prototype.register = function (client, opts) {
    var _a, _b, _c, _d;
    var connect = client.connect;
    var nodeId =
      (_b = (_a = connect.device) === null || _a === void 0 ? void 0 : _a.id) !== null &&
      _b !== void 0
        ? _b
        : connect.client.id;
    var caps = Array.isArray(connect.caps) ? connect.caps : [];
    var commands = Array.isArray(connect.commands)
      ? (_c = connect.commands) !== null && _c !== void 0
        ? _c
        : []
      : [];
    var permissions =
      typeof connect.permissions === "object"
        ? (_d = connect.permissions) !== null && _d !== void 0
          ? _d
          : undefined
        : undefined;
    var pathEnv = typeof connect.pathEnv === "string" ? connect.pathEnv : undefined;
    var session = {
      nodeId: nodeId,
      connId: client.connId,
      client: client,
      displayName: connect.client.displayName,
      platform: connect.client.platform,
      version: connect.client.version,
      coreVersion: connect.coreVersion,
      uiVersion: connect.uiVersion,
      deviceFamily: connect.client.deviceFamily,
      modelIdentifier: connect.client.modelIdentifier,
      remoteIp: opts.remoteIp,
      caps: caps,
      commands: commands,
      permissions: permissions,
      pathEnv: pathEnv,
      connectedAtMs: Date.now(),
    };
    this.nodesById.set(nodeId, session);
    this.nodesByConn.set(client.connId, nodeId);
    return session;
  };
  NodeRegistry.prototype.unregister = function (connId) {
    var nodeId = this.nodesByConn.get(connId);
    if (!nodeId) {
      return null;
    }
    this.nodesByConn.delete(connId);
    this.nodesById.delete(nodeId);
    for (var _i = 0, _a = this.pendingInvokes.entries(); _i < _a.length; _i++) {
      var _b = _a[_i],
        id = _b[0],
        pending = _b[1];
      if (pending.nodeId !== nodeId) {
        continue;
      }
      clearTimeout(pending.timer);
      pending.reject(new Error("node disconnected (".concat(pending.command, ")")));
      this.pendingInvokes.delete(id);
    }
    return nodeId;
  };
  NodeRegistry.prototype.listConnected = function () {
    return __spreadArray([], this.nodesById.values(), true);
  };
  NodeRegistry.prototype.get = function (nodeId) {
    return this.nodesById.get(nodeId);
  };
  NodeRegistry.prototype.invoke = function (params) {
    return __awaiter(this, void 0, void 0, function () {
      var node, requestId, payload, ok, timeoutMs;
      var _this = this;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            node = this.nodesById.get(params.nodeId);
            if (!node) {
              return [
                2 /*return*/,
                {
                  ok: false,
                  error: { code: "NOT_CONNECTED", message: "node not connected" },
                },
              ];
            }
            requestId = (0, node_crypto_1.randomUUID)();
            payload = {
              id: requestId,
              nodeId: params.nodeId,
              command: params.command,
              paramsJSON:
                "params" in params && params.params !== undefined
                  ? JSON.stringify(params.params)
                  : null,
              timeoutMs: params.timeoutMs,
              idempotencyKey: params.idempotencyKey,
            };
            ok = this.sendEventToSession(node, "node.invoke.request", payload);
            if (!ok) {
              return [
                2 /*return*/,
                {
                  ok: false,
                  error: { code: "UNAVAILABLE", message: "failed to send invoke to node" },
                },
              ];
            }
            timeoutMs = typeof params.timeoutMs === "number" ? params.timeoutMs : 30000;
            return [
              4 /*yield*/,
              new Promise(function (resolve, reject) {
                var timer = setTimeout(function () {
                  _this.pendingInvokes.delete(requestId);
                  resolve({
                    ok: false,
                    error: { code: "TIMEOUT", message: "node invoke timed out" },
                  });
                }, timeoutMs);
                _this.pendingInvokes.set(requestId, {
                  nodeId: params.nodeId,
                  command: params.command,
                  resolve: resolve,
                  reject: reject,
                  timer: timer,
                });
              }),
            ];
          case 1:
            return [2 /*return*/, _a.sent()];
        }
      });
    });
  };
  NodeRegistry.prototype.handleInvokeResult = function (params) {
    var _a, _b;
    var pending = this.pendingInvokes.get(params.id);
    if (!pending) {
      return false;
    }
    if (pending.nodeId !== params.nodeId) {
      return false;
    }
    clearTimeout(pending.timer);
    this.pendingInvokes.delete(params.id);
    pending.resolve({
      ok: params.ok,
      payload: params.payload,
      payloadJSON: (_a = params.payloadJSON) !== null && _a !== void 0 ? _a : null,
      error: (_b = params.error) !== null && _b !== void 0 ? _b : null,
    });
    return true;
  };
  NodeRegistry.prototype.sendEvent = function (nodeId, event, payload) {
    var node = this.nodesById.get(nodeId);
    if (!node) {
      return false;
    }
    return this.sendEventToSession(node, event, payload);
  };
  NodeRegistry.prototype.sendEventInternal = function (node, event, payload) {
    try {
      node.client.socket.send(
        JSON.stringify({
          type: "event",
          event: event,
          payload: payload,
        }),
      );
      return true;
    } catch (_a) {
      return false;
    }
  };
  NodeRegistry.prototype.sendEventToSession = function (node, event, payload) {
    return this.sendEventInternal(node, event, payload);
  };
  return NodeRegistry;
})();
exports.NodeRegistry = NodeRegistry;
