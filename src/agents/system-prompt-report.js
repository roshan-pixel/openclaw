"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildSystemPromptReport = buildSystemPromptReport;
function extractBetween(input, startMarker, endMarker) {
  var start = input.indexOf(startMarker);
  if (start === -1) {
    return { text: "", found: false };
  }
  var end = input.indexOf(endMarker, start + startMarker.length);
  if (end === -1) {
    return { text: input.slice(start), found: true };
  }
  return { text: input.slice(start, end), found: true };
}
function parseSkillBlocks(skillsPrompt) {
  var prompt = skillsPrompt.trim();
  if (!prompt) {
    return [];
  }
  var blocks = Array.from(prompt.matchAll(/<skill>[\s\S]*?<\/skill>/gi)).map(function (match) {
    var _a;
    return (_a = match[0]) !== null && _a !== void 0 ? _a : "";
  });
  return blocks
    .map(function (block) {
      var _a, _b;
      var name =
        ((_b =
          (_a = block.match(/<name>\s*([^<]+?)\s*<\/name>/i)) === null || _a === void 0
            ? void 0
            : _a[1]) === null || _b === void 0
          ? void 0
          : _b.trim()) || "(unknown)";
      return { name: name, blockChars: block.length };
    })
    .filter(function (b) {
      return b.blockChars > 0;
    });
}
function buildInjectedWorkspaceFiles(params) {
  var injectedByName = new Map(
    params.injectedFiles.map(function (f) {
      return [f.path, f.content];
    }),
  );
  return params.bootstrapFiles.map(function (file) {
    var _a;
    var rawChars = file.missing
      ? 0
      : ((_a = file.content) !== null && _a !== void 0 ? _a : "").trimEnd().length;
    var injected = injectedByName.get(file.name);
    var injectedChars = injected ? injected.length : 0;
    var truncated = !file.missing && rawChars > params.bootstrapMaxChars;
    return {
      name: file.name,
      path: file.path,
      missing: file.missing,
      rawChars: rawChars,
      injectedChars: injectedChars,
      truncated: truncated,
    };
  });
}
function buildToolsEntries(tools) {
  return tools.map(function (tool) {
    var _a, _b;
    var name = tool.name;
    var summary =
      ((_a = tool.description) === null || _a === void 0 ? void 0 : _a.trim()) ||
      ((_b = tool.label) === null || _b === void 0 ? void 0 : _b.trim()) ||
      "";
    var summaryChars = summary.length;
    var schemaChars = (function () {
      if (!tool.parameters || typeof tool.parameters !== "object") {
        return 0;
      }
      try {
        return JSON.stringify(tool.parameters).length;
      } catch (_a) {
        return 0;
      }
    })();
    var propertiesCount = (function () {
      var schema = tool.parameters && typeof tool.parameters === "object" ? tool.parameters : null;
      var props = schema && typeof schema.properties === "object" ? schema.properties : null;
      if (!props || typeof props !== "object") {
        return null;
      }
      return Object.keys(props).length;
    })();
    return {
      name: name,
      summaryChars: summaryChars,
      schemaChars: schemaChars,
      propertiesCount: propertiesCount,
    };
  });
}
function extractToolListText(systemPrompt) {
  var markerA = "Tool names are case-sensitive. Call tools exactly as listed.\n";
  var markerB =
    "\nTOOLS.md does not control tool availability; it is user guidance for how to use external tools.";
  var extracted = extractBetween(systemPrompt, markerA, markerB);
  if (!extracted.found) {
    return "";
  }
  return extracted.text.replace(markerA, "").trim();
}
function buildSystemPromptReport(params) {
  var systemPrompt = params.systemPrompt.trim();
  var projectContext = extractBetween(
    systemPrompt,
    "\n# Project Context\n",
    "\n## Silent Replies\n",
  );
  var projectContextChars = projectContext.text.length;
  var toolListText = extractToolListText(systemPrompt);
  var toolListChars = toolListText.length;
  var toolsEntries = buildToolsEntries(params.tools);
  var toolsSchemaChars = toolsEntries.reduce(function (sum, t) {
    var _a;
    return sum + ((_a = t.schemaChars) !== null && _a !== void 0 ? _a : 0);
  }, 0);
  var skillsEntries = parseSkillBlocks(params.skillsPrompt);
  return {
    source: params.source,
    generatedAt: params.generatedAt,
    sessionId: params.sessionId,
    sessionKey: params.sessionKey,
    provider: params.provider,
    model: params.model,
    workspaceDir: params.workspaceDir,
    bootstrapMaxChars: params.bootstrapMaxChars,
    sandbox: params.sandbox,
    systemPrompt: {
      chars: systemPrompt.length,
      projectContextChars: projectContextChars,
      nonProjectContextChars: Math.max(0, systemPrompt.length - projectContextChars),
    },
    injectedWorkspaceFiles: buildInjectedWorkspaceFiles({
      bootstrapFiles: params.bootstrapFiles,
      injectedFiles: params.injectedFiles,
      bootstrapMaxChars: params.bootstrapMaxChars,
    }),
    skills: {
      promptChars: params.skillsPrompt.length,
      entries: skillsEntries,
    },
    tools: {
      listChars: toolListChars,
      schemaChars: toolsSchemaChars,
      entries: toolsEntries,
    },
  };
}
