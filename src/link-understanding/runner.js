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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.runLinkUnderstanding = runLinkUnderstanding;
var templating_js_1 = require("../auto-reply/templating.js");
var globals_js_1 = require("../globals.js");
var exec_js_1 = require("../process/exec.js");
var defaults_js_1 = require("../media-understanding/defaults.js");
var resolve_js_1 = require("../media-understanding/resolve.js");
var scope_js_1 = require("../media-understanding/scope.js");
var defaults_js_2 = require("./defaults.js");
var detect_js_1 = require("./detect.js");
function resolveScopeDecision(params) {
  var _a, _b;
  return (0, scope_js_1.resolveMediaUnderstandingScope)({
    scope: (_a = params.config) === null || _a === void 0 ? void 0 : _a.scope,
    sessionKey: params.ctx.SessionKey,
    channel: (_b = params.ctx.Surface) !== null && _b !== void 0 ? _b : params.ctx.Provider,
    chatType: (0, scope_js_1.normalizeMediaUnderstandingChatType)(params.ctx.ChatType),
  });
}
function resolveTimeoutMsFromConfig(params) {
  var _a, _b;
  var configured =
    (_a = params.entry.timeoutSeconds) !== null && _a !== void 0
      ? _a
      : (_b = params.config) === null || _b === void 0
        ? void 0
        : _b.timeoutSeconds;
  return (0, resolve_js_1.resolveTimeoutMs)(configured, defaults_js_2.DEFAULT_LINK_TIMEOUT_SECONDS);
}
function runCliEntry(params) {
  return __awaiter(this, void 0, void 0, function () {
    var command, args, timeoutMs, templCtx, argv, stdout, trimmed;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          if (((_a = params.entry.type) !== null && _a !== void 0 ? _a : "cli") !== "cli") {
            return [2 /*return*/, null];
          }
          command = params.entry.command.trim();
          if (!command) {
            return [2 /*return*/, null];
          }
          args = (_b = params.entry.args) !== null && _b !== void 0 ? _b : [];
          timeoutMs = resolveTimeoutMsFromConfig({ config: params.config, entry: params.entry });
          templCtx = __assign(__assign({}, params.ctx), { LinkUrl: params.url });
          argv = __spreadArray([command], args, true).map(function (part, index) {
            return index === 0 ? part : (0, templating_js_1.applyTemplate)(part, templCtx);
          });
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)("Link understanding via CLI: ".concat(argv.join(" ")));
          }
          return [
            4 /*yield*/,
            (0, exec_js_1.runExec)(argv[0], argv.slice(1), {
              timeoutMs: timeoutMs,
              maxBuffer: defaults_js_1.CLI_OUTPUT_MAX_BUFFER,
            }),
          ];
        case 1:
          stdout = _c.sent().stdout;
          trimmed = stdout.trim();
          return [2 /*return*/, trimmed || null];
      }
    });
  });
}
function runLinkEntries(params) {
  return __awaiter(this, void 0, void 0, function () {
    var lastError, _i, _a, entry, output, err_1;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ((_i = 0), (_a = params.entries));
          _b.label = 1;
        case 1:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 6];
          }
          entry = _a[_i];
          _b.label = 2;
        case 2:
          _b.trys.push([2, 4, , 5]);
          return [
            4 /*yield*/,
            runCliEntry({
              entry: entry,
              ctx: params.ctx,
              url: params.url,
              config: params.config,
            }),
          ];
        case 3:
          output = _b.sent();
          if (output) {
            return [2 /*return*/, output];
          }
          return [3 /*break*/, 5];
        case 4:
          err_1 = _b.sent();
          lastError = err_1;
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)(
              "Link understanding failed for ".concat(params.url, ": ").concat(String(err_1)),
            );
          }
          return [3 /*break*/, 5];
        case 5:
          _i++;
          return [3 /*break*/, 1];
        case 6:
          if (lastError && (0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)("Link understanding exhausted for ".concat(params.url));
          }
          return [2 /*return*/, null];
      }
    });
  });
}
function runLinkUnderstanding(params) {
  return __awaiter(this, void 0, void 0, function () {
    var config, scopeDecision, message, links, entries, outputs, _i, links_1, url, output;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          config = (_a = params.cfg.tools) === null || _a === void 0 ? void 0 : _a.links;
          if (!config || config.enabled === false) {
            return [2 /*return*/, { urls: [], outputs: [] }];
          }
          scopeDecision = resolveScopeDecision({ config: config, ctx: params.ctx });
          if (scopeDecision === "deny") {
            if ((0, globals_js_1.shouldLogVerbose)()) {
              (0, globals_js_1.logVerbose)("Link understanding disabled by scope policy.");
            }
            return [2 /*return*/, { urls: [], outputs: [] }];
          }
          message =
            (_d =
              (_c =
                (_b = params.message) !== null && _b !== void 0 ? _b : params.ctx.CommandBody) !==
                null && _c !== void 0
                ? _c
                : params.ctx.RawBody) !== null && _d !== void 0
              ? _d
              : params.ctx.Body;
          links = (0, detect_js_1.extractLinksFromMessage)(
            message !== null && message !== void 0 ? message : "",
            { maxLinks: config === null || config === void 0 ? void 0 : config.maxLinks },
          );
          if (links.length === 0) {
            return [2 /*return*/, { urls: [], outputs: [] }];
          }
          entries =
            (_e = config === null || config === void 0 ? void 0 : config.models) !== null &&
            _e !== void 0
              ? _e
              : [];
          if (entries.length === 0) {
            return [2 /*return*/, { urls: links, outputs: [] }];
          }
          outputs = [];
          ((_i = 0), (links_1 = links));
          _f.label = 1;
        case 1:
          if (!(_i < links_1.length)) {
            return [3 /*break*/, 4];
          }
          url = links_1[_i];
          return [
            4 /*yield*/,
            runLinkEntries({
              entries: entries,
              ctx: params.ctx,
              url: url,
              config: config,
            }),
          ];
        case 2:
          output = _f.sent();
          if (output) {
            outputs.push(output);
          }
          _f.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/, { urls: links, outputs: outputs }];
      }
    });
  });
}
