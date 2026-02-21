"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractExecDirective = void 0;
exports.extractThinkDirective = extractThinkDirective;
exports.extractVerboseDirective = extractVerboseDirective;
exports.extractNoticeDirective = extractNoticeDirective;
exports.extractElevatedDirective = extractElevatedDirective;
exports.extractReasoningDirective = extractReasoningDirective;
exports.extractStatusDirective = extractStatusDirective;
var thinking_js_1 = require("../thinking.js");
var escapeRegExp = function (value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
var matchLevelDirective = function (body, names) {
  var namePattern = names.map(escapeRegExp).join("|");
  var match = body.match(new RegExp("(?:^|\\s)\\/(?:".concat(namePattern, ")(?=$|\\s|:)"), "i"));
  if (!match || match.index === undefined) {
    return null;
  }
  var start = match.index;
  var end = match.index + match[0].length;
  var i = end;
  while (i < body.length && /\s/.test(body[i])) {
    i += 1;
  }
  if (body[i] === ":") {
    i += 1;
    while (i < body.length && /\s/.test(body[i])) {
      i += 1;
    }
  }
  var argStart = i;
  while (i < body.length && /[A-Za-z-]/.test(body[i])) {
    i += 1;
  }
  var rawLevel = i > argStart ? body.slice(argStart, i) : undefined;
  end = i;
  return { start: start, end: end, rawLevel: rawLevel };
};
var extractLevelDirective = function (body, names, normalize) {
  var match = matchLevelDirective(body, names);
  if (!match) {
    return { cleaned: body.trim(), hasDirective: false };
  }
  var rawLevel = match.rawLevel;
  var level = normalize(rawLevel);
  var cleaned = body
    .slice(0, match.start)
    .concat(" ")
    .concat(body.slice(match.end))
    .replace(/\s+/g, " ")
    .trim();
  return {
    cleaned: cleaned,
    level: level,
    rawLevel: rawLevel,
    hasDirective: true,
  };
};
var extractSimpleDirective = function (body, names) {
  var namePattern = names.map(escapeRegExp).join("|");
  var match = body.match(
    new RegExp("(?:^|\\s)\\/(?:".concat(namePattern, ")(?=$|\\s|:)(?:\\s*:\\s*)?"), "i"),
  );
  var cleaned = match ? body.replace(match[0], " ").replace(/\s+/g, " ").trim() : body.trim();
  return {
    cleaned: cleaned,
    hasDirective: Boolean(match),
  };
};
function extractThinkDirective(body) {
  if (!body) {
    return { cleaned: "", hasDirective: false };
  }
  var extracted = extractLevelDirective(
    body,
    ["thinking", "think", "t"],
    thinking_js_1.normalizeThinkLevel,
  );
  return {
    cleaned: extracted.cleaned,
    thinkLevel: extracted.level,
    rawLevel: extracted.rawLevel,
    hasDirective: extracted.hasDirective,
  };
}
function extractVerboseDirective(body) {
  if (!body) {
    return { cleaned: "", hasDirective: false };
  }
  var extracted = extractLevelDirective(
    body,
    ["verbose", "v"],
    thinking_js_1.normalizeVerboseLevel,
  );
  return {
    cleaned: extracted.cleaned,
    verboseLevel: extracted.level,
    rawLevel: extracted.rawLevel,
    hasDirective: extracted.hasDirective,
  };
}
function extractNoticeDirective(body) {
  if (!body) {
    return { cleaned: "", hasDirective: false };
  }
  var extracted = extractLevelDirective(
    body,
    ["notice", "notices"],
    thinking_js_1.normalizeNoticeLevel,
  );
  return {
    cleaned: extracted.cleaned,
    noticeLevel: extracted.level,
    rawLevel: extracted.rawLevel,
    hasDirective: extracted.hasDirective,
  };
}
function extractElevatedDirective(body) {
  if (!body) {
    return { cleaned: "", hasDirective: false };
  }
  var extracted = extractLevelDirective(
    body,
    ["elevated", "elev"],
    thinking_js_1.normalizeElevatedLevel,
  );
  return {
    cleaned: extracted.cleaned,
    elevatedLevel: extracted.level,
    rawLevel: extracted.rawLevel,
    hasDirective: extracted.hasDirective,
  };
}
function extractReasoningDirective(body) {
  if (!body) {
    return { cleaned: "", hasDirective: false };
  }
  var extracted = extractLevelDirective(
    body,
    ["reasoning", "reason"],
    thinking_js_1.normalizeReasoningLevel,
  );
  return {
    cleaned: extracted.cleaned,
    reasoningLevel: extracted.level,
    rawLevel: extracted.rawLevel,
    hasDirective: extracted.hasDirective,
  };
}
function extractStatusDirective(body) {
  if (!body) {
    return { cleaned: "", hasDirective: false };
  }
  return extractSimpleDirective(body, ["status"]);
}
var directive_js_1 = require("./exec/directive.js");
Object.defineProperty(exports, "extractExecDirective", {
  enumerable: true,
  get: function () {
    return directive_js_1.extractExecDirective;
  },
});
