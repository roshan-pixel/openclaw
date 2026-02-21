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
exports.handleDiscordMessagingAction = handleDiscordMessagingAction;
var send_js_1 = require("../../discord/send.js");
var common_js_1 = require("./common.js");
var date_time_js_1 = require("../date-time.js");
var targets_js_1 = require("../../discord/targets.js");
function parseDiscordMessageLink(link) {
  var normalized = link.trim();
  var match = normalized.match(
    /^(?:https?:\/\/)?(?:ptb\.|canary\.)?discord(?:app)?\.com\/channels\/(\d+)\/(\d+)\/(\d+)(?:\/?|\?.*)$/i,
  );
  if (!match) {
    throw new Error(
      "Invalid Discord message link. Expected https://discord.com/channels/<guildId>/<channelId>/<messageId>.",
    );
  }
  return {
    guildId: match[1],
    channelId: match[2],
    messageId: match[3],
  };
}
function handleDiscordMessagingAction(action, params, isActionEnabled) {
  return __awaiter(this, void 0, void 0, function () {
    var resolveChannelId,
      accountId,
      normalizeMessage,
      _a,
      channelId,
      messageId,
      _b,
      emoji,
      remove,
      isEmpty,
      removed,
      _c,
      channelId,
      messageId,
      limitRaw,
      limit,
      reactions,
      to,
      content,
      stickerIds,
      to,
      content,
      question,
      answers,
      allowMultiselectRaw,
      allowMultiselect,
      durationRaw,
      durationHours,
      maxSelections,
      channelId,
      permissions,
      _d,
      messageLink,
      guildId,
      channelId,
      messageId,
      parsed,
      message,
      _e,
      channelId,
      query,
      messages,
      _f,
      to,
      content,
      mediaUrl,
      replyTo,
      embeds,
      result,
      channelId,
      messageId,
      content,
      message,
      _g,
      channelId,
      messageId,
      channelId,
      name_1,
      messageId,
      autoArchiveMinutesRaw,
      autoArchiveMinutes,
      thread,
      _h,
      guildId,
      channelId,
      includeArchived,
      before,
      limit,
      threads,
      _j,
      channelId,
      content,
      mediaUrl,
      replyTo,
      result,
      channelId,
      messageId,
      channelId,
      messageId,
      channelId,
      pins,
      _k,
      guildId,
      content,
      channelId,
      channelIds,
      authorId,
      authorIds,
      limit,
      channelIdList,
      authorIdList,
      results,
      _l,
      resultsRecord,
      messages,
      normalizedMessages;
    return __generator(this, function (_m) {
      switch (_m.label) {
        case 0:
          resolveChannelId = function () {
            return (0, targets_js_1.resolveDiscordChannelId)(
              (0, common_js_1.readStringParam)(params, "channelId", {
                required: true,
              }),
            );
          };
          accountId = (0, common_js_1.readStringParam)(params, "accountId");
          normalizeMessage = function (message) {
            if (!message || typeof message !== "object") {
              return message;
            }
            return (0, date_time_js_1.withNormalizedTimestamp)(message, message.timestamp);
          };
          _a = action;
          switch (_a) {
            case "react":
              return [3 /*break*/, 1];
            case "reactions":
              return [3 /*break*/, 16];
            case "sticker":
              return [3 /*break*/, 18];
            case "poll":
              return [3 /*break*/, 20];
            case "permissions":
              return [3 /*break*/, 22];
            case "fetchMessage":
              return [3 /*break*/, 27];
            case "readMessages":
              return [3 /*break*/, 32];
            case "sendMessage":
              return [3 /*break*/, 37];
            case "editMessage":
              return [3 /*break*/, 39];
            case "deleteMessage":
              return [3 /*break*/, 44];
            case "threadCreate":
              return [3 /*break*/, 49];
            case "threadList":
              return [3 /*break*/, 54];
            case "threadReply":
              return [3 /*break*/, 59];
            case "pinMessage":
              return [3 /*break*/, 61];
            case "unpinMessage":
              return [3 /*break*/, 66];
            case "listPins":
              return [3 /*break*/, 71];
            case "searchMessages":
              return [3 /*break*/, 76];
          }
          return [3 /*break*/, 81];
        case 1:
          if (!isActionEnabled("reactions")) {
            throw new Error("Discord reactions are disabled.");
          }
          channelId = resolveChannelId();
          messageId = (0, common_js_1.readStringParam)(params, "messageId", {
            required: true,
          });
          ((_b = (0, common_js_1.readReactionParams)(params, {
            removeErrorMessage: "Emoji is required to remove a Discord reaction.",
          })),
            (emoji = _b.emoji),
            (remove = _b.remove),
            (isEmpty = _b.isEmpty));
          if (!remove) {
            return [3 /*break*/, 6];
          }
          if (!accountId) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.removeReactionDiscord)(channelId, messageId, emoji, {
              accountId: accountId,
            }),
          ];
        case 2:
          _m.sent();
          return [3 /*break*/, 5];
        case 3:
          return [4 /*yield*/, (0, send_js_1.removeReactionDiscord)(channelId, messageId, emoji)];
        case 4:
          _m.sent();
          _m.label = 5;
        case 5:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, removed: emoji })];
        case 6:
          if (!isEmpty) {
            return [3 /*break*/, 11];
          }
          if (!accountId) {
            return [3 /*break*/, 8];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.removeOwnReactionsDiscord)(channelId, messageId, {
              accountId: accountId,
            }),
          ];
        case 7:
          _c = _m.sent();
          return [3 /*break*/, 10];
        case 8:
          return [4 /*yield*/, (0, send_js_1.removeOwnReactionsDiscord)(channelId, messageId)];
        case 9:
          _c = _m.sent();
          _m.label = 10;
        case 10:
          removed = _c;
          return [
            2 /*return*/,
            (0, common_js_1.jsonResult)({ ok: true, removed: removed.removed }),
          ];
        case 11:
          if (!accountId) {
            return [3 /*break*/, 13];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.reactMessageDiscord)(channelId, messageId, emoji, {
              accountId: accountId,
            }),
          ];
        case 12:
          _m.sent();
          return [3 /*break*/, 15];
        case 13:
          return [4 /*yield*/, (0, send_js_1.reactMessageDiscord)(channelId, messageId, emoji)];
        case 14:
          _m.sent();
          _m.label = 15;
        case 15:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, added: emoji })];
        case 16:
          if (!isActionEnabled("reactions")) {
            throw new Error("Discord reactions are disabled.");
          }
          channelId = resolveChannelId();
          messageId = (0, common_js_1.readStringParam)(params, "messageId", {
            required: true,
          });
          limitRaw = params.limit;
          limit = typeof limitRaw === "number" && Number.isFinite(limitRaw) ? limitRaw : undefined;
          return [
            4 /*yield*/,
            (0, send_js_1.fetchReactionsDiscord)(
              channelId,
              messageId,
              __assign(__assign({}, accountId ? { accountId: accountId } : {}), { limit: limit }),
            ),
          ];
        case 17:
          reactions = _m.sent();
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, reactions: reactions })];
        case 18:
          if (!isActionEnabled("stickers")) {
            throw new Error("Discord stickers are disabled.");
          }
          to = (0, common_js_1.readStringParam)(params, "to", { required: true });
          content = (0, common_js_1.readStringParam)(params, "content");
          stickerIds = (0, common_js_1.readStringArrayParam)(params, "stickerIds", {
            required: true,
            label: "stickerIds",
          });
          return [
            4 /*yield*/,
            (0, send_js_1.sendStickerDiscord)(
              to,
              stickerIds,
              __assign(__assign({}, accountId ? { accountId: accountId } : {}), {
                content: content,
              }),
            ),
          ];
        case 19:
          _m.sent();
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
        case 20:
          if (!isActionEnabled("polls")) {
            throw new Error("Discord polls are disabled.");
          }
          to = (0, common_js_1.readStringParam)(params, "to", { required: true });
          content = (0, common_js_1.readStringParam)(params, "content");
          question = (0, common_js_1.readStringParam)(params, "question", {
            required: true,
          });
          answers = (0, common_js_1.readStringArrayParam)(params, "answers", {
            required: true,
            label: "answers",
          });
          allowMultiselectRaw = params.allowMultiselect;
          allowMultiselect =
            typeof allowMultiselectRaw === "boolean" ? allowMultiselectRaw : undefined;
          durationRaw = params.durationHours;
          durationHours =
            typeof durationRaw === "number" && Number.isFinite(durationRaw)
              ? durationRaw
              : undefined;
          maxSelections = allowMultiselect ? Math.max(2, answers.length) : 1;
          return [
            4 /*yield*/,
            (0, send_js_1.sendPollDiscord)(
              to,
              {
                question: question,
                options: answers,
                maxSelections: maxSelections,
                durationHours: durationHours,
              },
              __assign(__assign({}, accountId ? { accountId: accountId } : {}), {
                content: content,
              }),
            ),
          ];
        case 21:
          _m.sent();
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
        case 22:
          if (!isActionEnabled("permissions")) {
            throw new Error("Discord permissions are disabled.");
          }
          channelId = resolveChannelId();
          if (!accountId) {
            return [3 /*break*/, 24];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.fetchChannelPermissionsDiscord)(channelId, { accountId: accountId }),
          ];
        case 23:
          _d = _m.sent();
          return [3 /*break*/, 26];
        case 24:
          return [4 /*yield*/, (0, send_js_1.fetchChannelPermissionsDiscord)(channelId)];
        case 25:
          _d = _m.sent();
          _m.label = 26;
        case 26:
          permissions = _d;
          return [
            2 /*return*/,
            (0, common_js_1.jsonResult)({ ok: true, permissions: permissions }),
          ];
        case 27:
          if (!isActionEnabled("messages")) {
            throw new Error("Discord message reads are disabled.");
          }
          messageLink = (0, common_js_1.readStringParam)(params, "messageLink");
          guildId = (0, common_js_1.readStringParam)(params, "guildId");
          channelId = (0, common_js_1.readStringParam)(params, "channelId");
          messageId = (0, common_js_1.readStringParam)(params, "messageId");
          if (messageLink) {
            parsed = parseDiscordMessageLink(messageLink);
            guildId = parsed.guildId;
            channelId = parsed.channelId;
            messageId = parsed.messageId;
          }
          if (!guildId || !channelId || !messageId) {
            throw new Error(
              "Discord message fetch requires guildId, channelId, and messageId (or a valid messageLink).",
            );
          }
          if (!accountId) {
            return [3 /*break*/, 29];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.fetchMessageDiscord)(channelId, messageId, { accountId: accountId }),
          ];
        case 28:
          _e = _m.sent();
          return [3 /*break*/, 31];
        case 29:
          return [4 /*yield*/, (0, send_js_1.fetchMessageDiscord)(channelId, messageId)];
        case 30:
          _e = _m.sent();
          _m.label = 31;
        case 31:
          message = _e;
          return [
            2 /*return*/,
            (0, common_js_1.jsonResult)({
              ok: true,
              message: normalizeMessage(message),
              guildId: guildId,
              channelId: channelId,
              messageId: messageId,
            }),
          ];
        case 32:
          if (!isActionEnabled("messages")) {
            throw new Error("Discord message reads are disabled.");
          }
          channelId = resolveChannelId();
          query = {
            limit:
              typeof params.limit === "number" && Number.isFinite(params.limit)
                ? params.limit
                : undefined,
            before: (0, common_js_1.readStringParam)(params, "before"),
            after: (0, common_js_1.readStringParam)(params, "after"),
            around: (0, common_js_1.readStringParam)(params, "around"),
          };
          if (!accountId) {
            return [3 /*break*/, 34];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.readMessagesDiscord)(channelId, query, { accountId: accountId }),
          ];
        case 33:
          _f = _m.sent();
          return [3 /*break*/, 36];
        case 34:
          return [4 /*yield*/, (0, send_js_1.readMessagesDiscord)(channelId, query)];
        case 35:
          _f = _m.sent();
          _m.label = 36;
        case 36:
          messages = _f;
          return [
            2 /*return*/,
            (0, common_js_1.jsonResult)({
              ok: true,
              messages: messages.map(function (message) {
                return normalizeMessage(message);
              }),
            }),
          ];
        case 37:
          if (!isActionEnabled("messages")) {
            throw new Error("Discord message sends are disabled.");
          }
          to = (0, common_js_1.readStringParam)(params, "to", { required: true });
          content = (0, common_js_1.readStringParam)(params, "content", {
            required: true,
          });
          mediaUrl = (0, common_js_1.readStringParam)(params, "mediaUrl");
          replyTo = (0, common_js_1.readStringParam)(params, "replyTo");
          embeds =
            Array.isArray(params.embeds) && params.embeds.length > 0 ? params.embeds : undefined;
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageDiscord)(
              to,
              content,
              __assign(__assign({}, accountId ? { accountId: accountId } : {}), {
                mediaUrl: mediaUrl,
                replyTo: replyTo,
                embeds: embeds,
              }),
            ),
          ];
        case 38:
          result = _m.sent();
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, result: result })];
        case 39:
          if (!isActionEnabled("messages")) {
            throw new Error("Discord message edits are disabled.");
          }
          channelId = resolveChannelId();
          messageId = (0, common_js_1.readStringParam)(params, "messageId", {
            required: true,
          });
          content = (0, common_js_1.readStringParam)(params, "content", {
            required: true,
          });
          if (!accountId) {
            return [3 /*break*/, 41];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.editMessageDiscord)(
              channelId,
              messageId,
              { content: content },
              { accountId: accountId },
            ),
          ];
        case 40:
          _g = _m.sent();
          return [3 /*break*/, 43];
        case 41:
          return [
            4 /*yield*/,
            (0, send_js_1.editMessageDiscord)(channelId, messageId, { content: content }),
          ];
        case 42:
          _g = _m.sent();
          _m.label = 43;
        case 43:
          message = _g;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, message: message })];
        case 44:
          if (!isActionEnabled("messages")) {
            throw new Error("Discord message deletes are disabled.");
          }
          channelId = resolveChannelId();
          messageId = (0, common_js_1.readStringParam)(params, "messageId", {
            required: true,
          });
          if (!accountId) {
            return [3 /*break*/, 46];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.deleteMessageDiscord)(channelId, messageId, { accountId: accountId }),
          ];
        case 45:
          _m.sent();
          return [3 /*break*/, 48];
        case 46:
          return [4 /*yield*/, (0, send_js_1.deleteMessageDiscord)(channelId, messageId)];
        case 47:
          _m.sent();
          _m.label = 48;
        case 48:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
        case 49:
          if (!isActionEnabled("threads")) {
            throw new Error("Discord threads are disabled.");
          }
          channelId = resolveChannelId();
          name_1 = (0, common_js_1.readStringParam)(params, "name", { required: true });
          messageId = (0, common_js_1.readStringParam)(params, "messageId");
          autoArchiveMinutesRaw = params.autoArchiveMinutes;
          autoArchiveMinutes =
            typeof autoArchiveMinutesRaw === "number" && Number.isFinite(autoArchiveMinutesRaw)
              ? autoArchiveMinutesRaw
              : undefined;
          if (!accountId) {
            return [3 /*break*/, 51];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.createThreadDiscord)(
              channelId,
              { name: name_1, messageId: messageId, autoArchiveMinutes: autoArchiveMinutes },
              { accountId: accountId },
            ),
          ];
        case 50:
          _h = _m.sent();
          return [3 /*break*/, 53];
        case 51:
          return [
            4 /*yield*/,
            (0, send_js_1.createThreadDiscord)(channelId, {
              name: name_1,
              messageId: messageId,
              autoArchiveMinutes: autoArchiveMinutes,
            }),
          ];
        case 52:
          _h = _m.sent();
          _m.label = 53;
        case 53:
          thread = _h;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, thread: thread })];
        case 54:
          if (!isActionEnabled("threads")) {
            throw new Error("Discord threads are disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", {
            required: true,
          });
          channelId = (0, common_js_1.readStringParam)(params, "channelId");
          includeArchived =
            typeof params.includeArchived === "boolean" ? params.includeArchived : undefined;
          before = (0, common_js_1.readStringParam)(params, "before");
          limit =
            typeof params.limit === "number" && Number.isFinite(params.limit)
              ? params.limit
              : undefined;
          if (!accountId) {
            return [3 /*break*/, 56];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.listThreadsDiscord)(
              {
                guildId: guildId,
                channelId: channelId,
                includeArchived: includeArchived,
                before: before,
                limit: limit,
              },
              { accountId: accountId },
            ),
          ];
        case 55:
          _j = _m.sent();
          return [3 /*break*/, 58];
        case 56:
          return [
            4 /*yield*/,
            (0, send_js_1.listThreadsDiscord)({
              guildId: guildId,
              channelId: channelId,
              includeArchived: includeArchived,
              before: before,
              limit: limit,
            }),
          ];
        case 57:
          _j = _m.sent();
          _m.label = 58;
        case 58:
          threads = _j;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, threads: threads })];
        case 59:
          if (!isActionEnabled("threads")) {
            throw new Error("Discord threads are disabled.");
          }
          channelId = resolveChannelId();
          content = (0, common_js_1.readStringParam)(params, "content", {
            required: true,
          });
          mediaUrl = (0, common_js_1.readStringParam)(params, "mediaUrl");
          replyTo = (0, common_js_1.readStringParam)(params, "replyTo");
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageDiscord)(
              "channel:".concat(channelId),
              content,
              __assign(__assign({}, accountId ? { accountId: accountId } : {}), {
                mediaUrl: mediaUrl,
                replyTo: replyTo,
              }),
            ),
          ];
        case 60:
          result = _m.sent();
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, result: result })];
        case 61:
          if (!isActionEnabled("pins")) {
            throw new Error("Discord pins are disabled.");
          }
          channelId = resolveChannelId();
          messageId = (0, common_js_1.readStringParam)(params, "messageId", {
            required: true,
          });
          if (!accountId) {
            return [3 /*break*/, 63];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.pinMessageDiscord)(channelId, messageId, { accountId: accountId }),
          ];
        case 62:
          _m.sent();
          return [3 /*break*/, 65];
        case 63:
          return [4 /*yield*/, (0, send_js_1.pinMessageDiscord)(channelId, messageId)];
        case 64:
          _m.sent();
          _m.label = 65;
        case 65:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
        case 66:
          if (!isActionEnabled("pins")) {
            throw new Error("Discord pins are disabled.");
          }
          channelId = resolveChannelId();
          messageId = (0, common_js_1.readStringParam)(params, "messageId", {
            required: true,
          });
          if (!accountId) {
            return [3 /*break*/, 68];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.unpinMessageDiscord)(channelId, messageId, { accountId: accountId }),
          ];
        case 67:
          _m.sent();
          return [3 /*break*/, 70];
        case 68:
          return [4 /*yield*/, (0, send_js_1.unpinMessageDiscord)(channelId, messageId)];
        case 69:
          _m.sent();
          _m.label = 70;
        case 70:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
        case 71:
          if (!isActionEnabled("pins")) {
            throw new Error("Discord pins are disabled.");
          }
          channelId = resolveChannelId();
          if (!accountId) {
            return [3 /*break*/, 73];
          }
          return [4 /*yield*/, (0, send_js_1.listPinsDiscord)(channelId, { accountId: accountId })];
        case 72:
          _k = _m.sent();
          return [3 /*break*/, 75];
        case 73:
          return [4 /*yield*/, (0, send_js_1.listPinsDiscord)(channelId)];
        case 74:
          _k = _m.sent();
          _m.label = 75;
        case 75:
          pins = _k;
          return [
            2 /*return*/,
            (0, common_js_1.jsonResult)({
              ok: true,
              pins: pins.map(function (pin) {
                return normalizeMessage(pin);
              }),
            }),
          ];
        case 76:
          if (!isActionEnabled("search")) {
            throw new Error("Discord search is disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", {
            required: true,
          });
          content = (0, common_js_1.readStringParam)(params, "content", {
            required: true,
          });
          channelId = (0, common_js_1.readStringParam)(params, "channelId");
          channelIds = (0, common_js_1.readStringArrayParam)(params, "channelIds");
          authorId = (0, common_js_1.readStringParam)(params, "authorId");
          authorIds = (0, common_js_1.readStringArrayParam)(params, "authorIds");
          limit =
            typeof params.limit === "number" && Number.isFinite(params.limit)
              ? params.limit
              : undefined;
          channelIdList = __spreadArray(
            __spreadArray([], channelIds !== null && channelIds !== void 0 ? channelIds : [], true),
            channelId ? [channelId] : [],
            true,
          );
          authorIdList = __spreadArray(
            __spreadArray([], authorIds !== null && authorIds !== void 0 ? authorIds : [], true),
            authorId ? [authorId] : [],
            true,
          );
          if (!accountId) {
            return [3 /*break*/, 78];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.searchMessagesDiscord)(
              {
                guildId: guildId,
                content: content,
                channelIds: channelIdList.length ? channelIdList : undefined,
                authorIds: authorIdList.length ? authorIdList : undefined,
                limit: limit,
              },
              { accountId: accountId },
            ),
          ];
        case 77:
          _l = _m.sent();
          return [3 /*break*/, 80];
        case 78:
          return [
            4 /*yield*/,
            (0, send_js_1.searchMessagesDiscord)({
              guildId: guildId,
              content: content,
              channelIds: channelIdList.length ? channelIdList : undefined,
              authorIds: authorIdList.length ? authorIdList : undefined,
              limit: limit,
            }),
          ];
        case 79:
          _l = _m.sent();
          _m.label = 80;
        case 80:
          results = _l;
          if (!results || typeof results !== "object") {
            return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, results: results })];
          }
          resultsRecord = results;
          messages = resultsRecord.messages;
          normalizedMessages = Array.isArray(messages)
            ? messages.map(function (group) {
                return Array.isArray(group)
                  ? group.map(function (msg) {
                      return normalizeMessage(msg);
                    })
                  : group;
              })
            : messages;
          return [
            2 /*return*/,
            (0, common_js_1.jsonResult)({
              ok: true,
              results: __assign(__assign({}, resultsRecord), { messages: normalizedMessages }),
            }),
          ];
        case 81:
          throw new Error("Unknown action: ".concat(action));
      }
    });
  });
}
