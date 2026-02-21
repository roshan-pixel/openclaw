"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEGACY_GATEWAY_WINDOWS_TASK_NAMES =
  exports.LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES =
  exports.LEGACY_GATEWAY_LAUNCH_AGENT_LABELS =
  exports.NODE_WINDOWS_TASK_SCRIPT_NAME =
  exports.NODE_SERVICE_KIND =
  exports.NODE_SERVICE_MARKER =
  exports.NODE_WINDOWS_TASK_NAME =
  exports.NODE_SYSTEMD_SERVICE_NAME =
  exports.NODE_LAUNCH_AGENT_LABEL =
  exports.GATEWAY_SERVICE_KIND =
  exports.GATEWAY_SERVICE_MARKER =
  exports.GATEWAY_WINDOWS_TASK_NAME =
  exports.GATEWAY_SYSTEMD_SERVICE_NAME =
  exports.GATEWAY_LAUNCH_AGENT_LABEL =
    void 0;
exports.normalizeGatewayProfile = normalizeGatewayProfile;
exports.resolveGatewayProfileSuffix = resolveGatewayProfileSuffix;
exports.resolveGatewayLaunchAgentLabel = resolveGatewayLaunchAgentLabel;
exports.resolveLegacyGatewayLaunchAgentLabels = resolveLegacyGatewayLaunchAgentLabels;
exports.resolveGatewaySystemdServiceName = resolveGatewaySystemdServiceName;
exports.resolveGatewayWindowsTaskName = resolveGatewayWindowsTaskName;
exports.formatGatewayServiceDescription = formatGatewayServiceDescription;
exports.resolveNodeLaunchAgentLabel = resolveNodeLaunchAgentLabel;
exports.resolveNodeSystemdServiceName = resolveNodeSystemdServiceName;
exports.resolveNodeWindowsTaskName = resolveNodeWindowsTaskName;
exports.formatNodeServiceDescription = formatNodeServiceDescription;
// Default service labels (canonical + legacy compatibility)
exports.GATEWAY_LAUNCH_AGENT_LABEL = "ai.openclaw.gateway";
exports.GATEWAY_SYSTEMD_SERVICE_NAME = "openclaw-gateway";
exports.GATEWAY_WINDOWS_TASK_NAME = "OpenClaw Gateway";
exports.GATEWAY_SERVICE_MARKER = "openclaw";
exports.GATEWAY_SERVICE_KIND = "gateway";
exports.NODE_LAUNCH_AGENT_LABEL = "ai.openclaw.node";
exports.NODE_SYSTEMD_SERVICE_NAME = "openclaw-node";
exports.NODE_WINDOWS_TASK_NAME = "OpenClaw Node";
exports.NODE_SERVICE_MARKER = "openclaw";
exports.NODE_SERVICE_KIND = "node";
exports.NODE_WINDOWS_TASK_SCRIPT_NAME = "node.cmd";
exports.LEGACY_GATEWAY_LAUNCH_AGENT_LABELS = [];
exports.LEGACY_GATEWAY_SYSTEMD_SERVICE_NAMES = [];
exports.LEGACY_GATEWAY_WINDOWS_TASK_NAMES = [];
function normalizeGatewayProfile(profile) {
  var trimmed = profile === null || profile === void 0 ? void 0 : profile.trim();
  if (!trimmed || trimmed.toLowerCase() === "default") {
    return null;
  }
  return trimmed;
}
function resolveGatewayProfileSuffix(profile) {
  var normalized = normalizeGatewayProfile(profile);
  return normalized ? "-".concat(normalized) : "";
}
function resolveGatewayLaunchAgentLabel(profile) {
  var normalized = normalizeGatewayProfile(profile);
  if (!normalized) {
    return exports.GATEWAY_LAUNCH_AGENT_LABEL;
  }
  return "ai.openclaw.".concat(normalized);
}
function resolveLegacyGatewayLaunchAgentLabels(profile) {
  void profile;
  return [];
}
function resolveGatewaySystemdServiceName(profile) {
  var suffix = resolveGatewayProfileSuffix(profile);
  if (!suffix) {
    return exports.GATEWAY_SYSTEMD_SERVICE_NAME;
  }
  return "openclaw-gateway".concat(suffix);
}
function resolveGatewayWindowsTaskName(profile) {
  var normalized = normalizeGatewayProfile(profile);
  if (!normalized) {
    return exports.GATEWAY_WINDOWS_TASK_NAME;
  }
  return "OpenClaw Gateway (".concat(normalized, ")");
}
function formatGatewayServiceDescription(params) {
  var _a;
  var profile = normalizeGatewayProfile(
    params === null || params === void 0 ? void 0 : params.profile,
  );
  var version =
    (_a = params === null || params === void 0 ? void 0 : params.version) === null || _a === void 0
      ? void 0
      : _a.trim();
  var parts = [];
  if (profile) {
    parts.push("profile: ".concat(profile));
  }
  if (version) {
    parts.push("v".concat(version));
  }
  if (parts.length === 0) {
    return "OpenClaw Gateway";
  }
  return "OpenClaw Gateway (".concat(parts.join(", "), ")");
}
function resolveNodeLaunchAgentLabel() {
  return exports.NODE_LAUNCH_AGENT_LABEL;
}
function resolveNodeSystemdServiceName() {
  return exports.NODE_SYSTEMD_SERVICE_NAME;
}
function resolveNodeWindowsTaskName() {
  return exports.NODE_WINDOWS_TASK_NAME;
}
function formatNodeServiceDescription(params) {
  var _a;
  var version =
    (_a = params === null || params === void 0 ? void 0 : params.version) === null || _a === void 0
      ? void 0
      : _a.trim();
  if (!version) {
    return "OpenClaw Node Host";
  }
  return "OpenClaw Node Host (v".concat(version, ")");
}
