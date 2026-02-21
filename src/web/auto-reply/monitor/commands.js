"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isStatusCommand = isStatusCommand;
exports.stripMentionsForCommand = stripMentionsForCommand;
function isStatusCommand(body) {
  var trimmed = body.trim().toLowerCase();
  if (!trimmed) {
    return false;
  }
  return trimmed === "/status" || trimmed === "status" || trimmed.startsWith("/status ");
}
function stripMentionsForCommand(text, mentionRegexes, selfE164) {
  var result = text;
  for (var _i = 0, mentionRegexes_1 = mentionRegexes; _i < mentionRegexes_1.length; _i++) {
    var re = mentionRegexes_1[_i];
    result = result.replace(re, " ");
  }
  if (selfE164) {
    // `selfE164` is usually like "+1234"; strip down to digits so we can match "+?1234" safely.
    var digits = selfE164.replace(/\D/g, "");
    if (digits) {
      var pattern = new RegExp("\\+?".concat(digits), "g");
      result = result.replace(pattern, " ");
    }
  }
  return result.replace(/\s+/g, " ").trim();
}
