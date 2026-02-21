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
exports.getCliSessionId = getCliSessionId;
exports.setCliSessionId = setCliSessionId;
var model_selection_js_1 = require("./model-selection.js");
function getCliSessionId(entry, provider) {
  var _a, _b;
  if (!entry) {
    return undefined;
  }
  var normalized = (0, model_selection_js_1.normalizeProviderId)(provider);
  var fromMap = (_a = entry.cliSessionIds) === null || _a === void 0 ? void 0 : _a[normalized];
  if (fromMap === null || fromMap === void 0 ? void 0 : fromMap.trim()) {
    return fromMap.trim();
  }
  if (normalized === "claude-cli") {
    var legacy = (_b = entry.claudeCliSessionId) === null || _b === void 0 ? void 0 : _b.trim();
    if (legacy) {
      return legacy;
    }
  }
  return undefined;
}
function setCliSessionId(entry, provider, sessionId) {
  var _a;
  var normalized = (0, model_selection_js_1.normalizeProviderId)(provider);
  var trimmed = sessionId.trim();
  if (!trimmed) {
    return;
  }
  var existing = (_a = entry.cliSessionIds) !== null && _a !== void 0 ? _a : {};
  entry.cliSessionIds = __assign({}, existing);
  entry.cliSessionIds[normalized] = trimmed;
  if (normalized === "claude-cli") {
    entry.claudeCliSessionId = trimmed;
  }
}
