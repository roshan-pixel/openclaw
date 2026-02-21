"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeToolPrunablePredicate = makeToolPrunablePredicate;
function normalizePatterns(patterns) {
  if (!Array.isArray(patterns)) {
    return [];
  }
  return patterns
    .map(function (p) {
      return String(p !== null && p !== void 0 ? p : "")
        .trim()
        .toLowerCase();
    })
    .filter(Boolean);
}
function compilePattern(pattern) {
  if (pattern === "*") {
    return { kind: "all" };
  }
  if (!pattern.includes("*")) {
    return { kind: "exact", value: pattern };
  }
  var escaped = pattern.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  var re = new RegExp("^".concat(escaped.replaceAll("\\*", ".*"), "$"));
  return { kind: "regex", value: re };
}
function compilePatterns(patterns) {
  return normalizePatterns(patterns).map(compilePattern);
}
function matchesAny(toolName, patterns) {
  for (var _i = 0, patterns_1 = patterns; _i < patterns_1.length; _i++) {
    var p = patterns_1[_i];
    if (p.kind === "all") {
      return true;
    }
    if (p.kind === "exact" && toolName === p.value) {
      return true;
    }
    if (p.kind === "regex" && p.value.test(toolName)) {
      return true;
    }
  }
  return false;
}
function makeToolPrunablePredicate(match) {
  var deny = compilePatterns(match.deny);
  var allow = compilePatterns(match.allow);
  return function (toolName) {
    var normalized = toolName.trim().toLowerCase();
    if (matchesAny(normalized, deny)) {
      return false;
    }
    if (allow.length === 0) {
      return true;
    }
    return matchesAny(normalized, allow);
  };
}
