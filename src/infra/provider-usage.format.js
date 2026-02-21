"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatUsageWindowSummary = formatUsageWindowSummary;
exports.formatUsageSummaryLine = formatUsageSummaryLine;
exports.formatUsageReportLines = formatUsageReportLines;
var provider_usage_shared_js_1 = require("./provider-usage.shared.js");
function formatResetRemaining(targetMs, now) {
  if (!targetMs) {
    return null;
  }
  var base = now !== null && now !== void 0 ? now : Date.now();
  var diffMs = targetMs - base;
  if (diffMs <= 0) {
    return "now";
  }
  var diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 60) {
    return "".concat(diffMins, "m");
  }
  var hours = Math.floor(diffMins / 60);
  var mins = diffMins % 60;
  if (hours < 24) {
    return mins > 0 ? "".concat(hours, "h ").concat(mins, "m") : "".concat(hours, "h");
  }
  var days = Math.floor(hours / 24);
  if (days < 7) {
    return "".concat(days, "d ").concat(hours % 24, "h");
  }
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
  }).format(new Date(targetMs));
}
function pickPrimaryWindow(windows) {
  if (windows.length === 0) {
    return undefined;
  }
  return windows.reduce(function (best, next) {
    return next.usedPercent > best.usedPercent ? next : best;
  });
}
function formatWindowShort(window, now) {
  var remaining = (0, provider_usage_shared_js_1.clampPercent)(100 - window.usedPercent);
  var reset = formatResetRemaining(window.resetAt, now);
  var resetSuffix = reset ? " \u23F1".concat(reset) : "";
  return "".concat(remaining.toFixed(0), "% left (").concat(window.label).concat(resetSuffix, ")");
}
function formatUsageWindowSummary(snapshot, opts) {
  var _a, _b;
  if (snapshot.error) {
    return null;
  }
  if (snapshot.windows.length === 0) {
    return null;
  }
  var now =
    (_a = opts === null || opts === void 0 ? void 0 : opts.now) !== null && _a !== void 0
      ? _a
      : Date.now();
  var maxWindows =
    typeof (opts === null || opts === void 0 ? void 0 : opts.maxWindows) === "number" &&
    opts.maxWindows > 0
      ? Math.min(opts.maxWindows, snapshot.windows.length)
      : snapshot.windows.length;
  var includeResets =
    (_b = opts === null || opts === void 0 ? void 0 : opts.includeResets) !== null && _b !== void 0
      ? _b
      : false;
  var windows = snapshot.windows.slice(0, maxWindows);
  var parts = windows.map(function (window) {
    var remaining = (0, provider_usage_shared_js_1.clampPercent)(100 - window.usedPercent);
    var reset = includeResets ? formatResetRemaining(window.resetAt, now) : null;
    var resetSuffix = reset ? " \u23F1".concat(reset) : "";
    return "".concat(window.label, " ").concat(remaining.toFixed(0), "% left").concat(resetSuffix);
  });
  return parts.join(" · ");
}
function formatUsageSummaryLine(summary, opts) {
  var _a;
  var providers = summary.providers
    .filter(function (entry) {
      return entry.windows.length > 0 && !entry.error;
    })
    .slice(
      0,
      (_a = opts === null || opts === void 0 ? void 0 : opts.maxProviders) !== null && _a !== void 0
        ? _a
        : summary.providers.length,
    );
  if (providers.length === 0) {
    return null;
  }
  var parts = providers
    .map(function (entry) {
      var window = pickPrimaryWindow(entry.windows);
      if (!window) {
        return null;
      }
      return ""
        .concat(entry.displayName, " ")
        .concat(formatWindowShort(window, opts === null || opts === void 0 ? void 0 : opts.now));
    })
    .filter(Boolean);
  if (parts.length === 0) {
    return null;
  }
  return "\uD83D\uDCCA Usage: ".concat(parts.join(" · "));
}
function formatUsageReportLines(summary, opts) {
  if (summary.providers.length === 0) {
    return ["Usage: no provider usage available."];
  }
  var lines = ["Usage:"];
  for (var _i = 0, _a = summary.providers; _i < _a.length; _i++) {
    var entry = _a[_i];
    var planSuffix = entry.plan ? " (".concat(entry.plan, ")") : "";
    if (entry.error) {
      lines.push("  ".concat(entry.displayName).concat(planSuffix, ": ").concat(entry.error));
      continue;
    }
    if (entry.windows.length === 0) {
      lines.push("  ".concat(entry.displayName).concat(planSuffix, ": no data"));
      continue;
    }
    lines.push("  ".concat(entry.displayName).concat(planSuffix));
    for (var _b = 0, _c = entry.windows; _b < _c.length; _b++) {
      var window_1 = _c[_b];
      var remaining = (0, provider_usage_shared_js_1.clampPercent)(100 - window_1.usedPercent);
      var reset = formatResetRemaining(
        window_1.resetAt,
        opts === null || opts === void 0 ? void 0 : opts.now,
      );
      var resetSuffix = reset ? " \u00B7 resets ".concat(reset) : "";
      lines.push(
        "    "
          .concat(window_1.label, ": ")
          .concat(remaining.toFixed(0), "% left")
          .concat(resetSuffix),
      );
    }
  }
  return lines;
}
