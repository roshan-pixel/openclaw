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
exports.GatewayClient = exports.GATEWAY_CLOSE_CODE_HINTS = void 0;
exports.describeGatewayCloseCode = describeGatewayCloseCode;
var node_crypto_1 = require("node:crypto");
var ws_1 = require("ws");
var fingerprint_js_1 = require("../infra/tls/fingerprint.js");
var ws_js_1 = require("../infra/ws.js");
var logger_js_1 = require("../logger.js");
var device_identity_js_1 = require("../infra/device-identity.js");
var device_auth_store_js_1 = require("../infra/device-auth-store.js");
var message_channel_js_1 = require("../utils/message-channel.js");
var device_auth_js_1 = require("./device-auth.js");
var index_js_1 = require("./protocol/index.js");
exports.GATEWAY_CLOSE_CODE_HINTS = {
  1000: "normal closure",
  1006: "abnormal closure (no close frame)",
  1008: "policy violation",
  1012: "service restart",
};
function describeGatewayCloseCode(code) {
  return exports.GATEWAY_CLOSE_CODE_HINTS[code];
}
var GatewayClient = /** @class */ (function () {
  function GatewayClient(opts) {
    var _a;
    this.ws = null;
    this.pending = new Map();
    this.backoffMs = 1000;
    this.closed = false;
    this.lastSeq = null;
    this.connectNonce = null;
    this.connectSent = false;
    this.connectTimer = null;
    // Track last tick to detect silent stalls.
    this.lastTick = null;
    this.tickIntervalMs = 30000;
    this.tickTimer = null;
    this.opts = __assign(__assign({}, opts), {
      deviceIdentity:
        (_a = opts.deviceIdentity) !== null && _a !== void 0
          ? _a
          : (0, device_identity_js_1.loadOrCreateDeviceIdentity)(),
    });
  }
  GatewayClient.prototype.start = function () {
    var _this = this;
    var _a, _b, _c;
    if (this.closed) {
      return;
    }
    var url = (_a = this.opts.url) !== null && _a !== void 0 ? _a : "ws://127.0.0.1:18789";
    if (this.opts.tlsFingerprint && !url.startsWith("wss://")) {
      (_c = (_b = this.opts).onConnectError) === null || _c === void 0
        ? void 0
        : _c.call(_b, new Error("gateway tls fingerprint requires wss:// gateway url"));
      return;
    }
    // Allow node screen snapshots and other large responses.
    var wsOptions = {
      maxPayload: 25 * 1024 * 1024,
    };
    if (url.startsWith("wss://") && this.opts.tlsFingerprint) {
      wsOptions.rejectUnauthorized = false;
      wsOptions.checkServerIdentity = function (_host, cert) {
        var _a, _b;
        var fingerprintValue =
          typeof cert === "object" && cert && "fingerprint256" in cert
            ? (_a = cert.fingerprint256) !== null && _a !== void 0
              ? _a
              : ""
            : "";
        var fingerprint = (0, fingerprint_js_1.normalizeFingerprint)(
          typeof fingerprintValue === "string" ? fingerprintValue : "",
        );
        var expected = (0, fingerprint_js_1.normalizeFingerprint)(
          (_b = _this.opts.tlsFingerprint) !== null && _b !== void 0 ? _b : "",
        );
        if (!expected) {
          return new Error("gateway tls fingerprint missing");
        }
        if (!fingerprint) {
          return new Error("gateway tls fingerprint unavailable");
        }
        if (fingerprint !== expected) {
          return new Error("gateway tls fingerprint mismatch");
        }
        return undefined;
      };
    }
    this.ws = new ws_1.WebSocket(url, wsOptions);
    this.ws.on("open", function () {
      var _a, _b, _c;
      if (url.startsWith("wss://") && _this.opts.tlsFingerprint) {
        var tlsError = _this.validateTlsFingerprint();
        if (tlsError) {
          (_b = (_a = _this.opts).onConnectError) === null || _b === void 0
            ? void 0
            : _b.call(_a, tlsError);
          (_c = _this.ws) === null || _c === void 0 ? void 0 : _c.close(1008, tlsError.message);
          return;
        }
      }
      _this.queueConnect();
    });
    this.ws.on("message", function (data) {
      return _this.handleMessage((0, ws_js_1.rawDataToString)(data));
    });
    this.ws.on("close", function (code, reason) {
      var _a, _b;
      var reasonText = (0, ws_js_1.rawDataToString)(reason);
      _this.ws = null;
      _this.flushPendingErrors(
        new Error("gateway closed (".concat(code, "): ").concat(reasonText)),
      );
      _this.scheduleReconnect();
      (_b = (_a = _this.opts).onClose) === null || _b === void 0
        ? void 0
        : _b.call(_a, code, reasonText);
    });
    this.ws.on("error", function (err) {
      var _a, _b;
      (0, logger_js_1.logDebug)("gateway client error: ".concat(String(err)));
      if (!_this.connectSent) {
        (_b = (_a = _this.opts).onConnectError) === null || _b === void 0
          ? void 0
          : _b.call(_a, err instanceof Error ? err : new Error(String(err)));
      }
    });
  };
  GatewayClient.prototype.stop = function () {
    var _a;
    this.closed = true;
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.tickTimer = null;
    }
    (_a = this.ws) === null || _a === void 0 ? void 0 : _a.close();
    this.ws = null;
    this.flushPendingErrors(new Error("gateway client stopped"));
  };
  GatewayClient.prototype.sendConnect = function () {
    var _this = this;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
    if (this.connectSent) {
      return;
    }
    this.connectSent = true;
    if (this.connectTimer) {
      clearTimeout(this.connectTimer);
      this.connectTimer = null;
    }
    var role = (_a = this.opts.role) !== null && _a !== void 0 ? _a : "operator";
    var storedToken = this.opts.deviceIdentity
      ? (_b = (0, device_auth_store_js_1.loadDeviceAuthToken)({
          deviceId: this.opts.deviceIdentity.deviceId,
          role: role,
        })) === null || _b === void 0
        ? void 0
        : _b.token
      : null;
    var authToken =
      (_c = storedToken !== null && storedToken !== void 0 ? storedToken : this.opts.token) !==
        null && _c !== void 0
        ? _c
        : undefined;
    var canFallbackToShared = Boolean(storedToken && this.opts.token);
    var auth =
      authToken || this.opts.password
        ? {
            token: authToken,
            password: this.opts.password,
          }
        : undefined;
    var signedAtMs = Date.now();
    var nonce = (_d = this.connectNonce) !== null && _d !== void 0 ? _d : undefined;
    var scopes = (_e = this.opts.scopes) !== null && _e !== void 0 ? _e : ["operator.admin"];
    var device = (function () {
      var _a, _b;
      if (!_this.opts.deviceIdentity) {
        return undefined;
      }
      var payload = (0, device_auth_js_1.buildDeviceAuthPayload)({
        deviceId: _this.opts.deviceIdentity.deviceId,
        clientId:
          (_a = _this.opts.clientName) !== null && _a !== void 0
            ? _a
            : message_channel_js_1.GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
        clientMode:
          (_b = _this.opts.mode) !== null && _b !== void 0
            ? _b
            : message_channel_js_1.GATEWAY_CLIENT_MODES.BACKEND,
        role: role,
        scopes: scopes,
        signedAtMs: signedAtMs,
        token: authToken !== null && authToken !== void 0 ? authToken : null,
        nonce: nonce,
      });
      var signature = (0, device_identity_js_1.signDevicePayload)(
        _this.opts.deviceIdentity.privateKeyPem,
        payload,
      );
      return {
        id: _this.opts.deviceIdentity.deviceId,
        publicKey: (0, device_identity_js_1.publicKeyRawBase64UrlFromPem)(
          _this.opts.deviceIdentity.publicKeyPem,
        ),
        signature: signature,
        signedAt: signedAtMs,
        nonce: nonce,
      };
    })();
    var params = {
      minProtocol:
        (_f = this.opts.minProtocol) !== null && _f !== void 0 ? _f : index_js_1.PROTOCOL_VERSION,
      maxProtocol:
        (_g = this.opts.maxProtocol) !== null && _g !== void 0 ? _g : index_js_1.PROTOCOL_VERSION,
      client: {
        id:
          (_h = this.opts.clientName) !== null && _h !== void 0
            ? _h
            : message_channel_js_1.GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
        displayName: this.opts.clientDisplayName,
        version: (_j = this.opts.clientVersion) !== null && _j !== void 0 ? _j : "dev",
        platform: (_k = this.opts.platform) !== null && _k !== void 0 ? _k : process.platform,
        mode:
          (_l = this.opts.mode) !== null && _l !== void 0
            ? _l
            : message_channel_js_1.GATEWAY_CLIENT_MODES.BACKEND,
        instanceId: this.opts.instanceId,
      },
      caps: Array.isArray(this.opts.caps) ? this.opts.caps : [],
      commands: Array.isArray(this.opts.commands) ? this.opts.commands : undefined,
      permissions:
        this.opts.permissions && typeof this.opts.permissions === "object"
          ? this.opts.permissions
          : undefined,
      pathEnv: this.opts.pathEnv,
      auth: auth,
      role: role,
      scopes: scopes,
      device: device,
    };
    void this.request("connect", params)
      .then(function (helloOk) {
        var _a, _b, _c, _d, _e;
        var authInfo = helloOk === null || helloOk === void 0 ? void 0 : helloOk.auth;
        if (
          (authInfo === null || authInfo === void 0 ? void 0 : authInfo.deviceToken) &&
          _this.opts.deviceIdentity
        ) {
          (0, device_auth_store_js_1.storeDeviceAuthToken)({
            deviceId: _this.opts.deviceIdentity.deviceId,
            role: (_a = authInfo.role) !== null && _a !== void 0 ? _a : role,
            token: authInfo.deviceToken,
            scopes: (_b = authInfo.scopes) !== null && _b !== void 0 ? _b : [],
          });
        }
        _this.backoffMs = 1000;
        _this.tickIntervalMs =
          typeof ((_c = helloOk.policy) === null || _c === void 0 ? void 0 : _c.tickIntervalMs) ===
          "number"
            ? helloOk.policy.tickIntervalMs
            : 30000;
        _this.lastTick = Date.now();
        _this.startTickWatch();
        (_e = (_d = _this.opts).onHelloOk) === null || _e === void 0
          ? void 0
          : _e.call(_d, helloOk);
      })
      .catch(function (err) {
        var _a, _b, _c;
        if (canFallbackToShared && _this.opts.deviceIdentity) {
          (0, device_auth_store_js_1.clearDeviceAuthToken)({
            deviceId: _this.opts.deviceIdentity.deviceId,
            role: role,
          });
        }
        (_b = (_a = _this.opts).onConnectError) === null || _b === void 0
          ? void 0
          : _b.call(_a, err instanceof Error ? err : new Error(String(err)));
        var msg = "gateway connect failed: ".concat(String(err));
        if (_this.opts.mode === message_channel_js_1.GATEWAY_CLIENT_MODES.PROBE) {
          (0, logger_js_1.logDebug)(msg);
        } else {
          (0, logger_js_1.logError)(msg);
        }
        (_c = _this.ws) === null || _c === void 0 ? void 0 : _c.close(1008, "connect failed");
      });
  };
  GatewayClient.prototype.handleMessage = function (raw) {
    var _a, _b, _c, _d, _e, _f;
    try {
      var parsed = JSON.parse(raw);
      if ((0, index_js_1.validateEventFrame)(parsed)) {
        var evt = parsed;
        if (evt.event === "connect.challenge") {
          var payload = evt.payload;
          var nonce = payload && typeof payload.nonce === "string" ? payload.nonce : null;
          if (nonce) {
            this.connectNonce = nonce;
            this.sendConnect();
          }
          return;
        }
        var seq = typeof evt.seq === "number" ? evt.seq : null;
        if (seq !== null) {
          if (this.lastSeq !== null && seq > this.lastSeq + 1) {
            (_b = (_a = this.opts).onGap) === null || _b === void 0
              ? void 0
              : _b.call(_a, { expected: this.lastSeq + 1, received: seq });
          }
          this.lastSeq = seq;
        }
        if (evt.event === "tick") {
          this.lastTick = Date.now();
        }
        (_d = (_c = this.opts).onEvent) === null || _d === void 0 ? void 0 : _d.call(_c, evt);
        return;
      }
      if ((0, index_js_1.validateResponseFrame)(parsed)) {
        var pending = this.pending.get(parsed.id);
        if (!pending) {
          return;
        }
        // If the payload is an ack with status accepted, keep waiting for final.
        var payload = parsed.payload;
        var status_1 = payload === null || payload === void 0 ? void 0 : payload.status;
        if (pending.expectFinal && status_1 === "accepted") {
          return;
        }
        this.pending.delete(parsed.id);
        if (parsed.ok) {
          pending.resolve(parsed.payload);
        } else {
          pending.reject(
            new Error(
              (_f = (_e = parsed.error) === null || _e === void 0 ? void 0 : _e.message) !== null &&
                _f !== void 0
                ? _f
                : "unknown error",
            ),
          );
        }
      }
    } catch (err) {
      (0, logger_js_1.logDebug)("gateway client parse error: ".concat(String(err)));
    }
  };
  GatewayClient.prototype.queueConnect = function () {
    var _this = this;
    this.connectNonce = null;
    this.connectSent = false;
    if (this.connectTimer) {
      clearTimeout(this.connectTimer);
    }
    this.connectTimer = setTimeout(function () {
      _this.sendConnect();
    }, 750);
  };
  GatewayClient.prototype.scheduleReconnect = function () {
    var _this = this;
    if (this.closed) {
      return;
    }
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
      this.tickTimer = null;
    }
    var delay = this.backoffMs;
    this.backoffMs = Math.min(this.backoffMs * 2, 30000);
    setTimeout(function () {
      return _this.start();
    }, delay).unref();
  };
  GatewayClient.prototype.flushPendingErrors = function (err) {
    for (var _i = 0, _a = this.pending; _i < _a.length; _i++) {
      var _b = _a[_i],
        p = _b[1];
      p.reject(err);
    }
    this.pending.clear();
  };
  GatewayClient.prototype.startTickWatch = function () {
    var _this = this;
    if (this.tickTimer) {
      clearInterval(this.tickTimer);
    }
    var interval = Math.max(this.tickIntervalMs, 1000);
    this.tickTimer = setInterval(function () {
      var _a;
      if (_this.closed) {
        return;
      }
      if (!_this.lastTick) {
        return;
      }
      var gap = Date.now() - _this.lastTick;
      if (gap > _this.tickIntervalMs * 2) {
        (_a = _this.ws) === null || _a === void 0 ? void 0 : _a.close(4000, "tick timeout");
      }
    }, interval);
  };
  GatewayClient.prototype.validateTlsFingerprint = function () {
    var _a;
    if (!this.opts.tlsFingerprint || !this.ws) {
      return null;
    }
    var expected = (0, fingerprint_js_1.normalizeFingerprint)(this.opts.tlsFingerprint);
    if (!expected) {
      return new Error("gateway tls fingerprint missing");
    }
    var socket = this.ws._socket;
    if (!socket || typeof socket.getPeerCertificate !== "function") {
      return new Error("gateway tls fingerprint unavailable");
    }
    var cert = socket.getPeerCertificate();
    var fingerprint = (0, fingerprint_js_1.normalizeFingerprint)(
      (_a = cert === null || cert === void 0 ? void 0 : cert.fingerprint256) !== null &&
        _a !== void 0
        ? _a
        : "",
    );
    if (!fingerprint) {
      return new Error("gateway tls fingerprint unavailable");
    }
    if (fingerprint !== expected) {
      return new Error("gateway tls fingerprint mismatch");
    }
    return null;
  };
  GatewayClient.prototype.request = function (method, params, opts) {
    return __awaiter(this, void 0, void 0, function () {
      var id, frame, expectFinal, p;
      var _this = this;
      return __generator(this, function (_a) {
        if (!this.ws || this.ws.readyState !== ws_1.WebSocket.OPEN) {
          throw new Error("gateway not connected");
        }
        id = (0, node_crypto_1.randomUUID)();
        frame = { type: "req", id: id, method: method, params: params };
        if (!(0, index_js_1.validateRequestFrame)(frame)) {
          throw new Error(
            "invalid request frame: ".concat(
              JSON.stringify(index_js_1.validateRequestFrame.errors, null, 2),
            ),
          );
        }
        expectFinal = (opts === null || opts === void 0 ? void 0 : opts.expectFinal) === true;
        p = new Promise(function (resolve, reject) {
          _this.pending.set(id, {
            resolve: function (value) {
              return resolve(value);
            },
            reject: reject,
            expectFinal: expectFinal,
          });
        });
        this.ws.send(JSON.stringify(frame));
        return [2 /*return*/, p];
      });
    });
  };
  return GatewayClient;
})();
exports.GatewayClient = GatewayClient;
