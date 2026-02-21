"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.__testing = void 0;
exports.setGatewaySigusr1RestartPolicy = setGatewaySigusr1RestartPolicy;
exports.isGatewaySigusr1RestartExternallyAllowed = isGatewaySigusr1RestartExternallyAllowed;
exports.authorizeGatewaySigusr1Restart = authorizeGatewaySigusr1Restart;
exports.consumeGatewaySigusr1RestartAuthorization = consumeGatewaySigusr1RestartAuthorization;
exports.triggerOpenClawRestart = triggerOpenClawRestart;
exports.scheduleGatewaySigusr1Restart = scheduleGatewaySigusr1Restart;
var node_child_process_1 = require("node:child_process");
var constants_js_1 = require("../daemon/constants.js");
var SPAWN_TIMEOUT_MS = 2000;
var SIGUSR1_AUTH_GRACE_MS = 5000;
var sigusr1AuthorizedCount = 0;
var sigusr1AuthorizedUntil = 0;
var sigusr1ExternalAllowed = false;
function resetSigusr1AuthorizationIfExpired(now) {
  if (now === void 0) {
    now = Date.now();
  }
  if (sigusr1AuthorizedCount <= 0) {
    return;
  }
  if (now <= sigusr1AuthorizedUntil) {
    return;
  }
  sigusr1AuthorizedCount = 0;
  sigusr1AuthorizedUntil = 0;
}
function setGatewaySigusr1RestartPolicy(opts) {
  sigusr1ExternalAllowed =
    (opts === null || opts === void 0 ? void 0 : opts.allowExternal) === true;
}
function isGatewaySigusr1RestartExternallyAllowed() {
  return sigusr1ExternalAllowed;
}
function authorizeGatewaySigusr1Restart(delayMs) {
  if (delayMs === void 0) {
    delayMs = 0;
  }
  var delay = Math.max(0, Math.floor(delayMs));
  var expiresAt = Date.now() + delay + SIGUSR1_AUTH_GRACE_MS;
  sigusr1AuthorizedCount += 1;
  if (expiresAt > sigusr1AuthorizedUntil) {
    sigusr1AuthorizedUntil = expiresAt;
  }
}
function consumeGatewaySigusr1RestartAuthorization() {
  resetSigusr1AuthorizationIfExpired();
  if (sigusr1AuthorizedCount <= 0) {
    return false;
  }
  sigusr1AuthorizedCount -= 1;
  if (sigusr1AuthorizedCount <= 0) {
    sigusr1AuthorizedUntil = 0;
  }
  return true;
}
function formatSpawnDetail(result) {
  var clean = function (value) {
    var text = typeof value === "string" ? value : value ? value.toString() : "";
    return text.replace(/\s+/g, " ").trim();
  };
  if (result.error) {
    if (result.error instanceof Error) {
      return result.error.message;
    }
    if (typeof result.error === "string") {
      return result.error;
    }
    try {
      return JSON.stringify(result.error);
    } catch (_a) {
      return "unknown error";
    }
  }
  var stderr = clean(result.stderr);
  if (stderr) {
    return stderr;
  }
  var stdout = clean(result.stdout);
  if (stdout) {
    return stdout;
  }
  if (typeof result.status === "number") {
    return "exit ".concat(result.status);
  }
  return "unknown error";
}
function normalizeSystemdUnit(raw, profile) {
  var unit = raw === null || raw === void 0 ? void 0 : raw.trim();
  if (!unit) {
    return "".concat((0, constants_js_1.resolveGatewaySystemdServiceName)(profile), ".service");
  }
  return unit.endsWith(".service") ? unit : "".concat(unit, ".service");
}
function triggerOpenClawRestart() {
  if (process.env.VITEST || process.env.NODE_ENV === "test") {
    return { ok: true, method: "supervisor", detail: "test mode" };
  }
  var tried = [];
  if (process.platform !== "darwin") {
    if (process.platform === "linux") {
      var unit = normalizeSystemdUnit(
        process.env.OPENCLAW_SYSTEMD_UNIT,
        process.env.OPENCLAW_PROFILE,
      );
      var userArgs = ["--user", "restart", unit];
      tried.push("systemctl ".concat(userArgs.join(" ")));
      var userRestart = (0, node_child_process_1.spawnSync)("systemctl", userArgs, {
        encoding: "utf8",
        timeout: SPAWN_TIMEOUT_MS,
      });
      if (!userRestart.error && userRestart.status === 0) {
        return { ok: true, method: "systemd", tried: tried };
      }
      var systemArgs = ["restart", unit];
      tried.push("systemctl ".concat(systemArgs.join(" ")));
      var systemRestart = (0, node_child_process_1.spawnSync)("systemctl", systemArgs, {
        encoding: "utf8",
        timeout: SPAWN_TIMEOUT_MS,
      });
      if (!systemRestart.error && systemRestart.status === 0) {
        return { ok: true, method: "systemd", tried: tried };
      }
      var detail = [
        "user: ".concat(formatSpawnDetail(userRestart)),
        "system: ".concat(formatSpawnDetail(systemRestart)),
      ].join("; ");
      return { ok: false, method: "systemd", detail: detail, tried: tried };
    }
    return {
      ok: false,
      method: "supervisor",
      detail: "unsupported platform restart",
    };
  }
  var label =
    process.env.OPENCLAW_LAUNCHD_LABEL ||
    (0, constants_js_1.resolveGatewayLaunchAgentLabel)(process.env.OPENCLAW_PROFILE);
  var uid = typeof process.getuid === "function" ? process.getuid() : undefined;
  var target = uid !== undefined ? "gui/".concat(uid, "/").concat(label) : label;
  var args = ["kickstart", "-k", target];
  tried.push("launchctl ".concat(args.join(" ")));
  var res = (0, node_child_process_1.spawnSync)("launchctl", args, {
    encoding: "utf8",
    timeout: SPAWN_TIMEOUT_MS,
  });
  if (!res.error && res.status === 0) {
    return { ok: true, method: "launchctl", tried: tried };
  }
  return {
    ok: false,
    method: "launchctl",
    detail: formatSpawnDetail(res),
    tried: tried,
  };
}
function scheduleGatewaySigusr1Restart(opts) {
  var delayMsRaw =
    typeof (opts === null || opts === void 0 ? void 0 : opts.delayMs) === "number" &&
    Number.isFinite(opts.delayMs)
      ? Math.floor(opts.delayMs)
      : 2000;
  var delayMs = Math.min(Math.max(delayMsRaw, 0), 60000);
  var reason =
    typeof (opts === null || opts === void 0 ? void 0 : opts.reason) === "string" &&
    opts.reason.trim()
      ? opts.reason.trim().slice(0, 200)
      : undefined;
  authorizeGatewaySigusr1Restart(delayMs);
  var pid = process.pid;
  var hasListener = process.listenerCount("SIGUSR1") > 0;
  setTimeout(function () {
    try {
      if (hasListener) {
        process.emit("SIGUSR1");
      } else {
        process.kill(pid, "SIGUSR1");
      }
    } catch (_a) {
      /* ignore */
    }
  }, delayMs);
  return {
    ok: true,
    pid: pid,
    signal: "SIGUSR1",
    delayMs: delayMs,
    reason: reason,
    mode: hasListener ? "emit" : "signal",
  };
}
exports.__testing = {
  resetSigusr1State: function () {
    sigusr1AuthorizedCount = 0;
    sigusr1AuthorizedUntil = 0;
    sigusr1ExternalAllowed = false;
  },
};
