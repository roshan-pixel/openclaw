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
exports.ensureChromeExtensionRelayServer = ensureChromeExtensionRelayServer;
exports.stopChromeExtensionRelayServer = stopChromeExtensionRelayServer;
var node_http_1 = require("node:http");
var ws_1 = require("ws");
var ws_js_1 = require("../infra/ws.js");
function isLoopbackHost(host) {
  var h = host.trim().toLowerCase();
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "0.0.0.0" ||
    h === "[::1]" ||
    h === "::1" ||
    h === "[::]" ||
    h === "::"
  );
}
function isLoopbackAddress(ip) {
  if (!ip) {
    return false;
  }
  if (ip === "127.0.0.1") {
    return true;
  }
  if (ip.startsWith("127.")) {
    return true;
  }
  if (ip === "::1") {
    return true;
  }
  if (ip.startsWith("::ffff:127.")) {
    return true;
  }
  return false;
}
function parseBaseUrl(raw) {
  var _a;
  var parsed = new URL(raw.trim().replace(/\/$/, ""));
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error("extension relay cdpUrl must be http(s), got ".concat(parsed.protocol));
  }
  var host = parsed.hostname;
  var port =
    ((_a = parsed.port) === null || _a === void 0 ? void 0 : _a.trim()) !== ""
      ? Number(parsed.port)
      : parsed.protocol === "https:"
        ? 443
        : 80;
  if (!Number.isFinite(port) || port <= 0 || port > 65535) {
    throw new Error("extension relay cdpUrl has invalid port: ".concat(parsed.port || "(empty)"));
  }
  return { host: host, port: port, baseUrl: parsed.toString().replace(/\/$/, "") };
}
function text(res, status, bodyText) {
  var body = Buffer.from(bodyText);
  res.write(
    "HTTP/1.1 ".concat(status, " ").concat(status === 200 ? "OK" : "ERR", "\r\n") +
      "Content-Type: text/plain; charset=utf-8\r\n" +
      "Content-Length: ".concat(body.length, "\r\n") +
      "Connection: close\r\n" +
      "\r\n",
  );
  res.write(body);
  res.end();
}
function rejectUpgrade(socket, status, bodyText) {
  text(socket, status, bodyText);
  try {
    socket.destroy();
  } catch (_a) {
    // ignore
  }
}
var serversByPort = new Map();
function ensureChromeExtensionRelayServer(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var info,
      existing,
      extensionWs,
      cdpClients,
      connectedTargets,
      pendingExtension,
      nextExtensionId,
      sendToExtension,
      broadcastToCdpClients,
      sendResponseToCdp,
      ensureTargetEventsForClient,
      routeCdpCommand,
      server,
      wssExtension,
      wssCdp,
      addr,
      port,
      host,
      baseUrl,
      relay;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          info = parseBaseUrl(opts.cdpUrl);
          if (!isLoopbackHost(info.host)) {
            throw new Error(
              "extension relay requires loopback cdpUrl host (got ".concat(info.host, ")"),
            );
          }
          existing = serversByPort.get(info.port);
          if (existing) {
            return [2 /*return*/, existing];
          }
          extensionWs = null;
          cdpClients = new Set();
          connectedTargets = new Map();
          pendingExtension = new Map();
          nextExtensionId = 1;
          sendToExtension = function (payload) {
            return __awaiter(_this, void 0, void 0, function () {
              var ws;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    ws = extensionWs;
                    if (!ws || ws.readyState !== ws_1.default.OPEN) {
                      throw new Error("Chrome extension not connected");
                    }
                    ws.send(JSON.stringify(payload));
                    return [
                      4 /*yield*/,
                      new Promise(function (resolve, reject) {
                        var timer = setTimeout(function () {
                          pendingExtension.delete(payload.id);
                          reject(
                            new Error("extension request timeout: ".concat(payload.params.method)),
                          );
                        }, 30000);
                        pendingExtension.set(payload.id, {
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
          broadcastToCdpClients = function (evt) {
            var msg = JSON.stringify(evt);
            for (var _i = 0, cdpClients_1 = cdpClients; _i < cdpClients_1.length; _i++) {
              var ws = cdpClients_1[_i];
              if (ws.readyState !== ws_1.default.OPEN) {
                continue;
              }
              ws.send(msg);
            }
          };
          sendResponseToCdp = function (ws, res) {
            if (ws.readyState !== ws_1.default.OPEN) {
              return;
            }
            ws.send(JSON.stringify(res));
          };
          ensureTargetEventsForClient = function (ws, mode) {
            for (var _i = 0, _a = connectedTargets.values(); _i < _a.length; _i++) {
              var target = _a[_i];
              if (mode === "autoAttach") {
                ws.send(
                  JSON.stringify({
                    method: "Target.attachedToTarget",
                    params: {
                      sessionId: target.sessionId,
                      targetInfo: __assign(__assign({}, target.targetInfo), { attached: true }),
                      waitingForDebugger: false,
                    },
                  }),
                );
              } else {
                ws.send(
                  JSON.stringify({
                    method: "Target.targetCreated",
                    params: {
                      targetInfo: __assign(__assign({}, target.targetInfo), { attached: true }),
                    },
                  }),
                );
              }
            }
          };
          routeCdpCommand = function (cmd) {
            return __awaiter(_this, void 0, void 0, function () {
              var _a, params, targetId, _i, _b, t, t, first, params, targetId, _c, _d, t, id;
              var _e, _f;
              return __generator(this, function (_g) {
                switch (_g.label) {
                  case 0:
                    _a = cmd.method;
                    switch (_a) {
                      case "Browser.getVersion":
                        return [3 /*break*/, 1];
                      case "Browser.setDownloadBehavior":
                        return [3 /*break*/, 2];
                      case "Target.setAutoAttach":
                        return [3 /*break*/, 3];
                      case "Target.setDiscoverTargets":
                        return [3 /*break*/, 3];
                      case "Target.getTargets":
                        return [3 /*break*/, 4];
                      case "Target.getTargetInfo":
                        return [3 /*break*/, 5];
                      case "Target.attachToTarget":
                        return [3 /*break*/, 6];
                    }
                    return [3 /*break*/, 7];
                  case 1:
                    return [
                      2 /*return*/,
                      {
                        protocolVersion: "1.3",
                        product: "Chrome/OpenClaw-Extension-Relay",
                        revision: "0",
                        userAgent: "OpenClaw-Extension-Relay",
                        jsVersion: "V8",
                      },
                    ];
                  case 2:
                    return [2 /*return*/, {}];
                  case 3:
                    return [2 /*return*/, {}];
                  case 4:
                    return [
                      2 /*return*/,
                      {
                        targetInfos: Array.from(connectedTargets.values()).map(function (t) {
                          return __assign(__assign({}, t.targetInfo), { attached: true });
                        }),
                      },
                    ];
                  case 5:
                    {
                      params = (_e = cmd.params) !== null && _e !== void 0 ? _e : {};
                      targetId = typeof params.targetId === "string" ? params.targetId : undefined;
                      if (targetId) {
                        for (_i = 0, _b = connectedTargets.values(); _i < _b.length; _i++) {
                          t = _b[_i];
                          if (t.targetId === targetId) {
                            return [2 /*return*/, { targetInfo: t.targetInfo }];
                          }
                        }
                      }
                      if (cmd.sessionId && connectedTargets.has(cmd.sessionId)) {
                        t = connectedTargets.get(cmd.sessionId);
                        if (t) {
                          return [2 /*return*/, { targetInfo: t.targetInfo }];
                        }
                      }
                      first = Array.from(connectedTargets.values())[0];
                      return [
                        2 /*return*/,
                        {
                          targetInfo:
                            first === null || first === void 0 ? void 0 : first.targetInfo,
                        },
                      ];
                    }
                    _g.label = 6;
                  case 6:
                    {
                      params = (_f = cmd.params) !== null && _f !== void 0 ? _f : {};
                      targetId = typeof params.targetId === "string" ? params.targetId : undefined;
                      if (!targetId) {
                        throw new Error("targetId required");
                      }
                      for (_c = 0, _d = connectedTargets.values(); _c < _d.length; _c++) {
                        t = _d[_c];
                        if (t.targetId === targetId) {
                          return [2 /*return*/, { sessionId: t.sessionId }];
                        }
                      }
                      throw new Error("target not found");
                    }
                    _g.label = 7;
                  case 7:
                    id = nextExtensionId++;
                    return [
                      4 /*yield*/,
                      sendToExtension({
                        id: id,
                        method: "forwardCDPCommand",
                        params: {
                          method: cmd.method,
                          sessionId: cmd.sessionId,
                          params: cmd.params,
                        },
                      }),
                    ];
                  case 8:
                    return [2 /*return*/, _g.sent()];
                }
              });
            });
          };
          server = (0, node_http_1.createServer)(function (req, res) {
            var _a, _b, _c, _d;
            var url = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "/", info.baseUrl);
            var path = url.pathname;
            if (req.method === "HEAD" && path === "/") {
              res.writeHead(200);
              res.end();
              return;
            }
            if (path === "/") {
              res.writeHead(200, { "Content-Type": "text/plain; charset=utf-8" });
              res.end("OK");
              return;
            }
            if (path === "/extension/status") {
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify({ connected: Boolean(extensionWs) }));
              return;
            }
            var hostHeader =
              ((_b = req.headers.host) === null || _b === void 0 ? void 0 : _b.trim()) ||
              "".concat(info.host, ":").concat(info.port);
            var wsHost = "ws://".concat(hostHeader);
            var cdpWsUrl = "".concat(wsHost, "/cdp");
            if (
              (path === "/json/version" || path === "/json/version/") &&
              (req.method === "GET" || req.method === "PUT")
            ) {
              var payload = {
                Browser: "OpenClaw/extension-relay",
                "Protocol-Version": "1.3",
              };
              // Only advertise the WS URL if a real extension is connected.
              if (extensionWs) {
                payload.webSocketDebuggerUrl = cdpWsUrl;
              }
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(payload));
              return;
            }
            var listPaths = new Set(["/json", "/json/", "/json/list", "/json/list/"]);
            if (listPaths.has(path) && (req.method === "GET" || req.method === "PUT")) {
              var list = Array.from(connectedTargets.values()).map(function (t) {
                var _a, _b, _c, _d;
                return {
                  id: t.targetId,
                  type: (_a = t.targetInfo.type) !== null && _a !== void 0 ? _a : "page",
                  title: (_b = t.targetInfo.title) !== null && _b !== void 0 ? _b : "",
                  description: (_c = t.targetInfo.title) !== null && _c !== void 0 ? _c : "",
                  url: (_d = t.targetInfo.url) !== null && _d !== void 0 ? _d : "",
                  webSocketDebuggerUrl: cdpWsUrl,
                  devtoolsFrontendUrl: "/devtools/inspector.html?ws=".concat(
                    cdpWsUrl.replace("ws://", ""),
                  ),
                };
              });
              res.writeHead(200, { "Content-Type": "application/json" });
              res.end(JSON.stringify(list));
              return;
            }
            var activateMatch = path.match(/^\/json\/activate\/(.+)$/);
            if (activateMatch && (req.method === "GET" || req.method === "PUT")) {
              var targetId_1 = decodeURIComponent(
                (_c = activateMatch[1]) !== null && _c !== void 0 ? _c : "",
              ).trim();
              if (!targetId_1) {
                res.writeHead(400);
                res.end("targetId required");
                return;
              }
              void (function () {
                return __awaiter(_this, void 0, void 0, function () {
                  var _a;
                  return __generator(this, function (_b) {
                    switch (_b.label) {
                      case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [
                          4 /*yield*/,
                          sendToExtension({
                            id: nextExtensionId++,
                            method: "forwardCDPCommand",
                            params: {
                              method: "Target.activateTarget",
                              params: { targetId: targetId_1 },
                            },
                          }),
                        ];
                      case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                      case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                      case 3:
                        return [2 /*return*/];
                    }
                  });
                });
              })();
              res.writeHead(200);
              res.end("OK");
              return;
            }
            var closeMatch = path.match(/^\/json\/close\/(.+)$/);
            if (closeMatch && (req.method === "GET" || req.method === "PUT")) {
              var targetId_2 = decodeURIComponent(
                (_d = closeMatch[1]) !== null && _d !== void 0 ? _d : "",
              ).trim();
              if (!targetId_2) {
                res.writeHead(400);
                res.end("targetId required");
                return;
              }
              void (function () {
                return __awaiter(_this, void 0, void 0, function () {
                  var _a;
                  return __generator(this, function (_b) {
                    switch (_b.label) {
                      case 0:
                        _b.trys.push([0, 2, , 3]);
                        return [
                          4 /*yield*/,
                          sendToExtension({
                            id: nextExtensionId++,
                            method: "forwardCDPCommand",
                            params: {
                              method: "Target.closeTarget",
                              params: { targetId: targetId_2 },
                            },
                          }),
                        ];
                      case 1:
                        _b.sent();
                        return [3 /*break*/, 3];
                      case 2:
                        _a = _b.sent();
                        return [3 /*break*/, 3];
                      case 3:
                        return [2 /*return*/];
                    }
                  });
                });
              })();
              res.writeHead(200);
              res.end("OK");
              return;
            }
            res.writeHead(404);
            res.end("not found");
          });
          wssExtension = new ws_1.WebSocketServer({ noServer: true });
          wssCdp = new ws_1.WebSocketServer({ noServer: true });
          server.on("upgrade", function (req, socket, head) {
            var _a;
            var url = new URL((_a = req.url) !== null && _a !== void 0 ? _a : "/", info.baseUrl);
            var pathname = url.pathname;
            var remote = req.socket.remoteAddress;
            if (!isLoopbackAddress(remote)) {
              rejectUpgrade(socket, 403, "Forbidden");
              return;
            }
            if (pathname === "/extension") {
              if (extensionWs) {
                rejectUpgrade(socket, 409, "Extension already connected");
                return;
              }
              wssExtension.handleUpgrade(req, socket, head, function (ws) {
                wssExtension.emit("connection", ws, req);
              });
              return;
            }
            if (pathname === "/cdp") {
              if (!extensionWs) {
                rejectUpgrade(socket, 503, "Extension not connected");
                return;
              }
              wssCdp.handleUpgrade(req, socket, head, function (ws) {
                wssCdp.emit("connection", ws, req);
              });
              return;
            }
            rejectUpgrade(socket, 404, "Not Found");
          });
          wssExtension.on("connection", function (ws) {
            extensionWs = ws;
            var ping = setInterval(function () {
              if (ws.readyState !== ws_1.default.OPEN) {
                return;
              }
              ws.send(JSON.stringify({ method: "ping" }));
            }, 5000);
            ws.on("message", function (data) {
              var _a, _b, _c, _d, _e, _f, _g;
              var parsed = null;
              try {
                parsed = JSON.parse((0, ws_js_1.rawDataToString)(data));
              } catch (_h) {
                return;
              }
              if (
                parsed &&
                typeof parsed === "object" &&
                "id" in parsed &&
                typeof parsed.id === "number"
              ) {
                var pending = pendingExtension.get(parsed.id);
                if (!pending) {
                  return;
                }
                pendingExtension.delete(parsed.id);
                clearTimeout(pending.timer);
                if ("error" in parsed && typeof parsed.error === "string" && parsed.error.trim()) {
                  pending.reject(new Error(parsed.error));
                } else {
                  pending.resolve(parsed.result);
                }
                return;
              }
              if (parsed && typeof parsed === "object" && "method" in parsed) {
                if (parsed.method === "pong") {
                  return;
                }
                if (parsed.method !== "forwardCDPEvent") {
                  return;
                }
                var evt = parsed;
                var method = (_a = evt.params) === null || _a === void 0 ? void 0 : _a.method;
                var params = (_b = evt.params) === null || _b === void 0 ? void 0 : _b.params;
                var sessionId = (_c = evt.params) === null || _c === void 0 ? void 0 : _c.sessionId;
                if (!method || typeof method !== "string") {
                  return;
                }
                if (method === "Target.attachedToTarget") {
                  var attached = params !== null && params !== void 0 ? params : {};
                  var targetType =
                    (_e =
                      (_d =
                        attached === null || attached === void 0 ? void 0 : attached.targetInfo) ===
                        null || _d === void 0
                        ? void 0
                        : _d.type) !== null && _e !== void 0
                      ? _e
                      : "page";
                  if (targetType !== "page") {
                    return;
                  }
                  if (
                    (attached === null || attached === void 0 ? void 0 : attached.sessionId) &&
                    ((_f =
                      attached === null || attached === void 0 ? void 0 : attached.targetInfo) ===
                      null || _f === void 0
                      ? void 0
                      : _f.targetId)
                  ) {
                    var prev = connectedTargets.get(attached.sessionId);
                    var nextTargetId = attached.targetInfo.targetId;
                    var prevTargetId = prev === null || prev === void 0 ? void 0 : prev.targetId;
                    var changedTarget = Boolean(
                      prev && prevTargetId && prevTargetId !== nextTargetId,
                    );
                    connectedTargets.set(attached.sessionId, {
                      sessionId: attached.sessionId,
                      targetId: nextTargetId,
                      targetInfo: attached.targetInfo,
                    });
                    if (changedTarget && prevTargetId) {
                      broadcastToCdpClients({
                        method: "Target.detachedFromTarget",
                        params: { sessionId: attached.sessionId, targetId: prevTargetId },
                        sessionId: attached.sessionId,
                      });
                    }
                    if (!prev || changedTarget) {
                      broadcastToCdpClients({
                        method: method,
                        params: params,
                        sessionId: sessionId,
                      });
                    }
                    return;
                  }
                }
                if (method === "Target.detachedFromTarget") {
                  var detached = params !== null && params !== void 0 ? params : {};
                  if (detached === null || detached === void 0 ? void 0 : detached.sessionId) {
                    connectedTargets.delete(detached.sessionId);
                  }
                  broadcastToCdpClients({ method: method, params: params, sessionId: sessionId });
                  return;
                }
                // Keep cached tab metadata fresh for /json/list.
                // After navigation, Chrome updates URL/title via Target.targetInfoChanged.
                if (method === "Target.targetInfoChanged") {
                  var changed = params !== null && params !== void 0 ? params : {};
                  var targetInfo =
                    changed === null || changed === void 0 ? void 0 : changed.targetInfo;
                  var targetId =
                    targetInfo === null || targetInfo === void 0 ? void 0 : targetInfo.targetId;
                  if (
                    targetId &&
                    ((_g =
                      targetInfo === null || targetInfo === void 0 ? void 0 : targetInfo.type) !==
                      null && _g !== void 0
                      ? _g
                      : "page") === "page"
                  ) {
                    for (
                      var _i = 0, connectedTargets_1 = connectedTargets;
                      _i < connectedTargets_1.length;
                      _i++
                    ) {
                      var _j = connectedTargets_1[_i],
                        sid = _j[0],
                        target = _j[1];
                      if (target.targetId !== targetId) {
                        continue;
                      }
                      connectedTargets.set(
                        sid,
                        __assign(__assign({}, target), {
                          targetInfo: __assign(__assign({}, target.targetInfo), targetInfo),
                        }),
                      );
                    }
                  }
                }
                broadcastToCdpClients({ method: method, params: params, sessionId: sessionId });
              }
            });
            ws.on("close", function () {
              clearInterval(ping);
              extensionWs = null;
              for (
                var _i = 0, pendingExtension_1 = pendingExtension;
                _i < pendingExtension_1.length;
                _i++
              ) {
                var _a = pendingExtension_1[_i],
                  pending = _a[1];
                clearTimeout(pending.timer);
                pending.reject(new Error("extension disconnected"));
              }
              pendingExtension.clear();
              connectedTargets.clear();
              for (var _b = 0, cdpClients_2 = cdpClients; _b < cdpClients_2.length; _b++) {
                var client = cdpClients_2[_b];
                try {
                  client.close(1011, "extension disconnected");
                } catch (_c) {
                  // ignore
                }
              }
              cdpClients.clear();
            });
          });
          wssCdp.on("connection", function (ws) {
            cdpClients.add(ws);
            ws.on("message", function (data) {
              return __awaiter(_this, void 0, void 0, function () {
                var cmd, result, discover, params, targetId_3, target, err_1;
                var _a, _b;
                return __generator(this, function (_c) {
                  switch (_c.label) {
                    case 0:
                      cmd = null;
                      try {
                        cmd = JSON.parse((0, ws_js_1.rawDataToString)(data));
                      } catch (_d) {
                        return [2 /*return*/];
                      }
                      if (!cmd || typeof cmd !== "object") {
                        return [2 /*return*/];
                      }
                      if (typeof cmd.id !== "number" || typeof cmd.method !== "string") {
                        return [2 /*return*/];
                      }
                      if (!extensionWs) {
                        sendResponseToCdp(ws, {
                          id: cmd.id,
                          sessionId: cmd.sessionId,
                          error: { message: "Extension not connected" },
                        });
                        return [2 /*return*/];
                      }
                      _c.label = 1;
                    case 1:
                      _c.trys.push([1, 3, , 4]);
                      return [4 /*yield*/, routeCdpCommand(cmd)];
                    case 2:
                      result = _c.sent();
                      if (cmd.method === "Target.setAutoAttach" && !cmd.sessionId) {
                        ensureTargetEventsForClient(ws, "autoAttach");
                      }
                      if (cmd.method === "Target.setDiscoverTargets") {
                        discover = (_a = cmd.params) !== null && _a !== void 0 ? _a : {};
                        if (discover.discover === true) {
                          ensureTargetEventsForClient(ws, "discover");
                        }
                      }
                      if (cmd.method === "Target.attachToTarget") {
                        params = (_b = cmd.params) !== null && _b !== void 0 ? _b : {};
                        targetId_3 =
                          typeof params.targetId === "string" ? params.targetId : undefined;
                        if (targetId_3) {
                          target = Array.from(connectedTargets.values()).find(function (t) {
                            return t.targetId === targetId_3;
                          });
                          if (target) {
                            ws.send(
                              JSON.stringify({
                                method: "Target.attachedToTarget",
                                params: {
                                  sessionId: target.sessionId,
                                  targetInfo: __assign(__assign({}, target.targetInfo), {
                                    attached: true,
                                  }),
                                  waitingForDebugger: false,
                                },
                              }),
                            );
                          }
                        }
                      }
                      sendResponseToCdp(ws, {
                        id: cmd.id,
                        sessionId: cmd.sessionId,
                        result: result,
                      });
                      return [3 /*break*/, 4];
                    case 3:
                      err_1 = _c.sent();
                      sendResponseToCdp(ws, {
                        id: cmd.id,
                        sessionId: cmd.sessionId,
                        error: { message: err_1 instanceof Error ? err_1.message : String(err_1) },
                      });
                      return [3 /*break*/, 4];
                    case 4:
                      return [2 /*return*/];
                  }
                });
              });
            });
            ws.on("close", function () {
              cdpClients.delete(ws);
            });
          });
          return [
            4 /*yield*/,
            new Promise(function (resolve, reject) {
              server.listen(info.port, info.host, function () {
                return resolve();
              });
              server.once("error", reject);
            }),
          ];
        case 1:
          _b.sent();
          addr = server.address();
          port =
            (_a = addr === null || addr === void 0 ? void 0 : addr.port) !== null && _a !== void 0
              ? _a
              : info.port;
          host = info.host;
          baseUrl = "".concat(new URL(info.baseUrl).protocol, "//").concat(host, ":").concat(port);
          relay = {
            host: host,
            port: port,
            baseUrl: baseUrl,
            cdpWsUrl: "ws://".concat(host, ":").concat(port, "/cdp"),
            extensionConnected: function () {
              return Boolean(extensionWs);
            },
            stop: function () {
              return __awaiter(_this, void 0, void 0, function () {
                var _i, cdpClients_3, ws;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      serversByPort.delete(port);
                      try {
                        extensionWs === null || extensionWs === void 0
                          ? void 0
                          : extensionWs.close(1001, "server stopping");
                      } catch (_b) {
                        // ignore
                      }
                      for (_i = 0, cdpClients_3 = cdpClients; _i < cdpClients_3.length; _i++) {
                        ws = cdpClients_3[_i];
                        try {
                          ws.close(1001, "server stopping");
                        } catch (_c) {
                          // ignore
                        }
                      }
                      return [
                        4 /*yield*/,
                        new Promise(function (resolve) {
                          server.close(function () {
                            return resolve();
                          });
                        }),
                      ];
                    case 1:
                      _a.sent();
                      wssExtension.close();
                      wssCdp.close();
                      return [2 /*return*/];
                  }
                });
              });
            },
          };
          serversByPort.set(port, relay);
          return [2 /*return*/, relay];
      }
    });
  });
}
function stopChromeExtensionRelayServer(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var info, existing;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          info = parseBaseUrl(opts.cdpUrl);
          existing = serversByPort.get(info.port);
          if (!existing) {
            return [2 /*return*/, false];
          }
          return [4 /*yield*/, existing.stop()];
        case 1:
          _a.sent();
          return [2 /*return*/, true];
      }
    });
  });
}
