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
exports.startTelegramWebhook = startTelegramWebhook;
var node_http_1 = require("node:http");
var grammy_1 = require("grammy");
var diagnostic_events_js_1 = require("../infra/diagnostic-events.js");
var errors_js_1 = require("../infra/errors.js");
var runtime_js_1 = require("../runtime.js");
var diagnostic_js_1 = require("../logging/diagnostic.js");
var allowed_updates_js_1 = require("./allowed-updates.js");
var bot_js_1 = require("./bot.js");
var api_logging_js_1 = require("./api-logging.js");
function startTelegramWebhook(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var path,
      healthPath,
      port,
      host,
      runtime,
      diagnosticsEnabled,
      bot,
      handler,
      server,
      publicUrl,
      shutdown;
    var _a, _b, _c, _d, _e, _f, _g;
    return __generator(this, function (_h) {
      switch (_h.label) {
        case 0:
          path = (_a = opts.path) !== null && _a !== void 0 ? _a : "/telegram-webhook";
          healthPath = (_b = opts.healthPath) !== null && _b !== void 0 ? _b : "/healthz";
          port = (_c = opts.port) !== null && _c !== void 0 ? _c : 8787;
          host = (_d = opts.host) !== null && _d !== void 0 ? _d : "0.0.0.0";
          runtime =
            (_e = opts.runtime) !== null && _e !== void 0 ? _e : runtime_js_1.defaultRuntime;
          diagnosticsEnabled = (0, diagnostic_events_js_1.isDiagnosticsEnabled)(opts.config);
          bot = (0, bot_js_1.createTelegramBot)({
            token: opts.token,
            runtime: runtime,
            proxyFetch: opts.fetch,
            config: opts.config,
            accountId: opts.accountId,
          });
          handler = (0, grammy_1.webhookCallback)(bot, "http", {
            secretToken: opts.secret,
          });
          if (diagnosticsEnabled) {
            (0, diagnostic_js_1.startDiagnosticHeartbeat)();
          }
          server = (0, node_http_1.createServer)(function (req, res) {
            if (req.url === healthPath) {
              res.writeHead(200);
              res.end("ok");
              return;
            }
            if (req.url !== path || req.method !== "POST") {
              res.writeHead(404);
              res.end();
              return;
            }
            var startTime = Date.now();
            if (diagnosticsEnabled) {
              (0, diagnostic_js_1.logWebhookReceived)({
                channel: "telegram",
                updateType: "telegram-post",
              });
            }
            var handled = handler(req, res);
            if (handled && typeof handled.catch === "function") {
              void handled
                .then(function () {
                  if (diagnosticsEnabled) {
                    (0, diagnostic_js_1.logWebhookProcessed)({
                      channel: "telegram",
                      updateType: "telegram-post",
                      durationMs: Date.now() - startTime,
                    });
                  }
                })
                .catch(function (err) {
                  var _a;
                  var errMsg = (0, errors_js_1.formatErrorMessage)(err);
                  if (diagnosticsEnabled) {
                    (0, diagnostic_js_1.logWebhookError)({
                      channel: "telegram",
                      updateType: "telegram-post",
                      error: errMsg,
                    });
                  }
                  (_a = runtime.log) === null || _a === void 0
                    ? void 0
                    : _a.call(runtime, "webhook handler failed: ".concat(errMsg));
                  if (!res.headersSent) {
                    res.writeHead(500);
                  }
                  res.end();
                });
            }
          });
          publicUrl =
            (_f = opts.publicUrl) !== null && _f !== void 0
              ? _f
              : "http://"
                  .concat(host === "0.0.0.0" ? "localhost" : host, ":")
                  .concat(port)
                  .concat(path);
          return [
            4 /*yield*/,
            (0, api_logging_js_1.withTelegramApiErrorLogging)({
              operation: "setWebhook",
              runtime: runtime,
              fn: function () {
                return bot.api.setWebhook(publicUrl, {
                  secret_token: opts.secret,
                  allowed_updates: (0, allowed_updates_js_1.resolveTelegramAllowedUpdates)(),
                });
              },
            }),
          ];
        case 1:
          _h.sent();
          return [
            4 /*yield*/,
            new Promise(function (resolve) {
              return server.listen(port, host, resolve);
            }),
          ];
        case 2:
          _h.sent();
          (_g = runtime.log) === null || _g === void 0
            ? void 0
            : _g.call(runtime, "webhook listening on ".concat(publicUrl));
          shutdown = function () {
            server.close();
            void bot.stop();
            if (diagnosticsEnabled) {
              (0, diagnostic_js_1.stopDiagnosticHeartbeat)();
            }
          };
          if (opts.abortSignal) {
            opts.abortSignal.addEventListener("abort", shutdown, { once: true });
          }
          return [2 /*return*/, { server: server, bot: bot, stop: shutdown }];
      }
    });
  });
}
