"use strict";
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
          if (t[0] & 1) {
            throw t[1];
          }
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
      if (f) {
        throw new TypeError("Generator is already executing.");
      }
      while ((g && ((g = 0), op[0] && (_ = 0)), _)) {
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
      }
      if (op[0] & 5) {
        throw op[1];
      }
      return { value: op[0] ? op[1] : void 0, done: true };
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.snapshotAriaViaPlaywright = snapshotAriaViaPlaywright;
exports.snapshotAiViaPlaywright = snapshotAiViaPlaywright;
exports.snapshotRoleViaPlaywright = snapshotRoleViaPlaywright;
exports.navigateViaPlaywright = navigateViaPlaywright;
exports.resizeViewportViaPlaywright = resizeViewportViaPlaywright;
exports.closePageViaPlaywright = closePageViaPlaywright;
exports.pdfViaPlaywright = pdfViaPlaywright;
var cdp_js_1 = require("./cdp.js");
var pw_role_snapshot_js_1 = require("./pw-role-snapshot.js");
var pw_session_js_1 = require("./pw-session.js");
function snapshotAriaViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var limit, page, session, res, nodes;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          limit = Math.max(
            1,
            Math.min(2000, Math.floor((_a = opts.limit) !== null && _a !== void 0 ? _a : 500)),
          );
          return [
            4 /*yield*/,
            (0, pw_session_js_1.getPageForTargetId)({
              cdpUrl: opts.cdpUrl,
              targetId: opts.targetId,
            }),
          ];
        case 1:
          page = _b.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          return [4 /*yield*/, page.context().newCDPSession(page)];
        case 2:
          session = _b.sent();
          _b.label = 3;
        case 3:
          _b.trys.push([3, , 6, 8]);
          return [4 /*yield*/, session.send("Accessibility.enable").catch(function () {})];
        case 4:
          _b.sent();
          return [4 /*yield*/, session.send("Accessibility.getFullAXTree")];
        case 5:
          res = _b.sent();
          nodes = Array.isArray(res === null || res === void 0 ? void 0 : res.nodes)
            ? res.nodes
            : [];
          return [2 /*return*/, { nodes: (0, cdp_js_1.formatAriaSnapshot)(nodes, limit) }];
        case 6:
          return [4 /*yield*/, session.detach().catch(function () {})];
        case 7:
          _b.sent();
          return [7 /*endfinally*/];
        case 8:
          return [2 /*return*/];
      }
    });
  });
}
function snapshotAiViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, maybe, result, snapshot, maxChars, limit, truncated, built;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, pw_session_js_1.getPageForTargetId)({
              cdpUrl: opts.cdpUrl,
              targetId: opts.targetId,
            }),
          ];
        case 1:
          page = _c.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          maybe = page;
          if (!maybe._snapshotForAI) {
            throw new Error("Playwright _snapshotForAI is not available. Upgrade playwright-core.");
          }
          return [
            4 /*yield*/,
            maybe._snapshotForAI({
              timeout: Math.max(
                500,
                Math.min(
                  60000,
                  Math.floor((_a = opts.timeoutMs) !== null && _a !== void 0 ? _a : 5000),
                ),
              ),
              track: "response",
            }),
          ];
        case 2:
          result = _c.sent();
          snapshot = String(
            (_b = result === null || result === void 0 ? void 0 : result.full) !== null &&
              _b !== void 0
              ? _b
              : "",
          );
          maxChars = opts.maxChars;
          limit =
            typeof maxChars === "number" && Number.isFinite(maxChars) && maxChars > 0
              ? Math.floor(maxChars)
              : undefined;
          truncated = false;
          if (limit && snapshot.length > limit) {
            snapshot = "".concat(snapshot.slice(0, limit), "\n\n[...TRUNCATED - page too large]");
            truncated = true;
          }
          built = (0, pw_role_snapshot_js_1.buildRoleSnapshotFromAiSnapshot)(snapshot);
          (0, pw_session_js_1.storeRoleRefsForTarget)({
            page: page,
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            refs: built.refs,
            mode: "aria",
          });
          return [
            2 /*return*/,
            truncated
              ? { snapshot: snapshot, truncated: truncated, refs: built.refs }
              : { snapshot: snapshot, refs: built.refs },
          ];
      }
    });
  });
}
function snapshotRoleViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, maybe, result, built_1, frameSelector, selector, locator, ariaSnapshot, built;
    var _a, _b, _c, _d, _e;
    return __generator(this, function (_f) {
      switch (_f.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, pw_session_js_1.getPageForTargetId)({
              cdpUrl: opts.cdpUrl,
              targetId: opts.targetId,
            }),
          ];
        case 1:
          page = _f.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          if (!(opts.refsMode === "aria")) {
            return [3 /*break*/, 3];
          }
          if (
            ((_a = opts.selector) === null || _a === void 0 ? void 0 : _a.trim()) ||
            ((_b = opts.frameSelector) === null || _b === void 0 ? void 0 : _b.trim())
          ) {
            throw new Error("refs=aria does not support selector/frame snapshots yet.");
          }
          maybe = page;
          if (!maybe._snapshotForAI) {
            throw new Error("refs=aria requires Playwright _snapshotForAI support.");
          }
          return [
            4 /*yield*/,
            maybe._snapshotForAI({
              timeout: 5000,
              track: "response",
            }),
          ];
        case 2:
          result = _f.sent();
          built_1 = (0, pw_role_snapshot_js_1.buildRoleSnapshotFromAiSnapshot)(
            String(
              (_c = result === null || result === void 0 ? void 0 : result.full) !== null &&
                _c !== void 0
                ? _c
                : "",
            ),
            opts.options,
          );
          (0, pw_session_js_1.storeRoleRefsForTarget)({
            page: page,
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            refs: built_1.refs,
            mode: "aria",
          });
          return [
            2 /*return*/,
            {
              snapshot: built_1.snapshot,
              refs: built_1.refs,
              stats: (0, pw_role_snapshot_js_1.getRoleSnapshotStats)(
                built_1.snapshot,
                built_1.refs,
              ),
            },
          ];
        case 3:
          frameSelector =
            ((_d = opts.frameSelector) === null || _d === void 0 ? void 0 : _d.trim()) || "";
          selector = ((_e = opts.selector) === null || _e === void 0 ? void 0 : _e.trim()) || "";
          locator = frameSelector
            ? selector
              ? page.frameLocator(frameSelector).locator(selector)
              : page.frameLocator(frameSelector).locator(":root")
            : selector
              ? page.locator(selector)
              : page.locator(":root");
          return [4 /*yield*/, locator.ariaSnapshot()];
        case 4:
          ariaSnapshot = _f.sent();
          built = (0, pw_role_snapshot_js_1.buildRoleSnapshotFromAriaSnapshot)(
            String(ariaSnapshot !== null && ariaSnapshot !== void 0 ? ariaSnapshot : ""),
            opts.options,
          );
          (0, pw_session_js_1.storeRoleRefsForTarget)({
            page: page,
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            refs: built.refs,
            frameSelector: frameSelector || undefined,
            mode: "role",
          });
          return [
            2 /*return*/,
            {
              snapshot: built.snapshot,
              refs: built.refs,
              stats: (0, pw_role_snapshot_js_1.getRoleSnapshotStats)(built.snapshot, built.refs),
            },
          ];
      }
    });
  });
}
function navigateViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var url, page;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          url = String((_a = opts.url) !== null && _a !== void 0 ? _a : "").trim();
          if (!url) {
            throw new Error("url is required");
          }
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _c.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          return [
            4 /*yield*/,
            page.goto(url, {
              timeout: Math.max(
                1000,
                Math.min(120000, (_b = opts.timeoutMs) !== null && _b !== void 0 ? _b : 20000),
              ),
            }),
          ];
        case 2:
          _c.sent();
          return [2 /*return*/, { url: page.url() }];
      }
    });
  });
}
function resizeViewportViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _a.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          return [
            4 /*yield*/,
            page.setViewportSize({
              width: Math.max(1, Math.floor(opts.width)),
              height: Math.max(1, Math.floor(opts.height)),
            }),
          ];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function closePageViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _a.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          return [4 /*yield*/, page.close()];
        case 2:
          _a.sent();
          return [2 /*return*/];
      }
    });
  });
}
function pdfViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, buffer;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _a.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          return [4 /*yield*/, page.pdf({ printBackground: true })];
        case 2:
          buffer = _a.sent();
          return [2 /*return*/, { buffer: buffer }];
      }
    });
  });
}
