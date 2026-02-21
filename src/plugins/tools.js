"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPluginToolMeta = getPluginToolMeta;
exports.resolvePluginTools = resolvePluginTools;
var tool_policy_js_1 = require("../agents/tool-policy.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var loader_js_1 = require("./loader.js");
var log = (0, subsystem_js_1.createSubsystemLogger)("plugins");
var pluginToolMeta = new WeakMap();
function getPluginToolMeta(tool) {
  return pluginToolMeta.get(tool);
}
function normalizeAllowlist(list) {
  return new Set(
    (list !== null && list !== void 0 ? list : [])
      .map(tool_policy_js_1.normalizeToolName)
      .filter(Boolean),
  );
}
function isOptionalToolAllowed(params) {
  if (params.allowlist.size === 0) {
    return false;
  }
  var toolName = (0, tool_policy_js_1.normalizeToolName)(params.toolName);
  if (params.allowlist.has(toolName)) {
    return true;
  }
  var pluginKey = (0, tool_policy_js_1.normalizeToolName)(params.pluginId);
  if (params.allowlist.has(pluginKey)) {
    return true;
  }
  return params.allowlist.has("group:plugins");
}
function resolvePluginTools(params) {
  var _a;
  var registry = (0, loader_js_1.loadOpenClawPlugins)({
    config: params.context.config,
    workspaceDir: params.context.workspaceDir,
    logger: {
      info: function (msg) {
        return log.info(msg);
      },
      warn: function (msg) {
        return log.warn(msg);
      },
      error: function (msg) {
        return log.error(msg);
      },
      debug: function (msg) {
        return log.debug(msg);
      },
    },
  });
  var tools = [];
  var existing = (_a = params.existingToolNames) !== null && _a !== void 0 ? _a : new Set();
  var existingNormalized = new Set(
    Array.from(existing, function (tool) {
      return (0, tool_policy_js_1.normalizeToolName)(tool);
    }),
  );
  var allowlist = normalizeAllowlist(params.toolAllowlist);
  var blockedPlugins = new Set();
  var _loop_1 = function (entry) {
    if (blockedPlugins.has(entry.pluginId)) {
      return "continue";
    }
    var pluginIdKey = (0, tool_policy_js_1.normalizeToolName)(entry.pluginId);
    if (existingNormalized.has(pluginIdKey)) {
      var message = "plugin id conflicts with core tool name (".concat(entry.pluginId, ")");
      log.error(message);
      registry.diagnostics.push({
        level: "error",
        pluginId: entry.pluginId,
        source: entry.source,
        message: message,
      });
      blockedPlugins.add(entry.pluginId);
      return "continue";
    }
    var resolved = null;
    try {
      resolved = entry.factory(params.context);
    } catch (err) {
      log.error("plugin tool failed (".concat(entry.pluginId, "): ").concat(String(err)));
      return "continue";
    }
    if (!resolved) {
      return "continue";
    }
    var listRaw = Array.isArray(resolved) ? resolved : [resolved];
    var list = entry.optional
      ? listRaw.filter(function (tool) {
          return isOptionalToolAllowed({
            toolName: tool.name,
            pluginId: entry.pluginId,
            allowlist: allowlist,
          });
        })
      : listRaw;
    if (list.length === 0) {
      return "continue";
    }
    var nameSet = new Set();
    for (var _c = 0, list_1 = list; _c < list_1.length; _c++) {
      var tool = list_1[_c];
      if (nameSet.has(tool.name) || existing.has(tool.name)) {
        var message = "plugin tool name conflict (".concat(entry.pluginId, "): ").concat(tool.name);
        log.error(message);
        registry.diagnostics.push({
          level: "error",
          pluginId: entry.pluginId,
          source: entry.source,
          message: message,
        });
        continue;
      }
      nameSet.add(tool.name);
      existing.add(tool.name);
      pluginToolMeta.set(tool, {
        pluginId: entry.pluginId,
        optional: entry.optional,
      });
      tools.push(tool);
    }
  };
  for (var _i = 0, _b = registry.tools; _i < _b.length; _i++) {
    var entry = _b[_i];
    _loop_1(entry);
  }
  return tools;
}
