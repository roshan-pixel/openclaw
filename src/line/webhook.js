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
exports.createLineWebhookMiddleware = createLineWebhookMiddleware;
exports.startLineWebhook = startLineWebhook;
var globals_js_1 = require("../globals.js");
var signature_js_1 = require("./signature.js");
function readRawBody(req) {
  var _a;
  var rawBody =
    (_a = req.rawBody) !== null && _a !== void 0
      ? _a
      : typeof req.body === "string" || Buffer.isBuffer(req.body)
        ? req.body
        : null;
  if (!rawBody) {
    return null;
  }
  return Buffer.isBuffer(rawBody) ? rawBody.toString("utf-8") : rawBody;
}
function parseWebhookBody(req, rawBody) {
  if (req.body && typeof req.body === "object" && !Buffer.isBuffer(req.body)) {
    return req.body;
  }
  try {
    return JSON.parse(rawBody);
  } catch (_a) {
    return null;
  }
}
function createLineWebhookMiddleware(options) {
  var _this = this;
  var channelSecret = options.channelSecret,
    onEvents = options.onEvents,
    runtime = options.runtime;
  return function (req, res, _next) {
    return __awaiter(_this, void 0, void 0, function () {
      var signature, rawBody, body, err_1;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 3, , 4]);
            signature = req.headers["x-line-signature"];
            if (!signature || typeof signature !== "string") {
              res.status(400).json({ error: "Missing X-Line-Signature header" });
              return [2 /*return*/];
            }
            rawBody = readRawBody(req);
            if (!rawBody) {
              res
                .status(400)
                .json({ error: "Missing raw request body for signature verification" });
              return [2 /*return*/];
            }
            if (!(0, signature_js_1.validateLineSignature)(rawBody, signature, channelSecret)) {
              (0, globals_js_1.logVerbose)("line: webhook signature validation failed");
              res.status(401).json({ error: "Invalid signature" });
              return [2 /*return*/];
            }
            body = parseWebhookBody(req, rawBody);
            if (!body) {
              res.status(400).json({ error: "Invalid webhook payload" });
              return [2 /*return*/];
            }
            // Respond immediately to avoid timeout
            res.status(200).json({ status: "ok" });
            if (!(body.events && body.events.length > 0)) {
              return [3 /*break*/, 2];
            }
            (0, globals_js_1.logVerbose)(
              "line: received ".concat(body.events.length, " webhook events"),
            );
            return [
              4 /*yield*/,
              onEvents(body).catch(function (err) {
                var _a;
                (_a = runtime === null || runtime === void 0 ? void 0 : runtime.error) === null ||
                _a === void 0
                  ? void 0
                  : _a.call(
                      runtime,
                      (0, globals_js_1.danger)("line webhook handler failed: ".concat(String(err))),
                    );
              }),
            ];
          case 1:
            _b.sent();
            _b.label = 2;
          case 2:
            return [3 /*break*/, 4];
          case 3:
            err_1 = _b.sent();
            (_a = runtime === null || runtime === void 0 ? void 0 : runtime.error) === null ||
            _a === void 0
              ? void 0
              : _a.call(
                  runtime,
                  (0, globals_js_1.danger)("line webhook error: ".concat(String(err_1))),
                );
            if (!res.headersSent) {
              res.status(500).json({ error: "Internal server error" });
            }
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
}
function startLineWebhook(options) {
  var _a;
  var path = (_a = options.path) !== null && _a !== void 0 ? _a : "/line/webhook";
  var middleware = createLineWebhookMiddleware({
    channelSecret: options.channelSecret,
    onEvents: options.onEvents,
    runtime: options.runtime,
  });
  return { path: path, handler: middleware };
}
