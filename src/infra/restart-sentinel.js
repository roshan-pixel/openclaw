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
exports.formatDoctorNonInteractiveHint = formatDoctorNonInteractiveHint;
exports.resolveRestartSentinelPath = resolveRestartSentinelPath;
exports.writeRestartSentinel = writeRestartSentinel;
exports.readRestartSentinel = readRestartSentinel;
exports.consumeRestartSentinel = consumeRestartSentinel;
exports.formatRestartSentinelMessage = formatRestartSentinelMessage;
exports.summarizeRestartSentinel = summarizeRestartSentinel;
exports.trimLogTail = trimLogTail;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var command_format_js_1 = require("../cli/command-format.js");
var paths_js_1 = require("../config/paths.js");
var SENTINEL_FILENAME = "restart-sentinel.json";
function formatDoctorNonInteractiveHint(env) {
  if (env === void 0) {
    env = process.env;
  }
  return "Run: ".concat(
    (0, command_format_js_1.formatCliCommand)("openclaw doctor --non-interactive", env),
  );
}
function resolveRestartSentinelPath(env) {
  if (env === void 0) {
    env = process.env;
  }
  return node_path_1.default.join((0, paths_js_1.resolveStateDir)(env), SENTINEL_FILENAME);
}
function writeRestartSentinel(payload_1) {
  return __awaiter(this, arguments, void 0, function (payload, env) {
    var filePath, data;
    if (env === void 0) {
      env = process.env;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          filePath = resolveRestartSentinelPath(env);
          return [
            4 /*yield*/,
            promises_1.default.mkdir(node_path_1.default.dirname(filePath), { recursive: true }),
          ];
        case 1:
          _a.sent();
          data = { version: 1, payload: payload };
          return [
            4 /*yield*/,
            promises_1.default.writeFile(
              filePath,
              "".concat(JSON.stringify(data, null, 2), "\n"),
              "utf-8",
            ),
          ];
        case 2:
          _a.sent();
          return [2 /*return*/, filePath];
      }
    });
  });
}
function readRestartSentinel() {
  return __awaiter(this, arguments, void 0, function (env) {
    var filePath, raw, parsed, _a, _b;
    if (env === void 0) {
      env = process.env;
    }
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          filePath = resolveRestartSentinelPath(env);
          _c.label = 1;
        case 1:
          _c.trys.push([1, 9, , 10]);
          return [4 /*yield*/, promises_1.default.readFile(filePath, "utf-8")];
        case 2:
          raw = _c.sent();
          parsed = void 0;
          _c.label = 3;
        case 3:
          _c.trys.push([3, 4, , 6]);
          parsed = JSON.parse(raw);
          return [3 /*break*/, 6];
        case 4:
          _a = _c.sent();
          return [4 /*yield*/, promises_1.default.unlink(filePath).catch(function () {})];
        case 5:
          _c.sent();
          return [2 /*return*/, null];
        case 6:
          if (!(!parsed || parsed.version !== 1 || !parsed.payload)) {
            return [3 /*break*/, 8];
          }
          return [4 /*yield*/, promises_1.default.unlink(filePath).catch(function () {})];
        case 7:
          _c.sent();
          return [2 /*return*/, null];
        case 8:
          return [2 /*return*/, parsed];
        case 9:
          _b = _c.sent();
          return [2 /*return*/, null];
        case 10:
          return [2 /*return*/];
      }
    });
  });
}
function consumeRestartSentinel() {
  return __awaiter(this, arguments, void 0, function (env) {
    var filePath, parsed;
    if (env === void 0) {
      env = process.env;
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          filePath = resolveRestartSentinelPath(env);
          return [4 /*yield*/, readRestartSentinel(env)];
        case 1:
          parsed = _a.sent();
          if (!parsed) {
            return [2 /*return*/, null];
          }
          return [4 /*yield*/, promises_1.default.unlink(filePath).catch(function () {})];
        case 2:
          _a.sent();
          return [2 /*return*/, parsed];
      }
    });
  });
}
function formatRestartSentinelMessage(payload) {
  return "GatewayRestart:\n".concat(JSON.stringify(payload, null, 2));
}
function summarizeRestartSentinel(payload) {
  var _a;
  var kind = payload.kind;
  var status = payload.status;
  var mode = ((_a = payload.stats) === null || _a === void 0 ? void 0 : _a.mode)
    ? " (".concat(payload.stats.mode, ")")
    : "";
  return "Gateway restart ".concat(kind, " ").concat(status).concat(mode).trim();
}
function trimLogTail(input, maxChars) {
  if (maxChars === void 0) {
    maxChars = 8000;
  }
  if (!input) {
    return null;
  }
  var text = input.trimEnd();
  if (text.length <= maxChars) {
    return text;
  }
  return "\u2026".concat(text.slice(text.length - maxChars));
}
