"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.attachDiscordGatewayLogging = attachDiscordGatewayLogging;
var globals_js_1 = require("../globals.js");
var INFO_DEBUG_MARKERS = [
  "WebSocket connection closed",
  "Reconnecting with backoff",
  "Attempting resume with backoff",
];
var shouldPromoteGatewayDebug = function (message) {
  return INFO_DEBUG_MARKERS.some(function (marker) {
    return message.includes(marker);
  });
};
var formatGatewayMetrics = function (metrics) {
  if (metrics === null || metrics === undefined) {
    return String(metrics);
  }
  if (typeof metrics === "string") {
    return metrics;
  }
  if (typeof metrics === "number" || typeof metrics === "boolean" || typeof metrics === "bigint") {
    return String(metrics);
  }
  try {
    return JSON.stringify(metrics);
  } catch (_a) {
    return "[unserializable metrics]";
  }
};
function attachDiscordGatewayLogging(params) {
  var emitter = params.emitter,
    runtime = params.runtime;
  if (!emitter) {
    return function () {};
  }
  var onGatewayDebug = function (msg) {
    var _a;
    var message = String(msg);
    (0, globals_js_1.logVerbose)("discord gateway: ".concat(message));
    if (shouldPromoteGatewayDebug(message)) {
      (_a = runtime.log) === null || _a === void 0
        ? void 0
        : _a.call(runtime, "discord gateway: ".concat(message));
    }
  };
  var onGatewayWarning = function (warning) {
    (0, globals_js_1.logVerbose)("discord gateway warning: ".concat(String(warning)));
  };
  var onGatewayMetrics = function (metrics) {
    (0, globals_js_1.logVerbose)("discord gateway metrics: ".concat(formatGatewayMetrics(metrics)));
  };
  emitter.on("debug", onGatewayDebug);
  emitter.on("warning", onGatewayWarning);
  emitter.on("metrics", onGatewayMetrics);
  return function () {
    emitter.removeListener("debug", onGatewayDebug);
    emitter.removeListener("warning", onGatewayWarning);
    emitter.removeListener("metrics", onGatewayMetrics);
  };
}
