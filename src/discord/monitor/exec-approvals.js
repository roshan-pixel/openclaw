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
exports.ExecApprovalButton = exports.DiscordExecApprovalHandler = void 0;
exports.buildExecApprovalCustomId = buildExecApprovalCustomId;
exports.parseExecApprovalData = parseExecApprovalData;
exports.createExecApprovalButton = createExecApprovalButton;
var carbon_1 = require("@buape/carbon");
var v10_1 = require("discord-api-types/v10");
var client_js_1 = require("../../gateway/client.js");
var message_channel_js_1 = require("../../utils/message-channel.js");
var send_shared_js_1 = require("../send.shared.js");
var logger_js_1 = require("../../logger.js");
var EXEC_APPROVAL_KEY = "execapproval";
function encodeCustomIdValue(value) {
  return encodeURIComponent(value);
}
function decodeCustomIdValue(value) {
  try {
    return decodeURIComponent(value);
  } catch (_a) {
    return value;
  }
}
function buildExecApprovalCustomId(approvalId, action) {
  return [
    "".concat(EXEC_APPROVAL_KEY, ":id=").concat(encodeCustomIdValue(approvalId)),
    "action=".concat(action),
  ].join(";");
}
function parseExecApprovalData(data) {
  if (!data || typeof data !== "object") {
    return null;
  }
  var coerce = function (value) {
    return typeof value === "string" || typeof value === "number" ? String(value) : "";
  };
  var rawId = coerce(data.id);
  var rawAction = coerce(data.action);
  if (!rawId || !rawAction) {
    return null;
  }
  var action = rawAction;
  if (action !== "allow-once" && action !== "allow-always" && action !== "deny") {
    return null;
  }
  return {
    approvalId: decodeCustomIdValue(rawId),
    action: action,
  };
}
function formatExecApprovalEmbed(request) {
  var commandText = request.request.command;
  var commandPreview =
    commandText.length > 1000 ? "".concat(commandText.slice(0, 1000), "...") : commandText;
  var expiresIn = Math.max(0, Math.round((request.expiresAtMs - Date.now()) / 1000));
  var fields = [
    {
      name: "Command",
      value: "```\n".concat(commandPreview, "\n```"),
      inline: false,
    },
  ];
  if (request.request.cwd) {
    fields.push({
      name: "Working Directory",
      value: request.request.cwd,
      inline: true,
    });
  }
  if (request.request.host) {
    fields.push({
      name: "Host",
      value: request.request.host,
      inline: true,
    });
  }
  if (request.request.agentId) {
    fields.push({
      name: "Agent",
      value: request.request.agentId,
      inline: true,
    });
  }
  return {
    title: "Exec Approval Required",
    description: "A command needs your approval.",
    color: 0xffa500, // Orange
    fields: fields,
    footer: { text: "Expires in ".concat(expiresIn, "s | ID: ").concat(request.id) },
    timestamp: new Date().toISOString(),
  };
}
function formatResolvedEmbed(request, decision, resolvedBy) {
  var commandText = request.request.command;
  var commandPreview =
    commandText.length > 500 ? "".concat(commandText.slice(0, 500), "...") : commandText;
  var decisionLabel =
    decision === "allow-once"
      ? "Allowed (once)"
      : decision === "allow-always"
        ? "Allowed (always)"
        : "Denied";
  var color = decision === "deny" ? 0xed4245 : decision === "allow-always" ? 0x5865f2 : 0x57f287;
  return {
    title: "Exec Approval: ".concat(decisionLabel),
    description: resolvedBy ? "Resolved by ".concat(resolvedBy) : "Resolved",
    color: color,
    fields: [
      {
        name: "Command",
        value: "```\n".concat(commandPreview, "\n```"),
        inline: false,
      },
    ],
    footer: { text: "ID: ".concat(request.id) },
    timestamp: new Date().toISOString(),
  };
}
function formatExpiredEmbed(request) {
  var commandText = request.request.command;
  var commandPreview =
    commandText.length > 500 ? "".concat(commandText.slice(0, 500), "...") : commandText;
  return {
    title: "Exec Approval: Expired",
    description: "This approval request has expired.",
    color: 0x99aab5, // Gray
    fields: [
      {
        name: "Command",
        value: "```\n".concat(commandPreview, "\n```"),
        inline: false,
      },
    ],
    footer: { text: "ID: ".concat(request.id) },
    timestamp: new Date().toISOString(),
  };
}
var DiscordExecApprovalHandler = /** @class */ (function () {
  function DiscordExecApprovalHandler(opts) {
    this.gatewayClient = null;
    this.pending = new Map();
    this.requestCache = new Map();
    this.started = false;
    this.opts = opts;
  }
  DiscordExecApprovalHandler.prototype.shouldHandle = function (request) {
    var _a, _b;
    var config = this.opts.config;
    if (!config.enabled) {
      return false;
    }
    if (!config.approvers || config.approvers.length === 0) {
      return false;
    }
    // Check agent filter
    if ((_a = config.agentFilter) === null || _a === void 0 ? void 0 : _a.length) {
      if (!request.request.agentId) {
        return false;
      }
      if (!config.agentFilter.includes(request.request.agentId)) {
        return false;
      }
    }
    // Check session filter (substring match)
    if ((_b = config.sessionFilter) === null || _b === void 0 ? void 0 : _b.length) {
      var session_1 = request.request.sessionKey;
      if (!session_1) {
        return false;
      }
      var matches = config.sessionFilter.some(function (p) {
        try {
          return session_1.includes(p) || new RegExp(p).test(session_1);
        } catch (_a) {
          return session_1.includes(p);
        }
      });
      if (!matches) {
        return false;
      }
    }
    return true;
  };
  DiscordExecApprovalHandler.prototype.start = function () {
    return __awaiter(this, void 0, void 0, function () {
      var config;
      var _this = this;
      var _a;
      return __generator(this, function (_b) {
        if (this.started) {
          return [2 /*return*/];
        }
        this.started = true;
        config = this.opts.config;
        if (!config.enabled) {
          (0, logger_js_1.logDebug)("discord exec approvals: disabled");
          return [2 /*return*/];
        }
        if (!config.approvers || config.approvers.length === 0) {
          (0, logger_js_1.logDebug)("discord exec approvals: no approvers configured");
          return [2 /*return*/];
        }
        (0, logger_js_1.logDebug)("discord exec approvals: starting handler");
        this.gatewayClient = new client_js_1.GatewayClient({
          url: (_a = this.opts.gatewayUrl) !== null && _a !== void 0 ? _a : "ws://127.0.0.1:18789",
          clientName: message_channel_js_1.GATEWAY_CLIENT_NAMES.GATEWAY_CLIENT,
          clientDisplayName: "Discord Exec Approvals",
          mode: message_channel_js_1.GATEWAY_CLIENT_MODES.BACKEND,
          scopes: ["operator.approvals"],
          onEvent: function (evt) {
            return _this.handleGatewayEvent(evt);
          },
          onHelloOk: function () {
            (0, logger_js_1.logDebug)("discord exec approvals: connected to gateway");
          },
          onConnectError: function (err) {
            (0, logger_js_1.logError)(
              "discord exec approvals: connect error: ".concat(err.message),
            );
          },
          onClose: function (code, reason) {
            (0, logger_js_1.logDebug)(
              "discord exec approvals: gateway closed: ".concat(code, " ").concat(reason),
            );
          },
        });
        this.gatewayClient.start();
        return [2 /*return*/];
      });
    });
  };
  DiscordExecApprovalHandler.prototype.stop = function () {
    return __awaiter(this, void 0, void 0, function () {
      var _i, _a, pending;
      var _b;
      return __generator(this, function (_c) {
        if (!this.started) {
          return [2 /*return*/];
        }
        this.started = false;
        // Clear all pending timeouts
        for (_i = 0, _a = this.pending.values(); _i < _a.length; _i++) {
          pending = _a[_i];
          clearTimeout(pending.timeoutId);
        }
        this.pending.clear();
        this.requestCache.clear();
        (_b = this.gatewayClient) === null || _b === void 0 ? void 0 : _b.stop();
        this.gatewayClient = null;
        (0, logger_js_1.logDebug)("discord exec approvals: stopped");
        return [2 /*return*/];
      });
    });
  };
  DiscordExecApprovalHandler.prototype.handleGatewayEvent = function (evt) {
    if (evt.event === "exec.approval.requested") {
      var request = evt.payload;
      void this.handleApprovalRequested(request);
    } else if (evt.event === "exec.approval.resolved") {
      var resolved = evt.payload;
      void this.handleApprovalResolved(resolved);
    }
  };
  DiscordExecApprovalHandler.prototype.handleApprovalRequested = function (request) {
    return __awaiter(this, void 0, void 0, function () {
      var _a,
        rest,
        discordRequest,
        embed,
        components,
        approvers,
        _loop_1,
        this_1,
        _i,
        approvers_1,
        approver;
      var _this = this;
      var _b;
      return __generator(this, function (_c) {
        switch (_c.label) {
          case 0:
            if (!this.shouldHandle(request)) {
              return [2 /*return*/];
            }
            (0, logger_js_1.logDebug)(
              "discord exec approvals: received request ".concat(request.id),
            );
            this.requestCache.set(request.id, request);
            ((_a = (0, send_shared_js_1.createDiscordClient)(
              { token: this.opts.token, accountId: this.opts.accountId },
              this.opts.cfg,
            )),
              (rest = _a.rest),
              (discordRequest = _a.request));
            embed = formatExecApprovalEmbed(request);
            components = [
              {
                type: 1, // ACTION_ROW
                components: [
                  {
                    type: 2, // BUTTON
                    style: v10_1.ButtonStyle.Success,
                    label: "Allow once",
                    custom_id: buildExecApprovalCustomId(request.id, "allow-once"),
                  },
                  {
                    type: 2, // BUTTON
                    style: v10_1.ButtonStyle.Primary,
                    label: "Always allow",
                    custom_id: buildExecApprovalCustomId(request.id, "allow-always"),
                  },
                  {
                    type: 2, // BUTTON
                    style: v10_1.ButtonStyle.Danger,
                    label: "Deny",
                    custom_id: buildExecApprovalCustomId(request.id, "deny"),
                  },
                ],
              },
            ];
            approvers = (_b = this.opts.config.approvers) !== null && _b !== void 0 ? _b : [];
            _loop_1 = function (approver) {
              var userId, dmChannel_1, message, timeoutMs, timeoutId, err_1;
              return __generator(this, function (_d) {
                switch (_d.label) {
                  case 0:
                    userId = String(approver);
                    _d.label = 1;
                  case 1:
                    _d.trys.push([1, 4, , 5]);
                    return [
                      4 /*yield*/,
                      discordRequest(function () {
                        return rest.post(v10_1.Routes.userChannels(), {
                          body: { recipient_id: userId },
                        });
                      }, "dm-channel"),
                    ];
                  case 2:
                    dmChannel_1 = _d.sent();
                    if (
                      !(dmChannel_1 === null || dmChannel_1 === void 0 ? void 0 : dmChannel_1.id)
                    ) {
                      (0, logger_js_1.logError)(
                        "discord exec approvals: failed to create DM for user ".concat(userId),
                      );
                      return [2 /*return*/, "continue"];
                    }
                    return [
                      4 /*yield*/,
                      discordRequest(function () {
                        return rest.post(v10_1.Routes.channelMessages(dmChannel_1.id), {
                          body: {
                            embeds: [embed],
                            components: components,
                          },
                        });
                      }, "send-approval"),
                    ];
                  case 3:
                    message = _d.sent();
                    if (!(message === null || message === void 0 ? void 0 : message.id)) {
                      (0, logger_js_1.logError)(
                        "discord exec approvals: failed to send message to user ".concat(userId),
                      );
                      return [2 /*return*/, "continue"];
                    }
                    timeoutMs = Math.max(0, request.expiresAtMs - Date.now());
                    timeoutId = setTimeout(function () {
                      void _this.handleApprovalTimeout(request.id);
                    }, timeoutMs);
                    this_1.pending.set(request.id, {
                      discordMessageId: message.id,
                      discordChannelId: dmChannel_1.id,
                      timeoutId: timeoutId,
                    });
                    (0, logger_js_1.logDebug)(
                      "discord exec approvals: sent approval "
                        .concat(request.id, " to user ")
                        .concat(userId),
                    );
                    return [3 /*break*/, 5];
                  case 4:
                    err_1 = _d.sent();
                    (0, logger_js_1.logError)(
                      "discord exec approvals: failed to notify user "
                        .concat(userId, ": ")
                        .concat(String(err_1)),
                    );
                    return [3 /*break*/, 5];
                  case 5:
                    return [2 /*return*/];
                }
              });
            };
            this_1 = this;
            ((_i = 0), (approvers_1 = approvers));
            _c.label = 1;
          case 1:
            if (!(_i < approvers_1.length)) {
              return [3 /*break*/, 4];
            }
            approver = approvers_1[_i];
            return [5 /*yield**/, _loop_1(approver)];
          case 2:
            _c.sent();
            _c.label = 3;
          case 3:
            _i++;
            return [3 /*break*/, 1];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  DiscordExecApprovalHandler.prototype.handleApprovalResolved = function (resolved) {
    return __awaiter(this, void 0, void 0, function () {
      var pending, request;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            pending = this.pending.get(resolved.id);
            if (!pending) {
              return [2 /*return*/];
            }
            clearTimeout(pending.timeoutId);
            this.pending.delete(resolved.id);
            request = this.requestCache.get(resolved.id);
            this.requestCache.delete(resolved.id);
            if (!request) {
              return [2 /*return*/];
            }
            (0, logger_js_1.logDebug)(
              "discord exec approvals: resolved "
                .concat(resolved.id, " with ")
                .concat(resolved.decision),
            );
            return [
              4 /*yield*/,
              this.updateMessage(
                pending.discordChannelId,
                pending.discordMessageId,
                formatResolvedEmbed(request, resolved.decision, resolved.resolvedBy),
              ),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  DiscordExecApprovalHandler.prototype.handleApprovalTimeout = function (approvalId) {
    return __awaiter(this, void 0, void 0, function () {
      var pending, request;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            pending = this.pending.get(approvalId);
            if (!pending) {
              return [2 /*return*/];
            }
            this.pending.delete(approvalId);
            request = this.requestCache.get(approvalId);
            this.requestCache.delete(approvalId);
            if (!request) {
              return [2 /*return*/];
            }
            (0, logger_js_1.logDebug)("discord exec approvals: timeout for ".concat(approvalId));
            return [
              4 /*yield*/,
              this.updateMessage(
                pending.discordChannelId,
                pending.discordMessageId,
                formatExpiredEmbed(request),
              ),
            ];
          case 1:
            _a.sent();
            return [2 /*return*/];
        }
      });
    });
  };
  DiscordExecApprovalHandler.prototype.updateMessage = function (channelId, messageId, embed) {
    return __awaiter(this, void 0, void 0, function () {
      var _a, rest_1, discordRequest, err_2;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            _b.trys.push([0, 2, , 3]);
            ((_a = (0, send_shared_js_1.createDiscordClient)(
              { token: this.opts.token, accountId: this.opts.accountId },
              this.opts.cfg,
            )),
              (rest_1 = _a.rest),
              (discordRequest = _a.request));
            return [
              4 /*yield*/,
              discordRequest(function () {
                return rest_1.patch(v10_1.Routes.channelMessage(channelId, messageId), {
                  body: {
                    embeds: [embed],
                    components: [], // Remove buttons
                  },
                });
              }, "update-approval"),
            ];
          case 1:
            _b.sent();
            return [3 /*break*/, 3];
          case 2:
            err_2 = _b.sent();
            (0, logger_js_1.logError)(
              "discord exec approvals: failed to update message: ".concat(String(err_2)),
            );
            return [3 /*break*/, 3];
          case 3:
            return [2 /*return*/];
        }
      });
    });
  };
  DiscordExecApprovalHandler.prototype.resolveApproval = function (approvalId, decision) {
    return __awaiter(this, void 0, void 0, function () {
      var err_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            if (!this.gatewayClient) {
              (0, logger_js_1.logError)("discord exec approvals: gateway client not connected");
              return [2 /*return*/, false];
            }
            (0, logger_js_1.logDebug)(
              "discord exec approvals: resolving ".concat(approvalId, " with ").concat(decision),
            );
            _a.label = 1;
          case 1:
            _a.trys.push([1, 3, , 4]);
            return [
              4 /*yield*/,
              this.gatewayClient.request("exec.approval.resolve", {
                id: approvalId,
                decision: decision,
              }),
            ];
          case 2:
            _a.sent();
            (0, logger_js_1.logDebug)(
              "discord exec approvals: resolved ".concat(approvalId, " successfully"),
            );
            return [2 /*return*/, true];
          case 3:
            err_3 = _a.sent();
            (0, logger_js_1.logError)(
              "discord exec approvals: resolve failed: ".concat(String(err_3)),
            );
            return [2 /*return*/, false];
          case 4:
            return [2 /*return*/];
        }
      });
    });
  };
  return DiscordExecApprovalHandler;
})();
exports.DiscordExecApprovalHandler = DiscordExecApprovalHandler;
var ExecApprovalButton = /** @class */ (function (_super) {
  __extends(ExecApprovalButton, _super);
  function ExecApprovalButton(ctx) {
    var _this = _super.call(this) || this;
    _this.label = "execapproval";
    _this.customId = "".concat(EXEC_APPROVAL_KEY, ":seed=1");
    _this.style = v10_1.ButtonStyle.Primary;
    _this.ctx = ctx;
    return _this;
  }
  ExecApprovalButton.prototype.run = function (interaction, data) {
    return __awaiter(this, void 0, void 0, function () {
      var parsed, _a, decisionLabel, _b, ok, _c;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            parsed = parseExecApprovalData(data);
            if (!!parsed) {
              return [3 /*break*/, 5];
            }
            _d.label = 1;
          case 1:
            _d.trys.push([1, 3, , 4]);
            return [
              4 /*yield*/,
              interaction.update({
                content: "This approval is no longer valid.",
                components: [],
              }),
            ];
          case 2:
            _d.sent();
            return [3 /*break*/, 4];
          case 3:
            _a = _d.sent();
            return [3 /*break*/, 4];
          case 4:
            return [2 /*return*/];
          case 5:
            decisionLabel =
              parsed.action === "allow-once"
                ? "Allowed (once)"
                : parsed.action === "allow-always"
                  ? "Allowed (always)"
                  : "Denied";
            _d.label = 6;
          case 6:
            _d.trys.push([6, 8, , 9]);
            return [
              4 /*yield*/,
              interaction.update({
                content: "Submitting decision: **".concat(decisionLabel, "**..."),
                components: [], // Remove buttons
              }),
            ];
          case 7:
            _d.sent();
            return [3 /*break*/, 9];
          case 8:
            _b = _d.sent();
            return [3 /*break*/, 9];
          case 9:
            return [
              4 /*yield*/,
              this.ctx.handler.resolveApproval(parsed.approvalId, parsed.action),
            ];
          case 10:
            ok = _d.sent();
            if (!!ok) {
              return [3 /*break*/, 14];
            }
            _d.label = 11;
          case 11:
            _d.trys.push([11, 13, , 14]);
            return [
              4 /*yield*/,
              interaction.followUp({
                content:
                  "Failed to submit approval decision. The request may have expired or already been resolved.",
                ephemeral: true,
              }),
            ];
          case 12:
            _d.sent();
            return [3 /*break*/, 14];
          case 13:
            _c = _d.sent();
            return [3 /*break*/, 14];
          case 14:
            return [2 /*return*/];
        }
      });
    });
  };
  return ExecApprovalButton;
})(carbon_1.Button);
exports.ExecApprovalButton = ExecApprovalButton;
function createExecApprovalButton(ctx) {
  return new ExecApprovalButton(ctx);
}
