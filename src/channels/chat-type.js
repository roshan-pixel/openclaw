"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeChatType = normalizeChatType;
function normalizeChatType(raw) {
  var value = raw === null || raw === void 0 ? void 0 : raw.trim().toLowerCase();
  if (!value) {
    return undefined;
  }
  if (value === "direct" || value === "dm") {
    return "direct";
  }
  if (value === "group") {
    return "group";
  }
  if (value === "channel") {
    return "channel";
  }
  return undefined;
}
