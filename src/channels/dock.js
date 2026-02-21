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
exports.listChannelDocks = listChannelDocks;
exports.getChannelDock = getChannelDock;
var accounts_js_1 = require("../discord/accounts.js");
var accounts_js_2 = require("../imessage/accounts.js");
var accounts_js_3 = require("../signal/accounts.js");
var accounts_js_4 = require("../slack/accounts.js");
var threading_tool_context_js_1 = require("../slack/threading-tool-context.js");
var accounts_js_5 = require("../telegram/accounts.js");
var session_key_js_1 = require("../routing/session-key.js");
var utils_js_1 = require("../utils.js");
var accounts_js_6 = require("../web/accounts.js");
var normalize_js_1 = require("../whatsapp/normalize.js");
var runtime_js_1 = require("../plugins/runtime.js");
var group_mentions_js_1 = require("./plugins/group-mentions.js");
var registry_js_1 = require("./registry.js");
var formatLower = function (allowFrom) {
  return allowFrom
    .map(function (entry) {
      return String(entry).trim();
    })
    .filter(Boolean)
    .map(function (entry) {
      return entry.toLowerCase();
    });
};
var escapeRegExp = function (value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
};
// Channel docks: lightweight channel metadata/behavior for shared code paths.
//
// Rules:
// - keep this module *light* (no monitors, probes, puppeteer/web login, etc)
// - OK: config readers, allowFrom formatting, mention stripping patterns, threading defaults
// - shared code should import from here (and from `src/channels/registry.ts`), not from the plugins registry
//
// Adding a channel:
// - add a new entry to `DOCKS`
// - keep it cheap; push heavy logic into `src/channels/plugins/<id>.ts` or channel modules
var DOCKS = {
  telegram: {
    id: "telegram",
    capabilities: {
      chatTypes: ["direct", "group", "channel", "thread"],
      nativeCommands: true,
      blockStreaming: true,
    },
    outbound: { textChunkLimit: 4000 },
    config: {
      resolveAllowFrom: function (_a) {
        var _b;
        var cfg = _a.cfg,
          accountId = _a.accountId;
        return (
          (_b = (0, accounts_js_5.resolveTelegramAccount)({ cfg: cfg, accountId: accountId }).config
            .allowFrom) !== null && _b !== void 0
            ? _b
            : []
        ).map(function (entry) {
          return String(entry);
        });
      },
      formatAllowFrom: function (_a) {
        var allowFrom = _a.allowFrom;
        return allowFrom
          .map(function (entry) {
            return String(entry).trim();
          })
          .filter(Boolean)
          .map(function (entry) {
            return entry.replace(/^(telegram|tg):/i, "");
          })
          .map(function (entry) {
            return entry.toLowerCase();
          });
      },
    },
    groups: {
      resolveRequireMention: group_mentions_js_1.resolveTelegramGroupRequireMention,
      resolveToolPolicy: group_mentions_js_1.resolveTelegramGroupToolPolicy,
    },
    threading: {
      resolveReplyToMode: function (_a) {
        var _b, _c, _d;
        var cfg = _a.cfg;
        return (_d =
          (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.telegram) === null ||
          _c === void 0
            ? void 0
            : _c.replyToMode) !== null && _d !== void 0
          ? _d
          : "first";
      },
      buildToolContext: function (_a) {
        var _b, _c;
        var context = _a.context,
          hasRepliedRef = _a.hasRepliedRef;
        var threadId =
          (_b = context.MessageThreadId) !== null && _b !== void 0 ? _b : context.ReplyToId;
        return {
          currentChannelId:
            ((_c = context.To) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
          currentThreadTs: threadId != null ? String(threadId) : undefined,
          hasRepliedRef: hasRepliedRef,
        };
      },
    },
  },
  whatsapp: {
    id: "whatsapp",
    capabilities: {
      chatTypes: ["direct", "group"],
      polls: true,
      reactions: true,
      media: true,
    },
    commands: {
      enforceOwnerForCommands: true,
      skipWhenConfigEmpty: true,
    },
    outbound: { textChunkLimit: 4000 },
    config: {
      resolveAllowFrom: function (_a) {
        var _b;
        var cfg = _a.cfg,
          accountId = _a.accountId;
        return (_b = (0, accounts_js_6.resolveWhatsAppAccount)({
          cfg: cfg,
          accountId: accountId,
        }).allowFrom) !== null && _b !== void 0
          ? _b
          : [];
      },
      formatAllowFrom: function (_a) {
        var allowFrom = _a.allowFrom;
        return allowFrom
          .map(function (entry) {
            return String(entry).trim();
          })
          .filter(function (entry) {
            return Boolean(entry);
          })
          .map(function (entry) {
            return entry === "*" ? entry : (0, normalize_js_1.normalizeWhatsAppTarget)(entry);
          })
          .filter(function (entry) {
            return Boolean(entry);
          });
      },
    },
    groups: {
      resolveRequireMention: group_mentions_js_1.resolveWhatsAppGroupRequireMention,
      resolveToolPolicy: group_mentions_js_1.resolveWhatsAppGroupToolPolicy,
      resolveGroupIntroHint: function () {
        return "WhatsApp IDs: SenderId is the participant JID; [message_id: ...] is the message id for reactions (use SenderId as participant).";
      },
    },
    mentions: {
      stripPatterns: function (_a) {
        var _b;
        var ctx = _a.ctx;
        var selfE164 = ((_b = ctx.To) !== null && _b !== void 0 ? _b : "").replace(
          /^whatsapp:/,
          "",
        );
        if (!selfE164) {
          return [];
        }
        var escaped = escapeRegExp(selfE164);
        return [escaped, "@".concat(escaped)];
      },
    },
    threading: {
      buildToolContext: function (_a) {
        var _b, _c;
        var context = _a.context,
          hasRepliedRef = _a.hasRepliedRef;
        var channelId =
          ((_b = context.From) === null || _b === void 0 ? void 0 : _b.trim()) ||
          ((_c = context.To) === null || _c === void 0 ? void 0 : _c.trim()) ||
          undefined;
        return {
          currentChannelId: channelId,
          currentThreadTs: context.ReplyToId,
          hasRepliedRef: hasRepliedRef,
        };
      },
    },
  },
  discord: {
    id: "discord",
    capabilities: {
      chatTypes: ["direct", "channel", "thread"],
      polls: true,
      reactions: true,
      media: true,
      nativeCommands: true,
      threads: true,
    },
    outbound: { textChunkLimit: 2000 },
    streaming: {
      blockStreamingCoalesceDefaults: { minChars: 1500, idleMs: 1000 },
    },
    elevated: {
      allowFromFallback: function (_a) {
        var _b, _c, _d;
        var cfg = _a.cfg;
        return (_d =
          (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.discord) === null ||
          _c === void 0
            ? void 0
            : _c.dm) === null || _d === void 0
          ? void 0
          : _d.allowFrom;
      },
    },
    config: {
      resolveAllowFrom: function (_a) {
        var _b, _c;
        var cfg = _a.cfg,
          accountId = _a.accountId;
        return (
          (_c =
            (_b = (0, accounts_js_1.resolveDiscordAccount)({ cfg: cfg, accountId: accountId })
              .config.dm) === null || _b === void 0
              ? void 0
              : _b.allowFrom) !== null && _c !== void 0
            ? _c
            : []
        ).map(function (entry) {
          return String(entry);
        });
      },
      formatAllowFrom: function (_a) {
        var allowFrom = _a.allowFrom;
        return formatLower(allowFrom);
      },
    },
    groups: {
      resolveRequireMention: group_mentions_js_1.resolveDiscordGroupRequireMention,
      resolveToolPolicy: group_mentions_js_1.resolveDiscordGroupToolPolicy,
    },
    mentions: {
      stripPatterns: function () {
        return ["<@!?\\d+>"];
      },
    },
    threading: {
      resolveReplyToMode: function (_a) {
        var _b, _c, _d;
        var cfg = _a.cfg;
        return (_d =
          (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.discord) === null ||
          _c === void 0
            ? void 0
            : _c.replyToMode) !== null && _d !== void 0
          ? _d
          : "off";
      },
      buildToolContext: function (_a) {
        var _b;
        var context = _a.context,
          hasRepliedRef = _a.hasRepliedRef;
        return {
          currentChannelId:
            ((_b = context.To) === null || _b === void 0 ? void 0 : _b.trim()) || undefined,
          currentThreadTs: context.ReplyToId,
          hasRepliedRef: hasRepliedRef,
        };
      },
    },
  },
  googlechat: {
    id: "googlechat",
    capabilities: {
      chatTypes: ["direct", "group", "thread"],
      reactions: true,
      media: true,
      threads: true,
      blockStreaming: true,
    },
    outbound: { textChunkLimit: 4000 },
    config: {
      resolveAllowFrom: function (_a) {
        var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l;
        var cfg = _a.cfg,
          accountId = _a.accountId;
        var channel = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.googlechat;
        var normalized = (0, session_key_js_1.normalizeAccountId)(accountId);
        var account =
          (_d =
            (_c = channel === null || channel === void 0 ? void 0 : channel.accounts) === null ||
            _c === void 0
              ? void 0
              : _c[normalized]) !== null && _d !== void 0
            ? _d
            : (_e = channel === null || channel === void 0 ? void 0 : channel.accounts) === null ||
                _e === void 0
              ? void 0
              : _e[
                  (_g = Object.keys(
                    (_f = channel === null || channel === void 0 ? void 0 : channel.accounts) !==
                      null && _f !== void 0
                      ? _f
                      : {},
                  ).find(function (key) {
                    return key.toLowerCase() === normalized.toLowerCase();
                  })) !== null && _g !== void 0
                    ? _g
                    : ""
                ];
        return (
          (_l =
            (_j =
              (_h = account === null || account === void 0 ? void 0 : account.dm) === null ||
              _h === void 0
                ? void 0
                : _h.allowFrom) !== null && _j !== void 0
              ? _j
              : (_k = channel === null || channel === void 0 ? void 0 : channel.dm) === null ||
                  _k === void 0
                ? void 0
                : _k.allowFrom) !== null && _l !== void 0
            ? _l
            : []
        ).map(function (entry) {
          return String(entry);
        });
      },
      formatAllowFrom: function (_a) {
        var allowFrom = _a.allowFrom;
        return allowFrom
          .map(function (entry) {
            return String(entry).trim();
          })
          .filter(Boolean)
          .map(function (entry) {
            return entry
              .replace(/^(googlechat|google-chat|gchat):/i, "")
              .replace(/^user:/i, "")
              .replace(/^users\//i, "")
              .toLowerCase();
          });
      },
    },
    groups: {
      resolveRequireMention: group_mentions_js_1.resolveGoogleChatGroupRequireMention,
      resolveToolPolicy: group_mentions_js_1.resolveGoogleChatGroupToolPolicy,
    },
    threading: {
      resolveReplyToMode: function (_a) {
        var _b, _c, _d;
        var cfg = _a.cfg;
        return (_d =
          (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.googlechat) === null ||
          _c === void 0
            ? void 0
            : _c.replyToMode) !== null && _d !== void 0
          ? _d
          : "off";
      },
      buildToolContext: function (_a) {
        var _b, _c;
        var context = _a.context,
          hasRepliedRef = _a.hasRepliedRef;
        var threadId =
          (_b = context.MessageThreadId) !== null && _b !== void 0 ? _b : context.ReplyToId;
        return {
          currentChannelId:
            ((_c = context.To) === null || _c === void 0 ? void 0 : _c.trim()) || undefined,
          currentThreadTs: threadId != null ? String(threadId) : undefined,
          hasRepliedRef: hasRepliedRef,
        };
      },
    },
  },
  slack: {
    id: "slack",
    capabilities: {
      chatTypes: ["direct", "channel", "thread"],
      reactions: true,
      media: true,
      nativeCommands: true,
      threads: true,
    },
    outbound: { textChunkLimit: 4000 },
    streaming: {
      blockStreamingCoalesceDefaults: { minChars: 1500, idleMs: 1000 },
    },
    config: {
      resolveAllowFrom: function (_a) {
        var _b, _c;
        var cfg = _a.cfg,
          accountId = _a.accountId;
        return (
          (_c =
            (_b = (0, accounts_js_4.resolveSlackAccount)({ cfg: cfg, accountId: accountId }).dm) ===
              null || _b === void 0
              ? void 0
              : _b.allowFrom) !== null && _c !== void 0
            ? _c
            : []
        ).map(function (entry) {
          return String(entry);
        });
      },
      formatAllowFrom: function (_a) {
        var allowFrom = _a.allowFrom;
        return formatLower(allowFrom);
      },
    },
    groups: {
      resolveRequireMention: group_mentions_js_1.resolveSlackGroupRequireMention,
      resolveToolPolicy: group_mentions_js_1.resolveSlackGroupToolPolicy,
    },
    threading: {
      resolveReplyToMode: function (_a) {
        var cfg = _a.cfg,
          accountId = _a.accountId,
          chatType = _a.chatType;
        return (0, accounts_js_4.resolveSlackReplyToMode)(
          (0, accounts_js_4.resolveSlackAccount)({ cfg: cfg, accountId: accountId }),
          chatType,
        );
      },
      allowTagsWhenOff: true,
      buildToolContext: function (params) {
        return (0, threading_tool_context_js_1.buildSlackThreadingToolContext)(params);
      },
    },
  },
  signal: {
    id: "signal",
    capabilities: {
      chatTypes: ["direct", "group"],
      reactions: true,
      media: true,
    },
    outbound: { textChunkLimit: 4000 },
    streaming: {
      blockStreamingCoalesceDefaults: { minChars: 1500, idleMs: 1000 },
    },
    config: {
      resolveAllowFrom: function (_a) {
        var _b;
        var cfg = _a.cfg,
          accountId = _a.accountId;
        return (
          (_b = (0, accounts_js_3.resolveSignalAccount)({ cfg: cfg, accountId: accountId }).config
            .allowFrom) !== null && _b !== void 0
            ? _b
            : []
        ).map(function (entry) {
          return String(entry);
        });
      },
      formatAllowFrom: function (_a) {
        var allowFrom = _a.allowFrom;
        return allowFrom
          .map(function (entry) {
            return String(entry).trim();
          })
          .filter(Boolean)
          .map(function (entry) {
            return entry === "*"
              ? "*"
              : (0, utils_js_1.normalizeE164)(entry.replace(/^signal:/i, ""));
          })
          .filter(Boolean);
      },
    },
    threading: {
      buildToolContext: function (_a) {
        var _b, _c, _d;
        var context = _a.context,
          hasRepliedRef = _a.hasRepliedRef;
        var isDirect =
          ((_b = context.ChatType) === null || _b === void 0 ? void 0 : _b.toLowerCase()) ===
          "direct";
        var channelId =
          ((_d = isDirect
            ? (_c = context.From) !== null && _c !== void 0
              ? _c
              : context.To
            : context.To) === null || _d === void 0
            ? void 0
            : _d.trim()) || undefined;
        return {
          currentChannelId: channelId,
          currentThreadTs: context.ReplyToId,
          hasRepliedRef: hasRepliedRef,
        };
      },
    },
  },
  imessage: {
    id: "imessage",
    capabilities: {
      chatTypes: ["direct", "group"],
      reactions: true,
      media: true,
    },
    outbound: { textChunkLimit: 4000 },
    config: {
      resolveAllowFrom: function (_a) {
        var _b;
        var cfg = _a.cfg,
          accountId = _a.accountId;
        return (
          (_b = (0, accounts_js_2.resolveIMessageAccount)({ cfg: cfg, accountId: accountId }).config
            .allowFrom) !== null && _b !== void 0
            ? _b
            : []
        ).map(function (entry) {
          return String(entry);
        });
      },
      formatAllowFrom: function (_a) {
        var allowFrom = _a.allowFrom;
        return allowFrom
          .map(function (entry) {
            return String(entry).trim();
          })
          .filter(Boolean);
      },
    },
    groups: {
      resolveRequireMention: group_mentions_js_1.resolveIMessageGroupRequireMention,
      resolveToolPolicy: group_mentions_js_1.resolveIMessageGroupToolPolicy,
    },
    threading: {
      buildToolContext: function (_a) {
        var _b, _c, _d;
        var context = _a.context,
          hasRepliedRef = _a.hasRepliedRef;
        var isDirect =
          ((_b = context.ChatType) === null || _b === void 0 ? void 0 : _b.toLowerCase()) ===
          "direct";
        var channelId =
          ((_d = isDirect
            ? (_c = context.From) !== null && _c !== void 0
              ? _c
              : context.To
            : context.To) === null || _d === void 0
            ? void 0
            : _d.trim()) || undefined;
        return {
          currentChannelId: channelId,
          currentThreadTs: context.ReplyToId,
          hasRepliedRef: hasRepliedRef,
        };
      },
    },
  },
};
function buildDockFromPlugin(plugin) {
  var _a;
  return {
    id: plugin.id,
    capabilities: plugin.capabilities,
    commands: plugin.commands,
    outbound: ((_a = plugin.outbound) === null || _a === void 0 ? void 0 : _a.textChunkLimit)
      ? { textChunkLimit: plugin.outbound.textChunkLimit }
      : undefined,
    streaming: plugin.streaming
      ? { blockStreamingCoalesceDefaults: plugin.streaming.blockStreamingCoalesceDefaults }
      : undefined,
    elevated: plugin.elevated,
    config: plugin.config
      ? {
          resolveAllowFrom: plugin.config.resolveAllowFrom,
          formatAllowFrom: plugin.config.formatAllowFrom,
        }
      : undefined,
    groups: plugin.groups,
    mentions: plugin.mentions,
    threading: plugin.threading,
    agentPrompt: plugin.agentPrompt,
  };
}
function listPluginDockEntries() {
  var _a;
  var registry = (0, runtime_js_1.requireActivePluginRegistry)();
  var entries = [];
  var seen = new Set();
  for (var _i = 0, _b = registry.channels; _i < _b.length; _i++) {
    var entry = _b[_i];
    var plugin = entry.plugin;
    var id = String(plugin.id).trim();
    if (!id || seen.has(id)) {
      continue;
    }
    seen.add(id);
    if (registry_js_1.CHAT_CHANNEL_ORDER.includes(plugin.id)) {
      continue;
    }
    var dock = (_a = entry.dock) !== null && _a !== void 0 ? _a : buildDockFromPlugin(plugin);
    entries.push({ id: plugin.id, dock: dock, order: plugin.meta.order });
  }
  return entries;
}
function listChannelDocks() {
  var baseEntries = registry_js_1.CHAT_CHANNEL_ORDER.map(function (id) {
    return {
      id: id,
      dock: DOCKS[id],
      order: (0, registry_js_1.getChatChannelMeta)(id).order,
    };
  });
  var pluginEntries = listPluginDockEntries();
  var combined = __spreadArray(__spreadArray([], baseEntries, true), pluginEntries, true);
  combined.sort(function (a, b) {
    var _a, _b;
    var indexA = registry_js_1.CHAT_CHANNEL_ORDER.indexOf(a.id);
    var indexB = registry_js_1.CHAT_CHANNEL_ORDER.indexOf(b.id);
    var orderA = (_a = a.order) !== null && _a !== void 0 ? _a : indexA === -1 ? 999 : indexA;
    var orderB = (_b = b.order) !== null && _b !== void 0 ? _b : indexB === -1 ? 999 : indexB;
    if (orderA !== orderB) {
      return orderA - orderB;
    }
    return String(a.id).localeCompare(String(b.id));
  });
  return combined.map(function (entry) {
    return entry.dock;
  });
}
function getChannelDock(id) {
  var _a;
  var core = DOCKS[id];
  if (core) {
    return core;
  }
  var registry = (0, runtime_js_1.requireActivePluginRegistry)();
  var pluginEntry = registry.channels.find(function (entry) {
    return entry.plugin.id === id;
  });
  if (!pluginEntry) {
    return undefined;
  }
  return (_a = pluginEntry.dock) !== null && _a !== void 0
    ? _a
    : buildDockFromPlugin(pluginEntry.plugin);
}
