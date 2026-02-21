"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifySignalCliLogLine = classifySignalCliLogLine;
exports.spawnSignalDaemon = spawnSignalDaemon;
var node_child_process_1 = require("node:child_process");
function classifySignalCliLogLine(line) {
  var trimmed = line.trim();
  if (!trimmed) {
    return null;
  }
  // signal-cli commonly writes all logs to stderr; treat severity explicitly.
  if (/\b(ERROR|WARN|WARNING)\b/.test(trimmed)) {
    return "error";
  }
  // Some signal-cli failures are not tagged with WARN/ERROR but should still be surfaced loudly.
  if (/\b(FAILED|SEVERE|EXCEPTION)\b/i.test(trimmed)) {
    return "error";
  }
  return "log";
}
function buildDaemonArgs(opts) {
  var args = [];
  if (opts.account) {
    args.push("-a", opts.account);
  }
  args.push("daemon");
  args.push("--http", "".concat(opts.httpHost, ":").concat(opts.httpPort));
  args.push("--no-receive-stdout");
  if (opts.receiveMode) {
    args.push("--receive-mode", opts.receiveMode);
  }
  if (opts.ignoreAttachments) {
    args.push("--ignore-attachments");
  }
  if (opts.ignoreStories) {
    args.push("--ignore-stories");
  }
  if (opts.sendReadReceipts) {
    args.push("--send-read-receipts");
  }
  return args;
}
function spawnSignalDaemon(opts) {
  var _a, _b, _c, _d, _e, _f, _g;
  var args = buildDaemonArgs(opts);
  var child = (0, node_child_process_1.spawn)(opts.cliPath, args, {
    stdio: ["ignore", "pipe", "pipe"],
  });
  var log =
    (_b = (_a = opts.runtime) === null || _a === void 0 ? void 0 : _a.log) !== null && _b !== void 0
      ? _b
      : function () {};
  var error =
    (_d = (_c = opts.runtime) === null || _c === void 0 ? void 0 : _c.error) !== null &&
    _d !== void 0
      ? _d
      : function () {};
  (_e = child.stdout) === null || _e === void 0
    ? void 0
    : _e.on("data", function (data) {
        for (var _i = 0, _a = data.toString().split(/\r?\n/); _i < _a.length; _i++) {
          var line = _a[_i];
          var kind = classifySignalCliLogLine(line);
          if (kind === "log") {
            log("signal-cli: ".concat(line.trim()));
          } else if (kind === "error") {
            error("signal-cli: ".concat(line.trim()));
          }
        }
      });
  (_f = child.stderr) === null || _f === void 0
    ? void 0
    : _f.on("data", function (data) {
        for (var _i = 0, _a = data.toString().split(/\r?\n/); _i < _a.length; _i++) {
          var line = _a[_i];
          var kind = classifySignalCliLogLine(line);
          if (kind === "log") {
            log("signal-cli: ".concat(line.trim()));
          } else if (kind === "error") {
            error("signal-cli: ".concat(line.trim()));
          }
        }
      });
  child.on("error", function (err) {
    error("signal-cli spawn error: ".concat(String(err)));
  });
  return {
    pid: (_g = child.pid) !== null && _g !== void 0 ? _g : undefined,
    stop: function () {
      if (!child.killed) {
        child.kill("SIGTERM");
      }
    },
  };
}
