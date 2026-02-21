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
exports.handleToolExecutionStart = handleToolExecutionStart;
exports.handleToolExecutionUpdate = handleToolExecutionUpdate;
exports.handleToolExecutionEnd = handleToolExecutionEnd;
var agent_events_js_1 = require("../infra/agent-events.js");
var pi_embedded_helpers_js_1 = require("./pi-embedded-helpers.js");
var pi_embedded_messaging_js_1 = require("./pi-embedded-messaging.js");
var pi_embedded_subscribe_tools_js_1 = require("./pi-embedded-subscribe.tools.js");
var pi_embedded_utils_js_1 = require("./pi-embedded-utils.js");
var tool_policy_js_1 = require("./tool-policy.js");
function extendExecMeta(toolName, args, meta) {
  var normalized = toolName.trim().toLowerCase();
  if (normalized !== "exec" && normalized !== "bash") {
    return meta;
  }
  if (!args || typeof args !== "object") {
    return meta;
  }
  var record = args;
  var flags = [];
  if (record.pty === true) {
    flags.push("pty");
  }
  if (record.elevated === true) {
    flags.push("elevated");
  }
  if (flags.length === 0) {
    return meta;
  }
  var suffix = flags.join(" · ");
  return meta ? "".concat(meta, " \u00B7 ").concat(suffix) : suffix;
}
function handleToolExecutionStart(ctx, evt) {
  return __awaiter(this, void 0, void 0, function () {
    var rawToolName,
      toolName,
      toolCallId,
      args,
      record,
      filePath,
      argsPreview,
      meta,
      shouldEmitToolEvents,
      argsRecord,
      isMessagingSend,
      sendTarget,
      text;
    var _a, _b, _c;
    return __generator(this, function (_d) {
      // Flush pending block replies to preserve message boundaries before tool execution.
      ctx.flushBlockReplyBuffer();
      if (ctx.params.onBlockReplyFlush) {
        void ctx.params.onBlockReplyFlush();
      }
      rawToolName = String(evt.toolName);
      toolName = (0, tool_policy_js_1.normalizeToolName)(rawToolName);
      toolCallId = String(evt.toolCallId);
      args = evt.args;
      if (toolName === "read") {
        record = args && typeof args === "object" ? args : {};
        filePath = typeof record.path === "string" ? record.path.trim() : "";
        if (!filePath) {
          argsPreview = typeof args === "string" ? args.slice(0, 200) : undefined;
          ctx.log.warn(
            "read tool called without path: toolCallId="
              .concat(toolCallId, " argsType=")
              .concat(typeof args)
              .concat(argsPreview ? " argsPreview=".concat(argsPreview) : ""),
          );
        }
      }
      meta = extendExecMeta(
        toolName,
        args,
        (0, pi_embedded_utils_js_1.inferToolMetaFromArgs)(toolName, args),
      );
      ctx.state.toolMetaById.set(toolCallId, meta);
      ctx.log.debug(
        "embedded run tool start: runId="
          .concat(ctx.params.runId, " tool=")
          .concat(toolName, " toolCallId=")
          .concat(toolCallId),
      );
      shouldEmitToolEvents = ctx.shouldEmitToolResult();
      (0, agent_events_js_1.emitAgentEvent)({
        runId: ctx.params.runId,
        stream: "tool",
        data: {
          phase: "start",
          name: toolName,
          toolCallId: toolCallId,
          args: args,
        },
      });
      // Best-effort typing signal; do not block tool summaries on slow emitters.
      void ((_b = (_a = ctx.params).onAgentEvent) === null || _b === void 0
        ? void 0
        : _b.call(_a, {
            stream: "tool",
            data: { phase: "start", name: toolName, toolCallId: toolCallId },
          }));
      if (
        ctx.params.onToolResult &&
        shouldEmitToolEvents &&
        !ctx.state.toolSummaryById.has(toolCallId)
      ) {
        ctx.state.toolSummaryById.add(toolCallId);
        ctx.emitToolSummary(toolName, meta);
      }
      // Track messaging tool sends (pending until confirmed in tool_execution_end).
      if ((0, pi_embedded_messaging_js_1.isMessagingTool)(toolName)) {
        argsRecord = args && typeof args === "object" ? args : {};
        isMessagingSend = (0, pi_embedded_messaging_js_1.isMessagingToolSendAction)(
          toolName,
          argsRecord,
        );
        if (isMessagingSend) {
          sendTarget = (0, pi_embedded_subscribe_tools_js_1.extractMessagingToolSend)(
            toolName,
            argsRecord,
          );
          if (sendTarget) {
            ctx.state.pendingMessagingTargets.set(toolCallId, sendTarget);
          }
          text = (_c = argsRecord.content) !== null && _c !== void 0 ? _c : argsRecord.message;
          if (text && typeof text === "string") {
            ctx.state.pendingMessagingTexts.set(toolCallId, text);
            ctx.log.debug(
              "Tracking pending messaging text: tool="
                .concat(toolName, " len=")
                .concat(text.length),
            );
          }
        }
      }
      return [2 /*return*/];
    });
  });
}
function handleToolExecutionUpdate(ctx, evt) {
  var _a, _b;
  var toolName = (0, tool_policy_js_1.normalizeToolName)(String(evt.toolName));
  var toolCallId = String(evt.toolCallId);
  var partial = evt.partialResult;
  var sanitized = (0, pi_embedded_subscribe_tools_js_1.sanitizeToolResult)(partial);
  (0, agent_events_js_1.emitAgentEvent)({
    runId: ctx.params.runId,
    stream: "tool",
    data: {
      phase: "update",
      name: toolName,
      toolCallId: toolCallId,
      partialResult: sanitized,
    },
  });
  void ((_b = (_a = ctx.params).onAgentEvent) === null || _b === void 0
    ? void 0
    : _b.call(_a, {
        stream: "tool",
        data: {
          phase: "update",
          name: toolName,
          toolCallId: toolCallId,
        },
      }));
}
function handleToolExecutionEnd(ctx, evt) {
  var _a, _b;
  var toolName = (0, tool_policy_js_1.normalizeToolName)(String(evt.toolName));
  var toolCallId = String(evt.toolCallId);
  var isError = Boolean(evt.isError);
  var result = evt.result;
  var isToolError = isError || (0, pi_embedded_subscribe_tools_js_1.isToolResultError)(result);
  var sanitizedResult = (0, pi_embedded_subscribe_tools_js_1.sanitizeToolResult)(result);
  var meta = ctx.state.toolMetaById.get(toolCallId);
  ctx.state.toolMetas.push({ toolName: toolName, meta: meta });
  ctx.state.toolMetaById.delete(toolCallId);
  ctx.state.toolSummaryById.delete(toolCallId);
  if (isToolError) {
    var errorMessage = (0, pi_embedded_subscribe_tools_js_1.extractToolErrorMessage)(
      sanitizedResult,
    );
    ctx.state.lastToolError = {
      toolName: toolName,
      meta: meta,
      error: errorMessage,
    };
  }
  // Commit messaging tool text on success, discard on error.
  var pendingText = ctx.state.pendingMessagingTexts.get(toolCallId);
  var pendingTarget = ctx.state.pendingMessagingTargets.get(toolCallId);
  if (pendingText) {
    ctx.state.pendingMessagingTexts.delete(toolCallId);
    if (!isToolError) {
      ctx.state.messagingToolSentTexts.push(pendingText);
      ctx.state.messagingToolSentTextsNormalized.push(
        (0, pi_embedded_helpers_js_1.normalizeTextForComparison)(pendingText),
      );
      ctx.log.debug(
        "Committed messaging text: tool=".concat(toolName, " len=").concat(pendingText.length),
      );
      ctx.trimMessagingToolSent();
    }
  }
  if (pendingTarget) {
    ctx.state.pendingMessagingTargets.delete(toolCallId);
    if (!isToolError) {
      ctx.state.messagingToolSentTargets.push(pendingTarget);
      ctx.trimMessagingToolSent();
    }
  }
  (0, agent_events_js_1.emitAgentEvent)({
    runId: ctx.params.runId,
    stream: "tool",
    data: {
      phase: "result",
      name: toolName,
      toolCallId: toolCallId,
      meta: meta,
      isError: isToolError,
      result: sanitizedResult,
    },
  });
  void ((_b = (_a = ctx.params).onAgentEvent) === null || _b === void 0
    ? void 0
    : _b.call(_a, {
        stream: "tool",
        data: {
          phase: "result",
          name: toolName,
          toolCallId: toolCallId,
          meta: meta,
          isError: isToolError,
        },
      }));
  ctx.log.debug(
    "embedded run tool end: runId="
      .concat(ctx.params.runId, " tool=")
      .concat(toolName, " toolCallId=")
      .concat(toolCallId),
  );
  if (ctx.params.onToolResult && ctx.shouldEmitToolOutput()) {
    var outputText = (0, pi_embedded_subscribe_tools_js_1.extractToolResultText)(sanitizedResult);
    if (outputText) {
      ctx.emitToolOutput(toolName, meta, outputText);
    }
  }
}
