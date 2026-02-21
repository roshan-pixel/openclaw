"use strict";
/**
 * CDP port allocation for browser profiles.
 *
 * Default port range: 18800-18899 (100 profiles max)
 * Ports are allocated once at profile creation and persisted in config.
 * Multi-instance: callers may pass an explicit range to avoid collisions.
 *
 * Reserved ports (do not use for CDP):
 *   18789 - Gateway WebSocket
 *   18790 - Bridge
 *   18791 - Browser control server
 *   18792-18799 - Reserved for future one-off services (canvas at 18793)
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.PROFILE_COLORS =
  exports.PROFILE_NAME_REGEX =
  exports.CDP_PORT_RANGE_END =
  exports.CDP_PORT_RANGE_START =
    void 0;
exports.isValidProfileName = isValidProfileName;
exports.allocateCdpPort = allocateCdpPort;
exports.getUsedPorts = getUsedPorts;
exports.allocateColor = allocateColor;
exports.getUsedColors = getUsedColors;
exports.CDP_PORT_RANGE_START = 18800;
exports.CDP_PORT_RANGE_END = 18899;
exports.PROFILE_NAME_REGEX = /^[a-z0-9][a-z0-9-]*$/;
function isValidProfileName(name) {
  if (!name || name.length > 64) {
    return false;
  }
  return exports.PROFILE_NAME_REGEX.test(name);
}
function allocateCdpPort(usedPorts, range) {
  var _a, _b;
  var start =
    (_a = range === null || range === void 0 ? void 0 : range.start) !== null && _a !== void 0
      ? _a
      : exports.CDP_PORT_RANGE_START;
  var end =
    (_b = range === null || range === void 0 ? void 0 : range.end) !== null && _b !== void 0
      ? _b
      : exports.CDP_PORT_RANGE_END;
  if (!Number.isFinite(start) || !Number.isFinite(end) || start <= 0 || end <= 0) {
    return null;
  }
  if (start > end) {
    return null;
  }
  for (var port = start; port <= end; port++) {
    if (!usedPorts.has(port)) {
      return port;
    }
  }
  return null;
}
function getUsedPorts(profiles) {
  var _a;
  if (!profiles) {
    return new Set();
  }
  var used = new Set();
  for (var _i = 0, _b = Object.values(profiles); _i < _b.length; _i++) {
    var profile = _b[_i];
    if (typeof profile.cdpPort === "number") {
      used.add(profile.cdpPort);
      continue;
    }
    var rawUrl = (_a = profile.cdpUrl) === null || _a === void 0 ? void 0 : _a.trim();
    if (!rawUrl) {
      continue;
    }
    try {
      var parsed = new URL(rawUrl);
      var port =
        parsed.port && Number.parseInt(parsed.port, 10) > 0
          ? Number.parseInt(parsed.port, 10)
          : parsed.protocol === "https:"
            ? 443
            : 80;
      if (!Number.isNaN(port) && port > 0 && port <= 65535) {
        used.add(port);
      }
    } catch (_c) {
      // ignore invalid URLs
    }
  }
  return used;
}
exports.PROFILE_COLORS = [
  "#FF4500", // Orange-red (openclaw default)
  "#0066CC", // Blue
  "#00AA00", // Green
  "#9933FF", // Purple
  "#FF6699", // Pink
  "#00CCCC", // Cyan
  "#FF9900", // Orange
  "#6666FF", // Indigo
  "#CC3366", // Magenta
  "#339966", // Teal
];
function allocateColor(usedColors) {
  var _a;
  // Find first unused color from palette
  for (var _i = 0, PROFILE_COLORS_1 = exports.PROFILE_COLORS; _i < PROFILE_COLORS_1.length; _i++) {
    var color = PROFILE_COLORS_1[_i];
    if (!usedColors.has(color.toUpperCase())) {
      return color;
    }
  }
  // All colors used, cycle based on count
  var index = usedColors.size % exports.PROFILE_COLORS.length;
  // biome-ignore lint/style/noNonNullAssertion: Array is non-empty constant
  return (_a = exports.PROFILE_COLORS[index]) !== null && _a !== void 0
    ? _a
    : exports.PROFILE_COLORS[0];
}
function getUsedColors(profiles) {
  if (!profiles) {
    return new Set();
  }
  return new Set(
    Object.values(profiles).map(function (p) {
      return p.color.toUpperCase();
    }),
  );
}
