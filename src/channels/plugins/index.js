"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatAllowlistMatchMeta =
  exports.resolveNestedAllowlistDecision =
  exports.resolveChannelMatchConfig =
  exports.resolveChannelEntryMatchWithFallback =
  exports.resolveChannelEntryMatch =
  exports.normalizeChannelSlug =
  exports.buildChannelKeyCandidates =
  exports.applyChannelMatchMeta =
  exports.listWhatsAppDirectoryPeersFromConfig =
  exports.listWhatsAppDirectoryGroupsFromConfig =
  exports.listTelegramDirectoryPeersFromConfig =
  exports.listTelegramDirectoryGroupsFromConfig =
  exports.listSlackDirectoryPeersFromConfig =
  exports.listSlackDirectoryGroupsFromConfig =
  exports.listDiscordDirectoryPeersFromConfig =
  exports.listDiscordDirectoryGroupsFromConfig =
    void 0;
exports.listChannelPlugins = listChannelPlugins;
exports.getChannelPlugin = getChannelPlugin;
exports.normalizeChannelId = normalizeChannelId;
var registry_js_1 = require("../registry.js");
var runtime_js_1 = require("../../plugins/runtime.js");
// Channel plugins registry (runtime).
//
// This module is intentionally "heavy" (plugins may import channel monitors, web login, etc).
// Shared code paths (reply flow, command auth, sandbox explain) should depend on `src/channels/dock.ts`
// instead, and only call `getChannelPlugin()` at execution boundaries.
//
// Channel plugins are registered by the plugin loader (extensions/ or configured paths).
function listPluginChannels() {
  var registry = (0, runtime_js_1.requireActivePluginRegistry)();
  return registry.channels.map(function (entry) {
    return entry.plugin;
  });
}
function dedupeChannels(channels) {
  var seen = new Set();
  var resolved = [];
  for (var _i = 0, channels_1 = channels; _i < channels_1.length; _i++) {
    var plugin = channels_1[_i];
    var id = String(plugin.id).trim();
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    resolved.push(plugin);
  }
  return resolved;
}
function listChannelPlugins() {
  var combined = dedupeChannels(listPluginChannels());
  return combined.toSorted(function (a, b) {
    var _a, _b;
    var indexA = registry_js_1.CHAT_CHANNEL_ORDER.indexOf(a.id);
    var indexB = registry_js_1.CHAT_CHANNEL_ORDER.indexOf(b.id);
    var orderA = (_a = a.meta.order) !== null && _a !== void 0 ? _a : indexA === -1 ? 999 : indexA;
    var orderB = (_b = b.meta.order) !== null && _b !== void 0 ? _b : indexB === -1 ? 999 : indexB;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return a.id.localeCompare(b.id);
  });
}
function getChannelPlugin(id) {
  var resolvedId = String(id).trim();
  if (!resolvedId) {
    return undefined;
  }
  return listChannelPlugins().find(function (plugin) {
    return plugin.id === resolvedId;
  });
}
function normalizeChannelId(raw) {
  // Channel docking: keep input normalization centralized in src/channels/registry.ts.
  // Plugin registry must be initialized before calling.
  return (0, registry_js_1.normalizeAnyChannelId)(raw);
}
var directory_config_js_1 = require("./directory-config.js");
Object.defineProperty(exports, "listDiscordDirectoryGroupsFromConfig", {
  enumerable: true,
  get: function () {
    return directory_config_js_1.listDiscordDirectoryGroupsFromConfig;
  },
});
Object.defineProperty(exports, "listDiscordDirectoryPeersFromConfig", {
  enumerable: true,
  get: function () {
    return directory_config_js_1.listDiscordDirectoryPeersFromConfig;
  },
});
Object.defineProperty(exports, "listSlackDirectoryGroupsFromConfig", {
  enumerable: true,
  get: function () {
    return directory_config_js_1.listSlackDirectoryGroupsFromConfig;
  },
});
Object.defineProperty(exports, "listSlackDirectoryPeersFromConfig", {
  enumerable: true,
  get: function () {
    return directory_config_js_1.listSlackDirectoryPeersFromConfig;
  },
});
Object.defineProperty(exports, "listTelegramDirectoryGroupsFromConfig", {
  enumerable: true,
  get: function () {
    return directory_config_js_1.listTelegramDirectoryGroupsFromConfig;
  },
});
Object.defineProperty(exports, "listTelegramDirectoryPeersFromConfig", {
  enumerable: true,
  get: function () {
    return directory_config_js_1.listTelegramDirectoryPeersFromConfig;
  },
});
Object.defineProperty(exports, "listWhatsAppDirectoryGroupsFromConfig", {
  enumerable: true,
  get: function () {
    return directory_config_js_1.listWhatsAppDirectoryGroupsFromConfig;
  },
});
Object.defineProperty(exports, "listWhatsAppDirectoryPeersFromConfig", {
  enumerable: true,
  get: function () {
    return directory_config_js_1.listWhatsAppDirectoryPeersFromConfig;
  },
});
var channel_config_js_1 = require("./channel-config.js");
Object.defineProperty(exports, "applyChannelMatchMeta", {
  enumerable: true,
  get: function () {
    return channel_config_js_1.applyChannelMatchMeta;
  },
});
Object.defineProperty(exports, "buildChannelKeyCandidates", {
  enumerable: true,
  get: function () {
    return channel_config_js_1.buildChannelKeyCandidates;
  },
});
Object.defineProperty(exports, "normalizeChannelSlug", {
  enumerable: true,
  get: function () {
    return channel_config_js_1.normalizeChannelSlug;
  },
});
Object.defineProperty(exports, "resolveChannelEntryMatch", {
  enumerable: true,
  get: function () {
    return channel_config_js_1.resolveChannelEntryMatch;
  },
});
Object.defineProperty(exports, "resolveChannelEntryMatchWithFallback", {
  enumerable: true,
  get: function () {
    return channel_config_js_1.resolveChannelEntryMatchWithFallback;
  },
});
Object.defineProperty(exports, "resolveChannelMatchConfig", {
  enumerable: true,
  get: function () {
    return channel_config_js_1.resolveChannelMatchConfig;
  },
});
Object.defineProperty(exports, "resolveNestedAllowlistDecision", {
  enumerable: true,
  get: function () {
    return channel_config_js_1.resolveNestedAllowlistDecision;
  },
});
var allowlist_match_js_1 = require("./allowlist-match.js");
Object.defineProperty(exports, "formatAllowlistMatchMeta", {
  enumerable: true,
  get: function () {
    return allowlist_match_js_1.formatAllowlistMatchMeta;
  },
});
