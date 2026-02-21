"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createPluginRuntime = createPluginRuntime;
var node_module_1 = require("node:module");
var chunk_js_1 = require("../../auto-reply/chunk.js");
var command_detection_js_1 = require("../../auto-reply/command-detection.js");
var commands_registry_js_1 = require("../../auto-reply/commands-registry.js");
var inbound_debounce_js_1 = require("../../auto-reply/inbound-debounce.js");
var envelope_js_1 = require("../../auto-reply/envelope.js");
var dispatch_from_config_js_1 = require("../../auto-reply/reply/dispatch-from-config.js");
var mentions_js_1 = require("../../auto-reply/reply/mentions.js");
var provider_dispatcher_js_1 = require("../../auto-reply/reply/provider-dispatcher.js");
var reply_dispatcher_js_1 = require("../../auto-reply/reply/reply-dispatcher.js");
var inbound_context_js_1 = require("../../auto-reply/reply/inbound-context.js");
var identity_js_1 = require("../../agents/identity.js");
var memory_tool_js_1 = require("../../agents/tools/memory-tool.js");
var slack_actions_js_1 = require("../../agents/tools/slack-actions.js");
var whatsapp_actions_js_1 = require("../../agents/tools/whatsapp-actions.js");
var ack_reactions_js_1 = require("../../channels/ack-reactions.js");
var command_gating_js_1 = require("../../channels/command-gating.js");
var session_js_1 = require("../../channels/session.js");
var discord_js_1 = require("../../channels/plugins/actions/discord.js");
var signal_js_1 = require("../../channels/plugins/actions/signal.js");
var telegram_js_1 = require("../../channels/plugins/actions/telegram.js");
var whatsapp_login_js_1 = require("../../channels/plugins/agent-tools/whatsapp-login.js");
var index_js_1 = require("../../channels/web/index.js");
var group_policy_js_1 = require("../../config/group-policy.js");
var markdown_tables_js_1 = require("../../config/markdown-tables.js");
var paths_js_1 = require("../../config/paths.js");
var config_js_1 = require("../../config/config.js");
var sessions_js_1 = require("../../config/sessions.js");
var audit_js_1 = require("../../discord/audit.js");
var directory_live_js_1 = require("../../discord/directory-live.js");
var monitor_js_1 = require("../../discord/monitor.js");
var probe_js_1 = require("../../discord/probe.js");
var resolve_channels_js_1 = require("../../discord/resolve-channels.js");
var resolve_users_js_1 = require("../../discord/resolve-users.js");
var send_js_1 = require("../../discord/send.js");
var channel_activity_js_1 = require("../../infra/channel-activity.js");
var system_events_js_1 = require("../../infra/system-events.js");
var monitor_js_2 = require("../../imessage/monitor.js");
var probe_js_2 = require("../../imessage/probe.js");
var send_js_2 = require("../../imessage/send.js");
var globals_js_1 = require("../../globals.js");
var tables_js_1 = require("../../markdown/tables.js");
var logging_js_1 = require("../../logging.js");
var levels_js_1 = require("../../logging/levels.js");
var audio_js_1 = require("../../media/audio.js");
var constants_js_1 = require("../../media/constants.js");
var fetch_js_1 = require("../../media/fetch.js");
var image_ops_js_1 = require("../../media/image-ops.js");
var mime_js_1 = require("../../media/mime.js");
var store_js_1 = require("../../media/store.js");
var pairing_messages_js_1 = require("../../pairing/pairing-messages.js");
var pairing_store_js_1 = require("../../pairing/pairing-store.js");
var exec_js_1 = require("../../process/exec.js");
var resolve_route_js_1 = require("../../routing/resolve-route.js");
var index_js_2 = require("../../signal/index.js");
var probe_js_3 = require("../../signal/probe.js");
var send_js_3 = require("../../signal/send.js");
var index_js_3 = require("../../slack/index.js");
var directory_live_js_2 = require("../../slack/directory-live.js");
var probe_js_4 = require("../../slack/probe.js");
var resolve_channels_js_2 = require("../../slack/resolve-channels.js");
var resolve_users_js_2 = require("../../slack/resolve-users.js");
var send_js_4 = require("../../slack/send.js");
var audit_js_2 = require("../../telegram/audit.js");
var monitor_js_3 = require("../../telegram/monitor.js");
var probe_js_5 = require("../../telegram/probe.js");
var send_js_5 = require("../../telegram/send.js");
var token_js_1 = require("../../telegram/token.js");
var media_js_1 = require("../../web/media.js");
var active_listener_js_1 = require("../../web/active-listener.js");
var auth_store_js_1 = require("../../web/auth-store.js");
var login_js_1 = require("../../web/login.js");
var login_qr_js_1 = require("../../web/login-qr.js");
var outbound_js_1 = require("../../web/outbound.js");
var memory_cli_js_1 = require("../../cli/memory-cli.js");
var native_deps_js_1 = require("./native-deps.js");
var tts_js_1 = require("../../tts/tts.js");
var accounts_js_1 = require("../../line/accounts.js");
var probe_js_6 = require("../../line/probe.js");
var send_js_6 = require("../../line/send.js");
var monitor_js_4 = require("../../line/monitor.js");
var template_messages_js_1 = require("../../line/template-messages.js");
var cachedVersion = null;
function resolveVersion() {
  var _a;
  if (cachedVersion) {
    return cachedVersion;
  }
  try {
    var require_1 = (0, node_module_1.createRequire)(import.meta.url);
    var pkg = require_1("../../../package.json");
    cachedVersion = (_a = pkg.version) !== null && _a !== void 0 ? _a : "unknown";
    return cachedVersion;
  } catch (_b) {
    cachedVersion = "unknown";
    return cachedVersion;
  }
}
function createPluginRuntime() {
  return {
    version: resolveVersion(),
    config: {
      loadConfig: config_js_1.loadConfig,
      writeConfigFile: config_js_1.writeConfigFile,
    },
    system: {
      enqueueSystemEvent: system_events_js_1.enqueueSystemEvent,
      runCommandWithTimeout: exec_js_1.runCommandWithTimeout,
      formatNativeDependencyHint: native_deps_js_1.formatNativeDependencyHint,
    },
    media: {
      loadWebMedia: media_js_1.loadWebMedia,
      detectMime: mime_js_1.detectMime,
      mediaKindFromMime: constants_js_1.mediaKindFromMime,
      isVoiceCompatibleAudio: audio_js_1.isVoiceCompatibleAudio,
      getImageMetadata: image_ops_js_1.getImageMetadata,
      resizeToJpeg: image_ops_js_1.resizeToJpeg,
    },
    tts: {
      textToSpeechTelephony: tts_js_1.textToSpeechTelephony,
    },
    tools: {
      createMemoryGetTool: memory_tool_js_1.createMemoryGetTool,
      createMemorySearchTool: memory_tool_js_1.createMemorySearchTool,
      registerMemoryCli: memory_cli_js_1.registerMemoryCli,
    },
    channel: {
      text: {
        chunkByNewline: chunk_js_1.chunkByNewline,
        chunkMarkdownText: chunk_js_1.chunkMarkdownText,
        chunkMarkdownTextWithMode: chunk_js_1.chunkMarkdownTextWithMode,
        chunkText: chunk_js_1.chunkText,
        chunkTextWithMode: chunk_js_1.chunkTextWithMode,
        resolveChunkMode: chunk_js_1.resolveChunkMode,
        resolveTextChunkLimit: chunk_js_1.resolveTextChunkLimit,
        hasControlCommand: command_detection_js_1.hasControlCommand,
        resolveMarkdownTableMode: markdown_tables_js_1.resolveMarkdownTableMode,
        convertMarkdownTables: tables_js_1.convertMarkdownTables,
      },
      reply: {
        dispatchReplyWithBufferedBlockDispatcher:
          provider_dispatcher_js_1.dispatchReplyWithBufferedBlockDispatcher,
        createReplyDispatcherWithTyping: reply_dispatcher_js_1.createReplyDispatcherWithTyping,
        resolveEffectiveMessagesConfig: identity_js_1.resolveEffectiveMessagesConfig,
        resolveHumanDelayConfig: identity_js_1.resolveHumanDelayConfig,
        dispatchReplyFromConfig: dispatch_from_config_js_1.dispatchReplyFromConfig,
        finalizeInboundContext: inbound_context_js_1.finalizeInboundContext,
        formatAgentEnvelope: envelope_js_1.formatAgentEnvelope,
        formatInboundEnvelope: envelope_js_1.formatInboundEnvelope,
        resolveEnvelopeFormatOptions: envelope_js_1.resolveEnvelopeFormatOptions,
      },
      routing: {
        resolveAgentRoute: resolve_route_js_1.resolveAgentRoute,
      },
      pairing: {
        buildPairingReply: pairing_messages_js_1.buildPairingReply,
        readAllowFromStore: pairing_store_js_1.readChannelAllowFromStore,
        upsertPairingRequest: pairing_store_js_1.upsertChannelPairingRequest,
      },
      media: {
        fetchRemoteMedia: fetch_js_1.fetchRemoteMedia,
        saveMediaBuffer: store_js_1.saveMediaBuffer,
      },
      activity: {
        record: channel_activity_js_1.recordChannelActivity,
        get: channel_activity_js_1.getChannelActivity,
      },
      session: {
        resolveStorePath: sessions_js_1.resolveStorePath,
        readSessionUpdatedAt: sessions_js_1.readSessionUpdatedAt,
        recordSessionMetaFromInbound: sessions_js_1.recordSessionMetaFromInbound,
        recordInboundSession: session_js_1.recordInboundSession,
        updateLastRoute: sessions_js_1.updateLastRoute,
      },
      mentions: {
        buildMentionRegexes: mentions_js_1.buildMentionRegexes,
        matchesMentionPatterns: mentions_js_1.matchesMentionPatterns,
        matchesMentionWithExplicit: mentions_js_1.matchesMentionWithExplicit,
      },
      reactions: {
        shouldAckReaction: ack_reactions_js_1.shouldAckReaction,
        removeAckReactionAfterReply: ack_reactions_js_1.removeAckReactionAfterReply,
      },
      groups: {
        resolveGroupPolicy: group_policy_js_1.resolveChannelGroupPolicy,
        resolveRequireMention: group_policy_js_1.resolveChannelGroupRequireMention,
      },
      debounce: {
        createInboundDebouncer: inbound_debounce_js_1.createInboundDebouncer,
        resolveInboundDebounceMs: inbound_debounce_js_1.resolveInboundDebounceMs,
      },
      commands: {
        resolveCommandAuthorizedFromAuthorizers:
          command_gating_js_1.resolveCommandAuthorizedFromAuthorizers,
        isControlCommandMessage: command_detection_js_1.isControlCommandMessage,
        shouldComputeCommandAuthorized: command_detection_js_1.shouldComputeCommandAuthorized,
        shouldHandleTextCommands: commands_registry_js_1.shouldHandleTextCommands,
      },
      discord: {
        messageActions: discord_js_1.discordMessageActions,
        auditChannelPermissions: audit_js_1.auditDiscordChannelPermissions,
        listDirectoryGroupsLive: directory_live_js_1.listDiscordDirectoryGroupsLive,
        listDirectoryPeersLive: directory_live_js_1.listDiscordDirectoryPeersLive,
        probeDiscord: probe_js_1.probeDiscord,
        resolveChannelAllowlist: resolve_channels_js_1.resolveDiscordChannelAllowlist,
        resolveUserAllowlist: resolve_users_js_1.resolveDiscordUserAllowlist,
        sendMessageDiscord: send_js_1.sendMessageDiscord,
        sendPollDiscord: send_js_1.sendPollDiscord,
        monitorDiscordProvider: monitor_js_1.monitorDiscordProvider,
      },
      slack: {
        listDirectoryGroupsLive: directory_live_js_2.listSlackDirectoryGroupsLive,
        listDirectoryPeersLive: directory_live_js_2.listSlackDirectoryPeersLive,
        probeSlack: probe_js_4.probeSlack,
        resolveChannelAllowlist: resolve_channels_js_2.resolveSlackChannelAllowlist,
        resolveUserAllowlist: resolve_users_js_2.resolveSlackUserAllowlist,
        sendMessageSlack: send_js_4.sendMessageSlack,
        monitorSlackProvider: index_js_3.monitorSlackProvider,
        handleSlackAction: slack_actions_js_1.handleSlackAction,
      },
      telegram: {
        auditGroupMembership: audit_js_2.auditTelegramGroupMembership,
        collectUnmentionedGroupIds: audit_js_2.collectTelegramUnmentionedGroupIds,
        probeTelegram: probe_js_5.probeTelegram,
        resolveTelegramToken: token_js_1.resolveTelegramToken,
        sendMessageTelegram: send_js_5.sendMessageTelegram,
        monitorTelegramProvider: monitor_js_3.monitorTelegramProvider,
        messageActions: telegram_js_1.telegramMessageActions,
      },
      signal: {
        probeSignal: probe_js_3.probeSignal,
        sendMessageSignal: send_js_3.sendMessageSignal,
        monitorSignalProvider: index_js_2.monitorSignalProvider,
        messageActions: signal_js_1.signalMessageActions,
      },
      imessage: {
        monitorIMessageProvider: monitor_js_2.monitorIMessageProvider,
        probeIMessage: probe_js_2.probeIMessage,
        sendMessageIMessage: send_js_2.sendMessageIMessage,
      },
      whatsapp: {
        getActiveWebListener: active_listener_js_1.getActiveWebListener,
        getWebAuthAgeMs: auth_store_js_1.getWebAuthAgeMs,
        logoutWeb: auth_store_js_1.logoutWeb,
        logWebSelfId: auth_store_js_1.logWebSelfId,
        readWebSelfId: auth_store_js_1.readWebSelfId,
        webAuthExists: auth_store_js_1.webAuthExists,
        sendMessageWhatsApp: outbound_js_1.sendMessageWhatsApp,
        sendPollWhatsApp: outbound_js_1.sendPollWhatsApp,
        loginWeb: login_js_1.loginWeb,
        startWebLoginWithQr: login_qr_js_1.startWebLoginWithQr,
        waitForWebLogin: login_qr_js_1.waitForWebLogin,
        monitorWebChannel: index_js_1.monitorWebChannel,
        handleWhatsAppAction: whatsapp_actions_js_1.handleWhatsAppAction,
        createLoginTool: whatsapp_login_js_1.createWhatsAppLoginTool,
      },
      line: {
        listLineAccountIds: accounts_js_1.listLineAccountIds,
        resolveDefaultLineAccountId: accounts_js_1.resolveDefaultLineAccountId,
        resolveLineAccount: accounts_js_1.resolveLineAccount,
        normalizeAccountId: accounts_js_1.normalizeAccountId,
        probeLineBot: probe_js_6.probeLineBot,
        sendMessageLine: send_js_6.sendMessageLine,
        pushMessageLine: send_js_6.pushMessageLine,
        pushMessagesLine: send_js_6.pushMessagesLine,
        pushFlexMessage: send_js_6.pushFlexMessage,
        pushTemplateMessage: send_js_6.pushTemplateMessage,
        pushLocationMessage: send_js_6.pushLocationMessage,
        pushTextMessageWithQuickReplies: send_js_6.pushTextMessageWithQuickReplies,
        createQuickReplyItems: send_js_6.createQuickReplyItems,
        buildTemplateMessageFromPayload: template_messages_js_1.buildTemplateMessageFromPayload,
        monitorLineProvider: monitor_js_4.monitorLineProvider,
      },
    },
    logging: {
      shouldLogVerbose: globals_js_1.shouldLogVerbose,
      getChildLogger: function (bindings, opts) {
        var logger = (0, logging_js_1.getChildLogger)(bindings, {
          level: (opts === null || opts === void 0 ? void 0 : opts.level)
            ? (0, levels_js_1.normalizeLogLevel)(opts.level)
            : undefined,
        });
        return {
          debug: function (message) {
            var _a;
            return (_a = logger.debug) === null || _a === void 0
              ? void 0
              : _a.call(logger, message);
          },
          info: function (message) {
            return logger.info(message);
          },
          warn: function (message) {
            return logger.warn(message);
          },
          error: function (message) {
            return logger.error(message);
          },
        };
      },
    },
    state: {
      resolveStateDir: paths_js_1.resolveStateDir,
    },
  };
}
