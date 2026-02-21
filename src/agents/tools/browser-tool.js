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
exports.createBrowserTool = createBrowserTool;
var client_js_1 = require("../../browser/client.js");
var client_actions_js_1 = require("../../browser/client-actions.js");
var node_crypto_1 = require("node:crypto");
var config_js_1 = require("../../browser/config.js");
var constants_js_1 = require("../../browser/constants.js");
var config_js_2 = require("../../config/config.js");
var store_js_1 = require("../../media/store.js");
var nodes_utils_js_1 = require("./nodes-utils.js");
var browser_tool_schema_js_1 = require("./browser-tool.schema.js");
var common_js_1 = require("./common.js");
var gateway_js_1 = require("./gateway.js");
var DEFAULT_BROWSER_PROXY_TIMEOUT_MS = 20000;
function isBrowserNode(node) {
  var caps = Array.isArray(node.caps) ? node.caps : [];
  var commands = Array.isArray(node.commands) ? node.commands : [];
  return caps.includes("browser") || commands.includes("browser.proxy");
}
function resolveBrowserNodeTarget(params) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg, policy, mode, nodes, browserNodes, requested, nodeId_1, node, node, node;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
    return __generator(this, function (_o) {
      switch (_o.label) {
        case 0:
          cfg = (0, config_js_2.loadConfig)();
          policy =
            (_b = (_a = cfg.gateway) === null || _a === void 0 ? void 0 : _a.nodes) === null ||
            _b === void 0
              ? void 0
              : _b.browser;
          mode =
            (_c = policy === null || policy === void 0 ? void 0 : policy.mode) !== null &&
            _c !== void 0
              ? _c
              : "auto";
          if (mode === "off") {
            if (params.target === "node" || params.requestedNode) {
              throw new Error("Node browser proxy is disabled (gateway.nodes.browser.mode=off).");
            }
            return [2 /*return*/, null];
          }
          if (
            ((_d = params.sandboxBridgeUrl) === null || _d === void 0 ? void 0 : _d.trim()) &&
            params.target !== "node" &&
            !params.requestedNode
          ) {
            return [2 /*return*/, null];
          }
          if (params.target && params.target !== "node") {
            return [2 /*return*/, null];
          }
          if (mode === "manual" && params.target !== "node" && !params.requestedNode) {
            return [2 /*return*/, null];
          }
          return [4 /*yield*/, (0, nodes_utils_js_1.listNodes)({})];
        case 1:
          nodes = _o.sent();
          browserNodes = nodes.filter(function (node) {
            return node.connected && isBrowserNode(node);
          });
          if (browserNodes.length === 0) {
            if (params.target === "node" || params.requestedNode) {
              throw new Error("No connected browser-capable nodes.");
            }
            return [2 /*return*/, null];
          }
          requested =
            ((_e = params.requestedNode) === null || _e === void 0 ? void 0 : _e.trim()) ||
            ((_f = policy === null || policy === void 0 ? void 0 : policy.node) === null ||
            _f === void 0
              ? void 0
              : _f.trim());
          if (requested) {
            nodeId_1 = (0, nodes_utils_js_1.resolveNodeIdFromList)(browserNodes, requested, false);
            node = browserNodes.find(function (entry) {
              return entry.nodeId === nodeId_1;
            });
            return [
              2 /*return*/,
              {
                nodeId: nodeId_1,
                label:
                  (_h =
                    (_g = node === null || node === void 0 ? void 0 : node.displayName) !== null &&
                    _g !== void 0
                      ? _g
                      : node === null || node === void 0
                        ? void 0
                        : node.remoteIp) !== null && _h !== void 0
                    ? _h
                    : nodeId_1,
              },
            ];
          }
          if (params.target === "node") {
            if (browserNodes.length === 1) {
              node = browserNodes[0];
              return [
                2 /*return*/,
                {
                  nodeId: node.nodeId,
                  label:
                    (_k =
                      (_j = node.displayName) !== null && _j !== void 0 ? _j : node.remoteIp) !==
                      null && _k !== void 0
                      ? _k
                      : node.nodeId,
                },
              ];
            }
            throw new Error(
              "Multiple browser-capable nodes connected (".concat(
                browserNodes.length,
                "). Set gateway.nodes.browser.node or pass node=<id>.",
              ),
            );
          }
          if (mode === "manual") {
            return [2 /*return*/, null];
          }
          if (browserNodes.length === 1) {
            node = browserNodes[0];
            return [
              2 /*return*/,
              {
                nodeId: node.nodeId,
                label:
                  (_m = (_l = node.displayName) !== null && _l !== void 0 ? _l : node.remoteIp) !==
                    null && _m !== void 0
                    ? _m
                    : node.nodeId,
              },
            ];
          }
          return [2 /*return*/, null];
      }
    });
  });
}
function callBrowserProxy(params) {
  return __awaiter(this, void 0, void 0, function () {
    var gatewayTimeoutMs, payload, parsed;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          gatewayTimeoutMs =
            typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs)
              ? Math.max(1, Math.floor(params.timeoutMs))
              : DEFAULT_BROWSER_PROXY_TIMEOUT_MS;
          return [
            4 /*yield*/,
            (0, gateway_js_1.callGatewayTool)(
              "node.invoke",
              { timeoutMs: gatewayTimeoutMs },
              {
                nodeId: params.nodeId,
                command: "browser.proxy",
                params: {
                  method: params.method,
                  path: params.path,
                  query: params.query,
                  body: params.body,
                  timeoutMs: params.timeoutMs,
                  profile: params.profile,
                },
                idempotencyKey: node_crypto_1.default.randomUUID(),
              },
            ),
          ];
        case 1:
          payload = _b.sent();
          parsed =
            (_a = payload === null || payload === void 0 ? void 0 : payload.payload) !== null &&
            _a !== void 0
              ? _a
              : typeof (payload === null || payload === void 0 ? void 0 : payload.payloadJSON) ===
                    "string" && payload.payloadJSON
                ? JSON.parse(payload.payloadJSON)
                : null;
          if (!parsed || typeof parsed !== "object") {
            throw new Error("browser proxy failed");
          }
          return [2 /*return*/, parsed];
      }
    });
  });
}
function persistProxyFiles(files) {
  return __awaiter(this, void 0, void 0, function () {
    var mapping, _i, files_1, file, buffer, saved;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!files || files.length === 0) {
            return [2 /*return*/, new Map()];
          }
          mapping = new Map();
          ((_i = 0), (files_1 = files));
          _a.label = 1;
        case 1:
          if (!(_i < files_1.length)) {
            return [3 /*break*/, 4];
          }
          file = files_1[_i];
          buffer = Buffer.from(file.base64, "base64");
          return [
            4 /*yield*/,
            (0, store_js_1.saveMediaBuffer)(buffer, file.mimeType, "browser", buffer.byteLength),
          ];
        case 2:
          saved = _a.sent();
          mapping.set(file.path, saved.path);
          _a.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/, mapping];
      }
    });
  });
}
function applyProxyPaths(result, mapping) {
  if (!result || typeof result !== "object") {
    return;
  }
  var obj = result;
  if (typeof obj.path === "string" && mapping.has(obj.path)) {
    obj.path = mapping.get(obj.path);
  }
  if (typeof obj.imagePath === "string" && mapping.has(obj.imagePath)) {
    obj.imagePath = mapping.get(obj.imagePath);
  }
  var download = obj.download;
  if (download && typeof download === "object") {
    var d = download;
    if (typeof d.path === "string" && mapping.has(d.path)) {
      d.path = mapping.get(d.path);
    }
  }
}
function resolveBrowserBaseUrl(params) {
  var _a, _b, _c;
  var cfg = (0, config_js_2.loadConfig)();
  var resolved = (0, config_js_1.resolveBrowserConfig)(cfg.browser, cfg);
  var normalizedSandbox =
    (_b = (_a = params.sandboxBridgeUrl) === null || _a === void 0 ? void 0 : _a.trim()) !== null &&
    _b !== void 0
      ? _b
      : "";
  var target =
    (_c = params.target) !== null && _c !== void 0 ? _c : normalizedSandbox ? "sandbox" : "host";
  if (target === "sandbox") {
    if (!normalizedSandbox) {
      throw new Error(
        'Sandbox browser is unavailable. Enable agents.defaults.sandbox.browser.enabled or use target="host" if allowed.',
      );
    }
    return normalizedSandbox.replace(/\/$/, "");
  }
  if (params.allowHostControl === false) {
    throw new Error("Host browser control is disabled by sandbox policy.");
  }
  if (!resolved.enabled) {
    throw new Error(
      "Browser control is disabled. Set browser.enabled=true in ~/.openclaw/openclaw.json.",
    );
  }
  return undefined;
}
function createBrowserTool(opts) {
  var _this = this;
  var targetDefault = (opts === null || opts === void 0 ? void 0 : opts.sandboxBridgeUrl)
    ? "sandbox"
    : "host";
  var hostHint =
    (opts === null || opts === void 0 ? void 0 : opts.allowHostControl) === false
      ? "Host target blocked by policy."
      : "Host target allowed.";
  return {
    label: "Browser",
    name: "browser",
    description: [
      "Control the browser via OpenClaw's browser control server (status/start/stop/profiles/tabs/open/snapshot/screenshot/actions).",
      'Profiles: use profile="chrome" for Chrome extension relay takeover (your existing Chrome tabs). Use profile="openclaw" for the isolated openclaw-managed browser.',
      'If the user mentions the Chrome extension / Browser Relay / toolbar button / “attach tab”, ALWAYS use profile="chrome" (do not ask which profile).',
      'When a node-hosted browser proxy is available, the tool may auto-route to it. Pin a node with node=<id|name> or target="node".',
      "Chrome extension relay needs an attached tab: user must click the OpenClaw Browser Relay toolbar icon on the tab (badge ON). If no tab is connected, ask them to attach it.",
      "When using refs from snapshot (e.g. e12), keep the same tab: prefer passing targetId from the snapshot response into subsequent actions (act/click/type/etc).",
      'For stable, self-resolving refs across calls, use snapshot with refs="aria" (Playwright aria-ref ids). Default refs="role" are role+name-based.',
      "Use snapshot+act for UI automation. Avoid act:wait by default; use only in exceptional cases when no reliable UI state exists.",
      "target selects browser location (sandbox|host|node). Default: ".concat(targetDefault, "."),
      hostHint,
    ].join(" "),
    parameters: browser_tool_schema_js_1.BrowserToolSchema,
    execute: function (_toolCallId, args) {
      return __awaiter(_this, void 0, void 0, function () {
        var params,
          action,
          profile,
          requestedNode,
          target,
          nodeTarget,
          resolvedTarget,
          baseUrl,
          proxyRequest,
          _a,
          _b,
          _c,
          _d,
          _e,
          _f,
          _g,
          result,
          _h,
          result,
          tabs,
          _j,
          targetUrl,
          result,
          _k,
          targetId,
          result,
          targetId,
          result,
          _l,
          snapshotDefaults,
          format,
          mode,
          labels,
          refs,
          hasMaxChars,
          targetId,
          limit,
          maxChars,
          resolvedMaxChars,
          interactive,
          compact,
          depth,
          selector,
          frame,
          snapshot,
          _m,
          targetId,
          fullPage,
          ref,
          element,
          type,
          result,
          _o,
          targetUrl,
          targetId,
          result,
          _p,
          level,
          targetId,
          result,
          _q,
          targetId,
          result,
          _r,
          paths,
          ref,
          inputRef,
          element,
          targetId,
          timeoutMs,
          result,
          _s,
          accept,
          promptText,
          targetId,
          timeoutMs,
          result,
          _t,
          request,
          result,
          _u,
          err_1,
          msg,
          tabs,
          _v;
        var _w, _x;
        var _this = this;
        var _y, _z, _0;
        return __generator(this, function (_1) {
          switch (_1.label) {
            case 0:
              params = args;
              action = (0, common_js_1.readStringParam)(params, "action", { required: true });
              profile = (0, common_js_1.readStringParam)(params, "profile");
              requestedNode = (0, common_js_1.readStringParam)(params, "node");
              target = (0, common_js_1.readStringParam)(params, "target");
              if (requestedNode && target && target !== "node") {
                throw new Error('node is only supported with target="node".');
              }
              if (!target && !requestedNode && profile === "chrome") {
                // Chrome extension relay takeover is a host Chrome feature; prefer host unless explicitly targeting a node.
                target = "host";
              }
              return [
                4 /*yield*/,
                resolveBrowserNodeTarget({
                  requestedNode:
                    requestedNode !== null && requestedNode !== void 0 ? requestedNode : undefined,
                  target: target,
                  sandboxBridgeUrl:
                    opts === null || opts === void 0 ? void 0 : opts.sandboxBridgeUrl,
                }),
              ];
            case 1:
              nodeTarget = _1.sent();
              resolvedTarget = target === "node" ? undefined : target;
              baseUrl = nodeTarget
                ? undefined
                : resolveBrowserBaseUrl({
                    target: resolvedTarget,
                    sandboxBridgeUrl:
                      opts === null || opts === void 0 ? void 0 : opts.sandboxBridgeUrl,
                    allowHostControl:
                      opts === null || opts === void 0 ? void 0 : opts.allowHostControl,
                  });
              proxyRequest = nodeTarget
                ? function (opts) {
                    return __awaiter(_this, void 0, void 0, function () {
                      var proxy, mapping;
                      return __generator(this, function (_a) {
                        switch (_a.label) {
                          case 0:
                            return [
                              4 /*yield*/,
                              callBrowserProxy({
                                nodeId: nodeTarget.nodeId,
                                method: opts.method,
                                path: opts.path,
                                query: opts.query,
                                body: opts.body,
                                timeoutMs: opts.timeoutMs,
                                profile: opts.profile,
                              }),
                            ];
                          case 1:
                            proxy = _a.sent();
                            return [4 /*yield*/, persistProxyFiles(proxy.files)];
                          case 2:
                            mapping = _a.sent();
                            applyProxyPaths(proxy.result, mapping);
                            return [2 /*return*/, proxy.result];
                        }
                      });
                    });
                  }
                : null;
              _a = action;
              switch (_a) {
                case "status":
                  return [3 /*break*/, 2];
                case "start":
                  return [3 /*break*/, 6];
                case "stop":
                  return [3 /*break*/, 12];
                case "profiles":
                  return [3 /*break*/, 18];
                case "tabs":
                  return [3 /*break*/, 22];
                case "open":
                  return [3 /*break*/, 26];
                case "focus":
                  return [3 /*break*/, 30];
                case "close":
                  return [3 /*break*/, 34];
                case "snapshot":
                  return [3 /*break*/, 44];
                case "screenshot":
                  return [3 /*break*/, 52];
                case "navigate":
                  return [3 /*break*/, 58];
                case "console":
                  return [3 /*break*/, 62];
                case "pdf":
                  return [3 /*break*/, 66];
                case "upload":
                  return [3 /*break*/, 71];
                case "dialog":
                  return [3 /*break*/, 75];
                case "act":
                  return [3 /*break*/, 79];
              }
              return [3 /*break*/, 91];
            case 2:
              if (!proxyRequest) {
                return [3 /*break*/, 4];
              }
              _b = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "GET",
                  path: "/",
                  profile: profile,
                }),
              ];
            case 3:
              return [2 /*return*/, _b.apply(void 0, [_1.sent()])];
            case 4:
              _c = common_js_1.jsonResult;
              return [4 /*yield*/, (0, client_js_1.browserStatus)(baseUrl, { profile: profile })];
            case 5:
              return [2 /*return*/, _c.apply(void 0, [_1.sent()])];
            case 6:
              if (!proxyRequest) {
                return [3 /*break*/, 9];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "POST",
                  path: "/start",
                  profile: profile,
                }),
              ];
            case 7:
              _1.sent();
              _d = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "GET",
                  path: "/",
                  profile: profile,
                }),
              ];
            case 8:
              return [2 /*return*/, _d.apply(void 0, [_1.sent()])];
            case 9:
              return [4 /*yield*/, (0, client_js_1.browserStart)(baseUrl, { profile: profile })];
            case 10:
              _1.sent();
              _e = common_js_1.jsonResult;
              return [4 /*yield*/, (0, client_js_1.browserStatus)(baseUrl, { profile: profile })];
            case 11:
              return [2 /*return*/, _e.apply(void 0, [_1.sent()])];
            case 12:
              if (!proxyRequest) {
                return [3 /*break*/, 15];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "POST",
                  path: "/stop",
                  profile: profile,
                }),
              ];
            case 13:
              _1.sent();
              _f = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "GET",
                  path: "/",
                  profile: profile,
                }),
              ];
            case 14:
              return [2 /*return*/, _f.apply(void 0, [_1.sent()])];
            case 15:
              return [4 /*yield*/, (0, client_js_1.browserStop)(baseUrl, { profile: profile })];
            case 16:
              _1.sent();
              _g = common_js_1.jsonResult;
              return [4 /*yield*/, (0, client_js_1.browserStatus)(baseUrl, { profile: profile })];
            case 17:
              return [2 /*return*/, _g.apply(void 0, [_1.sent()])];
            case 18:
              if (!proxyRequest) {
                return [3 /*break*/, 20];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "GET",
                  path: "/profiles",
                }),
              ];
            case 19:
              result = _1.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)(result)];
            case 20:
              _h = common_js_1.jsonResult;
              _w = {};
              return [4 /*yield*/, (0, client_js_1.browserProfiles)(baseUrl)];
            case 21:
              return [2 /*return*/, _h.apply(void 0, [((_w.profiles = _1.sent()), _w)])];
            case 22:
              if (!proxyRequest) {
                return [3 /*break*/, 24];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "GET",
                  path: "/tabs",
                  profile: profile,
                }),
              ];
            case 23:
              result = _1.sent();
              tabs = (_y = result.tabs) !== null && _y !== void 0 ? _y : [];
              return [2 /*return*/, (0, common_js_1.jsonResult)({ tabs: tabs })];
            case 24:
              _j = common_js_1.jsonResult;
              _x = {};
              return [4 /*yield*/, (0, client_js_1.browserTabs)(baseUrl, { profile: profile })];
            case 25:
              return [2 /*return*/, _j.apply(void 0, [((_x.tabs = _1.sent()), _x)])];
            case 26:
              targetUrl = (0, common_js_1.readStringParam)(params, "targetUrl", {
                required: true,
              });
              if (!proxyRequest) {
                return [3 /*break*/, 28];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "POST",
                  path: "/tabs/open",
                  profile: profile,
                  body: { url: targetUrl },
                }),
              ];
            case 27:
              result = _1.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)(result)];
            case 28:
              _k = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, client_js_1.browserOpenTab)(baseUrl, targetUrl, { profile: profile }),
              ];
            case 29:
              return [2 /*return*/, _k.apply(void 0, [_1.sent()])];
            case 30:
              targetId = (0, common_js_1.readStringParam)(params, "targetId", {
                required: true,
              });
              if (!proxyRequest) {
                return [3 /*break*/, 32];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "POST",
                  path: "/tabs/focus",
                  profile: profile,
                  body: { targetId: targetId },
                }),
              ];
            case 31:
              result = _1.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)(result)];
            case 32:
              return [
                4 /*yield*/,
                (0, client_js_1.browserFocusTab)(baseUrl, targetId, { profile: profile }),
              ];
            case 33:
              _1.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
            case 34:
              targetId = (0, common_js_1.readStringParam)(params, "targetId");
              if (!proxyRequest) {
                return [3 /*break*/, 39];
              }
              if (!targetId) {
                return [3 /*break*/, 36];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "DELETE",
                  path: "/tabs/".concat(encodeURIComponent(targetId)),
                  profile: profile,
                }),
              ];
            case 35:
              _l = _1.sent();
              return [3 /*break*/, 38];
            case 36:
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "POST",
                  path: "/act",
                  profile: profile,
                  body: { kind: "close" },
                }),
              ];
            case 37:
              _l = _1.sent();
              _1.label = 38;
            case 38:
              result = _l;
              return [2 /*return*/, (0, common_js_1.jsonResult)(result)];
            case 39:
              if (!targetId) {
                return [3 /*break*/, 41];
              }
              return [
                4 /*yield*/,
                (0, client_js_1.browserCloseTab)(baseUrl, targetId, { profile: profile }),
              ];
            case 40:
              _1.sent();
              return [3 /*break*/, 43];
            case 41:
              return [
                4 /*yield*/,
                (0, client_actions_js_1.browserAct)(
                  baseUrl,
                  { kind: "close" },
                  { profile: profile },
                ),
              ];
            case 42:
              _1.sent();
              _1.label = 43;
            case 43:
              return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
            case 44:
              snapshotDefaults =
                (_z = (0, config_js_2.loadConfig)().browser) === null || _z === void 0
                  ? void 0
                  : _z.snapshotDefaults;
              format =
                params.snapshotFormat === "ai" || params.snapshotFormat === "aria"
                  ? params.snapshotFormat
                  : "ai";
              mode =
                params.mode === "efficient"
                  ? "efficient"
                  : format === "ai" &&
                      (snapshotDefaults === null || snapshotDefaults === void 0
                        ? void 0
                        : snapshotDefaults.mode) === "efficient"
                    ? "efficient"
                    : undefined;
              labels = typeof params.labels === "boolean" ? params.labels : undefined;
              refs = params.refs === "aria" || params.refs === "role" ? params.refs : undefined;
              hasMaxChars = Object.hasOwn(params, "maxChars");
              targetId = typeof params.targetId === "string" ? params.targetId.trim() : undefined;
              limit =
                typeof params.limit === "number" && Number.isFinite(params.limit)
                  ? params.limit
                  : undefined;
              maxChars =
                typeof params.maxChars === "number" &&
                Number.isFinite(params.maxChars) &&
                params.maxChars > 0
                  ? Math.floor(params.maxChars)
                  : undefined;
              resolvedMaxChars =
                format === "ai"
                  ? hasMaxChars
                    ? maxChars
                    : mode === "efficient"
                      ? undefined
                      : constants_js_1.DEFAULT_AI_SNAPSHOT_MAX_CHARS
                  : undefined;
              interactive =
                typeof params.interactive === "boolean" ? params.interactive : undefined;
              compact = typeof params.compact === "boolean" ? params.compact : undefined;
              depth =
                typeof params.depth === "number" && Number.isFinite(params.depth)
                  ? params.depth
                  : undefined;
              selector = typeof params.selector === "string" ? params.selector.trim() : undefined;
              frame = typeof params.frame === "string" ? params.frame.trim() : undefined;
              if (!proxyRequest) {
                return [3 /*break*/, 46];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "GET",
                  path: "/snapshot",
                  profile: profile,
                  query: __assign(
                    __assign(
                      { format: format, targetId: targetId, limit: limit },
                      typeof resolvedMaxChars === "number" ? { maxChars: resolvedMaxChars } : {},
                    ),
                    {
                      refs: refs,
                      interactive: interactive,
                      compact: compact,
                      depth: depth,
                      selector: selector,
                      frame: frame,
                      labels: labels,
                      mode: mode,
                    },
                  ),
                }),
              ];
            case 45:
              _m = _1.sent();
              return [3 /*break*/, 48];
            case 46:
              return [
                4 /*yield*/,
                (0, client_js_1.browserSnapshot)(
                  baseUrl,
                  __assign(
                    __assign(
                      { format: format, targetId: targetId, limit: limit },
                      typeof resolvedMaxChars === "number" ? { maxChars: resolvedMaxChars } : {},
                    ),
                    {
                      refs: refs,
                      interactive: interactive,
                      compact: compact,
                      depth: depth,
                      selector: selector,
                      frame: frame,
                      labels: labels,
                      mode: mode,
                      profile: profile,
                    },
                  ),
                ),
              ];
            case 47:
              _m = _1.sent();
              _1.label = 48;
            case 48:
              snapshot = _m;
              if (!(snapshot.format === "ai")) {
                return [3 /*break*/, 51];
              }
              if (!(labels && snapshot.imagePath)) {
                return [3 /*break*/, 50];
              }
              return [
                4 /*yield*/,
                (0, common_js_1.imageResultFromFile)({
                  label: "browser:snapshot",
                  path: snapshot.imagePath,
                  extraText: snapshot.snapshot,
                  details: snapshot,
                }),
              ];
            case 49:
              return [2 /*return*/, _1.sent()];
            case 50:
              return [
                2 /*return*/,
                {
                  content: [{ type: "text", text: snapshot.snapshot }],
                  details: snapshot,
                },
              ];
            case 51:
              return [2 /*return*/, (0, common_js_1.jsonResult)(snapshot)];
            case 52:
              targetId = (0, common_js_1.readStringParam)(params, "targetId");
              fullPage = Boolean(params.fullPage);
              ref = (0, common_js_1.readStringParam)(params, "ref");
              element = (0, common_js_1.readStringParam)(params, "element");
              type = params.type === "jpeg" ? "jpeg" : "png";
              if (!proxyRequest) {
                return [3 /*break*/, 54];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "POST",
                  path: "/screenshot",
                  profile: profile,
                  body: {
                    targetId: targetId,
                    fullPage: fullPage,
                    ref: ref,
                    element: element,
                    type: type,
                  },
                }),
              ];
            case 53:
              _o = _1.sent();
              return [3 /*break*/, 56];
            case 54:
              return [
                4 /*yield*/,
                (0, client_actions_js_1.browserScreenshotAction)(baseUrl, {
                  targetId: targetId,
                  fullPage: fullPage,
                  ref: ref,
                  element: element,
                  type: type,
                  profile: profile,
                }),
              ];
            case 55:
              _o = _1.sent();
              _1.label = 56;
            case 56:
              result = _o;
              return [
                4 /*yield*/,
                (0, common_js_1.imageResultFromFile)({
                  label: "browser:screenshot",
                  path: result.path,
                  details: result,
                }),
              ];
            case 57:
              return [2 /*return*/, _1.sent()];
            case 58:
              targetUrl = (0, common_js_1.readStringParam)(params, "targetUrl", {
                required: true,
              });
              targetId = (0, common_js_1.readStringParam)(params, "targetId");
              if (!proxyRequest) {
                return [3 /*break*/, 60];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "POST",
                  path: "/navigate",
                  profile: profile,
                  body: {
                    url: targetUrl,
                    targetId: targetId,
                  },
                }),
              ];
            case 59:
              result = _1.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)(result)];
            case 60:
              _p = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, client_actions_js_1.browserNavigate)(baseUrl, {
                  url: targetUrl,
                  targetId: targetId,
                  profile: profile,
                }),
              ];
            case 61:
              return [2 /*return*/, _p.apply(void 0, [_1.sent()])];
            case 62:
              level = typeof params.level === "string" ? params.level.trim() : undefined;
              targetId = typeof params.targetId === "string" ? params.targetId.trim() : undefined;
              if (!proxyRequest) {
                return [3 /*break*/, 64];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "GET",
                  path: "/console",
                  profile: profile,
                  query: {
                    level: level,
                    targetId: targetId,
                  },
                }),
              ];
            case 63:
              result = _1.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)(result)];
            case 64:
              _q = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, client_actions_js_1.browserConsoleMessages)(baseUrl, {
                  level: level,
                  targetId: targetId,
                  profile: profile,
                }),
              ];
            case 65:
              return [2 /*return*/, _q.apply(void 0, [_1.sent()])];
            case 66:
              targetId = typeof params.targetId === "string" ? params.targetId.trim() : undefined;
              if (!proxyRequest) {
                return [3 /*break*/, 68];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "POST",
                  path: "/pdf",
                  profile: profile,
                  body: { targetId: targetId },
                }),
              ];
            case 67:
              _r = _1.sent();
              return [3 /*break*/, 70];
            case 68:
              return [
                4 /*yield*/,
                (0, client_actions_js_1.browserPdfSave)(baseUrl, {
                  targetId: targetId,
                  profile: profile,
                }),
              ];
            case 69:
              _r = _1.sent();
              _1.label = 70;
            case 70:
              result = _r;
              return [
                2 /*return*/,
                {
                  content: [{ type: "text", text: "FILE:".concat(result.path) }],
                  details: result,
                },
              ];
            case 71:
              paths = Array.isArray(params.paths)
                ? params.paths.map(function (p) {
                    return String(p);
                  })
                : [];
              if (paths.length === 0) {
                throw new Error("paths required");
              }
              ref = (0, common_js_1.readStringParam)(params, "ref");
              inputRef = (0, common_js_1.readStringParam)(params, "inputRef");
              element = (0, common_js_1.readStringParam)(params, "element");
              targetId = typeof params.targetId === "string" ? params.targetId.trim() : undefined;
              timeoutMs =
                typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs)
                  ? params.timeoutMs
                  : undefined;
              if (!proxyRequest) {
                return [3 /*break*/, 73];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "POST",
                  path: "/hooks/file-chooser",
                  profile: profile,
                  body: {
                    paths: paths,
                    ref: ref,
                    inputRef: inputRef,
                    element: element,
                    targetId: targetId,
                    timeoutMs: timeoutMs,
                  },
                }),
              ];
            case 72:
              result = _1.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)(result)];
            case 73:
              _s = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, client_actions_js_1.browserArmFileChooser)(baseUrl, {
                  paths: paths,
                  ref: ref,
                  inputRef: inputRef,
                  element: element,
                  targetId: targetId,
                  timeoutMs: timeoutMs,
                  profile: profile,
                }),
              ];
            case 74:
              return [2 /*return*/, _s.apply(void 0, [_1.sent()])];
            case 75:
              accept = Boolean(params.accept);
              promptText = typeof params.promptText === "string" ? params.promptText : undefined;
              targetId = typeof params.targetId === "string" ? params.targetId.trim() : undefined;
              timeoutMs =
                typeof params.timeoutMs === "number" && Number.isFinite(params.timeoutMs)
                  ? params.timeoutMs
                  : undefined;
              if (!proxyRequest) {
                return [3 /*break*/, 77];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "POST",
                  path: "/hooks/dialog",
                  profile: profile,
                  body: {
                    accept: accept,
                    promptText: promptText,
                    targetId: targetId,
                    timeoutMs: timeoutMs,
                  },
                }),
              ];
            case 76:
              result = _1.sent();
              return [2 /*return*/, (0, common_js_1.jsonResult)(result)];
            case 77:
              _t = common_js_1.jsonResult;
              return [
                4 /*yield*/,
                (0, client_actions_js_1.browserArmDialog)(baseUrl, {
                  accept: accept,
                  promptText: promptText,
                  targetId: targetId,
                  timeoutMs: timeoutMs,
                  profile: profile,
                }),
              ];
            case 78:
              return [2 /*return*/, _t.apply(void 0, [_1.sent()])];
            case 79:
              request = params.request;
              if (!request || typeof request !== "object") {
                throw new Error("request required");
              }
              _1.label = 80;
            case 80:
              _1.trys.push([80, 85, , 91]);
              if (!proxyRequest) {
                return [3 /*break*/, 82];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "POST",
                  path: "/act",
                  profile: profile,
                  body: request,
                }),
              ];
            case 81:
              _u = _1.sent();
              return [3 /*break*/, 84];
            case 82:
              return [
                4 /*yield*/,
                (0, client_actions_js_1.browserAct)(baseUrl, request, {
                  profile: profile,
                }),
              ];
            case 83:
              _u = _1.sent();
              _1.label = 84;
            case 84:
              result = _u;
              return [2 /*return*/, (0, common_js_1.jsonResult)(result)];
            case 85:
              err_1 = _1.sent();
              msg = String(err_1);
              if (
                !(msg.includes("404:") && msg.includes("tab not found") && profile === "chrome")
              ) {
                return [3 /*break*/, 90];
              }
              if (!proxyRequest) {
                return [3 /*break*/, 87];
              }
              return [
                4 /*yield*/,
                proxyRequest({
                  method: "GET",
                  path: "/tabs",
                  profile: profile,
                }),
              ];
            case 86:
              _v = (_0 = _1.sent().tabs) !== null && _0 !== void 0 ? _0 : [];
              return [3 /*break*/, 89];
            case 87:
              return [
                4 /*yield*/,
                (0, client_js_1.browserTabs)(baseUrl, { profile: profile }).catch(function () {
                  return [];
                }),
              ];
            case 88:
              _v = _1.sent();
              _1.label = 89;
            case 89:
              tabs = _v;
              if (!tabs.length) {
                throw new Error(
                  "No Chrome tabs are attached via the OpenClaw Browser Relay extension. Click the toolbar icon on the tab you want to control (badge ON), then retry.",
                );
              }
              throw new Error(
                'Chrome tab not found (stale targetId?). Run action=tabs profile="chrome" and use one of the returned targetIds.',
              );
            case 90:
              throw err_1;
            case 91:
              throw new Error("Unknown action: ".concat(action));
          }
        });
      });
    },
  };
}
