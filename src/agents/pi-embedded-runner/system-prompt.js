"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildEmbeddedSystemPrompt = buildEmbeddedSystemPrompt;
exports.createSystemPromptOverride = createSystemPromptOverride;
var system_prompt_js_1 = require("../system-prompt.js");
var tool_summaries_js_1 = require("../tool-summaries.js");
function buildEmbeddedSystemPrompt(params) {
  return (0, system_prompt_js_1.buildAgentSystemPrompt)({
    workspaceDir: params.workspaceDir,
    defaultThinkLevel: params.defaultThinkLevel,
    reasoningLevel: params.reasoningLevel,
    extraSystemPrompt: params.extraSystemPrompt,
    ownerNumbers: params.ownerNumbers,
    reasoningTagHint: params.reasoningTagHint,
    heartbeatPrompt: params.heartbeatPrompt,
    skillsPrompt: params.skillsPrompt,
    docsPath: params.docsPath,
    ttsHint: params.ttsHint,
    workspaceNotes: params.workspaceNotes,
    reactionGuidance: params.reactionGuidance,
    promptMode: params.promptMode,
    runtimeInfo: params.runtimeInfo,
    messageToolHints: params.messageToolHints,
    sandboxInfo: params.sandboxInfo,
    toolNames: params.tools.map(function (tool) {
      return tool.name;
    }),
    toolSummaries: (0, tool_summaries_js_1.buildToolSummaryMap)(params.tools),
    modelAliasLines: params.modelAliasLines,
    userTimezone: params.userTimezone,
    userTime: params.userTime,
    userTimeFormat: params.userTimeFormat,
    contextFiles: params.contextFiles,
  });
}
function createSystemPromptOverride(systemPrompt) {
  var trimmed = systemPrompt.trim();
  return function () {
    return trimmed;
  };
}
