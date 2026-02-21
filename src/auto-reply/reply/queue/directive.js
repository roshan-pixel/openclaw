"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractQueueDirective = extractQueueDirective;
var parse_duration_js_1 = require("../../../cli/parse-duration.js");
var normalize_js_1 = require("./normalize.js");
function parseQueueDebounce(raw) {
  if (!raw) {
    return undefined;
  }
  try {
    var parsed = (0, parse_duration_js_1.parseDurationMs)(raw.trim(), { defaultUnit: "ms" });
    if (!parsed || parsed < 0) {
      return undefined;
    }
    return Math.round(parsed);
  } catch (_a) {
    return undefined;
  }
}
function parseQueueCap(raw) {
  if (!raw) {
    return undefined;
  }
  var num = Number(raw);
  if (!Number.isFinite(num)) {
    return undefined;
  }
  var cap = Math.floor(num);
  if (cap < 1) {
    return undefined;
  }
  return cap;
}
function parseQueueDirectiveArgs(raw) {
  var _a, _b, _c;
  var i = 0;
  var len = raw.length;
  while (i < len && /\s/.test(raw[i])) {
    i += 1;
  }
  if (raw[i] === ":") {
    i += 1;
    while (i < len && /\s/.test(raw[i])) {
      i += 1;
    }
  }
  var consumed = i;
  var queueMode;
  var queueReset = false;
  var rawMode;
  var debounceMs;
  var cap;
  var dropPolicy;
  var rawDebounce;
  var rawCap;
  var rawDrop;
  var hasOptions = false;
  var takeToken = function () {
    if (i >= len) {
      return null;
    }
    var start = i;
    while (i < len && !/\s/.test(raw[i])) {
      i += 1;
    }
    if (start === i) {
      return null;
    }
    var token = raw.slice(start, i);
    while (i < len && /\s/.test(raw[i])) {
      i += 1;
    }
    return token;
  };
  while (i < len) {
    var token = takeToken();
    if (!token) {
      break;
    }
    var lowered = token.trim().toLowerCase();
    if (lowered === "default" || lowered === "reset" || lowered === "clear") {
      queueReset = true;
      consumed = i;
      break;
    }
    if (lowered.startsWith("debounce:") || lowered.startsWith("debounce=")) {
      rawDebounce = (_a = token.split(/[:=]/)[1]) !== null && _a !== void 0 ? _a : "";
      debounceMs = parseQueueDebounce(rawDebounce);
      hasOptions = true;
      consumed = i;
      continue;
    }
    if (lowered.startsWith("cap:") || lowered.startsWith("cap=")) {
      rawCap = (_b = token.split(/[:=]/)[1]) !== null && _b !== void 0 ? _b : "";
      cap = parseQueueCap(rawCap);
      hasOptions = true;
      consumed = i;
      continue;
    }
    if (lowered.startsWith("drop:") || lowered.startsWith("drop=")) {
      rawDrop = (_c = token.split(/[:=]/)[1]) !== null && _c !== void 0 ? _c : "";
      dropPolicy = (0, normalize_js_1.normalizeQueueDropPolicy)(rawDrop);
      hasOptions = true;
      consumed = i;
      continue;
    }
    var mode = (0, normalize_js_1.normalizeQueueMode)(token);
    if (mode) {
      queueMode = mode;
      rawMode = token;
      consumed = i;
      continue;
    }
    // Stop at first unrecognized token.
    break;
  }
  return {
    consumed: consumed,
    queueMode: queueMode,
    queueReset: queueReset,
    rawMode: rawMode,
    debounceMs: debounceMs,
    cap: cap,
    dropPolicy: dropPolicy,
    rawDebounce: rawDebounce,
    rawCap: rawCap,
    rawDrop: rawDrop,
    hasOptions: hasOptions,
  };
}
function extractQueueDirective(body) {
  if (!body) {
    return {
      cleaned: "",
      hasDirective: false,
      queueReset: false,
      hasOptions: false,
    };
  }
  var re = /(?:^|\s)\/queue(?=$|\s|:)/i;
  var match = re.exec(body);
  if (!match) {
    return {
      cleaned: body.trim(),
      hasDirective: false,
      queueReset: false,
      hasOptions: false,
    };
  }
  var start = match.index + match[0].indexOf("/queue");
  var argsStart = start + "/queue".length;
  var args = body.slice(argsStart);
  var parsed = parseQueueDirectiveArgs(args);
  var cleanedRaw = ""
    .concat(body.slice(0, start), " ")
    .concat(body.slice(argsStart + parsed.consumed));
  var cleaned = cleanedRaw.replace(/\s+/g, " ").trim();
  return {
    cleaned: cleaned,
    queueMode: parsed.queueMode,
    queueReset: parsed.queueReset,
    rawMode: parsed.rawMode,
    debounceMs: parsed.debounceMs,
    cap: parsed.cap,
    dropPolicy: parsed.dropPolicy,
    rawDebounce: parsed.rawDebounce,
    rawCap: parsed.rawCap,
    rawDrop: parsed.rawDrop,
    hasDirective: true,
    hasOptions: parsed.hasOptions,
  };
}
