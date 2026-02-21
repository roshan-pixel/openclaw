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
Object.defineProperty(exports, "__esModule", { value: true });
exports.runPreparedReply = runPreparedReply;
var node_crypto_1 = require("node:crypto");
var pi_embedded_js_1 = require("../../agents/pi-embedded.js");
var session_override_js_1 = require("../../agents/auth-profiles/session-override.js");
var sessions_js_1 = require("../../config/sessions.js");
var globals_js_1 = require("../../globals.js");
var command_queue_js_1 = require("../../process/command-queue.js");
var session_key_js_1 = require("../../routing/session-key.js");
var provider_utils_js_1 = require("../../utils/provider-utils.js");
var command_detection_js_1 = require("../command-detection.js");
var media_note_js_1 = require("../media-note.js");
var thinking_js_1 = require("../thinking.js");
var tokens_js_1 = require("../tokens.js");
var agent_runner_js_1 = require("./agent-runner.js");
var body_js_1 = require("./body.js");
var route_reply_js_1 = require("./route-reply.js");
var groups_js_1 = require("./groups.js");
var queue_js_1 = require("./queue.js");
var session_updates_js_1 = require("./session-updates.js");
var typing_mode_js_1 = require("./typing-mode.js");
var BARE_SESSION_RESET_PROMPT =
  "A new session was started via /new or /reset. Say hi briefly (1-2 sentences) and ask what the user wants to do next. If the runtime model differs from default_model in the system prompt, mention the default model in the greeting. Do not mention internal steps, files, tools, or reasoning.";
function runPreparedReply(params) {
  return __awaiter(this, void 0, void 0, function () {
    var ctx,
      sessionCtx,
      cfg,
      agentId,
      agentDir,
      agentCfg,
      sessionCfg,
      commandAuthorized,
      command,
      commandSource,
      allowTextCommands,
      directives,
      defaultActivation,
      elevatedEnabled,
      elevatedAllowed,
      blockStreamingEnabled,
      blockReplyChunking,
      resolvedBlockStreamingBreak,
      modelState,
      provider,
      model,
      perMessageQueueMode,
      perMessageQueueOptions,
      typing,
      opts,
      defaultProvider,
      defaultModel,
      timeoutMs,
      isNewSession,
      resetTriggered,
      systemSent,
      sessionKey,
      sessionId,
      storePath,
      workspaceDir,
      sessionStore,
      sessionEntry,
      resolvedThinkLevel,
      resolvedVerboseLevel,
      resolvedReasoningLevel,
      resolvedElevatedLevel,
      execOverrides,
      abortedLastRun,
      currentSystemSent,
      isFirstTurnInSession,
      isGroupChat,
      wasMentioned,
      isHeartbeat,
      typingMode,
      shouldInjectGroupIntro,
      groupIntro,
      groupSystemPrompt,
      extraSystemPrompt,
      baseBody,
      rawBodyTrimmed,
      baseBodyTrimmedRaw,
      isBareNewOrReset,
      isBareSessionReset,
      baseBodyFinal,
      baseBodyTrimmed,
      prefixedBodyBase,
      isGroupSession,
      isMainSession,
      threadStarterBody,
      threadStarterNote,
      skillResult,
      skillsSnapshot,
      prefixedBody,
      mediaNote,
      mediaReplyHint,
      prefixedCommandBody,
      parts,
      maybeLevel,
      explicitThink,
      channel,
      to,
      modelLabel,
      defaultLabel,
      text,
      sessionIdFinal,
      sessionFile,
      queueBodyBase,
      queueMessageId,
      queueMessageIdHint,
      queueBodyWithId,
      queuedBody,
      resolvedQueue,
      sessionLaneKey,
      laneSize,
      cleared,
      aborted,
      queueKey,
      isActive,
      isStreaming,
      shouldSteer,
      shouldFollowup,
      authProfileId,
      authProfileIdSource,
      followupRun;
    var _a,
      _b,
      _c,
      _d,
      _e,
      _f,
      _g,
      _h,
      _j,
      _k,
      _l,
      _m,
      _o,
      _p,
      _q,
      _r,
      _s,
      _t,
      _u,
      _v,
      _w,
      _x,
      _y,
      _z;
    return __generator(this, function (_0) {
      switch (_0.label) {
        case 0:
          ((ctx = params.ctx),
            (sessionCtx = params.sessionCtx),
            (cfg = params.cfg),
            (agentId = params.agentId),
            (agentDir = params.agentDir),
            (agentCfg = params.agentCfg),
            (sessionCfg = params.sessionCfg),
            (commandAuthorized = params.commandAuthorized),
            (command = params.command),
            (commandSource = params.commandSource),
            (allowTextCommands = params.allowTextCommands),
            (directives = params.directives),
            (defaultActivation = params.defaultActivation),
            (elevatedEnabled = params.elevatedEnabled),
            (elevatedAllowed = params.elevatedAllowed),
            (blockStreamingEnabled = params.blockStreamingEnabled),
            (blockReplyChunking = params.blockReplyChunking),
            (resolvedBlockStreamingBreak = params.resolvedBlockStreamingBreak),
            (modelState = params.modelState),
            (provider = params.provider),
            (model = params.model),
            (perMessageQueueMode = params.perMessageQueueMode),
            (perMessageQueueOptions = params.perMessageQueueOptions),
            (typing = params.typing),
            (opts = params.opts),
            (defaultProvider = params.defaultProvider),
            (defaultModel = params.defaultModel),
            (timeoutMs = params.timeoutMs),
            (isNewSession = params.isNewSession),
            (resetTriggered = params.resetTriggered),
            (systemSent = params.systemSent),
            (sessionKey = params.sessionKey),
            (sessionId = params.sessionId),
            (storePath = params.storePath),
            (workspaceDir = params.workspaceDir),
            (sessionStore = params.sessionStore));
          ((sessionEntry = params.sessionEntry),
            (resolvedThinkLevel = params.resolvedThinkLevel),
            (resolvedVerboseLevel = params.resolvedVerboseLevel),
            (resolvedReasoningLevel = params.resolvedReasoningLevel),
            (resolvedElevatedLevel = params.resolvedElevatedLevel),
            (execOverrides = params.execOverrides),
            (abortedLastRun = params.abortedLastRun));
          currentSystemSent = systemSent;
          isFirstTurnInSession = isNewSession || !currentSystemSent;
          isGroupChat = sessionCtx.ChatType === "group";
          wasMentioned = ctx.WasMentioned === true;
          isHeartbeat = (opts === null || opts === void 0 ? void 0 : opts.isHeartbeat) === true;
          typingMode = (0, typing_mode_js_1.resolveTypingMode)({
            configured:
              (_a =
                sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.typingMode) !==
                null && _a !== void 0
                ? _a
                : agentCfg === null || agentCfg === void 0
                  ? void 0
                  : agentCfg.typingMode,
            isGroupChat: isGroupChat,
            wasMentioned: wasMentioned,
            isHeartbeat: isHeartbeat,
          });
          shouldInjectGroupIntro = Boolean(
            isGroupChat &&
            (isFirstTurnInSession ||
              (sessionEntry === null || sessionEntry === void 0
                ? void 0
                : sessionEntry.groupActivationNeedsSystemIntro)),
          );
          groupIntro = shouldInjectGroupIntro
            ? (0, groups_js_1.buildGroupIntro)({
                cfg: cfg,
                sessionCtx: sessionCtx,
                sessionEntry: sessionEntry,
                defaultActivation: defaultActivation,
                silentToken: tokens_js_1.SILENT_REPLY_TOKEN,
              })
            : "";
          groupSystemPrompt =
            (_c =
              (_b = sessionCtx.GroupSystemPrompt) === null || _b === void 0
                ? void 0
                : _b.trim()) !== null && _c !== void 0
              ? _c
              : "";
          extraSystemPrompt = [groupIntro, groupSystemPrompt].filter(Boolean).join("\n\n");
          baseBody =
            (_e =
              (_d = sessionCtx.BodyStripped) !== null && _d !== void 0 ? _d : sessionCtx.Body) !==
              null && _e !== void 0
              ? _e
              : "";
          rawBodyTrimmed = (
            (_h =
              (_g = (_f = ctx.CommandBody) !== null && _f !== void 0 ? _f : ctx.RawBody) !== null &&
              _g !== void 0
                ? _g
                : ctx.Body) !== null && _h !== void 0
              ? _h
              : ""
          ).trim();
          baseBodyTrimmedRaw = baseBody.trim();
          if (
            allowTextCommands &&
            (!commandAuthorized || !command.isAuthorizedSender) &&
            !baseBodyTrimmedRaw &&
            (0, command_detection_js_1.hasControlCommand)(commandSource, cfg)
          ) {
            typing.cleanup();
            return [2 /*return*/, undefined];
          }
          isBareNewOrReset = rawBodyTrimmed === "/new" || rawBodyTrimmed === "/reset";
          isBareSessionReset =
            isNewSession &&
            ((baseBodyTrimmedRaw.length === 0 && rawBodyTrimmed.length > 0) || isBareNewOrReset);
          baseBodyFinal = isBareSessionReset ? BARE_SESSION_RESET_PROMPT : baseBody;
          baseBodyTrimmed = baseBodyFinal.trim();
          if (!!baseBodyTrimmed) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, typing.onReplyStart()];
        case 1:
          _0.sent();
          (0, globals_js_1.logVerbose)(
            "Inbound body empty after normalization; skipping agent run",
          );
          typing.cleanup();
          return [
            2 /*return*/,
            {
              text: "I didn't receive any text in your message. Please resend or add a caption.",
            },
          ];
        case 2:
          return [
            4 /*yield*/,
            (0, body_js_1.applySessionHints)({
              baseBody: baseBodyFinal,
              abortedLastRun: abortedLastRun,
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
              abortKey: command.abortKey,
              messageId: sessionCtx.MessageSid,
            }),
          ];
        case 3:
          prefixedBodyBase = _0.sent();
          isGroupSession =
            (sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.chatType) ===
              "group" ||
            (sessionEntry === null || sessionEntry === void 0 ? void 0 : sessionEntry.chatType) ===
              "channel";
          isMainSession =
            !isGroupSession &&
            sessionKey ===
              (0, session_key_js_1.normalizeMainKey)(
                sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.mainKey,
              );
          return [
            4 /*yield*/,
            (0, session_updates_js_1.prependSystemEvents)({
              cfg: cfg,
              sessionKey: sessionKey,
              isMainSession: isMainSession,
              isNewSession: isNewSession,
              prefixedBodyBase: prefixedBodyBase,
            }),
          ];
        case 4:
          prefixedBodyBase = _0.sent();
          threadStarterBody =
            (_j = ctx.ThreadStarterBody) === null || _j === void 0 ? void 0 : _j.trim();
          threadStarterNote =
            isNewSession && threadStarterBody
              ? "[Thread starter - for context]\n".concat(threadStarterBody)
              : undefined;
          return [
            4 /*yield*/,
            (0, session_updates_js_1.ensureSkillSnapshot)({
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
              sessionId: sessionId,
              isFirstTurnInSession: isFirstTurnInSession,
              workspaceDir: workspaceDir,
              cfg: cfg,
              skillFilter: opts === null || opts === void 0 ? void 0 : opts.skillFilter,
            }),
          ];
        case 5:
          skillResult = _0.sent();
          sessionEntry =
            (_k = skillResult.sessionEntry) !== null && _k !== void 0 ? _k : sessionEntry;
          currentSystemSent = skillResult.systemSent;
          skillsSnapshot = skillResult.skillsSnapshot;
          prefixedBody = [threadStarterNote, prefixedBodyBase].filter(Boolean).join("\n\n");
          mediaNote = (0, media_note_js_1.buildInboundMediaNote)(ctx);
          mediaReplyHint = mediaNote
            ? "To send an image back, prefer the message tool (media/path/filePath). If you must inline, use MEDIA:/path or MEDIA:https://example.com/image.jpg (spaces ok, quote if needed). Keep caption in the text body."
            : undefined;
          prefixedCommandBody = mediaNote
            ? [
                mediaNote,
                mediaReplyHint,
                prefixedBody !== null && prefixedBody !== void 0 ? prefixedBody : "",
              ]
                .filter(Boolean)
                .join("\n")
                .trim()
            : prefixedBody;
          if (!resolvedThinkLevel && prefixedCommandBody) {
            parts = prefixedCommandBody.split(/\s+/);
            maybeLevel = (0, thinking_js_1.normalizeThinkLevel)(parts[0]);
            if (
              maybeLevel &&
              (maybeLevel !== "xhigh" || (0, thinking_js_1.supportsXHighThinking)(provider, model))
            ) {
              resolvedThinkLevel = maybeLevel;
              prefixedCommandBody = parts.slice(1).join(" ").trim();
            }
          }
          if (!!resolvedThinkLevel) {
            return [3 /*break*/, 7];
          }
          return [4 /*yield*/, modelState.resolveDefaultThinkingLevel()];
        case 6:
          resolvedThinkLevel = _0.sent();
          _0.label = 7;
        case 7:
          if (
            !(
              resolvedThinkLevel === "xhigh" &&
              !(0, thinking_js_1.supportsXHighThinking)(provider, model)
            )
          ) {
            return [3 /*break*/, 9];
          }
          explicitThink = directives.hasThinkDirective && directives.thinkLevel !== undefined;
          if (explicitThink) {
            typing.cleanup();
            return [
              2 /*return*/,
              {
                text: 'Thinking level "xhigh" is only supported for '.concat(
                  (0, thinking_js_1.formatXHighModelHint)(),
                  ". Use /think high or switch to one of those models.",
                ),
              },
            ];
          }
          resolvedThinkLevel = "high";
          if (
            !(sessionEntry && sessionStore && sessionKey && sessionEntry.thinkingLevel === "xhigh")
          ) {
            return [3 /*break*/, 9];
          }
          sessionEntry.thinkingLevel = "high";
          sessionEntry.updatedAt = Date.now();
          sessionStore[sessionKey] = sessionEntry;
          if (!storePath) {
            return [3 /*break*/, 9];
          }
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
              store[sessionKey] = sessionEntry;
            }),
          ];
        case 8:
          _0.sent();
          _0.label = 9;
        case 9:
          if (!(resetTriggered && command.isAuthorizedSender)) {
            return [3 /*break*/, 11];
          }
          channel = ctx.OriginatingChannel || command.channel;
          to = ctx.OriginatingTo || command.from || command.to;
          if (!(channel && to)) {
            return [3 /*break*/, 11];
          }
          modelLabel = "".concat(provider, "/").concat(model);
          defaultLabel = "".concat(defaultProvider, "/").concat(defaultModel);
          text =
            modelLabel === defaultLabel
              ? "\u2705 New session started \u00B7 model: ".concat(modelLabel)
              : "\u2705 New session started \u00B7 model: "
                  .concat(modelLabel, " (default: ")
                  .concat(defaultLabel, ")");
          return [
            4 /*yield*/,
            (0, route_reply_js_1.routeReply)({
              payload: { text: text },
              channel: channel,
              to: to,
              sessionKey: sessionKey,
              accountId: ctx.AccountId,
              threadId: ctx.MessageThreadId,
              cfg: cfg,
            }),
          ];
        case 10:
          _0.sent();
          _0.label = 11;
        case 11:
          sessionIdFinal =
            sessionId !== null && sessionId !== void 0
              ? sessionId
              : node_crypto_1.default.randomUUID();
          sessionFile = (0, sessions_js_1.resolveSessionFilePath)(sessionIdFinal, sessionEntry);
          queueBodyBase = [threadStarterNote, baseBodyFinal].filter(Boolean).join("\n\n");
          queueMessageId =
            (_l = sessionCtx.MessageSid) === null || _l === void 0 ? void 0 : _l.trim();
          queueMessageIdHint = queueMessageId ? "[message_id: ".concat(queueMessageId, "]") : "";
          queueBodyWithId = queueMessageIdHint
            ? "".concat(queueBodyBase, "\n").concat(queueMessageIdHint)
            : queueBodyBase;
          queuedBody = mediaNote
            ? [mediaNote, mediaReplyHint, queueBodyWithId].filter(Boolean).join("\n").trim()
            : queueBodyWithId;
          resolvedQueue = (0, queue_js_1.resolveQueueSettings)({
            cfg: cfg,
            channel: sessionCtx.Provider,
            sessionEntry: sessionEntry,
            inlineMode: perMessageQueueMode,
            inlineOptions: perMessageQueueOptions,
          });
          sessionLaneKey = (0, pi_embedded_js_1.resolveEmbeddedSessionLane)(
            sessionKey !== null && sessionKey !== void 0 ? sessionKey : sessionIdFinal,
          );
          laneSize = (0, command_queue_js_1.getQueueSize)(sessionLaneKey);
          if (resolvedQueue.mode === "interrupt" && laneSize > 0) {
            cleared = (0, command_queue_js_1.clearCommandLane)(sessionLaneKey);
            aborted = (0, pi_embedded_js_1.abortEmbeddedPiRun)(sessionIdFinal);
            (0, globals_js_1.logVerbose)(
              "Interrupting "
                .concat(sessionLaneKey, " (cleared ")
                .concat(cleared, ", aborted=")
                .concat(aborted, ")"),
            );
          }
          queueKey = sessionKey !== null && sessionKey !== void 0 ? sessionKey : sessionIdFinal;
          isActive = (0, pi_embedded_js_1.isEmbeddedPiRunActive)(sessionIdFinal);
          isStreaming = (0, pi_embedded_js_1.isEmbeddedPiRunStreaming)(sessionIdFinal);
          shouldSteer = resolvedQueue.mode === "steer" || resolvedQueue.mode === "steer-backlog";
          shouldFollowup =
            resolvedQueue.mode === "followup" ||
            resolvedQueue.mode === "collect" ||
            resolvedQueue.mode === "steer-backlog";
          return [
            4 /*yield*/,
            (0, session_override_js_1.resolveSessionAuthProfileOverride)({
              cfg: cfg,
              provider: provider,
              agentDir: agentDir,
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
              isNewSession: isNewSession,
            }),
          ];
        case 12:
          authProfileId = _0.sent();
          authProfileIdSource =
            sessionEntry === null || sessionEntry === void 0
              ? void 0
              : sessionEntry.authProfileOverrideSource;
          followupRun = {
            prompt: queuedBody,
            messageId:
              (_m = sessionCtx.MessageSidFull) !== null && _m !== void 0
                ? _m
                : sessionCtx.MessageSid,
            summaryLine: baseBodyTrimmedRaw,
            enqueuedAt: Date.now(),
            // Originating channel for reply routing.
            originatingChannel: ctx.OriginatingChannel,
            originatingTo: ctx.OriginatingTo,
            originatingAccountId: ctx.AccountId,
            originatingThreadId: ctx.MessageThreadId,
            originatingChatType: ctx.ChatType,
            run: __assign(
              {
                agentId: agentId,
                agentDir: agentDir,
                sessionId: sessionIdFinal,
                sessionKey: sessionKey,
                messageProvider:
                  ((_o = sessionCtx.Provider) === null || _o === void 0
                    ? void 0
                    : _o.trim().toLowerCase()) || undefined,
                agentAccountId: sessionCtx.AccountId,
                groupId:
                  (_q =
                    (_p = (0, sessions_js_1.resolveGroupSessionKey)(sessionCtx)) === null ||
                    _p === void 0
                      ? void 0
                      : _p.id) !== null && _q !== void 0
                    ? _q
                    : undefined,
                groupChannel:
                  (_s =
                    (_r = sessionCtx.GroupChannel) === null || _r === void 0
                      ? void 0
                      : _r.trim()) !== null && _s !== void 0
                    ? _s
                    : (_t = sessionCtx.GroupSubject) === null || _t === void 0
                      ? void 0
                      : _t.trim(),
                groupSpace:
                  (_v =
                    (_u = sessionCtx.GroupSpace) === null || _u === void 0 ? void 0 : _u.trim()) !==
                    null && _v !== void 0
                    ? _v
                    : undefined,
                senderId:
                  ((_w = sessionCtx.SenderId) === null || _w === void 0 ? void 0 : _w.trim()) ||
                  undefined,
                senderName:
                  ((_x = sessionCtx.SenderName) === null || _x === void 0 ? void 0 : _x.trim()) ||
                  undefined,
                senderUsername:
                  ((_y = sessionCtx.SenderUsername) === null || _y === void 0
                    ? void 0
                    : _y.trim()) || undefined,
                senderE164:
                  ((_z = sessionCtx.SenderE164) === null || _z === void 0 ? void 0 : _z.trim()) ||
                  undefined,
                sessionFile: sessionFile,
                workspaceDir: workspaceDir,
                config: cfg,
                skillsSnapshot: skillsSnapshot,
                provider: provider,
                model: model,
                authProfileId: authProfileId,
                authProfileIdSource: authProfileIdSource,
                thinkLevel: resolvedThinkLevel,
                verboseLevel: resolvedVerboseLevel,
                reasoningLevel: resolvedReasoningLevel,
                elevatedLevel: resolvedElevatedLevel,
                execOverrides: execOverrides,
                bashElevated: {
                  enabled: elevatedEnabled,
                  allowed: elevatedAllowed,
                  defaultLevel:
                    resolvedElevatedLevel !== null && resolvedElevatedLevel !== void 0
                      ? resolvedElevatedLevel
                      : "off",
                },
                timeoutMs: timeoutMs,
                blockReplyBreak: resolvedBlockStreamingBreak,
                ownerNumbers: command.ownerList.length > 0 ? command.ownerList : undefined,
                extraSystemPrompt: extraSystemPrompt || undefined,
              },
              (0, provider_utils_js_1.isReasoningTagProvider)(provider)
                ? { enforceFinalTag: true }
                : {},
            ),
          };
          return [
            2 /*return*/,
            (0, agent_runner_js_1.runReplyAgent)({
              commandBody: prefixedCommandBody,
              followupRun: followupRun,
              queueKey: queueKey,
              resolvedQueue: resolvedQueue,
              shouldSteer: shouldSteer,
              shouldFollowup: shouldFollowup,
              isActive: isActive,
              isStreaming: isStreaming,
              opts: opts,
              typing: typing,
              sessionEntry: sessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              storePath: storePath,
              defaultModel: defaultModel,
              agentCfgContextTokens:
                agentCfg === null || agentCfg === void 0 ? void 0 : agentCfg.contextTokens,
              resolvedVerboseLevel:
                resolvedVerboseLevel !== null && resolvedVerboseLevel !== void 0
                  ? resolvedVerboseLevel
                  : "off",
              isNewSession: isNewSession,
              blockStreamingEnabled: blockStreamingEnabled,
              blockReplyChunking: blockReplyChunking,
              resolvedBlockStreamingBreak: resolvedBlockStreamingBreak,
              sessionCtx: sessionCtx,
              shouldInjectGroupIntro: shouldInjectGroupIntro,
              typingMode: typingMode,
            }),
          ];
      }
    });
  });
}
