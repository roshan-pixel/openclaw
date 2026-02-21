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
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLocationText = formatLocationText;
exports.toLocationContext = toLocationContext;
function resolveLocation(location) {
  var _a, _b;
  var source =
    (_a = location.source) !== null && _a !== void 0
      ? _a
      : location.isLive
        ? "live"
        : location.name || location.address
          ? "place"
          : "pin";
  var isLive = Boolean((_b = location.isLive) !== null && _b !== void 0 ? _b : source === "live");
  return __assign(__assign({}, location), { source: source, isLive: isLive });
}
function formatAccuracy(accuracy) {
  if (!Number.isFinite(accuracy)) {
    return "";
  }
  return " \u00B1".concat(Math.round(accuracy !== null && accuracy !== void 0 ? accuracy : 0), "m");
}
function formatCoords(latitude, longitude) {
  return "".concat(latitude.toFixed(6), ", ").concat(longitude.toFixed(6));
}
function formatLocationText(location) {
  var _a;
  var resolved = resolveLocation(location);
  var coords = formatCoords(resolved.latitude, resolved.longitude);
  var accuracy = formatAccuracy(resolved.accuracy);
  var caption = (_a = resolved.caption) === null || _a === void 0 ? void 0 : _a.trim();
  var header = "";
  if (resolved.source === "live" || resolved.isLive) {
    header = "\uD83D\uDEF0 Live location: ".concat(coords).concat(accuracy);
  } else if (resolved.name || resolved.address) {
    var label = [resolved.name, resolved.address].filter(Boolean).join(" — ");
    header = "\uD83D\uDCCD ".concat(label, " (").concat(coords).concat(accuracy, ")");
  } else {
    header = "\uD83D\uDCCD ".concat(coords).concat(accuracy);
  }
  return caption ? "".concat(header, "\n").concat(caption) : header;
}
function toLocationContext(location) {
  var resolved = resolveLocation(location);
  return {
    LocationLat: resolved.latitude,
    LocationLon: resolved.longitude,
    LocationAccuracy: resolved.accuracy,
    LocationName: resolved.name,
    LocationAddress: resolved.address,
    LocationSource: resolved.source,
    LocationIsLive: resolved.isLive,
  };
}
