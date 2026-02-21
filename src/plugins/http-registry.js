"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.registerPluginHttpRoute = registerPluginHttpRoute;
var runtime_js_1 = require("./runtime.js");
var http_path_js_1 = require("./http-path.js");
function registerPluginHttpRoute(params) {
  var _a, _b, _c, _d;
  var registry =
    (_a = params.registry) !== null && _a !== void 0
      ? _a
      : (0, runtime_js_1.requireActivePluginRegistry)();
  var routes = (_b = registry.httpRoutes) !== null && _b !== void 0 ? _b : [];
  registry.httpRoutes = routes;
  var normalizedPath = (0, http_path_js_1.normalizePluginHttpPath)(
    params.path,
    params.fallbackPath,
  );
  var suffix = params.accountId ? ' for account "'.concat(params.accountId, '"') : "";
  if (!normalizedPath) {
    (_c = params.log) === null || _c === void 0
      ? void 0
      : _c.call(params, "plugin: webhook path missing".concat(suffix));
    return function () {};
  }
  if (
    routes.some(function (entry) {
      return entry.path === normalizedPath;
    })
  ) {
    var pluginHint = params.pluginId ? " (".concat(params.pluginId, ")") : "";
    (_d = params.log) === null || _d === void 0
      ? void 0
      : _d.call(
          params,
          "plugin: webhook path "
            .concat(normalizedPath, " already registered")
            .concat(suffix)
            .concat(pluginHint),
        );
    return function () {};
  }
  var entry = {
    path: normalizedPath,
    handler: params.handler,
    pluginId: params.pluginId,
    source: params.source,
  };
  routes.push(entry);
  return function () {
    var index = routes.indexOf(entry);
    if (index >= 0) {
      routes.splice(index, 1);
    }
  };
}
