"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) {
            if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
          }
        }
        return t;
      };
    return __assign.apply(this, arguments);
  };
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __generator =
  (this && this.__generator) ||
  function (thisArg, body) {
    var _ = {
        label: 0,
        sent: function () {
          if (t[0] & 1) {
            throw t[1];
          }
          return t[1];
        },
        trys: [],
        ops: [],
      },
      f,
      y,
      t,
      g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return (
      (g.next = verb(0)),
      (g["throw"] = verb(1)),
      (g["return"] = verb(2)),
      typeof Symbol === "function" &&
        (g[Symbol.iterator] = function () {
          return this;
        }),
      g
    );
    function verb(n) {
      return function (v) {
        return step([n, v]);
      };
    }
    function step(op) {
      if (f) {
        throw new TypeError("Generator is already executing.");
      }
      while ((g && ((g = 0), op[0] && (_ = 0)), _)) {
        try {
          if (
            ((f = 1),
            y &&
              (t =
                op[0] & 2
                  ? y["return"]
                  : op[0]
                    ? y["throw"] || ((t = y["return"]) && t.call(y), 0)
                    : y.next) &&
              !(t = t.call(y, op[1])).done)
          )
            return t;
          if (((y = 0), t)) op = [op[0] & 2, t.value];
          switch (op[0]) {
            case 0:
            case 1:
              t = op;
              break;
            case 4:
              _.label++;
              return { value: op[1], done: false };
            case 5:
              _.label++;
              y = op[1];
              op = [0];
              continue;
            case 7:
              op = _.ops.pop();
              _.trys.pop();
              continue;
            default:
              if (
                !((t = _.trys), (t = t.length > 0 && t[t.length - 1])) &&
                (op[0] === 6 || op[0] === 2)
              ) {
                _ = 0;
                continue;
              }
              if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) {
                _.label = op[1];
                break;
              }
              if (op[0] === 6 && _.label < t[1]) {
                _.label = t[1];
                t = op;
                break;
              }
              if (t && _.label < t[2]) {
                _.label = t[2];
                _.ops.push(op);
                break;
              }
              if (t[2]) _.ops.pop();
              _.trys.pop();
              continue;
          }
          op = body.call(thisArg, _);
        } catch (e) {
          op = [6, e];
          y = 0;
        } finally {
          f = t = 0;
        }
      }
      if (op[0] & 5) {
        throw op[1];
      }
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
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
exports.createMessageTool = createMessageTool;
var typebox_1 = require("@sinclair/typebox");
var message_actions_js_1 = require("../../channels/plugins/message-actions.js");
var types_js_1 = require("../../channels/plugins/types.js");
var bluebubbles_actions_js_1 = require("../../channels/plugins/bluebubbles-actions.js");
var config_js_1 = require("../../config/config.js");
var client_info_js_1 = require("../../gateway/protocol/client-info.js");
var target_normalization_js_1 = require("../../infra/outbound/target-normalization.js");
var message_action_runner_js_1 = require("../../infra/outbound/message-action-runner.js");
var agent_scope_js_1 = require("../agent-scope.js");
var session_key_js_1 = require("../../routing/session-key.js");
var typebox_js_1 = require("../schema/typebox.js");
var channel_tools_js_1 = require("../channel-tools.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var common_js_1 = require("./common.js");
var AllMessageActions = types_js_1.CHANNEL_MESSAGE_ACTION_NAMES;
function buildRoutingSchema() {
  return {
    channel: typebox_1.Type.Optional(typebox_1.Type.String()),
    target: typebox_1.Type.Optional(
      (0, typebox_js_1.channelTargetSchema)({ description: "Target channel/user id or name." }),
    ),
    targets: typebox_1.Type.Optional((0, typebox_js_1.channelTargetsSchema)()),
    accountId: typebox_1.Type.Optional(typebox_1.Type.String()),
    dryRun: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
  };
}
function buildSendSchema(options) {
  var props = {
    message: typebox_1.Type.Optional(typebox_1.Type.String()),
    effectId: typebox_1.Type.Optional(
      typebox_1.Type.String({
        description: "Message effect name/id for sendWithEffect (e.g., invisible ink).",
      }),
    ),
    effect: typebox_1.Type.Optional(
      typebox_1.Type.String({ description: "Alias for effectId (e.g., invisible-ink, balloons)." }),
    ),
    media: typebox_1.Type.Optional(typebox_1.Type.String()),
    filename: typebox_1.Type.Optional(typebox_1.Type.String()),
    buffer: typebox_1.Type.Optional(
      typebox_1.Type.String({
        description: "Base64 payload for attachments (optionally a data: URL).",
      }),
    ),
    contentType: typebox_1.Type.Optional(typebox_1.Type.String()),
    mimeType: typebox_1.Type.Optional(typebox_1.Type.String()),
    caption: typebox_1.Type.Optional(typebox_1.Type.String()),
    path: typebox_1.Type.Optional(typebox_1.Type.String()),
    filePath: typebox_1.Type.Optional(typebox_1.Type.String()),
    replyTo: typebox_1.Type.Optional(typebox_1.Type.String()),
    threadId: typebox_1.Type.Optional(typebox_1.Type.String()),
    asVoice: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    silent: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    quoteText: typebox_1.Type.Optional(
      typebox_1.Type.String({ description: "Quote text for Telegram reply_parameters" }),
    ),
    bestEffort: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    gifPlayback: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    buttons: typebox_1.Type.Optional(
      typebox_1.Type.Array(
        typebox_1.Type.Array(
          typebox_1.Type.Object({
            text: typebox_1.Type.String(),
            callback_data: typebox_1.Type.String(),
          }),
        ),
        {
          description: "Telegram inline keyboard buttons (array of button rows)",
        },
      ),
    ),
    card: typebox_1.Type.Optional(
      typebox_1.Type.Object(
        {},
        {
          additionalProperties: true,
          description: "Adaptive Card JSON object (when supported by the channel)",
        },
      ),
    ),
  };
  if (!options.includeButtons) {
    delete props.buttons;
  }
  if (!options.includeCards) {
    delete props.card;
  }
  return props;
}
function buildReactionSchema() {
  return {
    messageId: typebox_1.Type.Optional(typebox_1.Type.String()),
    emoji: typebox_1.Type.Optional(typebox_1.Type.String()),
    remove: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    targetAuthor: typebox_1.Type.Optional(typebox_1.Type.String()),
    targetAuthorUuid: typebox_1.Type.Optional(typebox_1.Type.String()),
    groupId: typebox_1.Type.Optional(typebox_1.Type.String()),
  };
}
function buildFetchSchema() {
  return {
    limit: typebox_1.Type.Optional(typebox_1.Type.Number()),
    before: typebox_1.Type.Optional(typebox_1.Type.String()),
    after: typebox_1.Type.Optional(typebox_1.Type.String()),
    around: typebox_1.Type.Optional(typebox_1.Type.String()),
    fromMe: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    includeArchived: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
  };
}
function buildPollSchema() {
  return {
    pollQuestion: typebox_1.Type.Optional(typebox_1.Type.String()),
    pollOption: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    pollDurationHours: typebox_1.Type.Optional(typebox_1.Type.Number()),
    pollMulti: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
  };
}
function buildChannelTargetSchema() {
  return {
    channelId: typebox_1.Type.Optional(
      typebox_1.Type.String({
        description: "Channel id filter (search/thread list/event create).",
      }),
    ),
    channelIds: typebox_1.Type.Optional(
      typebox_1.Type.Array(
        typebox_1.Type.String({ description: "Channel id filter (repeatable)." }),
      ),
    ),
    guildId: typebox_1.Type.Optional(typebox_1.Type.String()),
    userId: typebox_1.Type.Optional(typebox_1.Type.String()),
    authorId: typebox_1.Type.Optional(typebox_1.Type.String()),
    authorIds: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    roleId: typebox_1.Type.Optional(typebox_1.Type.String()),
    roleIds: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    participant: typebox_1.Type.Optional(typebox_1.Type.String()),
  };
}
function buildStickerSchema() {
  return {
    emojiName: typebox_1.Type.Optional(typebox_1.Type.String()),
    stickerId: typebox_1.Type.Optional(typebox_1.Type.Array(typebox_1.Type.String())),
    stickerName: typebox_1.Type.Optional(typebox_1.Type.String()),
    stickerDesc: typebox_1.Type.Optional(typebox_1.Type.String()),
    stickerTags: typebox_1.Type.Optional(typebox_1.Type.String()),
  };
}
function buildThreadSchema() {
  return {
    threadName: typebox_1.Type.Optional(typebox_1.Type.String()),
    autoArchiveMin: typebox_1.Type.Optional(typebox_1.Type.Number()),
  };
}
function buildEventSchema() {
  return {
    query: typebox_1.Type.Optional(typebox_1.Type.String()),
    eventName: typebox_1.Type.Optional(typebox_1.Type.String()),
    eventType: typebox_1.Type.Optional(typebox_1.Type.String()),
    startTime: typebox_1.Type.Optional(typebox_1.Type.String()),
    endTime: typebox_1.Type.Optional(typebox_1.Type.String()),
    desc: typebox_1.Type.Optional(typebox_1.Type.String()),
    location: typebox_1.Type.Optional(typebox_1.Type.String()),
    durationMin: typebox_1.Type.Optional(typebox_1.Type.Number()),
    until: typebox_1.Type.Optional(typebox_1.Type.String()),
  };
}
function buildModerationSchema() {
  return {
    reason: typebox_1.Type.Optional(typebox_1.Type.String()),
    deleteDays: typebox_1.Type.Optional(typebox_1.Type.Number()),
  };
}
function buildGatewaySchema() {
  return {
    gatewayUrl: typebox_1.Type.Optional(typebox_1.Type.String()),
    gatewayToken: typebox_1.Type.Optional(typebox_1.Type.String()),
    timeoutMs: typebox_1.Type.Optional(typebox_1.Type.Number()),
  };
}
function buildChannelManagementSchema() {
  return {
    name: typebox_1.Type.Optional(typebox_1.Type.String()),
    type: typebox_1.Type.Optional(typebox_1.Type.Number()),
    parentId: typebox_1.Type.Optional(typebox_1.Type.String()),
    topic: typebox_1.Type.Optional(typebox_1.Type.String()),
    position: typebox_1.Type.Optional(typebox_1.Type.Number()),
    nsfw: typebox_1.Type.Optional(typebox_1.Type.Boolean()),
    rateLimitPerUser: typebox_1.Type.Optional(typebox_1.Type.Number()),
    categoryId: typebox_1.Type.Optional(typebox_1.Type.String()),
    clearParent: typebox_1.Type.Optional(
      typebox_1.Type.Boolean({
        description: "Clear the parent/category when supported by the provider.",
      }),
    ),
  };
}
function buildMessageToolSchemaProps(options) {
  return __assign(
    __assign(
      __assign(
        __assign(
          __assign(
            __assign(
              __assign(
                __assign(
                  __assign(
                    __assign(
                      __assign(__assign({}, buildRoutingSchema()), buildSendSchema(options)),
                      buildReactionSchema(),
                    ),
                    buildFetchSchema(),
                  ),
                  buildPollSchema(),
                ),
                buildChannelTargetSchema(),
              ),
              buildStickerSchema(),
            ),
            buildThreadSchema(),
          ),
          buildEventSchema(),
        ),
        buildModerationSchema(),
      ),
      buildGatewaySchema(),
    ),
    buildChannelManagementSchema(),
  );
}
function buildMessageToolSchemaFromActions(actions, options) {
  var props = buildMessageToolSchemaProps(options);
  return typebox_1.Type.Object(__assign({ action: (0, typebox_js_1.stringEnum)(actions) }, props));
}
var MessageToolSchema = buildMessageToolSchemaFromActions(AllMessageActions, {
  includeButtons: true,
  includeCards: true,
});
function buildMessageToolSchema(cfg) {
  var actions = (0, message_actions_js_1.listChannelMessageActions)(cfg);
  var includeButtons = (0, message_actions_js_1.supportsChannelMessageButtons)(cfg);
  var includeCards = (0, message_actions_js_1.supportsChannelMessageCards)(cfg);
  return buildMessageToolSchemaFromActions(actions.length > 0 ? actions : ["send"], {
    includeButtons: includeButtons,
    includeCards: includeCards,
  });
}
function resolveAgentAccountId(value) {
  var trimmed = value === null || value === void 0 ? void 0 : value.trim();
  if (!trimmed) {
    return undefined;
  }
  return (0, session_key_js_1.normalizeAccountId)(trimmed);
}
function filterActionsForContext(params) {
  var _a, _b;
  var channel = (0, message_channel_js_1.normalizeMessageChannel)(params.channel);
  if (!channel || channel !== "bluebubbles") {
    return params.actions;
  }
  var currentChannelId =
    (_a = params.currentChannelId) === null || _a === void 0 ? void 0 : _a.trim();
  if (!currentChannelId) {
    return params.actions;
  }
  var normalizedTarget =
    (_b = (0, target_normalization_js_1.normalizeTargetForProvider)(channel, currentChannelId)) !==
      null && _b !== void 0
      ? _b
      : currentChannelId;
  var lowered = normalizedTarget.trim().toLowerCase();
  var isGroupTarget =
    lowered.startsWith("chat_guid:") ||
    lowered.startsWith("chat_id:") ||
    lowered.startsWith("chat_identifier:") ||
    lowered.startsWith("group:");
  if (isGroupTarget) {
    return params.actions;
  }
  return params.actions.filter(function (action) {
    return !bluebubbles_actions_js_1.BLUEBUBBLES_GROUP_ACTIONS.has(action);
  });
}
function buildMessageToolDescription(options) {
  var baseDescription = "Send, delete, and manage messages via channel plugins.";
  // If we have a current channel, show only its supported actions
  if (options === null || options === void 0 ? void 0 : options.currentChannel) {
    var channelActions = filterActionsForContext({
      actions: (0, channel_tools_js_1.listChannelSupportedActions)({
        cfg: options.config,
        channel: options.currentChannel,
      }),
      channel: options.currentChannel,
      currentChannelId: options.currentChannelId,
    });
    if (channelActions.length > 0) {
      // Always include "send" as a base action
      var allActions = new Set(__spreadArray(["send"], channelActions, true));
      var actionList = Array.from(allActions).toSorted().join(", ");
      return ""
        .concat(baseDescription, " Current channel (")
        .concat(options.currentChannel, ") supports: ")
        .concat(actionList, ".");
    }
  }
  // Fallback to generic description with all configured actions
  if (options === null || options === void 0 ? void 0 : options.config) {
    var actions = (0, message_actions_js_1.listChannelMessageActions)(options.config);
    if (actions.length > 0) {
      return "".concat(baseDescription, " Supports actions: ").concat(actions.join(", "), ".");
    }
  }
  return "".concat(
    baseDescription,
    " Supports actions: send, delete, react, poll, pin, threads, and more.",
  );
}
function createMessageTool(options) {
  var _this = this;
  var agentAccountId = resolveAgentAccountId(
    options === null || options === void 0 ? void 0 : options.agentAccountId,
  );
  var schema = (options === null || options === void 0 ? void 0 : options.config)
    ? buildMessageToolSchema(options.config)
    : MessageToolSchema;
  var description = buildMessageToolDescription({
    config: options === null || options === void 0 ? void 0 : options.config,
    currentChannel:
      options === null || options === void 0 ? void 0 : options.currentChannelProvider,
    currentChannelId: options === null || options === void 0 ? void 0 : options.currentChannelId,
  });
  return {
    label: "Message",
    name: "message",
    description: description,
    parameters: schema,
    execute: function (_toolCallId, args, signal) {
      return __awaiter(_this, void 0, void 0, function () {
        var err, params, cfg, action, accountId, gateway, toolContext, result, toolResult;
        var _a, _b;
        return __generator(this, function (_c) {
          switch (_c.label) {
            case 0:
              // Check if already aborted before doing any work
              if (signal === null || signal === void 0 ? void 0 : signal.aborted) {
                err = new Error("Message send aborted");
                err.name = "AbortError";
                throw err;
              }
              params = args;
              cfg =
                (_a = options === null || options === void 0 ? void 0 : options.config) !== null &&
                _a !== void 0
                  ? _a
                  : (0, config_js_1.loadConfig)();
              action = (0, common_js_1.readStringParam)(params, "action", {
                required: true,
              });
              accountId =
                (_b = (0, common_js_1.readStringParam)(params, "accountId")) !== null &&
                _b !== void 0
                  ? _b
                  : agentAccountId;
              if (accountId) {
                params.accountId = accountId;
              }
              gateway = {
                url: (0, common_js_1.readStringParam)(params, "gatewayUrl", { trim: false }),
                token: (0, common_js_1.readStringParam)(params, "gatewayToken", { trim: false }),
                timeoutMs: (0, common_js_1.readNumberParam)(params, "timeoutMs"),
                clientName: client_info_js_1.GATEWAY_CLIENT_IDS.GATEWAY_CLIENT,
                clientDisplayName: "agent",
                mode: client_info_js_1.GATEWAY_CLIENT_MODES.BACKEND,
              };
              toolContext =
                (options === null || options === void 0 ? void 0 : options.currentChannelId) ||
                (options === null || options === void 0
                  ? void 0
                  : options.currentChannelProvider) ||
                (options === null || options === void 0 ? void 0 : options.currentThreadTs) ||
                (options === null || options === void 0 ? void 0 : options.replyToMode) ||
                (options === null || options === void 0 ? void 0 : options.hasRepliedRef)
                  ? {
                      currentChannelId:
                        options === null || options === void 0 ? void 0 : options.currentChannelId,
                      currentChannelProvider:
                        options === null || options === void 0
                          ? void 0
                          : options.currentChannelProvider,
                      currentThreadTs:
                        options === null || options === void 0 ? void 0 : options.currentThreadTs,
                      replyToMode:
                        options === null || options === void 0 ? void 0 : options.replyToMode,
                      hasRepliedRef:
                        options === null || options === void 0 ? void 0 : options.hasRepliedRef,
                      // Direct tool invocations should not add cross-context decoration.
                      // The agent is composing a message, not forwarding from another chat.
                      skipCrossContextDecoration: true,
                    }
                  : undefined;
              return [
                4 /*yield*/,
                (0, message_action_runner_js_1.runMessageAction)({
                  cfg: cfg,
                  action: action,
                  params: params,
                  defaultAccountId:
                    accountId !== null && accountId !== void 0 ? accountId : undefined,
                  gateway: gateway,
                  toolContext: toolContext,
                  agentId: (
                    options === null || options === void 0 ? void 0 : options.agentSessionKey
                  )
                    ? (0, agent_scope_js_1.resolveSessionAgentId)({
                        sessionKey: options.agentSessionKey,
                        config: cfg,
                      })
                    : undefined,
                  abortSignal: signal,
                }),
              ];
            case 1:
              result = _c.sent();
              toolResult = (0, message_action_runner_js_1.getToolResult)(result);
              if (toolResult) {
                return [2 /*return*/, toolResult];
              }
              return [2 /*return*/, (0, common_js_1.jsonResult)(result.payload)];
          }
        });
      });
    },
  };
}
