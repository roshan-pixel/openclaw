"use strict";
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.listGatewayAgentChannelValues =
  exports.listGatewayAgentChannelAliases =
  exports.listGatewayMessageChannels =
  exports.listDeliverableMessageChannels =
  exports.normalizeGatewayClientMode =
  exports.normalizeGatewayClientName =
  exports.GATEWAY_CLIENT_MODES =
  exports.GATEWAY_CLIENT_NAMES =
  exports.INTERNAL_MESSAGE_CHANNEL =
    void 0;
exports.isGatewayCliClient = isGatewayCliClient;
exports.isInternalMessageChannel = isInternalMessageChannel;
exports.isWebchatClient = isWebchatClient;
exports.normalizeMessageChannel = normalizeMessageChannel;
exports.isGatewayMessageChannel = isGatewayMessageChannel;
exports.isDeliverableMessageChannel = isDeliverableMessageChannel;
exports.resolveGatewayMessageChannel = resolveGatewayMessageChannel;
exports.resolveMessageChannel = resolveMessageChannel;
exports.isMarkdownCapableMessageChannel = isMarkdownCapableMessageChannel;
var registry_js_1 = require("../channels/registry.js");
var client_info_js_1 = require("../gateway/protocol/client-info.js");
Object.defineProperty(exports, "GATEWAY_CLIENT_MODES", {
  enumerable: true,
  get: function () {
    return client_info_js_1.GATEWAY_CLIENT_MODES;
  },
});
Object.defineProperty(exports, "GATEWAY_CLIENT_NAMES", {
  enumerable: true,
  get: function () {
    return client_info_js_1.GATEWAY_CLIENT_NAMES;
  },
});
Object.defineProperty(exports, "normalizeGatewayClientMode", {
  enumerable: true,
  get: function () {
    return client_info_js_1.normalizeGatewayClientMode;
  },
});
Object.defineProperty(exports, "normalizeGatewayClientName", {
  enumerable: true,
  get: function () {
    return client_info_js_1.normalizeGatewayClientName;
  },
});
var runtime_js_1 = require("../plugins/runtime.js");
exports.INTERNAL_MESSAGE_CHANNEL = "webchat";
var MARKDOWN_CAPABLE_CHANNELS = new Set([
  "slack",
  "telegram",
  "signal",
  "discord",
  "googlechat",
  "tui",
  exports.INTERNAL_MESSAGE_CHANNEL,
]);
function isGatewayCliClient(client) {
  return (
    (0, client_info_js_1.normalizeGatewayClientMode)(
      client === null || client === void 0 ? void 0 : client.mode,
    ) === client_info_js_1.GATEWAY_CLIENT_MODES.CLI
  );
}
function isInternalMessageChannel(raw) {
  return normalizeMessageChannel(raw) === exports.INTERNAL_MESSAGE_CHANNEL;
}
function isWebchatClient(client) {
  var mode = (0, client_info_js_1.normalizeGatewayClientMode)(
    client === null || client === void 0 ? void 0 : client.mode,
  );
  if (mode === client_info_js_1.GATEWAY_CLIENT_MODES.WEBCHAT) {
    return true;
  }
  return (
    (0, client_info_js_1.normalizeGatewayClientName)(
      client === null || client === void 0 ? void 0 : client.id,
    ) === client_info_js_1.GATEWAY_CLIENT_NAMES.WEBCHAT_UI
  );
}
function normalizeMessageChannel(raw) {
  var _a;
  var normalized = raw === null || raw === void 0 ? void 0 : raw.trim().toLowerCase();
  if (!normalized) {
    return undefined;
  }
  if (normalized === exports.INTERNAL_MESSAGE_CHANNEL) {
    return exports.INTERNAL_MESSAGE_CHANNEL;
  }
  var builtIn = (0, registry_js_1.normalizeChatChannelId)(normalized);
  if (builtIn) {
    return builtIn;
  }
  var registry = (0, runtime_js_1.getActivePluginRegistry)();
  var pluginMatch =
    registry === null || registry === void 0
      ? void 0
      : registry.channels.find(function (entry) {
          var _a;
          if (entry.plugin.id.toLowerCase() === normalized) {
            return true;
          }
          return ((_a = entry.plugin.meta.aliases) !== null && _a !== void 0 ? _a : []).some(
            function (alias) {
              return alias.trim().toLowerCase() === normalized;
            },
          );
        });
  return (_a = pluginMatch === null || pluginMatch === void 0 ? void 0 : pluginMatch.plugin.id) !==
    null && _a !== void 0
    ? _a
    : normalized;
}
var listPluginChannelIds = function () {
  var registry = (0, runtime_js_1.getActivePluginRegistry)();
  if (!registry) {
    return [];
  }
  return registry.channels.map(function (entry) {
    return entry.plugin.id;
  });
};
var listPluginChannelAliases = function () {
  var registry = (0, runtime_js_1.getActivePluginRegistry)();
  if (!registry) {
    return [];
  }
  return registry.channels.flatMap(function (entry) {
    var _a;
    return (_a = entry.plugin.meta.aliases) !== null && _a !== void 0 ? _a : [];
  });
};
var listDeliverableMessageChannels = function () {
  return Array.from(
    new Set(
      __spreadArray(
        __spreadArray([], registry_js_1.CHANNEL_IDS, true),
        listPluginChannelIds(),
        true,
      ),
    ),
  );
};
exports.listDeliverableMessageChannels = listDeliverableMessageChannels;
var listGatewayMessageChannels = function () {
  return __spreadArray(
    __spreadArray([], (0, exports.listDeliverableMessageChannels)(), true),
    [exports.INTERNAL_MESSAGE_CHANNEL],
    false,
  );
};
exports.listGatewayMessageChannels = listGatewayMessageChannels;
var listGatewayAgentChannelAliases = function () {
  return Array.from(
    new Set(
      __spreadArray(
        __spreadArray([], (0, registry_js_1.listChatChannelAliases)(), true),
        listPluginChannelAliases(),
        true,
      ),
    ),
  );
};
exports.listGatewayAgentChannelAliases = listGatewayAgentChannelAliases;
var listGatewayAgentChannelValues = function () {
  return Array.from(
    new Set(
      __spreadArray(
        __spreadArray(
          __spreadArray([], (0, exports.listGatewayMessageChannels)(), true),
          ["last"],
          false,
        ),
        (0, exports.listGatewayAgentChannelAliases)(),
        true,
      ),
    ),
  );
};
exports.listGatewayAgentChannelValues = listGatewayAgentChannelValues;
function isGatewayMessageChannel(value) {
  return (0, exports.listGatewayMessageChannels)().includes(value);
}
function isDeliverableMessageChannel(value) {
  return (0, exports.listDeliverableMessageChannels)().includes(value);
}
function resolveGatewayMessageChannel(raw) {
  var normalized = normalizeMessageChannel(raw);
  if (!normalized) {
    return undefined;
  }
  return isGatewayMessageChannel(normalized) ? normalized : undefined;
}
function resolveMessageChannel(primary, fallback) {
  var _a;
  return (_a = normalizeMessageChannel(primary)) !== null && _a !== void 0
    ? _a
    : normalizeMessageChannel(fallback);
}
function isMarkdownCapableMessageChannel(raw) {
  var channel = normalizeMessageChannel(raw);
  if (!channel) {
    return false;
  }
  return MARKDOWN_CAPABLE_CHANNELS.has(channel);
}
