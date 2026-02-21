"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeSendPolicyOverride = normalizeSendPolicyOverride;
exports.parseSendPolicyCommand = parseSendPolicyCommand;
var commands_registry_js_1 = require("./commands-registry.js");
function normalizeSendPolicyOverride(raw) {
  var value = raw === null || raw === void 0 ? void 0 : raw.trim().toLowerCase();
  if (!value) {
    return undefined;
  }
  if (value === "allow" || value === "on") {
    return "allow";
  }
  if (value === "deny" || value === "off") {
    return "deny";
  }
  return undefined;
}
function parseSendPolicyCommand(raw) {
  var _a;
  if (!raw) {
    return { hasCommand: false };
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    return { hasCommand: false };
  }
  var normalized = (0, commands_registry_js_1.normalizeCommandBody)(trimmed);
  var match = normalized.match(/^\/send(?:\s+([a-zA-Z]+))?\s*$/i);
  if (!match) {
    return { hasCommand: false };
  }
  var token = (_a = match[1]) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
  if (!token) {
    return { hasCommand: true };
  }
  if (token === "inherit" || token === "default" || token === "reset") {
    return { hasCommand: true, mode: "inherit" };
  }
  var mode = normalizeSendPolicyOverride(token);
  return { hasCommand: true, mode: mode };
}
