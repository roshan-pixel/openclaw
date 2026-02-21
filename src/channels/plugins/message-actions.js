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
exports.listChannelMessageActions = listChannelMessageActions;
exports.supportsChannelMessageButtons = supportsChannelMessageButtons;
exports.supportsChannelMessageCards = supportsChannelMessageCards;
exports.dispatchChannelMessageAction = dispatchChannelMessageAction;
var index_js_1 = require("./index.js");
function listChannelMessageActions(cfg) {
  var _a, _b;
  var actions = new Set(["send", "broadcast"]);
  for (var _i = 0, _c = (0, index_js_1.listChannelPlugins)(); _i < _c.length; _i++) {
    var plugin = _c[_i];
    var list =
      (_b = (_a = plugin.actions) === null || _a === void 0 ? void 0 : _a.listActions) === null ||
      _b === void 0
        ? void 0
        : _b.call(_a, { cfg: cfg });
    if (!list) {
      continue;
    }
    for (var _d = 0, list_1 = list; _d < list_1.length; _d++) {
      var action = list_1[_d];
      actions.add(action);
    }
  }
  return Array.from(actions);
}
function supportsChannelMessageButtons(cfg) {
  var _a, _b;
  for (var _i = 0, _c = (0, index_js_1.listChannelPlugins)(); _i < _c.length; _i++) {
    var plugin = _c[_i];
    if (
      (_b = (_a = plugin.actions) === null || _a === void 0 ? void 0 : _a.supportsButtons) ===
        null || _b === void 0
        ? void 0
        : _b.call(_a, { cfg: cfg })
    ) {
      return true;
    }
  }
  return false;
}
function supportsChannelMessageCards(cfg) {
  var _a, _b;
  for (var _i = 0, _c = (0, index_js_1.listChannelPlugins)(); _i < _c.length; _i++) {
    var plugin = _c[_i];
    if (
      (_b = (_a = plugin.actions) === null || _a === void 0 ? void 0 : _a.supportsCards) === null ||
      _b === void 0
        ? void 0
        : _b.call(_a, { cfg: cfg })
    ) {
      return true;
    }
  }
  return false;
}
function dispatchChannelMessageAction(ctx) {
  return __awaiter(this, void 0, void 0, function () {
    var plugin;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          plugin = (0, index_js_1.getChannelPlugin)(ctx.channel);
          if (
            !((_a = plugin === null || plugin === void 0 ? void 0 : plugin.actions) === null ||
            _a === void 0
              ? void 0
              : _a.handleAction)
          ) {
            return [2 /*return*/, null];
          }
          if (
            plugin.actions.supportsAction &&
            !plugin.actions.supportsAction({ action: ctx.action })
          ) {
            return [2 /*return*/, null];
          }
          return [4 /*yield*/, plugin.actions.handleAction(ctx)];
        case 1:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
