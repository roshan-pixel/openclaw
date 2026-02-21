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
exports.handleDebugCommand = exports.handleConfigCommand = void 0;
var config_js_1 = require("../../config/config.js");
var config_paths_js_1 = require("../../config/config-paths.js");
var runtime_overrides_js_1 = require("../../config/runtime-overrides.js");
var config_writes_js_1 = require("../../channels/plugins/config-writes.js");
var registry_js_1 = require("../../channels/registry.js");
var globals_js_1 = require("../../globals.js");
var config_commands_js_1 = require("./config-commands.js");
var debug_commands_js_1 = require("./debug-commands.js");
var handleConfigCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var configCommand,
      channelId,
      allowWrites,
      channelLabel,
      hint,
      snapshot,
      parsedBase,
      pathRaw,
      parsedPath,
      value,
      rendered,
      json,
      parsedPath,
      removed,
      validated,
      issue,
      parsedPath,
      validated,
      issue,
      valueLabel;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          if (!allowTextCommands) {
            return [2 /*return*/, null];
          }
          configCommand = (0, config_commands_js_1.parseConfigCommand)(
            params.command.commandBodyNormalized,
          );
          if (!configCommand) {
            return [2 /*return*/, null];
          }
          if (!params.command.isAuthorizedSender) {
            (0, globals_js_1.logVerbose)(
              "Ignoring /config from unauthorized sender: ".concat(
                params.command.senderId || "<unknown>",
              ),
            );
            return [2 /*return*/, { shouldContinue: false }];
          }
          if (
            ((_a = params.cfg.commands) === null || _a === void 0 ? void 0 : _a.config) !== true
          ) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "⚠️ /config is disabled. Set commands.config=true to enable.",
                },
              },
            ];
          }
          if (configCommand.action === "error") {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "\u26A0\uFE0F ".concat(configCommand.message) },
              },
            ];
          }
          if (configCommand.action === "set" || configCommand.action === "unset") {
            channelId =
              (_b = params.command.channelId) !== null && _b !== void 0
                ? _b
                : (0, registry_js_1.normalizeChannelId)(params.command.channel);
            allowWrites = (0, config_writes_js_1.resolveChannelConfigWrites)({
              cfg: params.cfg,
              channelId: channelId,
              accountId: params.ctx.AccountId,
            });
            if (!allowWrites) {
              channelLabel =
                channelId !== null && channelId !== void 0 ? channelId : "this channel";
              hint = channelId
                ? "channels.".concat(channelId, ".configWrites=true")
                : "channels.<channel>.configWrites=true";
              return [
                2 /*return*/,
                {
                  shouldContinue: false,
                  reply: {
                    text: "\u26A0\uFE0F Config writes are disabled for "
                      .concat(channelLabel, ". Set ")
                      .concat(hint, " to enable."),
                  },
                },
              ];
            }
          }
          return [4 /*yield*/, (0, config_js_1.readConfigFileSnapshot)()];
        case 1:
          snapshot = _g.sent();
          if (!snapshot.valid || !snapshot.parsed || typeof snapshot.parsed !== "object") {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "⚠️ Config file is invalid; fix it before using /config.",
                },
              },
            ];
          }
          parsedBase = structuredClone(snapshot.parsed);
          if (configCommand.action === "show") {
            pathRaw = (_c = configCommand.path) === null || _c === void 0 ? void 0 : _c.trim();
            if (pathRaw) {
              parsedPath = (0, config_paths_js_1.parseConfigPath)(pathRaw);
              if (!parsedPath.ok || !parsedPath.path) {
                return [
                  2 /*return*/,
                  {
                    shouldContinue: false,
                    reply: {
                      text: "\u26A0\uFE0F ".concat(
                        (_d = parsedPath.error) !== null && _d !== void 0 ? _d : "Invalid path.",
                      ),
                    },
                  },
                ];
              }
              value = (0, config_paths_js_1.getConfigValueAtPath)(parsedBase, parsedPath.path);
              rendered = JSON.stringify(value !== null && value !== void 0 ? value : null, null, 2);
              return [
                2 /*return*/,
                {
                  shouldContinue: false,
                  reply: {
                    text: "\u2699\uFE0F Config "
                      .concat(pathRaw, ":\n```json\n")
                      .concat(rendered, "\n```"),
                  },
                },
              ];
            }
            json = JSON.stringify(parsedBase, null, 2);
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: { text: "\u2699\uFE0F Config (raw):\n```json\n".concat(json, "\n```") },
              },
            ];
          }
          if (!(configCommand.action === "unset")) {
            return [3 /*break*/, 3];
          }
          parsedPath = (0, config_paths_js_1.parseConfigPath)(configCommand.path);
          if (!parsedPath.ok || !parsedPath.path) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "\u26A0\uFE0F ".concat(
                    (_e = parsedPath.error) !== null && _e !== void 0 ? _e : "Invalid path.",
                  ),
                },
              },
            ];
          }
          removed = (0, config_paths_js_1.unsetConfigValueAtPath)(parsedBase, parsedPath.path);
          if (!removed) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "\u2699\uFE0F No config value found for ".concat(configCommand.path, "."),
                },
              },
            ];
          }
          validated = (0, config_js_1.validateConfigObjectWithPlugins)(parsedBase);
          if (!validated.ok) {
            issue = validated.issues[0];
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "\u26A0\uFE0F Config invalid after unset ("
                    .concat(issue.path, ": ")
                    .concat(issue.message, ")."),
                },
              },
            ];
          }
          return [4 /*yield*/, (0, config_js_1.writeConfigFile)(validated.config)];
        case 2:
          _g.sent();
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: {
                text: "\u2699\uFE0F Config updated: ".concat(configCommand.path, " removed."),
              },
            },
          ];
        case 3:
          if (!(configCommand.action === "set")) {
            return [3 /*break*/, 5];
          }
          parsedPath = (0, config_paths_js_1.parseConfigPath)(configCommand.path);
          if (!parsedPath.ok || !parsedPath.path) {
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "\u26A0\uFE0F ".concat(
                    (_f = parsedPath.error) !== null && _f !== void 0 ? _f : "Invalid path.",
                  ),
                },
              },
            ];
          }
          (0, config_paths_js_1.setConfigValueAtPath)(
            parsedBase,
            parsedPath.path,
            configCommand.value,
          );
          validated = (0, config_js_1.validateConfigObjectWithPlugins)(parsedBase);
          if (!validated.ok) {
            issue = validated.issues[0];
            return [
              2 /*return*/,
              {
                shouldContinue: false,
                reply: {
                  text: "\u26A0\uFE0F Config invalid after set ("
                    .concat(issue.path, ": ")
                    .concat(issue.message, ")."),
                },
              },
            ];
          }
          return [4 /*yield*/, (0, config_js_1.writeConfigFile)(validated.config)];
        case 4:
          _g.sent();
          valueLabel =
            typeof configCommand.value === "string"
              ? '"'.concat(configCommand.value, '"')
              : JSON.stringify(configCommand.value);
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: {
                text: "\u2699\uFE0F Config updated: "
                  .concat(configCommand.path, "=")
                  .concat(valueLabel !== null && valueLabel !== void 0 ? valueLabel : "null"),
              },
            },
          ];
        case 5:
          return [2 /*return*/, null];
      }
    });
  });
};
exports.handleConfigCommand = handleConfigCommand;
var handleDebugCommand = function (params, allowTextCommands) {
  return __awaiter(void 0, void 0, void 0, function () {
    var debugCommand, overrides, hasOverrides, json, result, result, valueLabel;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      if (!allowTextCommands) {
        return [2 /*return*/, null];
      }
      debugCommand = (0, debug_commands_js_1.parseDebugCommand)(
        params.command.commandBodyNormalized,
      );
      if (!debugCommand) {
        return [2 /*return*/, null];
      }
      if (!params.command.isAuthorizedSender) {
        (0, globals_js_1.logVerbose)(
          "Ignoring /debug from unauthorized sender: ".concat(
            params.command.senderId || "<unknown>",
          ),
        );
        return [2 /*return*/, { shouldContinue: false }];
      }
      if (((_a = params.cfg.commands) === null || _a === void 0 ? void 0 : _a.debug) !== true) {
        return [
          2 /*return*/,
          {
            shouldContinue: false,
            reply: {
              text: "⚠️ /debug is disabled. Set commands.debug=true to enable.",
            },
          },
        ];
      }
      if (debugCommand.action === "error") {
        return [
          2 /*return*/,
          {
            shouldContinue: false,
            reply: { text: "\u26A0\uFE0F ".concat(debugCommand.message) },
          },
        ];
      }
      if (debugCommand.action === "show") {
        overrides = (0, runtime_overrides_js_1.getConfigOverrides)();
        hasOverrides = Object.keys(overrides).length > 0;
        if (!hasOverrides) {
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: { text: "⚙️ Debug overrides: (none)" },
            },
          ];
        }
        json = JSON.stringify(overrides, null, 2);
        return [
          2 /*return*/,
          {
            shouldContinue: false,
            reply: {
              text: "\u2699\uFE0F Debug overrides (memory-only):\n```json\n".concat(json, "\n```"),
            },
          },
        ];
      }
      if (debugCommand.action === "reset") {
        (0, runtime_overrides_js_1.resetConfigOverrides)();
        return [
          2 /*return*/,
          {
            shouldContinue: false,
            reply: { text: "⚙️ Debug overrides cleared; using config on disk." },
          },
        ];
      }
      if (debugCommand.action === "unset") {
        result = (0, runtime_overrides_js_1.unsetConfigOverride)(debugCommand.path);
        if (!result.ok) {
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: {
                text: "\u26A0\uFE0F ".concat(
                  (_b = result.error) !== null && _b !== void 0 ? _b : "Invalid path.",
                ),
              },
            },
          ];
        }
        if (!result.removed) {
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: {
                text: "\u2699\uFE0F No debug override found for ".concat(debugCommand.path, "."),
              },
            },
          ];
        }
        return [
          2 /*return*/,
          {
            shouldContinue: false,
            reply: {
              text: "\u2699\uFE0F Debug override removed for ".concat(debugCommand.path, "."),
            },
          },
        ];
      }
      if (debugCommand.action === "set") {
        result = (0, runtime_overrides_js_1.setConfigOverride)(
          debugCommand.path,
          debugCommand.value,
        );
        if (!result.ok) {
          return [
            2 /*return*/,
            {
              shouldContinue: false,
              reply: {
                text: "\u26A0\uFE0F ".concat(
                  (_c = result.error) !== null && _c !== void 0 ? _c : "Invalid override.",
                ),
              },
            },
          ];
        }
        valueLabel =
          typeof debugCommand.value === "string"
            ? '"'.concat(debugCommand.value, '"')
            : JSON.stringify(debugCommand.value);
        return [
          2 /*return*/,
          {
            shouldContinue: false,
            reply: {
              text: "\u2699\uFE0F Debug override set: "
                .concat(debugCommand.path, "=")
                .concat(valueLabel !== null && valueLabel !== void 0 ? valueLabel : "null"),
            },
          },
        ];
      }
      return [2 /*return*/, null];
    });
  });
};
exports.handleDebugCommand = handleDebugCommand;
