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
exports.getPwAiModule = getPwAiModule;
var errors_js_1 = require("../infra/errors.js");
var pwAiModuleSoft = null;
var pwAiModuleStrict = null;
function isModuleNotFoundError(err) {
  var code = (0, errors_js_1.extractErrorCode)(err);
  if (code === "ERR_MODULE_NOT_FOUND") {
    return true;
  }
  var msg = (0, errors_js_1.formatErrorMessage)(err);
  return (
    msg.includes("Cannot find module") ||
    msg.includes("Cannot find package") ||
    msg.includes("Failed to resolve import") ||
    msg.includes("Failed to resolve entry for package") ||
    msg.includes("Failed to load url")
  );
}
function loadPwAiModule(mode) {
  return __awaiter(this, void 0, void 0, function () {
    var err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          return [
            4 /*yield*/,
            Promise.resolve().then(function () {
              return require("./pw-ai.js");
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
        case 2:
          err_1 = _a.sent();
          if (mode === "soft") {
            return [2 /*return*/, null];
          }
          if (isModuleNotFoundError(err_1)) {
            return [2 /*return*/, null];
          }
          throw err_1;
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function getPwAiModule(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var mode;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          mode =
            (_a = opts === null || opts === void 0 ? void 0 : opts.mode) !== null && _a !== void 0
              ? _a
              : "soft";
          if (!(mode === "soft")) {
            return [3 /*break*/, 2];
          }
          if (!pwAiModuleSoft) {
            pwAiModuleSoft = loadPwAiModule("soft");
          }
          return [4 /*yield*/, pwAiModuleSoft];
        case 1:
          return [2 /*return*/, _b.sent()];
        case 2:
          if (!pwAiModuleStrict) {
            pwAiModuleStrict = loadPwAiModule("strict");
          }
          return [4 /*yield*/, pwAiModuleStrict];
        case 3:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
