"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.extractModelDirective = extractModelDirective;
function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
function extractModelDirective(body, options) {
  var _a, _b, _c, _d;
  if (!body) {
    return { cleaned: "", hasDirective: false };
  }
  var modelMatch = body.match(
    /(?:^|\s)\/model(?=$|\s|:)\s*:?\s*([A-Za-z0-9_.:@-]+(?:\/[A-Za-z0-9_.:@-]+)*)?/i,
  );
  var aliases = (
    (_a = options === null || options === void 0 ? void 0 : options.aliases) !== null &&
    _a !== void 0
      ? _a
      : []
  )
    .map(function (alias) {
      return alias.trim();
    })
    .filter(Boolean);
  var aliasMatch =
    modelMatch || aliases.length === 0
      ? null
      : body.match(
          new RegExp(
            "(?:^|\\s)\\/(".concat(
              aliases.map(escapeRegExp).join("|"),
              ")(?=$|\\s|:)(?:\\s*:\\s*)?",
            ),
            "i",
          ),
        );
  var match = modelMatch !== null && modelMatch !== void 0 ? modelMatch : aliasMatch;
  var raw = modelMatch
    ? (_b = modelMatch === null || modelMatch === void 0 ? void 0 : modelMatch[1]) === null ||
      _b === void 0
      ? void 0
      : _b.trim()
    : (_c = aliasMatch === null || aliasMatch === void 0 ? void 0 : aliasMatch[1]) === null ||
        _c === void 0
      ? void 0
      : _c.trim();
  var rawModel = raw;
  var rawProfile;
  if (raw === null || raw === void 0 ? void 0 : raw.includes("@")) {
    var parts = raw.split("@");
    rawModel = (_d = parts[0]) === null || _d === void 0 ? void 0 : _d.trim();
    rawProfile = parts.slice(1).join("@").trim() || undefined;
  }
  var cleaned = match ? body.replace(match[0], " ").replace(/\s+/g, " ").trim() : body.trim();
  return {
    cleaned: cleaned,
    rawModel: rawModel,
    rawProfile: rawProfile,
    hasDirective: !!match,
  };
}
