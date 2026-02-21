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
exports.formatErrorMessage = formatErrorMessage;
exports.withManager = withManager;
exports.runCommandWithRuntime = runCommandWithRuntime;
exports.resolveOptionFromCommand = resolveOptionFromCommand;
function formatErrorMessage(err) {
  return err instanceof Error ? err.message : String(err);
}
function withManager(params) {
  return __awaiter(this, void 0, void 0, function () {
    var _a, manager, error, err_1;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [4 /*yield*/, params.getManager()];
        case 1:
          ((_a = _c.sent()), (manager = _a.manager), (error = _a.error));
          if (!manager) {
            params.onMissing(error);
            return [2 /*return*/];
          }
          _c.label = 2;
        case 2:
          _c.trys.push([2, , 4, 8]);
          return [4 /*yield*/, params.run(manager)];
        case 3:
          _c.sent();
          return [3 /*break*/, 8];
        case 4:
          _c.trys.push([4, 6, , 7]);
          return [4 /*yield*/, params.close(manager)];
        case 5:
          _c.sent();
          return [3 /*break*/, 7];
        case 6:
          err_1 = _c.sent();
          (_b = params.onCloseError) === null || _b === void 0 ? void 0 : _b.call(params, err_1);
          return [3 /*break*/, 7];
        case 7:
          return [7 /*endfinally*/];
        case 8:
          return [2 /*return*/];
      }
    });
  });
}
function runCommandWithRuntime(runtime, action, onError) {
  return __awaiter(this, void 0, void 0, function () {
    var err_2;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          return [4 /*yield*/, action()];
        case 1:
          _a.sent();
          return [3 /*break*/, 3];
        case 2:
          err_2 = _a.sent();
          if (onError) {
            onError(err_2);
            return [2 /*return*/];
          }
          runtime.error(String(err_2));
          runtime.exit(1);
          return [3 /*break*/, 3];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function resolveOptionFromCommand(command, key) {
  var _a, _b, _c;
  var current = command;
  while (current) {
    var opts =
      (_b = (_a = current.opts) === null || _a === void 0 ? void 0 : _a.call(current)) !== null &&
      _b !== void 0
        ? _b
        : {};
    if (opts[key] !== undefined) {
      return opts[key];
    }
    current = (_c = current.parent) !== null && _c !== void 0 ? _c : undefined;
  }
  return undefined;
}
