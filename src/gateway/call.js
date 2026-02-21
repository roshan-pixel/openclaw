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
exports.buildGatewayConnectionDetails = buildGatewayConnectionDetails;
exports.callGateway = callGateway;
exports.randomIdempotencyKey = randomIdempotencyKey;
var node_crypto_1 = require("node:crypto");
var config_js_1 = require("../config/config.js");
var tailnet_js_1 = require("../infra/tailnet.js");
var device_identity_js_1 = require("../infra/device-identity.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var gateway_js_1 = require("../infra/tls/gateway.js");
var client_js_1 = require("./client.js");
var index_js_1 = require("./protocol/index.js");
function buildGatewayConnectionDetails(options) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  if (options === void 0) {
    options = {};
  }
  var config = (_a = options.config) !== null && _a !== void 0 ? _a : (0, config_js_1.loadConfig)();
  var configPath =
    (_b = options.configPath) !== null && _b !== void 0
      ? _b
      : (0, config_js_1.resolveConfigPath)(
          process.env,
          (0, config_js_1.resolveStateDir)(process.env),
        );
  var isRemoteMode =
    ((_c = config.gateway) === null || _c === void 0 ? void 0 : _c.mode) === "remote";
  var remote = isRemoteMode
    ? (_d = config.gateway) === null || _d === void 0
      ? void 0
      : _d.remote
    : undefined;
  var tlsEnabled =
    ((_f = (_e = config.gateway) === null || _e === void 0 ? void 0 : _e.tls) === null ||
    _f === void 0
      ? void 0
      : _f.enabled) === true;
  var localPort = (0, config_js_1.resolveGatewayPort)(config);
  var tailnetIPv4 = (0, tailnet_js_1.pickPrimaryTailnetIPv4)();
  var bindMode =
    (_h = (_g = config.gateway) === null || _g === void 0 ? void 0 : _g.bind) !== null &&
    _h !== void 0
      ? _h
      : "loopback";
  var preferTailnet = bindMode === "tailnet" && !!tailnetIPv4;
  var scheme = tlsEnabled ? "wss" : "ws";
  var localUrl =
    preferTailnet && tailnetIPv4
      ? "".concat(scheme, "://").concat(tailnetIPv4, ":").concat(localPort)
      : "".concat(scheme, "://127.0.0.1:").concat(localPort);
  var urlOverride =
    typeof options.url === "string" && options.url.trim().length > 0
      ? options.url.trim()
      : undefined;
  var remoteUrl =
    typeof (remote === null || remote === void 0 ? void 0 : remote.url) === "string" &&
    remote.url.trim().length > 0
      ? remote.url.trim()
      : undefined;
  var remoteMisconfigured = isRemoteMode && !urlOverride && !remoteUrl;
  var url = urlOverride || remoteUrl || localUrl;
  var urlSource = urlOverride
    ? "cli --url"
    : remoteUrl
      ? "config gateway.remote.url"
      : remoteMisconfigured
        ? "missing gateway.remote.url (fallback local)"
        : preferTailnet && tailnetIPv4
          ? "local tailnet ".concat(tailnetIPv4)
          : "local loopback";
  var remoteFallbackNote = remoteMisconfigured
    ? "Warn: gateway.mode=remote but gateway.remote.url is missing; set gateway.remote.url or switch gateway.mode=local."
    : undefined;
  var bindDetail = !urlOverride && !remoteUrl ? "Bind: ".concat(bindMode) : undefined;
  var message = [
    "Gateway target: ".concat(url),
    "Source: ".concat(urlSource),
    "Config: ".concat(configPath),
    bindDetail,
    remoteFallbackNote,
  ]
    .filter(Boolean)
    .join("\n");
  return {
    url: url,
    urlSource: urlSource,
    bindDetail: bindDetail,
    remoteFallbackNote: remoteFallbackNote,
    message: message,
  };
}
function callGateway(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var timeoutMs,
      config,
      isRemoteMode,
      remote,
      urlOverride,
      remoteUrl,
      configPath,
      authToken,
      authPassword,
      connectionDetails,
      url,
      useLocalTls,
      tlsRuntime,
      _a,
      remoteTlsFingerprint,
      overrideTlsFingerprint,
      tlsFingerprint,
      token,
      password,
      formatCloseError,
      formatTimeoutError;
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s;
    return __generator(this, function (_t) {
      switch (_t.label) {
        case 0:
          timeoutMs = (_b = opts.timeoutMs) !== null && _b !== void 0 ? _b : 10000;
          config =
            (_c = opts.config) !== null && _c !== void 0 ? _c : (0, config_js_1.loadConfig)();
          isRemoteMode =
            ((_d = config.gateway) === null || _d === void 0 ? void 0 : _d.mode) === "remote";
          remote = isRemoteMode
            ? (_e = config.gateway) === null || _e === void 0
              ? void 0
              : _e.remote
            : undefined;
          urlOverride =
            typeof opts.url === "string" && opts.url.trim().length > 0
              ? opts.url.trim()
              : undefined;
          remoteUrl =
            typeof (remote === null || remote === void 0 ? void 0 : remote.url) === "string" &&
            remote.url.trim().length > 0
              ? remote.url.trim()
              : undefined;
          if (isRemoteMode && !urlOverride && !remoteUrl) {
            configPath =
              (_f = opts.configPath) !== null && _f !== void 0
                ? _f
                : (0, config_js_1.resolveConfigPath)(
                    process.env,
                    (0, config_js_1.resolveStateDir)(process.env),
                  );
            throw new Error(
              [
                "gateway remote mode misconfigured: gateway.remote.url missing",
                "Config: ".concat(configPath),
                "Fix: set gateway.remote.url, or set gateway.mode=local.",
              ].join("\n"),
            );
          }
          authToken =
            (_h = (_g = config.gateway) === null || _g === void 0 ? void 0 : _g.auth) === null ||
            _h === void 0
              ? void 0
              : _h.token;
          authPassword =
            (_k = (_j = config.gateway) === null || _j === void 0 ? void 0 : _j.auth) === null ||
            _k === void 0
              ? void 0
              : _k.password;
          connectionDetails = buildGatewayConnectionDetails(
            __assign(
              { config: config, url: urlOverride },
              opts.configPath ? { configPath: opts.configPath } : {},
            ),
          );
          url = connectionDetails.url;
          useLocalTls =
            ((_m = (_l = config.gateway) === null || _l === void 0 ? void 0 : _l.tls) === null ||
            _m === void 0
              ? void 0
              : _m.enabled) === true &&
            !urlOverride &&
            !remoteUrl &&
            url.startsWith("wss://");
          if (!useLocalTls) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, gateway_js_1.loadGatewayTlsRuntime)(
              (_o = config.gateway) === null || _o === void 0 ? void 0 : _o.tls,
            ),
          ];
        case 1:
          _a = _t.sent();
          return [3 /*break*/, 3];
        case 2:
          _a = undefined;
          _t.label = 3;
        case 3:
          tlsRuntime = _a;
          remoteTlsFingerprint =
            isRemoteMode &&
            !urlOverride &&
            remoteUrl &&
            typeof (remote === null || remote === void 0 ? void 0 : remote.tlsFingerprint) ===
              "string"
              ? remote.tlsFingerprint.trim()
              : undefined;
          overrideTlsFingerprint =
            typeof opts.tlsFingerprint === "string" ? opts.tlsFingerprint.trim() : undefined;
          tlsFingerprint =
            overrideTlsFingerprint ||
            remoteTlsFingerprint ||
            ((tlsRuntime === null || tlsRuntime === void 0 ? void 0 : tlsRuntime.enabled)
              ? tlsRuntime.fingerprintSha256
              : undefined);
          token =
            (typeof opts.token === "string" && opts.token.trim().length > 0
              ? opts.token.trim()
              : undefined) ||
            (isRemoteMode
              ? typeof (remote === null || remote === void 0 ? void 0 : remote.token) ===
                  "string" && remote.token.trim().length > 0
                ? remote.token.trim()
                : undefined
              : ((_p = process.env.OPENCLAW_GATEWAY_TOKEN) === null || _p === void 0
                  ? void 0
                  : _p.trim()) ||
                ((_q = process.env.CLAWDBOT_GATEWAY_TOKEN) === null || _q === void 0
                  ? void 0
                  : _q.trim()) ||
                (typeof authToken === "string" && authToken.trim().length > 0
                  ? authToken.trim()
                  : undefined));
          password =
            (typeof opts.password === "string" && opts.password.trim().length > 0
              ? opts.password.trim()
              : undefined) ||
            ((_r = process.env.OPENCLAW_GATEWAY_PASSWORD) === null || _r === void 0
              ? void 0
              : _r.trim()) ||
            ((_s = process.env.CLAWDBOT_GATEWAY_PASSWORD) === null || _s === void 0
              ? void 0
              : _s.trim()) ||
            (isRemoteMode
              ? typeof (remote === null || remote === void 0 ? void 0 : remote.password) ===
                  "string" && remote.password.trim().length > 0
                ? remote.password.trim()
                : undefined
              : typeof authPassword === "string" && authPassword.trim().length > 0
                ? authPassword.trim()
                : undefined);
          formatCloseError = function (code, reason) {
            var reasonText =
              (reason === null || reason === void 0 ? void 0 : reason.trim()) || "no close reason";
            var hint =
              code === 1006
                ? "abnormal closure (no close frame)"
                : code === 1000
                  ? "normal closure"
                  : "";
            var suffix = hint ? " ".concat(hint) : "";
            return "gateway closed ("
              .concat(code)
              .concat(suffix, "): ")
              .concat(reasonText, "\n")
              .concat(connectionDetails.message);
          };
          formatTimeoutError = function () {
            return "gateway timeout after "
              .concat(timeoutMs, "ms\n")
              .concat(connectionDetails.message);
          };
          return [
            4 /*yield*/,
            new Promise(function (resolve, reject) {
              var _a, _b, _c, _d, _e, _f;
              var settled = false;
              var ignoreClose = false;
              var stop = function (err, value) {
                if (settled) {
                  return;
                }
                settled = true;
                clearTimeout(timer);
                if (err) {
                  reject(err);
                } else {
                  resolve(value);
                }
              };
              var client = new client_js_1.GatewayClient({
                url: url,
                token: token,
                password: password,
                tlsFingerprint: tlsFingerprint,
                instanceId:
                  (_a = opts.instanceId) !== null && _a !== void 0
                    ? _a
                    : (0, node_crypto_1.randomUUID)(),
                clientName:
                  (_b = opts.clientName) !== null && _b !== void 0
                    ? _b
                    : message_channel_js_1.GATEWAY_CLIENT_NAMES.CLI,
                clientDisplayName: opts.clientDisplayName,
                clientVersion: (_c = opts.clientVersion) !== null && _c !== void 0 ? _c : "dev",
                platform: opts.platform,
                mode:
                  (_d = opts.mode) !== null && _d !== void 0
                    ? _d
                    : message_channel_js_1.GATEWAY_CLIENT_MODES.CLI,
                role: "operator",
                scopes: ["operator.admin", "operator.approvals", "operator.pairing"],
                deviceIdentity: (0, device_identity_js_1.loadOrCreateDeviceIdentity)(),
                minProtocol:
                  (_e = opts.minProtocol) !== null && _e !== void 0
                    ? _e
                    : index_js_1.PROTOCOL_VERSION,
                maxProtocol:
                  (_f = opts.maxProtocol) !== null && _f !== void 0
                    ? _f
                    : index_js_1.PROTOCOL_VERSION,
                onHelloOk: function () {
                  return __awaiter(_this, void 0, void 0, function () {
                    var result, err_1;
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [
                            4 /*yield*/,
                            client.request(opts.method, opts.params, {
                              expectFinal: opts.expectFinal,
                            }),
                          ];
                        case 1:
                          result = _a.sent();
                          ignoreClose = true;
                          stop(undefined, result);
                          client.stop();
                          return [3 /*break*/, 3];
                        case 2:
                          err_1 = _a.sent();
                          ignoreClose = true;
                          client.stop();
                          stop(err_1);
                          return [3 /*break*/, 3];
                        case 3:
                          return [2 /*return*/];
                      }
                    });
                  });
                },
                onClose: function (code, reason) {
                  if (settled || ignoreClose) {
                    return;
                  }
                  ignoreClose = true;
                  client.stop();
                  stop(new Error(formatCloseError(code, reason)));
                },
              });
              var timer = setTimeout(function () {
                ignoreClose = true;
                client.stop();
                stop(new Error(formatTimeoutError()));
              }, timeoutMs);
              client.start();
            }),
          ];
        case 4:
          return [2 /*return*/, _t.sent()];
      }
    });
  });
}
function randomIdempotencyKey() {
  return (0, node_crypto_1.randomUUID)();
}
