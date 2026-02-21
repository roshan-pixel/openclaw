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
exports.getLineRuntimeState = getLineRuntimeState;
exports.monitorLineProvider = monitorLineProvider;
var globals_js_1 = require("../globals.js");
var bot_js_1 = require("./bot.js");
var signature_js_1 = require("./signature.js");
var http_path_js_1 = require("../plugins/http-path.js");
var http_registry_js_1 = require("../plugins/http-registry.js");
var send_js_1 = require("./send.js");
var template_messages_js_1 = require("./template-messages.js");
var provider_dispatcher_js_1 = require("../auto-reply/reply/provider-dispatcher.js");
var identity_js_1 = require("../agents/identity.js");
var chunk_js_1 = require("../auto-reply/chunk.js");
var markdown_to_line_js_1 = require("./markdown-to-line.js");
var reply_chunks_js_1 = require("./reply-chunks.js");
var auto_reply_delivery_js_1 = require("./auto-reply-delivery.js");
// Track runtime state in memory (simplified version)
var runtimeState = new Map();
function recordChannelRuntimeState(params) {
  var _a;
  var key = "".concat(params.channel, ":").concat(params.accountId);
  var existing =
    (_a = runtimeState.get(key)) !== null && _a !== void 0
      ? _a
      : {
          running: false,
          lastStartAt: null,
          lastStopAt: null,
          lastError: null,
        };
  runtimeState.set(key, __assign(__assign({}, existing), params.state));
}
function getLineRuntimeState(accountId) {
  return runtimeState.get("line:".concat(accountId));
}
function readRequestBody(req) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      return [
        2 /*return*/,
        new Promise(function (resolve, reject) {
          var chunks = [];
          req.on("data", function (chunk) {
            return chunks.push(chunk);
          });
          req.on("end", function () {
            return resolve(Buffer.concat(chunks).toString("utf-8"));
          });
          req.on("error", reject);
        }),
      ];
    });
  });
}
function startLineLoadingKeepalive(params) {
  var _a, _b;
  var intervalMs = (_a = params.intervalMs) !== null && _a !== void 0 ? _a : 18000;
  var loadingSeconds = (_b = params.loadingSeconds) !== null && _b !== void 0 ? _b : 20;
  var stopped = false;
  var trigger = function () {
    if (stopped) {
      return;
    }
    void (0, send_js_1.showLoadingAnimation)(params.userId, {
      accountId: params.accountId,
      loadingSeconds: loadingSeconds,
    }).catch(function () {});
  };
  trigger();
  var timer = setInterval(trigger, intervalMs);
  return function () {
    if (stopped) {
      return;
    }
    stopped = true;
    clearInterval(timer);
  };
}
function monitorLineProvider(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var channelAccessToken,
      channelSecret,
      accountId,
      config,
      runtime,
      abortSignal,
      webhookPath,
      resolvedAccountId,
      bot,
      normalizedPath,
      unregisterHttp,
      stopHandler;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      ((channelAccessToken = opts.channelAccessToken),
        (channelSecret = opts.channelSecret),
        (accountId = opts.accountId),
        (config = opts.config),
        (runtime = opts.runtime),
        (abortSignal = opts.abortSignal),
        (webhookPath = opts.webhookPath));
      resolvedAccountId = accountId !== null && accountId !== void 0 ? accountId : "default";
      // Record starting state
      recordChannelRuntimeState({
        channel: "line",
        accountId: resolvedAccountId,
        state: {
          running: true,
          lastStartAt: Date.now(),
        },
      });
      bot = (0, bot_js_1.createLineBot)({
        channelAccessToken: channelAccessToken,
        channelSecret: channelSecret,
        accountId: accountId,
        runtime: runtime,
        config: config,
        onMessage: function (ctx) {
          return __awaiter(_this, void 0, void 0, function () {
            var ctxPayload,
              replyToken,
              route,
              shouldShowLoading,
              displayNamePromise,
              stopLoading,
              displayName,
              textLimit_1,
              replyTokenUsed_1,
              queuedFinal,
              err_1,
              replyErr_1;
            var _this = this;
            var _a, _b;
            return __generator(this, function (_c) {
              switch (_c.label) {
                case 0:
                  if (!ctx) {
                    return [2 /*return*/];
                  }
                  ((ctxPayload = ctx.ctxPayload),
                    (replyToken = ctx.replyToken),
                    (route = ctx.route));
                  // Record inbound activity
                  recordChannelRuntimeState({
                    channel: "line",
                    accountId: resolvedAccountId,
                    state: {
                      lastInboundAt: Date.now(),
                    },
                  });
                  shouldShowLoading = Boolean(ctx.userId && !ctx.isGroup);
                  displayNamePromise = ctx.userId
                    ? (0, send_js_1.getUserDisplayName)(ctx.userId, { accountId: ctx.accountId })
                    : Promise.resolve(ctxPayload.From);
                  stopLoading = shouldShowLoading
                    ? startLineLoadingKeepalive({ userId: ctx.userId, accountId: ctx.accountId })
                    : null;
                  return [4 /*yield*/, displayNamePromise];
                case 1:
                  displayName = _c.sent();
                  (0, globals_js_1.logVerbose)(
                    "line: received message from "
                      .concat(displayName, " (")
                      .concat(ctxPayload.From, ")"),
                  );
                  _c.label = 2;
                case 2:
                  _c.trys.push([2, 4, 9, 10]);
                  textLimit_1 = 5000;
                  replyTokenUsed_1 = false;
                  return [
                    4 /*yield*/,
                    (0, provider_dispatcher_js_1.dispatchReplyWithBufferedBlockDispatcher)({
                      ctx: ctxPayload,
                      cfg: config,
                      dispatcherOptions: {
                        responsePrefix: (0, identity_js_1.resolveEffectiveMessagesConfig)(
                          config,
                          route.agentId,
                        ).responsePrefix,
                        deliver: function (payload, _info) {
                          return __awaiter(_this, void 0, void 0, function () {
                            var lineData, nextReplyTokenUsed;
                            var _a, _b;
                            return __generator(this, function (_c) {
                              switch (_c.label) {
                                case 0:
                                  lineData =
                                    (_b =
                                      (_a = payload.channelData) === null || _a === void 0
                                        ? void 0
                                        : _a.line) !== null && _b !== void 0
                                      ? _b
                                      : {};
                                  // Show loading animation before each delivery (non-blocking)
                                  if (ctx.userId && !ctx.isGroup) {
                                    void (0, send_js_1.showLoadingAnimation)(ctx.userId, {
                                      accountId: ctx.accountId,
                                    }).catch(function () {});
                                  }
                                  return [
                                    4 /*yield*/,
                                    (0, auto_reply_delivery_js_1.deliverLineAutoReply)({
                                      payload: payload,
                                      lineData: lineData,
                                      to: ctxPayload.From,
                                      replyToken: replyToken,
                                      replyTokenUsed: replyTokenUsed_1,
                                      accountId: ctx.accountId,
                                      textLimit: textLimit_1,
                                      deps: {
                                        buildTemplateMessageFromPayload:
                                          template_messages_js_1.buildTemplateMessageFromPayload,
                                        processLineMessage:
                                          markdown_to_line_js_1.processLineMessage,
                                        chunkMarkdownText: chunk_js_1.chunkMarkdownText,
                                        sendLineReplyChunks: reply_chunks_js_1.sendLineReplyChunks,
                                        replyMessageLine: send_js_1.replyMessageLine,
                                        pushMessageLine: send_js_1.pushMessageLine,
                                        pushTextMessageWithQuickReplies:
                                          send_js_1.pushTextMessageWithQuickReplies,
                                        createQuickReplyItems: send_js_1.createQuickReplyItems,
                                        createTextMessageWithQuickReplies:
                                          send_js_1.createTextMessageWithQuickReplies,
                                        pushMessagesLine: send_js_1.pushMessagesLine,
                                        createFlexMessage: send_js_1.createFlexMessage,
                                        createImageMessage: send_js_1.createImageMessage,
                                        createLocationMessage: send_js_1.createLocationMessage,
                                        onReplyError: function (replyErr) {
                                          (0, globals_js_1.logVerbose)(
                                            "line: reply token failed, falling back to push: ".concat(
                                              String(replyErr),
                                            ),
                                          );
                                        },
                                      },
                                    }),
                                  ];
                                case 1:
                                  nextReplyTokenUsed = _c.sent().replyTokenUsed;
                                  replyTokenUsed_1 = nextReplyTokenUsed;
                                  recordChannelRuntimeState({
                                    channel: "line",
                                    accountId: resolvedAccountId,
                                    state: {
                                      lastOutboundAt: Date.now(),
                                    },
                                  });
                                  return [2 /*return*/];
                              }
                            });
                          });
                        },
                        onError: function (err, info) {
                          var _a;
                          (_a = runtime.error) === null || _a === void 0
                            ? void 0
                            : _a.call(
                                runtime,
                                (0, globals_js_1.danger)(
                                  "line ".concat(info.kind, " reply failed: ").concat(String(err)),
                                ),
                              );
                        },
                      },
                      replyOptions: {},
                    }),
                  ];
                case 3:
                  queuedFinal = _c.sent().queuedFinal;
                  if (!queuedFinal) {
                    (0, globals_js_1.logVerbose)(
                      "line: no response generated for message from ".concat(ctxPayload.From),
                    );
                  }
                  return [3 /*break*/, 10];
                case 4:
                  err_1 = _c.sent();
                  (_a = runtime.error) === null || _a === void 0
                    ? void 0
                    : _a.call(
                        runtime,
                        (0, globals_js_1.danger)("line: auto-reply failed: ".concat(String(err_1))),
                      );
                  if (!replyToken) {
                    return [3 /*break*/, 8];
                  }
                  _c.label = 5;
                case 5:
                  _c.trys.push([5, 7, , 8]);
                  return [
                    4 /*yield*/,
                    (0, send_js_1.replyMessageLine)(
                      replyToken,
                      [
                        {
                          type: "text",
                          text: "Sorry, I encountered an error processing your message.",
                        },
                      ],
                      { accountId: ctx.accountId },
                    ),
                  ];
                case 6:
                  _c.sent();
                  return [3 /*break*/, 8];
                case 7:
                  replyErr_1 = _c.sent();
                  (_b = runtime.error) === null || _b === void 0
                    ? void 0
                    : _b.call(
                        runtime,
                        (0, globals_js_1.danger)(
                          "line: error reply failed: ".concat(String(replyErr_1)),
                        ),
                      );
                  return [3 /*break*/, 8];
                case 8:
                  return [3 /*break*/, 10];
                case 9:
                  stopLoading === null || stopLoading === void 0 ? void 0 : stopLoading();
                  return [7 /*endfinally*/];
                case 10:
                  return [2 /*return*/];
              }
            });
          });
        },
      });
      normalizedPath =
        (_a = (0, http_path_js_1.normalizePluginHttpPath)(webhookPath, "/line/webhook")) !== null &&
        _a !== void 0
          ? _a
          : "/line/webhook";
      unregisterHttp = (0, http_registry_js_1.registerPluginHttpRoute)({
        path: normalizedPath,
        pluginId: "line",
        accountId: resolvedAccountId,
        log: function (msg) {
          return (0, globals_js_1.logVerbose)(msg);
        },
        handler: function (req, res) {
          return __awaiter(_this, void 0, void 0, function () {
            var rawBody, signature, body, err_2;
            var _a;
            return __generator(this, function (_b) {
              switch (_b.label) {
                case 0:
                  // Handle GET requests for webhook verification
                  if (req.method === "GET") {
                    res.statusCode = 200;
                    res.setHeader("Content-Type", "text/plain");
                    res.end("OK");
                    return [2 /*return*/];
                  }
                  // Only accept POST requests
                  if (req.method !== "POST") {
                    res.statusCode = 405;
                    res.setHeader("Allow", "GET, POST");
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ error: "Method Not Allowed" }));
                    return [2 /*return*/];
                  }
                  _b.label = 1;
                case 1:
                  _b.trys.push([1, 5, , 6]);
                  return [4 /*yield*/, readRequestBody(req)];
                case 2:
                  rawBody = _b.sent();
                  signature = req.headers["x-line-signature"];
                  // Validate signature
                  if (!signature || typeof signature !== "string") {
                    (0, globals_js_1.logVerbose)("line: webhook missing X-Line-Signature header");
                    res.statusCode = 400;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ error: "Missing X-Line-Signature header" }));
                    return [2 /*return*/];
                  }
                  if (
                    !(0, signature_js_1.validateLineSignature)(rawBody, signature, channelSecret)
                  ) {
                    (0, globals_js_1.logVerbose)("line: webhook signature validation failed");
                    res.statusCode = 401;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ error: "Invalid signature" }));
                    return [2 /*return*/];
                  }
                  body = JSON.parse(rawBody);
                  // Respond immediately with 200 to avoid LINE timeout
                  res.statusCode = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.end(JSON.stringify({ status: "ok" }));
                  if (!(body.events && body.events.length > 0)) {
                    return [3 /*break*/, 4];
                  }
                  (0, globals_js_1.logVerbose)(
                    "line: received ".concat(body.events.length, " webhook events"),
                  );
                  return [
                    4 /*yield*/,
                    bot.handleWebhook(body).catch(function (err) {
                      var _a;
                      (_a = runtime.error) === null || _a === void 0
                        ? void 0
                        : _a.call(
                            runtime,
                            (0, globals_js_1.danger)(
                              "line webhook handler failed: ".concat(String(err)),
                            ),
                          );
                    }),
                  ];
                case 3:
                  _b.sent();
                  _b.label = 4;
                case 4:
                  return [3 /*break*/, 6];
                case 5:
                  err_2 = _b.sent();
                  (_a = runtime.error) === null || _a === void 0
                    ? void 0
                    : _a.call(
                        runtime,
                        (0, globals_js_1.danger)("line webhook error: ".concat(String(err_2))),
                      );
                  if (!res.headersSent) {
                    res.statusCode = 500;
                    res.setHeader("Content-Type", "application/json");
                    res.end(JSON.stringify({ error: "Internal server error" }));
                  }
                  return [3 /*break*/, 6];
                case 6:
                  return [2 /*return*/];
              }
            });
          });
        },
      });
      (0, globals_js_1.logVerbose)("line: registered webhook handler at ".concat(normalizedPath));
      stopHandler = function () {
        (0, globals_js_1.logVerbose)(
          "line: stopping provider for account ".concat(resolvedAccountId),
        );
        unregisterHttp();
        recordChannelRuntimeState({
          channel: "line",
          accountId: resolvedAccountId,
          state: {
            running: false,
            lastStopAt: Date.now(),
          },
        });
      };
      abortSignal === null || abortSignal === void 0
        ? void 0
        : abortSignal.addEventListener("abort", stopHandler);
      return [
        2 /*return*/,
        {
          account: bot.account,
          handleWebhook: bot.handleWebhook,
          stop: function () {
            stopHandler();
            abortSignal === null || abortSignal === void 0
              ? void 0
              : abortSignal.removeEventListener("abort", stopHandler);
          },
        },
      ];
    });
  });
}
