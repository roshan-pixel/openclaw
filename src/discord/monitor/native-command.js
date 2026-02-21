"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          }
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null) {
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      }
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
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
exports.createDiscordCommandArgFallbackButton = createDiscordCommandArgFallbackButton;
exports.createDiscordNativeCommand = createDiscordNativeCommand;
var carbon_1 = require("@buape/carbon");
var v10_1 = require("discord-api-types/v10");
var identity_js_1 = require("../../agents/identity.js");
var chunk_js_1 = require("../../auto-reply/chunk.js");
var commands_registry_js_1 = require("../../auto-reply/commands-registry.js");
var provider_dispatcher_js_1 = require("../../auto-reply/reply/provider-dispatcher.js");
var inbound_context_js_1 = require("../../auto-reply/reply/inbound-context.js");
var pairing_messages_js_1 = require("../../pairing/pairing-messages.js");
var pairing_store_js_1 = require("../../pairing/pairing-store.js");
var resolve_route_js_1 = require("../../routing/resolve-route.js");
var media_js_1 = require("../../web/media.js");
var chunk_js_2 = require("../chunk.js");
var command_gating_js_1 = require("../../channels/command-gating.js");
var allow_list_js_1 = require("./allow-list.js");
var format_js_1 = require("./format.js");
var message_utils_js_1 = require("./message-utils.js");
var threading_js_1 = require("./threading.js");
function buildDiscordCommandOptions(params) {
  var _this = this;
  var command = params.command,
    cfg = params.cfg;
  var args = command.args;
  if (!args || args.length === 0) {
    return undefined;
  }
  return args.map(function (arg) {
    var _a;
    var required = (_a = arg.required) !== null && _a !== void 0 ? _a : false;
    if (arg.type === "number") {
      return {
        name: arg.name,
        description: arg.description,
        type: v10_1.ApplicationCommandOptionType.Number,
        required: required,
      };
    }
    if (arg.type === "boolean") {
      return {
        name: arg.name,
        description: arg.description,
        type: v10_1.ApplicationCommandOptionType.Boolean,
        required: required,
      };
    }
    var resolvedChoices = (0, commands_registry_js_1.resolveCommandArgChoices)({
      command: command,
      arg: arg,
      cfg: cfg,
    });
    var shouldAutocomplete =
      resolvedChoices.length > 0 &&
      (typeof arg.choices === "function" || resolvedChoices.length > 25);
    var autocomplete = shouldAutocomplete
      ? function (interaction) {
          return __awaiter(_this, void 0, void 0, function () {
            var focused, focusValue, choices, filtered;
            return __generator(this, function (_a) {
              switch (_a.label) {
                case 0:
                  focused = interaction.options.getFocused();
                  focusValue =
                    typeof (focused === null || focused === void 0 ? void 0 : focused.value) ===
                    "string"
                      ? focused.value.trim().toLowerCase()
                      : "";
                  choices = (0, commands_registry_js_1.resolveCommandArgChoices)({
                    command: command,
                    arg: arg,
                    cfg: cfg,
                  });
                  filtered = focusValue
                    ? choices.filter(function (choice) {
                        return choice.label.toLowerCase().includes(focusValue);
                      })
                    : choices;
                  return [
                    4 /*yield*/,
                    interaction.respond(
                      filtered.slice(0, 25).map(function (choice) {
                        return { name: choice.label, value: choice.value };
                      }),
                    ),
                  ];
                case 1:
                  _a.sent();
                  return [2 /*return*/];
              }
            });
          });
        }
      : undefined;
    var choices =
      resolvedChoices.length > 0 && !autocomplete
        ? resolvedChoices.slice(0, 25).map(function (choice) {
            return { name: choice.label, value: choice.value };
          })
        : undefined;
    return {
      name: arg.name,
      description: arg.description,
      type: v10_1.ApplicationCommandOptionType.String,
      required: required,
      choices: choices,
      autocomplete: autocomplete,
    };
  });
}
function readDiscordCommandArgs(interaction, definitions) {
  var _a, _b, _c;
  if (!definitions || definitions.length === 0) {
    return undefined;
  }
  var values = {};
  for (var _i = 0, definitions_1 = definitions; _i < definitions_1.length; _i++) {
    var definition = definitions_1[_i];
    var value = void 0;
    if (definition.type === "number") {
      value =
        (_a = interaction.options.getNumber(definition.name)) !== null && _a !== void 0 ? _a : null;
    } else if (definition.type === "boolean") {
      value =
        (_b = interaction.options.getBoolean(definition.name)) !== null && _b !== void 0
          ? _b
          : null;
    } else {
      value =
        (_c = interaction.options.getString(definition.name)) !== null && _c !== void 0 ? _c : null;
    }
    if (value != null) {
      values[definition.name] = value;
    }
  }
  return Object.keys(values).length > 0 ? { values: values } : undefined;
}
function chunkItems(items, size) {
  if (size <= 0) {
    return [items];
  }
  var rows = [];
  for (var i = 0; i < items.length; i += size) {
    rows.push(items.slice(i, i + size));
  }
  return rows;
}
var DISCORD_COMMAND_ARG_CUSTOM_ID_KEY = "cmdarg";
function createCommandArgsWithValue(params) {
  var _a;
  var values = ((_a = {}), (_a[params.argName] = params.value), _a);
  return { values: values };
}
function encodeDiscordCommandArgValue(value) {
  return encodeURIComponent(value);
}
function decodeDiscordCommandArgValue(value) {
  try {
    return decodeURIComponent(value);
  } catch (_a) {
    return value;
  }
}
function isDiscordUnknownInteraction(error) {
  var _a, _b, _c, _d;
  if (!error || typeof error !== "object") {
    return false;
  }
  var err = error;
  if (
    err.discordCode === 10062 ||
    ((_a = err.rawBody) === null || _a === void 0 ? void 0 : _a.code) === 10062
  ) {
    return true;
  }
  if (
    err.status === 404 &&
    /Unknown interaction/i.test((_b = err.message) !== null && _b !== void 0 ? _b : "")
  ) {
    return true;
  }
  if (
    /Unknown interaction/i.test(
      (_d = (_c = err.rawBody) === null || _c === void 0 ? void 0 : _c.message) !== null &&
        _d !== void 0
        ? _d
        : "",
    )
  ) {
    return true;
  }
  return false;
}
function safeDiscordInteractionCall(label, fn) {
  return __awaiter(this, void 0, void 0, function () {
    var error_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          _a.trys.push([0, 2, , 3]);
          return [4 /*yield*/, fn()];
        case 1:
          return [2 /*return*/, _a.sent()];
        case 2:
          error_1 = _a.sent();
          if (isDiscordUnknownInteraction(error_1)) {
            console.warn("discord: ".concat(label, " skipped (interaction expired)"));
            return [2 /*return*/, null];
          }
          throw error_1;
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function buildDiscordCommandArgCustomId(params) {
  return [
    ""
      .concat(DISCORD_COMMAND_ARG_CUSTOM_ID_KEY, ":command=")
      .concat(encodeDiscordCommandArgValue(params.command)),
    "arg=".concat(encodeDiscordCommandArgValue(params.arg)),
    "value=".concat(encodeDiscordCommandArgValue(params.value)),
    "user=".concat(encodeDiscordCommandArgValue(params.userId)),
  ].join(";");
}
function parseDiscordCommandArgData(data) {
  if (!data || typeof data !== "object") {
    return null;
  }
  var coerce = function (value) {
    return typeof value === "string" || typeof value === "number" ? String(value) : "";
  };
  var rawCommand = coerce(data.command);
  var rawArg = coerce(data.arg);
  var rawValue = coerce(data.value);
  var rawUser = coerce(data.user);
  if (!rawCommand || !rawArg || !rawValue || !rawUser) {
    return null;
  }
  return {
    command: decodeDiscordCommandArgValue(rawCommand),
    arg: decodeDiscordCommandArgValue(rawArg),
    value: decodeDiscordCommandArgValue(rawValue),
    userId: decodeDiscordCommandArgValue(rawUser),
  };
}
function handleDiscordCommandArgInteraction(interaction, data, ctx) {
  return __awaiter(this, void 0, void 0, function () {
    var parsed, commandDefinition, updated, commandArgs, commandArgsWithRaw, prompt;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          parsed = parseDiscordCommandArgData(data);
          if (!!parsed) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            safeDiscordInteractionCall("command arg update", function () {
              return interaction.update({
                content: "Sorry, that selection is no longer available.",
                components: [],
              });
            }),
          ];
        case 1:
          _c.sent();
          return [2 /*return*/];
        case 2:
          if (
            !(
              ((_a = interaction.user) === null || _a === void 0 ? void 0 : _a.id) &&
              interaction.user.id !== parsed.userId
            )
          ) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            safeDiscordInteractionCall("command arg ack", function () {
              return interaction.acknowledge();
            }),
          ];
        case 3:
          _c.sent();
          return [2 /*return*/];
        case 4:
          commandDefinition =
            (_b = (0, commands_registry_js_1.findCommandByNativeName)(
              parsed.command,
              "discord",
            )) !== null && _b !== void 0
              ? _b
              : (0, commands_registry_js_1.listChatCommands)().find(function (entry) {
                  return entry.key === parsed.command;
                });
          if (!!commandDefinition) {
            return [3 /*break*/, 6];
          }
          return [
            4 /*yield*/,
            safeDiscordInteractionCall("command arg update", function () {
              return interaction.update({
                content: "Sorry, that command is no longer available.",
                components: [],
              });
            }),
          ];
        case 5:
          _c.sent();
          return [2 /*return*/];
        case 6:
          return [
            4 /*yield*/,
            safeDiscordInteractionCall("command arg update", function () {
              return interaction.update({
                content: "\u2705 Selected ".concat(parsed.value, "."),
                components: [],
              });
            }),
          ];
        case 7:
          updated = _c.sent();
          if (!updated) {
            return [2 /*return*/];
          }
          commandArgs = createCommandArgsWithValue({
            argName: parsed.arg,
            value: parsed.value,
          });
          commandArgsWithRaw = __assign(__assign({}, commandArgs), {
            raw: (0, commands_registry_js_1.serializeCommandArgs)(commandDefinition, commandArgs),
          });
          prompt = (0, commands_registry_js_1.buildCommandTextFromArgs)(
            commandDefinition,
            commandArgsWithRaw,
          );
          return [
            4 /*yield*/,
            dispatchDiscordCommandInteraction({
              interaction: interaction,
              prompt: prompt,
              command: commandDefinition,
              commandArgs: commandArgsWithRaw,
              cfg: ctx.cfg,
              discordConfig: ctx.discordConfig,
              accountId: ctx.accountId,
              sessionPrefix: ctx.sessionPrefix,
              preferFollowUp: true,
            }),
          ];
        case 8:
          _c.sent();
          return [2 /*return*/];
      }
    });
  });
}
var DiscordCommandArgButton = /** @class */ (function (_super) {
  __extends(DiscordCommandArgButton, _super);
  function DiscordCommandArgButton(params) {
    var _this = _super.call(this) || this;
    _this.style = v10_1.ButtonStyle.Secondary;
    _this.label = params.label;
    _this.customId = params.customId;
    _this.cfg = params.cfg;
    _this.discordConfig = params.discordConfig;
    _this.accountId = params.accountId;
    _this.sessionPrefix = params.sessionPrefix;
    return _this;
  }
  DiscordCommandArgButton.prototype.run = function (interaction, data) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [
              4 /*yield*/,
              handleDiscordCommandArgInteraction(interaction, data, {
                cfg: this.cfg,
                discordConfig: this.discordConfig,
                accountId: this.accountId,
                sessionPrefix: this.sessionPrefix,
              }),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  return DiscordCommandArgButton;
})(carbon_1.Button);
var DiscordCommandArgFallbackButton = /** @class */ (function (_super) {
  __extends(DiscordCommandArgFallbackButton, _super);
  function DiscordCommandArgFallbackButton(ctx) {
    var _this = _super.call(this) || this;
    _this.label = "cmdarg";
    _this.customId = "cmdarg:seed=1";
    _this.ctx = ctx;
    return _this;
  }
  DiscordCommandArgFallbackButton.prototype.run = function (interaction, data) {
    return __awaiter(this, void 0, void 0, function () {
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            return [4 /*yield*/, handleDiscordCommandArgInteraction(interaction, data, this.ctx)];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  return DiscordCommandArgFallbackButton;
})(carbon_1.Button);
function createDiscordCommandArgFallbackButton(params) {
  return new DiscordCommandArgFallbackButton(params);
}
function buildDiscordCommandArgMenu(params) {
  var _a, _b, _c, _d;
  var command = params.command,
    menu = params.menu,
    interaction = params.interaction;
  var commandLabel = (_a = command.nativeName) !== null && _a !== void 0 ? _a : command.key;
  var userId =
    (_c = (_b = interaction.user) === null || _b === void 0 ? void 0 : _b.id) !== null &&
    _c !== void 0
      ? _c
      : "";
  var rows = chunkItems(menu.choices, 4).map(function (choices) {
    var buttons = choices.map(function (choice) {
      return new DiscordCommandArgButton({
        label: choice.label,
        customId: buildDiscordCommandArgCustomId({
          command: commandLabel,
          arg: menu.arg.name,
          value: choice.value,
          userId: userId,
        }),
        cfg: params.cfg,
        discordConfig: params.discordConfig,
        accountId: params.accountId,
        sessionPrefix: params.sessionPrefix,
      });
    });
    return new carbon_1.Row(buttons);
  });
  var content =
    (_d = menu.title) !== null && _d !== void 0
      ? _d
      : "Choose ".concat(menu.arg.description || menu.arg.name, " for /").concat(commandLabel, ".");
  return { content: content, components: rows };
}
function createDiscordNativeCommand(params) {
  var _a, _b;
  var command = params.command,
    cfg = params.cfg,
    discordConfig = params.discordConfig,
    accountId = params.accountId,
    sessionPrefix = params.sessionPrefix,
    ephemeralDefault = params.ephemeralDefault;
  var commandDefinition =
    (_a = (0, commands_registry_js_1.findCommandByNativeName)(command.name, "discord")) !== null &&
    _a !== void 0
      ? _a
      : {
          key: command.name,
          nativeName: command.name,
          description: command.description,
          textAliases: [],
          acceptsArgs: command.acceptsArgs,
          args: command.args,
          argsParsing: "none",
          scope: "native",
        };
  var argDefinitions = (_b = commandDefinition.args) !== null && _b !== void 0 ? _b : command.args;
  var commandOptions = buildDiscordCommandOptions({
    command: commandDefinition,
    cfg: cfg,
  });
  var options = commandOptions
    ? commandOptions
    : command.acceptsArgs
      ? [
          {
            name: "input",
            description: "Command input",
            type: v10_1.ApplicationCommandOptionType.String,
            required: false,
          },
        ]
      : undefined;
  return new /** @class */ ((function (_super) {
    __extends(class_1, _super);
    function class_1() {
      var _this = (_super !== null && _super.apply(this, arguments)) || this;
      _this.name = command.name;
      _this.description = command.description;
      _this.defer = true;
      _this.ephemeral = ephemeralDefault;
      _this.options = options;
      return _this;
    }
    class_1.prototype.run = function (interaction) {
      return __awaiter(this, void 0, void 0, function () {
        var commandArgs, commandArgsWithRaw, prompt;
        var _a, _b;
        return __generator(this, function (_c) {
          switch (_c.label) {
            case 0:
              commandArgs = (
                argDefinitions === null || argDefinitions === void 0
                  ? void 0
                  : argDefinitions.length
              )
                ? readDiscordCommandArgs(interaction, argDefinitions)
                : command.acceptsArgs
                  ? (0, commands_registry_js_1.parseCommandArgs)(
                      commandDefinition,
                      (_a = interaction.options.getString("input")) !== null && _a !== void 0
                        ? _a
                        : "",
                    )
                  : undefined;
              commandArgsWithRaw = commandArgs
                ? __assign(__assign({}, commandArgs), {
                    raw:
                      (_b = (0, commands_registry_js_1.serializeCommandArgs)(
                        commandDefinition,
                        commandArgs,
                      )) !== null && _b !== void 0
                        ? _b
                        : commandArgs.raw,
                  })
                : undefined;
              prompt = (0, commands_registry_js_1.buildCommandTextFromArgs)(
                commandDefinition,
                commandArgsWithRaw,
              );
              return [
                4 /*yield*/,
                dispatchDiscordCommandInteraction({
                  interaction: interaction,
                  prompt: prompt,
                  command: commandDefinition,
                  commandArgs: commandArgsWithRaw,
                  cfg: cfg,
                  discordConfig: discordConfig,
                  accountId: accountId,
                  sessionPrefix: sessionPrefix,
                  preferFollowUp: false,
                }),
              ];
            case 1:
              _c.sent();
              return [2 /*return*/];
          }
        });
      });
    };
    return class_1;
  })(carbon_1.Command))();
}
function dispatchDiscordCommandInteraction(params) {
  return __awaiter(this, void 0, void 0, function () {
    var interaction,
      prompt,
      command,
      commandArgs,
      cfg,
      discordConfig,
      accountId,
      sessionPrefix,
      preferFollowUp,
      respond,
      useAccessGroups,
      user,
      channel,
      channelType,
      isDirectMessage,
      isGroupDm,
      isThreadChannel,
      channelName,
      channelSlug,
      rawChannelId,
      ownerAllowList,
      ownerOk,
      guildInfo,
      threadParentId,
      threadParentName,
      threadParentSlug,
      channelInfo,
      parentInfo,
      channelConfig,
      channelAllowlistConfigured,
      channelAllowed,
      allowByPolicy,
      dmEnabled,
      dmPolicy,
      commandAuthorized,
      storeAllowFrom,
      effectiveAllowFrom,
      allowList,
      permitted,
      _a,
      code,
      created,
      channelUsers,
      hasUserAllowlist,
      userOk,
      authorizers,
      menu,
      menuPayload_1,
      isGuild,
      channelId,
      interactionId,
      route,
      conversationLabel,
      ctxPayload,
      didReply;
    var _this = this;
    var _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u, _v, _w, _x, _y;
    return __generator(this, function (_z) {
      switch (_z.label) {
        case 0:
          ((interaction = params.interaction),
            (prompt = params.prompt),
            (command = params.command),
            (commandArgs = params.commandArgs),
            (cfg = params.cfg),
            (discordConfig = params.discordConfig),
            (accountId = params.accountId),
            (sessionPrefix = params.sessionPrefix),
            (preferFollowUp = params.preferFollowUp));
          respond = function (content, options) {
            return __awaiter(_this, void 0, void 0, function () {
              var payload;
              var _this = this;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    payload = __assign(
                      { content: content },
                      (options === null || options === void 0 ? void 0 : options.ephemeral) !==
                        undefined
                        ? { ephemeral: options.ephemeral }
                        : {},
                    );
                    return [
                      4 /*yield*/,
                      safeDiscordInteractionCall("interaction reply", function () {
                        return __awaiter(_this, void 0, void 0, function () {
                          return __generator(this, function (_a) {
                            switch (_a.label) {
                              case 0:
                                if (!preferFollowUp) {
                                  return [3 /*break*/, 2];
                                }
                                return [4 /*yield*/, interaction.followUp(payload)];
                              case 1:
                                _a.sent();
                                return [2 /*return*/];
                              case 2:
                                return [4 /*yield*/, interaction.reply(payload)];
                              case 3:
                                _a.sent();
                                return [2 /*return*/];
                            }
                          });
                        });
                      }),
                    ];
                  case 1:
                    _a.sent();
                    return [2 /*return*/];
                }
              });
            });
          };
          useAccessGroups =
            ((_b = cfg.commands) === null || _b === void 0 ? void 0 : _b.useAccessGroups) !== false;
          user = interaction.user;
          if (!user) {
            return [2 /*return*/];
          }
          channel = interaction.channel;
          channelType = channel === null || channel === void 0 ? void 0 : channel.type;
          isDirectMessage = channelType === carbon_1.ChannelType.DM;
          isGroupDm = channelType === carbon_1.ChannelType.GroupDM;
          isThreadChannel =
            channelType === carbon_1.ChannelType.PublicThread ||
            channelType === carbon_1.ChannelType.PrivateThread ||
            channelType === carbon_1.ChannelType.AnnouncementThread;
          channelName = channel && "name" in channel ? channel.name : undefined;
          channelSlug = channelName ? (0, allow_list_js_1.normalizeDiscordSlug)(channelName) : "";
          rawChannelId =
            (_c = channel === null || channel === void 0 ? void 0 : channel.id) !== null &&
            _c !== void 0
              ? _c
              : "";
          ownerAllowList = (0, allow_list_js_1.normalizeDiscordAllowList)(
            (_e =
              (_d =
                discordConfig === null || discordConfig === void 0 ? void 0 : discordConfig.dm) ===
                null || _d === void 0
                ? void 0
                : _d.allowFrom) !== null && _e !== void 0
              ? _e
              : [],
            ["discord:", "user:"],
          );
          ownerOk =
            ownerAllowList && user
              ? (0, allow_list_js_1.allowListMatches)(ownerAllowList, {
                  id: user.id,
                  name: user.username,
                  tag: (0, format_js_1.formatDiscordUserTag)(user),
                })
              : false;
          guildInfo = (0, allow_list_js_1.resolveDiscordGuildEntry)({
            guild: (_f = interaction.guild) !== null && _f !== void 0 ? _f : undefined,
            guildEntries:
              discordConfig === null || discordConfig === void 0 ? void 0 : discordConfig.guilds,
          });
          threadParentSlug = "";
          if (!(interaction.guild && channel && isThreadChannel && rawChannelId)) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            (0, message_utils_js_1.resolveDiscordChannelInfo)(interaction.client, rawChannelId),
          ];
        case 1:
          channelInfo = _z.sent();
          return [
            4 /*yield*/,
            (0, threading_js_1.resolveDiscordThreadParentInfo)({
              client: interaction.client,
              threadChannel: {
                id: rawChannelId,
                name: channelName,
                parentId:
                  "parentId" in channel
                    ? (_g = channel.parentId) !== null && _g !== void 0
                      ? _g
                      : undefined
                    : undefined,
                parent: undefined,
              },
              channelInfo: channelInfo,
            }),
          ];
        case 2:
          parentInfo = _z.sent();
          threadParentId = parentInfo.id;
          threadParentName = parentInfo.name;
          threadParentSlug = threadParentName
            ? (0, allow_list_js_1.normalizeDiscordSlug)(threadParentName)
            : "";
          _z.label = 3;
        case 3:
          channelConfig = interaction.guild
            ? (0, allow_list_js_1.resolveDiscordChannelConfigWithFallback)({
                guildInfo: guildInfo,
                channelId: rawChannelId,
                channelName: channelName,
                channelSlug: channelSlug,
                parentId: threadParentId,
                parentName: threadParentName,
                parentSlug: threadParentSlug,
                scope: isThreadChannel ? "thread" : "channel",
              })
            : null;
          if (
            !(
              (channelConfig === null || channelConfig === void 0
                ? void 0
                : channelConfig.enabled) === false
            )
          ) {
            return [3 /*break*/, 5];
          }
          return [4 /*yield*/, respond("This channel is disabled.")];
        case 4:
          _z.sent();
          return [2 /*return*/];
        case 5:
          if (
            !(
              interaction.guild &&
              (channelConfig === null || channelConfig === void 0
                ? void 0
                : channelConfig.allowed) === false
            )
          ) {
            return [3 /*break*/, 7];
          }
          return [4 /*yield*/, respond("This channel is not allowed.")];
        case 6:
          _z.sent();
          return [2 /*return*/];
        case 7:
          if (!(useAccessGroups && interaction.guild)) {
            return [3 /*break*/, 9];
          }
          channelAllowlistConfigured =
            Boolean(guildInfo === null || guildInfo === void 0 ? void 0 : guildInfo.channels) &&
            Object.keys(
              (_h = guildInfo === null || guildInfo === void 0 ? void 0 : guildInfo.channels) !==
                null && _h !== void 0
                ? _h
                : {},
            ).length > 0;
          channelAllowed =
            (channelConfig === null || channelConfig === void 0
              ? void 0
              : channelConfig.allowed) !== false;
          allowByPolicy = (0, allow_list_js_1.isDiscordGroupAllowedByPolicy)({
            groupPolicy:
              (_j =
                discordConfig === null || discordConfig === void 0
                  ? void 0
                  : discordConfig.groupPolicy) !== null && _j !== void 0
                ? _j
                : "open",
            guildAllowlisted: Boolean(guildInfo),
            channelAllowlistConfigured: channelAllowlistConfigured,
            channelAllowed: channelAllowed,
          });
          if (!!allowByPolicy) {
            return [3 /*break*/, 9];
          }
          return [4 /*yield*/, respond("This channel is not allowed.")];
        case 8:
          _z.sent();
          return [2 /*return*/];
        case 9:
          dmEnabled =
            (_l =
              (_k =
                discordConfig === null || discordConfig === void 0 ? void 0 : discordConfig.dm) ===
                null || _k === void 0
                ? void 0
                : _k.enabled) !== null && _l !== void 0
              ? _l
              : true;
          dmPolicy =
            (_o =
              (_m =
                discordConfig === null || discordConfig === void 0 ? void 0 : discordConfig.dm) ===
                null || _m === void 0
                ? void 0
                : _m.policy) !== null && _o !== void 0
              ? _o
              : "pairing";
          commandAuthorized = true;
          if (!isDirectMessage) {
            return [3 /*break*/, 20];
          }
          if (!(!dmEnabled || dmPolicy === "disabled")) {
            return [3 /*break*/, 11];
          }
          return [4 /*yield*/, respond("Discord DMs are disabled.")];
        case 10:
          _z.sent();
          return [2 /*return*/];
        case 11:
          if (!(dmPolicy !== "open")) {
            return [3 /*break*/, 20];
          }
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.readChannelAllowFromStore)("discord").catch(function () {
              return [];
            }),
          ];
        case 12:
          storeAllowFrom = _z.sent();
          effectiveAllowFrom = __spreadArray(
            __spreadArray(
              [],
              (_q =
                (_p =
                  discordConfig === null || discordConfig === void 0
                    ? void 0
                    : discordConfig.dm) === null || _p === void 0
                  ? void 0
                  : _p.allowFrom) !== null && _q !== void 0
                ? _q
                : [],
              true,
            ),
            storeAllowFrom,
            true,
          );
          allowList = (0, allow_list_js_1.normalizeDiscordAllowList)(effectiveAllowFrom, [
            "discord:",
            "user:",
          ]);
          permitted = allowList
            ? (0, allow_list_js_1.allowListMatches)(allowList, {
                id: user.id,
                name: user.username,
                tag: (0, format_js_1.formatDiscordUserTag)(user),
              })
            : false;
          if (!!permitted) {
            return [3 /*break*/, 19];
          }
          commandAuthorized = false;
          if (!(dmPolicy === "pairing")) {
            return [3 /*break*/, 16];
          }
          return [
            4 /*yield*/,
            (0, pairing_store_js_1.upsertChannelPairingRequest)({
              channel: "discord",
              id: user.id,
              meta: {
                tag: (0, format_js_1.formatDiscordUserTag)(user),
                name: (_r = user.username) !== null && _r !== void 0 ? _r : undefined,
              },
            }),
          ];
        case 13:
          ((_a = _z.sent()), (code = _a.code), (created = _a.created));
          if (!created) {
            return [3 /*break*/, 15];
          }
          return [
            4 /*yield*/,
            respond(
              (0, pairing_messages_js_1.buildPairingReply)({
                channel: "discord",
                idLine: "Your Discord user id: ".concat(user.id),
                code: code,
              }),
              { ephemeral: true },
            ),
          ];
        case 14:
          _z.sent();
          _z.label = 15;
        case 15:
          return [3 /*break*/, 18];
        case 16:
          return [
            4 /*yield*/,
            respond("You are not authorized to use this command.", { ephemeral: true }),
          ];
        case 17:
          _z.sent();
          _z.label = 18;
        case 18:
          return [2 /*return*/];
        case 19:
          commandAuthorized = true;
          _z.label = 20;
        case 20:
          if (!!isDirectMessage) {
            return [3 /*break*/, 22];
          }
          channelUsers =
            (_s =
              channelConfig === null || channelConfig === void 0 ? void 0 : channelConfig.users) !==
              null && _s !== void 0
              ? _s
              : guildInfo === null || guildInfo === void 0
                ? void 0
                : guildInfo.users;
          hasUserAllowlist = Array.isArray(channelUsers) && channelUsers.length > 0;
          userOk = hasUserAllowlist
            ? (0, allow_list_js_1.resolveDiscordUserAllowed)({
                allowList: channelUsers,
                userId: user.id,
                userName: user.username,
                userTag: (0, format_js_1.formatDiscordUserTag)(user),
              })
            : false;
          authorizers = useAccessGroups
            ? [
                { configured: ownerAllowList != null, allowed: ownerOk },
                { configured: hasUserAllowlist, allowed: userOk },
              ]
            : [{ configured: hasUserAllowlist, allowed: userOk }];
          commandAuthorized = (0, command_gating_js_1.resolveCommandAuthorizedFromAuthorizers)({
            useAccessGroups: useAccessGroups,
            authorizers: authorizers,
            modeWhenAccessGroupsOff: "configured",
          });
          if (!!commandAuthorized) {
            return [3 /*break*/, 22];
          }
          return [
            4 /*yield*/,
            respond("You are not authorized to use this command.", { ephemeral: true }),
          ];
        case 21:
          _z.sent();
          return [2 /*return*/];
        case 22:
          if (
            !(
              isGroupDm &&
              ((_t =
                discordConfig === null || discordConfig === void 0 ? void 0 : discordConfig.dm) ===
                null || _t === void 0
                ? void 0
                : _t.groupEnabled) === false
            )
          ) {
            return [3 /*break*/, 24];
          }
          return [4 /*yield*/, respond("Discord group DMs are disabled.")];
        case 23:
          _z.sent();
          return [2 /*return*/];
        case 24:
          menu = (0, commands_registry_js_1.resolveCommandArgMenu)({
            command: command,
            args: commandArgs,
            cfg: cfg,
          });
          if (!menu) {
            return [3 /*break*/, 28];
          }
          menuPayload_1 = buildDiscordCommandArgMenu({
            command: command,
            menu: menu,
            interaction: interaction,
            cfg: cfg,
            discordConfig: discordConfig,
            accountId: accountId,
            sessionPrefix: sessionPrefix,
          });
          if (!preferFollowUp) {
            return [3 /*break*/, 26];
          }
          return [
            4 /*yield*/,
            safeDiscordInteractionCall("interaction follow-up", function () {
              return interaction.followUp({
                content: menuPayload_1.content,
                components: menuPayload_1.components,
                ephemeral: true,
              });
            }),
          ];
        case 25:
          _z.sent();
          return [2 /*return*/];
        case 26:
          return [
            4 /*yield*/,
            safeDiscordInteractionCall("interaction reply", function () {
              return interaction.reply({
                content: menuPayload_1.content,
                components: menuPayload_1.components,
                ephemeral: true,
              });
            }),
          ];
        case 27:
          _z.sent();
          return [2 /*return*/];
        case 28:
          isGuild = Boolean(interaction.guild);
          channelId = rawChannelId || "unknown";
          interactionId = interaction.rawData.id;
          route = (0, resolve_route_js_1.resolveAgentRoute)({
            cfg: cfg,
            channel: "discord",
            accountId: accountId,
            guildId:
              (_v = (_u = interaction.guild) === null || _u === void 0 ? void 0 : _u.id) !== null &&
              _v !== void 0
                ? _v
                : undefined,
            peer: {
              kind: isDirectMessage ? "dm" : isGroupDm ? "group" : "channel",
              id: isDirectMessage ? user.id : channelId,
            },
          });
          conversationLabel = isDirectMessage
            ? (_w = user.globalName) !== null && _w !== void 0
              ? _w
              : user.username
            : channelId;
          ctxPayload = (0, inbound_context_js_1.finalizeInboundContext)({
            Body: prompt,
            RawBody: prompt,
            CommandBody: prompt,
            CommandArgs: commandArgs,
            From: isDirectMessage
              ? "discord:".concat(user.id)
              : isGroupDm
                ? "discord:group:".concat(channelId)
                : "discord:channel:".concat(channelId),
            To: "slash:".concat(user.id),
            SessionKey: "agent:"
              .concat(route.agentId, ":")
              .concat(sessionPrefix, ":")
              .concat(user.id),
            CommandTargetSessionKey: route.sessionKey,
            AccountId: route.accountId,
            ChatType: isDirectMessage ? "direct" : isGroupDm ? "group" : "channel",
            ConversationLabel: conversationLabel,
            GroupSubject: isGuild
              ? (_x = interaction.guild) === null || _x === void 0
                ? void 0
                : _x.name
              : undefined,
            GroupSystemPrompt: isGuild
              ? (function () {
                  var _a, _b;
                  var channelTopic =
                    channel && "topic" in channel
                      ? (_a = channel.topic) !== null && _a !== void 0
                        ? _a
                        : undefined
                      : undefined;
                  var channelDescription =
                    channelTopic === null || channelTopic === void 0 ? void 0 : channelTopic.trim();
                  var systemPromptParts = [
                    channelDescription ? "Channel topic: ".concat(channelDescription) : null,
                    ((_b =
                      channelConfig === null || channelConfig === void 0
                        ? void 0
                        : channelConfig.systemPrompt) === null || _b === void 0
                      ? void 0
                      : _b.trim()) || null,
                  ].filter(function (entry) {
                    return Boolean(entry);
                  });
                  return systemPromptParts.length > 0 ? systemPromptParts.join("\n\n") : undefined;
                })()
              : undefined,
            SenderName: (_y = user.globalName) !== null && _y !== void 0 ? _y : user.username,
            SenderId: user.id,
            SenderUsername: user.username,
            SenderTag: (0, format_js_1.formatDiscordUserTag)(user),
            Provider: "discord",
            Surface: "discord",
            WasMentioned: true,
            MessageSid: interactionId,
            Timestamp: Date.now(),
            CommandAuthorized: commandAuthorized,
            CommandSource: "native",
          });
          didReply = false;
          return [
            4 /*yield*/,
            (0, provider_dispatcher_js_1.dispatchReplyWithDispatcher)({
              ctx: ctxPayload,
              cfg: cfg,
              dispatcherOptions: {
                responsePrefix: (0, identity_js_1.resolveEffectiveMessagesConfig)(
                  cfg,
                  route.agentId,
                ).responsePrefix,
                humanDelay: (0, identity_js_1.resolveHumanDelayConfig)(cfg, route.agentId),
                deliver: function (payload) {
                  return __awaiter(_this, void 0, void 0, function () {
                    var error_2;
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          _a.trys.push([0, 2, , 3]);
                          return [
                            4 /*yield*/,
                            deliverDiscordInteractionReply({
                              interaction: interaction,
                              payload: payload,
                              textLimit: (0, chunk_js_1.resolveTextChunkLimit)(
                                cfg,
                                "discord",
                                accountId,
                                {
                                  fallbackLimit: 2000,
                                },
                              ),
                              maxLinesPerMessage:
                                discordConfig === null || discordConfig === void 0
                                  ? void 0
                                  : discordConfig.maxLinesPerMessage,
                              preferFollowUp: preferFollowUp || didReply,
                              chunkMode: (0, chunk_js_1.resolveChunkMode)(
                                cfg,
                                "discord",
                                accountId,
                              ),
                            }),
                          ];
                        case 1:
                          _a.sent();
                          return [3 /*break*/, 3];
                        case 2:
                          error_2 = _a.sent();
                          if (isDiscordUnknownInteraction(error_2)) {
                            console.warn(
                              "discord: interaction reply skipped (interaction expired)",
                            );
                            return [2 /*return*/];
                          }
                          throw error_2;
                        case 3:
                          didReply = true;
                          return [2 /*return*/];
                      }
                    });
                  });
                },
                onError: function (err, info) {
                  console.error("discord slash ".concat(info.kind, " reply failed"), err);
                },
              },
              replyOptions: {
                skillFilter:
                  channelConfig === null || channelConfig === void 0
                    ? void 0
                    : channelConfig.skills,
                disableBlockStreaming:
                  typeof (discordConfig === null || discordConfig === void 0
                    ? void 0
                    : discordConfig.blockStreaming) === "boolean"
                    ? !discordConfig.blockStreaming
                    : undefined,
              },
            }),
          ];
        case 29:
          _z.sent();
          return [2 /*return*/];
      }
    });
  });
}
function deliverDiscordInteractionReply(params) {
  return __awaiter(this, void 0, void 0, function () {
    var interaction,
      payload,
      textLimit,
      maxLinesPerMessage,
      preferFollowUp,
      chunkMode,
      mediaList,
      text,
      hasReplied,
      sendMessage,
      media,
      chunks_2,
      caption,
      _i,
      _a,
      chunk,
      chunks,
      _b,
      chunks_1,
      chunk;
    var _this = this;
    var _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          ((interaction = params.interaction),
            (payload = params.payload),
            (textLimit = params.textLimit),
            (maxLinesPerMessage = params.maxLinesPerMessage),
            (preferFollowUp = params.preferFollowUp),
            (chunkMode = params.chunkMode));
          mediaList =
            (_c = payload.mediaUrls) !== null && _c !== void 0
              ? _c
              : payload.mediaUrl
                ? [payload.mediaUrl]
                : [];
          text = (_d = payload.text) !== null && _d !== void 0 ? _d : "";
          hasReplied = false;
          sendMessage = function (content, files) {
            return __awaiter(_this, void 0, void 0, function () {
              var payload;
              var _this = this;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    payload =
                      files && files.length > 0
                        ? {
                            content: content,
                            files: files.map(function (file) {
                              if (file.data instanceof Blob) {
                                return { name: file.name, data: file.data };
                              }
                              var arrayBuffer = Uint8Array.from(file.data).buffer;
                              return { name: file.name, data: new Blob([arrayBuffer]) };
                            }),
                          }
                        : { content: content };
                    return [
                      4 /*yield*/,
                      safeDiscordInteractionCall("interaction send", function () {
                        return __awaiter(_this, void 0, void 0, function () {
                          return __generator(this, function (_a) {
                            switch (_a.label) {
                              case 0:
                                if (!(!preferFollowUp && !hasReplied)) {
                                  return [3 /*break*/, 2];
                                }
                                return [4 /*yield*/, interaction.reply(payload)];
                              case 1:
                                _a.sent();
                                hasReplied = true;
                                return [2 /*return*/];
                              case 2:
                                return [4 /*yield*/, interaction.followUp(payload)];
                              case 3:
                                _a.sent();
                                hasReplied = true;
                                return [2 /*return*/];
                            }
                          });
                        });
                      }),
                    ];
                  case 1:
                    _a.sent();
                    return [2 /*return*/];
                }
              });
            });
          };
          if (!(mediaList.length > 0)) {
            return [3 /*break*/, 7];
          }
          return [
            4 /*yield*/,
            Promise.all(
              mediaList.map(function (url) {
                return __awaiter(_this, void 0, void 0, function () {
                  var loaded;
                  var _a;
                  return __generator(this, function (_b) {
                    switch (_b.label) {
                      case 0:
                        return [4 /*yield*/, (0, media_js_1.loadWebMedia)(url)];
                      case 1:
                        loaded = _b.sent();
                        return [
                          2 /*return*/,
                          {
                            name: (_a = loaded.fileName) !== null && _a !== void 0 ? _a : "upload",
                            data: loaded.buffer,
                          },
                        ];
                    }
                  });
                });
              }),
            ),
          ];
        case 1:
          media = _f.sent();
          chunks_2 = (0, chunk_js_2.chunkDiscordTextWithMode)(text, {
            maxChars: textLimit,
            maxLines: maxLinesPerMessage,
            chunkMode: chunkMode,
          });
          if (!chunks_2.length && text) {
            chunks_2.push(text);
          }
          caption = (_e = chunks_2[0]) !== null && _e !== void 0 ? _e : "";
          return [4 /*yield*/, sendMessage(caption, media)];
        case 2:
          _f.sent();
          ((_i = 0), (_a = chunks_2.slice(1)));
          _f.label = 3;
        case 3:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 6];
          }
          chunk = _a[_i];
          if (!chunk.trim()) {
            return [3 /*break*/, 5];
          }
          return [4 /*yield*/, interaction.followUp({ content: chunk })];
        case 4:
          _f.sent();
          _f.label = 5;
        case 5:
          _i++;
          return [3 /*break*/, 3];
        case 6:
          return [2 /*return*/];
        case 7:
          if (!text.trim()) {
            return [2 /*return*/];
          }
          chunks = (0, chunk_js_2.chunkDiscordTextWithMode)(text, {
            maxChars: textLimit,
            maxLines: maxLinesPerMessage,
            chunkMode: chunkMode,
          });
          if (!chunks.length && text) {
            chunks.push(text);
          }
          ((_b = 0), (chunks_1 = chunks));
          _f.label = 8;
        case 8:
          if (!(_b < chunks_1.length)) {
            return [3 /*break*/, 11];
          }
          chunk = chunks_1[_b];
          if (!chunk.trim()) {
            return [3 /*break*/, 10];
          }
          return [4 /*yield*/, sendMessage(chunk)];
        case 9:
          _f.sent();
          _f.label = 10;
        case 10:
          _b++;
          return [3 /*break*/, 8];
        case 11:
          return [2 /*return*/];
      }
    });
  });
}
