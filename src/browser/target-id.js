"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTargetIdFromTabs = resolveTargetIdFromTabs;
function resolveTargetIdFromTabs(input, tabs) {
  var needle = input.trim();
  if (!needle) {
    return { ok: false, reason: "not_found" };
  }
  var exact = tabs.find(function (t) {
    return t.targetId === needle;
  });
  if (exact) {
    return { ok: true, targetId: exact.targetId };
  }
  var lower = needle.toLowerCase();
  var matches = tabs
    .map(function (t) {
      return t.targetId;
    })
    .filter(function (id) {
      return id.toLowerCase().startsWith(lower);
    });
  var only = matches.length === 1 ? matches[0] : undefined;
  if (only) {
    return { ok: true, targetId: only };
  }
  if (matches.length === 0) {
    return { ok: false, reason: "not_found" };
  }
  return { ok: false, reason: "ambiguous", matches: matches };
}
