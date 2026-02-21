"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveCommandAuthorizedFromAuthorizers = resolveCommandAuthorizedFromAuthorizers;
exports.resolveControlCommandGate = resolveControlCommandGate;
function resolveCommandAuthorizedFromAuthorizers(params) {
  var _a;
  var useAccessGroups = params.useAccessGroups,
    authorizers = params.authorizers;
  var mode = (_a = params.modeWhenAccessGroupsOff) !== null && _a !== void 0 ? _a : "allow";
  if (!useAccessGroups) {
    if (mode === "allow") {
      return true;
    }
    if (mode === "deny") {
      return false;
    }
    var anyConfigured = authorizers.some(function (entry) {
      return entry.configured;
    });
    if (!anyConfigured) {
      return true;
    }
    return authorizers.some(function (entry) {
      return entry.configured && entry.allowed;
    });
  }
  return authorizers.some(function (entry) {
    return entry.configured && entry.allowed;
  });
}
function resolveControlCommandGate(params) {
  var commandAuthorized = resolveCommandAuthorizedFromAuthorizers({
    useAccessGroups: params.useAccessGroups,
    authorizers: params.authorizers,
    modeWhenAccessGroupsOff: params.modeWhenAccessGroupsOff,
  });
  var shouldBlock = params.allowTextCommands && params.hasControlCommand && !commandAuthorized;
  return { commandAuthorized: commandAuthorized, shouldBlock: shouldBlock };
}
