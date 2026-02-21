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
exports.inspectPortUsage = inspectPortUsage;
var node_net_1 = require("node:net");
var exec_js_1 = require("../process/exec.js");
var ports_lsof_js_1 = require("./ports-lsof.js");
var ports_format_js_1 = require("./ports-format.js");
function isErrno(err) {
  return Boolean(err && typeof err === "object" && "code" in err);
}
function runCommandSafe(argv_1) {
  return __awaiter(this, arguments, void 0, function (argv, timeoutMs) {
    var res, err_1;
    var _a;
    if (timeoutMs === void 0) {
      timeoutMs = 5000;
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [
            4 /*yield*/,
            (0, exec_js_1.runCommandWithTimeout)(argv, { timeoutMs: timeoutMs }),
          ];
        case 1:
          res = _b.sent();
          return [
            2 /*return*/,
            {
              stdout: res.stdout,
              stderr: res.stderr,
              code: (_a = res.code) !== null && _a !== void 0 ? _a : 1,
            },
          ];
        case 2:
          err_1 = _b.sent();
          return [
            2 /*return*/,
            {
              stdout: "",
              stderr: "",
              code: 1,
              error: String(err_1),
            },
          ];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function parseLsofFieldOutput(output) {
  var lines = output.split(/\r?\n/).filter(Boolean);
  var listeners = [];
  var current = {};
  for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
    var line = lines_1[_i];
    if (line.startsWith("p")) {
      if (current.pid || current.command) {
        listeners.push(current);
      }
      var pid = Number.parseInt(line.slice(1), 10);
      current = Number.isFinite(pid) ? { pid: pid } : {};
    } else if (line.startsWith("c")) {
      current.command = line.slice(1);
    } else if (line.startsWith("n")) {
      // TCP 127.0.0.1:18789 (LISTEN)
      // TCP *:18789 (LISTEN)
      if (!current.address) {
        current.address = line.slice(1);
      }
    }
  }
  if (current.pid || current.command) {
    listeners.push(current);
  }
  return listeners;
}
function resolveUnixCommandLine(pid) {
  return __awaiter(this, void 0, void 0, function () {
    var res, line;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, runCommandSafe(["ps", "-p", String(pid), "-o", "command="])];
        case 1:
          res = _a.sent();
          if (res.code !== 0) {
            return [2 /*return*/, undefined];
          }
          line = res.stdout.trim();
          return [2 /*return*/, line || undefined];
      }
    });
  });
}
function resolveUnixUser(pid) {
  return __awaiter(this, void 0, void 0, function () {
    var res, line;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, runCommandSafe(["ps", "-p", String(pid), "-o", "user="])];
        case 1:
          res = _a.sent();
          if (res.code !== 0) {
            return [2 /*return*/, undefined];
          }
          line = res.stdout.trim();
          return [2 /*return*/, line || undefined];
      }
    });
  });
}
function readUnixListeners(port) {
  return __awaiter(this, void 0, void 0, function () {
    var errors, lsof, res, listeners, stderr, detail;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          errors = [];
          return [4 /*yield*/, (0, ports_lsof_js_1.resolveLsofCommand)()];
        case 1:
          lsof = _a.sent();
          return [
            4 /*yield*/,
            runCommandSafe([lsof, "-nP", "-iTCP:".concat(port), "-sTCP:LISTEN", "-FpFcn"]),
          ];
        case 2:
          res = _a.sent();
          if (!(res.code === 0)) {
            return [3 /*break*/, 4];
          }
          listeners = parseLsofFieldOutput(res.stdout);
          return [
            4 /*yield*/,
            Promise.all(
              listeners.map(function (listener) {
                return __awaiter(_this, void 0, void 0, function () {
                  var _a, commandLine, user;
                  return __generator(this, function (_b) {
                    switch (_b.label) {
                      case 0:
                        if (!listener.pid) {
                          return [2 /*return*/];
                        }
                        return [
                          4 /*yield*/,
                          Promise.all([
                            resolveUnixCommandLine(listener.pid),
                            resolveUnixUser(listener.pid),
                          ]),
                        ];
                      case 1:
                        ((_a = _b.sent()), (commandLine = _a[0]), (user = _a[1]));
                        if (commandLine) {
                          listener.commandLine = commandLine;
                        }
                        if (user) {
                          listener.user = user;
                        }
                        return [2 /*return*/];
                    }
                  });
                });
              }),
            ),
          ];
        case 3:
          _a.sent();
          return [
            2 /*return*/,
            { listeners: listeners, detail: res.stdout.trim() || undefined, errors: errors },
          ];
        case 4:
          stderr = res.stderr.trim();
          if (res.code === 1 && !res.error && !stderr) {
            return [2 /*return*/, { listeners: [], detail: undefined, errors: errors }];
          }
          if (res.error) {
            errors.push(res.error);
          }
          detail = [stderr, res.stdout.trim()].filter(Boolean).join("\n");
          if (detail) {
            errors.push(detail);
          }
          return [2 /*return*/, { listeners: [], detail: undefined, errors: errors }];
      }
    });
  });
}
function parseNetstatListeners(output, port) {
  var listeners = [];
  var portToken = ":".concat(port);
  for (var _i = 0, _a = output.split(/\r?\n/); _i < _a.length; _i++) {
    var rawLine = _a[_i];
    var line = rawLine.trim();
    if (!line) {
      continue;
    }
    if (!line.toLowerCase().includes("listen")) {
      continue;
    }
    if (!line.includes(portToken)) {
      continue;
    }
    var parts = line.split(/\s+/);
    if (parts.length < 4) {
      continue;
    }
    var pidRaw = parts.at(-1);
    var pid = pidRaw ? Number.parseInt(pidRaw, 10) : NaN;
    var localAddr = parts[1];
    var listener = {};
    if (Number.isFinite(pid)) {
      listener.pid = pid;
    }
    if (localAddr === null || localAddr === void 0 ? void 0 : localAddr.includes(portToken)) {
      listener.address = localAddr;
    }
    listeners.push(listener);
  }
  return listeners;
}
function resolveWindowsImageName(pid) {
  return __awaiter(this, void 0, void 0, function () {
    var res, _i, _a, rawLine, line, value;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [
            4 /*yield*/,
            runCommandSafe(["tasklist", "/FI", "PID eq ".concat(pid), "/FO", "LIST"]),
          ];
        case 1:
          res = _b.sent();
          if (res.code !== 0) {
            return [2 /*return*/, undefined];
          }
          for (_i = 0, _a = res.stdout.split(/\r?\n/); _i < _a.length; _i++) {
            rawLine = _a[_i];
            line = rawLine.trim();
            if (!line.toLowerCase().startsWith("image name:")) {
              continue;
            }
            value = line.slice("image name:".length).trim();
            return [2 /*return*/, value || undefined];
          }
          return [2 /*return*/, undefined];
      }
    });
  });
}
function resolveWindowsCommandLine(pid) {
  return __awaiter(this, void 0, void 0, function () {
    var res, _i, _a, rawLine, line, value;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [
            4 /*yield*/,
            runCommandSafe([
              "wmic",
              "process",
              "where",
              "ProcessId=".concat(pid),
              "get",
              "CommandLine",
              "/value",
            ]),
          ];
        case 1:
          res = _b.sent();
          if (res.code !== 0) {
            return [2 /*return*/, undefined];
          }
          for (_i = 0, _a = res.stdout.split(/\r?\n/); _i < _a.length; _i++) {
            rawLine = _a[_i];
            line = rawLine.trim();
            if (!line.toLowerCase().startsWith("commandline=")) {
              continue;
            }
            value = line.slice("commandline=".length).trim();
            return [2 /*return*/, value || undefined];
          }
          return [2 /*return*/, undefined];
      }
    });
  });
}
function readWindowsListeners(port) {
  return __awaiter(this, void 0, void 0, function () {
    var errors, res, detail, listeners;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          errors = [];
          return [4 /*yield*/, runCommandSafe(["netstat", "-ano", "-p", "tcp"])];
        case 1:
          res = _a.sent();
          if (res.code !== 0) {
            if (res.error) {
              errors.push(res.error);
            }
            detail = [res.stderr.trim(), res.stdout.trim()].filter(Boolean).join("\n");
            if (detail) {
              errors.push(detail);
            }
            return [2 /*return*/, { listeners: [], errors: errors }];
          }
          listeners = parseNetstatListeners(res.stdout, port);
          return [
            4 /*yield*/,
            Promise.all(
              listeners.map(function (listener) {
                return __awaiter(_this, void 0, void 0, function () {
                  var _a, imageName, commandLine;
                  return __generator(this, function (_b) {
                    switch (_b.label) {
                      case 0:
                        if (!listener.pid) {
                          return [2 /*return*/];
                        }
                        return [
                          4 /*yield*/,
                          Promise.all([
                            resolveWindowsImageName(listener.pid),
                            resolveWindowsCommandLine(listener.pid),
                          ]),
                        ];
                      case 1:
                        ((_a = _b.sent()), (imageName = _a[0]), (commandLine = _a[1]));
                        if (imageName) {
                          listener.command = imageName;
                        }
                        if (commandLine) {
                          listener.commandLine = commandLine;
                        }
                        return [2 /*return*/];
                    }
                  });
                });
              }),
            ),
          ];
        case 2:
          _a.sent();
          return [
            2 /*return*/,
            { listeners: listeners, detail: res.stdout.trim() || undefined, errors: errors },
          ];
      }
    });
  });
}
function tryListenOnHost(port, host) {
  return __awaiter(this, void 0, void 0, function () {
    var err_2;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
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
                .listen({ port: port, host: host, exclusive: true });
            }),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/, "free"];
        case 2:
          err_2 = _a.sent();
          if (isErrno(err_2) && err_2.code === "EADDRINUSE") {
            return [2 /*return*/, "busy"];
          }
          if (isErrno(err_2) && (err_2.code === "EADDRNOTAVAIL" || err_2.code === "EAFNOSUPPORT")) {
            return [2 /*return*/, "skip"];
          }
          return [2 /*return*/, "unknown"];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function checkPortInUse(port) {
  return __awaiter(this, void 0, void 0, function () {
    var hosts, sawUnknown, _i, hosts_1, host, result;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          hosts = ["127.0.0.1", "0.0.0.0", "::1", "::"];
          sawUnknown = false;
          ((_i = 0), (hosts_1 = hosts));
          _a.label = 1;
        case 1:
          if (!(_i < hosts_1.length)) {
            return [3 /*break*/, 4];
          }
          host = hosts_1[_i];
          return [4 /*yield*/, tryListenOnHost(port, host)];
        case 2:
          result = _a.sent();
          if (result === "busy") {
            return [2 /*return*/, "busy"];
          }
          if (result === "unknown") {
            sawUnknown = true;
          }
          _a.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/, sawUnknown ? "unknown" : "free"];
      }
    });
  });
}
function inspectPortUsage(port) {
  return __awaiter(this, void 0, void 0, function () {
    var errors, result, _a, listeners, status, hints;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          errors = [];
          if (!(process.platform === "win32")) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, readWindowsListeners(port)];
        case 1:
          _a = _b.sent();
          return [3 /*break*/, 4];
        case 2:
          return [4 /*yield*/, readUnixListeners(port)];
        case 3:
          _a = _b.sent();
          _b.label = 4;
        case 4:
          result = _a;
          errors.push.apply(errors, result.errors);
          listeners = result.listeners;
          status = listeners.length > 0 ? "busy" : "unknown";
          if (!(listeners.length === 0)) {
            return [3 /*break*/, 6];
          }
          return [4 /*yield*/, checkPortInUse(port)];
        case 5:
          status = _b.sent();
          _b.label = 6;
        case 6:
          if (status !== "busy") {
            listeners = [];
          }
          hints = (0, ports_format_js_1.buildPortHints)(listeners, port);
          if (status === "busy" && listeners.length === 0) {
            hints.push(
              "Port is in use but process details are unavailable (install lsof or run as an admin user).",
            );
          }
          return [
            2 /*return*/,
            {
              port: port,
              status: status,
              listeners: listeners,
              hints: hints,
              detail: result.detail,
              errors: errors.length > 0 ? errors : undefined,
            },
          ];
      }
    });
  });
}
