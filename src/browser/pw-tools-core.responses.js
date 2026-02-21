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
exports.responseBodyViaPlaywright = responseBodyViaPlaywright;
var command_format_js_1 = require("../cli/command-format.js");
var pw_session_js_1 = require("./pw-session.js");
var pw_tools_core_shared_js_1 = require("./pw-tools-core.shared.js");
function matchUrlPattern(pattern, url) {
  var p = pattern.trim();
  if (!p) {
    return false;
  }
  if (p === url) {
    return true;
  }
  if (p.includes("*")) {
    var escaped = p.replace(/[|\\{}()[\]^$+?.]/g, "\\$&");
    var regex = new RegExp("^".concat(escaped.replace(/\*\*/g, ".*").replace(/\*/g, ".*"), "$"));
    return regex.test(url);
  }
  return url.includes(p);
}
function responseBodyViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var pattern,
      maxChars,
      timeout,
      page,
      promise,
      resp,
      url,
      status,
      headers,
      bodyText,
      buf,
      err_1,
      trimmed;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          pattern = String((_a = opts.url) !== null && _a !== void 0 ? _a : "").trim();
          if (!pattern) {
            throw new Error("url is required");
          }
          maxChars =
            typeof opts.maxChars === "number" && Number.isFinite(opts.maxChars)
              ? Math.max(1, Math.min(5000000, Math.floor(opts.maxChars)))
              : 200000;
          timeout = (0, pw_tools_core_shared_js_1.normalizeTimeoutMs)(opts.timeoutMs, 20000);
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _e.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          promise = new Promise(function (resolve, reject) {
            var done = false;
            var timer;
            var handler;
            var cleanup = function () {
              if (timer) {
                clearTimeout(timer);
              }
              timer = undefined;
              if (handler) {
                page.off("response", handler);
              }
            };
            handler = function (resp) {
              var _a;
              if (done) {
                return;
              }
              var r = resp;
              var u = ((_a = r.url) === null || _a === void 0 ? void 0 : _a.call(r)) || "";
              if (!matchUrlPattern(pattern, u)) {
                return;
              }
              done = true;
              cleanup();
              resolve(resp);
            };
            page.on("response", handler);
            timer = setTimeout(function () {
              if (done) {
                return;
              }
              done = true;
              cleanup();
              reject(
                new Error(
                  'Response not found for url pattern "'
                    .concat(pattern, "\". Run '")
                    .concat(
                      (0, command_format_js_1.formatCliCommand)("openclaw browser requests"),
                      "' to inspect recent network activity.",
                    ),
                ),
              );
            }, timeout);
          });
          return [4 /*yield*/, promise];
        case 2:
          resp = _e.sent();
          url = ((_b = resp.url) === null || _b === void 0 ? void 0 : _b.call(resp)) || "";
          status = (_c = resp.status) === null || _c === void 0 ? void 0 : _c.call(resp);
          headers = (_d = resp.headers) === null || _d === void 0 ? void 0 : _d.call(resp);
          bodyText = "";
          _e.label = 3;
        case 3:
          _e.trys.push([3, 8, , 9]);
          if (!(typeof resp.text === "function")) {
            return [3 /*break*/, 5];
          }
          return [4 /*yield*/, resp.text()];
        case 4:
          bodyText = _e.sent();
          return [3 /*break*/, 7];
        case 5:
          if (!(typeof resp.body === "function")) {
            return [3 /*break*/, 7];
          }
          return [4 /*yield*/, resp.body()];
        case 6:
          buf = _e.sent();
          bodyText = new TextDecoder("utf-8").decode(buf);
          _e.label = 7;
        case 7:
          return [3 /*break*/, 9];
        case 8:
          err_1 = _e.sent();
          throw new Error(
            'Failed to read response body for "'.concat(url, '": ').concat(String(err_1)),
          );
        case 9:
          trimmed = bodyText.length > maxChars ? bodyText.slice(0, maxChars) : bodyText;
          return [
            2 /*return*/,
            {
              url: url,
              status: status,
              headers: headers,
              body: trimmed,
              truncated: bodyText.length > maxChars ? true : undefined,
            },
          ];
      }
    });
  });
}
