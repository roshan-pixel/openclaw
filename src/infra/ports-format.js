"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.classifyPortListener = classifyPortListener;
exports.buildPortHints = buildPortHints;
exports.formatPortListener = formatPortListener;
exports.formatPortDiagnostics = formatPortDiagnostics;
var command_format_js_1 = require("../cli/command-format.js");
function classifyPortListener(listener, port) {
  var _a, _b;
  var raw = ""
    .concat((_a = listener.commandLine) !== null && _a !== void 0 ? _a : "", " ")
    .concat((_b = listener.command) !== null && _b !== void 0 ? _b : "")
    .trim()
    .toLowerCase();
  if (raw.includes("openclaw")) {
    return "gateway";
  }
  if (raw.includes("ssh")) {
    var portToken = String(port);
    var tunnelPattern = new RegExp(
      "-(l|r)\\s*"
        .concat(portToken, "\\b|-(l|r)")
        .concat(portToken, "\\b|:")
        .concat(portToken, "\\b"),
    );
    if (!raw || tunnelPattern.test(raw)) {
      return "ssh";
    }
    return "ssh";
  }
  return "unknown";
}
function buildPortHints(listeners, port) {
  if (listeners.length === 0) {
    return [];
  }
  var kinds = new Set(
    listeners.map(function (listener) {
      return classifyPortListener(listener, port);
    }),
  );
  var hints = [];
  if (kinds.has("gateway")) {
    hints.push(
      "Gateway already running locally. Stop it (".concat(
        (0, command_format_js_1.formatCliCommand)("openclaw gateway stop"),
        ") or use a different port.",
      ),
    );
  }
  if (kinds.has("ssh")) {
    hints.push(
      "SSH tunnel already bound to this port. Close the tunnel or use a different local port in -L.",
    );
  }
  if (kinds.has("unknown")) {
    hints.push("Another process is listening on this port.");
  }
  if (listeners.length > 1) {
    hints.push(
      "Multiple listeners detected; ensure only one gateway/tunnel per port unless intentionally running isolated profiles.",
    );
  }
  return hints;
}
function formatPortListener(listener) {
  var pid = listener.pid ? "pid ".concat(listener.pid) : "pid ?";
  var user = listener.user ? " ".concat(listener.user) : "";
  var command = listener.commandLine || listener.command || "unknown";
  var address = listener.address ? " (".concat(listener.address, ")") : "";
  return "".concat(pid).concat(user, ": ").concat(command).concat(address);
}
function formatPortDiagnostics(diagnostics) {
  if (diagnostics.status !== "busy") {
    return ["Port ".concat(diagnostics.port, " is free.")];
  }
  var lines = ["Port ".concat(diagnostics.port, " is already in use.")];
  for (var _i = 0, _a = diagnostics.listeners; _i < _a.length; _i++) {
    var listener = _a[_i];
    lines.push("- ".concat(formatPortListener(listener)));
  }
  for (var _b = 0, _c = diagnostics.hints; _b < _c.length; _b++) {
    var hint = _c[_b];
    lines.push("- ".concat(hint));
  }
  return lines;
}
