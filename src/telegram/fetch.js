"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resolveTelegramFetch = resolveTelegramFetch;
var net = require("node:net");
var fetch_js_1 = require("../infra/fetch.js");
var subsystem_js_1 = require("../logging/subsystem.js");
var network_config_js_1 = require("./network-config.js");
var appliedAutoSelectFamily = null;
var log = (0, subsystem_js_1.createSubsystemLogger)("telegram/network");
// Node 22 workaround: disable autoSelectFamily to avoid Happy Eyeballs timeouts.
// See: https://github.com/nodejs/node/issues/54359
function applyTelegramNetworkWorkarounds(network) {
  var decision = (0, network_config_js_1.resolveTelegramAutoSelectFamilyDecision)({
    network: network,
  });
  if (decision.value === null || decision.value === appliedAutoSelectFamily) {
    return;
  }
  appliedAutoSelectFamily = decision.value;
  if (typeof net.setDefaultAutoSelectFamily === "function") {
    try {
      net.setDefaultAutoSelectFamily(decision.value);
      var label = decision.source ? " (".concat(decision.source, ")") : "";
      log.info("telegram: autoSelectFamily=".concat(decision.value).concat(label));
    } catch (_a) {
      // ignore if unsupported by the runtime
    }
  }
}
// Prefer wrapped fetch when available to normalize AbortSignal across runtimes.
function resolveTelegramFetch(proxyFetch, options) {
  applyTelegramNetworkWorkarounds(
    options === null || options === void 0 ? void 0 : options.network,
  );
  if (proxyFetch) {
    return (0, fetch_js_1.resolveFetch)(proxyFetch);
  }
  var fetchImpl = (0, fetch_js_1.resolveFetch)();
  if (!fetchImpl) {
    throw new Error("fetch is not available; set channels.telegram.proxy in config");
  }
  return fetchImpl;
}
