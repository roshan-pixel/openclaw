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
exports.monitorSignalProvider = monitorSignalProvider;
var chunk_js_1 = require("../auto-reply/chunk.js");
var history_js_1 = require("../auto-reply/reply/history.js");
var config_js_1 = require("../config/config.js");
var store_js_1 = require("../media/store.js");
var utils_js_1 = require("../utils.js");
var transport_ready_js_1 = require("../infra/transport-ready.js");
var accounts_js_1 = require("./accounts.js");
var client_js_1 = require("./client.js");
var daemon_js_1 = require("./daemon.js");
var identity_js_1 = require("./identity.js");
var event_handler_js_1 = require("./monitor/event-handler.js");
var send_js_1 = require("./send.js");
var sse_reconnect_js_1 = require("./sse-reconnect.js");
function resolveRuntime(opts) {
  var _a;
  return (_a = opts.runtime) !== null && _a !== void 0
    ? _a
    : {
        log: console.log,
        error: console.error,
        exit: function (code) {
          throw new Error("exit ".concat(code));
        },
      };
}
function normalizeAllowList(raw) {
  return (raw !== null && raw !== void 0 ? raw : [])
    .map(function (entry) {
      return String(entry).trim();
    })
    .filter(Boolean);
}
function resolveSignalReactionTargets(reaction) {
  var _a, _b;
  var targets = [];
  var uuid = (_a = reaction.targetAuthorUuid) === null || _a === void 0 ? void 0 : _a.trim();
  if (uuid) {
    targets.push({ kind: "uuid", id: uuid, display: "uuid:".concat(uuid) });
  }
  var author = (_b = reaction.targetAuthor) === null || _b === void 0 ? void 0 : _b.trim();
  if (author) {
    var normalized = (0, utils_js_1.normalizeE164)(author);
    targets.push({ kind: "phone", id: normalized, display: normalized });
  }
  return targets;
}
function isSignalReactionMessage(reaction) {
  var _a, _b, _c;
  if (!reaction) {
    return false;
  }
  var emoji = (_a = reaction.emoji) === null || _a === void 0 ? void 0 : _a.trim();
  var timestamp = reaction.targetSentTimestamp;
  var hasTarget = Boolean(
    ((_b = reaction.targetAuthor) === null || _b === void 0 ? void 0 : _b.trim()) ||
    ((_c = reaction.targetAuthorUuid) === null || _c === void 0 ? void 0 : _c.trim()),
  );
  return Boolean(emoji && typeof timestamp === "number" && timestamp > 0 && hasTarget);
}
function shouldEmitSignalReactionNotification(params) {
  var mode = params.mode,
    account = params.account,
    targets = params.targets,
    sender = params.sender,
    allowlist = params.allowlist;
  var effectiveMode = mode !== null && mode !== void 0 ? mode : "own";
  if (effectiveMode === "off") {
    return false;
  }
  if (effectiveMode === "own") {
    var accountId_1 = account === null || account === void 0 ? void 0 : account.trim();
    if (!accountId_1 || !targets || targets.length === 0) {
      return false;
    }
    var normalizedAccount_1 = (0, utils_js_1.normalizeE164)(accountId_1);
    return targets.some(function (target) {
      if (target.kind === "uuid") {
        return accountId_1 === target.id || accountId_1 === "uuid:".concat(target.id);
      }
      return normalizedAccount_1 === target.id;
    });
  }
  if (effectiveMode === "allowlist") {
    if (!sender || !allowlist || allowlist.length === 0) {
      return false;
    }
    return (0, identity_js_1.isSignalSenderAllowed)(sender, allowlist);
  }
  return true;
}
function buildSignalReactionSystemEventText(params) {
  var base = "Signal reaction added: "
    .concat(params.emojiLabel, " by ")
    .concat(params.actorLabel, " msg ")
    .concat(params.messageId);
  var withTarget = params.targetLabel ? "".concat(base, " from ").concat(params.targetLabel) : base;
  return params.groupLabel ? "".concat(withTarget, " in ").concat(params.groupLabel) : withTarget;
}
function waitForSignalDaemonReady(params) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, transport_ready_js_1.waitForTransportReady)({
              label: "signal daemon",
              timeoutMs: params.timeoutMs,
              logAfterMs: params.logAfterMs,
              logIntervalMs: params.logIntervalMs,
              pollIntervalMs: 150,
              abortSignal: params.abortSignal,
              runtime: params.runtime,
              check: function () {
                return __awaiter(_this, void 0, void 0, function () {
                  var res;
                  var _a;
                  return __generator(this, function (_b) {
                    switch (_b.label) {
                      case 0:
                        return [4 /*yield*/, (0, client_js_1.signalCheck)(params.baseUrl, 1000)];
                      case 1:
                        res = _b.sent();
                        if (res.ok) {
                          return [2 /*return*/, { ok: true }];
                        }
                        return [
                          2 /*return*/,
                          {
                            ok: false,
                            error:
                              (_a = res.error) !== null && _a !== void 0
                                ? _a
                                : res.status
                                  ? "HTTP ".concat(res.status)
                                  : "unreachable",
                          },
                        ];
                    }
                  });
                });
              },
            }),
          ];
        case 1:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function fetchAttachment(params) {
  return __awaiter(this, void 0, void 0, function () {
    var attachment, rpcParams, result, buffer, saved;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          attachment = params.attachment;
          if (!(attachment === null || attachment === void 0 ? void 0 : attachment.id)) {
            return [2 /*return*/, null];
          }
          if (attachment.size && attachment.size > params.maxBytes) {
            throw new Error(
              "Signal attachment "
                .concat(attachment.id, " exceeds ")
                .concat((params.maxBytes / (1024 * 1024)).toFixed(0), "MB limit"),
            );
          }
          rpcParams = {
            id: attachment.id,
          };
          if (params.account) {
            rpcParams.account = params.account;
          }
          if (params.groupId) {
            rpcParams.groupId = params.groupId;
          } else if (params.sender) {
            rpcParams.recipient = params.sender;
          } else {
            return [2 /*return*/, null];
          }
          return [
            4 /*yield*/,
            (0, client_js_1.signalRpcRequest)("getAttachment", rpcParams, {
              baseUrl: params.baseUrl,
            }),
          ];
        case 1:
          result = _b.sent();
          if (!(result === null || result === void 0 ? void 0 : result.data)) {
            return [2 /*return*/, null];
          }
          buffer = Buffer.from(result.data, "base64");
          return [
            4 /*yield*/,
            (0, store_js_1.saveMediaBuffer)(
              buffer,
              (_a = attachment.contentType) !== null && _a !== void 0 ? _a : undefined,
              "inbound",
              params.maxBytes,
            ),
          ];
        case 2:
          saved = _b.sent();
          return [2 /*return*/, { path: saved.path, contentType: saved.contentType }];
      }
    });
  });
}
function deliverReplies(params) {
  return __awaiter(this, void 0, void 0, function () {
    var replies,
      target,
      baseUrl,
      account,
      accountId,
      runtime,
      maxBytes,
      textLimit,
      chunkMode,
      _i,
      replies_1,
      payload,
      mediaList,
      text,
      _a,
      _b,
      chunk,
      first,
      _c,
      mediaList_1,
      url,
      caption;
    var _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          ((replies = params.replies),
            (target = params.target),
            (baseUrl = params.baseUrl),
            (account = params.account),
            (accountId = params.accountId),
            (runtime = params.runtime),
            (maxBytes = params.maxBytes),
            (textLimit = params.textLimit),
            (chunkMode = params.chunkMode));
          ((_i = 0), (replies_1 = replies));
          _g.label = 1;
        case 1:
          if (!(_i < replies_1.length)) {
            return [3 /*break*/, 12];
          }
          payload = replies_1[_i];
          mediaList =
            (_d = payload.mediaUrls) !== null && _d !== void 0
              ? _d
              : payload.mediaUrl
                ? [payload.mediaUrl]
                : [];
          text = (_e = payload.text) !== null && _e !== void 0 ? _e : "";
          if (!text && mediaList.length === 0) {
            return [3 /*break*/, 11];
          }
          if (!(mediaList.length === 0)) {
            return [3 /*break*/, 6];
          }
          ((_a = 0), (_b = (0, chunk_js_1.chunkTextWithMode)(text, textLimit, chunkMode)));
          _g.label = 2;
        case 2:
          if (!(_a < _b.length)) {
            return [3 /*break*/, 5];
          }
          chunk = _b[_a];
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageSignal)(target, chunk, {
              baseUrl: baseUrl,
              account: account,
              maxBytes: maxBytes,
              accountId: accountId,
            }),
          ];
        case 3:
          _g.sent();
          _g.label = 4;
        case 4:
          _a++;
          return [3 /*break*/, 2];
        case 5:
          return [3 /*break*/, 10];
        case 6:
          first = true;
          ((_c = 0), (mediaList_1 = mediaList));
          _g.label = 7;
        case 7:
          if (!(_c < mediaList_1.length)) {
            return [3 /*break*/, 10];
          }
          url = mediaList_1[_c];
          caption = first ? text : "";
          first = false;
          return [
            4 /*yield*/,
            (0, send_js_1.sendMessageSignal)(target, caption, {
              baseUrl: baseUrl,
              account: account,
              mediaUrl: url,
              maxBytes: maxBytes,
              accountId: accountId,
            }),
          ];
        case 8:
          _g.sent();
          _g.label = 9;
        case 9:
          _c++;
          return [3 /*break*/, 7];
        case 10:
          (_f = runtime.log) === null || _f === void 0
            ? void 0
            : _f.call(runtime, "delivered reply to ".concat(target));
          _g.label = 11;
        case 11:
          _i++;
          return [3 /*break*/, 1];
        case 12:
          return [2 /*return*/];
      }
    });
  });
}
function monitorSignalProvider() {
  return __awaiter(this, arguments, void 0, function (opts) {
    var runtime,
      cfg,
      accountInfo,
      historyLimit,
      groupHistories,
      textLimit,
      chunkMode,
      baseUrl,
      account,
      dmPolicy,
      allowFrom,
      groupAllowFrom,
      defaultGroupPolicy,
      groupPolicy,
      reactionMode,
      reactionAllowlist,
      mediaMaxBytes,
      ignoreAttachments,
      sendReadReceipts,
      autoStart,
      startupTimeoutMs,
      readReceiptsViaDaemon,
      daemonHandle,
      cliPath,
      httpHost,
      httpPort,
      onAbort,
      handleEvent_1,
      err_1;
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
      _z,
      _0,
      _1,
      _2,
      _3,
      _4,
      _5,
      _6,
      _7,
      _8,
      _9,
      _10,
      _11,
      _12,
      _13;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_14) {
      switch (_14.label) {
        case 0:
          runtime = resolveRuntime(opts);
          cfg = (_a = opts.config) !== null && _a !== void 0 ? _a : (0, config_js_1.loadConfig)();
          accountInfo = (0, accounts_js_1.resolveSignalAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          historyLimit = Math.max(
            0,
            (_e =
              (_b = accountInfo.config.historyLimit) !== null && _b !== void 0
                ? _b
                : (_d = (_c = cfg.messages) === null || _c === void 0 ? void 0 : _c.groupChat) ===
                      null || _d === void 0
                  ? void 0
                  : _d.historyLimit) !== null && _e !== void 0
              ? _e
              : history_js_1.DEFAULT_GROUP_HISTORY_LIMIT,
          );
          groupHistories = new Map();
          textLimit = (0, chunk_js_1.resolveTextChunkLimit)(cfg, "signal", accountInfo.accountId);
          chunkMode = (0, chunk_js_1.resolveChunkMode)(cfg, "signal", accountInfo.accountId);
          baseUrl =
            ((_f = opts.baseUrl) === null || _f === void 0 ? void 0 : _f.trim()) ||
            accountInfo.baseUrl;
          account =
            ((_g = opts.account) === null || _g === void 0 ? void 0 : _g.trim()) ||
            ((_h = accountInfo.config.account) === null || _h === void 0 ? void 0 : _h.trim());
          dmPolicy = (_j = accountInfo.config.dmPolicy) !== null && _j !== void 0 ? _j : "pairing";
          allowFrom = normalizeAllowList(
            (_k = opts.allowFrom) !== null && _k !== void 0 ? _k : accountInfo.config.allowFrom,
          );
          groupAllowFrom = normalizeAllowList(
            (_m =
              (_l = opts.groupAllowFrom) !== null && _l !== void 0
                ? _l
                : accountInfo.config.groupAllowFrom) !== null && _m !== void 0
              ? _m
              : accountInfo.config.allowFrom && accountInfo.config.allowFrom.length > 0
                ? accountInfo.config.allowFrom
                : [],
          );
          defaultGroupPolicy =
            (_p = (_o = cfg.channels) === null || _o === void 0 ? void 0 : _o.defaults) === null ||
            _p === void 0
              ? void 0
              : _p.groupPolicy;
          groupPolicy =
            (_r =
              (_q = accountInfo.config.groupPolicy) !== null && _q !== void 0
                ? _q
                : defaultGroupPolicy) !== null && _r !== void 0
              ? _r
              : "allowlist";
          reactionMode =
            (_s = accountInfo.config.reactionNotifications) !== null && _s !== void 0 ? _s : "own";
          reactionAllowlist = normalizeAllowList(accountInfo.config.reactionAllowlist);
          mediaMaxBytes =
            ((_u =
              (_t = opts.mediaMaxMb) !== null && _t !== void 0
                ? _t
                : accountInfo.config.mediaMaxMb) !== null && _u !== void 0
              ? _u
              : 8) *
            1024 *
            1024;
          ignoreAttachments =
            (_w =
              (_v = opts.ignoreAttachments) !== null && _v !== void 0
                ? _v
                : accountInfo.config.ignoreAttachments) !== null && _w !== void 0
              ? _w
              : false;
          sendReadReceipts = Boolean(
            (_x = opts.sendReadReceipts) !== null && _x !== void 0
              ? _x
              : accountInfo.config.sendReadReceipts,
          );
          autoStart =
            (_z =
              (_y = opts.autoStart) !== null && _y !== void 0
                ? _y
                : accountInfo.config.autoStart) !== null && _z !== void 0
              ? _z
              : !accountInfo.config.httpUrl;
          startupTimeoutMs = Math.min(
            120000,
            Math.max(
              1000,
              (_1 =
                (_0 = opts.startupTimeoutMs) !== null && _0 !== void 0
                  ? _0
                  : accountInfo.config.startupTimeoutMs) !== null && _1 !== void 0
                ? _1
                : 30000,
            ),
          );
          readReceiptsViaDaemon = Boolean(autoStart && sendReadReceipts);
          daemonHandle = null;
          if (autoStart) {
            cliPath =
              (_3 =
                (_2 = opts.cliPath) !== null && _2 !== void 0 ? _2 : accountInfo.config.cliPath) !==
                null && _3 !== void 0
                ? _3
                : "signal-cli";
            httpHost =
              (_5 =
                (_4 = opts.httpHost) !== null && _4 !== void 0
                  ? _4
                  : accountInfo.config.httpHost) !== null && _5 !== void 0
                ? _5
                : "127.0.0.1";
            httpPort =
              (_7 =
                (_6 = opts.httpPort) !== null && _6 !== void 0
                  ? _6
                  : accountInfo.config.httpPort) !== null && _7 !== void 0
                ? _7
                : 8080;
            daemonHandle = (0, daemon_js_1.spawnSignalDaemon)({
              cliPath: cliPath,
              account: account,
              httpHost: httpHost,
              httpPort: httpPort,
              receiveMode:
                (_8 = opts.receiveMode) !== null && _8 !== void 0
                  ? _8
                  : accountInfo.config.receiveMode,
              ignoreAttachments:
                (_9 = opts.ignoreAttachments) !== null && _9 !== void 0
                  ? _9
                  : accountInfo.config.ignoreAttachments,
              ignoreStories:
                (_10 = opts.ignoreStories) !== null && _10 !== void 0
                  ? _10
                  : accountInfo.config.ignoreStories,
              sendReadReceipts: sendReadReceipts,
              runtime: runtime,
            });
          }
          onAbort = function () {
            daemonHandle === null || daemonHandle === void 0 ? void 0 : daemonHandle.stop();
          };
          (_11 = opts.abortSignal) === null || _11 === void 0
            ? void 0
            : _11.addEventListener("abort", onAbort, { once: true });
          _14.label = 1;
        case 1:
          _14.trys.push([1, 5, 6, 7]);
          if (!daemonHandle) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            waitForSignalDaemonReady({
              baseUrl: baseUrl,
              abortSignal: opts.abortSignal,
              timeoutMs: startupTimeoutMs,
              logAfterMs: 10000,
              logIntervalMs: 10000,
              runtime: runtime,
            }),
          ];
        case 2:
          _14.sent();
          _14.label = 3;
        case 3:
          handleEvent_1 = (0, event_handler_js_1.createSignalEventHandler)({
            runtime: runtime,
            cfg: cfg,
            baseUrl: baseUrl,
            account: account,
            accountId: accountInfo.accountId,
            blockStreaming: accountInfo.config.blockStreaming,
            historyLimit: historyLimit,
            groupHistories: groupHistories,
            textLimit: textLimit,
            dmPolicy: dmPolicy,
            allowFrom: allowFrom,
            groupAllowFrom: groupAllowFrom,
            groupPolicy: groupPolicy,
            reactionMode: reactionMode,
            reactionAllowlist: reactionAllowlist,
            mediaMaxBytes: mediaMaxBytes,
            ignoreAttachments: ignoreAttachments,
            sendReadReceipts: sendReadReceipts,
            readReceiptsViaDaemon: readReceiptsViaDaemon,
            fetchAttachment: fetchAttachment,
            deliverReplies: function (params) {
              return deliverReplies(__assign(__assign({}, params), { chunkMode: chunkMode }));
            },
            resolveSignalReactionTargets: resolveSignalReactionTargets,
            isSignalReactionMessage: isSignalReactionMessage,
            shouldEmitSignalReactionNotification: shouldEmitSignalReactionNotification,
            buildSignalReactionSystemEventText: buildSignalReactionSystemEventText,
          });
          return [
            4 /*yield*/,
            (0, sse_reconnect_js_1.runSignalSseLoop)({
              baseUrl: baseUrl,
              account: account,
              abortSignal: opts.abortSignal,
              runtime: runtime,
              onEvent: function (event) {
                void handleEvent_1(event).catch(function (err) {
                  var _a;
                  (_a = runtime.error) === null || _a === void 0
                    ? void 0
                    : _a.call(runtime, "event handler failed: ".concat(String(err)));
                });
              },
            }),
          ];
        case 4:
          _14.sent();
          return [3 /*break*/, 7];
        case 5:
          err_1 = _14.sent();
          if ((_12 = opts.abortSignal) === null || _12 === void 0 ? void 0 : _12.aborted) {
            return [2 /*return*/];
          }
          throw err_1;
        case 6:
          (_13 = opts.abortSignal) === null || _13 === void 0
            ? void 0
            : _13.removeEventListener("abort", onAbort);
          daemonHandle === null || daemonHandle === void 0 ? void 0 : daemonHandle.stop();
          return [7 /*endfinally*/];
        case 7:
          return [2 /*return*/];
      }
    });
  });
}
