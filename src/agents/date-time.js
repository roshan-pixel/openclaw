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
exports.resolveUserTimezone = resolveUserTimezone;
exports.resolveUserTimeFormat = resolveUserTimeFormat;
exports.normalizeTimestamp = normalizeTimestamp;
exports.withNormalizedTimestamp = withNormalizedTimestamp;
exports.formatUserTime = formatUserTime;
var node_child_process_1 = require("node:child_process");
var cachedTimeFormat;
function resolveUserTimezone(configured) {
  var trimmed = configured === null || configured === void 0 ? void 0 : configured.trim();
  if (trimmed) {
    try {
      new Intl.DateTimeFormat("en-US", { timeZone: trimmed }).format(new Date());
      return trimmed;
    } catch (_a) {
      // ignore invalid timezone
    }
  }
  var host = Intl.DateTimeFormat().resolvedOptions().timeZone;
  return (host === null || host === void 0 ? void 0 : host.trim()) || "UTC";
}
function resolveUserTimeFormat(preference) {
  if (preference === "12" || preference === "24") {
    return preference;
  }
  if (cachedTimeFormat) {
    return cachedTimeFormat;
  }
  cachedTimeFormat = detectSystemTimeFormat() ? "24" : "12";
  return cachedTimeFormat;
}
function normalizeTimestamp(raw) {
  if (raw == null) {
    return undefined;
  }
  var timestampMs;
  if (raw instanceof Date) {
    timestampMs = raw.getTime();
  } else if (typeof raw === "number" && Number.isFinite(raw)) {
    timestampMs = raw < 1000000000000 ? Math.round(raw * 1000) : Math.round(raw);
  } else if (typeof raw === "string") {
    var trimmed = raw.trim();
    if (!trimmed) {
      return undefined;
    }
    if (/^\d+(\.\d+)?$/.test(trimmed)) {
      var num = Number(trimmed);
      if (Number.isFinite(num)) {
        if (trimmed.includes(".")) {
          timestampMs = Math.round(num * 1000);
        } else if (trimmed.length >= 13) {
          timestampMs = Math.round(num);
        } else {
          timestampMs = Math.round(num * 1000);
        }
      }
    } else {
      var parsed = Date.parse(trimmed);
      if (!Number.isNaN(parsed)) {
        timestampMs = parsed;
      }
    }
  }
  if (timestampMs === undefined || !Number.isFinite(timestampMs)) {
    return undefined;
  }
  return { timestampMs: timestampMs, timestampUtc: new Date(timestampMs).toISOString() };
}
function withNormalizedTimestamp(value, rawTimestamp) {
  var normalized = normalizeTimestamp(rawTimestamp);
  if (!normalized) {
    return value;
  }
  return __assign(__assign({}, value), {
    timestampMs:
      typeof value.timestampMs === "number" && Number.isFinite(value.timestampMs)
        ? value.timestampMs
        : normalized.timestampMs,
    timestampUtc:
      typeof value.timestampUtc === "string" && value.timestampUtc.trim()
        ? value.timestampUtc
        : normalized.timestampUtc,
  });
}
function detectSystemTimeFormat() {
  if (process.platform === "darwin") {
    try {
      var result = (0, node_child_process_1.execSync)(
        "defaults read -g AppleICUForce24HourTime 2>/dev/null",
        {
          encoding: "utf8",
          timeout: 500,
        },
      ).trim();
      if (result === "1") {
        return true;
      }
      if (result === "0") {
        return false;
      }
    } catch (_a) {
      // Not set, fall through
    }
  }
  if (process.platform === "win32") {
    try {
      var result = (0, node_child_process_1.execSync)(
        'powershell -Command "(Get-Culture).DateTimeFormat.ShortTimePattern"',
        { encoding: "utf8", timeout: 1000 },
      ).trim();
      if (result.startsWith("H")) {
        return true;
      }
      if (result.startsWith("h")) {
        return false;
      }
    } catch (_b) {
      // Fall through
    }
  }
  try {
    var sample = new Date(2000, 0, 1, 13, 0);
    var formatted = new Intl.DateTimeFormat(undefined, { hour: "numeric" }).format(sample);
    return formatted.includes("13");
  } catch (_c) {
    return false;
  }
}
function ordinalSuffix(day) {
  if (day >= 11 && day <= 13) {
    return "th";
  }
  switch (day % 10) {
    case 1:
      return "st";
    case 2:
      return "nd";
    case 3:
      return "rd";
    default:
      return "th";
  }
}
function formatUserTime(date, timeZone, format) {
  var _a;
  var use24Hour = format === "24";
  try {
    var parts = new Intl.DateTimeFormat("en-US", {
      timeZone: timeZone,
      weekday: "long",
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: use24Hour ? "2-digit" : "numeric",
      minute: "2-digit",
      hourCycle: use24Hour ? "h23" : "h12",
    }).formatToParts(date);
    var map = {};
    for (var _i = 0, parts_1 = parts; _i < parts_1.length; _i++) {
      var part = parts_1[_i];
      if (part.type !== "literal") {
        map[part.type] = part.value;
      }
    }
    if (!map.weekday || !map.year || !map.month || !map.day || !map.hour || !map.minute) {
      return undefined;
    }
    var dayNum = parseInt(map.day, 10);
    var suffix = ordinalSuffix(dayNum);
    var timePart = use24Hour
      ? "".concat(map.hour, ":").concat(map.minute)
      : ""
          .concat(map.hour, ":")
          .concat(map.minute, " ")
          .concat((_a = map.dayPeriod) !== null && _a !== void 0 ? _a : "")
          .trim();
    return ""
      .concat(map.weekday, ", ")
      .concat(map.month, " ")
      .concat(dayNum)
      .concat(suffix, ", ")
      .concat(map.year, " \u2014 ")
      .concat(timePart);
  } catch (_b) {
    return undefined;
  }
}
