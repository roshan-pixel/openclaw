"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_BROWSER_CDP_PORT_RANGE_END =
  exports.DEFAULT_BROWSER_CDP_PORT_RANGE_START =
  exports.DEFAULT_CANVAS_HOST_PORT =
  exports.DEFAULT_BROWSER_CONTROL_PORT =
  exports.DEFAULT_BRIDGE_PORT =
    void 0;
exports.deriveDefaultBridgePort = deriveDefaultBridgePort;
exports.deriveDefaultBrowserControlPort = deriveDefaultBrowserControlPort;
exports.deriveDefaultCanvasHostPort = deriveDefaultCanvasHostPort;
exports.deriveDefaultBrowserCdpPortRange = deriveDefaultBrowserCdpPortRange;
function isValidPort(port) {
  return Number.isFinite(port) && port > 0 && port <= 65535;
}
function clampPort(port, fallback) {
  return isValidPort(port) ? port : fallback;
}
function derivePort(base, offset, fallback) {
  return clampPort(base + offset, fallback);
}
exports.DEFAULT_BRIDGE_PORT = 18790;
exports.DEFAULT_BROWSER_CONTROL_PORT = 18791;
exports.DEFAULT_CANVAS_HOST_PORT = 18793;
exports.DEFAULT_BROWSER_CDP_PORT_RANGE_START = 18800;
exports.DEFAULT_BROWSER_CDP_PORT_RANGE_END = 18899;
function deriveDefaultBridgePort(gatewayPort) {
  return derivePort(gatewayPort, 1, exports.DEFAULT_BRIDGE_PORT);
}
function deriveDefaultBrowserControlPort(gatewayPort) {
  return derivePort(gatewayPort, 2, exports.DEFAULT_BROWSER_CONTROL_PORT);
}
function deriveDefaultCanvasHostPort(gatewayPort) {
  return derivePort(gatewayPort, 4, exports.DEFAULT_CANVAS_HOST_PORT);
}
function deriveDefaultBrowserCdpPortRange(browserControlPort) {
  var start = derivePort(browserControlPort, 9, exports.DEFAULT_BROWSER_CDP_PORT_RANGE_START);
  var end = clampPort(
    start +
      (exports.DEFAULT_BROWSER_CDP_PORT_RANGE_END - exports.DEFAULT_BROWSER_CDP_PORT_RANGE_START),
    exports.DEFAULT_BROWSER_CDP_PORT_RANGE_END,
  );
  if (end < start) {
    return { start: start, end: start };
  }
  return { start: start, end: end };
}
