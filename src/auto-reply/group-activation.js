"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeGroupActivation = normalizeGroupActivation;
exports.parseActivationCommand = parseActivationCommand;
var commands_registry_js_1 = require("./commands-registry.js");
function normalizeGroupActivation(raw) {
  var value = raw === null || raw === void 0 ? void 0 : raw.trim().toLowerCase();
  if (value === "mention") {
    return "mention";
  }
  if (value === "always") {
    return "always";
  }
  return undefined;
}
function parseActivationCommand(raw) {
  if (!raw) {
    return { hasCommand: false };
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    return { hasCommand: false };
  }
  var normalized = (0, commands_registry_js_1.normalizeCommandBody)(trimmed);
  var match = normalized.match(/^\/activation(?:\s+([a-zA-Z]+))?\s*$/i);
  if (!match) {
    return { hasCommand: false };
  }
  var mode = normalizeGroupActivation(match[1]);
  return { hasCommand: true, mode: mode };
}
