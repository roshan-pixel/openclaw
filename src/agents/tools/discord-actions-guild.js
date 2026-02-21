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
exports.handleDiscordGuildAction = handleDiscordGuildAction;
var presence_cache_js_1 = require("../../discord/monitor/presence-cache.js");
var send_js_1 = require("../../discord/send.js");
var common_js_1 = require("./common.js");
function readParentIdParam(params) {
  if (params.clearParent === true) {
    return null;
  }
  if (params.parentId === null) {
    return null;
  }
  return (0, common_js_1.readStringParam)(params, "parentId");
}
function handleDiscordGuildAction(action, params, isActionEnabled) {
  return __awaiter(this, void 0, void 0, function () {
    var accountId,
      _a,
      guildId,
      userId,
      member,
      _b,
      presence,
      activities,
      status_1,
      guildId,
      roles,
      _c,
      guildId,
      emojis,
      _d,
      guildId,
      name_1,
      mediaUrl,
      roleIds,
      emoji,
      _e,
      guildId,
      name_2,
      description,
      tags,
      mediaUrl,
      sticker,
      _f,
      guildId,
      userId,
      roleId,
      guildId,
      userId,
      roleId,
      channelId,
      channel,
      _g,
      guildId,
      channels,
      _h,
      guildId,
      userId,
      voice,
      _j,
      guildId,
      events,
      _k,
      guildId,
      name_3,
      startTime,
      endTime,
      description,
      channelId,
      location_1,
      entityTypeRaw,
      entityType,
      payload,
      event_1,
      _l,
      guildId,
      name_4,
      type,
      parentId,
      topic,
      position,
      nsfw,
      channel,
      _m,
      channelId,
      name_5,
      topic,
      position,
      parentId,
      nsfw,
      rateLimitPerUser,
      channel,
      _o,
      channelId,
      result,
      _p,
      guildId,
      channelId,
      parentId,
      position,
      guildId,
      name_6,
      position,
      channel,
      _q,
      categoryId,
      name_7,
      position,
      channel,
      _r,
      categoryId,
      result,
      _s,
      channelId,
      targetId,
      targetTypeRaw,
      targetType,
      allow,
      deny,
      channelId,
      targetId;
    var _t, _u;
    return __generator(this, function (_v) {
      switch (_v.label) {
        case 0:
          accountId = (0, common_js_1.readStringParam)(params, "accountId");
          _a = action;
          switch (_a) {
            case "memberInfo":
              return [3 /*break*/, 1];
            case "roleInfo":
              return [3 /*break*/, 6];
            case "emojiList":
              return [3 /*break*/, 11];
            case "emojiUpload":
              return [3 /*break*/, 16];
            case "stickerUpload":
              return [3 /*break*/, 21];
            case "roleAdd":
              return [3 /*break*/, 26];
            case "roleRemove":
              return [3 /*break*/, 31];
            case "channelInfo":
              return [3 /*break*/, 36];
            case "channelList":
              return [3 /*break*/, 41];
            case "voiceStatus":
              return [3 /*break*/, 46];
            case "eventList":
              return [3 /*break*/, 51];
            case "eventCreate":
              return [3 /*break*/, 56];
            case "channelCreate":
              return [3 /*break*/, 61];
            case "channelEdit":
              return [3 /*break*/, 66];
            case "channelDelete":
              return [3 /*break*/, 71];
            case "channelMove":
              return [3 /*break*/, 76];
            case "categoryCreate":
              return [3 /*break*/, 81];
            case "categoryEdit":
              return [3 /*break*/, 86];
            case "categoryDelete":
              return [3 /*break*/, 91];
            case "channelPermissionSet":
              return [3 /*break*/, 96];
            case "channelPermissionRemove":
              return [3 /*break*/, 101];
          }
          return [3 /*break*/, 106];
        case 1:
          if (!isActionEnabled("memberInfo")) {
            throw new Error("Discord member info is disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", {
            required: true,
          });
          userId = (0, common_js_1.readStringParam)(params, "userId", {
            required: true,
          });
          if (!accountId) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.fetchMemberInfoDiscord)(guildId, userId, { accountId: accountId }),
          ];
        case 2:
          _b = _v.sent();
          return [3 /*break*/, 5];
        case 3:
          return [4 /*yield*/, (0, send_js_1.fetchMemberInfoDiscord)(guildId, userId)];
        case 4:
          _b = _v.sent();
          _v.label = 5;
        case 5:
          member = _b;
          presence = (0, presence_cache_js_1.getPresence)(accountId, userId);
          activities =
            (_t = presence === null || presence === void 0 ? void 0 : presence.activities) !==
              null && _t !== void 0
              ? _t
              : undefined;
          status_1 =
            (_u = presence === null || presence === void 0 ? void 0 : presence.status) !== null &&
            _u !== void 0
              ? _u
              : undefined;
          return [
            2 /*return*/,
            (0, common_js_1.jsonResult)(
              __assign(
                { ok: true, member: member },
                presence ? { status: status_1, activities: activities } : {},
              ),
            ),
          ];
        case 6:
          if (!isActionEnabled("roleInfo")) {
            throw new Error("Discord role info is disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", {
            required: true,
          });
          if (!accountId) {
            return [3 /*break*/, 8];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.fetchRoleInfoDiscord)(guildId, { accountId: accountId }),
          ];
        case 7:
          _c = _v.sent();
          return [3 /*break*/, 10];
        case 8:
          return [4 /*yield*/, (0, send_js_1.fetchRoleInfoDiscord)(guildId)];
        case 9:
          _c = _v.sent();
          _v.label = 10;
        case 10:
          roles = _c;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, roles: roles })];
        case 11:
          if (!isActionEnabled("reactions")) {
            throw new Error("Discord reactions are disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", {
            required: true,
          });
          if (!accountId) {
            return [3 /*break*/, 13];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.listGuildEmojisDiscord)(guildId, { accountId: accountId }),
          ];
        case 12:
          _d = _v.sent();
          return [3 /*break*/, 15];
        case 13:
          return [4 /*yield*/, (0, send_js_1.listGuildEmojisDiscord)(guildId)];
        case 14:
          _d = _v.sent();
          _v.label = 15;
        case 15:
          emojis = _d;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, emojis: emojis })];
        case 16:
          if (!isActionEnabled("emojiUploads")) {
            throw new Error("Discord emoji uploads are disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", {
            required: true,
          });
          name_1 = (0, common_js_1.readStringParam)(params, "name", { required: true });
          mediaUrl = (0, common_js_1.readStringParam)(params, "mediaUrl", {
            required: true,
          });
          roleIds = (0, common_js_1.readStringArrayParam)(params, "roleIds");
          if (!accountId) {
            return [3 /*break*/, 18];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.uploadEmojiDiscord)(
              {
                guildId: guildId,
                name: name_1,
                mediaUrl: mediaUrl,
                roleIds: (roleIds === null || roleIds === void 0 ? void 0 : roleIds.length)
                  ? roleIds
                  : undefined,
              },
              { accountId: accountId },
            ),
          ];
        case 17:
          _e = _v.sent();
          return [3 /*break*/, 20];
        case 18:
          return [
            4 /*yield*/,
            (0, send_js_1.uploadEmojiDiscord)({
              guildId: guildId,
              name: name_1,
              mediaUrl: mediaUrl,
              roleIds: (roleIds === null || roleIds === void 0 ? void 0 : roleIds.length)
                ? roleIds
                : undefined,
            }),
          ];
        case 19:
          _e = _v.sent();
          _v.label = 20;
        case 20:
          emoji = _e;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, emoji: emoji })];
        case 21:
          if (!isActionEnabled("stickerUploads")) {
            throw new Error("Discord sticker uploads are disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", {
            required: true,
          });
          name_2 = (0, common_js_1.readStringParam)(params, "name", { required: true });
          description = (0, common_js_1.readStringParam)(params, "description", {
            required: true,
          });
          tags = (0, common_js_1.readStringParam)(params, "tags", { required: true });
          mediaUrl = (0, common_js_1.readStringParam)(params, "mediaUrl", {
            required: true,
          });
          if (!accountId) {
            return [3 /*break*/, 23];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.uploadStickerDiscord)(
              {
                guildId: guildId,
                name: name_2,
                description: description,
                tags: tags,
                mediaUrl: mediaUrl,
              },
              { accountId: accountId },
            ),
          ];
        case 22:
          _f = _v.sent();
          return [3 /*break*/, 25];
        case 23:
          return [
            4 /*yield*/,
            (0, send_js_1.uploadStickerDiscord)({
              guildId: guildId,
              name: name_2,
              description: description,
              tags: tags,
              mediaUrl: mediaUrl,
            }),
          ];
        case 24:
          _f = _v.sent();
          _v.label = 25;
        case 25:
          sticker = _f;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, sticker: sticker })];
        case 26:
          if (!isActionEnabled("roles", false)) {
            throw new Error("Discord role changes are disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", {
            required: true,
          });
          userId = (0, common_js_1.readStringParam)(params, "userId", {
            required: true,
          });
          roleId = (0, common_js_1.readStringParam)(params, "roleId", { required: true });
          if (!accountId) {
            return [3 /*break*/, 28];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.addRoleDiscord)(
              { guildId: guildId, userId: userId, roleId: roleId },
              { accountId: accountId },
            ),
          ];
        case 27:
          _v.sent();
          return [3 /*break*/, 30];
        case 28:
          return [
            4 /*yield*/,
            (0, send_js_1.addRoleDiscord)({ guildId: guildId, userId: userId, roleId: roleId }),
          ];
        case 29:
          _v.sent();
          _v.label = 30;
        case 30:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
        case 31:
          if (!isActionEnabled("roles", false)) {
            throw new Error("Discord role changes are disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", {
            required: true,
          });
          userId = (0, common_js_1.readStringParam)(params, "userId", {
            required: true,
          });
          roleId = (0, common_js_1.readStringParam)(params, "roleId", { required: true });
          if (!accountId) {
            return [3 /*break*/, 33];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.removeRoleDiscord)(
              { guildId: guildId, userId: userId, roleId: roleId },
              { accountId: accountId },
            ),
          ];
        case 32:
          _v.sent();
          return [3 /*break*/, 35];
        case 33:
          return [
            4 /*yield*/,
            (0, send_js_1.removeRoleDiscord)({ guildId: guildId, userId: userId, roleId: roleId }),
          ];
        case 34:
          _v.sent();
          _v.label = 35;
        case 35:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
        case 36:
          if (!isActionEnabled("channelInfo")) {
            throw new Error("Discord channel info is disabled.");
          }
          channelId = (0, common_js_1.readStringParam)(params, "channelId", {
            required: true,
          });
          if (!accountId) {
            return [3 /*break*/, 38];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.fetchChannelInfoDiscord)(channelId, { accountId: accountId }),
          ];
        case 37:
          _g = _v.sent();
          return [3 /*break*/, 40];
        case 38:
          return [4 /*yield*/, (0, send_js_1.fetchChannelInfoDiscord)(channelId)];
        case 39:
          _g = _v.sent();
          _v.label = 40;
        case 40:
          channel = _g;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, channel: channel })];
        case 41:
          if (!isActionEnabled("channelInfo")) {
            throw new Error("Discord channel info is disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", {
            required: true,
          });
          if (!accountId) {
            return [3 /*break*/, 43];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.listGuildChannelsDiscord)(guildId, { accountId: accountId }),
          ];
        case 42:
          _h = _v.sent();
          return [3 /*break*/, 45];
        case 43:
          return [4 /*yield*/, (0, send_js_1.listGuildChannelsDiscord)(guildId)];
        case 44:
          _h = _v.sent();
          _v.label = 45;
        case 45:
          channels = _h;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, channels: channels })];
        case 46:
          if (!isActionEnabled("voiceStatus")) {
            throw new Error("Discord voice status is disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", {
            required: true,
          });
          userId = (0, common_js_1.readStringParam)(params, "userId", {
            required: true,
          });
          if (!accountId) {
            return [3 /*break*/, 48];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.fetchVoiceStatusDiscord)(guildId, userId, { accountId: accountId }),
          ];
        case 47:
          _j = _v.sent();
          return [3 /*break*/, 50];
        case 48:
          return [4 /*yield*/, (0, send_js_1.fetchVoiceStatusDiscord)(guildId, userId)];
        case 49:
          _j = _v.sent();
          _v.label = 50;
        case 50:
          voice = _j;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, voice: voice })];
        case 51:
          if (!isActionEnabled("events")) {
            throw new Error("Discord events are disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", {
            required: true,
          });
          if (!accountId) {
            return [3 /*break*/, 53];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.listScheduledEventsDiscord)(guildId, { accountId: accountId }),
          ];
        case 52:
          _k = _v.sent();
          return [3 /*break*/, 55];
        case 53:
          return [4 /*yield*/, (0, send_js_1.listScheduledEventsDiscord)(guildId)];
        case 54:
          _k = _v.sent();
          _v.label = 55;
        case 55:
          events = _k;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, events: events })];
        case 56:
          if (!isActionEnabled("events")) {
            throw new Error("Discord events are disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", {
            required: true,
          });
          name_3 = (0, common_js_1.readStringParam)(params, "name", { required: true });
          startTime = (0, common_js_1.readStringParam)(params, "startTime", {
            required: true,
          });
          endTime = (0, common_js_1.readStringParam)(params, "endTime");
          description = (0, common_js_1.readStringParam)(params, "description");
          channelId = (0, common_js_1.readStringParam)(params, "channelId");
          location_1 = (0, common_js_1.readStringParam)(params, "location");
          entityTypeRaw = (0, common_js_1.readStringParam)(params, "entityType");
          entityType = entityTypeRaw === "stage" ? 1 : entityTypeRaw === "external" ? 3 : 2;
          payload = {
            name: name_3,
            description: description,
            scheduled_start_time: startTime,
            scheduled_end_time: endTime,
            entity_type: entityType,
            channel_id: channelId,
            entity_metadata: entityType === 3 && location_1 ? { location: location_1 } : undefined,
            privacy_level: 2,
          };
          if (!accountId) {
            return [3 /*break*/, 58];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.createScheduledEventDiscord)(guildId, payload, { accountId: accountId }),
          ];
        case 57:
          _l = _v.sent();
          return [3 /*break*/, 60];
        case 58:
          return [4 /*yield*/, (0, send_js_1.createScheduledEventDiscord)(guildId, payload)];
        case 59:
          _l = _v.sent();
          _v.label = 60;
        case 60:
          event_1 = _l;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, event: event_1 })];
        case 61:
          if (!isActionEnabled("channels")) {
            throw new Error("Discord channel management is disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", { required: true });
          name_4 = (0, common_js_1.readStringParam)(params, "name", { required: true });
          type = (0, common_js_1.readNumberParam)(params, "type", { integer: true });
          parentId = readParentIdParam(params);
          topic = (0, common_js_1.readStringParam)(params, "topic");
          position = (0, common_js_1.readNumberParam)(params, "position", { integer: true });
          nsfw = params.nsfw;
          if (!accountId) {
            return [3 /*break*/, 63];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.createChannelDiscord)(
              {
                guildId: guildId,
                name: name_4,
                type: type !== null && type !== void 0 ? type : undefined,
                parentId: parentId !== null && parentId !== void 0 ? parentId : undefined,
                topic: topic !== null && topic !== void 0 ? topic : undefined,
                position: position !== null && position !== void 0 ? position : undefined,
                nsfw: nsfw,
              },
              { accountId: accountId },
            ),
          ];
        case 62:
          _m = _v.sent();
          return [3 /*break*/, 65];
        case 63:
          return [
            4 /*yield*/,
            (0, send_js_1.createChannelDiscord)({
              guildId: guildId,
              name: name_4,
              type: type !== null && type !== void 0 ? type : undefined,
              parentId: parentId !== null && parentId !== void 0 ? parentId : undefined,
              topic: topic !== null && topic !== void 0 ? topic : undefined,
              position: position !== null && position !== void 0 ? position : undefined,
              nsfw: nsfw,
            }),
          ];
        case 64:
          _m = _v.sent();
          _v.label = 65;
        case 65:
          channel = _m;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, channel: channel })];
        case 66:
          if (!isActionEnabled("channels")) {
            throw new Error("Discord channel management is disabled.");
          }
          channelId = (0, common_js_1.readStringParam)(params, "channelId", {
            required: true,
          });
          name_5 = (0, common_js_1.readStringParam)(params, "name");
          topic = (0, common_js_1.readStringParam)(params, "topic");
          position = (0, common_js_1.readNumberParam)(params, "position", { integer: true });
          parentId = readParentIdParam(params);
          nsfw = params.nsfw;
          rateLimitPerUser = (0, common_js_1.readNumberParam)(params, "rateLimitPerUser", {
            integer: true,
          });
          if (!accountId) {
            return [3 /*break*/, 68];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.editChannelDiscord)(
              {
                channelId: channelId,
                name: name_5 !== null && name_5 !== void 0 ? name_5 : undefined,
                topic: topic !== null && topic !== void 0 ? topic : undefined,
                position: position !== null && position !== void 0 ? position : undefined,
                parentId: parentId,
                nsfw: nsfw,
                rateLimitPerUser:
                  rateLimitPerUser !== null && rateLimitPerUser !== void 0
                    ? rateLimitPerUser
                    : undefined,
              },
              { accountId: accountId },
            ),
          ];
        case 67:
          _o = _v.sent();
          return [3 /*break*/, 70];
        case 68:
          return [
            4 /*yield*/,
            (0, send_js_1.editChannelDiscord)({
              channelId: channelId,
              name: name_5 !== null && name_5 !== void 0 ? name_5 : undefined,
              topic: topic !== null && topic !== void 0 ? topic : undefined,
              position: position !== null && position !== void 0 ? position : undefined,
              parentId: parentId,
              nsfw: nsfw,
              rateLimitPerUser:
                rateLimitPerUser !== null && rateLimitPerUser !== void 0
                  ? rateLimitPerUser
                  : undefined,
            }),
          ];
        case 69:
          _o = _v.sent();
          _v.label = 70;
        case 70:
          channel = _o;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, channel: channel })];
        case 71:
          if (!isActionEnabled("channels")) {
            throw new Error("Discord channel management is disabled.");
          }
          channelId = (0, common_js_1.readStringParam)(params, "channelId", {
            required: true,
          });
          if (!accountId) {
            return [3 /*break*/, 73];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.deleteChannelDiscord)(channelId, { accountId: accountId }),
          ];
        case 72:
          _p = _v.sent();
          return [3 /*break*/, 75];
        case 73:
          return [4 /*yield*/, (0, send_js_1.deleteChannelDiscord)(channelId)];
        case 74:
          _p = _v.sent();
          _v.label = 75;
        case 75:
          result = _p;
          return [2 /*return*/, (0, common_js_1.jsonResult)(result)];
        case 76:
          if (!isActionEnabled("channels")) {
            throw new Error("Discord channel management is disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", { required: true });
          channelId = (0, common_js_1.readStringParam)(params, "channelId", {
            required: true,
          });
          parentId = readParentIdParam(params);
          position = (0, common_js_1.readNumberParam)(params, "position", { integer: true });
          if (!accountId) {
            return [3 /*break*/, 78];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.moveChannelDiscord)(
              {
                guildId: guildId,
                channelId: channelId,
                parentId: parentId,
                position: position !== null && position !== void 0 ? position : undefined,
              },
              { accountId: accountId },
            ),
          ];
        case 77:
          _v.sent();
          return [3 /*break*/, 80];
        case 78:
          return [
            4 /*yield*/,
            (0, send_js_1.moveChannelDiscord)({
              guildId: guildId,
              channelId: channelId,
              parentId: parentId,
              position: position !== null && position !== void 0 ? position : undefined,
            }),
          ];
        case 79:
          _v.sent();
          _v.label = 80;
        case 80:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
        case 81:
          if (!isActionEnabled("channels")) {
            throw new Error("Discord channel management is disabled.");
          }
          guildId = (0, common_js_1.readStringParam)(params, "guildId", { required: true });
          name_6 = (0, common_js_1.readStringParam)(params, "name", { required: true });
          position = (0, common_js_1.readNumberParam)(params, "position", { integer: true });
          if (!accountId) {
            return [3 /*break*/, 83];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.createChannelDiscord)(
              {
                guildId: guildId,
                name: name_6,
                type: 4,
                position: position !== null && position !== void 0 ? position : undefined,
              },
              { accountId: accountId },
            ),
          ];
        case 82:
          _q = _v.sent();
          return [3 /*break*/, 85];
        case 83:
          return [
            4 /*yield*/,
            (0, send_js_1.createChannelDiscord)({
              guildId: guildId,
              name: name_6,
              type: 4,
              position: position !== null && position !== void 0 ? position : undefined,
            }),
          ];
        case 84:
          _q = _v.sent();
          _v.label = 85;
        case 85:
          channel = _q;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, category: channel })];
        case 86:
          if (!isActionEnabled("channels")) {
            throw new Error("Discord channel management is disabled.");
          }
          categoryId = (0, common_js_1.readStringParam)(params, "categoryId", {
            required: true,
          });
          name_7 = (0, common_js_1.readStringParam)(params, "name");
          position = (0, common_js_1.readNumberParam)(params, "position", { integer: true });
          if (!accountId) {
            return [3 /*break*/, 88];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.editChannelDiscord)(
              {
                channelId: categoryId,
                name: name_7 !== null && name_7 !== void 0 ? name_7 : undefined,
                position: position !== null && position !== void 0 ? position : undefined,
              },
              { accountId: accountId },
            ),
          ];
        case 87:
          _r = _v.sent();
          return [3 /*break*/, 90];
        case 88:
          return [
            4 /*yield*/,
            (0, send_js_1.editChannelDiscord)({
              channelId: categoryId,
              name: name_7 !== null && name_7 !== void 0 ? name_7 : undefined,
              position: position !== null && position !== void 0 ? position : undefined,
            }),
          ];
        case 89:
          _r = _v.sent();
          _v.label = 90;
        case 90:
          channel = _r;
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true, category: channel })];
        case 91:
          if (!isActionEnabled("channels")) {
            throw new Error("Discord channel management is disabled.");
          }
          categoryId = (0, common_js_1.readStringParam)(params, "categoryId", {
            required: true,
          });
          if (!accountId) {
            return [3 /*break*/, 93];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.deleteChannelDiscord)(categoryId, { accountId: accountId }),
          ];
        case 92:
          _s = _v.sent();
          return [3 /*break*/, 95];
        case 93:
          return [4 /*yield*/, (0, send_js_1.deleteChannelDiscord)(categoryId)];
        case 94:
          _s = _v.sent();
          _v.label = 95;
        case 95:
          result = _s;
          return [2 /*return*/, (0, common_js_1.jsonResult)(result)];
        case 96:
          if (!isActionEnabled("channels")) {
            throw new Error("Discord channel management is disabled.");
          }
          channelId = (0, common_js_1.readStringParam)(params, "channelId", {
            required: true,
          });
          targetId = (0, common_js_1.readStringParam)(params, "targetId", { required: true });
          targetTypeRaw = (0, common_js_1.readStringParam)(params, "targetType", {
            required: true,
          });
          targetType = targetTypeRaw === "member" ? 1 : 0;
          allow = (0, common_js_1.readStringParam)(params, "allow");
          deny = (0, common_js_1.readStringParam)(params, "deny");
          if (!accountId) {
            return [3 /*break*/, 98];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.setChannelPermissionDiscord)(
              {
                channelId: channelId,
                targetId: targetId,
                targetType: targetType,
                allow: allow !== null && allow !== void 0 ? allow : undefined,
                deny: deny !== null && deny !== void 0 ? deny : undefined,
              },
              { accountId: accountId },
            ),
          ];
        case 97:
          _v.sent();
          return [3 /*break*/, 100];
        case 98:
          return [
            4 /*yield*/,
            (0, send_js_1.setChannelPermissionDiscord)({
              channelId: channelId,
              targetId: targetId,
              targetType: targetType,
              allow: allow !== null && allow !== void 0 ? allow : undefined,
              deny: deny !== null && deny !== void 0 ? deny : undefined,
            }),
          ];
        case 99:
          _v.sent();
          _v.label = 100;
        case 100:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
        case 101:
          if (!isActionEnabled("channels")) {
            throw new Error("Discord channel management is disabled.");
          }
          channelId = (0, common_js_1.readStringParam)(params, "channelId", {
            required: true,
          });
          targetId = (0, common_js_1.readStringParam)(params, "targetId", { required: true });
          if (!accountId) {
            return [3 /*break*/, 103];
          }
          return [
            4 /*yield*/,
            (0, send_js_1.removeChannelPermissionDiscord)(channelId, targetId, {
              accountId: accountId,
            }),
          ];
        case 102:
          _v.sent();
          return [3 /*break*/, 105];
        case 103:
          return [4 /*yield*/, (0, send_js_1.removeChannelPermissionDiscord)(channelId, targetId)];
        case 104:
          _v.sent();
          _v.label = 105;
        case 105:
          return [2 /*return*/, (0, common_js_1.jsonResult)({ ok: true })];
        case 106:
          throw new Error("Unknown action: ".concat(action));
      }
    });
  });
}
