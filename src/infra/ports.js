"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          }
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null) {
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      }
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
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
exports.inspectPortUsage =
  exports.formatPortDiagnostics =
  exports.classifyPortListener =
  exports.buildPortHints =
  exports.PortInUseError =
    void 0;
exports.describePortOwner = describePortOwner;
exports.ensurePortAvailable = ensurePortAvailable;
exports.handlePortError = handlePortError;
var node_net_1 = require("node:net");
var globals_js_1 = require("../globals.js");
var logger_js_1 = require("../logger.js");
var runtime_js_1 = require("../runtime.js");
var ports_format_js_1 = require("./ports-format.js");
var ports_inspect_js_1 = require("./ports-inspect.js");
var PortInUseError = /** @class */ (function (_super) {
  __extends(PortInUseError, _super);
  function PortInUseError(port, details) {
    var _this = _super.call(this, "Port ".concat(port, " is already in use.")) || this;
    _this.name = "PortInUseError";
    _this.port = port;
    _this.details = details;
    return _this;
  }
  return PortInUseError;
})(Error);
exports.PortInUseError = PortInUseError;
function isErrno(err) {
  return Boolean(err && typeof err === "object" && "code" in err);
}
function describePortOwner(port) {
  return __awaiter(this, void 0, void 0, function () {
    var diagnostics;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, ports_inspect_js_1.inspectPortUsage)(port)];
        case 1:
          diagnostics = _a.sent();
          if (diagnostics.listeners.length === 0) {
            return [2 /*return*/, undefined];
          }
          return [
            2 /*return*/,
            (0, ports_format_js_1.formatPortDiagnostics)(diagnostics).join("\n"),
          ];
      }
    });
  });
}
function ensurePortAvailable(port) {
  return __awaiter(this, void 0, void 0, function () {
    var err_1, details;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 5]);
          return [
            4 /*yield*/,
            new Promise(function (resolve, reject) {
              var tester = node_net_1.default
                .createServer()
                .once("error", function (err) {
                  return reject(err);
                })
                .once("listening", function () {
                  tester.close(function () {
                    return resolve();
                  });
                })
                .listen(port);
            }),
          ];
        case 1:
          _a.sent();
          return [3 /*break*/, 5];
        case 2:
          err_1 = _a.sent();
          if (!(isErrno(err_1) && err_1.code === "EADDRINUSE")) {
            return [3 /*break*/, 4];
          }
          return [4 /*yield*/, describePortOwner(port)];
        case 3:
          details = _a.sent();
          throw new PortInUseError(port, details);
        case 4:
          throw err_1;
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function handlePortError(err_2, port_1, context_1) {
  return __awaiter(this, arguments, void 0, function (err, port, context, runtime) {
    var details, _a, stdout, stderr;
    if (runtime === void 0) {
      runtime = runtime_js_1.defaultRuntime;
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (!(err instanceof PortInUseError || (isErrno(err) && err.code === "EADDRINUSE"))) {
            return [3 /*break*/, 4];
          }
          if (!(err instanceof PortInUseError)) {
            return [3 /*break*/, 1];
          }
          _a = err.details;
          return [3 /*break*/, 3];
        case 1:
          return [4 /*yield*/, describePortOwner(port)];
        case 2:
          _a = _b.sent();
          _b.label = 3;
        case 3:
          details = _a;
          runtime.error(
            (0, globals_js_1.danger)(
              "".concat(context, " failed: port ").concat(port, " is already in use."),
            ),
          );
          if (details) {
            runtime.error((0, globals_js_1.info)("Port listener details:"));
            runtime.error(details);
            if (/openclaw|src\/index\.ts|dist\/index\.js/.test(details)) {
              runtime.error(
                (0, globals_js_1.warn)(
                  "It looks like another OpenClaw instance is already running. Stop it or pick a different port.",
                ),
              );
            }
          }
          runtime.error(
            (0, globals_js_1.info)(
              "Resolve by stopping the process using the port or passing --port <free-port>.",
            ),
          );
          runtime.exit(1);
          _b.label = 4;
        case 4:
          runtime.error(
            (0, globals_js_1.danger)("".concat(context, " failed: ").concat(String(err))),
          );
          if ((0, globals_js_1.shouldLogVerbose)()) {
            stdout = err === null || err === void 0 ? void 0 : err.stdout;
            stderr = err === null || err === void 0 ? void 0 : err.stderr;
            if (stdout === null || stdout === void 0 ? void 0 : stdout.trim()) {
              (0, logger_js_1.logDebug)("stdout: ".concat(stdout.trim()));
            }
            if (stderr === null || stderr === void 0 ? void 0 : stderr.trim()) {
              (0, logger_js_1.logDebug)("stderr: ".concat(stderr.trim()));
            }
          }
          return [2 /*return*/, runtime.exit(1)];
      }
    });
  });
}
var ports_format_js_2 = require("./ports-format.js");
Object.defineProperty(exports, "buildPortHints", {
  enumerable: true,
  get: function () {
    return ports_format_js_2.buildPortHints;
  },
});
Object.defineProperty(exports, "classifyPortListener", {
  enumerable: true,
  get: function () {
    return ports_format_js_2.classifyPortListener;
  },
});
Object.defineProperty(exports, "formatPortDiagnostics", {
  enumerable: true,
  get: function () {
    return ports_format_js_2.formatPortDiagnostics;
  },
});
var ports_inspect_js_2 = require("./ports-inspect.js");
Object.defineProperty(exports, "inspectPortUsage", {
  enumerable: true,
  get: function () {
    return ports_inspect_js_2.inspectPortUsage;
  },
});
