"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GATEWAY_CLIENT_MODES = exports.GATEWAY_CLIENT_NAMES = exports.GATEWAY_CLIENT_IDS = void 0;
exports.normalizeGatewayClientId = normalizeGatewayClientId;
exports.normalizeGatewayClientName = normalizeGatewayClientName;
exports.normalizeGatewayClientMode = normalizeGatewayClientMode;
exports.GATEWAY_CLIENT_IDS = {
  WEBCHAT_UI: "webchat-ui",
  CONTROL_UI: "openclaw-control-ui",
  WEBCHAT: "webchat",
  CLI: "cli",
  GATEWAY_CLIENT: "gateway-client",
  MACOS_APP: "openclaw-macos",
  IOS_APP: "openclaw-ios",
  ANDROID_APP: "openclaw-android",
  NODE_HOST: "node-host",
  TEST: "test",
  FINGERPRINT: "fingerprint",
  PROBE: "openclaw-probe",
};
// Back-compat naming (internal): these values are IDs, not display names.
exports.GATEWAY_CLIENT_NAMES = exports.GATEWAY_CLIENT_IDS;
exports.GATEWAY_CLIENT_MODES = {
  WEBCHAT: "webchat",
  CLI: "cli",
  UI: "ui",
  BACKEND: "backend",
  NODE: "node",
  PROBE: "probe",
  TEST: "test",
};
var GATEWAY_CLIENT_ID_SET = new Set(Object.values(exports.GATEWAY_CLIENT_IDS));
var GATEWAY_CLIENT_MODE_SET = new Set(Object.values(exports.GATEWAY_CLIENT_MODES));
function normalizeGatewayClientId(raw) {
  var normalized = raw === null || raw === void 0 ? void 0 : raw.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }
  return GATEWAY_CLIENT_ID_SET.has(normalized) ? normalized : undefined;
}
function normalizeGatewayClientName(raw) {
  return normalizeGatewayClientId(raw);
}
function normalizeGatewayClientMode(raw) {
  var normalized = raw === null || raw === void 0 ? void 0 : raw.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }
  return GATEWAY_CLIENT_MODE_SET.has(normalized) ? normalized : undefined;
}
