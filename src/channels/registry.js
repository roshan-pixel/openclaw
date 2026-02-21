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
exports.CHAT_CHANNEL_ALIASES =
  exports.DEFAULT_CHAT_CHANNEL =
  exports.CHANNEL_IDS =
  exports.CHAT_CHANNEL_ORDER =
    void 0;
exports.listChatChannels = listChatChannels;
exports.listChatChannelAliases = listChatChannelAliases;
exports.getChatChannelMeta = getChatChannelMeta;
exports.normalizeChatChannelId = normalizeChatChannelId;
exports.normalizeChannelId = normalizeChannelId;
exports.normalizeAnyChannelId = normalizeAnyChannelId;
exports.formatChannelPrimerLine = formatChannelPrimerLine;
exports.formatChannelSelectionLine = formatChannelSelectionLine;
var runtime_js_1 = require("../plugins/runtime.js");
// Channel docking: add new core channels here (order + meta + aliases), then
// register the plugin in its extension entrypoint and keep protocol IDs in sync.
exports.CHAT_CHANNEL_ORDER = [
  "telegram",
  "whatsapp",
  "discord",
  "googlechat",
  "slack",
  "signal",
  "imessage",
];
exports.CHANNEL_IDS = __spreadArray([], exports.CHAT_CHANNEL_ORDER, true);
exports.DEFAULT_CHAT_CHANNEL = "whatsapp";
var WEBSITE_URL = "https://openclaw.ai";
var CHAT_CHANNEL_META = {
  telegram: {
    id: "telegram",
    label: "Telegram",
    selectionLabel: "Telegram (Bot API)",
    detailLabel: "Telegram Bot",
    docsPath: "/channels/telegram",
    docsLabel: "telegram",
    blurb: "simplest way to get started — register a bot with @BotFather and get going.",
    systemImage: "paperplane",
    selectionDocsPrefix: "",
    selectionDocsOmitLabel: true,
    selectionExtras: [WEBSITE_URL],
  },
  whatsapp: {
    id: "whatsapp",
    label: "WhatsApp",
    selectionLabel: "WhatsApp (QR link)",
    detailLabel: "WhatsApp Web",
    docsPath: "/channels/whatsapp",
    docsLabel: "whatsapp",
    blurb: "works with your own number; recommend a separate phone + eSIM.",
    systemImage: "message",
  },
  discord: {
    id: "discord",
    label: "Discord",
    selectionLabel: "Discord (Bot API)",
    detailLabel: "Discord Bot",
    docsPath: "/channels/discord",
    docsLabel: "discord",
    blurb: "very well supported right now.",
    systemImage: "bubble.left.and.bubble.right",
  },
  googlechat: {
    id: "googlechat",
    label: "Google Chat",
    selectionLabel: "Google Chat (Chat API)",
    detailLabel: "Google Chat",
    docsPath: "/channels/googlechat",
    docsLabel: "googlechat",
    blurb: "Google Workspace Chat app with HTTP webhook.",
    systemImage: "message.badge",
  },
  slack: {
    id: "slack",
    label: "Slack",
    selectionLabel: "Slack (Socket Mode)",
    detailLabel: "Slack Bot",
    docsPath: "/channels/slack",
    docsLabel: "slack",
    blurb: "supported (Socket Mode).",
    systemImage: "number",
  },
  signal: {
    id: "signal",
    label: "Signal",
    selectionLabel: "Signal (signal-cli)",
    detailLabel: "Signal REST",
    docsPath: "/channels/signal",
    docsLabel: "signal",
    blurb: 'signal-cli linked device; more setup (David Reagans: "Hop on Discord.").',
    systemImage: "antenna.radiowaves.left.and.right",
  },
  imessage: {
    id: "imessage",
    label: "iMessage",
    selectionLabel: "iMessage (imsg)",
    detailLabel: "iMessage",
    docsPath: "/channels/imessage",
    docsLabel: "imessage",
    blurb: "this is still a work in progress.",
    systemImage: "message.fill",
  },
};
exports.CHAT_CHANNEL_ALIASES = {
  imsg: "imessage",
  "google-chat": "googlechat",
  gchat: "googlechat",
};
var normalizeChannelKey = function (raw) {
  var normalized = raw === null || raw === void 0 ? void 0 : raw.trim().toLowerCase();
  return normalized || undefined;
};
function listChatChannels() {
  return exports.CHAT_CHANNEL_ORDER.map(function (id) {
    return CHAT_CHANNEL_META[id];
  });
}
function listChatChannelAliases() {
  return Object.keys(exports.CHAT_CHANNEL_ALIASES);
}
function getChatChannelMeta(id) {
  return CHAT_CHANNEL_META[id];
}
function normalizeChatChannelId(raw) {
  var _a;
  var normalized = normalizeChannelKey(raw);
  if (!normalized) {
    return null;
  }
  var resolved =
    (_a = exports.CHAT_CHANNEL_ALIASES[normalized]) !== null && _a !== void 0 ? _a : normalized;
  return exports.CHAT_CHANNEL_ORDER.includes(resolved) ? resolved : null;
}
// Channel docking: prefer this helper in shared code. Importing from
// `src/channels/plugins/*` can eagerly load channel implementations.
function normalizeChannelId(raw) {
  return normalizeChatChannelId(raw);
}
// Normalizes registered channel plugins (bundled or external).
//
// Keep this light: we do not import channel plugins here (those are "heavy" and can pull in
// monitors, web login, etc). The plugin registry must be initialized first.
function normalizeAnyChannelId(raw) {
  var _a;
  var key = normalizeChannelKey(raw);
  if (!key) {
    return null;
  }
  var registry = (0, runtime_js_1.requireActivePluginRegistry)();
  var hit = registry.channels.find(function (entry) {
    var _a, _b;
    var id = String((_a = entry.plugin.id) !== null && _a !== void 0 ? _a : "")
      .trim()
      .toLowerCase();
    if (id && id === key) {
      return true;
    }
    return ((_b = entry.plugin.meta.aliases) !== null && _b !== void 0 ? _b : []).some(
      function (alias) {
        return alias.trim().toLowerCase() === key;
      },
    );
  });
  return (_a = hit === null || hit === void 0 ? void 0 : hit.plugin.id) !== null && _a !== void 0
    ? _a
    : null;
}
function formatChannelPrimerLine(meta) {
  return "".concat(meta.label, ": ").concat(meta.blurb);
}
function formatChannelSelectionLine(meta, docsLink) {
  var _a, _b, _c;
  var docsPrefix = (_a = meta.selectionDocsPrefix) !== null && _a !== void 0 ? _a : "Docs:";
  var docsLabel = (_b = meta.docsLabel) !== null && _b !== void 0 ? _b : meta.id;
  var docs = meta.selectionDocsOmitLabel
    ? docsLink(meta.docsPath)
    : docsLink(meta.docsPath, docsLabel);
  var extras = ((_c = meta.selectionExtras) !== null && _c !== void 0 ? _c : [])
    .filter(Boolean)
    .join(" ");
  return ""
    .concat(meta.label, " \u2014 ")
    .concat(meta.blurb, " ")
    .concat(docsPrefix ? "".concat(docsPrefix, " ") : "")
    .concat(docs)
    .concat(extras ? " ".concat(extras) : "");
}
