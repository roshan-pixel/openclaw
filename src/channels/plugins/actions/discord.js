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
exports.discordMessageActions = void 0;
var common_js_1 = require("../../../agents/tools/common.js");
var accounts_js_1 = require("../../../discord/accounts.js");
var handle_action_js_1 = require("./discord/handle-action.js");
exports.discordMessageActions = {
  listActions: function (_a) {
    var _b, _c;
    var cfg = _a.cfg;
    var accounts = (0, accounts_js_1.listEnabledDiscordAccounts)(cfg).filter(function (account) {
      return account.tokenSource !== "none";
    });
    if (accounts.length === 0) {
      return [];
    }
    var gate = (0, common_js_1.createActionGate)(
      (_c = (_b = cfg.channels) === null || _b === void 0 ? void 0 : _b.discord) === null ||
        _c === void 0
        ? void 0
        : _c.actions,
    );
    var actions = new Set(["send"]);
    if (gate("polls")) {
      actions.add("poll");
    }
    if (gate("reactions")) {
      actions.add("react");
      actions.add("reactions");
    }
    if (gate("messages")) {
      actions.add("read");
      actions.add("edit");
      actions.add("delete");
    }
    if (gate("pins")) {
      actions.add("pin");
      actions.add("unpin");
      actions.add("list-pins");
    }
    if (gate("permissions")) {
      actions.add("permissions");
    }
    if (gate("threads")) {
      actions.add("thread-create");
      actions.add("thread-list");
      actions.add("thread-reply");
    }
    if (gate("search")) {
      actions.add("search");
    }
    if (gate("stickers")) {
      actions.add("sticker");
    }
    if (gate("memberInfo")) {
      actions.add("member-info");
    }
    if (gate("roleInfo")) {
      actions.add("role-info");
    }
    if (gate("reactions")) {
      actions.add("emoji-list");
    }
    if (gate("emojiUploads")) {
      actions.add("emoji-upload");
    }
    if (gate("stickerUploads")) {
      actions.add("sticker-upload");
    }
    if (gate("roles", false)) {
      actions.add("role-add");
      actions.add("role-remove");
    }
    if (gate("channelInfo")) {
      actions.add("channel-info");
      actions.add("channel-list");
    }
    if (gate("channels")) {
      actions.add("channel-create");
      actions.add("channel-edit");
      actions.add("channel-delete");
      actions.add("channel-move");
      actions.add("category-create");
      actions.add("category-edit");
      actions.add("category-delete");
    }
    if (gate("voiceStatus")) {
      actions.add("voice-status");
    }
    if (gate("events")) {
      actions.add("event-list");
      actions.add("event-create");
    }
    if (gate("moderation", false)) {
      actions.add("timeout");
      actions.add("kick");
      actions.add("ban");
    }
    return Array.from(actions);
  },
  extractToolSend: function (_a) {
    var args = _a.args;
    var action = typeof args.action === "string" ? args.action.trim() : "";
    if (action === "sendMessage") {
      var to = typeof args.to === "string" ? args.to : undefined;
      return to ? { to: to } : null;
    }
    if (action === "threadReply") {
      var channelId = typeof args.channelId === "string" ? args.channelId.trim() : "";
      return channelId ? { to: "channel:".concat(channelId) } : null;
    }
    return null;
  },
  handleAction: function (_a) {
    return __awaiter(void 0, [_a], void 0, function (_b) {
      var action = _b.action,
        params = _b.params,
        cfg = _b.cfg,
        accountId = _b.accountId;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            return [
              4 /*yield*/,
              (0, handle_action_js_1.handleDiscordMessageAction)({
                action: action,
                params: params,
                cfg: cfg,
                accountId: accountId,
              }),
            ];
          case 1:
            return [2 /*return*/, _c.sent()];
        }
      });
    });
  },
};
