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
exports.registerBrowserAgentSnapshotRoutes = registerBrowserAgentSnapshotRoutes;
var node_path_1 = require("node:path");
var store_js_1 = require("../../media/store.js");
var cdp_js_1 = require("../cdp.js");
var constants_js_1 = require("../constants.js");
var screenshot_js_1 = require("../screenshot.js");
var agent_shared_js_1 = require("./agent.shared.js");
var utils_js_1 = require("./utils.js");
function registerBrowserAgentSnapshotRoutes(app, ctx) {
  var _this = this;
  app.post("/navigate", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, url, targetId, tab, pw, result, err_1;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            url = (0, utils_js_1.toStringOrEmpty)(body.url);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            if (!url) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "url is required")];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "navigate")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.navigateViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                url: url,
              }),
            ];
          case 4:
            result = _a.sent();
            res.json(__assign({ ok: true, targetId: tab.targetId }, result));
            return [3 /*break*/, 6];
          case 5:
            err_1 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_1);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/pdf", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, tab, pw, pdf, saved, err_2;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            _a.label = 1;
          case 1:
            _a.trys.push([1, 7, , 8]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "pdf")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.pdfViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
              }),
            ];
          case 4:
            pdf = _a.sent();
            return [4 /*yield*/, (0, store_js_1.ensureMediaDir)()];
          case 5:
            _a.sent();
            return [
              4 /*yield*/,
              (0, store_js_1.saveMediaBuffer)(
                pdf.buffer,
                "application/pdf",
                "browser",
                pdf.buffer.byteLength,
              ),
            ];
          case 6:
            saved = _a.sent();
            res.json({
              ok: true,
              path: node_path_1.default.resolve(saved.path),
              targetId: tab.targetId,
              url: tab.url,
            });
            return [3 /*break*/, 8];
          case 7:
            err_2 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_2);
            return [3 /*break*/, 8];
          case 8:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/screenshot", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx,
        body,
        targetId,
        fullPage,
        ref,
        element,
        type,
        tab,
        buffer,
        shouldUsePlaywright,
        pw,
        snap,
        normalized,
        saved,
        err_3;
      var _a, _b, _c;
      return __generator(this, function (_d) {
        switch (_d.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            fullPage =
              (_a = (0, utils_js_1.toBoolean)(body.fullPage)) !== null && _a !== void 0
                ? _a
                : false;
            ref = (0, utils_js_1.toStringOrEmpty)(body.ref) || undefined;
            element = (0, utils_js_1.toStringOrEmpty)(body.element) || undefined;
            type = body.type === "jpeg" ? "jpeg" : "png";
            if (fullPage && (ref || element)) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(
                  res,
                  400,
                  "fullPage is not supported for element screenshots",
                ),
              ];
            }
            _d.label = 1;
          case 1:
            _d.trys.push([1, 11, , 12]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _d.sent();
            buffer = void 0;
            shouldUsePlaywright =
              profileCtx.profile.driver === "extension" ||
              !tab.wsUrl ||
              Boolean(ref) ||
              Boolean(element);
            if (!shouldUsePlaywright) {
              return [3 /*break*/, 5];
            }
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "screenshot")];
          case 3:
            pw = _d.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.takeScreenshotViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                ref: ref,
                element: element,
                fullPage: fullPage,
                type: type,
              }),
            ];
          case 4:
            snap = _d.sent();
            buffer = snap.buffer;
            return [3 /*break*/, 7];
          case 5:
            return [
              4 /*yield*/,
              (0, cdp_js_1.captureScreenshot)({
                wsUrl: (_b = tab.wsUrl) !== null && _b !== void 0 ? _b : "",
                fullPage: fullPage,
                format: type,
                quality: type === "jpeg" ? 85 : undefined,
              }),
            ];
          case 6:
            buffer = _d.sent();
            _d.label = 7;
          case 7:
            return [
              4 /*yield*/,
              (0, screenshot_js_1.normalizeBrowserScreenshot)(buffer, {
                maxSide: screenshot_js_1.DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE,
                maxBytes: screenshot_js_1.DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES,
              }),
            ];
          case 8:
            normalized = _d.sent();
            return [4 /*yield*/, (0, store_js_1.ensureMediaDir)()];
          case 9:
            _d.sent();
            return [
              4 /*yield*/,
              (0, store_js_1.saveMediaBuffer)(
                normalized.buffer,
                (_c = normalized.contentType) !== null && _c !== void 0
                  ? _c
                  : "image/".concat(type),
                "browser",
                screenshot_js_1.DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES,
              ),
            ];
          case 10:
            saved = _d.sent();
            res.json({
              ok: true,
              path: node_path_1.default.resolve(saved.path),
              targetId: tab.targetId,
              url: tab.url,
            });
            return [3 /*break*/, 12];
          case 11:
            err_3 = _d.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_3);
            return [3 /*break*/, 12];
          case 12:
            return [2 /*return*/];
        }
      });
    });
  });
  app.get("/snapshot", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx,
        targetId,
        mode,
        labels,
        explicitFormat,
        format,
        _a,
        _b,
        limitRaw,
        hasMaxChars,
        maxCharsRaw,
        limit,
        maxChars,
        resolvedMaxChars,
        interactiveRaw,
        compactRaw,
        depthRaw,
        refsModeRaw,
        refsMode,
        interactive,
        compact,
        depth,
        selector,
        frameSelector,
        tab_1,
        pw_1,
        wantsRoleSnapshot,
        snap_1,
        _c,
        labeled,
        normalized,
        saved,
        imageType,
        snap,
        resolved,
        err_4;
      var _this = this;
      var _d, _e, _f, _g;
      return __generator(this, function (_h) {
        switch (_h.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            targetId = typeof req.query.targetId === "string" ? req.query.targetId.trim() : "";
            mode = req.query.mode === "efficient" ? "efficient" : undefined;
            labels =
              (_d = (0, utils_js_1.toBoolean)(req.query.labels)) !== null && _d !== void 0
                ? _d
                : undefined;
            explicitFormat =
              req.query.format === "aria" ? "aria" : req.query.format === "ai" ? "ai" : undefined;
            if (!(explicitFormat !== null && explicitFormat !== void 0)) {
              return [3 /*break*/, 1];
            }
            _a = explicitFormat;
            return [3 /*break*/, 5];
          case 1:
            if (!mode) {
              return [3 /*break*/, 2];
            }
            _b = "ai";
            return [3 /*break*/, 4];
          case 2:
            return [4 /*yield*/, (0, agent_shared_js_1.getPwAiModule)()];
          case 3:
            _b = _h.sent() ? "ai" : "aria";
            _h.label = 4;
          case 4:
            _a = _b;
            _h.label = 5;
          case 5:
            format = _a;
            limitRaw = typeof req.query.limit === "string" ? Number(req.query.limit) : undefined;
            hasMaxChars = Object.hasOwn(req.query, "maxChars");
            maxCharsRaw =
              typeof req.query.maxChars === "string" ? Number(req.query.maxChars) : undefined;
            limit = Number.isFinite(limitRaw) ? limitRaw : undefined;
            maxChars =
              typeof maxCharsRaw === "number" && Number.isFinite(maxCharsRaw) && maxCharsRaw > 0
                ? Math.floor(maxCharsRaw)
                : undefined;
            resolvedMaxChars =
              format === "ai"
                ? hasMaxChars
                  ? maxChars
                  : mode === "efficient"
                    ? constants_js_1.DEFAULT_AI_SNAPSHOT_EFFICIENT_MAX_CHARS
                    : constants_js_1.DEFAULT_AI_SNAPSHOT_MAX_CHARS
                : undefined;
            interactiveRaw = (0, utils_js_1.toBoolean)(req.query.interactive);
            compactRaw = (0, utils_js_1.toBoolean)(req.query.compact);
            depthRaw = (0, utils_js_1.toNumber)(req.query.depth);
            refsModeRaw = (0, utils_js_1.toStringOrEmpty)(req.query.refs).trim();
            refsMode =
              refsModeRaw === "aria" ? "aria" : refsModeRaw === "role" ? "role" : undefined;
            interactive =
              interactiveRaw !== null && interactiveRaw !== void 0
                ? interactiveRaw
                : mode === "efficient"
                  ? true
                  : undefined;
            compact =
              compactRaw !== null && compactRaw !== void 0
                ? compactRaw
                : mode === "efficient"
                  ? true
                  : undefined;
            depth =
              depthRaw !== null && depthRaw !== void 0
                ? depthRaw
                : mode === "efficient"
                  ? constants_js_1.DEFAULT_AI_SNAPSHOT_EFFICIENT_DEPTH
                  : undefined;
            selector = (0, utils_js_1.toStringOrEmpty)(req.query.selector);
            frameSelector = (0, utils_js_1.toStringOrEmpty)(req.query.frame);
            _h.label = 6;
          case 6:
            _h.trys.push([6, 20, , 21]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId || undefined)];
          case 7:
            tab_1 = _h.sent();
            if ((labels || mode === "efficient") && format === "aria") {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, 400, "labels/mode=efficient require format=ai"),
              ];
            }
            if (!(format === "ai")) {
              return [3 /*break*/, 18];
            }
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "ai snapshot")];
          case 8:
            pw_1 = _h.sent();
            if (!pw_1) {
              return [2 /*return*/];
            }
            wantsRoleSnapshot =
              labels === true ||
              mode === "efficient" ||
              interactive === true ||
              compact === true ||
              depth !== undefined ||
              Boolean(selector.trim()) ||
              Boolean(frameSelector.trim());
            if (!wantsRoleSnapshot) {
              return [3 /*break*/, 10];
            }
            return [
              4 /*yield*/,
              pw_1.snapshotRoleViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab_1.targetId,
                selector: selector.trim() || undefined,
                frameSelector: frameSelector.trim() || undefined,
                refsMode: refsMode,
                options: {
                  interactive:
                    interactive !== null && interactive !== void 0 ? interactive : undefined,
                  compact: compact !== null && compact !== void 0 ? compact : undefined,
                  maxDepth: depth !== null && depth !== void 0 ? depth : undefined,
                },
              }),
            ];
          case 9:
            _c = _h.sent();
            return [3 /*break*/, 12];
          case 10:
            return [
              4 /*yield*/,
              pw_1
                .snapshotAiViaPlaywright(
                  __assign(
                    { cdpUrl: profileCtx.profile.cdpUrl, targetId: tab_1.targetId },
                    typeof resolvedMaxChars === "number" ? { maxChars: resolvedMaxChars } : {},
                  ),
                )
                .catch(function (err) {
                  return __awaiter(_this, void 0, void 0, function () {
                    return __generator(this, function (_a) {
                      switch (_a.label) {
                        case 0:
                          if (!String(err).toLowerCase().includes("_snapshotforai")) {
                            return [3 /*break*/, 2];
                          }
                          return [
                            4 /*yield*/,
                            pw_1.snapshotRoleViaPlaywright({
                              cdpUrl: profileCtx.profile.cdpUrl,
                              targetId: tab_1.targetId,
                              selector: selector.trim() || undefined,
                              frameSelector: frameSelector.trim() || undefined,
                              refsMode: refsMode,
                              options: {
                                interactive:
                                  interactive !== null && interactive !== void 0
                                    ? interactive
                                    : undefined,
                                compact:
                                  compact !== null && compact !== void 0 ? compact : undefined,
                                maxDepth: depth !== null && depth !== void 0 ? depth : undefined,
                              },
                            }),
                          ];
                        case 1:
                          return [2 /*return*/, _a.sent()];
                        case 2:
                          throw err;
                      }
                    });
                  });
                }),
            ];
          case 11:
            _c = _h.sent();
            _h.label = 12;
          case 12:
            snap_1 = _c;
            if (!labels) {
              return [3 /*break*/, 17];
            }
            return [
              4 /*yield*/,
              pw_1.screenshotWithLabelsViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab_1.targetId,
                refs: "refs" in snap_1 ? snap_1.refs : {},
                type: "png",
              }),
            ];
          case 13:
            labeled = _h.sent();
            return [
              4 /*yield*/,
              (0, screenshot_js_1.normalizeBrowserScreenshot)(labeled.buffer, {
                maxSide: screenshot_js_1.DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE,
                maxBytes: screenshot_js_1.DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES,
              }),
            ];
          case 14:
            normalized = _h.sent();
            return [4 /*yield*/, (0, store_js_1.ensureMediaDir)()];
          case 15:
            _h.sent();
            return [
              4 /*yield*/,
              (0, store_js_1.saveMediaBuffer)(
                normalized.buffer,
                (_e = normalized.contentType) !== null && _e !== void 0 ? _e : "image/png",
                "browser",
                screenshot_js_1.DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES,
              ),
            ];
          case 16:
            saved = _h.sent();
            imageType = (
              (_f = normalized.contentType) === null || _f === void 0 ? void 0 : _f.includes("jpeg")
            )
              ? "jpeg"
              : "png";
            return [
              2 /*return*/,
              res.json(
                __assign(
                  {
                    ok: true,
                    format: format,
                    targetId: tab_1.targetId,
                    url: tab_1.url,
                    labels: true,
                    labelsCount: labeled.labels,
                    labelsSkipped: labeled.skipped,
                    imagePath: node_path_1.default.resolve(saved.path),
                    imageType: imageType,
                  },
                  snap_1,
                ),
              ),
            ];
          case 17:
            return [
              2 /*return*/,
              res.json(
                __assign(
                  { ok: true, format: format, targetId: tab_1.targetId, url: tab_1.url },
                  snap_1,
                ),
              ),
            ];
          case 18:
            snap =
              profileCtx.profile.driver === "extension" || !tab_1.wsUrl
                ? (function () {
                    // Extension relay doesn't expose per-page WS URLs; run AX snapshot via Playwright CDP session.
                    // Also covers cases where wsUrl is missing/unusable.
                    return (0, agent_shared_js_1.requirePwAi)(res, "aria snapshot").then(
                      function (pw) {
                        return __awaiter(_this, void 0, void 0, function () {
                          return __generator(this, function (_a) {
                            switch (_a.label) {
                              case 0:
                                if (!pw) {
                                  return [2 /*return*/, null];
                                }
                                return [
                                  4 /*yield*/,
                                  pw.snapshotAriaViaPlaywright({
                                    cdpUrl: profileCtx.profile.cdpUrl,
                                    targetId: tab_1.targetId,
                                    limit: limit,
                                  }),
                                ];
                              case 1:
                                return [2 /*return*/, _a.sent()];
                            }
                          });
                        });
                      },
                    );
                  })()
                : (0, cdp_js_1.snapshotAria)({
                    wsUrl: (_g = tab_1.wsUrl) !== null && _g !== void 0 ? _g : "",
                    limit: limit,
                  });
            return [4 /*yield*/, Promise.resolve(snap)];
          case 19:
            resolved = _h.sent();
            if (!resolved) {
              return [2 /*return*/];
            }
            return [
              2 /*return*/,
              res.json(
                __assign(
                  { ok: true, format: format, targetId: tab_1.targetId, url: tab_1.url },
                  resolved,
                ),
              ),
            ];
          case 20:
            err_4 = _h.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_4);
            return [3 /*break*/, 21];
          case 21:
            return [2 /*return*/];
        }
      });
    });
  });
}
