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
exports.initSessionState = initSessionState;
var node_crypto_1 = require("node:crypto");
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var sessions_js_1 = require("../../config/sessions.js");
var session_key_js_1 = require("../../routing/session-key.js");
var command_auth_js_1 = require("../command-auth.js");
var chat_type_js_1 = require("../../channels/chat-type.js");
var mentions_js_1 = require("./mentions.js");
var inbound_sender_meta_js_1 = require("./inbound-sender-meta.js");
var inbound_text_js_1 = require("./inbound-text.js");
var delivery_context_js_1 = require("../../utils/delivery-context.js");
function forkSessionFromParent(params) {
  var _a;
  var parentSessionFile = (0, sessions_js_1.resolveSessionFilePath)(
    params.parentEntry.sessionId,
    params.parentEntry,
  );
  if (!parentSessionFile || !node_fs_1.default.existsSync(parentSessionFile)) {
    return null;
  }
  try {
    var manager = pi_coding_agent_1.SessionManager.open(parentSessionFile);
    var leafId = manager.getLeafId();
    if (leafId) {
      var sessionFile_1 =
        (_a = manager.createBranchedSession(leafId)) !== null && _a !== void 0
          ? _a
          : manager.getSessionFile();
      var sessionId_1 = manager.getSessionId();
      if (sessionFile_1 && sessionId_1) {
        return { sessionId: sessionId_1, sessionFile: sessionFile_1 };
      }
    }
    var sessionId = node_crypto_1.default.randomUUID();
    var timestamp = new Date().toISOString();
    var fileTimestamp = timestamp.replace(/[:.]/g, "-");
    var sessionFile = node_path_1.default.join(
      manager.getSessionDir(),
      "".concat(fileTimestamp, "_").concat(sessionId, ".jsonl"),
    );
    var header = {
      type: "session",
      version: pi_coding_agent_1.CURRENT_SESSION_VERSION,
      id: sessionId,
      timestamp: timestamp,
      cwd: manager.getCwd(),
      parentSession: parentSessionFile,
    };
    node_fs_1.default.writeFileSync(sessionFile, "".concat(JSON.stringify(header), "\n"), "utf-8");
    return { sessionId: sessionId, sessionFile: sessionFile };
  } catch (_b) {
    return null;
  }
}
function initSessionState(params) {
  return __awaiter(this, void 0, void 0, function () {
    var ctx,
      cfg,
      commandAuthorized,
      targetSessionKey,
      sessionCtxForState,
      sessionCfg,
      mainKey,
      agentId,
      groupResolution,
      resetTriggers,
      sessionScope,
      storePath,
      sessionStore,
      sessionKey,
      sessionEntry,
      sessionId,
      isNewSession,
      bodyStripped,
      systemSent,
      abortedLastRun,
      resetTriggered,
      persistedThinking,
      persistedVerbose,
      persistedReasoning,
      persistedTtsAuto,
      persistedModelOverride,
      persistedProviderOverride,
      normalizedChatType,
      isGroup,
      commandSource,
      triggerBodyNormalized,
      rawBody,
      trimmedBody,
      resetAuthorized,
      strippedForReset,
      trimmedBodyLower,
      strippedForResetLower,
      _i,
      resetTriggers_1,
      trigger,
      triggerLower,
      triggerPrefixLower,
      entry,
      previousSessionEntry,
      now,
      isThread,
      resetType,
      channelReset,
      resetPolicy,
      freshEntry,
      baseEntry,
      lastChannelRaw,
      lastToRaw,
      lastAccountIdRaw,
      lastThreadIdRaw,
      deliveryFields,
      lastChannel,
      lastTo,
      lastAccountId,
      lastThreadId,
      metaPatch,
      threadLabel,
      parentSessionKey,
      forked,
      sessionCtx;
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
          ((ctx = params.ctx), (cfg = params.cfg), (commandAuthorized = params.commandAuthorized));
          targetSessionKey =
            ctx.CommandSource === "native"
              ? (_a = ctx.CommandTargetSessionKey) === null || _a === void 0
                ? void 0
                : _a.trim()
              : undefined;
          sessionCtxForState =
            targetSessionKey && targetSessionKey !== ctx.SessionKey
              ? __assign(__assign({}, ctx), { SessionKey: targetSessionKey })
              : ctx;
          sessionCfg = cfg.session;
          mainKey = (0, session_key_js_1.normalizeMainKey)(
            sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.mainKey,
          );
          agentId = (0, agent_scope_js_1.resolveSessionAgentId)({
            sessionKey: sessionCtxForState.SessionKey,
            config: cfg,
          });
          groupResolution =
            (_b = (0, sessions_js_1.resolveGroupSessionKey)(sessionCtxForState)) !== null &&
            _b !== void 0
              ? _b
              : undefined;
          resetTriggers = (
            (_c =
              sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.resetTriggers) ===
              null || _c === void 0
              ? void 0
              : _c.length
          )
            ? sessionCfg.resetTriggers
            : sessions_js_1.DEFAULT_RESET_TRIGGERS;
          sessionScope =
            (_d = sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.scope) !==
              null && _d !== void 0
              ? _d
              : "per-sender";
          storePath = (0, sessions_js_1.resolveStorePath)(
            sessionCfg === null || sessionCfg === void 0 ? void 0 : sessionCfg.store,
            { agentId: agentId },
          );
          sessionStore = (0, sessions_js_1.loadSessionStore)(storePath);
          isNewSession = false;
          systemSent = false;
          abortedLastRun = false;
          resetTriggered = false;
          normalizedChatType = (0, chat_type_js_1.normalizeChatType)(ctx.ChatType);
          isGroup =
            normalizedChatType != null && normalizedChatType !== "direct"
              ? true
              : Boolean(groupResolution);
          commandSource =
            (_h =
              (_g =
                (_f =
                  (_e = ctx.BodyForCommands) !== null && _e !== void 0 ? _e : ctx.CommandBody) !==
                  null && _f !== void 0
                  ? _f
                  : ctx.RawBody) !== null && _g !== void 0
                ? _g
                : ctx.Body) !== null && _h !== void 0
              ? _h
              : "";
          triggerBodyNormalized = (0, mentions_js_1.stripStructuralPrefixes)(commandSource).trim();
          rawBody = commandSource;
          trimmedBody = rawBody.trim();
          resetAuthorized = (0, command_auth_js_1.resolveCommandAuthorization)({
            ctx: ctx,
            cfg: cfg,
            commandAuthorized: commandAuthorized,
          }).isAuthorizedSender;
          strippedForReset = isGroup
            ? (0, mentions_js_1.stripMentions)(triggerBodyNormalized, ctx, cfg, agentId)
            : triggerBodyNormalized;
          trimmedBodyLower = trimmedBody.toLowerCase();
          strippedForResetLower = strippedForReset.toLowerCase();
          for (_i = 0, resetTriggers_1 = resetTriggers; _i < resetTriggers_1.length; _i++) {
            trigger = resetTriggers_1[_i];
            if (!trigger) {
              continue;
            }
            if (!resetAuthorized) {
              break;
            }
            triggerLower = trigger.toLowerCase();
            if (trimmedBodyLower === triggerLower || strippedForResetLower === triggerLower) {
              isNewSession = true;
              bodyStripped = "";
              resetTriggered = true;
              break;
            }
            triggerPrefixLower = "".concat(triggerLower, " ");
            if (
              trimmedBodyLower.startsWith(triggerPrefixLower) ||
              strippedForResetLower.startsWith(triggerPrefixLower)
            ) {
              isNewSession = true;
              bodyStripped = strippedForReset.slice(trigger.length).trimStart();
              resetTriggered = true;
              break;
            }
          }
          sessionKey = (0, sessions_js_1.resolveSessionKey)(
            sessionScope,
            sessionCtxForState,
            mainKey,
          );
          entry = sessionStore[sessionKey];
          previousSessionEntry = resetTriggered && entry ? __assign({}, entry) : undefined;
          now = Date.now();
          isThread = (0, sessions_js_1.resolveThreadFlag)({
            sessionKey: sessionKey,
            messageThreadId: ctx.MessageThreadId,
            threadLabel: ctx.ThreadLabel,
            threadStarterBody: ctx.ThreadStarterBody,
            parentSessionKey: ctx.ParentSessionKey,
          });
          resetType = (0, sessions_js_1.resolveSessionResetType)({
            sessionKey: sessionKey,
            isGroup: isGroup,
            isThread: isThread,
          });
          channelReset = (0, sessions_js_1.resolveChannelResetConfig)({
            sessionCfg: sessionCfg,
            channel:
              (_l =
                (_k =
                  (_j =
                    groupResolution === null || groupResolution === void 0
                      ? void 0
                      : groupResolution.channel) !== null && _j !== void 0
                    ? _j
                    : ctx.OriginatingChannel) !== null && _k !== void 0
                  ? _k
                  : ctx.Surface) !== null && _l !== void 0
                ? _l
                : ctx.Provider,
          });
          resetPolicy = (0, sessions_js_1.resolveSessionResetPolicy)({
            sessionCfg: sessionCfg,
            resetType: resetType,
            resetOverride: channelReset,
          });
          freshEntry = entry
            ? (0, sessions_js_1.evaluateSessionFreshness)({
                updatedAt: entry.updatedAt,
                now: now,
                policy: resetPolicy,
              }).fresh
            : false;
          if (!isNewSession && freshEntry) {
            sessionId = entry.sessionId;
            systemSent = (_m = entry.systemSent) !== null && _m !== void 0 ? _m : false;
            abortedLastRun = (_o = entry.abortedLastRun) !== null && _o !== void 0 ? _o : false;
            persistedThinking = entry.thinkingLevel;
            persistedVerbose = entry.verboseLevel;
            persistedReasoning = entry.reasoningLevel;
            persistedTtsAuto = entry.ttsAuto;
            persistedModelOverride = entry.modelOverride;
            persistedProviderOverride = entry.providerOverride;
          } else {
            sessionId = node_crypto_1.default.randomUUID();
            isNewSession = true;
            systemSent = false;
            abortedLastRun = false;
          }
          baseEntry = !isNewSession && freshEntry ? entry : undefined;
          lastChannelRaw =
            ctx.OriginatingChannel ||
            (baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.lastChannel);
          lastToRaw =
            ctx.OriginatingTo ||
            ctx.To ||
            (baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.lastTo);
          lastAccountIdRaw =
            ctx.AccountId ||
            (baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.lastAccountId);
          lastThreadIdRaw =
            ctx.MessageThreadId ||
            (baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.lastThreadId);
          deliveryFields = (0, delivery_context_js_1.normalizeSessionDeliveryFields)({
            deliveryContext: {
              channel: lastChannelRaw,
              to: lastToRaw,
              accountId: lastAccountIdRaw,
              threadId: lastThreadIdRaw,
            },
          });
          lastChannel =
            (_p = deliveryFields.lastChannel) !== null && _p !== void 0 ? _p : lastChannelRaw;
          lastTo = (_q = deliveryFields.lastTo) !== null && _q !== void 0 ? _q : lastToRaw;
          lastAccountId =
            (_r = deliveryFields.lastAccountId) !== null && _r !== void 0 ? _r : lastAccountIdRaw;
          lastThreadId =
            (_s = deliveryFields.lastThreadId) !== null && _s !== void 0 ? _s : lastThreadIdRaw;
          sessionEntry = __assign(__assign({}, baseEntry), {
            sessionId: sessionId,
            updatedAt: Date.now(),
            systemSent: systemSent,
            abortedLastRun: abortedLastRun,
            // Persist previously stored thinking/verbose levels when present.
            thinkingLevel:
              persistedThinking !== null && persistedThinking !== void 0
                ? persistedThinking
                : baseEntry === null || baseEntry === void 0
                  ? void 0
                  : baseEntry.thinkingLevel,
            verboseLevel:
              persistedVerbose !== null && persistedVerbose !== void 0
                ? persistedVerbose
                : baseEntry === null || baseEntry === void 0
                  ? void 0
                  : baseEntry.verboseLevel,
            reasoningLevel:
              persistedReasoning !== null && persistedReasoning !== void 0
                ? persistedReasoning
                : baseEntry === null || baseEntry === void 0
                  ? void 0
                  : baseEntry.reasoningLevel,
            ttsAuto:
              persistedTtsAuto !== null && persistedTtsAuto !== void 0
                ? persistedTtsAuto
                : baseEntry === null || baseEntry === void 0
                  ? void 0
                  : baseEntry.ttsAuto,
            responseUsage:
              baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.responseUsage,
            modelOverride:
              persistedModelOverride !== null && persistedModelOverride !== void 0
                ? persistedModelOverride
                : baseEntry === null || baseEntry === void 0
                  ? void 0
                  : baseEntry.modelOverride,
            providerOverride:
              persistedProviderOverride !== null && persistedProviderOverride !== void 0
                ? persistedProviderOverride
                : baseEntry === null || baseEntry === void 0
                  ? void 0
                  : baseEntry.providerOverride,
            sendPolicy: baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.sendPolicy,
            queueMode: baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.queueMode,
            queueDebounceMs:
              baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.queueDebounceMs,
            queueCap: baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.queueCap,
            queueDrop: baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.queueDrop,
            displayName:
              baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.displayName,
            chatType: baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.chatType,
            channel: baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.channel,
            groupId: baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.groupId,
            subject: baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.subject,
            groupChannel:
              baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.groupChannel,
            space: baseEntry === null || baseEntry === void 0 ? void 0 : baseEntry.space,
            deliveryContext: deliveryFields.deliveryContext,
            // Track originating channel for subagent announce routing.
            lastChannel: lastChannel,
            lastTo: lastTo,
            lastAccountId: lastAccountId,
            lastThreadId: lastThreadId,
          });
          metaPatch = (0, sessions_js_1.deriveSessionMetaPatch)({
            ctx: sessionCtxForState,
            sessionKey: sessionKey,
            existing: sessionEntry,
            groupResolution: groupResolution,
          });
          if (metaPatch) {
            sessionEntry = __assign(__assign({}, sessionEntry), metaPatch);
          }
          if (!sessionEntry.chatType) {
            sessionEntry.chatType = "direct";
          }
          threadLabel = (_t = ctx.ThreadLabel) === null || _t === void 0 ? void 0 : _t.trim();
          if (threadLabel) {
            sessionEntry.displayName = threadLabel;
          }
          parentSessionKey =
            (_u = ctx.ParentSessionKey) === null || _u === void 0 ? void 0 : _u.trim();
          if (
            isNewSession &&
            parentSessionKey &&
            parentSessionKey !== sessionKey &&
            sessionStore[parentSessionKey]
          ) {
            forked = forkSessionFromParent({
              parentEntry: sessionStore[parentSessionKey],
            });
            if (forked) {
              sessionId = forked.sessionId;
              sessionEntry.sessionId = forked.sessionId;
              sessionEntry.sessionFile = forked.sessionFile;
            }
          }
          if (!sessionEntry.sessionFile) {
            sessionEntry.sessionFile = (0, sessions_js_1.resolveSessionTranscriptPath)(
              sessionEntry.sessionId,
              agentId,
              ctx.MessageThreadId,
            );
          }
          if (isNewSession) {
            sessionEntry.compactionCount = 0;
            sessionEntry.memoryFlushCompactionCount = undefined;
            sessionEntry.memoryFlushAt = undefined;
          }
          // Preserve per-session overrides while resetting compaction state on /new.
          sessionStore[sessionKey] = __assign(__assign({}, sessionStore[sessionKey]), sessionEntry);
          return [
            4 /*yield*/,
            (0, sessions_js_1.updateSessionStore)(storePath, function (store) {
              // Preserve per-session overrides while resetting compaction state on /new.
              store[sessionKey] = __assign(__assign({}, store[sessionKey]), sessionEntry);
            }),
          ];
        case 1:
          _0.sent();
          sessionCtx = __assign(__assign({}, ctx), {
            // Keep BodyStripped aligned with Body (best default for agent prompts).
            // RawBody is reserved for command/directive parsing and may omit context.
            BodyStripped: (0, inbound_sender_meta_js_1.formatInboundBodyWithSenderMeta)({
              ctx: ctx,
              body: (0, inbound_text_js_1.normalizeInboundTextNewlines)(
                (_z =
                  (_y =
                    (_x =
                      (_w =
                        (_v =
                          bodyStripped !== null && bodyStripped !== void 0
                            ? bodyStripped
                            : ctx.BodyForAgent) !== null && _v !== void 0
                          ? _v
                          : ctx.Body) !== null && _w !== void 0
                        ? _w
                        : ctx.CommandBody) !== null && _x !== void 0
                      ? _x
                      : ctx.RawBody) !== null && _y !== void 0
                    ? _y
                    : ctx.BodyForCommands) !== null && _z !== void 0
                  ? _z
                  : "",
              ),
            }),
            SessionId: sessionId,
            IsNewSession: isNewSession ? "true" : "false",
          });
          return [
            2 /*return*/,
            {
              sessionCtx: sessionCtx,
              sessionEntry: sessionEntry,
              previousSessionEntry: previousSessionEntry,
              sessionStore: sessionStore,
              sessionKey: sessionKey,
              sessionId:
                sessionId !== null && sessionId !== void 0
                  ? sessionId
                  : node_crypto_1.default.randomUUID(),
              isNewSession: isNewSession,
              resetTriggered: resetTriggered,
              systemSent: systemSent,
              abortedLastRun: abortedLastRun,
              storePath: storePath,
              sessionScope: sessionScope,
              groupResolution: groupResolution,
              isGroup: isGroup,
              bodyStripped: bodyStripped,
              triggerBodyNormalized: triggerBodyNormalized,
            },
          ];
      }
    });
  });
}
