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
exports.IMessageRpcClient = void 0;
exports.createIMessageRpcClient = createIMessageRpcClient;
var node_child_process_1 = require("node:child_process");
var node_readline_1 = require("node:readline");
var utils_js_1 = require("../utils.js");
var IMessageRpcClient = /** @class */ (function () {
  function IMessageRpcClient(opts) {
    if (opts === void 0) {
      opts = {};
    }
    var _this = this;
    var _a, _b;
    this.pending = new Map();
    this.closedResolve = null;
    this.child = null;
    this.reader = null;
    this.nextId = 1;
    this.cliPath = ((_a = opts.cliPath) === null || _a === void 0 ? void 0 : _a.trim()) || "imsg";
    this.dbPath = ((_b = opts.dbPath) === null || _b === void 0 ? void 0 : _b.trim())
      ? (0, utils_js_1.resolveUserPath)(opts.dbPath)
      : undefined;
    this.runtime = opts.runtime;
    this.onNotification = opts.onNotification;
    this.closed = new Promise(function (resolve) {
      _this.closedResolve = resolve;
    });
  }
  IMessageRpcClient.prototype.start = function () {
    return __awaiter(this, void 0, void 0, function () {
      var args, child;
      var _this = this;
      var _a;
      return __generator(this, function (_b) {
        if (this.child) {
          return [2 /*return*/];
        }
        args = ["rpc"];
        if (this.dbPath) {
          args.push("--db", this.dbPath);
        }
        child = (0, node_child_process_1.spawn)(this.cliPath, args, {
          stdio: ["pipe", "pipe", "pipe"],
        });
        this.child = child;
        this.reader = (0, node_readline_1.createInterface)({ input: child.stdout });
        this.reader.on("line", function (line) {
          var trimmed = line.trim();
          if (!trimmed) {
            return;
          }
          _this.handleLine(trimmed);
        });
        (_a = child.stderr) === null || _a === void 0
          ? void 0
          : _a.on("data", function (chunk) {
              var _a, _b;
              var lines = chunk.toString().split(/\r?\n/);
              for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
                var line = lines_1[_i];
                if (!line.trim()) {
                  continue;
                }
                (_b = (_a = _this.runtime) === null || _a === void 0 ? void 0 : _a.error) ===
                  null || _b === void 0
                  ? void 0
                  : _b.call(_a, "imsg rpc: ".concat(line.trim()));
              }
            });
        child.on("error", function (err) {
          var _a;
          _this.failAll(err instanceof Error ? err : new Error(String(err)));
          (_a = _this.closedResolve) === null || _a === void 0 ? void 0 : _a.call(_this);
        });
        child.on("close", function (code, signal) {
          var _a;
          if (code !== 0 && code !== null) {
            var reason = signal ? "signal ".concat(signal) : "code ".concat(code);
            _this.failAll(new Error("imsg rpc exited (".concat(reason, ")")));
          } else {
            _this.failAll(new Error("imsg rpc closed"));
          }
          (_a = _this.closedResolve) === null || _a === void 0 ? void 0 : _a.call(_this);
        });
        return [2 /*return*/];
      });
    });
  };
  IMessageRpcClient.prototype.stop = function () {
    return __awaiter(this, void 0, void 0, function () {
      var child;
      var _a, _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            if (!this.child) {
              return [2 /*return*/];
            }
            (_a = this.reader) === null || _a === void 0 ? void 0 : _a.close();
            this.reader = null;
            (_b = this.child.stdin) === null || _b === void 0 ? void 0 : _b.end();
            child = this.child;
            this.child = null;
            return [
              4 /*yield*/,
              Promise.race([
                this.closed,
                new Promise(function (resolve) {
                  setTimeout(function () {
                    if (!child.killed) {
                      child.kill("SIGTERM");
                    }
                    resolve();
                  }, 500);
                }),
              ]),
            ];
          case 1:
            _c.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  IMessageRpcClient.prototype.waitForClose = function () {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, this.closed];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  IMessageRpcClient.prototype.request = function (method, params, opts) {
    return __awaiter(this, void 0, void 0, function () {
      var id, payload, line, timeoutMs, response;
      var _this = this;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            if (!this.child || !this.child.stdin) {
              throw new Error("imsg rpc not running");
            }
            id = this.nextId++;
            payload = {
              jsonrpc: "2.0",
              id: id,
              method: method,
              params: params !== null && params !== void 0 ? params : {},
            };
            line = "".concat(JSON.stringify(payload), "\n");
            timeoutMs =
              (_a = opts === null || opts === void 0 ? void 0 : opts.timeoutMs) !== null &&
              _a !== void 0
                ? _a
                : 10000;
            response = new Promise(function (resolve, reject) {
              var key = String(id);
              var timer =
                timeoutMs > 0
                  ? setTimeout(function () {
                      _this.pending.delete(key);
                      reject(new Error("imsg rpc timeout (".concat(method, ")")));
                    }, timeoutMs)
                  : undefined;
              _this.pending.set(key, {
                resolve: function (value) {
                  return resolve(value);
                },
                reject: reject,
                timer: timer,
              });
            });
            this.child.stdin.write(line);
            return [4 /*yield*/, response];
          case 1:
            return [2 /*return*/, _b.sent()];
        }
      });
    });
  };
  IMessageRpcClient.prototype.handleLine = function (line) {
    var _a, _b, _c, _d;
    var parsed;
    try {
      parsed = JSON.parse(line);
    } catch (err) {
      var detail = err instanceof Error ? err.message : String(err);
      (_b = (_a = this.runtime) === null || _a === void 0 ? void 0 : _a.error) === null ||
      _b === void 0
        ? void 0
        : _b.call(_a, "imsg rpc: failed to parse ".concat(line, ": ").concat(detail));
      return;
    }
    if (parsed.id !== undefined && parsed.id !== null) {
      var key = String(parsed.id);
      var pending = this.pending.get(key);
      if (!pending) {
        return;
      }
      if (pending.timer) {
        clearTimeout(pending.timer);
      }
      this.pending.delete(key);
      if (parsed.error) {
        var baseMessage =
          (_c = parsed.error.message) !== null && _c !== void 0 ? _c : "imsg rpc error";
        var details = parsed.error.data;
        var code = parsed.error.code;
        var suffixes = [];
        if (typeof code === "number") {
          suffixes.push("code=".concat(code));
        }
        if (details !== undefined) {
          var detailText = typeof details === "string" ? details : JSON.stringify(details, null, 2);
          if (detailText) {
            suffixes.push(detailText);
          }
        }
        var msg =
          suffixes.length > 0
            ? "".concat(baseMessage, ": ").concat(suffixes.join(" "))
            : baseMessage;
        pending.reject(new Error(msg));
        return;
      }
      pending.resolve(parsed.result);
      return;
    }
    if (parsed.method) {
      (_d = this.onNotification) === null || _d === void 0
        ? void 0
        : _d.call(this, {
            method: parsed.method,
            params: parsed.params,
          });
    }
  };
  IMessageRpcClient.prototype.failAll = function (err) {
    for (var _i = 0, _a = this.pending.entries(); _i < _a.length; _i++) {
      var _b = _a[_i],
        key = _b[0],
        pending = _b[1];
      if (pending.timer) {
        clearTimeout(pending.timer);
      }
      pending.reject(err);
      this.pending.delete(key);
    }
  };
  return IMessageRpcClient;
})();
exports.IMessageRpcClient = IMessageRpcClient;
function createIMessageRpcClient() {
  return __awaiter(this, arguments, void 0, function (opts) {
    var client;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          client = new IMessageRpcClient(opts);
          return [4 /*yield*/, client.start()];
        case 1:
          _a.sent();
          return [2 /*return*/, client];
      }
    });
  });
}
