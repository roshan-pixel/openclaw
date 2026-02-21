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
exports.parseAndResolveRecipient = parseAndResolveRecipient;
exports.buildDiscordSendError = buildDiscordSendError;
exports.buildReactionIdentifier = buildReactionIdentifier;
exports.createDiscordClient = createDiscordClient;
exports.formatReactionEmoji = formatReactionEmoji;
exports.normalizeDiscordPollInput = normalizeDiscordPollInput;
exports.normalizeEmojiName = normalizeEmojiName;
exports.normalizeReactionEmoji = normalizeReactionEmoji;
exports.normalizeStickerIds = normalizeStickerIds;
exports.parseRecipient = parseRecipient;
exports.resolveChannelId = resolveChannelId;
exports.resolveDiscordRest = resolveDiscordRest;
exports.sendDiscordMedia = sendDiscordMedia;
exports.sendDiscordText = sendDiscordText;
var carbon_1 = require("@buape/carbon");
var v10_1 = require("discord-api-types/payloads/v10");
var v10_2 = require("discord-api-types/v10");
var config_js_1 = require("../config/config.js");
var retry_policy_js_1 = require("../infra/retry-policy.js");
var polls_js_1 = require("../polls.js");
var media_js_1 = require("../web/media.js");
var accounts_js_1 = require("./accounts.js");
var chunk_js_1 = require("./chunk.js");
var send_permissions_js_1 = require("./send.permissions.js");
var send_types_js_1 = require("./send.types.js");
var targets_js_1 = require("./targets.js");
var token_js_1 = require("./token.js");
var DISCORD_TEXT_LIMIT = 2000;
var DISCORD_MAX_STICKERS = 3;
var DISCORD_POLL_MAX_ANSWERS = 10;
var DISCORD_POLL_MAX_DURATION_HOURS = 32 * 24;
var DISCORD_MISSING_PERMISSIONS = 50013;
var DISCORD_CANNOT_DM = 50007;
function resolveToken(params) {
  var explicit = (0, token_js_1.normalizeDiscordToken)(params.explicit);
  if (explicit) {
    return explicit;
  }
  var fallback = (0, token_js_1.normalizeDiscordToken)(params.fallbackToken);
  if (!fallback) {
    throw new Error(
      'Discord bot token missing for account "'
        .concat(params.accountId, '" (set discord.accounts.')
        .concat(params.accountId, ".token or DISCORD_BOT_TOKEN for default)."),
    );
  }
  return fallback;
}
function resolveRest(token, rest) {
  return rest !== null && rest !== void 0 ? rest : new carbon_1.RequestClient(token);
}
function createDiscordClient(opts, cfg) {
  if (cfg === void 0) {
    cfg = (0, config_js_1.loadConfig)();
  }
  var account = (0, accounts_js_1.resolveDiscordAccount)({ cfg: cfg, accountId: opts.accountId });
  var token = resolveToken({
    explicit: opts.token,
    accountId: account.accountId,
    fallbackToken: account.token,
  });
  var rest = resolveRest(token, opts.rest);
  var request = (0, retry_policy_js_1.createDiscordRetryRunner)({
    retry: opts.retry,
    configRetry: account.config.retry,
    verbose: opts.verbose,
  });
  return { token: token, rest: rest, request: request };
}
function resolveDiscordRest(opts) {
  return createDiscordClient(opts).rest;
}
function normalizeReactionEmoji(raw) {
  var trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("emoji required");
  }
  var customMatch = trimmed.match(/^<a?:([^:>]+):(\d+)>$/);
  var identifier = customMatch
    ? "".concat(customMatch[1], ":").concat(customMatch[2])
    : trimmed.replace(/[\uFE0E\uFE0F]/g, "");
  return encodeURIComponent(identifier);
}
function parseRecipient(raw) {
  var target = (0, targets_js_1.parseDiscordTarget)(raw, {
    ambiguousMessage: 'Ambiguous Discord recipient "'
      .concat(raw.trim(), '". Use "user:')
      .concat(raw.trim(), '" for DMs or "channel:')
      .concat(raw.trim(), '" for channel messages.'),
  });
  if (!target) {
    throw new Error("Recipient is required for Discord sends");
  }
  return { kind: target.kind, id: target.id };
}
/**
 * Parse and resolve Discord recipient, including username lookup.
 * This enables sending DMs by username (e.g., "john.doe") by querying
 * the Discord directory to resolve usernames to user IDs.
 *
 * @param raw - The recipient string (username, ID, or known format)
 * @param accountId - Discord account ID to use for directory lookup
 * @returns Parsed DiscordRecipient with resolved user ID if applicable
 */
function parseAndResolveRecipient(raw, accountId) {
  return __awaiter(this, void 0, void 0, function () {
    var cfg, accountInfo, trimmed, parseOptions, resolved, parsed;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          accountInfo = (0, accounts_js_1.resolveDiscordAccount)({
            cfg: cfg,
            accountId: accountId,
          });
          trimmed = raw.trim();
          parseOptions = {
            ambiguousMessage: 'Ambiguous Discord recipient "'
              .concat(trimmed, '". Use "user:')
              .concat(trimmed, '" for DMs or "channel:')
              .concat(trimmed, '" for channel messages.'),
          };
          return [
            4 /*yield*/,
            (0, targets_js_1.resolveDiscordTarget)(
              raw,
              {
                cfg: cfg,
                accountId: accountInfo.accountId,
              },
              parseOptions,
            ),
          ];
        case 1:
          resolved = _a.sent();
          if (resolved) {
            return [2 /*return*/, { kind: resolved.kind, id: resolved.id }];
          }
          parsed = (0, targets_js_1.parseDiscordTarget)(raw, parseOptions);
          if (!parsed) {
            throw new Error("Recipient is required for Discord sends");
          }
          return [2 /*return*/, { kind: parsed.kind, id: parsed.id }];
      }
    });
  });
}
function normalizeStickerIds(raw) {
  var ids = raw
    .map(function (entry) {
      return entry.trim();
    })
    .filter(Boolean);
  if (ids.length === 0) {
    throw new Error("At least one sticker id is required");
  }
  if (ids.length > DISCORD_MAX_STICKERS) {
    throw new Error("Discord supports up to 3 stickers per message");
  }
  return ids;
}
function normalizeEmojiName(raw, label) {
  var name = raw.trim();
  if (!name) {
    throw new Error("".concat(label, " is required"));
  }
  return name;
}
function normalizeDiscordPollInput(input) {
  var poll = (0, polls_js_1.normalizePollInput)(input, {
    maxOptions: DISCORD_POLL_MAX_ANSWERS,
  });
  var duration = (0, polls_js_1.normalizePollDurationHours)(poll.durationHours, {
    defaultHours: 24,
    maxHours: DISCORD_POLL_MAX_DURATION_HOURS,
  });
  return {
    question: { text: poll.question },
    answers: poll.options.map(function (answer) {
      return { poll_media: { text: answer } };
    }),
    duration: duration,
    allow_multiselect: poll.maxSelections > 1,
    layout_type: v10_1.PollLayoutType.Default,
  };
}
function getDiscordErrorCode(err) {
  if (!err || typeof err !== "object") {
    return undefined;
  }
  var candidate =
    "code" in err && err.code !== undefined
      ? err.code
      : "rawError" in err && err.rawError && typeof err.rawError === "object"
        ? err.rawError.code
        : undefined;
  if (typeof candidate === "number") {
    return candidate;
  }
  if (typeof candidate === "string" && /^\d+$/.test(candidate)) {
    return Number(candidate);
  }
  return undefined;
}
function buildDiscordSendError(err, ctx) {
  return __awaiter(this, void 0, void 0, function () {
    var code, missing, permissions, current_1, required, _a, missingLabel;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          if (err instanceof send_types_js_1.DiscordSendError) {
            return [2 /*return*/, err];
          }
          code = getDiscordErrorCode(err);
          if (code === DISCORD_CANNOT_DM) {
            return [
              2 /*return*/,
              new send_types_js_1.DiscordSendError(
                "discord dm failed: user blocks dms or privacy settings disallow it",
                { kind: "dm-blocked" },
              ),
            ];
          }
          if (code !== DISCORD_MISSING_PERMISSIONS) {
            return [2 /*return*/, err];
          }
          missing = [];
          _b.label = 1;
        case 1:
          _b.trys.push([1, 3, , 4]);
          return [
            4 /*yield*/,
            (0, send_permissions_js_1.fetchChannelPermissionsDiscord)(ctx.channelId, {
              rest: ctx.rest,
              token: ctx.token,
            }),
          ];
        case 2:
          permissions = _b.sent();
          current_1 = new Set(permissions.permissions);
          required = ["ViewChannel", "SendMessages"];
          if ((0, send_permissions_js_1.isThreadChannelType)(permissions.channelType)) {
            required.push("SendMessagesInThreads");
          }
          if (ctx.hasMedia) {
            required.push("AttachFiles");
          }
          missing = required.filter(function (permission) {
            return !current_1.has(permission);
          });
          return [3 /*break*/, 4];
        case 3:
          _a = _b.sent();
          return [3 /*break*/, 4];
        case 4:
          missingLabel = missing.length
            ? "missing permissions in channel "
                .concat(ctx.channelId, ": ")
                .concat(missing.join(", "))
            : "missing permissions in channel ".concat(ctx.channelId);
          return [
            2 /*return*/,
            new send_types_js_1.DiscordSendError(
              "".concat(missingLabel, ". bot might be muted or blocked by role/channel overrides"),
              {
                kind: "missing-permissions",
                channelId: ctx.channelId,
                missingPermissions: missing,
              },
            ),
          ];
      }
    });
  });
}
function resolveChannelId(rest, recipient, request) {
  return __awaiter(this, void 0, void 0, function () {
    var dmChannel;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (recipient.kind === "channel") {
            return [2 /*return*/, { channelId: recipient.id }];
          }
          return [
            4 /*yield*/,
            request(function () {
              return rest.post(v10_2.Routes.userChannels(), {
                body: { recipient_id: recipient.id },
              });
            }, "dm-channel"),
          ];
        case 1:
          dmChannel = _a.sent();
          if (!(dmChannel === null || dmChannel === void 0 ? void 0 : dmChannel.id)) {
            throw new Error("Failed to create Discord DM channel");
          }
          return [2 /*return*/, { channelId: dmChannel.id, dm: true }];
      }
    });
  });
}
function sendDiscordText(
  rest,
  channelId,
  text,
  replyTo,
  request,
  maxLinesPerMessage,
  embeds,
  chunkMode,
) {
  return __awaiter(this, void 0, void 0, function () {
    var messageReference, chunks, res, last, isFirst, _loop_1, _i, chunks_1, chunk;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!text.trim()) {
            throw new Error("Message must be non-empty for Discord sends");
          }
          messageReference = replyTo
            ? { message_id: replyTo, fail_if_not_exists: false }
            : undefined;
          chunks = (0, chunk_js_1.chunkDiscordTextWithMode)(text, {
            maxChars: DISCORD_TEXT_LIMIT,
            maxLines: maxLinesPerMessage,
            chunkMode: chunkMode,
          });
          if (!chunks.length && text) {
            chunks.push(text);
          }
          if (!(chunks.length === 1)) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            request(function () {
              return rest.post(v10_2.Routes.channelMessages(channelId), {
                body: __assign(
                  { content: chunks[0], message_reference: messageReference },
                  (embeds === null || embeds === void 0 ? void 0 : embeds.length)
                    ? { embeds: embeds }
                    : {},
                ),
              });
            }, "text"),
          ];
        case 1:
          res = _a.sent();
          return [2 /*return*/, res];
        case 2:
          last = null;
          isFirst = true;
          _loop_1 = function (chunk) {
            return __generator(this, function (_b) {
              switch (_b.label) {
                case 0:
                  return [
                    4 /*yield*/,
                    request(function () {
                      return rest.post(v10_2.Routes.channelMessages(channelId), {
                        body: __assign(
                          {
                            content: chunk,
                            message_reference: isFirst ? messageReference : undefined,
                          },
                          isFirst && (embeds === null || embeds === void 0 ? void 0 : embeds.length)
                            ? { embeds: embeds }
                            : {},
                        ),
                      });
                    }, "text"),
                  ];
                case 1:
                  last = _b.sent();
                  isFirst = false;
                  return [2 /*return*/];
              }
            });
          };
          ((_i = 0), (chunks_1 = chunks));
          _a.label = 3;
        case 3:
          if (!(_i < chunks_1.length)) {
            return [3 /*break*/, 6];
          }
          chunk = chunks_1[_i];
          return [5 /*yield**/, _loop_1(chunk)];
        case 4:
          _a.sent();
          _a.label = 5;
        case 5:
          _i++;
          return [3 /*break*/, 3];
        case 6:
          if (!last) {
            throw new Error("Discord send failed (empty chunk result)");
          }
          return [2 /*return*/, last];
      }
    });
  });
}
function sendDiscordMedia(
  rest,
  channelId,
  text,
  mediaUrl,
  replyTo,
  request,
  maxLinesPerMessage,
  embeds,
  chunkMode,
) {
  return __awaiter(this, void 0, void 0, function () {
    var media, chunks, caption, messageReference, res, _i, _a, chunk;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [4 /*yield*/, (0, media_js_1.loadWebMedia)(mediaUrl)];
        case 1:
          media = _c.sent();
          chunks = text
            ? (0, chunk_js_1.chunkDiscordTextWithMode)(text, {
                maxChars: DISCORD_TEXT_LIMIT,
                maxLines: maxLinesPerMessage,
                chunkMode: chunkMode,
              })
            : [];
          if (!chunks.length && text) {
            chunks.push(text);
          }
          caption = (_b = chunks[0]) !== null && _b !== void 0 ? _b : "";
          messageReference = replyTo
            ? { message_id: replyTo, fail_if_not_exists: false }
            : undefined;
          return [
            4 /*yield*/,
            request(function () {
              var _a;
              return rest.post(v10_2.Routes.channelMessages(channelId), {
                body: __assign(
                  __assign(
                    { content: caption || undefined, message_reference: messageReference },
                    (embeds === null || embeds === void 0 ? void 0 : embeds.length)
                      ? { embeds: embeds }
                      : {},
                  ),
                  {
                    files: [
                      {
                        data: media.buffer,
                        name: (_a = media.fileName) !== null && _a !== void 0 ? _a : "upload",
                      },
                    ],
                  },
                ),
              });
            }, "media"),
          ];
        case 2:
          res = _c.sent();
          ((_i = 0), (_a = chunks.slice(1)));
          _c.label = 3;
        case 3:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 6];
          }
          chunk = _a[_i];
          if (!chunk.trim()) {
            return [3 /*break*/, 5];
          }
          return [
            4 /*yield*/,
            sendDiscordText(
              rest,
              channelId,
              chunk,
              undefined,
              request,
              maxLinesPerMessage,
              undefined,
              chunkMode,
            ),
          ];
        case 4:
          _c.sent();
          _c.label = 5;
        case 5:
          _i++;
          return [3 /*break*/, 3];
        case 6:
          return [2 /*return*/, res];
      }
    });
  });
}
function buildReactionIdentifier(emoji) {
  var _a;
  if (emoji.id && emoji.name) {
    return "".concat(emoji.name, ":").concat(emoji.id);
  }
  return (_a = emoji.name) !== null && _a !== void 0 ? _a : "";
}
function formatReactionEmoji(emoji) {
  return buildReactionIdentifier(emoji);
}
