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
exports.registerBrowserAgentActRoutes = registerBrowserAgentActRoutes;
var agent_act_shared_js_1 = require("./agent.act.shared.js");
var agent_shared_js_1 = require("./agent.shared.js");
var utils_js_1 = require("./utils.js");
function registerBrowserAgentActRoutes(app, ctx) {
  var _this = this;
  app.post("/act", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx,
        body,
        kindRaw,
        kind,
        targetId,
        tab,
        cdpUrl,
        pw,
        evaluateEnabled,
        _a,
        ref,
        doubleClick,
        timeoutMs,
        buttonRaw,
        button,
        modifiersRaw,
        parsedModifiers,
        modifiers,
        clickRequest,
        ref,
        text,
        submit,
        slowly,
        timeoutMs,
        typeRequest,
        key,
        delayMs,
        ref,
        timeoutMs,
        ref,
        timeoutMs,
        scrollRequest,
        startRef,
        endRef,
        timeoutMs,
        ref,
        values,
        timeoutMs,
        rawFields,
        fields,
        timeoutMs,
        width,
        height,
        timeMs,
        text,
        textGone,
        selector,
        url,
        loadStateRaw,
        loadState,
        fn,
        timeoutMs,
        fn,
        ref,
        result,
        err_1;
      var _b, _c, _d, _e, _f;
      return __generator(this, function (_g) {
        switch (_g.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            kindRaw = (0, utils_js_1.toStringOrEmpty)(body.kind);
            if (!(0, agent_act_shared_js_1.isActKind)(kindRaw)) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "kind is required")];
            }
            kind = kindRaw;
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            if (Object.hasOwn(body, "selector") && kind !== "wait") {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, 400, agent_shared_js_1.SELECTOR_UNSUPPORTED_MESSAGE),
              ];
            }
            _g.label = 1;
          case 1:
            _g.trys.push([1, 30, , 31]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _g.sent();
            cdpUrl = profileCtx.profile.cdpUrl;
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "act:".concat(kind))];
          case 3:
            pw = _g.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            evaluateEnabled = ctx.state().resolved.evaluateEnabled;
            _a = kind;
            switch (_a) {
              case "click":
                return [3 /*break*/, 4];
              case "type":
                return [3 /*break*/, 6];
              case "press":
                return [3 /*break*/, 8];
              case "hover":
                return [3 /*break*/, 10];
              case "scrollIntoView":
                return [3 /*break*/, 12];
              case "drag":
                return [3 /*break*/, 14];
              case "select":
                return [3 /*break*/, 16];
              case "fill":
                return [3 /*break*/, 18];
              case "resize":
                return [3 /*break*/, 20];
              case "wait":
                return [3 /*break*/, 22];
              case "evaluate":
                return [3 /*break*/, 24];
              case "close":
                return [3 /*break*/, 26];
            }
            return [3 /*break*/, 28];
          case 4:
            ref = (0, utils_js_1.toStringOrEmpty)(body.ref);
            if (!ref) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "ref is required")];
            }
            doubleClick =
              (_b = (0, utils_js_1.toBoolean)(body.doubleClick)) !== null && _b !== void 0
                ? _b
                : false;
            timeoutMs = (0, utils_js_1.toNumber)(body.timeoutMs);
            buttonRaw = (0, utils_js_1.toStringOrEmpty)(body.button) || "";
            button = buttonRaw ? (0, agent_act_shared_js_1.parseClickButton)(buttonRaw) : undefined;
            if (buttonRaw && !button) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, 400, "button must be left|right|middle"),
              ];
            }
            modifiersRaw =
              (_c = (0, utils_js_1.toStringArray)(body.modifiers)) !== null && _c !== void 0
                ? _c
                : [];
            parsedModifiers = (0, agent_act_shared_js_1.parseClickModifiers)(modifiersRaw);
            if (parsedModifiers.error) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, parsedModifiers.error)];
            }
            modifiers = parsedModifiers.modifiers;
            clickRequest = {
              cdpUrl: cdpUrl,
              targetId: tab.targetId,
              ref: ref,
              doubleClick: doubleClick,
            };
            if (button) {
              clickRequest.button = button;
            }
            if (modifiers) {
              clickRequest.modifiers = modifiers;
            }
            if (timeoutMs) {
              clickRequest.timeoutMs = timeoutMs;
            }
            return [4 /*yield*/, pw.clickViaPlaywright(clickRequest)];
          case 5:
            _g.sent();
            return [2 /*return*/, res.json({ ok: true, targetId: tab.targetId, url: tab.url })];
          case 6:
            ref = (0, utils_js_1.toStringOrEmpty)(body.ref);
            if (!ref) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "ref is required")];
            }
            if (typeof body.text !== "string") {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "text is required")];
            }
            text = body.text;
            submit =
              (_d = (0, utils_js_1.toBoolean)(body.submit)) !== null && _d !== void 0 ? _d : false;
            slowly =
              (_e = (0, utils_js_1.toBoolean)(body.slowly)) !== null && _e !== void 0 ? _e : false;
            timeoutMs = (0, utils_js_1.toNumber)(body.timeoutMs);
            typeRequest = {
              cdpUrl: cdpUrl,
              targetId: tab.targetId,
              ref: ref,
              text: text,
              submit: submit,
              slowly: slowly,
            };
            if (timeoutMs) {
              typeRequest.timeoutMs = timeoutMs;
            }
            return [4 /*yield*/, pw.typeViaPlaywright(typeRequest)];
          case 7:
            _g.sent();
            return [2 /*return*/, res.json({ ok: true, targetId: tab.targetId })];
          case 8:
            key = (0, utils_js_1.toStringOrEmpty)(body.key);
            if (!key) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "key is required")];
            }
            delayMs = (0, utils_js_1.toNumber)(body.delayMs);
            return [
              4 /*yield*/,
              pw.pressKeyViaPlaywright({
                cdpUrl: cdpUrl,
                targetId: tab.targetId,
                key: key,
                delayMs: delayMs !== null && delayMs !== void 0 ? delayMs : undefined,
              }),
            ];
          case 9:
            _g.sent();
            return [2 /*return*/, res.json({ ok: true, targetId: tab.targetId })];
          case 10:
            ref = (0, utils_js_1.toStringOrEmpty)(body.ref);
            if (!ref) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "ref is required")];
            }
            timeoutMs = (0, utils_js_1.toNumber)(body.timeoutMs);
            return [
              4 /*yield*/,
              pw.hoverViaPlaywright({
                cdpUrl: cdpUrl,
                targetId: tab.targetId,
                ref: ref,
                timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : undefined,
              }),
            ];
          case 11:
            _g.sent();
            return [2 /*return*/, res.json({ ok: true, targetId: tab.targetId })];
          case 12:
            ref = (0, utils_js_1.toStringOrEmpty)(body.ref);
            if (!ref) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "ref is required")];
            }
            timeoutMs = (0, utils_js_1.toNumber)(body.timeoutMs);
            scrollRequest = {
              cdpUrl: cdpUrl,
              targetId: tab.targetId,
              ref: ref,
            };
            if (timeoutMs) {
              scrollRequest.timeoutMs = timeoutMs;
            }
            return [4 /*yield*/, pw.scrollIntoViewViaPlaywright(scrollRequest)];
          case 13:
            _g.sent();
            return [2 /*return*/, res.json({ ok: true, targetId: tab.targetId })];
          case 14:
            startRef = (0, utils_js_1.toStringOrEmpty)(body.startRef);
            endRef = (0, utils_js_1.toStringOrEmpty)(body.endRef);
            if (!startRef || !endRef) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, 400, "startRef and endRef are required"),
              ];
            }
            timeoutMs = (0, utils_js_1.toNumber)(body.timeoutMs);
            return [
              4 /*yield*/,
              pw.dragViaPlaywright({
                cdpUrl: cdpUrl,
                targetId: tab.targetId,
                startRef: startRef,
                endRef: endRef,
                timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : undefined,
              }),
            ];
          case 15:
            _g.sent();
            return [2 /*return*/, res.json({ ok: true, targetId: tab.targetId })];
          case 16:
            ref = (0, utils_js_1.toStringOrEmpty)(body.ref);
            values = (0, utils_js_1.toStringArray)(body.values);
            if (!ref || !(values === null || values === void 0 ? void 0 : values.length)) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, 400, "ref and values are required"),
              ];
            }
            timeoutMs = (0, utils_js_1.toNumber)(body.timeoutMs);
            return [
              4 /*yield*/,
              pw.selectOptionViaPlaywright({
                cdpUrl: cdpUrl,
                targetId: tab.targetId,
                ref: ref,
                values: values,
                timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : undefined,
              }),
            ];
          case 17:
            _g.sent();
            return [2 /*return*/, res.json({ ok: true, targetId: tab.targetId })];
          case 18:
            rawFields = Array.isArray(body.fields) ? body.fields : [];
            fields = rawFields
              .map(function (field) {
                if (!field || typeof field !== "object") {
                  return null;
                }
                var rec = field;
                var ref = (0, utils_js_1.toStringOrEmpty)(rec.ref);
                var type = (0, utils_js_1.toStringOrEmpty)(rec.type);
                if (!ref || !type) {
                  return null;
                }
                var value =
                  typeof rec.value === "string" ||
                  typeof rec.value === "number" ||
                  typeof rec.value === "boolean"
                    ? rec.value
                    : undefined;
                var parsed =
                  value === undefined
                    ? { ref: ref, type: type }
                    : { ref: ref, type: type, value: value };
                return parsed;
              })
              .filter(function (field) {
                return field !== null;
              });
            if (!fields.length) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "fields are required")];
            }
            timeoutMs = (0, utils_js_1.toNumber)(body.timeoutMs);
            return [
              4 /*yield*/,
              pw.fillFormViaPlaywright({
                cdpUrl: cdpUrl,
                targetId: tab.targetId,
                fields: fields,
                timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : undefined,
              }),
            ];
          case 19:
            _g.sent();
            return [2 /*return*/, res.json({ ok: true, targetId: tab.targetId })];
          case 20:
            width = (0, utils_js_1.toNumber)(body.width);
            height = (0, utils_js_1.toNumber)(body.height);
            if (!width || !height) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, 400, "width and height are required"),
              ];
            }
            return [
              4 /*yield*/,
              pw.resizeViewportViaPlaywright({
                cdpUrl: cdpUrl,
                targetId: tab.targetId,
                width: width,
                height: height,
              }),
            ];
          case 21:
            _g.sent();
            return [2 /*return*/, res.json({ ok: true, targetId: tab.targetId, url: tab.url })];
          case 22:
            timeMs = (0, utils_js_1.toNumber)(body.timeMs);
            text = (0, utils_js_1.toStringOrEmpty)(body.text) || undefined;
            textGone = (0, utils_js_1.toStringOrEmpty)(body.textGone) || undefined;
            selector = (0, utils_js_1.toStringOrEmpty)(body.selector) || undefined;
            url = (0, utils_js_1.toStringOrEmpty)(body.url) || undefined;
            loadStateRaw = (0, utils_js_1.toStringOrEmpty)(body.loadState);
            loadState =
              loadStateRaw === "load" ||
              loadStateRaw === "domcontentloaded" ||
              loadStateRaw === "networkidle"
                ? loadStateRaw
                : undefined;
            fn = (0, utils_js_1.toStringOrEmpty)(body.fn) || undefined;
            timeoutMs =
              (_f = (0, utils_js_1.toNumber)(body.timeoutMs)) !== null && _f !== void 0
                ? _f
                : undefined;
            if (fn && !evaluateEnabled) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(
                  res,
                  403,
                  [
                    "wait --fn is disabled by config (browser.evaluateEnabled=false).",
                    "Docs: /gateway/configuration#browser-openclaw-managed-browser",
                  ].join("\n"),
                ),
              ];
            }
            if (
              timeMs === undefined &&
              !text &&
              !textGone &&
              !selector &&
              !url &&
              !loadState &&
              !fn
            ) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(
                  res,
                  400,
                  "wait requires at least one of: timeMs, text, textGone, selector, url, loadState, fn",
                ),
              ];
            }
            return [
              4 /*yield*/,
              pw.waitForViaPlaywright({
                cdpUrl: cdpUrl,
                targetId: tab.targetId,
                timeMs: timeMs,
                text: text,
                textGone: textGone,
                selector: selector,
                url: url,
                loadState: loadState,
                fn: fn,
                timeoutMs: timeoutMs,
              }),
            ];
          case 23:
            _g.sent();
            return [2 /*return*/, res.json({ ok: true, targetId: tab.targetId })];
          case 24:
            if (!evaluateEnabled) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(
                  res,
                  403,
                  [
                    "act:evaluate is disabled by config (browser.evaluateEnabled=false).",
                    "Docs: /gateway/configuration#browser-openclaw-managed-browser",
                  ].join("\n"),
                ),
              ];
            }
            fn = (0, utils_js_1.toStringOrEmpty)(body.fn);
            if (!fn) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "fn is required")];
            }
            ref = (0, utils_js_1.toStringOrEmpty)(body.ref) || undefined;
            return [
              4 /*yield*/,
              pw.evaluateViaPlaywright({
                cdpUrl: cdpUrl,
                targetId: tab.targetId,
                fn: fn,
                ref: ref,
              }),
            ];
          case 25:
            result = _g.sent();
            return [
              2 /*return*/,
              res.json({
                ok: true,
                targetId: tab.targetId,
                url: tab.url,
                result: result,
              }),
            ];
          case 26:
            return [
              4 /*yield*/,
              pw.closePageViaPlaywright({ cdpUrl: cdpUrl, targetId: tab.targetId }),
            ];
          case 27:
            _g.sent();
            return [2 /*return*/, res.json({ ok: true, targetId: tab.targetId })];
          case 28:
            {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "unsupported kind")];
            }
            _g.label = 29;
          case 29:
            return [3 /*break*/, 31];
          case 30:
            err_1 = _g.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_1);
            return [3 /*break*/, 31];
          case 31:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/hooks/file-chooser", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, ref, inputRef, element, paths, timeoutMs, tab, pw, err_2;
      var _a;
      return __generator(this, function (_b) {
        switch (_b.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            ref = (0, utils_js_1.toStringOrEmpty)(body.ref) || undefined;
            inputRef = (0, utils_js_1.toStringOrEmpty)(body.inputRef) || undefined;
            element = (0, utils_js_1.toStringOrEmpty)(body.element) || undefined;
            paths =
              (_a = (0, utils_js_1.toStringArray)(body.paths)) !== null && _a !== void 0 ? _a : [];
            timeoutMs = (0, utils_js_1.toNumber)(body.timeoutMs);
            if (!paths.length) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "paths are required")];
            }
            _b.label = 1;
          case 1:
            _b.trys.push([1, 9, , 10]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _b.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "file chooser hook")];
          case 3:
            pw = _b.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            if (!(inputRef || element)) {
              return [3 /*break*/, 5];
            }
            if (ref) {
              return [
                2 /*return*/,
                (0, utils_js_1.jsonError)(res, 400, "ref cannot be combined with inputRef/element"),
              ];
            }
            return [
              4 /*yield*/,
              pw.setInputFilesViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                inputRef: inputRef,
                element: element,
                paths: paths,
              }),
            ];
          case 4:
            _b.sent();
            return [3 /*break*/, 8];
          case 5:
            return [
              4 /*yield*/,
              pw.armFileUploadViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                paths: paths,
                timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : undefined,
              }),
            ];
          case 6:
            _b.sent();
            if (!ref) {
              return [3 /*break*/, 8];
            }
            return [
              4 /*yield*/,
              pw.clickViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                ref: ref,
              }),
            ];
          case 7:
            _b.sent();
            _b.label = 8;
          case 8:
            res.json({ ok: true });
            return [3 /*break*/, 10];
          case 9:
            err_2 = _b.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_2);
            return [3 /*break*/, 10];
          case 10:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/hooks/dialog", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, accept, promptText, timeoutMs, tab, pw, err_3;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            accept = (0, utils_js_1.toBoolean)(body.accept);
            promptText = (0, utils_js_1.toStringOrEmpty)(body.promptText) || undefined;
            timeoutMs = (0, utils_js_1.toNumber)(body.timeoutMs);
            if (accept === undefined) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "accept is required")];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "dialog hook")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.armDialogViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                accept: accept,
                promptText: promptText,
                timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : undefined,
              }),
            ];
          case 4:
            _a.sent();
            res.json({ ok: true });
            return [3 /*break*/, 6];
          case 5:
            err_3 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_3);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/wait/download", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, out, timeoutMs, tab, pw, result, err_4;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            out = (0, utils_js_1.toStringOrEmpty)(body.path) || undefined;
            timeoutMs = (0, utils_js_1.toNumber)(body.timeoutMs);
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "wait for download")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.waitForDownloadViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                path: out,
                timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : undefined,
              }),
            ];
          case 4:
            result = _a.sent();
            res.json({ ok: true, targetId: tab.targetId, download: result });
            return [3 /*break*/, 6];
          case 5:
            err_4 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_4);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/download", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, ref, out, timeoutMs, tab, pw, result, err_5;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            ref = (0, utils_js_1.toStringOrEmpty)(body.ref);
            out = (0, utils_js_1.toStringOrEmpty)(body.path);
            timeoutMs = (0, utils_js_1.toNumber)(body.timeoutMs);
            if (!ref) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "ref is required")];
            }
            if (!out) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "path is required")];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "download")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.downloadViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                ref: ref,
                path: out,
                timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : undefined,
              }),
            ];
          case 4:
            result = _a.sent();
            res.json({ ok: true, targetId: tab.targetId, download: result });
            return [3 /*break*/, 6];
          case 5:
            err_5 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_5);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/response/body", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, url, timeoutMs, maxChars, tab, pw, result, err_6;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            url = (0, utils_js_1.toStringOrEmpty)(body.url);
            timeoutMs = (0, utils_js_1.toNumber)(body.timeoutMs);
            maxChars = (0, utils_js_1.toNumber)(body.maxChars);
            if (!url) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "url is required")];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "response body")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.responseBodyViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                url: url,
                timeoutMs: timeoutMs !== null && timeoutMs !== void 0 ? timeoutMs : undefined,
                maxChars: maxChars !== null && maxChars !== void 0 ? maxChars : undefined,
              }),
            ];
          case 4:
            result = _a.sent();
            res.json({ ok: true, targetId: tab.targetId, response: result });
            return [3 /*break*/, 6];
          case 5:
            err_6 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_6);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
  app.post("/highlight", function (req, res) {
    return __awaiter(_this, void 0, void 0, function () {
      var profileCtx, body, targetId, ref, tab, pw, err_7;
      return __generator(this, function (_a) {
        switch (_a.label) {
          case 0:
            profileCtx = (0, agent_shared_js_1.resolveProfileContext)(req, res, ctx);
            if (!profileCtx) {
              return [2 /*return*/];
            }
            body = (0, agent_shared_js_1.readBody)(req);
            targetId = (0, utils_js_1.toStringOrEmpty)(body.targetId) || undefined;
            ref = (0, utils_js_1.toStringOrEmpty)(body.ref);
            if (!ref) {
              return [2 /*return*/, (0, utils_js_1.jsonError)(res, 400, "ref is required")];
            }
            _a.label = 1;
          case 1:
            _a.trys.push([1, 5, , 6]);
            return [4 /*yield*/, profileCtx.ensureTabAvailable(targetId)];
          case 2:
            tab = _a.sent();
            return [4 /*yield*/, (0, agent_shared_js_1.requirePwAi)(res, "highlight")];
          case 3:
            pw = _a.sent();
            if (!pw) {
              return [2 /*return*/];
            }
            return [
              4 /*yield*/,
              pw.highlightViaPlaywright({
                cdpUrl: profileCtx.profile.cdpUrl,
                targetId: tab.targetId,
                ref: ref,
              }),
            ];
          case 4:
            _a.sent();
            res.json({ ok: true, targetId: tab.targetId });
            return [3 /*break*/, 6];
          case 5:
            err_7 = _a.sent();
            (0, agent_shared_js_1.handleRouteError)(ctx, res, err_7);
            return [3 /*break*/, 6];
          case 6:
            return [2 /*return*/];
        }
      });
    });
  });
}
