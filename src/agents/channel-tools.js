"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__testing = void 0;
exports.listChannelSupportedActions = listChannelSupportedActions;
exports.listAllChannelSupportedActions = listAllChannelSupportedActions;
exports.listChannelAgentTools = listChannelAgentTools;
exports.resolveChannelMessageToolHints = resolveChannelMessageToolHints;
var dock_js_1 = require("../channels/dock.js");
var index_js_1 = require("../channels/plugins/index.js");
var registry_js_1 = require("../channels/registry.js");
var runtime_js_1 = require("../runtime.js");
/**
 * Get the list of supported message actions for a specific channel.
 * Returns an empty array if channel is not found or has no actions configured.
 */
function listChannelSupportedActions(params) {
  var _a, _b;
  if (!params.channel) {
    return [];
  }
  var plugin = (0, index_js_1.getChannelPlugin)(params.channel);
  if (
    !((_a = plugin === null || plugin === void 0 ? void 0 : plugin.actions) === null ||
    _a === void 0
      ? void 0
      : _a.listActions)
  ) {
    return [];
  }
  var cfg = (_b = params.cfg) !== null && _b !== void 0 ? _b : {};
  return runPluginListActions(plugin, cfg);
}
/**
 * Get the list of all supported message actions across all configured channels.
 */
function listAllChannelSupportedActions(params) {
  var _a, _b;
  var actions = new Set();
  for (var _i = 0, _c = (0, index_js_1.listChannelPlugins)(); _i < _c.length; _i++) {
    var plugin = _c[_i];
    if (!((_a = plugin.actions) === null || _a === void 0 ? void 0 : _a.listActions)) {
      continue;
    }
    var cfg = (_b = params.cfg) !== null && _b !== void 0 ? _b : {};
    var channelActions = runPluginListActions(plugin, cfg);
    for (var _d = 0, channelActions_1 = channelActions; _d < channelActions_1.length; _d++) {
      var action = channelActions_1[_d];
      actions.add(action);
    }
  }
  return Array.from(actions);
}
function listChannelAgentTools(params) {
  // Channel docking: aggregate channel-owned tools (login, etc.).
  var tools = [];
  for (var _i = 0, _a = (0, index_js_1.listChannelPlugins)(); _i < _a.length; _i++) {
    var plugin = _a[_i];
    var entry = plugin.agentTools;
    if (!entry) {
      continue;
    }
    var resolved = typeof entry === "function" ? entry(params) : entry;
    if (Array.isArray(resolved)) {
      tools.push.apply(tools, resolved);
    }
  }
  return tools;
}
function resolveChannelMessageToolHints(params) {
  var _a, _b, _c;
  var channelId = (0, registry_js_1.normalizeAnyChannelId)(params.channel);
  if (!channelId) {
    return [];
  }
  var dock = (0, dock_js_1.getChannelDock)(channelId);
  var resolve =
    (_a = dock === null || dock === void 0 ? void 0 : dock.agentPrompt) === null || _a === void 0
      ? void 0
      : _a.messageToolHints;
  if (!resolve) {
    return [];
  }
  var cfg = (_b = params.cfg) !== null && _b !== void 0 ? _b : {};
  return (
    (_c = resolve({ cfg: cfg, accountId: params.accountId })) !== null && _c !== void 0 ? _c : []
  )
    .map(function (entry) {
      return entry.trim();
    })
    .filter(Boolean);
}
var loggedListActionErrors = new Set();
function runPluginListActions(plugin, cfg) {
  var _a;
  if (!((_a = plugin.actions) === null || _a === void 0 ? void 0 : _a.listActions)) {
    return [];
  }
  try {
    var listed = plugin.actions.listActions({ cfg: cfg });
    return Array.isArray(listed) ? listed : [];
  } catch (err) {
    logListActionsError(plugin.id, err);
    return [];
  }
}
function logListActionsError(pluginId, err) {
  var _a;
  var message = err instanceof Error ? err.message : String(err);
  var key = "".concat(pluginId, ":").concat(message);
  if (loggedListActionErrors.has(key)) {
    return;
  }
  loggedListActionErrors.add(key);
  var stack = err instanceof Error && err.stack ? err.stack : null;
  var details = stack !== null && stack !== void 0 ? stack : message;
  (_a = runtime_js_1.defaultRuntime.error) === null || _a === void 0
    ? void 0
    : _a.call(
        runtime_js_1.defaultRuntime,
        "[channel-tools] ".concat(pluginId, ".actions.listActions failed: ").concat(details),
      );
}
exports.__testing = {
  resetLoggedListActionErrors: function () {
    loggedListActionErrors.clear();
  },
};
