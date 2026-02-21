"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTROL_UI_AVATAR_PREFIX = void 0;
exports.normalizeControlUiBasePath = normalizeControlUiBasePath;
exports.buildControlUiAvatarUrl = buildControlUiAvatarUrl;
exports.resolveAssistantAvatarUrl = resolveAssistantAvatarUrl;
var CONTROL_UI_AVATAR_PREFIX = "/avatar";
exports.CONTROL_UI_AVATAR_PREFIX = CONTROL_UI_AVATAR_PREFIX;
function normalizeControlUiBasePath(basePath) {
  if (!basePath) {
    return "";
  }
  var normalized = basePath.trim();
  if (!normalized) {
    return "";
  }
  if (!normalized.startsWith("/")) {
    normalized = "/".concat(normalized);
  }
  if (normalized === "/") {
    return "";
  }
  if (normalized.endsWith("/")) {
    normalized = normalized.slice(0, -1);
  }
  return normalized;
}
function buildControlUiAvatarUrl(basePath, agentId) {
  return basePath
    ? "".concat(basePath).concat(CONTROL_UI_AVATAR_PREFIX, "/").concat(agentId)
    : "".concat(CONTROL_UI_AVATAR_PREFIX, "/").concat(agentId);
}
function looksLikeLocalAvatarPath(value) {
  if (/[\\/]/.test(value)) {
    return true;
  }
  return /\.(png|jpe?g|gif|webp|svg|ico)$/i.test(value);
}
function resolveAssistantAvatarUrl(params) {
  var _a;
  var avatar = (_a = params.avatar) === null || _a === void 0 ? void 0 : _a.trim();
  if (!avatar) {
    return undefined;
  }
  if (/^https?:\/\//i.test(avatar) || /^data:image\//i.test(avatar)) {
    return avatar;
  }
  var basePath = normalizeControlUiBasePath(params.basePath);
  var baseAvatarPrefix = basePath
    ? "".concat(basePath).concat(CONTROL_UI_AVATAR_PREFIX, "/")
    : "".concat(CONTROL_UI_AVATAR_PREFIX, "/");
  if (basePath && avatar.startsWith("".concat(CONTROL_UI_AVATAR_PREFIX, "/"))) {
    return "".concat(basePath).concat(avatar);
  }
  if (avatar.startsWith(baseAvatarPrefix)) {
    return avatar;
  }
  if (!params.agentId) {
    return avatar;
  }
  if (looksLikeLocalAvatarPath(avatar)) {
    return buildControlUiAvatarUrl(basePath, params.agentId);
  }
  return avatar;
}
