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
exports.registerTelegramHandlers = void 0;
// @ts-nocheck
var command_detection_js_1 = require("../auto-reply/command-detection.js");
var inbound_debounce_js_1 = require("../auto-reply/inbound-debounce.js");
var commands_info_js_1 = require("../auto-reply/reply/commands-info.js");
var status_js_1 = require("../auto-reply/status.js");
var skill_commands_js_1 = require("../auto-reply/skill-commands.js");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var config_js_1 = require("../config/config.js");
var io_js_1 = require("../config/io.js");
var globals_js_1 = require("../globals.js");
var delivery_js_1 = require("./bot/delivery.js");
var api_logging_js_1 = require("./api-logging.js");
var helpers_js_1 = require("./bot/helpers.js");
var bot_access_js_1 = require("./bot-access.js");
var bot_updates_js_1 = require("./bot-updates.js");
var group_migration_js_1 = require("./group-migration.js");
var inline_buttons_js_1 = require("./inline-buttons.js");
var pairing_store_js_1 = require("./pairing-store.js");
var config_writes_js_1 = require("../channels/plugins/config-writes.js");
var send_js_1 = require("./send.js");
var registerTelegramHandlers = function (_a) {
  var cfg = _a.cfg,
    accountId = _a.accountId,
    bot = _a.bot,
    opts = _a.opts,
    runtime = _a.runtime,
    mediaMaxBytes = _a.mediaMaxBytes,
    telegramCfg = _a.telegramCfg,
    groupAllowFrom = _a.groupAllowFrom,
    resolveGroupPolicy = _a.resolveGroupPolicy,
    resolveTelegramGroupConfig = _a.resolveTelegramGroupConfig,
    shouldSkipUpdate = _a.shouldSkipUpdate,
    processMessage = _a.processMessage,
    logger = _a.logger;
  var TELEGRAM_TEXT_FRAGMENT_START_THRESHOLD_CHARS = 4000;
  var TELEGRAM_TEXT_FRAGMENT_MAX_GAP_MS = 1500;
  var TELEGRAM_TEXT_FRAGMENT_MAX_ID_GAP = 1;
  var TELEGRAM_TEXT_FRAGMENT_MAX_PARTS = 12;
  var TELEGRAM_TEXT_FRAGMENT_MAX_TOTAL_CHARS = 50000;
  var mediaGroupBuffer = new Map();
  var mediaGroupProcessing = Promise.resolve();
  var textFragmentBuffer = new Map();
  var textFragmentProcessing = Promise.resolve();
  var debounceMs = (0, inbound_debounce_js_1.resolveInboundDebounceMs)({
    cfg: cfg,
    channel: "telegram",
  });
  var inboundDebouncer = (0, inbound_debounce_js_1.createInboundDebouncer)({
    debounceMs: debounceMs,
    buildKey: function (entry) {
      return entry.debounceKey;
    },
    shouldDebounce: function (entry) {
      var _a, _b;
      if (entry.allMedia.length > 0) {
        return false;
      }
      var text =
        (_b = (_a = entry.msg.text) !== null && _a !== void 0 ? _a : entry.msg.caption) !== null &&
        _b !== void 0
          ? _b
          : "";
      if (!text.trim()) {
        return false;
      }
      return !(0, command_detection_js_1.hasControlCommand)(text, cfg, {
        botUsername: entry.botUsername,
      });
    },
    onFlush: function (entries) {
      return __awaiter(void 0, void 0, void 0, function () {
        var last, combinedText, first, baseCtx, getFile, syntheticMessage, messageIdOverride;
        var _a;
        return __generator(this, function (_b) {
          switch (_b.label) {
            case 0:
              last = entries.at(-1);
              if (!last) {
                return [2 /*return*/];
              }
              if (!(entries.length === 1)) {
                return [3 /*break*/, 2];
              }
              return [4 /*yield*/, processMessage(last.ctx, last.allMedia, last.storeAllowFrom)];
            case 1:
              _b.sent();
              return [2 /*return*/];
            case 2:
              combinedText = entries
                .map(function (entry) {
                  var _a, _b;
                  return (_b =
                    (_a = entry.msg.text) !== null && _a !== void 0 ? _a : entry.msg.caption) !==
                    null && _b !== void 0
                    ? _b
                    : "";
                })
                .filter(Boolean)
                .join("\n");
              if (!combinedText.trim()) {
                return [2 /*return*/];
              }
              first = entries[0];
              baseCtx = first.ctx;
              getFile =
                typeof baseCtx.getFile === "function"
                  ? baseCtx.getFile.bind(baseCtx)
                  : function () {
                      return __awaiter(void 0, void 0, void 0, function () {
                        return __generator(this, function (_a) {
                          return [2 /*return*/, {}];
                        });
                      });
                    };
              syntheticMessage = __assign(__assign({}, first.msg), {
                text: combinedText,
                caption: undefined,
                caption_entities: undefined,
                entities: undefined,
                date: (_a = last.msg.date) !== null && _a !== void 0 ? _a : first.msg.date,
              });
              messageIdOverride = last.msg.message_id ? String(last.msg.message_id) : undefined;
              return [
                4 /*yield*/,
                processMessage(
                  { message: syntheticMessage, me: baseCtx.me, getFile: getFile },
                  [],
                  first.storeAllowFrom,
                  messageIdOverride ? { messageIdOverride: messageIdOverride } : undefined,
                ),
              ];
            case 3:
              _b.sent();
              return [2 /*return*/];
          }
        });
      });
    },
    onError: function (err) {
      var _a;
      (_a = runtime.error) === null || _a === void 0
        ? void 0
        : _a.call(
            runtime,
            (0, globals_js_1.danger)("telegram debounce flush failed: ".concat(String(err))),
          );
    },
  });
  var processMediaGroup = function (entry) {
    return __awaiter(void 0, void 0, void 0, function () {
      var captionMsg, primaryEntry, allMedia, _i, _a, ctx, media, storeAllowFrom, err_1;
      var _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            _c.trys.push([0, 7, , 8]);
            entry.messages.sort(function (a, b) {
              return a.msg.message_id - b.msg.message_id;
            });
            captionMsg = entry.messages.find(function (m) {
              return m.msg.caption || m.msg.text;
            });
            primaryEntry =
              captionMsg !== null && captionMsg !== void 0 ? captionMsg : entry.messages[0];
            allMedia = [];
            ((_i = 0), (_a = entry.messages));
            _c.label = 1;
          case 1:
            if (!(_i < _a.length)) {
              return [3 /*break*/, 4];
            }
            ctx = _a[_i].ctx;
            return [
              4 /*yield*/,
              (0, delivery_js_1.resolveMedia)(ctx, mediaMaxBytes, opts.token, opts.proxyFetch),
            ];
          case 2:
            media = _c.sent();
            if (media) {
              allMedia.push({
                path: media.path,
                contentType: media.contentType,
                stickerMetadata: media.stickerMetadata,
              });
            }
            _c.label = 3;
          case 3:
            _i++;
            return [3 /*break*/, 1];
          case 4:
            return [
              4 /*yield*/,
              (0, pairing_store_js_1.readTelegramAllowFromStore)().catch(function () {
                return [];
              }),
            ];
          case 5:
            storeAllowFrom = _c.sent();
            return [4 /*yield*/, processMessage(primaryEntry.ctx, allMedia, storeAllowFrom)];
          case 6:
            _c.sent();
            return [3 /*break*/, 8];
          case 7:
            err_1 = _c.sent();
            (_b = runtime.error) === null || _b === void 0
              ? void 0
              : _b.call(
                  runtime,
                  (0, globals_js_1.danger)("media group handler failed: ".concat(String(err_1))),
                );
            return [3 /*break*/, 8];
          case 8:
            return [2 /*return*/];
        }
      });
    });
  };
  var flushTextFragments = function (entry) {
    return __awaiter(void 0, void 0, void 0, function () {
      var first, last, combinedText, syntheticMessage, storeAllowFrom, baseCtx, getFile, err_2;
      var _a, _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            _c.trys.push([0, 3, , 4]);
            entry.messages.sort(function (a, b) {
              return a.msg.message_id - b.msg.message_id;
            });
            first = entry.messages[0];
            last = entry.messages.at(-1);
            if (!first || !last) {
              return [2 /*return*/];
            }
            combinedText = entry.messages
              .map(function (m) {
                var _a;
                return (_a = m.msg.text) !== null && _a !== void 0 ? _a : "";
              })
              .join("");
            if (!combinedText.trim()) {
              return [2 /*return*/];
            }
            syntheticMessage = __assign(__assign({}, first.msg), {
              text: combinedText,
              caption: undefined,
              caption_entities: undefined,
              entities: undefined,
              date: (_a = last.msg.date) !== null && _a !== void 0 ? _a : first.msg.date,
            });
            return [
              4 /*yield*/,
              (0, pairing_store_js_1.readTelegramAllowFromStore)().catch(function () {
                return [];
              }),
            ];
          case 1:
            storeAllowFrom = _c.sent();
            baseCtx = first.ctx;
            getFile =
              typeof baseCtx.getFile === "function"
                ? baseCtx.getFile.bind(baseCtx)
                : function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/, {}];
                      });
                    });
                  };
            return [
              4 /*yield*/,
              processMessage(
                { message: syntheticMessage, me: baseCtx.me, getFile: getFile },
                [],
                storeAllowFrom,
                { messageIdOverride: String(last.msg.message_id) },
              ),
            ];
          case 2:
            _c.sent();
            return [3 /*break*/, 4];
          case 3:
            err_2 = _c.sent();
            (_b = runtime.error) === null || _b === void 0
              ? void 0
              : _b.call(
                  runtime,
                  (0, globals_js_1.danger)("text fragment handler failed: ".concat(String(err_2))),
                );
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  var scheduleTextFragmentFlush = function (entry) {
    clearTimeout(entry.timer);
    entry.timer = setTimeout(function () {
      return __awaiter(void 0, void 0, void 0, function () {
        return __generator(this, function (_a) {
          switch (_a.label) {
            case 0:
              textFragmentBuffer.delete(entry.key);
              textFragmentProcessing = textFragmentProcessing
                .then(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          return [4 /*yield*/, flushTextFragments(entry)];
                        case 1:
                          _a.sent();
                          return [2 /*return*/];
                      }
                    });
                  });
                })
                .catch(function () {
                  return undefined;
                });
              return [4 /*yield*/, textFragmentProcessing];
            case 1:
              _a.sent();
              return [2 /*return*/];
          }
        });
      });
    }, TELEGRAM_TEXT_FRAGMENT_MAX_GAP_MS);
  };
  bot.on("callback_query", function (ctx) {
    return __awaiter(void 0, void 0, void 0, function () {
      var callback,
        data,
        callbackMessage,
        inlineButtonsScope,
        chatId,
        isGroup,
        messageThreadId,
        isForum,
        resolvedThreadId,
        _a,
        groupConfig,
        topicConfig,
        storeAllowFrom,
        groupAllowOverride,
        effectiveGroupAllow,
        effectiveDmAllow,
        dmPolicy,
        senderId,
        senderUsername,
        allowed,
        defaultGroupPolicy,
        groupPolicy,
        groupAllowlist,
        allowed,
        allowed,
        paginationMatch,
        pageValue,
        page,
        agentId,
        skillCommands,
        result,
        keyboard,
        editErr_1,
        errStr,
        syntheticMessage,
        getFile,
        err_3;
      var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
      return __generator(this, function (_o) {
        switch (_o.label) {
          case 0:
            callback = ctx.callbackQuery;
            if (!callback) {
              return [2 /*return*/];
            }
            if (shouldSkipUpdate(ctx)) {
              return [2 /*return*/];
            }
            // Answer immediately to prevent Telegram from retrying while we process
            return [
              4 /*yield*/,
              (0, api_logging_js_1.withTelegramApiErrorLogging)({
                operation: "answerCallbackQuery",
                runtime: runtime,
                fn: function () {
                  return bot.api.answerCallbackQuery(callback.id);
                },
              }).catch(function () {}),
            ];
          case 1:
            // Answer immediately to prevent Telegram from retrying while we process
            _o.sent();
            _o.label = 2;
          case 2:
            _o.trys.push([2, 10, , 11]);
            data = ((_b = callback.data) !== null && _b !== void 0 ? _b : "").trim();
            callbackMessage = callback.message;
            if (!data || !callbackMessage) {
              return [2 /*return*/];
            }
            inlineButtonsScope = (0, inline_buttons_js_1.resolveTelegramInlineButtonsScope)({
              cfg: cfg,
              accountId: accountId,
            });
            if (inlineButtonsScope === "off") {
              return [2 /*return*/];
            }
            chatId = callbackMessage.chat.id;
            isGroup =
              callbackMessage.chat.type === "group" || callbackMessage.chat.type === "supergroup";
            if (inlineButtonsScope === "dm" && isGroup) {
              return [2 /*return*/];
            }
            if (inlineButtonsScope === "group" && !isGroup) {
              return [2 /*return*/];
            }
            messageThreadId = callbackMessage.message_thread_id;
            isForum = callbackMessage.chat.is_forum === true;
            resolvedThreadId = (0, helpers_js_1.resolveTelegramForumThreadId)({
              isForum: isForum,
              messageThreadId: messageThreadId,
            });
            ((_a = resolveTelegramGroupConfig(chatId, resolvedThreadId)),
              (groupConfig = _a.groupConfig),
              (topicConfig = _a.topicConfig));
            return [
              4 /*yield*/,
              (0, pairing_store_js_1.readTelegramAllowFromStore)().catch(function () {
                return [];
              }),
            ];
          case 3:
            storeAllowFrom = _o.sent();
            groupAllowOverride = (0, bot_access_js_1.firstDefined)(
              topicConfig === null || topicConfig === void 0 ? void 0 : topicConfig.allowFrom,
              groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.allowFrom,
            );
            effectiveGroupAllow = (0, bot_access_js_1.normalizeAllowFromWithStore)({
              allowFrom:
                groupAllowOverride !== null && groupAllowOverride !== void 0
                  ? groupAllowOverride
                  : groupAllowFrom,
              storeAllowFrom: storeAllowFrom,
            });
            effectiveDmAllow = (0, bot_access_js_1.normalizeAllowFromWithStore)({
              allowFrom: telegramCfg.allowFrom,
              storeAllowFrom: storeAllowFrom,
            });
            dmPolicy = (_c = telegramCfg.dmPolicy) !== null && _c !== void 0 ? _c : "pairing";
            senderId = ((_d = callback.from) === null || _d === void 0 ? void 0 : _d.id)
              ? String(callback.from.id)
              : "";
            senderUsername =
              (_f = (_e = callback.from) === null || _e === void 0 ? void 0 : _e.username) !==
                null && _f !== void 0
                ? _f
                : "";
            if (isGroup) {
              if (
                (groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.enabled) ===
                false
              ) {
                (0, globals_js_1.logVerbose)(
                  "Blocked telegram group ".concat(chatId, " (group disabled)"),
                );
                return [2 /*return*/];
              }
              if (
                (topicConfig === null || topicConfig === void 0 ? void 0 : topicConfig.enabled) ===
                false
              ) {
                (0, globals_js_1.logVerbose)(
                  "Blocked telegram topic "
                    .concat(chatId, " (")
                    .concat(
                      resolvedThreadId !== null && resolvedThreadId !== void 0
                        ? resolvedThreadId
                        : "unknown",
                      ") (topic disabled)",
                    ),
                );
                return [2 /*return*/];
              }
              if (typeof groupAllowOverride !== "undefined") {
                allowed =
                  senderId &&
                  (0, bot_access_js_1.isSenderAllowed)({
                    allow: effectiveGroupAllow,
                    senderId: senderId,
                    senderUsername: senderUsername,
                  });
                if (!allowed) {
                  (0, globals_js_1.logVerbose)(
                    "Blocked telegram group sender ".concat(
                      senderId || "unknown",
                      " (group allowFrom override)",
                    ),
                  );
                  return [2 /*return*/];
                }
              }
              defaultGroupPolicy =
                (_h = (_g = cfg.channels) === null || _g === void 0 ? void 0 : _g.defaults) ===
                  null || _h === void 0
                  ? void 0
                  : _h.groupPolicy;
              groupPolicy =
                (_k =
                  (_j = telegramCfg.groupPolicy) !== null && _j !== void 0
                    ? _j
                    : defaultGroupPolicy) !== null && _k !== void 0
                  ? _k
                  : "open";
              if (groupPolicy === "disabled") {
                (0, globals_js_1.logVerbose)(
                  "Blocked telegram group message (groupPolicy: disabled)",
                );
                return [2 /*return*/];
              }
              if (groupPolicy === "allowlist") {
                if (!senderId) {
                  (0, globals_js_1.logVerbose)(
                    "Blocked telegram group message (no sender ID, groupPolicy: allowlist)",
                  );
                  return [2 /*return*/];
                }
                if (!effectiveGroupAllow.hasEntries) {
                  (0, globals_js_1.logVerbose)(
                    "Blocked telegram group message (groupPolicy: allowlist, no group allowlist entries)",
                  );
                  return [2 /*return*/];
                }
                if (
                  !(0, bot_access_js_1.isSenderAllowed)({
                    allow: effectiveGroupAllow,
                    senderId: senderId,
                    senderUsername: senderUsername,
                  })
                ) {
                  (0, globals_js_1.logVerbose)(
                    "Blocked telegram group message from ".concat(
                      senderId,
                      " (groupPolicy: allowlist)",
                    ),
                  );
                  return [2 /*return*/];
                }
              }
              groupAllowlist = resolveGroupPolicy(chatId);
              if (groupAllowlist.allowlistEnabled && !groupAllowlist.allowed) {
                logger.info(
                  { chatId: chatId, title: callbackMessage.chat.title, reason: "not-allowed" },
                  "skipping group message",
                );
                return [2 /*return*/];
              }
            }
            if (inlineButtonsScope === "allowlist") {
              if (!isGroup) {
                if (dmPolicy === "disabled") {
                  return [2 /*return*/];
                }
                if (dmPolicy !== "open") {
                  allowed =
                    effectiveDmAllow.hasWildcard ||
                    (effectiveDmAllow.hasEntries &&
                      (0, bot_access_js_1.isSenderAllowed)({
                        allow: effectiveDmAllow,
                        senderId: senderId,
                        senderUsername: senderUsername,
                      }));
                  if (!allowed) {
                    return [2 /*return*/];
                  }
                }
              } else {
                allowed =
                  effectiveGroupAllow.hasWildcard ||
                  (effectiveGroupAllow.hasEntries &&
                    (0, bot_access_js_1.isSenderAllowed)({
                      allow: effectiveGroupAllow,
                      senderId: senderId,
                      senderUsername: senderUsername,
                    }));
                if (!allowed) {
                  return [2 /*return*/];
                }
              }
            }
            paginationMatch = data.match(/^commands_page_(\d+|noop)(?::(.+))?$/);
            if (!paginationMatch) {
              return [3 /*break*/, 8];
            }
            pageValue = paginationMatch[1];
            if (pageValue === "noop") {
              return [2 /*return*/];
            }
            page = Number.parseInt(pageValue, 10);
            if (Number.isNaN(page) || page < 1) {
              return [2 /*return*/];
            }
            agentId =
              ((_l = paginationMatch[2]) === null || _l === void 0 ? void 0 : _l.trim()) ||
              (0, agent_scope_js_1.resolveDefaultAgentId)(cfg) ||
              undefined;
            skillCommands = (0, skill_commands_js_1.listSkillCommandsForAgents)({
              cfg: cfg,
              agentIds: agentId ? [agentId] : undefined,
            });
            result = (0, status_js_1.buildCommandsMessagePaginated)(cfg, skillCommands, {
              page: page,
              surface: "telegram",
            });
            keyboard =
              result.totalPages > 1
                ? (0, send_js_1.buildInlineKeyboard)(
                    (0, commands_info_js_1.buildCommandsPaginationKeyboard)(
                      result.currentPage,
                      result.totalPages,
                      agentId,
                    ),
                  )
                : undefined;
            _o.label = 4;
          case 4:
            _o.trys.push([4, 6, , 7]);
            return [
              4 /*yield*/,
              bot.api.editMessageText(
                callbackMessage.chat.id,
                callbackMessage.message_id,
                result.text,
                keyboard ? { reply_markup: keyboard } : undefined,
              ),
            ];
          case 5:
            _o.sent();
            return [3 /*break*/, 7];
          case 6:
            editErr_1 = _o.sent();
            errStr = String(editErr_1);
            if (!errStr.includes("message is not modified")) {
              throw editErr_1;
            }
            return [3 /*break*/, 7];
          case 7:
            return [2 /*return*/];
          case 8:
            syntheticMessage = __assign(__assign({}, callbackMessage), {
              from: callback.from,
              text: data,
              caption: undefined,
              caption_entities: undefined,
              entities: undefined,
            });
            getFile =
              typeof ctx.getFile === "function"
                ? ctx.getFile.bind(ctx)
                : function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        return [2 /*return*/, {}];
                      });
                    });
                  };
            return [
              4 /*yield*/,
              processMessage(
                { message: syntheticMessage, me: ctx.me, getFile: getFile },
                [],
                storeAllowFrom,
                {
                  forceWasMentioned: true,
                  messageIdOverride: callback.id,
                },
              ),
            ];
          case 9:
            _o.sent();
            return [3 /*break*/, 11];
          case 10:
            err_3 = _o.sent();
            (_m = runtime.error) === null || _m === void 0
              ? void 0
              : _m.call(
                  runtime,
                  (0, globals_js_1.danger)("callback handler failed: ".concat(String(err_3))),
                );
            return [3 /*break*/, 11];
          case 11:
            return [2 /*return*/];
        }
      });
    });
  });
  // Handle group migration to supergroup (chat ID changes)
  bot.on("message:migrate_to_chat_id", function (ctx) {
    return __awaiter(void 0, void 0, void 0, function () {
      var msg, oldChatId, newChatId, chatTitle, currentConfig, migration, err_4;
      var _a, _b, _c, _d, _e, _f, _g, _h;
      return __generator(this, function (_j) {
        switch (_j.label) {
          case 0:
            _j.trys.push([0, 4, , 5]);
            msg = ctx.message;
            if (!(msg === null || msg === void 0 ? void 0 : msg.migrate_to_chat_id)) {
              return [2 /*return*/];
            }
            if (shouldSkipUpdate(ctx)) {
              return [2 /*return*/];
            }
            oldChatId = String(msg.chat.id);
            newChatId = String(msg.migrate_to_chat_id);
            chatTitle = (_a = msg.chat.title) !== null && _a !== void 0 ? _a : "Unknown";
            (_b = runtime.log) === null || _b === void 0
              ? void 0
              : _b.call(
                  runtime,
                  (0, globals_js_1.warn)(
                    '[telegram] Group migrated: "'
                      .concat(chatTitle, '" ')
                      .concat(oldChatId, " \u2192 ")
                      .concat(newChatId),
                  ),
                );
            if (
              !(0, config_writes_js_1.resolveChannelConfigWrites)({
                cfg: cfg,
                channelId: "telegram",
                accountId: accountId,
              })
            ) {
              (_c = runtime.log) === null || _c === void 0
                ? void 0
                : _c.call(
                    runtime,
                    (0, globals_js_1.warn)(
                      "[telegram] Config writes disabled; skipping group config migration.",
                    ),
                  );
              return [2 /*return*/];
            }
            currentConfig = (0, config_js_1.loadConfig)();
            migration = (0, group_migration_js_1.migrateTelegramGroupConfig)({
              cfg: currentConfig,
              accountId: accountId,
              oldChatId: oldChatId,
              newChatId: newChatId,
            });
            if (!migration.migrated) {
              return [3 /*break*/, 2];
            }
            (_d = runtime.log) === null || _d === void 0
              ? void 0
              : _d.call(
                  runtime,
                  (0, globals_js_1.warn)(
                    "[telegram] Migrating group config from "
                      .concat(oldChatId, " to ")
                      .concat(newChatId),
                  ),
                );
            (0, group_migration_js_1.migrateTelegramGroupConfig)({
              cfg: cfg,
              accountId: accountId,
              oldChatId: oldChatId,
              newChatId: newChatId,
            });
            return [4 /*yield*/, (0, io_js_1.writeConfigFile)(currentConfig)];
          case 1:
            _j.sent();
            (_e = runtime.log) === null || _e === void 0
              ? void 0
              : _e.call(
                  runtime,
                  (0, globals_js_1.warn)("[telegram] Group config migrated and saved successfully"),
                );
            return [3 /*break*/, 3];
          case 2:
            if (migration.skippedExisting) {
              (_f = runtime.log) === null || _f === void 0
                ? void 0
                : _f.call(
                    runtime,
                    (0, globals_js_1.warn)(
                      "[telegram] Group config already exists for "
                        .concat(newChatId, "; leaving ")
                        .concat(oldChatId, " unchanged"),
                    ),
                  );
            } else {
              (_g = runtime.log) === null || _g === void 0
                ? void 0
                : _g.call(
                    runtime,
                    (0, globals_js_1.warn)(
                      "[telegram] No config found for old group ID ".concat(
                        oldChatId,
                        ", migration logged only",
                      ),
                    ),
                  );
            }
            _j.label = 3;
          case 3:
            return [3 /*break*/, 5];
          case 4:
            err_4 = _j.sent();
            (_h = runtime.error) === null || _h === void 0
              ? void 0
              : _h.call(
                  runtime,
                  (0, globals_js_1.danger)(
                    "[telegram] Group migration handler failed: ".concat(String(err_4)),
                  ),
                );
            return [3 /*break*/, 5];
          case 5:
            return [2 /*return*/];
        }
      });
    });
  });
  bot.on("message", function (ctx) {
    return __awaiter(void 0, void 0, void 0, function () {
      var msg_1,
        chatId_1,
        isGroup,
        messageThreadId,
        isForum,
        resolvedThreadId,
        storeAllowFrom,
        _a,
        groupConfig,
        topicConfig,
        groupAllowOverride,
        effectiveGroupAllow,
        hasGroupAllowOverride,
        senderId_1,
        senderUsername,
        allowed,
        defaultGroupPolicy,
        groupPolicy,
        senderId_2,
        senderUsername,
        groupAllowlist,
        text,
        isCommandLike,
        nowMs,
        senderId_3,
        key,
        existing_1,
        last,
        lastMsgId,
        lastReceivedAtMs,
        idGap,
        timeGapMs,
        canAppend,
        currentTotalChars,
        nextTotalChars,
        shouldStart,
        entry,
        mediaGroupId_1,
        existing_2,
        entry_1,
        media,
        mediaErr_1,
        errMsg,
        limitMb_1,
        hasText,
        allMedia,
        senderId,
        conversationKey,
        debounceKey,
        err_5;
      var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t;
      return __generator(this, function (_u) {
        switch (_u.label) {
          case 0:
            _u.trys.push([0, 12, , 13]);
            msg_1 = ctx.message;
            if (!msg_1) {
              return [2 /*return*/];
            }
            if (shouldSkipUpdate(ctx)) {
              return [2 /*return*/];
            }
            chatId_1 = msg_1.chat.id;
            isGroup = msg_1.chat.type === "group" || msg_1.chat.type === "supergroup";
            messageThreadId = msg_1.message_thread_id;
            isForum = msg_1.chat.is_forum === true;
            resolvedThreadId = (0, helpers_js_1.resolveTelegramForumThreadId)({
              isForum: isForum,
              messageThreadId: messageThreadId,
            });
            return [
              4 /*yield*/,
              (0, pairing_store_js_1.readTelegramAllowFromStore)().catch(function () {
                return [];
              }),
            ];
          case 1:
            storeAllowFrom = _u.sent();
            ((_a = resolveTelegramGroupConfig(chatId_1, resolvedThreadId)),
              (groupConfig = _a.groupConfig),
              (topicConfig = _a.topicConfig));
            groupAllowOverride = (0, bot_access_js_1.firstDefined)(
              topicConfig === null || topicConfig === void 0 ? void 0 : topicConfig.allowFrom,
              groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.allowFrom,
            );
            effectiveGroupAllow = (0, bot_access_js_1.normalizeAllowFromWithStore)({
              allowFrom:
                groupAllowOverride !== null && groupAllowOverride !== void 0
                  ? groupAllowOverride
                  : groupAllowFrom,
              storeAllowFrom: storeAllowFrom,
            });
            hasGroupAllowOverride = typeof groupAllowOverride !== "undefined";
            if (isGroup) {
              if (
                (groupConfig === null || groupConfig === void 0 ? void 0 : groupConfig.enabled) ===
                false
              ) {
                (0, globals_js_1.logVerbose)(
                  "Blocked telegram group ".concat(chatId_1, " (group disabled)"),
                );
                return [2 /*return*/];
              }
              if (
                (topicConfig === null || topicConfig === void 0 ? void 0 : topicConfig.enabled) ===
                false
              ) {
                (0, globals_js_1.logVerbose)(
                  "Blocked telegram topic "
                    .concat(chatId_1, " (")
                    .concat(
                      resolvedThreadId !== null && resolvedThreadId !== void 0
                        ? resolvedThreadId
                        : "unknown",
                      ") (topic disabled)",
                    ),
                );
                return [2 /*return*/];
              }
              if (hasGroupAllowOverride) {
                senderId_1 = (_b = msg_1.from) === null || _b === void 0 ? void 0 : _b.id;
                senderUsername =
                  (_d = (_c = msg_1.from) === null || _c === void 0 ? void 0 : _c.username) !==
                    null && _d !== void 0
                    ? _d
                    : "";
                allowed =
                  senderId_1 != null &&
                  (0, bot_access_js_1.isSenderAllowed)({
                    allow: effectiveGroupAllow,
                    senderId: String(senderId_1),
                    senderUsername: senderUsername,
                  });
                if (!allowed) {
                  (0, globals_js_1.logVerbose)(
                    "Blocked telegram group sender ".concat(
                      senderId_1 !== null && senderId_1 !== void 0 ? senderId_1 : "unknown",
                      " (group allowFrom override)",
                    ),
                  );
                  return [2 /*return*/];
                }
              }
              defaultGroupPolicy =
                (_f = (_e = cfg.channels) === null || _e === void 0 ? void 0 : _e.defaults) ===
                  null || _f === void 0
                  ? void 0
                  : _f.groupPolicy;
              groupPolicy =
                (_h =
                  (_g = telegramCfg.groupPolicy) !== null && _g !== void 0
                    ? _g
                    : defaultGroupPolicy) !== null && _h !== void 0
                  ? _h
                  : "open";
              if (groupPolicy === "disabled") {
                (0, globals_js_1.logVerbose)(
                  "Blocked telegram group message (groupPolicy: disabled)",
                );
                return [2 /*return*/];
              }
              if (groupPolicy === "allowlist") {
                senderId_2 = (_j = msg_1.from) === null || _j === void 0 ? void 0 : _j.id;
                if (senderId_2 == null) {
                  (0, globals_js_1.logVerbose)(
                    "Blocked telegram group message (no sender ID, groupPolicy: allowlist)",
                  );
                  return [2 /*return*/];
                }
                if (!effectiveGroupAllow.hasEntries) {
                  (0, globals_js_1.logVerbose)(
                    "Blocked telegram group message (groupPolicy: allowlist, no group allowlist entries)",
                  );
                  return [2 /*return*/];
                }
                senderUsername =
                  (_l = (_k = msg_1.from) === null || _k === void 0 ? void 0 : _k.username) !==
                    null && _l !== void 0
                    ? _l
                    : "";
                if (
                  !(0, bot_access_js_1.isSenderAllowed)({
                    allow: effectiveGroupAllow,
                    senderId: String(senderId_2),
                    senderUsername: senderUsername,
                  })
                ) {
                  (0, globals_js_1.logVerbose)(
                    "Blocked telegram group message from ".concat(
                      senderId_2,
                      " (groupPolicy: allowlist)",
                    ),
                  );
                  return [2 /*return*/];
                }
              }
              groupAllowlist = resolveGroupPolicy(chatId_1);
              if (groupAllowlist.allowlistEnabled && !groupAllowlist.allowed) {
                logger.info(
                  { chatId: chatId_1, title: msg_1.chat.title, reason: "not-allowed" },
                  "skipping group message",
                );
                return [2 /*return*/];
              }
            }
            text = typeof msg_1.text === "string" ? msg_1.text : undefined;
            isCommandLike = (text !== null && text !== void 0 ? text : "").trim().startsWith("/");
            if (!(text && !isCommandLike)) {
              return [3 /*break*/, 4];
            }
            nowMs = Date.now();
            senderId_3 =
              ((_m = msg_1.from) === null || _m === void 0 ? void 0 : _m.id) != null
                ? String(msg_1.from.id)
                : "unknown";
            key = "text:"
              .concat(chatId_1, ":")
              .concat(
                resolvedThreadId !== null && resolvedThreadId !== void 0
                  ? resolvedThreadId
                  : "main",
                ":",
              )
              .concat(senderId_3);
            existing_1 = textFragmentBuffer.get(key);
            if (!existing_1) {
              return [3 /*break*/, 3];
            }
            last = existing_1.messages.at(-1);
            lastMsgId = last === null || last === void 0 ? void 0 : last.msg.message_id;
            lastReceivedAtMs =
              (_o = last === null || last === void 0 ? void 0 : last.receivedAtMs) !== null &&
              _o !== void 0
                ? _o
                : nowMs;
            idGap = typeof lastMsgId === "number" ? msg_1.message_id - lastMsgId : Infinity;
            timeGapMs = nowMs - lastReceivedAtMs;
            canAppend =
              idGap > 0 &&
              idGap <= TELEGRAM_TEXT_FRAGMENT_MAX_ID_GAP &&
              timeGapMs >= 0 &&
              timeGapMs <= TELEGRAM_TEXT_FRAGMENT_MAX_GAP_MS;
            if (canAppend) {
              currentTotalChars = existing_1.messages.reduce(function (sum, m) {
                var _a, _b;
                return (
                  sum +
                  ((_b = (_a = m.msg.text) === null || _a === void 0 ? void 0 : _a.length) !==
                    null && _b !== void 0
                    ? _b
                    : 0)
                );
              }, 0);
              nextTotalChars = currentTotalChars + text.length;
              if (
                existing_1.messages.length + 1 <= TELEGRAM_TEXT_FRAGMENT_MAX_PARTS &&
                nextTotalChars <= TELEGRAM_TEXT_FRAGMENT_MAX_TOTAL_CHARS
              ) {
                existing_1.messages.push({ msg: msg_1, ctx: ctx, receivedAtMs: nowMs });
                scheduleTextFragmentFlush(existing_1);
                return [2 /*return*/];
              }
            }
            // Not appendable (or limits exceeded): flush buffered entry first, then continue normally.
            clearTimeout(existing_1.timer);
            textFragmentBuffer.delete(key);
            textFragmentProcessing = textFragmentProcessing
              .then(function () {
                return __awaiter(void 0, void 0, void 0, function () {
                  return __generator(this, function (_a) {
                    switch (_a.label) {
                      case 0:
                        return [4 /*yield*/, flushTextFragments(existing_1)];
                      case 1:
                        _a.sent();
                        return [2 /*return*/];
                    }
                  });
                });
              })
              .catch(function () {
                return undefined;
              });
            return [4 /*yield*/, textFragmentProcessing];
          case 2:
            _u.sent();
            _u.label = 3;
          case 3:
            shouldStart = text.length >= TELEGRAM_TEXT_FRAGMENT_START_THRESHOLD_CHARS;
            if (shouldStart) {
              entry = {
                key: key,
                messages: [{ msg: msg_1, ctx: ctx, receivedAtMs: nowMs }],
                timer: setTimeout(function () {}, TELEGRAM_TEXT_FRAGMENT_MAX_GAP_MS),
              };
              textFragmentBuffer.set(key, entry);
              scheduleTextFragmentFlush(entry);
              return [2 /*return*/];
            }
            _u.label = 4;
          case 4:
            mediaGroupId_1 = msg_1.media_group_id;
            if (mediaGroupId_1) {
              existing_2 = mediaGroupBuffer.get(mediaGroupId_1);
              if (existing_2) {
                clearTimeout(existing_2.timer);
                existing_2.messages.push({ msg: msg_1, ctx: ctx });
                existing_2.timer = setTimeout(function () {
                  return __awaiter(void 0, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          mediaGroupBuffer.delete(mediaGroupId_1);
                          mediaGroupProcessing = mediaGroupProcessing
                            .then(function () {
                              return __awaiter(void 0, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                  switch (_a.label) {
                                    case 0:
                                      return [4 /*yield*/, processMediaGroup(existing_2)];
                                    case 1:
                                      _a.sent();
                                      return [2 /*return*/];
                                  }
                                });
                              });
                            })
                            .catch(function () {
                              return undefined;
                            });
                          return [4 /*yield*/, mediaGroupProcessing];
                        case 1:
                          _a.sent();
                          return [2 /*return*/];
                      }
                    });
                  });
                }, bot_updates_js_1.MEDIA_GROUP_TIMEOUT_MS);
              } else {
                entry_1 = {
                  messages: [{ msg: msg_1, ctx: ctx }],
                  timer: setTimeout(function () {
                    return __awaiter(void 0, void 0, void 0, function () {
                      return __generator(this, function (_a) {
                        switch (_a.label) {
                          case 0:
                            mediaGroupBuffer.delete(mediaGroupId_1);
                            mediaGroupProcessing = mediaGroupProcessing
                              .then(function () {
                                return __awaiter(void 0, void 0, void 0, function () {
                                  return __generator(this, function (_a) {
                                    switch (_a.label) {
                                      case 0:
                                        return [4 /*yield*/, processMediaGroup(entry_1)];
                                      case 1:
                                        _a.sent();
                                        return [2 /*return*/];
                                    }
                                  });
                                });
                              })
                              .catch(function () {
                                return undefined;
                              });
                            return [4 /*yield*/, mediaGroupProcessing];
                          case 1:
                            _a.sent();
                            return [2 /*return*/];
                        }
                      });
                    });
                  }, bot_updates_js_1.MEDIA_GROUP_TIMEOUT_MS),
                };
                mediaGroupBuffer.set(mediaGroupId_1, entry_1);
              }
              return [2 /*return*/];
            }
            media = null;
            _u.label = 5;
          case 5:
            _u.trys.push([5, 7, , 10]);
            return [
              4 /*yield*/,
              (0, delivery_js_1.resolveMedia)(ctx, mediaMaxBytes, opts.token, opts.proxyFetch),
            ];
          case 6:
            media = _u.sent();
            return [3 /*break*/, 10];
          case 7:
            mediaErr_1 = _u.sent();
            errMsg = String(mediaErr_1);
            if (!(errMsg.includes("exceeds") && errMsg.includes("MB limit"))) {
              return [3 /*break*/, 9];
            }
            limitMb_1 = Math.round(mediaMaxBytes / (1024 * 1024));
            return [
              4 /*yield*/,
              (0, api_logging_js_1.withTelegramApiErrorLogging)({
                operation: "sendMessage",
                runtime: runtime,
                fn: function () {
                  return bot.api.sendMessage(
                    chatId_1,
                    "\u26A0\uFE0F File too large. Maximum size is ".concat(limitMb_1, "MB."),
                    {
                      reply_to_message_id: msg_1.message_id,
                    },
                  );
                },
              }).catch(function () {}),
            ];
          case 8:
            _u.sent();
            logger.warn({ chatId: chatId_1, error: errMsg }, "media exceeds size limit");
            return [2 /*return*/];
          case 9:
            throw mediaErr_1;
          case 10:
            hasText = Boolean(
              ((_q = (_p = msg_1.text) !== null && _p !== void 0 ? _p : msg_1.caption) !== null &&
              _q !== void 0
                ? _q
                : ""
              ).trim(),
            );
            if (msg_1.sticker && !media && !hasText) {
              (0, globals_js_1.logVerbose)(
                "telegram: skipping sticker-only message (unsupported sticker type)",
              );
              return [2 /*return*/];
            }
            allMedia = media
              ? [
                  {
                    path: media.path,
                    contentType: media.contentType,
                    stickerMetadata: media.stickerMetadata,
                  },
                ]
              : [];
            senderId = ((_r = msg_1.from) === null || _r === void 0 ? void 0 : _r.id)
              ? String(msg_1.from.id)
              : "";
            conversationKey =
              resolvedThreadId != null
                ? "".concat(chatId_1, ":topic:").concat(resolvedThreadId)
                : String(chatId_1);
            debounceKey = senderId
              ? "telegram:"
                  .concat(accountId !== null && accountId !== void 0 ? accountId : "default", ":")
                  .concat(conversationKey, ":")
                  .concat(senderId)
              : null;
            return [
              4 /*yield*/,
              inboundDebouncer.enqueue({
                ctx: ctx,
                msg: msg_1,
                allMedia: allMedia,
                storeAllowFrom: storeAllowFrom,
                debounceKey: debounceKey,
                botUsername: (_s = ctx.me) === null || _s === void 0 ? void 0 : _s.username,
              }),
            ];
          case 11:
            _u.sent();
            return [3 /*break*/, 13];
          case 12:
            err_5 = _u.sent();
            (_t = runtime.error) === null || _t === void 0
              ? void 0
              : _t.call(
                  runtime,
                  (0, globals_js_1.danger)("handler failed: ".concat(String(err_5))),
                );
            return [3 /*break*/, 13];
          case 13:
            return [2 /*return*/];
        }
      });
    });
  });
};
exports.registerTelegramHandlers = registerTelegramHandlers;
