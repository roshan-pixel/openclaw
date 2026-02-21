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
exports.sendMessageSignal = sendMessageSignal;
exports.sendTypingSignal = sendTypingSignal;
exports.sendReadReceiptSignal = sendReadReceiptSignal;
var config_js_1 = require("../config/config.js");
var markdown_tables_js_1 = require("../config/markdown-tables.js");
var constants_js_1 = require("../media/constants.js");
var store_js_1 = require("../media/store.js");
var media_js_1 = require("../web/media.js");
var accounts_js_1 = require("./accounts.js");
var client_js_1 = require("./client.js");
var format_js_1 = require("./format.js");
function parseTarget(raw) {
  var value = raw.trim();
  if (!value) {
    throw new Error("Signal recipient is required");
  }
  var lower = value.toLowerCase();
  if (lower.startsWith("signal:")) {
    value = value.slice("signal:".length).trim();
  }
  var normalized = value.toLowerCase();
  if (normalized.startsWith("group:")) {
    return { type: "group", groupId: value.slice("group:".length).trim() };
  }
  if (normalized.startsWith("username:")) {
    return {
      type: "username",
      username: value.slice("username:".length).trim(),
    };
  }
  if (normalized.startsWith("u:")) {
    return { type: "username", username: value.trim() };
  }
  return { type: "recipient", recipient: value };
}
function buildTargetParams(target, allow) {
  if (target.type === "recipient") {
    if (!allow.recipient) {
      return null;
    }
    return { recipient: [target.recipient] };
  }
  if (target.type === "group") {
    if (!allow.group) {
      return null;
    }
    return { groupId: target.groupId };
  }
  if (target.type === "username") {
    if (!allow.username) {
      return null;
    }
    return { username: [target.username] };
  }
  return null;
}
function resolveSignalRpcContext(opts, accountInfo) {
  var _a, _b, _c, _d, _e;
  var hasBaseUrl = Boolean((_a = opts.baseUrl) === null || _a === void 0 ? void 0 : _a.trim());
  var hasAccount = Boolean((_b = opts.account) === null || _b === void 0 ? void 0 : _b.trim());
  var resolvedAccount =
    accountInfo ||
    (!hasBaseUrl || !hasAccount
      ? (0, accounts_js_1.resolveSignalAccount)({
          cfg: (0, config_js_1.loadConfig)(),
          accountId: opts.accountId,
        })
      : undefined);
  var baseUrl =
    ((_c = opts.baseUrl) === null || _c === void 0 ? void 0 : _c.trim()) ||
    (resolvedAccount === null || resolvedAccount === void 0 ? void 0 : resolvedAccount.baseUrl);
  if (!baseUrl) {
    throw new Error("Signal base URL is required");
  }
  var account =
    ((_d = opts.account) === null || _d === void 0 ? void 0 : _d.trim()) ||
    ((_e =
      resolvedAccount === null || resolvedAccount === void 0
        ? void 0
        : resolvedAccount.config.account) === null || _e === void 0
      ? void 0
      : _e.trim());
  return { baseUrl: baseUrl, account: account };
}
function resolveAttachment(mediaUrl, maxBytes) {
  return __awaiter(this, void 0, void 0, function () {
    var media, saved;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, (0, media_js_1.loadWebMedia)(mediaUrl, maxBytes)];
        case 1:
          media = _b.sent();
          return [
            4 /*yield*/,
            (0, store_js_1.saveMediaBuffer)(
              media.buffer,
              (_a = media.contentType) !== null && _a !== void 0 ? _a : undefined,
              "outbound",
              maxBytes,
            ),
          ];
        case 2:
          saved = _b.sent();
          return [2 /*return*/, { path: saved.path, contentType: saved.contentType }];
      }
    });
  });
}
function sendMessageSignal(to_1, text_1) {
  return __awaiter(this, arguments, void 0, function (to, text, opts) {
    var cfg,
      accountInfo,
      _a,
      baseUrl,
      account,
      target,
      message,
      messageFromPlaceholder,
      textStyles,
      textMode,
      maxBytes,
      attachments,
      resolved,
      kind,
      tableMode,
      formatted,
      params,
      targetParams,
      result,
      timestamp;
    var _b, _c, _d, _e;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          cfg = (0, config_js_1.loadConfig)();
          accountInfo = (0, accounts_js_1.resolveSignalAccount)({
            cfg: cfg,
            accountId: opts.accountId,
          });
          ((_a = resolveSignalRpcContext(opts, accountInfo)),
            (baseUrl = _a.baseUrl),
            (account = _a.account));
          target = parseTarget(to);
          message = text !== null && text !== void 0 ? text : "";
          messageFromPlaceholder = false;
          textStyles = [];
          textMode = (_b = opts.textMode) !== null && _b !== void 0 ? _b : "markdown";
          maxBytes = (function () {
            var _a, _b;
            if (typeof opts.maxBytes === "number") {
              return opts.maxBytes;
            }
            if (typeof accountInfo.config.mediaMaxMb === "number") {
              return accountInfo.config.mediaMaxMb * 1024 * 1024;
            }
            if (
              typeof ((_b = (_a = cfg.agents) === null || _a === void 0 ? void 0 : _a.defaults) ===
                null || _b === void 0
                ? void 0
                : _b.mediaMaxMb) === "number"
            ) {
              return cfg.agents.defaults.mediaMaxMb * 1024 * 1024;
            }
            return 8 * 1024 * 1024;
          })();
          if (!((_c = opts.mediaUrl) === null || _c === void 0 ? void 0 : _c.trim())) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, resolveAttachment(opts.mediaUrl.trim(), maxBytes)];
        case 1:
          resolved = _f.sent();
          attachments = [resolved.path];
          kind = (0, constants_js_1.mediaKindFromMime)(
            (_d = resolved.contentType) !== null && _d !== void 0 ? _d : undefined,
          );
          if (!message && kind) {
            // Avoid sending an empty body when only attachments exist.
            message = kind === "image" ? "<media:image>" : "<media:".concat(kind, ">");
            messageFromPlaceholder = true;
          }
          _f.label = 2;
        case 2:
          if (message.trim() && !messageFromPlaceholder) {
            if (textMode === "plain") {
              textStyles = (_e = opts.textStyles) !== null && _e !== void 0 ? _e : [];
            } else {
              tableMode = (0, markdown_tables_js_1.resolveMarkdownTableMode)({
                cfg: cfg,
                channel: "signal",
                accountId: accountInfo.accountId,
              });
              formatted = (0, format_js_1.markdownToSignalText)(message, { tableMode: tableMode });
              message = formatted.text;
              textStyles = formatted.styles;
            }
          }
          if (!message.trim() && (!attachments || attachments.length === 0)) {
            throw new Error("Signal send requires text or media");
          }
          params = { message: message };
          if (textStyles.length > 0) {
            params["text-style"] = textStyles.map(function (style) {
              return "".concat(style.start, ":").concat(style.length, ":").concat(style.style);
            });
          }
          if (account) {
            params.account = account;
          }
          if (attachments && attachments.length > 0) {
            params.attachments = attachments;
          }
          targetParams = buildTargetParams(target, {
            recipient: true,
            group: true,
            username: true,
          });
          if (!targetParams) {
            throw new Error("Signal recipient is required");
          }
          Object.assign(params, targetParams);
          return [
            4 /*yield*/,
            (0, client_js_1.signalRpcRequest)("send", params, {
              baseUrl: baseUrl,
              timeoutMs: opts.timeoutMs,
            }),
          ];
        case 3:
          result = _f.sent();
          timestamp = result === null || result === void 0 ? void 0 : result.timestamp;
          return [
            2 /*return*/,
            {
              messageId: timestamp ? String(timestamp) : "unknown",
              timestamp: timestamp,
            },
          ];
      }
    });
  });
}
function sendTypingSignal(to_1) {
  return __awaiter(this, arguments, void 0, function (to, opts) {
    var _a, baseUrl, account, targetParams, params;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ((_a = resolveSignalRpcContext(opts)), (baseUrl = _a.baseUrl), (account = _a.account));
          targetParams = buildTargetParams(parseTarget(to), {
            recipient: true,
            group: true,
          });
          if (!targetParams) {
            return [2 /*return*/, false];
          }
          params = __assign({}, targetParams);
          if (account) {
            params.account = account;
          }
          if (opts.stop) {
            params.stop = true;
          }
          return [
            4 /*yield*/,
            (0, client_js_1.signalRpcRequest)("sendTyping", params, {
              baseUrl: baseUrl,
              timeoutMs: opts.timeoutMs,
            }),
          ];
        case 1:
          _b.sent();
          return [2 /*return*/, true];
      }
    });
  });
}
function sendReadReceiptSignal(to_1, targetTimestamp_1) {
  return __awaiter(this, arguments, void 0, function (to, targetTimestamp, opts) {
    var _a, baseUrl, account, targetParams, params;
    var _b;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          if (!Number.isFinite(targetTimestamp) || targetTimestamp <= 0) {
            return [2 /*return*/, false];
          }
          ((_a = resolveSignalRpcContext(opts)), (baseUrl = _a.baseUrl), (account = _a.account));
          targetParams = buildTargetParams(parseTarget(to), {
            recipient: true,
          });
          if (!targetParams) {
            return [2 /*return*/, false];
          }
          params = __assign(__assign({}, targetParams), {
            targetTimestamp: targetTimestamp,
            type: (_b = opts.type) !== null && _b !== void 0 ? _b : "read",
          });
          if (account) {
            params.account = account;
          }
          return [
            4 /*yield*/,
            (0, client_js_1.signalRpcRequest)("sendReceipt", params, {
              baseUrl: baseUrl,
              timeoutMs: opts.timeoutMs,
            }),
          ];
        case 1:
          _c.sent();
          return [2 /*return*/, true];
      }
    });
  });
}
