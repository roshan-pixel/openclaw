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
exports.handleSlackAction = handleSlackAction;
var accounts_js_1 = require("../../slack/accounts.js");
var actions_js_1 = require("../../slack/actions.js");
var targets_js_1 = require("../../slack/targets.js");
var date_time_js_1 = require("../date-time.js");
var common_js_1 = require("./common.js");
var messagingActions = new Set(["sendMessage", "editMessage", "deleteMessage", "readMessages"]);
var reactionsActions = new Set(["react", "reactions"]);
var pinActions = new Set(["pinMessage", "unpinMessage", "listPins"]);
/**
 * Resolve threadTs for a Slack message based on context and replyToMode.
 * - "all": always inject threadTs
 * - "first": inject only for first message (updates hasRepliedRef)
 * - "off": never auto-inject
 */
function resolveThreadTsFromContext(explicitThreadTs, targetChannel, context) {
  // Agent explicitly provided threadTs - use it
  if (explicitThreadTs) {
    return explicitThreadTs;
  }
  // No context or missing required fields
  if (
    !(context === null || context === void 0 ? void 0 : context.currentThreadTs) ||
    !(context === null || context === void 0 ? void 0 : context.currentChannelId)
  ) {
    return undefined;
  }
  var parsedTarget = (0, targets_js_1.parseSlackTarget)(targetChannel, { defaultKind: "channel" });
  if (!parsedTarget || parsedTarget.kind !== "channel") {
    return undefined;
  }
  var normalizedTarget = parsedTarget.id;
  // Different channel - don't inject
  if (normalizedTarget !== context.currentChannelId) {
    return undefined;
  }
  // Check replyToMode
  if (context.replyToMode === "all") {
    return context.currentThreadTs;
  }
  if (context.replyToMode === "first" && context.hasRepliedRef && !context.hasRepliedRef.value) {
    context.hasRepliedRef.value = true;
    return context.currentThreadTs;
  }
  return undefined;
}
function handleSlackAction(params, cfg, context) {
  return __awaiter(this, void 0, void 0, function () {
    var resolveChannelId,
      action,
      accountId,
      account,
      actionConfig,
      isActionEnabled,
      userToken,
      botToken,
      allowUserWrites,
      getTokenForOperation,
      buildActionOpts,
      readOpts,
      writeOpts,
      channelId,
      messageId,
      _a,
      emoji,
      remove,
      isEmpty,
      removed,
      _b,
      reactions,
      _c,
      _d,
      to,
      content,
      mediaUrl,
      threadTs,
      result,
      parsedTarget,
      channelId,
      messageId,
      content,
      channelId,
      messageId,
      channelId,
      limitRaw,
      limit,
      before,
      after,
      threadId,
      result,
      messages,
      channelId,
      messageId,
      messageId,
      pins,
      _e,
      normalizedPins,
      userId,
      info,
      _f,
      emojis,
      _g;
    var _h, _j, _k, _l, _m;
    return __generator(this, function (_o) {
      switch (_o.label) {
        case 0:
          resolveChannelId = function () {
            return (0, targets_js_1.resolveSlackChannelId)(
              (0, common_js_1.readStringParam)(params, "channelId", {
                required: true,
              }),
            );
          };
          action = (0, common_js_1.readStringParam)(params, "action", { required: true });
          accountId = (0, common_js_1.readStringParam)(params, "accountId");
          account = (0, accounts_js_1.resolveSlackAccount)({ cfg: cfg, accountId: accountId });
          actionConfig =
            (_h = account.actions) !== null && _h !== void 0
              ? _h
              : (_k = (_j = cfg.channels) === null || _j === void 0 ? void 0 : _j.slack) === null ||
                  _k === void 0
                ? void 0
                : _k.actions;
          isActionEnabled = (0, common_js_1.createActionGate)(actionConfig);
          userToken =
            ((_l = account.config.userToken) === null || _l === void 0 ? void 0 : _l.trim()) ||
            undefined;
          botToken = (_m = account.botToken) === null || _m === void 0 ? void 0 : _m.trim();
          allowUserWrites = account.config.userTokenReadOnly === false;
          getTokenForOperation = function (operation) {
            if (operation === "read") {
              return userToken !== null && userToken !== void 0 ? userToken : botToken;
            }
            if (!allowUserWrites) {
              return botToken;
            }
            return botToken !== null && botToken !== void 0 ? botToken : userToken;
          };
          buildActionOpts = function (operation) {
            var token = getTokenForOperation(operation);
            var tokenOverride = token && token !== botToken ? token : undefined;
            if (!accountId && !tokenOverride) {
              return undefined;
            }
            return __assign(
              __assign({}, accountId ? { accountId: accountId } : {}),
              tokenOverride ? { token: tokenOverride } : {},
            );
          };
          readOpts = buildActionOpts("read");
          writeOpts = buildActionOpts("write");
          if (!reactionsActions.has(action)) {
            return [3 /*break*/, 20];
          }
          if (!isActionEnabled("reactions")) {
            throw new Error("Slack reactions are disabled.");
          }
          channelId = resolveChannelId();
          messageId = (0, common_js_1.readStringParam)(params, "messageId", { required: true });
          if (!(action === "react")) {
            return [3 /*break*/, 15];
          }
          ((_a = (0, common_js_1.readReactionParams)(params, {
            removeErrorMessage: "Emoji is required to remove a Slack reaction.",
          })),
            (emoji = _a.emoji),
            (remove = _a.remove),
            (isEmpty = _a.isEmpty));
          if (!remove) {
            return [3 /*break*/, 5];
          }
          if (!writeOpts) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            (0, actions_js_1.removeSlackReaction)(channelId, messageId, emoji, writeOpts),
          ];
        case 1:
          _o.sent();
          return [3 /*break*/, 4];
        case 2:
          return [4 /*yield*/, (0, actions_js_1.removeSlackReaction)(channelId, messageId, emoji)];
        case 3:
          _o.sent();
          _o.label = 4;
        case 4:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, removed: emoji })];
        case 5:
          if (!isEmpty) {
            return [3 /*break*/, 10];
          }
          if (!writeOpts) {
            return [3 /*break*/, 7];
          }
          return [
            4 /*yield*/,
            (0, actions_js_1.removeOwnSlackReactions)(channelId, messageId, writeOpts),
          ];
        case 6:
          _b = _o.sent();
          return [3 /*break*/, 9];
        case 7:
          return [4 /*yield*/, (0, actions_js_1.removeOwnSlackReactions)(channelId, messageId)];
        case 8:
          _b = _o.sent();
          _o.label = 9;
        case 9:
          removed = _b;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, removed: removed })];
        case 10:
          if (!writeOpts) {
            return [3 /*break*/, 12];
          }
          return [
            4 /*yield*/,
            (0, actions_js_1.reactSlackMessage)(channelId, messageId, emoji, writeOpts),
          ];
        case 11:
          _o.sent();
          return [3 /*break*/, 14];
        case 12:
          return [4 /*yield*/, (0, actions_js_1.reactSlackMessage)(channelId, messageId, emoji)];
        case 13:
          _o.sent();
          _o.label = 14;
        case 14:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, added: emoji })];
        case 15:
          if (!readOpts) {
            return [3 /*break*/, 17];
          }
          return [
            4 /*yield*/,
            (0, actions_js_1.listSlackReactions)(channelId, messageId, readOpts),
          ];
        case 16:
          _c = _o.sent();
          return [3 /*break*/, 19];
        case 17:
          return [4 /*yield*/, (0, actions_js_1.listSlackReactions)(channelId, messageId)];
        case 18:
          _c = _o.sent();
          _o.label = 19;
        case 19:
          reactions = _c;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, reactions: reactions })];
        case 20:
          if (!messagingActions.has(action)) {
            return [3 /*break*/, 36];
          }
          if (!isActionEnabled("messages")) {
            throw new Error("Slack messages are disabled.");
          }
          _d = action;
          switch (_d) {
            case "sendMessage":
              return [3 /*break*/, 21];
            case "editMessage":
              return [3 /*break*/, 23];
            case "deleteMessage":
              return [3 /*break*/, 28];
            case "readMessages":
              return [3 /*break*/, 33];
          }
          return [3 /*break*/, 35];
        case 21:
          to = (0, common_js_1.readStringParam)(params, "to", { required: true });
          content = (0, common_js_1.readStringParam)(params, "content", { required: true });
          mediaUrl = (0, common_js_1.readStringParam)(params, "mediaUrl");
          threadTs = resolveThreadTsFromContext(
            (0, common_js_1.readStringParam)(params, "threadTs"),
            to,
            context,
          );
          return [
            4 /*yield*/,
            (0, actions_js_1.sendSlackMessage)(
              to,
              content,
              __assign(__assign({}, writeOpts), {
                mediaUrl: mediaUrl !== null && mediaUrl !== void 0 ? mediaUrl : undefined,
                threadTs: threadTs !== null && threadTs !== void 0 ? threadTs : undefined,
              }),
            ),
          ];
        case 22:
          result = _o.sent();
          // Keep "first" mode consistent even when the agent explicitly provided
          // threadTs: once we send a message to the current channel, consider the
          // first reply "used" so later tool calls don't auto-thread again.
          if (
            (context === null || context === void 0 ? void 0 : context.hasRepliedRef) &&
            context.currentChannelId
          ) {
            parsedTarget = (0, targets_js_1.parseSlackTarget)(to, { defaultKind: "channel" });
            if (
              (parsedTarget === null || parsedTarget === void 0 ? void 0 : parsedTarget.kind) ===
                "channel" &&
              parsedTarget.id === context.currentChannelId
            ) {
              context.hasRepliedRef.value = true;
            }
          }
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, result: result })];
        case 23:
          channelId = resolveChannelId();
          messageId = (0, common_js_1.readStringParam)(params, "messageId", {
            required: true,
          });
          content = (0, common_js_1.readStringParam)(params, "content", {
            required: true,
          });
          if (!writeOpts) {
            return [3 /*break*/, 25];
          }
          return [
            4 /*yield*/,
            (0, actions_js_1.editSlackMessage)(channelId, messageId, content, writeOpts),
          ];
        case 24:
          _o.sent();
          return [3 /*break*/, 27];
        case 25:
          return [4 /*yield*/, (0, actions_js_1.editSlackMessage)(channelId, messageId, content)];
        case 26:
          _o.sent();
          _o.label = 27;
        case 27:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
        case 28:
          channelId = resolveChannelId();
          messageId = (0, common_js_1.readStringParam)(params, "messageId", {
            required: true,
          });
          if (!writeOpts) {
            return [3 /*break*/, 30];
          }
          return [
            4 /*yield*/,
            (0, actions_js_1.deleteSlackMessage)(channelId, messageId, writeOpts),
          ];
        case 29:
          _o.sent();
          return [3 /*break*/, 32];
        case 30:
          return [4 /*yield*/, (0, actions_js_1.deleteSlackMessage)(channelId, messageId)];
        case 31:
          _o.sent();
          _o.label = 32;
        case 32:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
        case 33:
          channelId = resolveChannelId();
          limitRaw = params.limit;
          limit = typeof limitRaw === "number" && Number.isFinite(limitRaw) ? limitRaw : undefined;
          before = (0, common_js_1.readStringParam)(params, "before");
          after = (0, common_js_1.readStringParam)(params, "after");
          threadId = (0, common_js_1.readStringParam)(params, "threadId");
          return [
            4 /*yield*/,
            (0, actions_js_1.readSlackMessages)(
              channelId,
              __assign(__assign({}, readOpts), {
                limit: limit,
                before: before !== null && before !== void 0 ? before : undefined,
                after: after !== null && after !== void 0 ? after : undefined,
                threadId: threadId !== null && threadId !== void 0 ? threadId : undefined,
              }),
            ),
          ];
        case 34:
          result = _o.sent();
          messages = result.messages.map(function (message) {
            return (0, date_time_js_1.withNormalizedTimestamp)(message, message.ts);
          });
          return [
            2 /*return*/,
            (0, common_js_1.jsonResult)({ ok: true, messages: messages, hasMore: result.hasMore }),
          ];
        case 35:
          return [3 /*break*/, 36];
        case 36:
          if (!pinActions.has(action)) {
            return [3 /*break*/, 51];
          }
          if (!isActionEnabled("pins")) {
            throw new Error("Slack pins are disabled.");
          }
          channelId = resolveChannelId();
          if (!(action === "pinMessage")) {
            return [3 /*break*/, 41];
          }
          messageId = (0, common_js_1.readStringParam)(params, "messageId", {
            required: true,
          });
          if (!writeOpts) {
            return [3 /*break*/, 38];
          }
          return [4 /*yield*/, (0, actions_js_1.pinSlackMessage)(channelId, messageId, writeOpts)];
        case 37:
          _o.sent();
          return [3 /*break*/, 40];
        case 38:
          return [4 /*yield*/, (0, actions_js_1.pinSlackMessage)(channelId, messageId)];
        case 39:
          _o.sent();
          _o.label = 40;
        case 40:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
        case 41:
          if (!(action === "unpinMessage")) {
            return [3 /*break*/, 46];
          }
          messageId = (0, common_js_1.readStringParam)(params, "messageId", {
            required: true,
          });
          if (!writeOpts) {
            return [3 /*break*/, 43];
          }
          return [
            4 /*yield*/,
            (0, actions_js_1.unpinSlackMessage)(channelId, messageId, writeOpts),
          ];
        case 42:
          _o.sent();
          return [3 /*break*/, 45];
        case 43:
          return [4 /*yield*/, (0, actions_js_1.unpinSlackMessage)(channelId, messageId)];
        case 44:
          _o.sent();
          _o.label = 45;
        case 45:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
        case 46:
          if (!writeOpts) {
            return [3 /*break*/, 48];
          }
          return [4 /*yield*/, (0, actions_js_1.listSlackPins)(channelId, readOpts)];
        case 47:
          _e = _o.sent();
          return [3 /*break*/, 50];
        case 48:
          return [4 /*yield*/, (0, actions_js_1.listSlackPins)(channelId)];
        case 49:
          _e = _o.sent();
          _o.label = 50;
        case 50:
          pins = _e;
          normalizedPins = pins.map(function (pin) {
            var message = pin.message
              ? (0, date_time_js_1.withNormalizedTimestamp)(pin.message, pin.message.ts)
              : pin.message;
            return message ? __assign(__assign({}, pin), { message: message }) : pin;
          });
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, pins: normalizedPins })];
        case 51:
          if (!(action === "memberInfo")) {
            return [3 /*break*/, 56];
          }
          if (!isActionEnabled("memberInfo")) {
            throw new Error("Slack member info is disabled.");
          }
          userId = (0, common_js_1.readStringParam)(params, "userId", { required: true });
          if (!writeOpts) {
            return [3 /*break*/, 53];
          }
          return [4 /*yield*/, (0, actions_js_1.getSlackMemberInfo)(userId, readOpts)];
        case 52:
          _f = _o.sent();
          return [3 /*break*/, 55];
        case 53:
          return [4 /*yield*/, (0, actions_js_1.getSlackMemberInfo)(userId)];
        case 54:
          _f = _o.sent();
          _o.label = 55;
        case 55:
          info = _f;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, info: info })];
        case 56:
          if (!(action === "emojiList")) {
            return [3 /*break*/, 61];
          }
          if (!isActionEnabled("emojiList")) {
            throw new Error("Slack emoji list is disabled.");
          }
          if (!readOpts) {
            return [3 /*break*/, 58];
          }
          return [4 /*yield*/, (0, actions_js_1.listSlackEmojis)(readOpts)];
        case 57:
          _g = _o.sent();
          return [3 /*break*/, 60];
        case 58:
          return [4 /*yield*/, (0, actions_js_1.listSlackEmojis)()];
        case 59:
          _g = _o.sent();
          _o.label = 60;
        case 60:
          emojis = _g;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, emojis: emojis })];
        case 61:
          throw new Error("Unknown action: ".concat(action));
      }
    });
  });
}
