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
exports.buildEmbeddedSandboxInfo = buildEmbeddedSandboxInfo;
function buildEmbeddedSandboxInfo(sandbox, execElevated) {
  var _a, _b, _c;
  if (!(sandbox === null || sandbox === void 0 ? void 0 : sandbox.enabled)) {
    return undefined;
  }
  var elevatedAllowed = Boolean(
    (execElevated === null || execElevated === void 0 ? void 0 : execElevated.enabled) &&
    execElevated.allowed,
  );
  return __assign(
    {
      enabled: true,
      workspaceDir: sandbox.workspaceDir,
      workspaceAccess: sandbox.workspaceAccess,
      agentWorkspaceMount: sandbox.workspaceAccess === "ro" ? "/agent" : undefined,
      browserBridgeUrl: (_a = sandbox.browser) === null || _a === void 0 ? void 0 : _a.bridgeUrl,
      browserNoVncUrl: (_b = sandbox.browser) === null || _b === void 0 ? void 0 : _b.noVncUrl,
      hostBrowserAllowed: sandbox.browserAllowHostControl,
    },
    elevatedAllowed
      ? {
          elevated: {
            allowed: true,
            defaultLevel:
              (_c =
                execElevated === null || execElevated === void 0
                  ? void 0
                  : execElevated.defaultLevel) !== null && _c !== void 0
                ? _c
                : "off",
          },
        }
      : {},
  );
}
