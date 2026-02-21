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
exports.getToolResult = getToolResult;
exports.runMessageAction = runMessageAction;
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var common_js_1 = require("../../agents/tools/common.js");
var agent_scope_js_1 = require("../../agents/agent-scope.js");
var reply_directives_js_1 = require("../../auto-reply/reply/reply-directives.js");
var message_actions_js_1 = require("../../channels/plugins/message-actions.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var channel_selection_js_1 = require("./channel-selection.js");
var channel_target_js_1 = require("./channel-target.js");
var outbound_session_js_1 = require("./outbound-session.js");
var outbound_policy_js_1 = require("./outbound-policy.js");
var outbound_send_service_js_1 = require("./outbound-send-service.js");
var message_action_spec_js_1 = require("./message-action-spec.js");
var target_resolver_js_1 = require("./target-resolver.js");
var media_js_1 = require("../../web/media.js");
var mime_js_1 = require("../../media/mime.js");
var targets_js_1 = require("../../slack/targets.js");
function getToolResult(result) {
  return "toolResult" in result ? result.toolResult : undefined;
}
function extractToolPayload(result) {
  var _a;
  if (result.details !== undefined) {
    return result.details;
  }
  var textBlock = Array.isArray(result.content)
    ? result.content.find(function (block) {
        return (
          block &&
          typeof block === "object" &&
          block.type === "text" &&
          typeof block.text === "string"
        );
      })
    : undefined;
  var text = textBlock === null || textBlock === void 0 ? void 0 : textBlock.text;
  if (text) {
    try {
      return JSON.parse(text);
    } catch (_b) {
      return text;
    }
  }
  return (_a = result.content) !== null && _a !== void 0 ? _a : result;
}
function applyCrossContextMessageDecoration(_a) {
  var _b;
  var params = _a.params,
    message = _a.message,
    decoration = _a.decoration,
    preferEmbeds = _a.preferEmbeds;
  var applied = (0, outbound_policy_js_1.applyCrossContextDecoration)({
    message: message,
    decoration: decoration,
    preferEmbeds: preferEmbeds,
  });
  params.message = applied.message;
  if ((_b = applied.embeds) === null || _b === void 0 ? void 0 : _b.length) {
    params.embeds = applied.embeds;
  }
  return applied.message;
}
function maybeApplyCrossContextMarker(params) {
  return __awaiter(this, void 0, void 0, function () {
    var decoration;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (
            !(0, outbound_policy_js_1.shouldApplyCrossContextMarker)(params.action) ||
            !params.toolContext
          ) {
            return [2 /*return*/, params.message];
          }
          return [
            4 /*yield*/,
            (0, outbound_policy_js_1.buildCrossContextDecoration)({
              cfg: params.cfg,
              channel: params.channel,
              target: params.target,
              toolContext: params.toolContext,
              accountId: (_a = params.accountId) !== null && _a !== void 0 ? _a : undefined,
            }),
          ];
        case 1:
          decoration = _b.sent();
          if (!decoration) {
            return [2 /*return*/, params.message];
          }
          return [
            2 /*return*/,
            applyCrossContextMessageDecoration({
              params: params.args,
              message: params.message,
              decoration: decoration,
              preferEmbeds: params.preferEmbeds,
            }),
          ];
      }
    });
  });
}
function readBooleanParam(params, key) {
  var raw = params[key];
  if (typeof raw === "boolean") {
    return raw;
  }
  if (typeof raw === "string") {
    var trimmed = raw.trim().toLowerCase();
    if (trimmed === "true") {
      return true;
    }
    if (trimmed === "false") {
      return false;
    }
  }
  return undefined;
}
function resolveSlackAutoThreadId(params) {
  var _a;
  var context = params.toolContext;
  if (
    !(context === null || context === void 0 ? void 0 : context.currentThreadTs) ||
    !context.currentChannelId
  ) {
    return undefined;
  }
  // Only mirror auto-threading when Slack would reply in the active thread for this channel.
  if (context.replyToMode !== "all" && context.replyToMode !== "first") {
    return undefined;
  }
  var parsedTarget = (0, targets_js_1.parseSlackTarget)(params.to, { defaultKind: "channel" });
  if (!parsedTarget || parsedTarget.kind !== "channel") {
    return undefined;
  }
  if (parsedTarget.id.toLowerCase() !== context.currentChannelId.toLowerCase()) {
    return undefined;
  }
  if (
    context.replyToMode === "first" &&
    ((_a = context.hasRepliedRef) === null || _a === void 0 ? void 0 : _a.value)
  ) {
    return undefined;
  }
  return context.currentThreadTs;
}
function resolveAttachmentMaxBytes(params) {
  var _a, _b, _c, _d, _e, _f, _g;
  var fallback =
    (_b = (_a = params.cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) === null ||
    _b === void 0
      ? void 0
      : _b.mediaMaxMb;
  if (params.channel !== "bluebubbles") {
    return typeof fallback === "number" ? fallback * 1024 * 1024 : undefined;
  }
  var accountId = typeof params.accountId === "string" ? params.accountId.trim() : "";
  var channelCfg = (_c = params.cfg.channels) === null || _c === void 0 ? void 0 : _c.bluebubbles;
  var channelObj = channelCfg && typeof channelCfg === "object" ? channelCfg : undefined;
  var channelMediaMax =
    typeof (channelObj === null || channelObj === void 0 ? void 0 : channelObj.mediaMaxMb) ===
    "number"
      ? channelObj.mediaMaxMb
      : undefined;
  var accountsObj =
    (channelObj === null || channelObj === void 0 ? void 0 : channelObj.accounts) &&
    typeof channelObj.accounts === "object"
      ? channelObj.accounts
      : undefined;
  var accountCfg = accountId && accountsObj ? accountsObj[accountId] : undefined;
  var accountMediaMax =
    accountCfg && typeof accountCfg === "object" ? accountCfg.mediaMaxMb : undefined;
  var limitMb =
    (_e =
      (_d = typeof accountMediaMax === "number" ? accountMediaMax : undefined) !== null &&
      _d !== void 0
        ? _d
        : channelMediaMax) !== null && _e !== void 0
      ? _e
      : (_g = (_f = params.cfg.agents) === null || _f === void 0 ? void 0 : _f.defaults) === null ||
          _g === void 0
        ? void 0
        : _g.mediaMaxMb;
  return typeof limitMb === "number" ? limitMb * 1024 * 1024 : undefined;
}
function inferAttachmentFilename(params) {
  var _a;
  var mediaHint = (_a = params.mediaHint) === null || _a === void 0 ? void 0 : _a.trim();
  if (mediaHint) {
    try {
      if (mediaHint.startsWith("file://")) {
        var filePath = (0, node_url_1.fileURLToPath)(mediaHint);
        var base = node_path_1.default.basename(filePath);
        if (base) {
          return base;
        }
      } else if (/^https?:\/\//i.test(mediaHint)) {
        var url = new URL(mediaHint);
        var base = node_path_1.default.basename(url.pathname);
        if (base) {
          return base;
        }
      } else {
        var base = node_path_1.default.basename(mediaHint);
        if (base) {
          return base;
        }
      }
    } catch (_b) {
      // fall through to content-type based default
    }
  }
  var ext = params.contentType ? (0, mime_js_1.extensionForMime)(params.contentType) : undefined;
  return ext ? "attachment".concat(ext) : "attachment";
}
function normalizeBase64Payload(params) {
  var _a;
  if (!params.base64) {
    return { base64: params.base64, contentType: params.contentType };
  }
  var match = /^data:([^;]+);base64,(.*)$/i.exec(params.base64.trim());
  if (!match) {
    return { base64: params.base64, contentType: params.contentType };
  }
  var mime = match[1],
    payload = match[2];
  return {
    base64: payload,
    contentType: (_a = params.contentType) !== null && _a !== void 0 ? _a : mime,
  };
}
function hydrateSetGroupIconParams(params) {
  return __awaiter(this, void 0, void 0, function () {
    var mediaHint,
      fileHint,
      contentTypeParam,
      rawBuffer,
      normalized,
      filename,
      mediaSource,
      maxBytes,
      media;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          if (params.action !== "setGroupIcon") {
            return [2 /*return*/];
          }
          mediaHint = (0, common_js_1.readStringParam)(params.args, "media", { trim: false });
          fileHint =
            (_a = (0, common_js_1.readStringParam)(params.args, "path", { trim: false })) !==
              null && _a !== void 0
              ? _a
              : (0, common_js_1.readStringParam)(params.args, "filePath", { trim: false });
          contentTypeParam =
            (_b = (0, common_js_1.readStringParam)(params.args, "contentType")) !== null &&
            _b !== void 0
              ? _b
              : (0, common_js_1.readStringParam)(params.args, "mimeType");
          rawBuffer = (0, common_js_1.readStringParam)(params.args, "buffer", { trim: false });
          normalized = normalizeBase64Payload({
            base64: rawBuffer,
            contentType:
              contentTypeParam !== null && contentTypeParam !== void 0
                ? contentTypeParam
                : undefined,
          });
          if (normalized.base64 !== rawBuffer && normalized.base64) {
            params.args.buffer = normalized.base64;
            if (normalized.contentType && !contentTypeParam) {
              params.args.contentType = normalized.contentType;
            }
          }
          filename = (0, common_js_1.readStringParam)(params.args, "filename");
          mediaSource = mediaHint !== null && mediaHint !== void 0 ? mediaHint : fileHint;
          if (
            !(
              !params.dryRun &&
              !(0, common_js_1.readStringParam)(params.args, "buffer", { trim: false }) &&
              mediaSource
            )
          ) {
            return [3 /*break*/, 2];
          }
          maxBytes = resolveAttachmentMaxBytes({
            cfg: params.cfg,
            channel: params.channel,
            accountId: params.accountId,
          });
          return [4 /*yield*/, (0, media_js_1.loadWebMedia)(mediaSource, maxBytes)];
        case 1:
          media = _f.sent();
          params.args.buffer = media.buffer.toString("base64");
          if (!contentTypeParam && media.contentType) {
            params.args.contentType = media.contentType;
          }
          if (!filename) {
            params.args.filename = inferAttachmentFilename({
              mediaHint: (_c = media.fileName) !== null && _c !== void 0 ? _c : mediaSource,
              contentType:
                (_e =
                  (_d = media.contentType) !== null && _d !== void 0 ? _d : contentTypeParam) !==
                  null && _e !== void 0
                  ? _e
                  : undefined,
            });
          }
          return [3 /*break*/, 3];
        case 2:
          if (!filename) {
            params.args.filename = inferAttachmentFilename({
              mediaHint: mediaSource,
              contentType:
                contentTypeParam !== null && contentTypeParam !== void 0
                  ? contentTypeParam
                  : undefined,
            });
          }
          _f.label = 3;
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function hydrateSendAttachmentParams(params) {
  return __awaiter(this, void 0, void 0, function () {
    var mediaHint,
      fileHint,
      contentTypeParam,
      caption,
      message,
      rawBuffer,
      normalized,
      filename,
      mediaSource,
      maxBytes,
      media;
    var _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          if (params.action !== "sendAttachment") {
            return [2 /*return*/];
          }
          mediaHint = (0, common_js_1.readStringParam)(params.args, "media", { trim: false });
          fileHint =
            (_a = (0, common_js_1.readStringParam)(params.args, "path", { trim: false })) !==
              null && _a !== void 0
              ? _a
              : (0, common_js_1.readStringParam)(params.args, "filePath", { trim: false });
          contentTypeParam =
            (_b = (0, common_js_1.readStringParam)(params.args, "contentType")) !== null &&
            _b !== void 0
              ? _b
              : (0, common_js_1.readStringParam)(params.args, "mimeType");
          caption =
            (_c = (0, common_js_1.readStringParam)(params.args, "caption", {
              allowEmpty: true,
            })) === null || _c === void 0
              ? void 0
              : _c.trim();
          message =
            (_d = (0, common_js_1.readStringParam)(params.args, "message", {
              allowEmpty: true,
            })) === null || _d === void 0
              ? void 0
              : _d.trim();
          if (!caption && message) {
            params.args.caption = message;
          }
          rawBuffer = (0, common_js_1.readStringParam)(params.args, "buffer", { trim: false });
          normalized = normalizeBase64Payload({
            base64: rawBuffer,
            contentType:
              contentTypeParam !== null && contentTypeParam !== void 0
                ? contentTypeParam
                : undefined,
          });
          if (normalized.base64 !== rawBuffer && normalized.base64) {
            params.args.buffer = normalized.base64;
            if (normalized.contentType && !contentTypeParam) {
              params.args.contentType = normalized.contentType;
            }
          }
          filename = (0, common_js_1.readStringParam)(params.args, "filename");
          mediaSource = mediaHint !== null && mediaHint !== void 0 ? mediaHint : fileHint;
          if (
            !(
              !params.dryRun &&
              !(0, common_js_1.readStringParam)(params.args, "buffer", { trim: false }) &&
              mediaSource
            )
          ) {
            return [3 /*break*/, 2];
          }
          maxBytes = resolveAttachmentMaxBytes({
            cfg: params.cfg,
            channel: params.channel,
            accountId: params.accountId,
          });
          return [4 /*yield*/, (0, media_js_1.loadWebMedia)(mediaSource, maxBytes)];
        case 1:
          media = _h.sent();
          params.args.buffer = media.buffer.toString("base64");
          if (!contentTypeParam && media.contentType) {
            params.args.contentType = media.contentType;
          }
          if (!filename) {
            params.args.filename = inferAttachmentFilename({
              mediaHint: (_e = media.fileName) !== null && _e !== void 0 ? _e : mediaSource,
              contentType:
                (_g =
                  (_f = media.contentType) !== null && _f !== void 0 ? _f : contentTypeParam) !==
                  null && _g !== void 0
                  ? _g
                  : undefined,
            });
          }
          return [3 /*break*/, 3];
        case 2:
          if (!filename) {
            params.args.filename = inferAttachmentFilename({
              mediaHint: mediaSource,
              contentType:
                contentTypeParam !== null && contentTypeParam !== void 0
                  ? contentTypeParam
                  : undefined,
            });
          }
          _h.label = 3;
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function parseButtonsParam(params) {
  var raw = params.buttons;
  if (typeof raw !== "string") {
    return;
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    delete params.buttons;
    return;
  }
  try {
    params.buttons = JSON.parse(trimmed);
  } catch (_a) {
    throw new Error("--buttons must be valid JSON", { cause: _a });
  }
}
function parseCardParam(params) {
  var raw = params.card;
  if (typeof raw !== "string") {
    return;
  }
  var trimmed = raw.trim();
  if (!trimmed) {
    delete params.card;
    return;
  }
  try {
    params.card = JSON.parse(trimmed);
  } catch (_a) {
    throw new Error("--card must be valid JSON", { cause: _a });
  }
}
function resolveChannel(cfg, params) {
  return __awaiter(this, void 0, void 0, function () {
    var channelHint, selection;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          channelHint = (0, common_js_1.readStringParam)(params, "channel");
          return [
            4 /*yield*/,
            (0, channel_selection_js_1.resolveMessageChannelSelection)({
              cfg: cfg,
              channel: channelHint,
            }),
          ];
        case 1:
          selection = _a.sent();
          return [2 /*return*/, selection.channel];
      }
    });
  });
}
function resolveActionTarget(params) {
  return __awaiter(this, void 0, void 0, function () {
    var resolvedTarget, toRaw, resolved, channelIdRaw, resolved;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          toRaw = typeof params.args.to === "string" ? params.args.to.trim() : "";
          if (!toRaw) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, target_resolver_js_1.resolveChannelTarget)({
              cfg: params.cfg,
              channel: params.channel,
              input: toRaw,
              accountId: (_a = params.accountId) !== null && _a !== void 0 ? _a : undefined,
            }),
          ];
        case 1:
          resolved = _c.sent();
          if (resolved.ok) {
            params.args.to = resolved.target.to;
            resolvedTarget = resolved.target;
          } else {
            throw resolved.error;
          }
          _c.label = 2;
        case 2:
          channelIdRaw =
            typeof params.args.channelId === "string" ? params.args.channelId.trim() : "";
          if (!channelIdRaw) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            (0, target_resolver_js_1.resolveChannelTarget)({
              cfg: params.cfg,
              channel: params.channel,
              input: channelIdRaw,
              accountId: (_b = params.accountId) !== null && _b !== void 0 ? _b : undefined,
              preferredKind: "group",
            }),
          ];
        case 3:
          resolved = _c.sent();
          if (resolved.ok) {
            if (resolved.target.kind === "user") {
              throw new Error('Channel id "'.concat(channelIdRaw, '" resolved to a user target.'));
            }
            params.args.channelId = resolved.target.to.replace(/^(channel|group):/i, "");
          } else {
            throw resolved.error;
          }
          _c.label = 4;
        case 4:
          return [2 /*return*/, resolvedTarget];
      }
    });
  });
}
function resolveGateway(input) {
  if (!input.gateway) {
    return undefined;
  }
  return {
    url: input.gateway.url,
    token: input.gateway.token,
    timeoutMs: input.gateway.timeoutMs,
    clientName: input.gateway.clientName,
    clientDisplayName: input.gateway.clientDisplayName,
    mode: input.gateway.mode,
  };
}
function handleBroadcastAction(input, params) {
  return __awaiter(this, void 0, void 0, function () {
    var broadcastEnabled,
      rawTargets,
      channelHint,
      configured,
      targetChannels,
      _a,
      results,
      isAbortError,
      _i,
      targetChannels_1,
      targetChannel,
      _b,
      rawTargets_1,
      target,
      resolved,
      sendResult,
      err_1;
    var _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          throwIfAborted(input.abortSignal);
          broadcastEnabled =
            ((_e =
              (_d = (_c = input.cfg.tools) === null || _c === void 0 ? void 0 : _c.message) ===
                null || _d === void 0
                ? void 0
                : _d.broadcast) === null || _e === void 0
              ? void 0
              : _e.enabled) !== false;
          if (!broadcastEnabled) {
            throw new Error("Broadcast is disabled. Set tools.message.broadcast.enabled to true.");
          }
          rawTargets =
            (_f = (0, common_js_1.readStringArrayParam)(params, "targets", { required: true })) !==
              null && _f !== void 0
              ? _f
              : [];
          if (rawTargets.length === 0) {
            throw new Error("Broadcast requires at least one target in --targets.");
          }
          channelHint = (0, common_js_1.readStringParam)(params, "channel");
          return [
            4 /*yield*/,
            (0, channel_selection_js_1.listConfiguredMessageChannels)(input.cfg),
          ];
        case 1:
          configured = _h.sent();
          if (configured.length === 0) {
            throw new Error("Broadcast requires at least one configured channel.");
          }
          if (!(channelHint && channelHint.trim().toLowerCase() !== "all")) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, resolveChannel(input.cfg, { channel: channelHint })];
        case 2:
          _a = [_h.sent()];
          return [3 /*break*/, 4];
        case 3:
          _a = configured;
          _h.label = 4;
        case 4:
          targetChannels = _a;
          results = [];
          isAbortError = function (err) {
            return err instanceof Error && err.name === "AbortError";
          };
          ((_i = 0), (targetChannels_1 = targetChannels));
          _h.label = 5;
        case 5:
          if (!(_i < targetChannels_1.length)) {
            return [3 /*break*/, 13];
          }
          targetChannel = targetChannels_1[_i];
          throwIfAborted(input.abortSignal);
          ((_b = 0), (rawTargets_1 = rawTargets));
          _h.label = 6;
        case 6:
          if (!(_b < rawTargets_1.length)) {
            return [3 /*break*/, 12];
          }
          target = rawTargets_1[_b];
          throwIfAborted(input.abortSignal);
          _h.label = 7;
        case 7:
          _h.trys.push([7, 10, , 11]);
          return [
            4 /*yield*/,
            (0, target_resolver_js_1.resolveChannelTarget)({
              cfg: input.cfg,
              channel: targetChannel,
              input: target,
            }),
          ];
        case 8:
          resolved = _h.sent();
          if (!resolved.ok) {
            throw resolved.error;
          }
          return [
            4 /*yield*/,
            runMessageAction(
              __assign(__assign({}, input), {
                action: "send",
                params: __assign(__assign({}, params), {
                  channel: targetChannel,
                  target: resolved.target.to,
                }),
              }),
            ),
          ];
        case 9:
          sendResult = _h.sent();
          results.push({
            channel: targetChannel,
            to: resolved.target.to,
            ok: true,
            result: sendResult.kind === "send" ? sendResult.sendResult : undefined,
          });
          return [3 /*break*/, 11];
        case 10:
          err_1 = _h.sent();
          if (isAbortError(err_1)) {
            throw err_1;
          }
          results.push({
            channel: targetChannel,
            to: target,
            ok: false,
            error: err_1 instanceof Error ? err_1.message : String(err_1),
          });
          return [3 /*break*/, 11];
        case 11:
          _b++;
          return [3 /*break*/, 6];
        case 12:
          _i++;
          return [3 /*break*/, 5];
        case 13:
          return [
            2 /*return*/,
            {
              kind: "broadcast",
              channel: (_g = targetChannels[0]) !== null && _g !== void 0 ? _g : "discord",
              action: "broadcast",
              handledBy: input.dryRun ? "dry-run" : "core",
              payload: { results: results },
              dryRun: Boolean(input.dryRun),
            },
          ];
      }
    });
  });
}
function throwIfAborted(abortSignal) {
  if (abortSignal === null || abortSignal === void 0 ? void 0 : abortSignal.aborted) {
    var err = new Error("Message send aborted");
    err.name = "AbortError";
    throw err;
  }
}
function handleSendAction(ctx) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      params,
      channel,
      accountId,
      dryRun,
      gateway,
      input,
      agentId,
      resolvedTarget,
      abortSignal,
      action,
      to,
      mediaHint,
      hasCard,
      message,
      parsed,
      mergedMediaUrls,
      seenMedia,
      pushMedia,
      _i,
      _a,
      url,
      mediaUrl,
      gifPlayback,
      bestEffort,
      replyToId,
      threadId,
      slackAutoThreadId,
      outboundRoute,
      _b,
      mirrorMediaUrls,
      send;
    var _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          ((cfg = ctx.cfg),
            (params = ctx.params),
            (channel = ctx.channel),
            (accountId = ctx.accountId),
            (dryRun = ctx.dryRun),
            (gateway = ctx.gateway),
            (input = ctx.input),
            (agentId = ctx.agentId),
            (resolvedTarget = ctx.resolvedTarget),
            (abortSignal = ctx.abortSignal));
          throwIfAborted(abortSignal);
          action = "send";
          to = (0, common_js_1.readStringParam)(params, "to", { required: true });
          mediaHint =
            (_d =
              (_c = (0, common_js_1.readStringParam)(params, "media", { trim: false })) !== null &&
              _c !== void 0
                ? _c
                : (0, common_js_1.readStringParam)(params, "path", { trim: false })) !== null &&
            _d !== void 0
              ? _d
              : (0, common_js_1.readStringParam)(params, "filePath", { trim: false });
          hasCard = params.card != null && typeof params.card === "object";
          message =
            (_e = (0, common_js_1.readStringParam)(params, "message", {
              required: !mediaHint && !hasCard,
              allowEmpty: true,
            })) !== null && _e !== void 0
              ? _e
              : "";
          parsed = (0, reply_directives_js_1.parseReplyDirectives)(message);
          mergedMediaUrls = [];
          seenMedia = new Set();
          pushMedia = function (value) {
            var trimmed = value === null || value === void 0 ? void 0 : value.trim();
            if (!trimmed) {
              return;
            }
            if (seenMedia.has(trimmed)) {
              return;
            }
            seenMedia.add(trimmed);
            mergedMediaUrls.push(trimmed);
          };
          pushMedia(mediaHint);
          for (
            _i = 0, _a = (_f = parsed.mediaUrls) !== null && _f !== void 0 ? _f : [];
            _i < _a.length;
            _i++
          ) {
            url = _a[_i];
            pushMedia(url);
          }
          pushMedia(parsed.mediaUrl);
          message = parsed.text;
          params.message = message;
          if (!params.replyTo && parsed.replyToId) {
            params.replyTo = parsed.replyToId;
          }
          if (!params.media) {
            // Use path/filePath if media not set, then fall back to parsed directives
            params.media = mergedMediaUrls[0] || undefined;
          }
          return [
            4 /*yield*/,
            maybeApplyCrossContextMarker({
              cfg: cfg,
              channel: channel,
              action: action,
              target: to,
              toolContext: input.toolContext,
              accountId: accountId,
              args: params,
              message: message,
              preferEmbeds: true,
            }),
          ];
        case 1:
          message = _h.sent();
          mediaUrl = (0, common_js_1.readStringParam)(params, "media", { trim: false });
          gifPlayback =
            (_g = readBooleanParam(params, "gifPlayback")) !== null && _g !== void 0 ? _g : false;
          bestEffort = readBooleanParam(params, "bestEffort");
          replyToId = (0, common_js_1.readStringParam)(params, "replyTo");
          threadId = (0, common_js_1.readStringParam)(params, "threadId");
          slackAutoThreadId =
            channel === "slack" && !replyToId && !threadId
              ? resolveSlackAutoThreadId({ to: to, toolContext: input.toolContext })
              : undefined;
          if (!(agentId && !dryRun)) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            (0, outbound_session_js_1.resolveOutboundSessionRoute)({
              cfg: cfg,
              channel: channel,
              agentId: agentId,
              accountId: accountId,
              target: to,
              resolvedTarget: resolvedTarget,
              replyToId: replyToId,
              threadId: threadId !== null && threadId !== void 0 ? threadId : slackAutoThreadId,
            }),
          ];
        case 2:
          _b = _h.sent();
          return [3 /*break*/, 4];
        case 3:
          _b = null;
          _h.label = 4;
        case 4:
          outboundRoute = _b;
          if (!(outboundRoute && agentId && !dryRun)) {
            return [3 /*break*/, 6];
          }
          return [
            4 /*yield*/,
            (0, outbound_session_js_1.ensureOutboundSessionEntry)({
              cfg: cfg,
              agentId: agentId,
              channel: channel,
              accountId: accountId,
              route: outboundRoute,
            }),
          ];
        case 5:
          _h.sent();
          _h.label = 6;
        case 6:
          mirrorMediaUrls =
            mergedMediaUrls.length > 0 ? mergedMediaUrls : mediaUrl ? [mediaUrl] : undefined;
          throwIfAborted(abortSignal);
          return [
            4 /*yield*/,
            (0, outbound_send_service_js_1.executeSendAction)({
              ctx: {
                cfg: cfg,
                channel: channel,
                params: params,
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                gateway: gateway,
                toolContext: input.toolContext,
                deps: input.deps,
                dryRun: dryRun,
                mirror:
                  outboundRoute && !dryRun
                    ? {
                        sessionKey: outboundRoute.sessionKey,
                        agentId: agentId,
                        text: message,
                        mediaUrls: mirrorMediaUrls,
                      }
                    : undefined,
                abortSignal: abortSignal,
              },
              to: to,
              message: message,
              mediaUrl: mediaUrl || undefined,
              mediaUrls: mergedMediaUrls.length ? mergedMediaUrls : undefined,
              gifPlayback: gifPlayback,
              bestEffort: bestEffort !== null && bestEffort !== void 0 ? bestEffort : undefined,
            }),
          ];
        case 7:
          send = _h.sent();
          return [
            2 /*return*/,
            {
              kind: "send",
              channel: channel,
              action: action,
              to: to,
              handledBy: send.handledBy,
              payload: send.payload,
              toolResult: send.toolResult,
              sendResult: send.sendResult,
              dryRun: dryRun,
            },
          ];
      }
    });
  });
}
function handlePollAction(ctx) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      params,
      channel,
      accountId,
      dryRun,
      gateway,
      input,
      abortSignal,
      action,
      to,
      question,
      options,
      allowMultiselect,
      durationHours,
      maxSelections,
      base,
      poll;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          ((cfg = ctx.cfg),
            (params = ctx.params),
            (channel = ctx.channel),
            (accountId = ctx.accountId),
            (dryRun = ctx.dryRun),
            (gateway = ctx.gateway),
            (input = ctx.input),
            (abortSignal = ctx.abortSignal));
          throwIfAborted(abortSignal);
          action = "poll";
          to = (0, common_js_1.readStringParam)(params, "to", { required: true });
          question = (0, common_js_1.readStringParam)(params, "pollQuestion", {
            required: true,
          });
          options =
            (_a = (0, common_js_1.readStringArrayParam)(params, "pollOption", {
              required: true,
            })) !== null && _a !== void 0
              ? _a
              : [];
          if (options.length < 2) {
            throw new Error("pollOption requires at least two values");
          }
          allowMultiselect =
            (_b = readBooleanParam(params, "pollMulti")) !== null && _b !== void 0 ? _b : false;
          durationHours = (0, common_js_1.readNumberParam)(params, "pollDurationHours", {
            integer: true,
          });
          maxSelections = allowMultiselect ? Math.max(2, options.length) : 1;
          base = typeof params.message === "string" ? params.message : "";
          return [
            4 /*yield*/,
            maybeApplyCrossContextMarker({
              cfg: cfg,
              channel: channel,
              action: action,
              target: to,
              toolContext: input.toolContext,
              accountId: accountId,
              args: params,
              message: base,
              preferEmbeds: true,
            }),
          ];
        case 1:
          _c.sent();
          return [
            4 /*yield*/,
            (0, outbound_send_service_js_1.executePollAction)({
              ctx: {
                cfg: cfg,
                channel: channel,
                params: params,
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                gateway: gateway,
                toolContext: input.toolContext,
                dryRun: dryRun,
              },
              to: to,
              question: question,
              options: options,
              maxSelections: maxSelections,
              durationHours:
                durationHours !== null && durationHours !== void 0 ? durationHours : undefined,
            }),
          ];
        case 2:
          poll = _c.sent();
          return [
            2 /*return*/,
            {
              kind: "poll",
              channel: channel,
              action: action,
              to: to,
              handledBy: poll.handledBy,
              payload: poll.payload,
              toolResult: poll.toolResult,
              pollResult: poll.pollResult,
              dryRun: dryRun,
            },
          ];
      }
    });
  });
}
function handlePluginAction(ctx) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg, params, channel, accountId, dryRun, gateway, input, abortSignal, action, handled;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ((cfg = ctx.cfg),
            (params = ctx.params),
            (channel = ctx.channel),
            (accountId = ctx.accountId),
            (dryRun = ctx.dryRun),
            (gateway = ctx.gateway),
            (input = ctx.input),
            (abortSignal = ctx.abortSignal));
          throwIfAborted(abortSignal);
          action = input.action;
          if (dryRun) {
            return [
              2 /*return*/,
              {
                kind: "action",
                channel: channel,
                action: action,
                handledBy: "dry-run",
                payload: { ok: true, dryRun: true, channel: channel, action: action },
                dryRun: true,
              },
            ];
          }
          return [
            4 /*yield*/,
            (0, message_actions_js_1.dispatchChannelMessageAction)({
              channel: channel,
              action: action,
              cfg: cfg,
              params: params,
              accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
              gateway: gateway,
              toolContext: input.toolContext,
              dryRun: dryRun,
            }),
          ];
        case 1:
          handled = _a.sent();
          if (!handled) {
            throw new Error(
              "Message action ".concat(action, " not supported for channel ").concat(channel, "."),
            );
          }
          return [
            2 /*return*/,
            {
              kind: "action",
              channel: channel,
              action: action,
              handledBy: "plugin",
              payload: extractToolPayload(handled),
              toolResult: handled,
              dryRun: dryRun,
            },
          ];
      }
    });
  });
}
function runMessageAction(input) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg,
      params,
      resolvedAgentId,
      action,
      explicitTarget,
      hasLegacyTarget,
      inferredTarget,
      legacyTo,
      legacyChannelId,
      legacyTarget,
      explicitChannel,
      inferredChannel,
      channel,
      accountId,
      dryRun,
      resolvedTarget,
      gateway;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          cfg = input.cfg;
          params = __assign({}, input.params);
          resolvedAgentId =
            (_a = input.agentId) !== null && _a !== void 0
              ? _a
              : input.sessionKey
                ? (0, agent_scope_js_1.resolveSessionAgentId)({
                    sessionKey: input.sessionKey,
                    config: cfg,
                  })
                : undefined;
          parseButtonsParam(params);
          parseCardParam(params);
          action = input.action;
          if (action === "broadcast") {
            return [2 /*return*/, handleBroadcastAction(input, params)];
          }
          explicitTarget = typeof params.target === "string" ? params.target.trim() : "";
          hasLegacyTarget =
            (typeof params.to === "string" && params.to.trim().length > 0) ||
            (typeof params.channelId === "string" && params.channelId.trim().length > 0);
          if (explicitTarget && hasLegacyTarget) {
            delete params.to;
            delete params.channelId;
          }
          if (
            !explicitTarget &&
            !hasLegacyTarget &&
            (0, message_action_spec_js_1.actionRequiresTarget)(action) &&
            !(0, message_action_spec_js_1.actionHasTarget)(action, params)
          ) {
            inferredTarget =
              (_c =
                (_b = input.toolContext) === null || _b === void 0
                  ? void 0
                  : _b.currentChannelId) === null || _c === void 0
                ? void 0
                : _c.trim();
            if (inferredTarget) {
              params.target = inferredTarget;
            }
          }
          if (
            !explicitTarget &&
            (0, message_action_spec_js_1.actionRequiresTarget)(action) &&
            hasLegacyTarget
          ) {
            legacyTo = typeof params.to === "string" ? params.to.trim() : "";
            legacyChannelId = typeof params.channelId === "string" ? params.channelId.trim() : "";
            legacyTarget = legacyTo || legacyChannelId;
            if (legacyTarget) {
              params.target = legacyTarget;
              delete params.to;
              delete params.channelId;
            }
          }
          explicitChannel = typeof params.channel === "string" ? params.channel.trim() : "";
          if (!explicitChannel) {
            inferredChannel = (0, message_channel_js_1.normalizeMessageChannel)(
              (_d = input.toolContext) === null || _d === void 0
                ? void 0
                : _d.currentChannelProvider,
            );
            if (
              inferredChannel &&
              (0, message_channel_js_1.isDeliverableMessageChannel)(inferredChannel)
            ) {
              params.channel = inferredChannel;
            }
          }
          (0, channel_target_js_1.applyTargetToParams)({ action: action, args: params });
          if ((0, message_action_spec_js_1.actionRequiresTarget)(action)) {
            if (!(0, message_action_spec_js_1.actionHasTarget)(action, params)) {
              throw new Error("Action ".concat(action, " requires a target."));
            }
          }
          return [4 /*yield*/, resolveChannel(cfg, params)];
        case 1:
          channel = _g.sent();
          accountId =
            (_e = (0, common_js_1.readStringParam)(params, "accountId")) !== null && _e !== void 0
              ? _e
              : input.defaultAccountId;
          if (accountId) {
            params.accountId = accountId;
          }
          dryRun = Boolean(
            (_f = input.dryRun) !== null && _f !== void 0 ? _f : readBooleanParam(params, "dryRun"),
          );
          return [
            4 /*yield*/,
            hydrateSendAttachmentParams({
              cfg: cfg,
              channel: channel,
              accountId: accountId,
              args: params,
              action: action,
              dryRun: dryRun,
            }),
          ];
        case 2:
          _g.sent();
          return [
            4 /*yield*/,
            hydrateSetGroupIconParams({
              cfg: cfg,
              channel: channel,
              accountId: accountId,
              args: params,
              action: action,
              dryRun: dryRun,
            }),
          ];
        case 3:
          _g.sent();
          return [
            4 /*yield*/,
            resolveActionTarget({
              cfg: cfg,
              channel: channel,
              action: action,
              args: params,
              accountId: accountId,
            }),
          ];
        case 4:
          resolvedTarget = _g.sent();
          (0, outbound_policy_js_1.enforceCrossContextPolicy)({
            channel: channel,
            action: action,
            args: params,
            toolContext: input.toolContext,
            cfg: cfg,
          });
          gateway = resolveGateway(input);
          if (action === "send") {
            return [
              2 /*return*/,
              handleSendAction({
                cfg: cfg,
                params: params,
                channel: channel,
                accountId: accountId,
                dryRun: dryRun,
                gateway: gateway,
                input: input,
                agentId: resolvedAgentId,
                resolvedTarget: resolvedTarget,
                abortSignal: input.abortSignal,
              }),
            ];
          }
          if (action === "poll") {
            return [
              2 /*return*/,
              handlePollAction({
                cfg: cfg,
                params: params,
                channel: channel,
                accountId: accountId,
                dryRun: dryRun,
                gateway: gateway,
                input: input,
                abortSignal: input.abortSignal,
              }),
            ];
          }
          return [
            2 /*return*/,
            handlePluginAction({
              cfg: cfg,
              params: params,
              channel: channel,
              accountId: accountId,
              dryRun: dryRun,
              gateway: gateway,
              input: input,
              abortSignal: input.abortSignal,
            }),
          ];
      }
    });
  });
}
