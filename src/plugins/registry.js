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
exports.createPluginRegistry = createPluginRegistry;
var internal_hooks_js_1 = require("../hooks/internal-hooks.js");
var utils_js_1 = require("../utils.js");
var commands_js_1 = require("./commands.js");
var node_path_1 = require("node:path");
var http_path_js_1 = require("./http-path.js");
function createPluginRegistry(registryParams) {
  var _a;
  var registry = {
    plugins: [],
    tools: [],
    hooks: [],
    typedHooks: [],
    channels: [],
    providers: [],
    gatewayHandlers: {},
    httpHandlers: [],
    httpRoutes: [],
    cliRegistrars: [],
    services: [],
    commands: [],
    diagnostics: [],
  };
  var coreGatewayMethods = new Set(
    Object.keys((_a = registryParams.coreGatewayHandlers) !== null && _a !== void 0 ? _a : {}),
  );
  var pushDiagnostic = function (diag) {
    registry.diagnostics.push(diag);
  };
  var registerTool = function (record, tool, opts) {
    var _a;
    var _b;
    var names =
      (_b = opts === null || opts === void 0 ? void 0 : opts.names) !== null && _b !== void 0
        ? _b
        : (opts === null || opts === void 0 ? void 0 : opts.name)
          ? [opts.name]
          : [];
    var optional = (opts === null || opts === void 0 ? void 0 : opts.optional) === true;
    var factory =
      typeof tool === "function"
        ? tool
        : function (_ctx) {
            return tool;
          };
    if (typeof tool !== "function") {
      names.push(tool.name);
    }
    var normalized = names
      .map(function (name) {
        return name.trim();
      })
      .filter(Boolean);
    if (normalized.length > 0) {
      (_a = record.toolNames).push.apply(_a, normalized);
    }
    registry.tools.push({
      pluginId: record.id,
      factory: factory,
      names: normalized,
      optional: optional,
      source: record.source,
    });
  };
  var registerHook = function (record, events, handler, opts, config) {
    var _a, _b, _c, _d, _e, _f, _g;
    var eventList = Array.isArray(events) ? events : [events];
    var normalizedEvents = eventList
      .map(function (event) {
        return event.trim();
      })
      .filter(Boolean);
    var entry =
      (_a = opts === null || opts === void 0 ? void 0 : opts.entry) !== null && _a !== void 0
        ? _a
        : null;
    var name =
      (_b = entry === null || entry === void 0 ? void 0 : entry.hook.name) !== null && _b !== void 0
        ? _b
        : (_c = opts === null || opts === void 0 ? void 0 : opts.name) === null || _c === void 0
          ? void 0
          : _c.trim();
    if (!name) {
      pushDiagnostic({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: "hook registration missing name",
      });
      return;
    }
    var description =
      (_e =
        (_d = entry === null || entry === void 0 ? void 0 : entry.hook.description) !== null &&
        _d !== void 0
          ? _d
          : opts === null || opts === void 0
            ? void 0
            : opts.description) !== null && _e !== void 0
        ? _e
        : "";
    var hookEntry = entry
      ? __assign(__assign({}, entry), {
          hook: __assign(__assign({}, entry.hook), {
            name: name,
            description: description,
            source: "openclaw-plugin",
            pluginId: record.id,
          }),
          metadata: __assign(__assign({}, entry.metadata), { events: normalizedEvents }),
        })
      : {
          hook: {
            name: name,
            description: description,
            source: "openclaw-plugin",
            pluginId: record.id,
            filePath: record.source,
            baseDir: node_path_1.default.dirname(record.source),
            handlerPath: record.source,
          },
          frontmatter: {},
          metadata: { events: normalizedEvents },
          invocation: { enabled: true },
        };
    record.hookNames.push(name);
    registry.hooks.push({
      pluginId: record.id,
      entry: hookEntry,
      events: normalizedEvents,
      source: record.source,
    });
    var hookSystemEnabled =
      ((_g =
        (_f = config === null || config === void 0 ? void 0 : config.hooks) === null ||
        _f === void 0
          ? void 0
          : _f.internal) === null || _g === void 0
        ? void 0
        : _g.enabled) === true;
    if (
      !hookSystemEnabled ||
      (opts === null || opts === void 0 ? void 0 : opts.register) === false
    ) {
      return;
    }
    for (var _i = 0, normalizedEvents_1 = normalizedEvents; _i < normalizedEvents_1.length; _i++) {
      var event_1 = normalizedEvents_1[_i];
      (0, internal_hooks_js_1.registerInternalHook)(event_1, handler);
    }
  };
  var registerGatewayMethod = function (record, method, handler) {
    var trimmed = method.trim();
    if (!trimmed) {
      return;
    }
    if (coreGatewayMethods.has(trimmed) || registry.gatewayHandlers[trimmed]) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "gateway method already registered: ".concat(trimmed),
      });
      return;
    }
    registry.gatewayHandlers[trimmed] = handler;
    record.gatewayMethods.push(trimmed);
  };
  var registerHttpHandler = function (record, handler) {
    record.httpHandlers += 1;
    registry.httpHandlers.push({
      pluginId: record.id,
      handler: handler,
      source: record.source,
    });
  };
  var registerHttpRoute = function (record, params) {
    var normalizedPath = (0, http_path_js_1.normalizePluginHttpPath)(params.path);
    if (!normalizedPath) {
      pushDiagnostic({
        level: "warn",
        pluginId: record.id,
        source: record.source,
        message: "http route registration missing path",
      });
      return;
    }
    if (
      registry.httpRoutes.some(function (entry) {
        return entry.path === normalizedPath;
      })
    ) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "http route already registered: ".concat(normalizedPath),
      });
      return;
    }
    record.httpHandlers += 1;
    registry.httpRoutes.push({
      pluginId: record.id,
      path: normalizedPath,
      handler: params.handler,
      source: record.source,
    });
  };
  var registerChannel = function (record, registration) {
    var _a;
    var normalized =
      typeof registration.plugin === "object" ? registration : { plugin: registration };
    var plugin = normalized.plugin;
    var id =
      typeof (plugin === null || plugin === void 0 ? void 0 : plugin.id) === "string"
        ? plugin.id.trim()
        : String(
            (_a = plugin === null || plugin === void 0 ? void 0 : plugin.id) !== null &&
              _a !== void 0
              ? _a
              : "",
          ).trim();
    if (!id) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "channel registration missing id",
      });
      return;
    }
    record.channelIds.push(id);
    registry.channels.push({
      pluginId: record.id,
      plugin: plugin,
      dock: normalized.dock,
      source: record.source,
    });
  };
  var registerProvider = function (record, provider) {
    var id =
      typeof (provider === null || provider === void 0 ? void 0 : provider.id) === "string"
        ? provider.id.trim()
        : "";
    if (!id) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "provider registration missing id",
      });
      return;
    }
    var existing = registry.providers.find(function (entry) {
      return entry.provider.id === id;
    });
    if (existing) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "provider already registered: ".concat(id, " (").concat(existing.pluginId, ")"),
      });
      return;
    }
    record.providerIds.push(id);
    registry.providers.push({
      pluginId: record.id,
      provider: provider,
      source: record.source,
    });
  };
  var registerCli = function (record, registrar, opts) {
    var _a;
    var _b;
    var commands = (
      (_b = opts === null || opts === void 0 ? void 0 : opts.commands) !== null && _b !== void 0
        ? _b
        : []
    )
      .map(function (cmd) {
        return cmd.trim();
      })
      .filter(Boolean);
    (_a = record.cliCommands).push.apply(_a, commands);
    registry.cliRegistrars.push({
      pluginId: record.id,
      register: registrar,
      commands: commands,
      source: record.source,
    });
  };
  var registerService = function (record, service) {
    var id = service.id.trim();
    if (!id) {
      return;
    }
    record.services.push(id);
    registry.services.push({
      pluginId: record.id,
      service: service,
      source: record.source,
    });
  };
  var registerCommand = function (record, command) {
    var name = command.name.trim();
    if (!name) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "command registration missing name",
      });
      return;
    }
    // Register with the plugin command system (validates name and checks for duplicates)
    var result = (0, commands_js_1.registerPluginCommand)(record.id, command);
    if (!result.ok) {
      pushDiagnostic({
        level: "error",
        pluginId: record.id,
        source: record.source,
        message: "command registration failed: ".concat(result.error),
      });
      return;
    }
    record.commands.push(name);
    registry.commands.push({
      pluginId: record.id,
      command: command,
      source: record.source,
    });
  };
  var registerTypedHook = function (record, hookName, handler, opts) {
    record.hookCount += 1;
    registry.typedHooks.push({
      pluginId: record.id,
      hookName: hookName,
      handler: handler,
      priority: opts === null || opts === void 0 ? void 0 : opts.priority,
      source: record.source,
    });
  };
  var normalizeLogger = function (logger) {
    return {
      info: logger.info,
      warn: logger.warn,
      error: logger.error,
      debug: logger.debug,
    };
  };
  var createApi = function (record, params) {
    return {
      id: record.id,
      name: record.name,
      version: record.version,
      description: record.description,
      source: record.source,
      config: params.config,
      pluginConfig: params.pluginConfig,
      runtime: registryParams.runtime,
      logger: normalizeLogger(registryParams.logger),
      registerTool: function (tool, opts) {
        return registerTool(record, tool, opts);
      },
      registerHook: function (events, handler, opts) {
        return registerHook(record, events, handler, opts, params.config);
      },
      registerHttpHandler: function (handler) {
        return registerHttpHandler(record, handler);
      },
      registerHttpRoute: function (params) {
        return registerHttpRoute(record, params);
      },
      registerChannel: function (registration) {
        return registerChannel(record, registration);
      },
      registerProvider: function (provider) {
        return registerProvider(record, provider);
      },
      registerGatewayMethod: function (method, handler) {
        return registerGatewayMethod(record, method, handler);
      },
      registerCli: function (registrar, opts) {
        return registerCli(record, registrar, opts);
      },
      registerService: function (service) {
        return registerService(record, service);
      },
      registerCommand: function (command) {
        return registerCommand(record, command);
      },
      resolvePath: function (input) {
        return (0, utils_js_1.resolveUserPath)(input);
      },
      on: function (hookName, handler, opts) {
        return registerTypedHook(record, hookName, handler, opts);
      },
    };
  };
  return {
    registry: registry,
    createApi: createApi,
    pushDiagnostic: pushDiagnostic,
    registerTool: registerTool,
    registerChannel: registerChannel,
    registerProvider: registerProvider,
    registerGatewayMethod: registerGatewayMethod,
    registerCli: registerCli,
    registerService: registerService,
    registerCommand: registerCommand,
    registerHook: registerHook,
    registerTypedHook: registerTypedHook,
  };
}
