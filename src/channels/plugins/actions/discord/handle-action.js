"use strict";
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
exports.handleDiscordMessageAction = handleDiscordMessageAction;
var common_js_1 = require("../../../../agents/tools/common.js");
var discord_actions_js_1 = require("../../../../agents/tools/discord-actions.js");
var handle_action_guild_admin_js_1 = require("./handle-action.guild-admin.js");
var targets_js_1 = require("../../../../discord/targets.js");
var providerId = "discord";
function readParentIdParam(params) {
  if (params.clearParent === true) {
    return null;
  }
  if (params.parentId === null) {
    return null;
  }
  return (0, common_js_1.readStringParam)(params, "parentId");
}
function handleDiscordMessageAction(ctx) {
  return __awaiter(this, void 0, void 0, function () {
    var action,
      params,
      cfg,
      accountId,
      resolveChannelId,
      to,
      content,
      mediaUrl,
      replyTo,
      embeds,
      to,
      question,
      answers,
      allowMultiselect,
      durationHours,
      messageId,
      emoji,
      remove,
      messageId,
      limit,
      limit,
      messageId,
      content,
      messageId,
      messageId,
      name_1,
      messageId,
      autoArchiveMinutes,
      stickerIds,
      adminResult;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          ((action = ctx.action), (params = ctx.params), (cfg = ctx.cfg));
          accountId =
            (_a = ctx.accountId) !== null && _a !== void 0
              ? _a
              : (0, common_js_1.readStringParam)(params, "accountId");
          resolveChannelId = function () {
            var _a;
            return (0, targets_js_1.resolveDiscordChannelId)(
              (_a = (0, common_js_1.readStringParam)(params, "channelId")) !== null && _a !== void 0
                ? _a
                : (0, common_js_1.readStringParam)(params, "to", { required: true }),
            );
          };
          if (!(action === "send")) {
            return [3 /*break*/, 2];
          }
          to = (0, common_js_1.readStringParam)(params, "to", { required: true });
          content = (0, common_js_1.readStringParam)(params, "message", {
            required: true,
            allowEmpty: true,
          });
          mediaUrl = (0, common_js_1.readStringParam)(params, "media", { trim: false });
          replyTo = (0, common_js_1.readStringParam)(params, "replyTo");
          embeds = Array.isArray(params.embeds) ? params.embeds : undefined;
          return [
            4 /*yield*/,
            (0, discord_actions_js_1.handleDiscordAction)(
              {
                action: "sendMessage",
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                to: to,
                content: content,
                mediaUrl: mediaUrl !== null && mediaUrl !== void 0 ? mediaUrl : undefined,
                replyTo: replyTo !== null && replyTo !== void 0 ? replyTo : undefined,
                embeds: embeds,
              },
              cfg,
            ),
          ];
        case 1:
          return [2 /*return*/, _d.sent()];
        case 2:
          if (!(action === "poll")) {
            return [3 /*break*/, 4];
          }
          to = (0, common_js_1.readStringParam)(params, "to", { required: true });
          question = (0, common_js_1.readStringParam)(params, "pollQuestion", {
            required: true,
          });
          answers =
            (_b = (0, common_js_1.readStringArrayParam)(params, "pollOption", {
              required: true,
            })) !== null && _b !== void 0
              ? _b
              : [];
          allowMultiselect = typeof params.pollMulti === "boolean" ? params.pollMulti : undefined;
          durationHours = (0, common_js_1.readNumberParam)(params, "pollDurationHours", {
            integer: true,
          });
          return [
            4 /*yield*/,
            (0, discord_actions_js_1.handleDiscordAction)(
              {
                action: "poll",
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                to: to,
                question: question,
                answers: answers,
                allowMultiselect: allowMultiselect,
                durationHours:
                  durationHours !== null && durationHours !== void 0 ? durationHours : undefined,
                content: (0, common_js_1.readStringParam)(params, "message"),
              },
              cfg,
            ),
          ];
        case 3:
          return [2 /*return*/, _d.sent()];
        case 4:
          if (!(action === "react")) {
            return [3 /*break*/, 6];
          }
          messageId = (0, common_js_1.readStringParam)(params, "messageId", { required: true });
          emoji = (0, common_js_1.readStringParam)(params, "emoji", { allowEmpty: true });
          remove = typeof params.remove === "boolean" ? params.remove : undefined;
          return [
            4 /*yield*/,
            (0, discord_actions_js_1.handleDiscordAction)(
              {
                action: "react",
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                channelId: resolveChannelId(),
                messageId: messageId,
                emoji: emoji,
                remove: remove,
              },
              cfg,
            ),
          ];
        case 5:
          return [2 /*return*/, _d.sent()];
        case 6:
          if (!(action === "reactions")) {
            return [3 /*break*/, 8];
          }
          messageId = (0, common_js_1.readStringParam)(params, "messageId", { required: true });
          limit = (0, common_js_1.readNumberParam)(params, "limit", { integer: true });
          return [
            4 /*yield*/,
            (0, discord_actions_js_1.handleDiscordAction)(
              {
                action: "reactions",
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                channelId: resolveChannelId(),
                messageId: messageId,
                limit: limit,
              },
              cfg,
            ),
          ];
        case 7:
          return [2 /*return*/, _d.sent()];
        case 8:
          if (!(action === "read")) {
            return [3 /*break*/, 10];
          }
          limit = (0, common_js_1.readNumberParam)(params, "limit", { integer: true });
          return [
            4 /*yield*/,
            (0, discord_actions_js_1.handleDiscordAction)(
              {
                action: "readMessages",
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                channelId: resolveChannelId(),
                limit: limit,
                before: (0, common_js_1.readStringParam)(params, "before"),
                after: (0, common_js_1.readStringParam)(params, "after"),
                around: (0, common_js_1.readStringParam)(params, "around"),
              },
              cfg,
            ),
          ];
        case 9:
          return [2 /*return*/, _d.sent()];
        case 10:
          if (!(action === "edit")) {
            return [3 /*break*/, 12];
          }
          messageId = (0, common_js_1.readStringParam)(params, "messageId", { required: true });
          content = (0, common_js_1.readStringParam)(params, "message", { required: true });
          return [
            4 /*yield*/,
            (0, discord_actions_js_1.handleDiscordAction)(
              {
                action: "editMessage",
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                channelId: resolveChannelId(),
                messageId: messageId,
                content: content,
              },
              cfg,
            ),
          ];
        case 11:
          return [2 /*return*/, _d.sent()];
        case 12:
          if (!(action === "delete")) {
            return [3 /*break*/, 14];
          }
          messageId = (0, common_js_1.readStringParam)(params, "messageId", { required: true });
          return [
            4 /*yield*/,
            (0, discord_actions_js_1.handleDiscordAction)(
              {
                action: "deleteMessage",
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                channelId: resolveChannelId(),
                messageId: messageId,
              },
              cfg,
            ),
          ];
        case 13:
          return [2 /*return*/, _d.sent()];
        case 14:
          if (!(action === "pin" || action === "unpin" || action === "list-pins")) {
            return [3 /*break*/, 16];
          }
          messageId =
            action === "list-pins"
              ? undefined
              : (0, common_js_1.readStringParam)(params, "messageId", { required: true });
          return [
            4 /*yield*/,
            (0, discord_actions_js_1.handleDiscordAction)(
              {
                action:
                  action === "pin"
                    ? "pinMessage"
                    : action === "unpin"
                      ? "unpinMessage"
                      : "listPins",
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                channelId: resolveChannelId(),
                messageId: messageId,
              },
              cfg,
            ),
          ];
        case 15:
          return [2 /*return*/, _d.sent()];
        case 16:
          if (!(action === "permissions")) {
            return [3 /*break*/, 18];
          }
          return [
            4 /*yield*/,
            (0, discord_actions_js_1.handleDiscordAction)(
              {
                action: "permissions",
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                channelId: resolveChannelId(),
              },
              cfg,
            ),
          ];
        case 17:
          return [2 /*return*/, _d.sent()];
        case 18:
          if (!(action === "thread-create")) {
            return [3 /*break*/, 20];
          }
          name_1 = (0, common_js_1.readStringParam)(params, "threadName", { required: true });
          messageId = (0, common_js_1.readStringParam)(params, "messageId");
          autoArchiveMinutes = (0, common_js_1.readNumberParam)(params, "autoArchiveMin", {
            integer: true,
          });
          return [
            4 /*yield*/,
            (0, discord_actions_js_1.handleDiscordAction)(
              {
                action: "threadCreate",
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                channelId: resolveChannelId(),
                name: name_1,
                messageId: messageId,
                autoArchiveMinutes: autoArchiveMinutes,
              },
              cfg,
            ),
          ];
        case 19:
          return [2 /*return*/, _d.sent()];
        case 20:
          if (!(action === "sticker")) {
            return [3 /*break*/, 22];
          }
          stickerIds =
            (_c = (0, common_js_1.readStringArrayParam)(params, "stickerId", {
              required: true,
              label: "sticker-id",
            })) !== null && _c !== void 0
              ? _c
              : [];
          return [
            4 /*yield*/,
            (0, discord_actions_js_1.handleDiscordAction)(
              {
                action: "sticker",
                accountId: accountId !== null && accountId !== void 0 ? accountId : undefined,
                to: (0, common_js_1.readStringParam)(params, "to", { required: true }),
                stickerIds: stickerIds,
                content: (0, common_js_1.readStringParam)(params, "message"),
              },
              cfg,
            ),
          ];
        case 21:
          return [2 /*return*/, _d.sent()];
        case 22:
          return [
            4 /*yield*/,
            (0, handle_action_guild_admin_js_1.tryHandleDiscordMessageActionGuildAdmin)({
              ctx: ctx,
              resolveChannelId: resolveChannelId,
              readParentIdParam: readParentIdParam,
            }),
          ];
        case 23:
          adminResult = _d.sent();
          if (adminResult !== undefined) {
            return [2 /*return*/, adminResult];
          }
          throw new Error(
            "Action "
              .concat(String(action), " is not supported for provider ")
              .concat(providerId, "."),
          );
      }
    });
  });
}
