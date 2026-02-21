"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MEDIA_GROUP_TIMEOUT_MS =
  exports.createTelegramUpdateDedupe =
  exports.buildTelegramUpdateKey =
  exports.resolveTelegramUpdateId =
    void 0;
var dedupe_js_1 = require("../infra/dedupe.js");
var MEDIA_GROUP_TIMEOUT_MS = 500;
exports.MEDIA_GROUP_TIMEOUT_MS = MEDIA_GROUP_TIMEOUT_MS;
var RECENT_TELEGRAM_UPDATE_TTL_MS = 5 * 60000;
var RECENT_TELEGRAM_UPDATE_MAX = 2000;
var resolveTelegramUpdateId = function (ctx) {
  var _a, _b;
  return (_b = (_a = ctx.update) === null || _a === void 0 ? void 0 : _a.update_id) !== null &&
    _b !== void 0
    ? _b
    : ctx.update_id;
};
exports.resolveTelegramUpdateId = resolveTelegramUpdateId;
var buildTelegramUpdateKey = function (ctx) {
  var _a, _b, _c, _d, _e, _f, _g, _h;
  var updateId = (0, exports.resolveTelegramUpdateId)(ctx);
  if (typeof updateId === "number") {
    return "update:".concat(updateId);
  }
  var callbackId = (_a = ctx.callbackQuery) === null || _a === void 0 ? void 0 : _a.id;
  if (callbackId) {
    return "callback:".concat(callbackId);
  }
  var msg =
    (_f =
      (_d =
        (_b = ctx.message) !== null && _b !== void 0
          ? _b
          : (_c = ctx.update) === null || _c === void 0
            ? void 0
            : _c.message) !== null && _d !== void 0
        ? _d
        : (_e = ctx.update) === null || _e === void 0
          ? void 0
          : _e.edited_message) !== null && _f !== void 0
      ? _f
      : (_g = ctx.callbackQuery) === null || _g === void 0
        ? void 0
        : _g.message;
  var chatId =
    (_h = msg === null || msg === void 0 ? void 0 : msg.chat) === null || _h === void 0
      ? void 0
      : _h.id;
  var messageId = msg === null || msg === void 0 ? void 0 : msg.message_id;
  if (typeof chatId !== "undefined" && typeof messageId === "number") {
    return "message:".concat(chatId, ":").concat(messageId);
  }
  return undefined;
};
exports.buildTelegramUpdateKey = buildTelegramUpdateKey;
var createTelegramUpdateDedupe = function () {
  return (0, dedupe_js_1.createDedupeCache)({
    ttlMs: RECENT_TELEGRAM_UPDATE_TTL_MS,
    maxSize: RECENT_TELEGRAM_UPDATE_MAX,
  });
};
exports.createTelegramUpdateDedupe = createTelegramUpdateDedupe;
