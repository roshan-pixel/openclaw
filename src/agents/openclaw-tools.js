"use strict";
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
exports.createOpenClawTools = createOpenClawTools;
var tools_js_1 = require("../plugins/tools.js");
var agent_scope_js_1 = require("./agent-scope.js");
var agents_list_tool_js_1 = require("./tools/agents-list-tool.js");
var browser_tool_js_1 = require("./tools/browser-tool.js");
var canvas_tool_js_1 = require("./tools/canvas-tool.js");
var cron_tool_js_1 = require("./tools/cron-tool.js");
var gateway_tool_js_1 = require("./tools/gateway-tool.js");
var image_tool_js_1 = require("./tools/image-tool.js");
var message_tool_js_1 = require("./tools/message-tool.js");
var nodes_tool_js_1 = require("./tools/nodes-tool.js");
var session_status_tool_js_1 = require("./tools/session-status-tool.js");
var sessions_history_tool_js_1 = require("./tools/sessions-history-tool.js");
var sessions_list_tool_js_1 = require("./tools/sessions-list-tool.js");
var sessions_send_tool_js_1 = require("./tools/sessions-send-tool.js");
var sessions_spawn_tool_js_1 = require("./tools/sessions-spawn-tool.js");
var web_tools_js_1 = require("./tools/web-tools.js");
var tts_tool_js_1 = require("./tools/tts-tool.js");
function createOpenClawTools(options) {
  var _a;
  var imageTool = (
    (_a = options === null || options === void 0 ? void 0 : options.agentDir) === null ||
    _a === void 0
      ? void 0
      : _a.trim()
  )
    ? (0, image_tool_js_1.createImageTool)({
        config: options === null || options === void 0 ? void 0 : options.config,
        agentDir: options.agentDir,
        sandboxRoot: options === null || options === void 0 ? void 0 : options.sandboxRoot,
        modelHasVision: options === null || options === void 0 ? void 0 : options.modelHasVision,
      })
    : null;
  var webSearchTool = (0, web_tools_js_1.createWebSearchTool)({
    config: options === null || options === void 0 ? void 0 : options.config,
    sandboxed: options === null || options === void 0 ? void 0 : options.sandboxed,
  });
  var webFetchTool = (0, web_tools_js_1.createWebFetchTool)({
    config: options === null || options === void 0 ? void 0 : options.config,
    sandboxed: options === null || options === void 0 ? void 0 : options.sandboxed,
  });
  var tools = __spreadArray(
    __spreadArray(
      __spreadArray(
        [
          (0, browser_tool_js_1.createBrowserTool)({
            sandboxBridgeUrl:
              options === null || options === void 0 ? void 0 : options.sandboxBrowserBridgeUrl,
            allowHostControl:
              options === null || options === void 0 ? void 0 : options.allowHostBrowserControl,
          }),
          (0, canvas_tool_js_1.createCanvasTool)(),
          (0, nodes_tool_js_1.createNodesTool)({
            agentSessionKey:
              options === null || options === void 0 ? void 0 : options.agentSessionKey,
            config: options === null || options === void 0 ? void 0 : options.config,
          }),
          (0, cron_tool_js_1.createCronTool)({
            agentSessionKey:
              options === null || options === void 0 ? void 0 : options.agentSessionKey,
          }),
          (0, message_tool_js_1.createMessageTool)({
            agentAccountId:
              options === null || options === void 0 ? void 0 : options.agentAccountId,
            agentSessionKey:
              options === null || options === void 0 ? void 0 : options.agentSessionKey,
            config: options === null || options === void 0 ? void 0 : options.config,
            currentChannelId:
              options === null || options === void 0 ? void 0 : options.currentChannelId,
            currentChannelProvider:
              options === null || options === void 0 ? void 0 : options.agentChannel,
            currentThreadTs:
              options === null || options === void 0 ? void 0 : options.currentThreadTs,
            replyToMode: options === null || options === void 0 ? void 0 : options.replyToMode,
            hasRepliedRef: options === null || options === void 0 ? void 0 : options.hasRepliedRef,
          }),
          (0, tts_tool_js_1.createTtsTool)({
            agentChannel: options === null || options === void 0 ? void 0 : options.agentChannel,
            config: options === null || options === void 0 ? void 0 : options.config,
          }),
          (0, gateway_tool_js_1.createGatewayTool)({
            agentSessionKey:
              options === null || options === void 0 ? void 0 : options.agentSessionKey,
            config: options === null || options === void 0 ? void 0 : options.config,
          }),
          (0, agents_list_tool_js_1.createAgentsListTool)({
            agentSessionKey:
              options === null || options === void 0 ? void 0 : options.agentSessionKey,
            requesterAgentIdOverride:
              options === null || options === void 0 ? void 0 : options.requesterAgentIdOverride,
          }),
          (0, sessions_list_tool_js_1.createSessionsListTool)({
            agentSessionKey:
              options === null || options === void 0 ? void 0 : options.agentSessionKey,
            sandboxed: options === null || options === void 0 ? void 0 : options.sandboxed,
          }),
          (0, sessions_history_tool_js_1.createSessionsHistoryTool)({
            agentSessionKey:
              options === null || options === void 0 ? void 0 : options.agentSessionKey,
            sandboxed: options === null || options === void 0 ? void 0 : options.sandboxed,
          }),
          (0, sessions_send_tool_js_1.createSessionsSendTool)({
            agentSessionKey:
              options === null || options === void 0 ? void 0 : options.agentSessionKey,
            agentChannel: options === null || options === void 0 ? void 0 : options.agentChannel,
            sandboxed: options === null || options === void 0 ? void 0 : options.sandboxed,
          }),
          (0, sessions_spawn_tool_js_1.createSessionsSpawnTool)({
            agentSessionKey:
              options === null || options === void 0 ? void 0 : options.agentSessionKey,
            agentChannel: options === null || options === void 0 ? void 0 : options.agentChannel,
            agentAccountId:
              options === null || options === void 0 ? void 0 : options.agentAccountId,
            agentTo: options === null || options === void 0 ? void 0 : options.agentTo,
            agentThreadId: options === null || options === void 0 ? void 0 : options.agentThreadId,
            agentGroupId: options === null || options === void 0 ? void 0 : options.agentGroupId,
            agentGroupChannel:
              options === null || options === void 0 ? void 0 : options.agentGroupChannel,
            agentGroupSpace:
              options === null || options === void 0 ? void 0 : options.agentGroupSpace,
            sandboxed: options === null || options === void 0 ? void 0 : options.sandboxed,
            requesterAgentIdOverride:
              options === null || options === void 0 ? void 0 : options.requesterAgentIdOverride,
          }),
          (0, session_status_tool_js_1.createSessionStatusTool)({
            agentSessionKey:
              options === null || options === void 0 ? void 0 : options.agentSessionKey,
            config: options === null || options === void 0 ? void 0 : options.config,
          }),
        ],
        webSearchTool ? [webSearchTool] : [],
        true,
      ),
      webFetchTool ? [webFetchTool] : [],
      true,
    ),
    imageTool ? [imageTool] : [],
    true,
  );
  var pluginTools = (0, tools_js_1.resolvePluginTools)({
    context: {
      config: options === null || options === void 0 ? void 0 : options.config,
      workspaceDir: options === null || options === void 0 ? void 0 : options.workspaceDir,
      agentDir: options === null || options === void 0 ? void 0 : options.agentDir,
      agentId: (0, agent_scope_js_1.resolveSessionAgentId)({
        sessionKey: options === null || options === void 0 ? void 0 : options.agentSessionKey,
        config: options === null || options === void 0 ? void 0 : options.config,
      }),
      sessionKey: options === null || options === void 0 ? void 0 : options.agentSessionKey,
      messageChannel: options === null || options === void 0 ? void 0 : options.agentChannel,
      agentAccountId: options === null || options === void 0 ? void 0 : options.agentAccountId,
      sandboxed: options === null || options === void 0 ? void 0 : options.sandboxed,
    },
    existingToolNames: new Set(
      tools.map(function (tool) {
        return tool.name;
      }),
    ),
    toolAllowlist: options === null || options === void 0 ? void 0 : options.pluginToolAllowlist,
  });
  return __spreadArray(__spreadArray([], tools, true), pluginTools, true);
}
