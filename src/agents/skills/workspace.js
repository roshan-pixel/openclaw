"use strict";
var __assign =
  (this && this.__assign) ||
  function () {
    __assign =
      Object.assign ||
      function (t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
          s = arguments[i];
          for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p)) t[p] = s[p];
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
          if (t[0] & 1) throw t[1];
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
      if (f) throw new TypeError("Generator is already executing.");
      while ((g && ((g = 0), op[0] && (_ = 0)), _))
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
      if (op[0] & 5) throw op[1];
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildWorkspaceSkillSnapshot = buildWorkspaceSkillSnapshot;
exports.buildWorkspaceSkillsPrompt = buildWorkspaceSkillsPrompt;
exports.resolveSkillsPromptForRun = resolveSkillsPromptForRun;
exports.loadWorkspaceSkillEntries = loadWorkspaceSkillEntries;
exports.syncSkillsToWorkspace = syncSkillsToWorkspace;
exports.filterWorkspaceSkillEntries = filterWorkspaceSkillEntries;
exports.buildWorkspaceSkillCommandSpecs = buildWorkspaceSkillCommandSpecs;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var subsystem_js_1 = require("../../logging/subsystem.js");
var utils_js_1 = require("../../utils.js");
var bundled_dir_js_1 = require("./bundled-dir.js");
var config_js_1 = require("./config.js");
var frontmatter_js_1 = require("./frontmatter.js");
var plugin_skills_js_1 = require("./plugin-skills.js");
var serialize_js_1 = require("./serialize.js");
var fsp = node_fs_1.default.promises;
var skillsLogger = (0, subsystem_js_1.createSubsystemLogger)("skills");
var skillCommandDebugOnce = new Set();
function debugSkillCommandOnce(messageKey, message, meta) {
  if (skillCommandDebugOnce.has(messageKey)) return;
  skillCommandDebugOnce.add(messageKey);
  skillsLogger.debug(message, meta);
}
function filterSkillEntries(entries, config, skillFilter, eligibility) {
  var filtered = entries.filter(function (entry) {
    return (0, config_js_1.shouldIncludeSkill)({
      entry: entry,
      config: config,
      eligibility: eligibility,
    });
  });
  // If skillFilter is provided, only include skills in the filter list.
  if (skillFilter !== undefined) {
    var normalized_1 = skillFilter
      .map(function (entry) {
        return String(entry).trim();
      })
      .filter(Boolean);
    var label = normalized_1.length > 0 ? normalized_1.join(", ") : "(none)";
    console.log("[skills] Applying skill filter: ".concat(label));
    filtered =
      normalized_1.length > 0
        ? filtered.filter(function (entry) {
            return normalized_1.includes(entry.skill.name);
          })
        : [];
    console.log(
      "[skills] After filter: ".concat(
        filtered
          .map(function (entry) {
            return entry.skill.name;
          })
          .join(", "),
      ),
    );
  }
  return filtered;
}
var SKILL_COMMAND_MAX_LENGTH = 32;
var SKILL_COMMAND_FALLBACK = "skill";
// Discord command descriptions must be ≤100 characters
var SKILL_COMMAND_DESCRIPTION_MAX_LENGTH = 100;
function sanitizeSkillCommandName(raw) {
  var normalized = raw
    .toLowerCase()
    .replace(/[^a-z0-9_]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
  var trimmed = normalized.slice(0, SKILL_COMMAND_MAX_LENGTH);
  return trimmed || SKILL_COMMAND_FALLBACK;
}
function resolveUniqueSkillCommandName(base, used) {
  var normalizedBase = base.toLowerCase();
  if (!used.has(normalizedBase)) return base;
  for (var index = 2; index < 1000; index += 1) {
    var suffix = "_".concat(index);
    var maxBaseLength = Math.max(1, SKILL_COMMAND_MAX_LENGTH - suffix.length);
    var trimmedBase = base.slice(0, maxBaseLength);
    var candidate = "".concat(trimmedBase).concat(suffix);
    var candidateKey = candidate.toLowerCase();
    if (!used.has(candidateKey)) return candidate;
  }
  var fallback = "".concat(base.slice(0, Math.max(1, SKILL_COMMAND_MAX_LENGTH - 2)), "_x");
  return fallback;
}
function loadSkillEntries(workspaceDir, opts) {
  var _a, _b, _c, _d, _e, _f;
  var loadSkills = function (params) {
    var loaded = (0, pi_coding_agent_1.loadSkillsFromDir)(params);
    if (Array.isArray(loaded)) return loaded;
    if (
      loaded &&
      typeof loaded === "object" &&
      "skills" in loaded &&
      Array.isArray(loaded.skills)
    ) {
      return loaded.skills;
    }
    return [];
  };
  var managedSkillsDir =
    (_a = opts === null || opts === void 0 ? void 0 : opts.managedSkillsDir) !== null &&
    _a !== void 0
      ? _a
      : node_path_1.default.join(utils_js_1.CONFIG_DIR, "skills");
  var workspaceSkillsDir = node_path_1.default.join(workspaceDir, "skills");
  var bundledSkillsDir =
    (_b = opts === null || opts === void 0 ? void 0 : opts.bundledSkillsDir) !== null &&
    _b !== void 0
      ? _b
      : (0, bundled_dir_js_1.resolveBundledSkillsDir)();
  var extraDirsRaw =
    (_f =
      (_e =
        (_d =
          (_c = opts === null || opts === void 0 ? void 0 : opts.config) === null || _c === void 0
            ? void 0
            : _c.skills) === null || _d === void 0
          ? void 0
          : _d.load) === null || _e === void 0
        ? void 0
        : _e.extraDirs) !== null && _f !== void 0
      ? _f
      : [];
  var extraDirs = extraDirsRaw
    .map(function (d) {
      return typeof d === "string" ? d.trim() : "";
    })
    .filter(Boolean);
  var pluginSkillDirs = (0, plugin_skills_js_1.resolvePluginSkillDirs)({
    workspaceDir: workspaceDir,
    config: opts === null || opts === void 0 ? void 0 : opts.config,
  });
  var mergedExtraDirs = __spreadArray(__spreadArray([], extraDirs, true), pluginSkillDirs, true);
  var bundledSkills = bundledSkillsDir
    ? loadSkills({
        dir: bundledSkillsDir,
        source: "openclaw-bundled",
      })
    : [];
  var extraSkills = mergedExtraDirs.flatMap(function (dir) {
    var resolved = (0, utils_js_1.resolveUserPath)(dir);
    return loadSkills({
      dir: resolved,
      source: "openclaw-extra",
    });
  });
  var managedSkills = loadSkills({
    dir: managedSkillsDir,
    source: "openclaw-managed",
  });
  var workspaceSkills = loadSkills({
    dir: workspaceSkillsDir,
    source: "openclaw-workspace",
  });
  var merged = new Map();
  // Precedence: extra < bundled < managed < workspace
  for (var _i = 0, extraSkills_1 = extraSkills; _i < extraSkills_1.length; _i++) {
    var skill = extraSkills_1[_i];
    merged.set(skill.name, skill);
  }
  for (var _g = 0, bundledSkills_1 = bundledSkills; _g < bundledSkills_1.length; _g++) {
    var skill = bundledSkills_1[_g];
    merged.set(skill.name, skill);
  }
  for (var _h = 0, managedSkills_1 = managedSkills; _h < managedSkills_1.length; _h++) {
    var skill = managedSkills_1[_h];
    merged.set(skill.name, skill);
  }
  for (var _j = 0, workspaceSkills_1 = workspaceSkills; _j < workspaceSkills_1.length; _j++) {
    var skill = workspaceSkills_1[_j];
    merged.set(skill.name, skill);
  }
  var skillEntries = Array.from(merged.values()).map(function (skill) {
    var frontmatter = {};
    try {
      var raw = node_fs_1.default.readFileSync(skill.filePath, "utf-8");
      frontmatter = (0, frontmatter_js_1.parseFrontmatter)(raw);
    } catch (_a) {
      // ignore malformed skills
    }
    return {
      skill: skill,
      frontmatter: frontmatter,
      metadata: (0, frontmatter_js_1.resolveOpenClawMetadata)(frontmatter),
      invocation: (0, frontmatter_js_1.resolveSkillInvocationPolicy)(frontmatter),
    };
  });
  return skillEntries;
}
function buildWorkspaceSkillSnapshot(workspaceDir, opts) {
  var _a, _b, _c, _d;
  var skillEntries =
    (_a = opts === null || opts === void 0 ? void 0 : opts.entries) !== null && _a !== void 0
      ? _a
      : loadSkillEntries(workspaceDir, opts);
  var eligible = filterSkillEntries(
    skillEntries,
    opts === null || opts === void 0 ? void 0 : opts.config,
    opts === null || opts === void 0 ? void 0 : opts.skillFilter,
    opts === null || opts === void 0 ? void 0 : opts.eligibility,
  );
  var promptEntries = eligible.filter(function (entry) {
    var _a;
    return (
      ((_a = entry.invocation) === null || _a === void 0 ? void 0 : _a.disableModelInvocation) !==
      true
    );
  });
  var resolvedSkills = promptEntries.map(function (entry) {
    return entry.skill;
  });
  var remoteNote =
    (_d =
      (_c =
        (_b = opts === null || opts === void 0 ? void 0 : opts.eligibility) === null ||
        _b === void 0
          ? void 0
          : _b.remote) === null || _c === void 0
        ? void 0
        : _c.note) === null || _d === void 0
      ? void 0
      : _d.trim();
  var prompt = [remoteNote, (0, pi_coding_agent_1.formatSkillsForPrompt)(resolvedSkills)]
    .filter(Boolean)
    .join("\n");
  return {
    prompt: prompt,
    skills: eligible.map(function (entry) {
      var _a;
      return {
        name: entry.skill.name,
        primaryEnv: (_a = entry.metadata) === null || _a === void 0 ? void 0 : _a.primaryEnv,
      };
    }),
    resolvedSkills: resolvedSkills,
    version: opts === null || opts === void 0 ? void 0 : opts.snapshotVersion,
  };
}
function buildWorkspaceSkillsPrompt(workspaceDir, opts) {
  var _a, _b, _c, _d;
  var skillEntries =
    (_a = opts === null || opts === void 0 ? void 0 : opts.entries) !== null && _a !== void 0
      ? _a
      : loadSkillEntries(workspaceDir, opts);
  var eligible = filterSkillEntries(
    skillEntries,
    opts === null || opts === void 0 ? void 0 : opts.config,
    opts === null || opts === void 0 ? void 0 : opts.skillFilter,
    opts === null || opts === void 0 ? void 0 : opts.eligibility,
  );
  var promptEntries = eligible.filter(function (entry) {
    var _a;
    return (
      ((_a = entry.invocation) === null || _a === void 0 ? void 0 : _a.disableModelInvocation) !==
      true
    );
  });
  var remoteNote =
    (_d =
      (_c =
        (_b = opts === null || opts === void 0 ? void 0 : opts.eligibility) === null ||
        _b === void 0
          ? void 0
          : _b.remote) === null || _c === void 0
        ? void 0
        : _c.note) === null || _d === void 0
      ? void 0
      : _d.trim();
  return [
    remoteNote,
    (0, pi_coding_agent_1.formatSkillsForPrompt)(
      promptEntries.map(function (entry) {
        return entry.skill;
      }),
    ),
  ]
    .filter(Boolean)
    .join("\n");
}
function resolveSkillsPromptForRun(params) {
  var _a, _b;
  var snapshotPrompt =
    (_b = (_a = params.skillsSnapshot) === null || _a === void 0 ? void 0 : _a.prompt) === null ||
    _b === void 0
      ? void 0
      : _b.trim();
  if (snapshotPrompt) return snapshotPrompt;
  if (params.entries && params.entries.length > 0) {
    var prompt_1 = buildWorkspaceSkillsPrompt(params.workspaceDir, {
      entries: params.entries,
      config: params.config,
    });
    return prompt_1.trim() ? prompt_1 : "";
  }
  return "";
}
function loadWorkspaceSkillEntries(workspaceDir, opts) {
  return loadSkillEntries(workspaceDir, opts);
}
function syncSkillsToWorkspace(params) {
  return __awaiter(this, void 0, void 0, function () {
    var sourceDir, targetDir;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          sourceDir = (0, utils_js_1.resolveUserPath)(params.sourceWorkspaceDir);
          targetDir = (0, utils_js_1.resolveUserPath)(params.targetWorkspaceDir);
          if (sourceDir === targetDir) return [2 /*return*/];
          return [
            4 /*yield*/,
            (0, serialize_js_1.serializeByKey)("syncSkills:".concat(targetDir), function () {
              return __awaiter(_this, void 0, void 0, function () {
                var targetSkillsDir, entries, _i, entries_1, entry, dest, error_1, message;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      targetSkillsDir = node_path_1.default.join(targetDir, "skills");
                      entries = loadSkillEntries(sourceDir, {
                        config: params.config,
                        managedSkillsDir: params.managedSkillsDir,
                        bundledSkillsDir: params.bundledSkillsDir,
                      });
                      return [
                        4 /*yield*/,
                        fsp.rm(targetSkillsDir, { recursive: true, force: true }),
                      ];
                    case 1:
                      _a.sent();
                      return [4 /*yield*/, fsp.mkdir(targetSkillsDir, { recursive: true })];
                    case 2:
                      _a.sent();
                      ((_i = 0), (entries_1 = entries));
                      _a.label = 3;
                    case 3:
                      if (!(_i < entries_1.length)) return [3 /*break*/, 8];
                      entry = entries_1[_i];
                      dest = node_path_1.default.join(targetSkillsDir, entry.skill.name);
                      _a.label = 4;
                    case 4:
                      _a.trys.push([4, 6, , 7]);
                      return [
                        4 /*yield*/,
                        fsp.cp(entry.skill.baseDir, dest, {
                          recursive: true,
                          force: true,
                        }),
                      ];
                    case 5:
                      _a.sent();
                      return [3 /*break*/, 7];
                    case 6:
                      error_1 = _a.sent();
                      message =
                        error_1 instanceof Error ? error_1.message : JSON.stringify(error_1);
                      console.warn(
                        "[skills] Failed to copy "
                          .concat(entry.skill.name, " to sandbox: ")
                          .concat(message),
                      );
                      return [3 /*break*/, 7];
                    case 7:
                      _i++;
                      return [3 /*break*/, 3];
                    case 8:
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
}
function filterWorkspaceSkillEntries(entries, config) {
  return filterSkillEntries(entries, config);
}
function buildWorkspaceSkillCommandSpecs(workspaceDir, opts) {
  var _a, _b, _c;
  var skillEntries =
    (_a = opts === null || opts === void 0 ? void 0 : opts.entries) !== null && _a !== void 0
      ? _a
      : loadSkillEntries(workspaceDir, opts);
  var eligible = filterSkillEntries(
    skillEntries,
    opts === null || opts === void 0 ? void 0 : opts.config,
    opts === null || opts === void 0 ? void 0 : opts.skillFilter,
    opts === null || opts === void 0 ? void 0 : opts.eligibility,
  );
  var userInvocable = eligible.filter(function (entry) {
    var _a;
    return (
      ((_a = entry.invocation) === null || _a === void 0 ? void 0 : _a.userInvocable) !== false
    );
  });
  var used = new Set();
  for (
    var _i = 0,
      _d =
        (_b = opts === null || opts === void 0 ? void 0 : opts.reservedNames) !== null &&
        _b !== void 0
          ? _b
          : [];
    _i < _d.length;
    _i++
  ) {
    var reserved = _d[_i];
    used.add(reserved.toLowerCase());
  }
  var specs = [];
  var _loop_1 = function (entry) {
    var rawName = entry.skill.name;
    var base = sanitizeSkillCommandName(rawName);
    if (base !== rawName) {
      debugSkillCommandOnce(
        "sanitize:".concat(rawName, ":").concat(base),
        'Sanitized skill command name "'.concat(rawName, '" to "/').concat(base, '".'),
        { rawName: rawName, sanitized: "/".concat(base) },
      );
    }
    var unique = resolveUniqueSkillCommandName(base, used);
    if (unique !== base) {
      debugSkillCommandOnce(
        "dedupe:".concat(rawName, ":").concat(unique),
        'De-duplicated skill command name for "'.concat(rawName, '" to "/').concat(unique, '".'),
        { rawName: rawName, deduped: "/".concat(unique) },
      );
    }
    used.add(unique.toLowerCase());
    var rawDescription =
      ((_c = entry.skill.description) === null || _c === void 0 ? void 0 : _c.trim()) || rawName;
    var description =
      rawDescription.length > SKILL_COMMAND_DESCRIPTION_MAX_LENGTH
        ? rawDescription.slice(0, SKILL_COMMAND_DESCRIPTION_MAX_LENGTH - 1) + "…"
        : rawDescription;
    var dispatch = (function () {
      var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m;
      var kindRaw = (
        (_d =
          (_b =
            (_a = entry.frontmatter) === null || _a === void 0
              ? void 0
              : _a["command-dispatch"]) !== null && _b !== void 0
            ? _b
            : (_c = entry.frontmatter) === null || _c === void 0
              ? void 0
              : _c["command_dispatch"]) !== null && _d !== void 0
          ? _d
          : ""
      )
        .trim()
        .toLowerCase();
      if (!kindRaw) return undefined;
      if (kindRaw !== "tool") return undefined;
      var toolName = (
        (_h =
          (_f =
            (_e = entry.frontmatter) === null || _e === void 0 ? void 0 : _e["command-tool"]) !==
            null && _f !== void 0
            ? _f
            : (_g = entry.frontmatter) === null || _g === void 0
              ? void 0
              : _g["command_tool"]) !== null && _h !== void 0
          ? _h
          : ""
      ).trim();
      if (!toolName) {
        debugSkillCommandOnce(
          "dispatch:missingTool:".concat(rawName),
          'Skill command "/'.concat(
            unique,
            '" requested tool dispatch but did not provide command-tool. Ignoring dispatch.',
          ),
          { skillName: rawName, command: unique },
        );
        return undefined;
      }
      var argModeRaw = (
        (_m =
          (_k =
            (_j = entry.frontmatter) === null || _j === void 0
              ? void 0
              : _j["command-arg-mode"]) !== null && _k !== void 0
            ? _k
            : (_l = entry.frontmatter) === null || _l === void 0
              ? void 0
              : _l["command_arg_mode"]) !== null && _m !== void 0
          ? _m
          : ""
      )
        .trim()
        .toLowerCase();
      var argMode = !argModeRaw || argModeRaw === "raw" ? "raw" : null;
      if (!argMode) {
        debugSkillCommandOnce(
          "dispatch:badArgMode:".concat(rawName, ":").concat(argModeRaw),
          'Skill command "/'.concat(
            unique,
            '" requested tool dispatch but has unknown command-arg-mode. Falling back to raw.',
          ),
          { skillName: rawName, command: unique, argMode: argModeRaw },
        );
      }
      return { kind: "tool", toolName: toolName, argMode: "raw" };
    })();
    specs.push(
      __assign(
        { name: unique, skillName: rawName, description: description },
        dispatch ? { dispatch: dispatch } : {},
      ),
    );
  };
  for (var _e = 0, userInvocable_1 = userInvocable; _e < userInvocable_1.length; _e++) {
    var entry = userInvocable_1[_e];
    _loop_1(entry);
  }
  return specs;
}
