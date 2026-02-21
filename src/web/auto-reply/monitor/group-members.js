"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteGroupMember = noteGroupMember;
exports.formatGroupMembers = formatGroupMembers;
var utils_js_1 = require("../../../utils.js");
function noteGroupMember(groupMemberNames, conversationId, e164, name) {
  if (!e164 || !name) {
    return;
  }
  var normalized = (0, utils_js_1.normalizeE164)(e164);
  var key = normalized !== null && normalized !== void 0 ? normalized : e164;
  if (!key) {
    return;
  }
  var roster = groupMemberNames.get(conversationId);
  if (!roster) {
    roster = new Map();
    groupMemberNames.set(conversationId, roster);
  }
  roster.set(key, name);
}
function formatGroupMembers(params) {
  var _a, _b, _c;
  var participants = params.participants,
    roster = params.roster,
    fallbackE164 = params.fallbackE164;
  var seen = new Set();
  var ordered = [];
  if (participants === null || participants === void 0 ? void 0 : participants.length) {
    for (var _i = 0, participants_1 = participants; _i < participants_1.length; _i++) {
      var entry = participants_1[_i];
      if (!entry) {
        continue;
      }
      var normalized =
        (_a = (0, utils_js_1.normalizeE164)(entry)) !== null && _a !== void 0 ? _a : entry;
      if (!normalized || seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      ordered.push(normalized);
    }
  }
  if (roster) {
    for (var _d = 0, _e = roster.keys(); _d < _e.length; _d++) {
      var entry = _e[_d];
      var normalized =
        (_b = (0, utils_js_1.normalizeE164)(entry)) !== null && _b !== void 0 ? _b : entry;
      if (!normalized || seen.has(normalized)) {
        continue;
      }
      seen.add(normalized);
      ordered.push(normalized);
    }
  }
  if (ordered.length === 0 && fallbackE164) {
    var normalized =
      (_c = (0, utils_js_1.normalizeE164)(fallbackE164)) !== null && _c !== void 0
        ? _c
        : fallbackE164;
    if (normalized) {
      ordered.push(normalized);
    }
  }
  if (ordered.length === 0) {
    return undefined;
  }
  return ordered
    .map(function (entry) {
      var name = roster === null || roster === void 0 ? void 0 : roster.get(entry);
      return name ? "".concat(name, " (").concat(entry, ")") : entry;
    })
    .join(", ");
}
