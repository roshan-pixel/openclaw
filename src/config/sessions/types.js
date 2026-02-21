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
exports.DEFAULT_IDLE_MINUTES =
  exports.DEFAULT_RESET_TRIGGERS =
  exports.DEFAULT_RESET_TRIGGER =
    void 0;
exports.mergeSessionEntry = mergeSessionEntry;
var node_crypto_1 = require("node:crypto");
function mergeSessionEntry(existing, patch) {
  var _a, _b, _c, _d;
  var sessionId =
    (_b =
      (_a = patch.sessionId) !== null && _a !== void 0
        ? _a
        : existing === null || existing === void 0
          ? void 0
          : existing.sessionId) !== null && _b !== void 0
      ? _b
      : node_crypto_1.default.randomUUID();
  var updatedAt = Math.max(
    (_c = existing === null || existing === void 0 ? void 0 : existing.updatedAt) !== null &&
      _c !== void 0
      ? _c
      : 0,
    (_d = patch.updatedAt) !== null && _d !== void 0 ? _d : 0,
    Date.now(),
  );
  if (!existing) {
    return __assign(__assign({}, patch), { sessionId: sessionId, updatedAt: updatedAt });
  }
  return __assign(__assign(__assign({}, existing), patch), {
    sessionId: sessionId,
    updatedAt: updatedAt,
  });
}
exports.DEFAULT_RESET_TRIGGER = "/new";
exports.DEFAULT_RESET_TRIGGERS = ["/new", "/reset"];
exports.DEFAULT_IDLE_MINUTES = 60;
