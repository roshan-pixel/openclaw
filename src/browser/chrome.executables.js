"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findChromeExecutableMac = findChromeExecutableMac;
exports.findChromeExecutableLinux = findChromeExecutableLinux;
exports.findChromeExecutableWindows = findChromeExecutableWindows;
exports.resolveBrowserExecutableForPlatform = resolveBrowserExecutableForPlatform;
var node_child_process_1 = require("node:child_process");
var node_fs_1 = require("node:fs");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var CHROMIUM_BUNDLE_IDS = new Set([
  "com.google.Chrome",
  "com.google.Chrome.beta",
  "com.google.Chrome.canary",
  "com.google.Chrome.dev",
  "com.brave.Browser",
  "com.brave.Browser.beta",
  "com.brave.Browser.nightly",
  "com.microsoft.Edge",
  "com.microsoft.EdgeBeta",
  "com.microsoft.EdgeDev",
  "com.microsoft.EdgeCanary",
  "org.chromium.Chromium",
  "com.vivaldi.Vivaldi",
  "com.operasoftware.Opera",
  "com.operasoftware.OperaGX",
  "com.yandex.desktop.yandex-browser",
  "company.thebrowser.Browser", // Arc
]);
var CHROMIUM_DESKTOP_IDS = new Set([
  "google-chrome.desktop",
  "google-chrome-beta.desktop",
  "google-chrome-unstable.desktop",
  "brave-browser.desktop",
  "microsoft-edge.desktop",
  "microsoft-edge-beta.desktop",
  "microsoft-edge-dev.desktop",
  "microsoft-edge-canary.desktop",
  "chromium.desktop",
  "chromium-browser.desktop",
  "vivaldi.desktop",
  "vivaldi-stable.desktop",
  "opera.desktop",
  "opera-gx.desktop",
  "yandex-browser.desktop",
  "org.chromium.Chromium.desktop",
]);
var CHROMIUM_EXE_NAMES = new Set([
  "chrome.exe",
  "msedge.exe",
  "brave.exe",
  "brave-browser.exe",
  "chromium.exe",
  "vivaldi.exe",
  "opera.exe",
  "launcher.exe",
  "yandex.exe",
  "yandexbrowser.exe",
  // mac/linux names
  "google chrome",
  "google chrome canary",
  "brave browser",
  "microsoft edge",
  "chromium",
  "chrome",
  "brave",
  "msedge",
  "brave-browser",
  "google-chrome",
  "google-chrome-stable",
  "google-chrome-beta",
  "google-chrome-unstable",
  "microsoft-edge",
  "microsoft-edge-beta",
  "microsoft-edge-dev",
  "microsoft-edge-canary",
  "chromium-browser",
  "vivaldi",
  "vivaldi-stable",
  "opera",
  "opera-stable",
  "opera-gx",
  "yandex-browser",
]);
function exists(filePath) {
  try {
    return node_fs_1.default.existsSync(filePath);
  } catch (_a) {
    return false;
  }
}
function execText(command, args, timeoutMs, maxBuffer) {
  if (timeoutMs === void 0) {
    timeoutMs = 1200;
  }
  if (maxBuffer === void 0) {
    maxBuffer = 1024 * 1024;
  }
  try {
    var output = (0, node_child_process_1.execFileSync)(command, args, {
      timeout: timeoutMs,
      encoding: "utf8",
      maxBuffer: maxBuffer,
    });
    return String(output !== null && output !== void 0 ? output : "").trim() || null;
  } catch (_a) {
    return null;
  }
}
function inferKindFromIdentifier(identifier) {
  var id = identifier.toLowerCase();
  if (id.includes("brave")) {
    return "brave";
  }
  if (id.includes("edge")) {
    return "edge";
  }
  if (id.includes("chromium")) {
    return "chromium";
  }
  if (id.includes("canary")) {
    return "canary";
  }
  if (
    id.includes("opera") ||
    id.includes("vivaldi") ||
    id.includes("yandex") ||
    id.includes("thebrowser")
  ) {
    return "chromium";
  }
  return "chrome";
}
function inferKindFromExecutableName(name) {
  var lower = name.toLowerCase();
  if (lower.includes("brave")) {
    return "brave";
  }
  if (lower.includes("edge") || lower.includes("msedge")) {
    return "edge";
  }
  if (lower.includes("chromium")) {
    return "chromium";
  }
  if (lower.includes("canary") || lower.includes("sxs")) {
    return "canary";
  }
  if (lower.includes("opera") || lower.includes("vivaldi") || lower.includes("yandex")) {
    return "chromium";
  }
  return "chrome";
}
function detectDefaultChromiumExecutable(platform) {
  if (platform === "darwin") {
    return detectDefaultChromiumExecutableMac();
  }
  if (platform === "linux") {
    return detectDefaultChromiumExecutableLinux();
  }
  if (platform === "win32") {
    return detectDefaultChromiumExecutableWindows();
  }
  return null;
}
function detectDefaultChromiumExecutableMac() {
  var bundleId = detectDefaultBrowserBundleIdMac();
  if (!bundleId || !CHROMIUM_BUNDLE_IDS.has(bundleId)) {
    return null;
  }
  var appPathRaw = execText("/usr/bin/osascript", [
    "-e",
    'POSIX path of (path to application id "'.concat(bundleId, '")'),
  ]);
  if (!appPathRaw) {
    return null;
  }
  var appPath = appPathRaw.trim().replace(/\/$/, "");
  var exeName = execText("/usr/bin/defaults", [
    "read",
    node_path_1.default.join(appPath, "Contents", "Info"),
    "CFBundleExecutable",
  ]);
  if (!exeName) {
    return null;
  }
  var exePath = node_path_1.default.join(appPath, "Contents", "MacOS", exeName.trim());
  if (!exists(exePath)) {
    return null;
  }
  return { kind: inferKindFromIdentifier(bundleId), path: exePath };
}
function detectDefaultBrowserBundleIdMac() {
  var _a;
  var plistPath = node_path_1.default.join(
    node_os_1.default.homedir(),
    "Library/Preferences/com.apple.LaunchServices/com.apple.launchservices.secure.plist",
  );
  if (!exists(plistPath)) {
    return null;
  }
  var handlersRaw = execText(
    "/usr/bin/plutil",
    ["-extract", "LSHandlers", "json", "-o", "-", "--", plistPath],
    2000,
    5 * 1024 * 1024,
  );
  if (!handlersRaw) {
    return null;
  }
  var handlers;
  try {
    handlers = JSON.parse(handlersRaw);
  } catch (_b) {
    return null;
  }
  if (!Array.isArray(handlers)) {
    return null;
  }
  var resolveScheme = function (scheme) {
    var candidate = null;
    for (var _i = 0, handlers_1 = handlers; _i < handlers_1.length; _i++) {
      var entry = handlers_1[_i];
      if (!entry || typeof entry !== "object") {
        continue;
      }
      var record = entry;
      if (record.LSHandlerURLScheme !== scheme) {
        continue;
      }
      var role =
        (typeof record.LSHandlerRoleAll === "string" && record.LSHandlerRoleAll) ||
        (typeof record.LSHandlerRoleViewer === "string" && record.LSHandlerRoleViewer) ||
        null;
      if (role) {
        candidate = role;
      }
    }
    return candidate;
  };
  return (_a = resolveScheme("http")) !== null && _a !== void 0 ? _a : resolveScheme("https");
}
function detectDefaultChromiumExecutableLinux() {
  var desktopId =
    execText("xdg-settings", ["get", "default-web-browser"]) ||
    execText("xdg-mime", ["query", "default", "x-scheme-handler/http"]);
  if (!desktopId) {
    return null;
  }
  var trimmed = desktopId.trim();
  if (!CHROMIUM_DESKTOP_IDS.has(trimmed)) {
    return null;
  }
  var desktopPath = findDesktopFilePath(trimmed);
  if (!desktopPath) {
    return null;
  }
  var execLine = readDesktopExecLine(desktopPath);
  if (!execLine) {
    return null;
  }
  var command = extractExecutableFromExecLine(execLine);
  if (!command) {
    return null;
  }
  var resolved = resolveLinuxExecutablePath(command);
  if (!resolved) {
    return null;
  }
  var exeName = node_path_1.default.posix.basename(resolved).toLowerCase();
  if (!CHROMIUM_EXE_NAMES.has(exeName)) {
    return null;
  }
  return { kind: inferKindFromExecutableName(exeName), path: resolved };
}
function detectDefaultChromiumExecutableWindows() {
  var progId = readWindowsProgId();
  var command =
    (progId ? readWindowsCommandForProgId(progId) : null) || readWindowsCommandForProgId("http");
  if (!command) {
    return null;
  }
  var expanded = expandWindowsEnvVars(command);
  var exePath = extractWindowsExecutablePath(expanded);
  if (!exePath) {
    return null;
  }
  if (!exists(exePath)) {
    return null;
  }
  var exeName = node_path_1.default.win32.basename(exePath).toLowerCase();
  if (!CHROMIUM_EXE_NAMES.has(exeName)) {
    return null;
  }
  return { kind: inferKindFromExecutableName(exeName), path: exePath };
}
function findDesktopFilePath(desktopId) {
  var candidates = [
    node_path_1.default.join(
      node_os_1.default.homedir(),
      ".local",
      "share",
      "applications",
      desktopId,
    ),
    node_path_1.default.join("/usr/local/share/applications", desktopId),
    node_path_1.default.join("/usr/share/applications", desktopId),
    node_path_1.default.join("/var/lib/snapd/desktop/applications", desktopId),
  ];
  for (var _i = 0, candidates_1 = candidates; _i < candidates_1.length; _i++) {
    var candidate = candidates_1[_i];
    if (exists(candidate)) {
      return candidate;
    }
  }
  return null;
}
function readDesktopExecLine(desktopPath) {
  try {
    var raw = node_fs_1.default.readFileSync(desktopPath, "utf8");
    var lines = raw.split(/\r?\n/);
    for (var _i = 0, lines_1 = lines; _i < lines_1.length; _i++) {
      var line = lines_1[_i];
      if (line.startsWith("Exec=")) {
        return line.slice("Exec=".length).trim();
      }
    }
  } catch (_a) {
    // ignore
  }
  return null;
}
function extractExecutableFromExecLine(execLine) {
  var tokens = splitExecLine(execLine);
  for (var _i = 0, tokens_1 = tokens; _i < tokens_1.length; _i++) {
    var token = tokens_1[_i];
    if (!token) {
      continue;
    }
    if (token === "env") {
      continue;
    }
    if (token.includes("=") && !token.startsWith("/") && !token.includes("\\")) {
      continue;
    }
    return token.replace(/^["']|["']$/g, "");
  }
  return null;
}
function splitExecLine(line) {
  var tokens = [];
  var current = "";
  var inQuotes = false;
  var quoteChar = "";
  for (var i = 0; i < line.length; i += 1) {
    var ch = line[i];
    if ((ch === '"' || ch === "'") && (!inQuotes || ch === quoteChar)) {
      if (inQuotes) {
        inQuotes = false;
        quoteChar = "";
      } else {
        inQuotes = true;
        quoteChar = ch;
      }
      continue;
    }
    if (!inQuotes && /\s/.test(ch)) {
      if (current) {
        tokens.push(current);
        current = "";
      }
      continue;
    }
    current += ch;
  }
  if (current) {
    tokens.push(current);
  }
  return tokens;
}
function resolveLinuxExecutablePath(command) {
  var cleaned = command.trim().replace(/%[a-zA-Z]/g, "");
  if (!cleaned) {
    return null;
  }
  if (cleaned.startsWith("/")) {
    return cleaned;
  }
  var resolved = execText("which", [cleaned], 800);
  return resolved ? resolved.trim() : null;
}
function readWindowsProgId() {
  var _a;
  var output = execText("reg", [
    "query",
    "HKCU\\Software\\Microsoft\\Windows\\Shell\\Associations\\UrlAssociations\\http\\UserChoice",
    "/v",
    "ProgId",
  ]);
  if (!output) {
    return null;
  }
  var match = output.match(/ProgId\s+REG_\w+\s+(.+)$/im);
  return (
    ((_a = match === null || match === void 0 ? void 0 : match[1]) === null || _a === void 0
      ? void 0
      : _a.trim()) || null
  );
}
function readWindowsCommandForProgId(progId) {
  var _a;
  var key =
    progId === "http"
      ? "HKCR\\http\\shell\\open\\command"
      : "HKCR\\".concat(progId, "\\shell\\open\\command");
  var output = execText("reg", ["query", key, "/ve"]);
  if (!output) {
    return null;
  }
  var match = output.match(/REG_\w+\s+(.+)$/im);
  return (
    ((_a = match === null || match === void 0 ? void 0 : match[1]) === null || _a === void 0
      ? void 0
      : _a.trim()) || null
  );
}
function expandWindowsEnvVars(value) {
  return value.replace(/%([^%]+)%/g, function (_match, name) {
    var _a;
    var key = String(name !== null && name !== void 0 ? name : "").trim();
    return key
      ? (_a = process.env[key]) !== null && _a !== void 0
        ? _a
        : "%".concat(key, "%")
      : _match;
  });
}
function extractWindowsExecutablePath(command) {
  var quoted = command.match(/"([^"]+\\.exe)"/i);
  if (quoted === null || quoted === void 0 ? void 0 : quoted[1]) {
    return quoted[1];
  }
  var unquoted = command.match(/([^\\s]+\\.exe)/i);
  if (unquoted === null || unquoted === void 0 ? void 0 : unquoted[1]) {
    return unquoted[1];
  }
  return null;
}
function findFirstExecutable(candidates) {
  for (var _i = 0, candidates_2 = candidates; _i < candidates_2.length; _i++) {
    var candidate = candidates_2[_i];
    if (exists(candidate.path)) {
      return candidate;
    }
  }
  return null;
}
function findChromeExecutableMac() {
  var candidates = [
    {
      kind: "chrome",
      path: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
    },
    {
      kind: "chrome",
      path: node_path_1.default.join(
        node_os_1.default.homedir(),
        "Applications/Google Chrome.app/Contents/MacOS/Google Chrome",
      ),
    },
    {
      kind: "brave",
      path: "/Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
    },
    {
      kind: "brave",
      path: node_path_1.default.join(
        node_os_1.default.homedir(),
        "Applications/Brave Browser.app/Contents/MacOS/Brave Browser",
      ),
    },
    {
      kind: "edge",
      path: "/Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
    },
    {
      kind: "edge",
      path: node_path_1.default.join(
        node_os_1.default.homedir(),
        "Applications/Microsoft Edge.app/Contents/MacOS/Microsoft Edge",
      ),
    },
    {
      kind: "chromium",
      path: "/Applications/Chromium.app/Contents/MacOS/Chromium",
    },
    {
      kind: "chromium",
      path: node_path_1.default.join(
        node_os_1.default.homedir(),
        "Applications/Chromium.app/Contents/MacOS/Chromium",
      ),
    },
    {
      kind: "canary",
      path: "/Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
    },
    {
      kind: "canary",
      path: node_path_1.default.join(
        node_os_1.default.homedir(),
        "Applications/Google Chrome Canary.app/Contents/MacOS/Google Chrome Canary",
      ),
    },
  ];
  return findFirstExecutable(candidates);
}
function findChromeExecutableLinux() {
  var candidates = [
    { kind: "chrome", path: "/usr/bin/google-chrome" },
    { kind: "chrome", path: "/usr/bin/google-chrome-stable" },
    { kind: "chrome", path: "/usr/bin/chrome" },
    { kind: "brave", path: "/usr/bin/brave-browser" },
    { kind: "brave", path: "/usr/bin/brave-browser-stable" },
    { kind: "brave", path: "/usr/bin/brave" },
    { kind: "brave", path: "/snap/bin/brave" },
    { kind: "edge", path: "/usr/bin/microsoft-edge" },
    { kind: "edge", path: "/usr/bin/microsoft-edge-stable" },
    { kind: "chromium", path: "/usr/bin/chromium" },
    { kind: "chromium", path: "/usr/bin/chromium-browser" },
    { kind: "chromium", path: "/snap/bin/chromium" },
  ];
  return findFirstExecutable(candidates);
}
function findChromeExecutableWindows() {
  var _a, _b, _c;
  var localAppData = (_a = process.env.LOCALAPPDATA) !== null && _a !== void 0 ? _a : "";
  var programFiles =
    (_b = process.env.ProgramFiles) !== null && _b !== void 0 ? _b : "C:\\Program Files";
  // Must use bracket notation: variable name contains parentheses
  var programFilesX86 =
    (_c = process.env["ProgramFiles(x86)"]) !== null && _c !== void 0
      ? _c
      : "C:\\Program Files (x86)";
  var joinWin = node_path_1.default.win32.join;
  var candidates = [];
  if (localAppData) {
    // Chrome (user install)
    candidates.push({
      kind: "chrome",
      path: joinWin(localAppData, "Google", "Chrome", "Application", "chrome.exe"),
    });
    // Brave (user install)
    candidates.push({
      kind: "brave",
      path: joinWin(localAppData, "BraveSoftware", "Brave-Browser", "Application", "brave.exe"),
    });
    // Edge (user install)
    candidates.push({
      kind: "edge",
      path: joinWin(localAppData, "Microsoft", "Edge", "Application", "msedge.exe"),
    });
    // Chromium (user install)
    candidates.push({
      kind: "chromium",
      path: joinWin(localAppData, "Chromium", "Application", "chrome.exe"),
    });
    // Chrome Canary (user install)
    candidates.push({
      kind: "canary",
      path: joinWin(localAppData, "Google", "Chrome SxS", "Application", "chrome.exe"),
    });
  }
  // Chrome (system install, 64-bit)
  candidates.push({
    kind: "chrome",
    path: joinWin(programFiles, "Google", "Chrome", "Application", "chrome.exe"),
  });
  // Chrome (system install, 32-bit on 64-bit Windows)
  candidates.push({
    kind: "chrome",
    path: joinWin(programFilesX86, "Google", "Chrome", "Application", "chrome.exe"),
  });
  // Brave (system install, 64-bit)
  candidates.push({
    kind: "brave",
    path: joinWin(programFiles, "BraveSoftware", "Brave-Browser", "Application", "brave.exe"),
  });
  // Brave (system install, 32-bit on 64-bit Windows)
  candidates.push({
    kind: "brave",
    path: joinWin(programFilesX86, "BraveSoftware", "Brave-Browser", "Application", "brave.exe"),
  });
  // Edge (system install, 64-bit)
  candidates.push({
    kind: "edge",
    path: joinWin(programFiles, "Microsoft", "Edge", "Application", "msedge.exe"),
  });
  // Edge (system install, 32-bit on 64-bit Windows)
  candidates.push({
    kind: "edge",
    path: joinWin(programFilesX86, "Microsoft", "Edge", "Application", "msedge.exe"),
  });
  return findFirstExecutable(candidates);
}
function resolveBrowserExecutableForPlatform(resolved, platform) {
  if (resolved.executablePath) {
    if (!exists(resolved.executablePath)) {
      throw new Error("browser.executablePath not found: ".concat(resolved.executablePath));
    }
    return { kind: "custom", path: resolved.executablePath };
  }
  var detected = detectDefaultChromiumExecutable(platform);
  if (detected) {
    return detected;
  }
  if (platform === "darwin") {
    return findChromeExecutableMac();
  }
  if (platform === "linux") {
    return findChromeExecutableLinux();
  }
  if (platform === "win32") {
    return findChromeExecutableWindows();
  }
  return null;
}
