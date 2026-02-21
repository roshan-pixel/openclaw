"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSlackSlug = normalizeSlackSlug;
exports.normalizeAllowList = normalizeAllowList;
exports.normalizeAllowListLower = normalizeAllowListLower;
exports.resolveSlackAllowListMatch = resolveSlackAllowListMatch;
exports.allowListMatches = allowListMatches;
exports.resolveSlackUserAllowed = resolveSlackUserAllowed;
function normalizeSlackSlug(raw) {
  var _a;
  var trimmed =
    (_a = raw === null || raw === void 0 ? void 0 : raw.trim().toLowerCase()) !== null &&
    _a !== void 0
      ? _a
      : "";
  if (!trimmed) {
    return "";
  }
  var dashed = trimmed.replace(/\s+/g, "-");
  var cleaned = dashed.replace(/[^a-z0-9#@._+-]+/g, "-");
  return cleaned.replace(/-{2,}/g, "-").replace(/^[-.]+|[-.]+$/g, "");
}
function normalizeAllowList(list) {
  return (list !== null && list !== void 0 ? list : [])
    .map(function (entry) {
      return String(entry).trim();
    })
    .filter(Boolean);
}
function normalizeAllowListLower(list) {
  return normalizeAllowList(list).map(function (entry) {
    return entry.toLowerCase();
  });
}
function resolveSlackAllowListMatch(params) {
  var _a, _b;
  var allowList = params.allowList;
  if (allowList.length === 0) {
    return { allowed: false };
  }
  if (allowList.includes("*")) {
    return { allowed: true, matchKey: "*", matchSource: "wildcard" };
  }
  var id = (_a = params.id) === null || _a === void 0 ? void 0 : _a.toLowerCase();
  var name = (_b = params.name) === null || _b === void 0 ? void 0 : _b.toLowerCase();
  var slug = normalizeSlackSlug(name);
  var candidates = [
    { value: id, source: "id" },
    { value: id ? "slack:".concat(id) : undefined, source: "prefixed-id" },
    { value: id ? "user:".concat(id) : undefined, source: "prefixed-user" },
    { value: name, source: "name" },
    { value: name ? "slack:".concat(name) : undefined, source: "prefixed-name" },
    { value: slug, source: "slug" },
  ];
  for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
    var candidate = candidates_1[_i];
    if (!candidate.value) {
      continue;
    }
    if (allowList.includes(candidate.value)) {
      return {
        allowed: true,
        matchKey: candidate.value,
        matchSource: candidate.source,
      };
    }
  }
  return { allowed: false };
}
function allowListMatches(params) {
  return resolveSlackAllowListMatch(params).allowed;
}
function resolveSlackUserAllowed(params) {
  var allowList = normalizeAllowListLower(params.allowList);
  if (allowList.length === 0) {
    return true;
  }
  return allowListMatches({
    allowList: allowList,
    id: params.userId,
    name: params.userName,
  });
}
