"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractExecDirective = extractExecDirective;
function normalizeExecHost(value) {
  var normalized = value === null || value === void 0 ? void 0 : value.trim().toLowerCase();
  if (normalized === "sandbox" || normalized === "gateway" || normalized === "node") {
    return normalized;
  }
  return undefined;
}
function normalizeExecSecurity(value) {
  var normalized = value === null || value === void 0 ? void 0 : value.trim().toLowerCase();
  if (normalized === "deny" || normalized === "allowlist" || normalized === "full") {
    return normalized;
  }
  return undefined;
}
function normalizeExecAsk(value) {
  var normalized = value === null || value === void 0 ? void 0 : value.trim().toLowerCase();
  if (normalized === "off" || normalized === "on-miss" || normalized === "always") {
    return normalized;
  }
  return undefined;
}
function parseExecDirectiveArgs(raw) {
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
  var execHost;
  var execSecurity;
  var execAsk;
  var execNode;
  var rawExecHost;
  var rawExecSecurity;
  var rawExecAsk;
  var rawExecNode;
  var hasExecOptions = false;
  var invalidHost = false;
  var invalidSecurity = false;
  var invalidAsk = false;
  var invalidNode = false;
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
  var splitToken = function (token) {
    var eq = token.indexOf("=");
    var colon = token.indexOf(":");
    var idx = eq === -1 ? colon : colon === -1 ? eq : Math.min(eq, colon);
    if (idx === -1) {
      return null;
    }
    var key = token.slice(0, idx).trim().toLowerCase();
    var value = token.slice(idx + 1).trim();
    if (!key) {
      return null;
    }
    return { key: key, value: value };
  };
  while (i < len) {
    var token = takeToken();
    if (!token) {
      break;
    }
    var parsed = splitToken(token);
    if (!parsed) {
      break;
    }
    var key = parsed.key,
      value = parsed.value;
    if (key === "host") {
      rawExecHost = value;
      execHost = normalizeExecHost(value);
      if (!execHost) {
        invalidHost = true;
      }
      hasExecOptions = true;
      consumed = i;
      continue;
    }
    if (key === "security") {
      rawExecSecurity = value;
      execSecurity = normalizeExecSecurity(value);
      if (!execSecurity) {
        invalidSecurity = true;
      }
      hasExecOptions = true;
      consumed = i;
      continue;
    }
    if (key === "ask") {
      rawExecAsk = value;
      execAsk = normalizeExecAsk(value);
      if (!execAsk) {
        invalidAsk = true;
      }
      hasExecOptions = true;
      consumed = i;
      continue;
    }
    if (key === "node") {
      rawExecNode = value;
      var trimmed = value.trim();
      if (!trimmed) {
        invalidNode = true;
      } else {
        execNode = trimmed;
      }
      hasExecOptions = true;
      consumed = i;
      continue;
    }
    break;
  }
  return {
    consumed: consumed,
    execHost: execHost,
    execSecurity: execSecurity,
    execAsk: execAsk,
    execNode: execNode,
    rawExecHost: rawExecHost,
    rawExecSecurity: rawExecSecurity,
    rawExecAsk: rawExecAsk,
    rawExecNode: rawExecNode,
    hasExecOptions: hasExecOptions,
    invalidHost: invalidHost,
    invalidSecurity: invalidSecurity,
    invalidAsk: invalidAsk,
    invalidNode: invalidNode,
  };
}
function extractExecDirective(body) {
  if (!body) {
    return {
      cleaned: "",
      hasDirective: false,
      hasExecOptions: false,
      invalidHost: false,
      invalidSecurity: false,
      invalidAsk: false,
      invalidNode: false,
    };
  }
  var re = /(?:^|\s)\/exec(?=$|\s|:)/i;
  var match = re.exec(body);
  if (!match) {
    return {
      cleaned: body.trim(),
      hasDirective: false,
      hasExecOptions: false,
      invalidHost: false,
      invalidSecurity: false,
      invalidAsk: false,
      invalidNode: false,
    };
  }
  var start = match.index + match[0].indexOf("/exec");
  var argsStart = start + "/exec".length;
  var parsed = parseExecDirectiveArgs(body.slice(argsStart));
  var cleanedRaw = ""
    .concat(body.slice(0, start), " ")
    .concat(body.slice(argsStart + parsed.consumed));
  var cleaned = cleanedRaw.replace(/\s+/g, " ").trim();
  return {
    cleaned: cleaned,
    hasDirective: true,
    execHost: parsed.execHost,
    execSecurity: parsed.execSecurity,
    execAsk: parsed.execAsk,
    execNode: parsed.execNode,
    rawExecHost: parsed.rawExecHost,
    rawExecSecurity: parsed.rawExecSecurity,
    rawExecAsk: parsed.rawExecAsk,
    rawExecNode: parsed.rawExecNode,
    hasExecOptions: parsed.hasExecOptions,
    invalidHost: parsed.invalidHost,
    invalidSecurity: parsed.invalidSecurity,
    invalidAsk: parsed.invalidAsk,
    invalidNode: parsed.invalidNode,
  };
}
