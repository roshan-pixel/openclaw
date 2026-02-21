"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listSkillCommandsForWorkspace = listSkillCommandsForWorkspace;
exports.listSkillCommandsForAgents = listSkillCommandsForAgents;
exports.resolveSkillCommandInvocation = resolveSkillCommandInvocation;
var node_fs_1 = require("node:fs");
var agent_scope_js_1 = require("../agents/agent-scope.js");
var skills_remote_js_1 = require("../infra/skills-remote.js");
var skills_js_1 = require("../agents/skills.js");
var commands_registry_js_1 = require("./commands-registry.js");
function resolveReservedCommandNames() {
  var reserved = new Set();
  for (var _i = 0, _a = (0, commands_registry_js_1.listChatCommands)(); _i < _a.length; _i++) {
    var command = _a[_i];
    if (command.nativeName) {
      reserved.add(command.nativeName.toLowerCase());
    }
    for (var _b = 0, _c = command.textAliases; _b < _c.length; _b++) {
      var alias = _c[_b];
      var trimmed = alias.trim();
      if (!trimmed.startsWith("/")) {
        continue;
      }
      reserved.add(trimmed.slice(1).toLowerCase());
    }
  }
  return reserved;
}
function listSkillCommandsForWorkspace(params) {
  return (0, skills_js_1.buildWorkspaceSkillCommandSpecs)(params.workspaceDir, {
    config: params.cfg,
    skillFilter: params.skillFilter,
    eligibility: { remote: (0, skills_remote_js_1.getRemoteSkillEligibility)() },
    reservedNames: resolveReservedCommandNames(),
  });
}
function listSkillCommandsForAgents(params) {
  var _a;
  var used = resolveReservedCommandNames();
  var entries = [];
  var agentIds =
    (_a = params.agentIds) !== null && _a !== void 0
      ? _a
      : (0, agent_scope_js_1.listAgentIds)(params.cfg);
  for (var _i = 0, agentIds_1 = agentIds; _i < agentIds_1.length; _i++) {
    var agentId = agentIds_1[_i];
    var workspaceDir = (0, agent_scope_js_1.resolveAgentWorkspaceDir)(params.cfg, agentId);
    if (!node_fs_1.default.existsSync(workspaceDir)) {
      continue;
    }
    var commands = (0, skills_js_1.buildWorkspaceSkillCommandSpecs)(workspaceDir, {
      config: params.cfg,
      eligibility: { remote: (0, skills_remote_js_1.getRemoteSkillEligibility)() },
      reservedNames: used,
    });
    for (var _b = 0, commands_1 = commands; _b < commands_1.length; _b++) {
      var command = commands_1[_b];
      used.add(command.name.toLowerCase());
      entries.push(command);
    }
  }
  return entries;
}
function normalizeSkillCommandLookup(value) {
  return value
    .trim()
    .toLowerCase()
    .replace(/[\s_]+/g, "-");
}
function findSkillCommand(skillCommands, rawName) {
  var trimmed = rawName.trim();
  if (!trimmed) {
    return undefined;
  }
  var lowered = trimmed.toLowerCase();
  var normalized = normalizeSkillCommandLookup(trimmed);
  return skillCommands.find(function (entry) {
    if (entry.name.toLowerCase() === lowered) {
      return true;
    }
    if (entry.skillName.toLowerCase() === lowered) {
      return true;
    }
    return (
      normalizeSkillCommandLookup(entry.name) === normalized ||
      normalizeSkillCommandLookup(entry.skillName) === normalized
    );
  });
}
function resolveSkillCommandInvocation(params) {
  var _a, _b, _c, _d, _e;
  var trimmed = params.commandBodyNormalized.trim();
  if (!trimmed.startsWith("/")) {
    return null;
  }
  var match = trimmed.match(/^\/([^\s]+)(?:\s+([\s\S]+))?$/);
  if (!match) {
    return null;
  }
  var commandName = (_a = match[1]) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
  if (!commandName) {
    return null;
  }
  if (commandName === "skill") {
    var remainder = (_b = match[2]) === null || _b === void 0 ? void 0 : _b.trim();
    if (!remainder) {
      return null;
    }
    var skillMatch = remainder.match(/^([^\s]+)(?:\s+([\s\S]+))?$/);
    if (!skillMatch) {
      return null;
    }
    var skillCommand = findSkillCommand(
      params.skillCommands,
      (_c = skillMatch[1]) !== null && _c !== void 0 ? _c : "",
    );
    if (!skillCommand) {
      return null;
    }
    var args_1 = (_d = skillMatch[2]) === null || _d === void 0 ? void 0 : _d.trim();
    return { command: skillCommand, args: args_1 || undefined };
  }
  var command = params.skillCommands.find(function (entry) {
    return entry.name.toLowerCase() === commandName;
  });
  if (!command) {
    return null;
  }
  var args = (_e = match[2]) === null || _e === void 0 ? void 0 : _e.trim();
  return { command: command, args: args || undefined };
}
