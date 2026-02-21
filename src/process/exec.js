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
exports.runExec = runExec;
exports.runCommandWithTimeout = runCommandWithTimeout;
var node_child_process_1 = require("node:child_process");
var node_path_1 = require("node:path");
var node_util_1 = require("node:util");
var globals_js_1 = require("../globals.js");
var logger_js_1 = require("../logger.js");
var spawn_utils_js_1 = require("./spawn-utils.js");
var execFileAsync = (0, node_util_1.promisify)(node_child_process_1.execFile);
// Simple promise-wrapped execFile with optional verbosity logging.
function runExec(command_1, args_1) {
  return __awaiter(this, arguments, void 0, function (command, args, opts) {
    var options, _a, stdout, stderr, err_1;
    if (opts === void 0) {
      opts = 10000;
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          options =
            typeof opts === "number"
              ? { timeout: opts, encoding: "utf8" }
              : {
                  timeout: opts.timeoutMs,
                  maxBuffer: opts.maxBuffer,
                  encoding: "utf8",
                };
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [4 /*yield*/, execFileAsync(command, args, options)];
        case 2:
          ((_a = _b.sent()), (stdout = _a.stdout), (stderr = _a.stderr));
          if ((0, globals_js_1.shouldLogVerbose)()) {
            if (stdout.trim()) {
              (0, logger_js_1.logDebug)(stdout.trim());
            }
            if (stderr.trim()) {
              (0, logger_js_1.logError)(stderr.trim());
            }
          }
          return [2 /*return*/, { stdout: stdout, stderr: stderr }];
        case 3:
          err_1 = _b.sent();
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, logger_js_1.logError)(
              (0, globals_js_1.danger)(
                "Command failed: ".concat(command, " ").concat(args.join(" ")),
              ),
            );
          }
          throw err_1;
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function runCommandWithTimeout(argv, optionsOrTimeout) {
  return __awaiter(this, void 0, void 0, function () {
    var options,
      timeoutMs,
      cwd,
      input,
      env,
      windowsVerbatimArguments,
      hasInput,
      shouldSuppressNpmFund,
      resolvedEnv,
      stdio,
      child;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          options =
            typeof optionsOrTimeout === "number"
              ? { timeoutMs: optionsOrTimeout }
              : optionsOrTimeout;
          ((timeoutMs = options.timeoutMs),
            (cwd = options.cwd),
            (input = options.input),
            (env = options.env));
          windowsVerbatimArguments = options.windowsVerbatimArguments;
          hasInput = input !== undefined;
          shouldSuppressNpmFund = (function () {
            var _a, _b;
            var cmd = node_path_1.default.basename(
              (_a = argv[0]) !== null && _a !== void 0 ? _a : "",
            );
            if (cmd === "npm" || cmd === "npm.cmd" || cmd === "npm.exe") {
              return true;
            }
            if (cmd === "node" || cmd === "node.exe") {
              var script = (_b = argv[1]) !== null && _b !== void 0 ? _b : "";
              return script.includes("npm-cli.js");
            }
            return false;
          })();
          resolvedEnv = env ? __assign(__assign({}, process.env), env) : __assign({}, process.env);
          if (shouldSuppressNpmFund) {
            if (resolvedEnv.NPM_CONFIG_FUND == null) {
              resolvedEnv.NPM_CONFIG_FUND = "false";
            }
            if (resolvedEnv.npm_config_fund == null) {
              resolvedEnv.npm_config_fund = "false";
            }
          }
          stdio = (0, spawn_utils_js_1.resolveCommandStdio)({
            hasInput: hasInput,
            preferInherit: true,
          });
          child = (0, node_child_process_1.spawn)(argv[0], argv.slice(1), {
            stdio: stdio,
            cwd: cwd,
            env: resolvedEnv,
            windowsVerbatimArguments: windowsVerbatimArguments,
          });
          return [
            4 /*yield*/,
            new Promise(function (resolve, reject) {
              var _a, _b;
              var stdout = "";
              var stderr = "";
              var settled = false;
              var timer = setTimeout(function () {
                if (typeof child.kill === "function") {
                  child.kill("SIGKILL");
                }
              }, timeoutMs);
              if (hasInput && child.stdin) {
                child.stdin.write(input !== null && input !== void 0 ? input : "");
                child.stdin.end();
              }
              (_a = child.stdout) === null || _a === void 0
                ? void 0
                : _a.on("data", function (d) {
                    stdout += d.toString();
                  });
              (_b = child.stderr) === null || _b === void 0
                ? void 0
                : _b.on("data", function (d) {
                    stderr += d.toString();
                  });
              child.on("error", function (err) {
                if (settled) {
                  return;
                }
                settled = true;
                clearTimeout(timer);
                reject(err);
              });
              child.on("close", function (code, signal) {
                if (settled) {
                  return;
                }
                settled = true;
                clearTimeout(timer);
                resolve({
                  stdout: stdout,
                  stderr: stderr,
                  code: code,
                  signal: signal,
                  killed: child.killed,
                });
              });
            }),
          ];
        case 1:
          // Spawn with inherited stdin (TTY) so tools like `pi` stay interactive when needed.
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
