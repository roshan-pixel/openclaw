"use strict";
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
Object.defineProperty(exports, "__esModule", { value: true });
exports.loadOpenClawPlugins = loadOpenClawPlugins;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var jiti_1 = require("jiti");
var subsystem_js_1 = require("../logging/subsystem.js");
var utils_js_1 = require("../utils.js");
var discovery_js_1 = require("./discovery.js");
var manifest_registry_js_1 = require("./manifest-registry.js");
var config_state_js_1 = require("./config-state.js");
var hook_runner_global_js_1 = require("./hook-runner-global.js");
var commands_js_1 = require("./commands.js");
var registry_js_1 = require("./registry.js");
var index_js_1 = require("./runtime/index.js");
var runtime_js_1 = require("./runtime.js");
var schema_validator_js_1 = require("./schema-validator.js");
var registryCache = new Map();
var defaultLogger = function () {
  return (0, subsystem_js_1.createSubsystemLogger)("plugins");
};
var resolvePluginSdkAlias = function () {
  try {
    var modulePath = (0, node_url_1.fileURLToPath)(import.meta.url);
    var isDistRuntime = modulePath.split(node_path_1.default.sep).includes("dist");
    var preferDist = process.env.VITEST || process.env.NODE_ENV === "test" || isDistRuntime;
    var cursor = node_path_1.default.dirname(modulePath);
    for (var i = 0; i < 6; i += 1) {
      var srcCandidate = node_path_1.default.join(cursor, "src", "plugin-sdk", "index.ts");
      var distCandidate = node_path_1.default.join(cursor, "dist", "plugin-sdk", "index.js");
      var orderedCandidates = preferDist
        ? [distCandidate, srcCandidate]
        : [srcCandidate, distCandidate];
      for (
        var _i = 0, orderedCandidates_1 = orderedCandidates;
        _i < orderedCandidates_1.length;
        _i++
      ) {
        var candidate = orderedCandidates_1[_i];
        if (node_fs_1.default.existsSync(candidate)) {
          return candidate;
        }
      }
      var parent_1 = node_path_1.default.dirname(cursor);
      if (parent_1 === cursor) {
        break;
      }
      cursor = parent_1;
    }
  } catch (_a) {
    // ignore
  }
  return null;
};
function buildCacheKey(params) {
  var workspaceKey = params.workspaceDir
    ? (0, utils_js_1.resolveUserPath)(params.workspaceDir)
    : "";
  return "".concat(workspaceKey, "::").concat(JSON.stringify(params.plugins));
}
function validatePluginConfig(params) {
  var _a, _b;
  var schema = params.schema;
  if (!schema) {
    return { ok: true, value: params.value };
  }
  var cacheKey = (_a = params.cacheKey) !== null && _a !== void 0 ? _a : JSON.stringify(schema);
  var result = (0, schema_validator_js_1.validateJsonSchemaValue)({
    schema: schema,
    cacheKey: cacheKey,
    value: (_b = params.value) !== null && _b !== void 0 ? _b : {},
  });
  if (result.ok) {
    return { ok: true, value: params.value };
  }
  return { ok: false, errors: result.errors };
}
function resolvePluginModuleExport(moduleExport) {
  var _a;
  var resolved =
    moduleExport && typeof moduleExport === "object" && "default" in moduleExport
      ? moduleExport.default
      : moduleExport;
  if (typeof resolved === "function") {
    return {
      register: resolved,
    };
  }
  if (resolved && typeof resolved === "object") {
    var def = resolved;
    var register = (_a = def.register) !== null && _a !== void 0 ? _a : def.activate;
    return { definition: def, register: register };
  }
  return {};
}
function createPluginRecord(params) {
  var _a;
  return {
    id: params.id,
    name: (_a = params.name) !== null && _a !== void 0 ? _a : params.id,
    description: params.description,
    version: params.version,
    source: params.source,
    origin: params.origin,
    workspaceDir: params.workspaceDir,
    enabled: params.enabled,
    status: params.enabled ? "loaded" : "disabled",
    toolNames: [],
    hookNames: [],
    channelIds: [],
    providerIds: [],
    gatewayMethods: [],
    cliCommands: [],
    services: [],
    commands: [],
    httpHandlers: 0,
    hookCount: 0,
    configSchema: params.configSchema,
    configUiHints: undefined,
    configJsonSchema: undefined,
  };
}
function pushDiagnostics(diagnostics, append) {
  diagnostics.push.apply(diagnostics, append);
}
function loadOpenClawPlugins(options) {
  var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k;
  if (options === void 0) {
    options = {};
  }
  var cfg = (_a = options.config) !== null && _a !== void 0 ? _a : {};
  var logger = (_b = options.logger) !== null && _b !== void 0 ? _b : defaultLogger();
  var validateOnly = options.mode === "validate";
  var normalized = (0, config_state_js_1.normalizePluginsConfig)(cfg.plugins);
  var cacheKey = buildCacheKey({
    workspaceDir: options.workspaceDir,
    plugins: normalized,
  });
  var cacheEnabled = options.cache !== false;
  if (cacheEnabled) {
    var cached = registryCache.get(cacheKey);
    if (cached) {
      (0, runtime_js_1.setActivePluginRegistry)(cached, cacheKey);
      return cached;
    }
  }
  // Clear previously registered plugin commands before reloading
  (0, commands_js_1.clearPluginCommands)();
  var runtime = (0, index_js_1.createPluginRuntime)();
  var _l = (0, registry_js_1.createPluginRegistry)({
      logger: logger,
      runtime: runtime,
      coreGatewayHandlers: options.coreGatewayHandlers,
    }),
    registry = _l.registry,
    createApi = _l.createApi;
  var discovery = (0, discovery_js_1.discoverOpenClawPlugins)({
    workspaceDir: options.workspaceDir,
    extraPaths: normalized.loadPaths,
  });
  var manifestRegistry = (0, manifest_registry_js_1.loadPluginManifestRegistry)({
    config: cfg,
    workspaceDir: options.workspaceDir,
    cache: options.cache,
    candidates: discovery.candidates,
    diagnostics: discovery.diagnostics,
  });
  pushDiagnostics(registry.diagnostics, manifestRegistry.diagnostics);
  var pluginSdkAlias = resolvePluginSdkAlias();
  var jiti = (0, jiti_1.createJiti)(
    import.meta.url,
    __assign(
      {
        interopDefault: true,
        extensions: [
          ".ts",
          ".tsx",
          ".mts",
          ".cts",
          ".mtsx",
          ".ctsx",
          ".js",
          ".mjs",
          ".cjs",
          ".json",
        ],
      },
      pluginSdkAlias
        ? {
            alias: { "openclaw/plugin-sdk": pluginSdkAlias },
          }
        : {},
    ),
  );
  var manifestByRoot = new Map(
    manifestRegistry.plugins.map(function (record) {
      return [record.rootDir, record];
    }),
  );
  var seenIds = new Map();
  var memorySlot = normalized.slots.memory;
  var selectedMemoryPluginId = null;
  var memorySlotMatched = false;
  for (var _i = 0, _m = discovery.candidates; _i < _m.length; _i++) {
    var candidate = _m[_i];
    var manifestRecord = manifestByRoot.get(candidate.rootDir);
    if (!manifestRecord) {
      continue;
    }
    var pluginId = manifestRecord.id;
    var existingOrigin = seenIds.get(pluginId);
    if (existingOrigin) {
      var record_1 = createPluginRecord({
        id: pluginId,
        name: (_c = manifestRecord.name) !== null && _c !== void 0 ? _c : pluginId,
        description: manifestRecord.description,
        version: manifestRecord.version,
        source: candidate.source,
        origin: candidate.origin,
        workspaceDir: candidate.workspaceDir,
        enabled: false,
        configSchema: Boolean(manifestRecord.configSchema),
      });
      record_1.status = "disabled";
      record_1.error = "overridden by ".concat(existingOrigin, " plugin");
      registry.plugins.push(record_1);
      continue;
    }
    var enableState = (0, config_state_js_1.resolveEnableState)(
      pluginId,
      candidate.origin,
      normalized,
    );
    var entry = normalized.entries[pluginId];
    var record = createPluginRecord({
      id: pluginId,
      name: (_d = manifestRecord.name) !== null && _d !== void 0 ? _d : pluginId,
      description: manifestRecord.description,
      version: manifestRecord.version,
      source: candidate.source,
      origin: candidate.origin,
      workspaceDir: candidate.workspaceDir,
      enabled: enableState.enabled,
      configSchema: Boolean(manifestRecord.configSchema),
    });
    record.kind = manifestRecord.kind;
    record.configUiHints = manifestRecord.configUiHints;
    record.configJsonSchema = manifestRecord.configSchema;
    if (!enableState.enabled) {
      record.status = "disabled";
      record.error = enableState.reason;
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }
    if (!manifestRecord.configSchema) {
      record.status = "error";
      record.error = "missing config schema";
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      registry.diagnostics.push({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: record.error,
      });
      continue;
    }
    var mod = null;
    try {
      mod = jiti(candidate.source);
    } catch (err) {
      logger.error(
        "[plugins] "
          .concat(record.id, " failed to load from ")
          .concat(record.source, ": ")
          .concat(String(err)),
      );
      record.status = "error";
      record.error = String(err);
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      registry.diagnostics.push({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "failed to load plugin: ".concat(String(err)),
      });
      continue;
    }
    var resolved = resolvePluginModuleExport(mod);
    var definition = resolved.definition;
    var register = resolved.register;
    if (
      (definition === null || definition === void 0 ? void 0 : definition.id) &&
      definition.id !== record.id
    ) {
      registry.diagnostics.push({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: 'plugin id mismatch (config uses "'
          .concat(record.id, '", export uses "')
          .concat(definition.id, '")'),
      });
    }
    record.name =
      (_e = definition === null || definition === void 0 ? void 0 : definition.name) !== null &&
      _e !== void 0
        ? _e
        : record.name;
    record.description =
      (_f = definition === null || definition === void 0 ? void 0 : definition.description) !==
        null && _f !== void 0
        ? _f
        : record.description;
    record.version =
      (_g = definition === null || definition === void 0 ? void 0 : definition.version) !== null &&
      _g !== void 0
        ? _g
        : record.version;
    var manifestKind = record.kind;
    var exportKind = definition === null || definition === void 0 ? void 0 : definition.kind;
    if (manifestKind && exportKind && exportKind !== manifestKind) {
      registry.diagnostics.push({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: 'plugin kind mismatch (manifest uses "'
          .concat(manifestKind, '", export uses "')
          .concat(exportKind, '")'),
      });
    }
    record.kind =
      (_h = definition === null || definition === void 0 ? void 0 : definition.kind) !== null &&
      _h !== void 0
        ? _h
        : record.kind;
    if (record.kind === "memory" && memorySlot === record.id) {
      memorySlotMatched = true;
    }
    var memoryDecision = (0, config_state_js_1.resolveMemorySlotDecision)({
      id: record.id,
      kind: record.kind,
      slot: memorySlot,
      selectedId: selectedMemoryPluginId,
    });
    if (!memoryDecision.enabled) {
      record.enabled = false;
      record.status = "disabled";
      record.error = memoryDecision.reason;
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }
    if (memoryDecision.selected && record.kind === "memory") {
      selectedMemoryPluginId = record.id;
    }
    var validatedConfig = validatePluginConfig({
      schema: manifestRecord.configSchema,
      cacheKey: manifestRecord.schemaCacheKey,
      value: entry === null || entry === void 0 ? void 0 : entry.config,
    });
    if (!validatedConfig.ok) {
      logger.error(
        "[plugins] "
          .concat(record.id, " invalid config: ")
          .concat((_j = validatedConfig.errors) === null || _j === void 0 ? void 0 : _j.join(", ")),
      );
      record.status = "error";
      record.error = "invalid config: ".concat(
        (_k = validatedConfig.errors) === null || _k === void 0 ? void 0 : _k.join(", "),
      );
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      registry.diagnostics.push({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: record.error,
      });
      continue;
    }
    if (validateOnly) {
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      continue;
    }
    if (typeof register !== "function") {
      logger.error("[plugins] ".concat(record.id, " missing register/activate export"));
      record.status = "error";
      record.error = "plugin export missing register/activate";
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      registry.diagnostics.push({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: record.error,
      });
      continue;
    }
    var api = createApi(record, {
      config: cfg,
      pluginConfig: validatedConfig.value,
    });
    try {
      var result = register(api);
      if (result && typeof result.then === "function") {
        registry.diagnostics.push({
          level: "warn",
          pluginId: record.id,
          source: record.source,
          message: "plugin register returned a promise; async registration is ignored",
        });
      }
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
    } catch (err) {
      logger.error(
        "[plugins] "
          .concat(record.id, " failed during register from ")
          .concat(record.source, ": ")
          .concat(String(err)),
      );
      record.status = "error";
      record.error = String(err);
      registry.plugins.push(record);
      seenIds.set(pluginId, candidate.origin);
      registry.diagnostics.push({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "plugin failed during register: ".concat(String(err)),
      });
    }
  }
  if (typeof memorySlot === "string" && !memorySlotMatched) {
    registry.diagnostics.push({
      level: "warn",
      message: "memory slot plugin not found or not marked as memory: ".concat(memorySlot),
    });
  }
  if (cacheEnabled) {
    registryCache.set(cacheKey, registry);
  }
  (0, runtime_js_1.setActivePluginRegistry)(registry, cacheKey);
  (0, hook_runner_global_js_1.initializeGlobalHookRunner)(registry);
  return registry;
}
