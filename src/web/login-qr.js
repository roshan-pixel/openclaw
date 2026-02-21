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
exports.startWebLoginWithQr = startWebLoginWithQr;
exports.waitForWebLogin = waitForWebLogin;
var node_crypto_1 = require("node:crypto");
var baileys_1 = require("@whiskeysockets/baileys");
var config_js_1 = require("../config/config.js");
var globals_js_1 = require("../globals.js");
var logger_js_1 = require("../logger.js");
var runtime_js_1 = require("../runtime.js");
var accounts_js_1 = require("./accounts.js");
var qr_image_js_1 = require("./qr-image.js");
var session_js_1 = require("./session.js");
var ACTIVE_LOGIN_TTL_MS = 3 * 60000;
var activeLogins = new Map();
function closeSocket(sock) {
  var _a;
  try {
    (_a = sock.ws) === null || _a === void 0 ? void 0 : _a.close();
  } catch (_b) {
    // ignore
  }
}
function resetActiveLogin(accountId, reason) {
  return __awaiter(this, void 0, void 0, function () {
    var login;
    return __generator(this, function (_a) {
      login = activeLogins.get(accountId);
      if (login) {
        closeSocket(login.sock);
        activeLogins.delete(accountId);
      }
      if (reason) {
        (0, logger_js_1.logInfo)(reason);
      }
      return [2 /*return*/];
    });
  });
}
function isLoginFresh(login) {
  return Date.now() - login.startedAt < ACTIVE_LOGIN_TTL_MS;
}
function attachLoginWaiter(accountId, login) {
  login.waitPromise = (0, session_js_1.waitForWaConnection)(login.sock)
    .then(function () {
      var current = activeLogins.get(accountId);
      if ((current === null || current === void 0 ? void 0 : current.id) === login.id) {
        current.connected = true;
      }
    })
    .catch(function (err) {
      var current = activeLogins.get(accountId);
      if ((current === null || current === void 0 ? void 0 : current.id) !== login.id) {
        return;
      }
      current.error = (0, session_js_1.formatError)(err);
      current.errorStatus = (0, session_js_1.getStatusCode)(err);
    });
}
function restartLoginSocket(login, runtime) {
  return __awaiter(this, void 0, void 0, function () {
    var sock, err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (login.restartAttempted) {
            return [2 /*return*/, false];
          }
          login.restartAttempted = true;
          runtime.log(
            (0, globals_js_1.info)(
              "WhatsApp asked for a restart after pairing (code 515); retrying connection once…",
            ),
          );
          closeSocket(login.sock);
          _a.label = 1;
        case 1:
          _a.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            (0, session_js_1.createWaSocket)(false, login.verbose, {
              authDir: login.authDir,
            }),
          ];
        case 2:
          sock = _a.sent();
          login.sock = sock;
          login.connected = false;
          login.error = undefined;
          login.errorStatus = undefined;
          attachLoginWaiter(login.accountId, login);
          return [2 /*return*/, true];
        case 3:
          err_1 = _a.sent();
          login.error = (0, session_js_1.formatError)(err_1);
          login.errorStatus = (0, session_js_1.getStatusCode)(err_1);
          return [2 /*return*/, false];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function startWebLoginWithQr() {
  return __awaiter(this, arguments, void 0, function (opts) {
    var runtime,
      cfg,
      account,
      hasWeb,
      selfId,
      who,
      existing,
      resolveQr,
      rejectQr,
      qrPromise,
      qrTimer,
      sock,
      pendingQr,
      err_2,
      login,
      qr,
      err_3,
      base64;
    var _a, _b, _c, _d;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          runtime =
            (_a = opts.runtime) !== null && _a !== void 0 ? _a : runtime_js_1.defaultRuntime;
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveWhatsAppAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          return [4 /*yield*/, (0, session_js_1.webAuthExists)(account.authDir)];
        case 1:
          hasWeb = _e.sent();
          selfId = (0, session_js_1.readWebSelfId)(account.authDir);
          if (hasWeb && !opts.force) {
            who =
              (_c = (_b = selfId.e164) !== null && _b !== void 0 ? _b : selfId.jid) !== null &&
              _c !== void 0
                ? _c
                : "unknown";
            return [
              2 /*return*/,
              {
                message: "WhatsApp is already linked (".concat(
                  who,
                  "). Say \u201Crelink\u201D if you want a fresh QR.",
                ),
              },
            ];
          }
          existing = activeLogins.get(account.accountId);
          if (existing && isLoginFresh(existing) && existing.qrDataUrl) {
            return [
              2 /*return*/,
              {
                qrDataUrl: existing.qrDataUrl,
                message: "QR already active. Scan it in WhatsApp → Linked Devices.",
              },
            ];
          }
          return [4 /*yield*/, resetActiveLogin(account.accountId)];
        case 2:
          _e.sent();
          resolveQr = null;
          rejectQr = null;
          qrPromise = new Promise(function (resolve, reject) {
            resolveQr = resolve;
            rejectQr = reject;
          });
          qrTimer = setTimeout(
            function () {
              rejectQr === null || rejectQr === void 0
                ? void 0
                : rejectQr(new Error("Timed out waiting for WhatsApp QR"));
            },
            Math.max((_d = opts.timeoutMs) !== null && _d !== void 0 ? _d : 30000, 5000),
          );
          pendingQr = null;
          _e.label = 3;
        case 3:
          _e.trys.push([3, 5, , 7]);
          return [
            4 /*yield*/,
            (0, session_js_1.createWaSocket)(false, Boolean(opts.verbose), {
              authDir: account.authDir,
              onQr: function (qr) {
                if (pendingQr) {
                  return;
                }
                pendingQr = qr;
                var current = activeLogins.get(account.accountId);
                if (current && !current.qr) {
                  current.qr = qr;
                }
                clearTimeout(qrTimer);
                runtime.log((0, globals_js_1.info)("WhatsApp QR received."));
                resolveQr === null || resolveQr === void 0 ? void 0 : resolveQr(qr);
              },
            }),
          ];
        case 4:
          sock = _e.sent();
          return [3 /*break*/, 7];
        case 5:
          err_2 = _e.sent();
          clearTimeout(qrTimer);
          return [4 /*yield*/, resetActiveLogin(account.accountId)];
        case 6:
          _e.sent();
          return [
            2 /*return*/,
            {
              message: "Failed to start WhatsApp login: ".concat(String(err_2)),
            },
          ];
        case 7:
          login = {
            accountId: account.accountId,
            authDir: account.authDir,
            isLegacyAuthDir: account.isLegacyAuthDir,
            id: (0, node_crypto_1.randomUUID)(),
            sock: sock,
            startedAt: Date.now(),
            connected: false,
            waitPromise: Promise.resolve(),
            restartAttempted: false,
            verbose: Boolean(opts.verbose),
          };
          activeLogins.set(account.accountId, login);
          if (pendingQr && !login.qr) {
            login.qr = pendingQr;
          }
          attachLoginWaiter(account.accountId, login);
          _e.label = 8;
        case 8:
          _e.trys.push([8, 10, , 12]);
          return [4 /*yield*/, qrPromise];
        case 9:
          qr = _e.sent();
          return [3 /*break*/, 12];
        case 10:
          err_3 = _e.sent();
          clearTimeout(qrTimer);
          return [4 /*yield*/, resetActiveLogin(account.accountId)];
        case 11:
          _e.sent();
          return [
            2 /*return*/,
            {
              message: "Failed to get QR: ".concat(String(err_3)),
            },
          ];
        case 12:
          return [4 /*yield*/, (0, qr_image_js_1.renderQrPngBase64)(qr)];
        case 13:
          base64 = _e.sent();
          login.qrDataUrl = "data:image/png;base64,".concat(base64);
          return [
            2 /*return*/,
            {
              qrDataUrl: login.qrDataUrl,
              message: "Scan this QR in WhatsApp → Linked Devices.",
            },
          ];
      }
    });
  });
}
function waitForWebLogin() {
  return __awaiter(this, arguments, void 0, function (opts) {
    var runtime, cfg, account, activeLogin, login, timeoutMs, deadline, _loop_1, state_1;
    var _a, _b;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          runtime =
            (_a = opts.runtime) !== null && _a !== void 0 ? _a : runtime_js_1.defaultRuntime;
          cfg = (0, config_js_1.loadConfig)();
          account = (0, accounts_js_1.resolveWhatsAppAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          activeLogin = activeLogins.get(account.accountId);
          if (!activeLogin) {
            return [
              2 /*return*/,
              {
                connected: false,
                message: "No active WhatsApp login in progress.",
              },
            ];
          }
          login = activeLogin;
          if (!!isLoginFresh(login)) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, resetActiveLogin(account.accountId)];
        case 1:
          _c.sent();
          return [
            2 /*return*/,
            {
              connected: false,
              message: "The login QR expired. Ask me to generate a new one.",
            },
          ];
        case 2:
          timeoutMs = Math.max((_b = opts.timeoutMs) !== null && _b !== void 0 ? _b : 120000, 1000);
          deadline = Date.now() + timeoutMs;
          _loop_1 = function () {
            var remaining, timeout, result, message_1, restarted, message, message;
            return __generator(this, function (_d) {
              switch (_d.label) {
                case 0:
                  remaining = deadline - Date.now();
                  if (remaining <= 0) {
                    return [
                      2 /*return*/,
                      {
                        value: {
                          connected: false,
                          message:
                            "Still waiting for the QR scan. Let me know when you’ve scanned it.",
                        },
                      },
                    ];
                  }
                  timeout = new Promise(function (resolve) {
                    return setTimeout(function () {
                      return resolve("timeout");
                    }, remaining);
                  });
                  return [
                    4 /*yield*/,
                    Promise.race([
                      login.waitPromise.then(function () {
                        return "done";
                      }),
                      timeout,
                    ]),
                  ];
                case 1:
                  result = _d.sent();
                  if (result === "timeout") {
                    return [
                      2 /*return*/,
                      {
                        value: {
                          connected: false,
                          message:
                            "Still waiting for the QR scan. Let me know when you’ve scanned it.",
                        },
                      },
                    ];
                  }
                  if (!login.error) {
                    return [3 /*break*/, 8];
                  }
                  if (!(login.errorStatus === baileys_1.DisconnectReason.loggedOut)) {
                    return [3 /*break*/, 4];
                  }
                  return [
                    4 /*yield*/,
                    (0, session_js_1.logoutWeb)({
                      authDir: login.authDir,
                      isLegacyAuthDir: login.isLegacyAuthDir,
                      runtime: runtime,
                    }),
                  ];
                case 2:
                  _d.sent();
                  message_1 =
                    "WhatsApp reported the session is logged out. Cleared cached web session; please scan a new QR.";
                  return [4 /*yield*/, resetActiveLogin(account.accountId, message_1)];
                case 3:
                  _d.sent();
                  runtime.log((0, globals_js_1.danger)(message_1));
                  return [2 /*return*/, { value: { connected: false, message: message_1 } }];
                case 4:
                  if (!(login.errorStatus === 515)) {
                    return [3 /*break*/, 6];
                  }
                  return [4 /*yield*/, restartLoginSocket(login, runtime)];
                case 5:
                  restarted = _d.sent();
                  if (restarted && isLoginFresh(login)) {
                    return [2 /*return*/, "continue"];
                  }
                  _d.label = 6;
                case 6:
                  message = "WhatsApp login failed: ".concat(login.error);
                  return [4 /*yield*/, resetActiveLogin(account.accountId, message)];
                case 7:
                  _d.sent();
                  runtime.log((0, globals_js_1.danger)(message));
                  return [2 /*return*/, { value: { connected: false, message: message } }];
                case 8:
                  if (!login.connected) {
                    return [3 /*break*/, 10];
                  }
                  message = "✅ Linked! WhatsApp is ready.";
                  runtime.log((0, globals_js_1.success)(message));
                  return [4 /*yield*/, resetActiveLogin(account.accountId)];
                case 9:
                  _d.sent();
                  return [2 /*return*/, { value: { connected: true, message: message } }];
                case 10:
                  return [
                    2 /*return*/,
                    { value: { connected: false, message: "Login ended without a connection." } },
                  ];
              }
            });
          };
          _c.label = 3;
        case 3:
          if (!true) {
            return [3 /*break*/, 5];
          }
          return [5 /*yield**/, _loop_1()];
        case 4:
          state_1 = _c.sent();
          if (typeof state_1 === "object") {
            return [2 /*return*/, state_1.value];
          }
          return [3 /*break*/, 3];
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
