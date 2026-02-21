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
exports.probeIMessage = probeIMessage;
var onboard_helpers_js_1 = require("../commands/onboard-helpers.js");
var config_js_1 = require("../config/config.js");
var exec_js_1 = require("../process/exec.js");
var client_js_1 = require("./client.js");
var rpcSupportCache = new Map();
function probeRpcSupport(cliPath) {
  return __awaiter(this, void 0, void 0, function () {
    var cached, result, combined, normalized, fatal, supported, err_1;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          cached = rpcSupportCache.get(cliPath);
          if (cached) {
            return [2 /*return*/, cached];
          }
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            (0, exec_js_1.runCommandWithTimeout)([cliPath, "rpc", "--help"], { timeoutMs: 2000 }),
          ];
        case 2:
          result = _b.sent();
          combined = "".concat(result.stdout, "\n").concat(result.stderr).trim();
          normalized = combined.toLowerCase();
          if (normalized.includes("unknown command") && normalized.includes("rpc")) {
            fatal = {
              supported: false,
              fatal: true,
              error: 'imsg CLI does not support the "rpc" subcommand (update imsg)',
            };
            rpcSupportCache.set(cliPath, fatal);
            return [2 /*return*/, fatal];
          }
          if (result.code === 0) {
            supported = { supported: true };
            rpcSupportCache.set(cliPath, supported);
            return [2 /*return*/, supported];
          }
          return [
            2 /*return*/,
            {
              supported: false,
              error:
                combined ||
                "imsg rpc --help failed (code ".concat(
                  String((_a = result.code) !== null && _a !== void 0 ? _a : "unknown"),
                  ")",
                ),
            },
          ];
        case 3:
          err_1 = _b.sent();
          return [2 /*return*/, { supported: false, error: String(err_1) }];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function probeIMessage() {
  return __awaiter(this, arguments, void 0, function (timeoutMs, opts) {
    var cfg, cliPath, dbPath, detected, rpcSupport, client, err_2;
    var _a, _b, _c, _d, _e, _f, _g, _h, _j;
    if (timeoutMs === void 0) {
      timeoutMs = 2000;
    }
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_k) {
      switch (_k.label) {
        case 0:
          cfg = opts.cliPath || opts.dbPath ? undefined : (0, config_js_1.loadConfig)();
          cliPath =
            ((_a = opts.cliPath) === null || _a === void 0 ? void 0 : _a.trim()) ||
            ((_d =
              (_c =
                (_b = cfg === null || cfg === void 0 ? void 0 : cfg.channels) === null ||
                _b === void 0
                  ? void 0
                  : _b.imessage) === null || _c === void 0
                ? void 0
                : _c.cliPath) === null || _d === void 0
              ? void 0
              : _d.trim()) ||
            "imsg";
          dbPath =
            ((_e = opts.dbPath) === null || _e === void 0 ? void 0 : _e.trim()) ||
            ((_h =
              (_g =
                (_f = cfg === null || cfg === void 0 ? void 0 : cfg.channels) === null ||
                _f === void 0
                  ? void 0
                  : _f.imessage) === null || _g === void 0
                ? void 0
                : _g.dbPath) === null || _h === void 0
              ? void 0
              : _h.trim());
          return [4 /*yield*/, (0, onboard_helpers_js_1.detectBinary)(cliPath)];
        case 1:
          detected = _k.sent();
          if (!detected) {
            return [2 /*return*/, { ok: false, error: "imsg not found (".concat(cliPath, ")") }];
          }
          return [4 /*yield*/, probeRpcSupport(cliPath)];
        case 2:
          rpcSupport = _k.sent();
          if (!rpcSupport.supported) {
            return [
              2 /*return*/,
              {
                ok: false,
                error:
                  (_j = rpcSupport.error) !== null && _j !== void 0 ? _j : "imsg rpc unavailable",
                fatal: rpcSupport.fatal,
              },
            ];
          }
          return [
            4 /*yield*/,
            (0, client_js_1.createIMessageRpcClient)({
              cliPath: cliPath,
              dbPath: dbPath,
              runtime: opts.runtime,
            }),
          ];
        case 3:
          client = _k.sent();
          _k.label = 4;
        case 4:
          _k.trys.push([4, 6, 7, 9]);
          return [
            4 /*yield*/,
            client.request("chats.list", { limit: 1 }, { timeoutMs: timeoutMs }),
          ];
        case 5:
          _k.sent();
          return [2 /*return*/, { ok: true }];
        case 6:
          err_2 = _k.sent();
          return [2 /*return*/, { ok: false, error: String(err_2) }];
        case 7:
          return [4 /*yield*/, client.stop()];
        case 8:
          _k.sent();
          return [7 /*endfinally*/];
        case 9:
          return [2 /*return*/];
      }
    });
  });
}
