"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LEGACY_CONFIG_MIGRATIONS_PART_1 = void 0;
var legacy_shared_js_1 = require("./legacy.shared.js");
exports.LEGACY_CONFIG_MIGRATIONS_PART_1 = [
  {
    id: "bindings.match.provider->bindings.match.channel",
    describe: "Move bindings[].match.provider to bindings[].match.channel",
    apply: function (raw, changes) {
      var bindings = Array.isArray(raw.bindings) ? raw.bindings : null;
      if (!bindings) {
        return;
      }
      var touched = false;
      for (var _i = 0, bindings_1 = bindings; _i < bindings_1.length; _i++) {
        var entry = bindings_1[_i];
        if (!(0, legacy_shared_js_1.isRecord)(entry)) {
          continue;
        }
        var match = (0, legacy_shared_js_1.getRecord)(entry.match);
        if (!match) {
          continue;
        }
        if (typeof match.channel === "string" && match.channel.trim()) {
          continue;
        }
        var provider = typeof match.provider === "string" ? match.provider.trim() : "";
        if (!provider) {
          continue;
        }
        match.channel = provider;
        delete match.provider;
        entry.match = match;
        touched = true;
      }
      if (touched) {
        raw.bindings = bindings;
        changes.push("Moved bindings[].match.provider → bindings[].match.channel.");
      }
    },
  },
  {
    id: "bindings.match.accountID->bindings.match.accountId",
    describe: "Move bindings[].match.accountID to bindings[].match.accountId",
    apply: function (raw, changes) {
      var bindings = Array.isArray(raw.bindings) ? raw.bindings : null;
      if (!bindings) {
        return;
      }
      var touched = false;
      for (var _i = 0, bindings_2 = bindings; _i < bindings_2.length; _i++) {
        var entry = bindings_2[_i];
        if (!(0, legacy_shared_js_1.isRecord)(entry)) {
          continue;
        }
        var match = (0, legacy_shared_js_1.getRecord)(entry.match);
        if (!match) {
          continue;
        }
        if (match.accountId !== undefined) {
          continue;
        }
        var accountID =
          typeof match.accountID === "string" ? match.accountID.trim() : match.accountID;
        if (!accountID) {
          continue;
        }
        match.accountId = accountID;
        delete match.accountID;
        entry.match = match;
        touched = true;
      }
      if (touched) {
        raw.bindings = bindings;
        changes.push("Moved bindings[].match.accountID → bindings[].match.accountId.");
      }
    },
  },
  {
    id: "session.sendPolicy.rules.match.provider->match.channel",
    describe: "Move session.sendPolicy.rules[].match.provider to match.channel",
    apply: function (raw, changes) {
      var session = (0, legacy_shared_js_1.getRecord)(raw.session);
      if (!session) {
        return;
      }
      var sendPolicy = (0, legacy_shared_js_1.getRecord)(session.sendPolicy);
      if (!sendPolicy) {
        return;
      }
      var rules = Array.isArray(sendPolicy.rules) ? sendPolicy.rules : null;
      if (!rules) {
        return;
      }
      var touched = false;
      for (var _i = 0, rules_1 = rules; _i < rules_1.length; _i++) {
        var rule = rules_1[_i];
        if (!(0, legacy_shared_js_1.isRecord)(rule)) {
          continue;
        }
        var match = (0, legacy_shared_js_1.getRecord)(rule.match);
        if (!match) {
          continue;
        }
        if (typeof match.channel === "string" && match.channel.trim()) {
          continue;
        }
        var provider = typeof match.provider === "string" ? match.provider.trim() : "";
        if (!provider) {
          continue;
        }
        match.channel = provider;
        delete match.provider;
        rule.match = match;
        touched = true;
      }
      if (touched) {
        sendPolicy.rules = rules;
        session.sendPolicy = sendPolicy;
        raw.session = session;
        changes.push("Moved session.sendPolicy.rules[].match.provider → match.channel.");
      }
    },
  },
  {
    id: "messages.queue.byProvider->byChannel",
    describe: "Move messages.queue.byProvider to messages.queue.byChannel",
    apply: function (raw, changes) {
      var messages = (0, legacy_shared_js_1.getRecord)(raw.messages);
      if (!messages) {
        return;
      }
      var queue = (0, legacy_shared_js_1.getRecord)(messages.queue);
      if (!queue) {
        return;
      }
      if (queue.byProvider === undefined) {
        return;
      }
      if (queue.byChannel === undefined) {
        queue.byChannel = queue.byProvider;
        changes.push("Moved messages.queue.byProvider → messages.queue.byChannel.");
      } else {
        changes.push("Removed messages.queue.byProvider (messages.queue.byChannel already set).");
      }
      delete queue.byProvider;
      messages.queue = queue;
      raw.messages = messages;
    },
  },
  {
    id: "providers->channels",
    describe: "Move provider config sections to channels.*",
    apply: function (raw, changes) {
      var legacyKeys = [
        "whatsapp",
        "telegram",
        "discord",
        "slack",
        "signal",
        "imessage",
        "msteams",
      ];
      var legacyEntries = legacyKeys.filter(function (key) {
        return (0, legacy_shared_js_1.isRecord)(raw[key]);
      });
      if (legacyEntries.length === 0) {
        return;
      }
      var channels = (0, legacy_shared_js_1.ensureRecord)(raw, "channels");
      for (var _i = 0, legacyEntries_1 = legacyEntries; _i < legacyEntries_1.length; _i++) {
        var key = legacyEntries_1[_i];
        var legacy = (0, legacy_shared_js_1.getRecord)(raw[key]);
        if (!legacy) {
          continue;
        }
        var channelEntry = (0, legacy_shared_js_1.ensureRecord)(channels, key);
        var hadEntries = Object.keys(channelEntry).length > 0;
        (0, legacy_shared_js_1.mergeMissing)(channelEntry, legacy);
        channels[key] = channelEntry;
        delete raw[key];
        changes.push(
          hadEntries
            ? "Merged ".concat(key, " \u2192 channels.").concat(key, ".")
            : "Moved ".concat(key, " \u2192 channels.").concat(key, "."),
        );
      }
      raw.channels = channels;
    },
  },
  {
    id: "routing.allowFrom->channels.whatsapp.allowFrom",
    describe: "Move routing.allowFrom to channels.whatsapp.allowFrom",
    apply: function (raw, changes) {
      var routing = raw.routing;
      if (!routing || typeof routing !== "object") {
        return;
      }
      var allowFrom = routing.allowFrom;
      if (allowFrom === undefined) {
        return;
      }
      var channels = (0, legacy_shared_js_1.getRecord)(raw.channels);
      var whatsapp = channels ? (0, legacy_shared_js_1.getRecord)(channels.whatsapp) : null;
      if (!whatsapp) {
        delete routing.allowFrom;
        if (Object.keys(routing).length === 0) {
          delete raw.routing;
        }
        changes.push("Removed routing.allowFrom (channels.whatsapp not configured).");
        return;
      }
      if (whatsapp.allowFrom === undefined) {
        whatsapp.allowFrom = allowFrom;
        changes.push("Moved routing.allowFrom → channels.whatsapp.allowFrom.");
      } else {
        changes.push("Removed routing.allowFrom (channels.whatsapp.allowFrom already set).");
      }
      delete routing.allowFrom;
      if (Object.keys(routing).length === 0) {
        delete raw.routing;
      }
      channels.whatsapp = whatsapp;
      raw.channels = channels;
    },
  },
  {
    id: "routing.groupChat.requireMention->groups.*.requireMention",
    describe: "Move routing.groupChat.requireMention to channels.whatsapp/telegram/imessage groups",
    apply: function (raw, changes) {
      var routing = raw.routing;
      if (!routing || typeof routing !== "object") {
        return;
      }
      var groupChat =
        routing.groupChat && typeof routing.groupChat === "object" ? routing.groupChat : null;
      if (!groupChat) {
        return;
      }
      var requireMention = groupChat.requireMention;
      if (requireMention === undefined) {
        return;
      }
      var channels = (0, legacy_shared_js_1.ensureRecord)(raw, "channels");
      var applyTo = function (key, options) {
        if (
          (options === null || options === void 0 ? void 0 : options.requireExisting) &&
          !(0, legacy_shared_js_1.isRecord)(channels[key])
        ) {
          return;
        }
        var section = channels[key] && typeof channels[key] === "object" ? channels[key] : {};
        var groups = section.groups && typeof section.groups === "object" ? section.groups : {};
        var defaultKey = "*";
        var entry =
          groups[defaultKey] && typeof groups[defaultKey] === "object" ? groups[defaultKey] : {};
        if (entry.requireMention === undefined) {
          entry.requireMention = requireMention;
          groups[defaultKey] = entry;
          section.groups = groups;
          channels[key] = section;
          changes.push(
            "Moved routing.groupChat.requireMention \u2192 channels.".concat(
              key,
              '.groups."*".requireMention.',
            ),
          );
        } else {
          changes.push(
            "Removed routing.groupChat.requireMention (channels.".concat(
              key,
              '.groups."*" already set).',
            ),
          );
        }
      };
      applyTo("whatsapp", { requireExisting: true });
      applyTo("telegram");
      applyTo("imessage");
      delete groupChat.requireMention;
      if (Object.keys(groupChat).length === 0) {
        delete routing.groupChat;
      }
      if (Object.keys(routing).length === 0) {
        delete raw.routing;
      }
      raw.channels = channels;
    },
  },
  {
    id: "gateway.token->gateway.auth.token",
    describe: "Move gateway.token to gateway.auth.token",
    apply: function (raw, changes) {
      var gateway = raw.gateway;
      if (!gateway || typeof gateway !== "object") {
        return;
      }
      var token = gateway.token;
      if (token === undefined) {
        return;
      }
      var gatewayObj = gateway;
      var auth = gatewayObj.auth && typeof gatewayObj.auth === "object" ? gatewayObj.auth : {};
      if (auth.token === undefined) {
        auth.token = token;
        if (!auth.mode) {
          auth.mode = "token";
        }
        changes.push("Moved gateway.token → gateway.auth.token.");
      } else {
        changes.push("Removed gateway.token (gateway.auth.token already set).");
      }
      delete gatewayObj.token;
      if (Object.keys(auth).length > 0) {
        gatewayObj.auth = auth;
      }
      raw.gateway = gatewayObj;
    },
  },
  {
    id: "telegram.requireMention->channels.telegram.groups.*.requireMention",
    describe: "Move telegram.requireMention to channels.telegram.groups.*.requireMention",
    apply: function (raw, changes) {
      var channels = (0, legacy_shared_js_1.ensureRecord)(raw, "channels");
      var telegram = channels.telegram;
      if (!telegram || typeof telegram !== "object") {
        return;
      }
      var requireMention = telegram.requireMention;
      if (requireMention === undefined) {
        return;
      }
      var groups = telegram.groups && typeof telegram.groups === "object" ? telegram.groups : {};
      var defaultKey = "*";
      var entry =
        groups[defaultKey] && typeof groups[defaultKey] === "object" ? groups[defaultKey] : {};
      if (entry.requireMention === undefined) {
        entry.requireMention = requireMention;
        groups[defaultKey] = entry;
        telegram.groups = groups;
        changes.push(
          'Moved telegram.requireMention → channels.telegram.groups."*".requireMention.',
        );
      } else {
        changes.push('Removed telegram.requireMention (channels.telegram.groups."*" already set).');
      }
      delete telegram.requireMention;
      channels.telegram = telegram;
      raw.channels = channels;
    },
  },
];
