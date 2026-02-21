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
exports.SELECTOR_UNSUPPORTED_MESSAGE = void 0;
exports.readBody = readBody;
exports.handleRouteError = handleRouteError;
exports.resolveProfileContext = resolveProfileContext;
exports.getPwAiModule = getPwAiModule;
exports.requirePwAi = requirePwAi;
var pw_ai_module_js_1 = require("../pw-ai-module.js");
var utils_js_1 = require("./utils.js");
exports.SELECTOR_UNSUPPORTED_MESSAGE = [
  "Error: 'selector' is not supported. Use 'ref' from snapshot instead.",
  "",
  "Example workflow:",
  "1. snapshot action to get page state with refs",
  '2. act with ref: "e123" to interact with element',
  "",
  "This is more reliable for modern SPAs.",
].join("\n");
function readBody(req) {
  var body = req.body;
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return {};
  }
  return body;
}
function handleRouteError(ctx, res, err) {
  var mapped = ctx.mapTabError(err);
  if (mapped) {
    return (0, utils_js_1.jsonError)(res, mapped.status, mapped.message);
  }
  (0, utils_js_1.jsonError)(res, 500, String(err));
}
function resolveProfileContext(req, res, ctx) {
  var profileCtx = (0, utils_js_1.getProfileContext)(req, ctx);
  if ("error" in profileCtx) {
    (0, utils_js_1.jsonError)(res, profileCtx.status, profileCtx.error);
    return null;
  }
  return profileCtx;
}
function getPwAiModule() {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, pw_ai_module_js_1.getPwAiModule)({ mode: "soft" })];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function requirePwAi(res, feature) {
  return __awaiter(this, void 0, void 0, function () {
    var mod;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, getPwAiModule()];
        case 1:
          mod = _a.sent();
          if (mod) {
            return [2 /*return*/, mod];
          }
          (0, utils_js_1.jsonError)(
            res,
            501,
            [
              "Playwright is not available in this gateway build; '".concat(
                feature,
                "' is unsupported.",
              ),
              "Install the full Playwright package (not playwright-core) and restart the gateway, or reinstall with browser support.",
              "Docs: /tools/browser#playwright-requirement",
            ].join("\n"),
          );
          return [2 /*return*/, null];
      }
    });
  });
}
