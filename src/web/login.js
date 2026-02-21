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
exports.loginWeb = loginWeb;
var baileys_1 = require("@whiskeysockets/baileys");
var config_js_1 = require("../config/config.js");
var globals_js_1 = require("../globals.js");
var logger_js_1 = require("../logger.js");
var runtime_js_1 = require("../runtime.js");
var command_format_js_1 = require("../cli/command-format.js");
var accounts_js_1 = require("./accounts.js");
var session_js_1 = require("./session.js");
function loginWeb(verbose_1, waitForConnection_1) {
  return __awaiter(
    this,
    arguments,
    void 0,
    function (verbose, waitForConnection, runtime, accountId) {
      var wait, cfg, account, sock, err_1, code, retry_1, formatted;
      var _a, _b, _c, _d, _e;
      if (runtime === void 0) {
        runtime = runtime_js_1.defaultRuntime;
      }
      return __generator(this, function (_f) {
        switch (_f.label) {
          case 0:
            wait =
              waitForConnection !== null && waitForConnection !== void 0
                ? waitForConnection
                : session_js_1.waitForWaConnection;
            cfg = (0, config_js_1.loadConfig)();
            account = (0, accounts_js_1.resolveWhatsAppAccount)({ cfg: cfg, accountId: accountId });
            return [
              4 /*yield*/,
              (0, session_js_1.createWaSocket)(true, verbose, {
                authDir: account.authDir,
              }),
            ];
          case 1:
            sock = _f.sent();
            (0, logger_js_1.logInfo)("Waiting for WhatsApp connection...", runtime);
            _f.label = 2;
          case 2:
            _f.trys.push([2, 4, 12, 13]);
            return [4 /*yield*/, wait(sock)];
          case 3:
            _f.sent();
            console.log(
              (0, globals_js_1.success)("✅ Linked! Credentials saved for future sends."),
            );
            return [3 /*break*/, 13];
          case 4:
            err_1 = _f.sent();
            code =
              (_c =
                (_b =
                  (_a = err_1 === null || err_1 === void 0 ? void 0 : err_1.error) === null ||
                  _a === void 0
                    ? void 0
                    : _a.output) === null || _b === void 0
                  ? void 0
                  : _b.statusCode) !== null && _c !== void 0
                ? _c
                : (_d = err_1 === null || err_1 === void 0 ? void 0 : err_1.output) === null ||
                    _d === void 0
                  ? void 0
                  : _d.statusCode;
            if (!(code === 515)) {
              return [3 /*break*/, 9];
            }
            console.log(
              (0, globals_js_1.info)(
                "WhatsApp asked for a restart after pairing (code 515); creds are saved. Restarting connection once…",
              ),
            );
            try {
              (_e = sock.ws) === null || _e === void 0 ? void 0 : _e.close();
            } catch (_g) {
              // ignore
            }
            return [
              4 /*yield*/,
              (0, session_js_1.createWaSocket)(false, verbose, {
                authDir: account.authDir,
              }),
            ];
          case 5:
            retry_1 = _f.sent();
            _f.label = 6;
          case 6:
            _f.trys.push([6, , 8, 9]);
            return [4 /*yield*/, wait(retry_1)];
          case 7:
            _f.sent();
            console.log((0, globals_js_1.success)("✅ Linked after restart; web session ready."));
            return [2 /*return*/];
          case 8:
            setTimeout(function () {
              var _a;
              return (_a = retry_1.ws) === null || _a === void 0 ? void 0 : _a.close();
            }, 500);
            return [7 /*endfinally*/];
          case 9:
            if (!(code === baileys_1.DisconnectReason.loggedOut)) {
              return [3 /*break*/, 11];
            }
            return [
              4 /*yield*/,
              (0, session_js_1.logoutWeb)({
                authDir: account.authDir,
                isLegacyAuthDir: account.isLegacyAuthDir,
                runtime: runtime,
              }),
            ];
          case 10:
            _f.sent();
            console.error(
              (0, globals_js_1.danger)(
                "WhatsApp reported the session is logged out. Cleared cached web session; please rerun ".concat(
                  (0, command_format_js_1.formatCliCommand)("openclaw channels login"),
                  " and scan the QR again.",
                ),
              ),
            );
            throw new Error("Session logged out; cache cleared. Re-run login.");
          case 11:
            formatted = (0, session_js_1.formatError)(err_1);
            console.error(
              (0, globals_js_1.danger)(
                "WhatsApp Web connection ended before fully opening. ".concat(formatted),
              ),
            );
            throw new Error(formatted);
          case 12:
            // Let Baileys flush any final events before closing the socket.
            setTimeout(function () {
              var _a;
              try {
                (_a = sock.ws) === null || _a === void 0 ? void 0 : _a.close();
              } catch (_b) {
                // ignore
              }
            }, 500);
            return [7 /*endfinally*/];
          case 13:
            return [2 /*return*/];
        }
      });
    },
  );
}
