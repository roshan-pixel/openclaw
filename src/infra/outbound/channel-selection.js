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
exports.listConfiguredMessageChannels = listConfiguredMessageChannels;
exports.resolveMessageChannelSelection = resolveMessageChannelSelection;
var index_js_1 = require("../../channels/plugins/index.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var getMessageChannels = function () {
  return (0, message_channel_js_1.listDeliverableMessageChannels)();
};
function isKnownChannel(value) {
  return getMessageChannels().includes(value);
}
function isAccountEnabled(account) {
  if (!account || typeof account !== "object") {
    return true;
  }
  var enabled = account.enabled;
  return enabled !== false;
}
function isPluginConfigured(plugin, cfg) {
  return __awaiter(this, void 0, void 0, function () {
    var accountIds, _i, accountIds_1, accountId, account, enabled, configured;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          accountIds = plugin.config.listAccountIds(cfg);
          if (accountIds.length === 0) {
            return [2 /*return*/, false];
          }
          ((_i = 0), (accountIds_1 = accountIds));
          _a.label = 1;
        case 1:
          if (!(_i < accountIds_1.length)) {
            return [3 /*break*/, 4];
          }
          accountId = accountIds_1[_i];
          account = plugin.config.resolveAccount(cfg, accountId);
          enabled = plugin.config.isEnabled
            ? plugin.config.isEnabled(account, cfg)
            : isAccountEnabled(account);
          if (!enabled) {
            return [3 /*break*/, 3];
          }
          if (!plugin.config.isConfigured) {
            return [2 /*return*/, true];
          }
          return [4 /*yield*/, plugin.config.isConfigured(account, cfg)];
        case 2:
          configured = _a.sent();
          if (configured) {
            return [2 /*return*/, true];
          }
          _a.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/, false];
      }
    });
  });
}
function listConfiguredMessageChannels(cfg) {
  return __awaiter(this, void 0, void 0, function () {
    var channels, _i, _a, plugin;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          channels = [];
          ((_i = 0), (_a = (0, index_js_1.listChannelPlugins)()));
          _b.label = 1;
        case 1:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 4];
          }
          plugin = _a[_i];
          if (!isKnownChannel(plugin.id)) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, isPluginConfigured(plugin, cfg)];
        case 2:
          if (_b.sent()) {
            channels.push(plugin.id);
          }
          _b.label = 3;
        case 3:
          _i++;
          return [3 /*break*/, 1];
        case 4:
          return [2 /*return*/, channels];
      }
    });
  });
}
function resolveMessageChannelSelection(params) {
  return __awaiter(this, void 0, void 0, function () {
    var normalized, configured;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          normalized = (0, message_channel_js_1.normalizeMessageChannel)(params.channel);
          if (!normalized) {
            return [3 /*break*/, 2];
          }
          if (!isKnownChannel(normalized)) {
            throw new Error("Unknown channel: ".concat(String(normalized)));
          }
          _a = {
            channel: normalized,
          };
          return [4 /*yield*/, listConfiguredMessageChannels(params.cfg)];
        case 1:
          return [2 /*return*/, ((_a.configured = _b.sent()), _a)];
        case 2:
          return [4 /*yield*/, listConfiguredMessageChannels(params.cfg)];
        case 3:
          configured = _b.sent();
          if (configured.length === 1) {
            return [2 /*return*/, { channel: configured[0], configured: configured }];
          }
          if (configured.length === 0) {
            throw new Error("Channel is required (no configured channels detected).");
          }
          throw new Error(
            "Channel is required when multiple channels are configured: ".concat(
              configured.join(", "),
            ),
          );
      }
    });
  });
}
