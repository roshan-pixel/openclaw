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
exports.parseHttpUrl = parseHttpUrl;
exports.resolveBrowserConfig = resolveBrowserConfig;
exports.resolveProfile = resolveProfile;
exports.shouldStartLocalBrowserServer = shouldStartLocalBrowserServer;
var port_defaults_js_1 = require("../config/port-defaults.js");
var paths_js_1 = require("../config/paths.js");
var constants_js_1 = require("./constants.js");
var profiles_js_1 = require("./profiles.js");
function isLoopbackHost(host) {
  var h = host.trim().toLowerCase();
  return (
    h === "localhost" ||
    h === "127.0.0.1" ||
    h === "0.0.0.0" ||
    h === "[::1]" ||
    h === "::1" ||
    h === "[::]" ||
    h === "::"
  );
}
function normalizeHexColor(raw) {
  var value = (raw !== null && raw !== void 0 ? raw : "").trim();
  if (!value) {
    return constants_js_1.DEFAULT_OPENCLAW_BROWSER_COLOR;
  }
  var normalized = value.startsWith("#") ? value : "#".concat(value);
  if (!/^#[0-9a-fA-F]{6}$/.test(normalized)) {
    return constants_js_1.DEFAULT_OPENCLAW_BROWSER_COLOR;
  }
  return normalized.toUpperCase();
}
function normalizeTimeoutMs(raw, fallback) {
  var value = typeof raw === "number" && Number.isFinite(raw) ? Math.floor(raw) : fallback;
  return value < 0 ? fallback : value;
}
function parseHttpUrl(raw, label) {
  var trimmed = raw.trim();
  var parsed = new URL(trimmed);
  if (parsed.protocol !== "http:" && parsed.protocol !== "https:") {
    throw new Error(
      "".concat(label, " must be http(s), got: ").concat(parsed.protocol.replace(":", "")),
    );
  }
  var port =
    parsed.port && Number.parseInt(parsed.port, 10) > 0
      ? Number.parseInt(parsed.port, 10)
      : parsed.protocol === "https:"
        ? 443
        : 80;
  if (Number.isNaN(port) || port <= 0 || port > 65535) {
    throw new Error("".concat(label, " has invalid port: ").concat(parsed.port));
  }
  return {
    parsed: parsed,
    port: port,
    normalized: parsed.toString().replace(/\/$/, ""),
  };
}
/**
 * Ensure the default "openclaw" profile exists in the profiles map.
 * Auto-creates it with the legacy CDP port (from browser.cdpUrl) or first port if missing.
 */
function ensureDefaultProfile(profiles, defaultColor, legacyCdpPort, derivedDefaultCdpPort) {
  var _a;
  var result = __assign({}, profiles);
  if (!result[constants_js_1.DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME]) {
    result[constants_js_1.DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME] = {
      cdpPort:
        (_a =
          legacyCdpPort !== null && legacyCdpPort !== void 0
            ? legacyCdpPort
            : derivedDefaultCdpPort) !== null && _a !== void 0
          ? _a
          : profiles_js_1.CDP_PORT_RANGE_START,
      color: defaultColor,
    };
  }
  return result;
}
/**
 * Ensure a built-in "chrome" profile exists for the Chrome extension relay.
 *
 * Note: this is an OpenClaw browser profile (routing config), not a Chrome user profile.
 * It points at the local relay CDP endpoint (controlPort + 1).
 */
function ensureDefaultChromeExtensionProfile(profiles, controlPort) {
  var result = __assign({}, profiles);
  if (result.chrome) {
    return result;
  }
  var relayPort = controlPort + 1;
  if (!Number.isFinite(relayPort) || relayPort <= 0 || relayPort > 65535) {
    return result;
  }
  // Avoid adding the built-in profile if the derived relay port is already used by another profile
  // (legacy single-profile configs may use controlPort+1 for openclaw/openclaw CDP).
  if ((0, profiles_js_1.getUsedPorts)(result).has(relayPort)) {
    return result;
  }
  result.chrome = {
    driver: "extension",
    cdpUrl: "http://127.0.0.1:".concat(relayPort),
    color: "#00AA00",
  };
  return result;
}
function resolveBrowserConfig(cfg, rootConfig) {
  var _a, _b, _c, _d, _e;
  var enabled =
    (_a = cfg === null || cfg === void 0 ? void 0 : cfg.enabled) !== null && _a !== void 0
      ? _a
      : constants_js_1.DEFAULT_OPENCLAW_BROWSER_ENABLED;
  var evaluateEnabled =
    (_b = cfg === null || cfg === void 0 ? void 0 : cfg.evaluateEnabled) !== null && _b !== void 0
      ? _b
      : constants_js_1.DEFAULT_BROWSER_EVALUATE_ENABLED;
  var gatewayPort = (0, paths_js_1.resolveGatewayPort)(rootConfig);
  var controlPort = (0, port_defaults_js_1.deriveDefaultBrowserControlPort)(
    gatewayPort !== null && gatewayPort !== void 0
      ? gatewayPort
      : port_defaults_js_1.DEFAULT_BROWSER_CONTROL_PORT,
  );
  var defaultColor = normalizeHexColor(cfg === null || cfg === void 0 ? void 0 : cfg.color);
  var remoteCdpTimeoutMs = normalizeTimeoutMs(
    cfg === null || cfg === void 0 ? void 0 : cfg.remoteCdpTimeoutMs,
    1500,
  );
  var remoteCdpHandshakeTimeoutMs = normalizeTimeoutMs(
    cfg === null || cfg === void 0 ? void 0 : cfg.remoteCdpHandshakeTimeoutMs,
    Math.max(2000, remoteCdpTimeoutMs * 2),
  );
  var derivedCdpRange = (0, port_defaults_js_1.deriveDefaultBrowserCdpPortRange)(controlPort);
  var rawCdpUrl = (
    (_c = cfg === null || cfg === void 0 ? void 0 : cfg.cdpUrl) !== null && _c !== void 0 ? _c : ""
  ).trim();
  var cdpInfo;
  if (rawCdpUrl) {
    cdpInfo = parseHttpUrl(rawCdpUrl, "browser.cdpUrl");
  } else {
    var derivedPort = controlPort + 1;
    if (derivedPort > 65535) {
      throw new Error(
        "Derived CDP port (".concat(
          derivedPort,
          ") is too high; check gateway port configuration.",
        ),
      );
    }
    var derived = new URL("http://127.0.0.1:".concat(derivedPort));
    cdpInfo = {
      parsed: derived,
      port: derivedPort,
      normalized: derived.toString().replace(/\/$/, ""),
    };
  }
  var headless = (cfg === null || cfg === void 0 ? void 0 : cfg.headless) === true;
  var noSandbox = (cfg === null || cfg === void 0 ? void 0 : cfg.noSandbox) === true;
  var attachOnly = (cfg === null || cfg === void 0 ? void 0 : cfg.attachOnly) === true;
  var executablePath =
    ((_d = cfg === null || cfg === void 0 ? void 0 : cfg.executablePath) === null || _d === void 0
      ? void 0
      : _d.trim()) || undefined;
  var defaultProfileFromConfig =
    ((_e = cfg === null || cfg === void 0 ? void 0 : cfg.defaultProfile) === null || _e === void 0
      ? void 0
      : _e.trim()) || undefined;
  // Use legacy cdpUrl port for backward compatibility when no profiles configured
  var legacyCdpPort = rawCdpUrl ? cdpInfo.port : undefined;
  var profiles = ensureDefaultChromeExtensionProfile(
    ensureDefaultProfile(
      cfg === null || cfg === void 0 ? void 0 : cfg.profiles,
      defaultColor,
      legacyCdpPort,
      derivedCdpRange.start,
    ),
    controlPort,
  );
  var cdpProtocol = cdpInfo.parsed.protocol === "https:" ? "https" : "http";
  var defaultProfile =
    defaultProfileFromConfig !== null && defaultProfileFromConfig !== void 0
      ? defaultProfileFromConfig
      : profiles[constants_js_1.DEFAULT_BROWSER_DEFAULT_PROFILE_NAME]
        ? constants_js_1.DEFAULT_BROWSER_DEFAULT_PROFILE_NAME
        : constants_js_1.DEFAULT_OPENCLAW_BROWSER_PROFILE_NAME;
  return {
    enabled: enabled,
    evaluateEnabled: evaluateEnabled,
    controlPort: controlPort,
    cdpProtocol: cdpProtocol,
    cdpHost: cdpInfo.parsed.hostname,
    cdpIsLoopback: isLoopbackHost(cdpInfo.parsed.hostname),
    remoteCdpTimeoutMs: remoteCdpTimeoutMs,
    remoteCdpHandshakeTimeoutMs: remoteCdpHandshakeTimeoutMs,
    color: defaultColor,
    executablePath: executablePath,
    headless: headless,
    noSandbox: noSandbox,
    attachOnly: attachOnly,
    defaultProfile: defaultProfile,
    profiles: profiles,
  };
}
/**
 * Resolve a profile by name from the config.
 * Returns null if the profile doesn't exist.
 */
function resolveProfile(resolved, profileName) {
  var _a, _b, _c;
  var profile = resolved.profiles[profileName];
  if (!profile) {
    return null;
  }
  var rawProfileUrl =
    (_b = (_a = profile.cdpUrl) === null || _a === void 0 ? void 0 : _a.trim()) !== null &&
    _b !== void 0
      ? _b
      : "";
  var cdpHost = resolved.cdpHost;
  var cdpPort = (_c = profile.cdpPort) !== null && _c !== void 0 ? _c : 0;
  var cdpUrl = "";
  var driver = profile.driver === "extension" ? "extension" : "openclaw";
  if (rawProfileUrl) {
    var parsed = parseHttpUrl(rawProfileUrl, "browser.profiles.".concat(profileName, ".cdpUrl"));
    cdpHost = parsed.parsed.hostname;
    cdpPort = parsed.port;
    cdpUrl = parsed.normalized;
  } else if (cdpPort) {
    cdpUrl = "".concat(resolved.cdpProtocol, "://").concat(resolved.cdpHost, ":").concat(cdpPort);
  } else {
    throw new Error('Profile "'.concat(profileName, '" must define cdpPort or cdpUrl.'));
  }
  return {
    name: profileName,
    cdpPort: cdpPort,
    cdpUrl: cdpUrl,
    cdpHost: cdpHost,
    cdpIsLoopback: isLoopbackHost(cdpHost),
    color: profile.color,
    driver: driver,
  };
}
function shouldStartLocalBrowserServer(_resolved) {
  return true;
}
