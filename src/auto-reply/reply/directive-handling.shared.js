"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatReasoningEvent =
  exports.formatElevatedEvent =
  exports.formatElevatedRuntimeHint =
  exports.withOptions =
  exports.formatOptionsLine =
  exports.formatDirectiveAck =
  exports.SYSTEM_MARK =
    void 0;
exports.formatElevatedUnavailableText = formatElevatedUnavailableText;
var command_format_js_1 = require("../../cli/command-format.js");
exports.SYSTEM_MARK = "⚙️";
var formatDirectiveAck = function (text) {
  if (!text) {
    return text;
  }
  if (text.startsWith(exports.SYSTEM_MARK)) {
    return text;
  }
  return "".concat(exports.SYSTEM_MARK, " ").concat(text);
};
exports.formatDirectiveAck = formatDirectiveAck;
var formatOptionsLine = function (options) {
  return "Options: ".concat(options, ".");
};
exports.formatOptionsLine = formatOptionsLine;
var withOptions = function (line, options) {
  return "".concat(line, "\n").concat((0, exports.formatOptionsLine)(options));
};
exports.withOptions = withOptions;
var formatElevatedRuntimeHint = function () {
  return "".concat(exports.SYSTEM_MARK, " Runtime is direct; sandboxing does not apply.");
};
exports.formatElevatedRuntimeHint = formatElevatedRuntimeHint;
var formatElevatedEvent = function (level) {
  if (level === "full") {
    return "Elevated FULL — exec runs on host with auto-approval.";
  }
  if (level === "ask" || level === "on") {
    return "Elevated ASK — exec runs on host; approvals may still apply.";
  }
  return "Elevated OFF — exec stays in sandbox.";
};
exports.formatElevatedEvent = formatElevatedEvent;
var formatReasoningEvent = function (level) {
  if (level === "stream") {
    return "Reasoning STREAM — emit live <think>.";
  }
  if (level === "on") {
    return "Reasoning ON — include <think>.";
  }
  return "Reasoning OFF — hide <think>.";
};
exports.formatReasoningEvent = formatReasoningEvent;
function formatElevatedUnavailableText(params) {
  var _a;
  var lines = [];
  lines.push(
    "elevated is not available right now (runtime=".concat(
      params.runtimeSandboxed ? "sandboxed" : "direct",
      ").",
    ),
  );
  var failures = (_a = params.failures) !== null && _a !== void 0 ? _a : [];
  if (failures.length > 0) {
    lines.push(
      "Failing gates: ".concat(
        failures
          .map(function (f) {
            return "".concat(f.gate, " (").concat(f.key, ")");
          })
          .join(", "),
      ),
    );
  } else {
    lines.push(
      "Fix-it keys: tools.elevated.enabled, tools.elevated.allowFrom.<provider>, agents.list[].tools.elevated.*",
    );
  }
  if (params.sessionKey) {
    lines.push(
      "See: ".concat(
        (0, command_format_js_1.formatCliCommand)(
          "openclaw sandbox explain --session ".concat(params.sessionKey),
        ),
      ),
    );
  }
  return lines.join("\n");
}
