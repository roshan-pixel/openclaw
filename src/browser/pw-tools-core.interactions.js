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
exports.highlightViaPlaywright = highlightViaPlaywright;
exports.clickViaPlaywright = clickViaPlaywright;
exports.hoverViaPlaywright = hoverViaPlaywright;
exports.dragViaPlaywright = dragViaPlaywright;
exports.selectOptionViaPlaywright = selectOptionViaPlaywright;
exports.pressKeyViaPlaywright = pressKeyViaPlaywright;
exports.typeViaPlaywright = typeViaPlaywright;
exports.fillFormViaPlaywright = fillFormViaPlaywright;
exports.evaluateViaPlaywright = evaluateViaPlaywright;
exports.scrollIntoViewViaPlaywright = scrollIntoViewViaPlaywright;
exports.waitForViaPlaywright = waitForViaPlaywright;
exports.takeScreenshotViaPlaywright = takeScreenshotViaPlaywright;
exports.screenshotWithLabelsViaPlaywright = screenshotWithLabelsViaPlaywright;
exports.setInputFilesViaPlaywright = setInputFilesViaPlaywright;
var pw_session_js_1 = require("./pw-session.js");
var pw_tools_core_shared_js_1 = require("./pw-tools-core.shared.js");
function highlightViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, ref, err_1;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _a.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          (0, pw_session_js_1.restoreRoleRefsForTarget)({
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            page: page,
          });
          ref = (0, pw_tools_core_shared_js_1.requireRef)(opts.ref);
          _a.label = 2;
        case 2:
          _a.trys.push([2, 4, , 5]);
          return [4 /*yield*/, (0, pw_session_js_1.refLocator)(page, ref).highlight()];
        case 3:
          _a.sent();
          return [3 /*break*/, 5];
        case 4:
          err_1 = _a.sent();
          throw (0, pw_tools_core_shared_js_1.toAIFriendlyError)(err_1, ref);
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function clickViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, ref, locator, timeout, err_2;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
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
          (0, pw_session_js_1.restoreRoleRefsForTarget)({
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            page: page,
          });
          ref = (0, pw_tools_core_shared_js_1.requireRef)(opts.ref);
          locator = (0, pw_session_js_1.refLocator)(page, ref);
          timeout = Math.max(
            500,
            Math.min(
              60000,
              Math.floor((_a = opts.timeoutMs) !== null && _a !== void 0 ? _a : 8000),
            ),
          );
          _b.label = 2;
        case 2:
          _b.trys.push([2, 7, , 8]);
          if (!opts.doubleClick) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            locator.dblclick({
              timeout: timeout,
              button: opts.button,
              modifiers: opts.modifiers,
            }),
          ];
        case 3:
          _b.sent();
          return [3 /*break*/, 6];
        case 4:
          return [
            4 /*yield*/,
            locator.click({
              timeout: timeout,
              button: opts.button,
              modifiers: opts.modifiers,
            }),
          ];
        case 5:
          _b.sent();
          _b.label = 6;
        case 6:
          return [3 /*break*/, 8];
        case 7:
          err_2 = _b.sent();
          throw (0, pw_tools_core_shared_js_1.toAIFriendlyError)(err_2, ref);
        case 8:
          return [2 /*return*/];
      }
    });
  });
}
function hoverViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var ref, page, err_3;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ref = (0, pw_tools_core_shared_js_1.requireRef)(opts.ref);
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _b.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          (0, pw_session_js_1.restoreRoleRefsForTarget)({
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            page: page,
          });
          _b.label = 2;
        case 2:
          _b.trys.push([2, 4, , 5]);
          return [
            4 /*yield*/,
            (0, pw_session_js_1.refLocator)(page, ref).hover({
              timeout: Math.max(
                500,
                Math.min(60000, (_a = opts.timeoutMs) !== null && _a !== void 0 ? _a : 8000),
              ),
            }),
          ];
        case 3:
          _b.sent();
          return [3 /*break*/, 5];
        case 4:
          err_3 = _b.sent();
          throw (0, pw_tools_core_shared_js_1.toAIFriendlyError)(err_3, ref);
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function dragViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var startRef, endRef, page, err_4;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          startRef = (0, pw_tools_core_shared_js_1.requireRef)(opts.startRef);
          endRef = (0, pw_tools_core_shared_js_1.requireRef)(opts.endRef);
          if (!startRef || !endRef) {
            throw new Error("startRef and endRef are required");
          }
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _b.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          (0, pw_session_js_1.restoreRoleRefsForTarget)({
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            page: page,
          });
          _b.label = 2;
        case 2:
          _b.trys.push([2, 4, , 5]);
          return [
            4 /*yield*/,
            (0, pw_session_js_1.refLocator)(page, startRef).dragTo(
              (0, pw_session_js_1.refLocator)(page, endRef),
              {
                timeout: Math.max(
                  500,
                  Math.min(60000, (_a = opts.timeoutMs) !== null && _a !== void 0 ? _a : 8000),
                ),
              },
            ),
          ];
        case 3:
          _b.sent();
          return [3 /*break*/, 5];
        case 4:
          err_4 = _b.sent();
          throw (0, pw_tools_core_shared_js_1.toAIFriendlyError)(
            err_4,
            "".concat(startRef, " -> ").concat(endRef),
          );
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function selectOptionViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var ref, page, err_5;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          ref = (0, pw_tools_core_shared_js_1.requireRef)(opts.ref);
          if (!((_a = opts.values) === null || _a === void 0 ? void 0 : _a.length)) {
            throw new Error("values are required");
          }
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _c.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          (0, pw_session_js_1.restoreRoleRefsForTarget)({
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            page: page,
          });
          _c.label = 2;
        case 2:
          _c.trys.push([2, 4, , 5]);
          return [
            4 /*yield*/,
            (0, pw_session_js_1.refLocator)(page, ref).selectOption(opts.values, {
              timeout: Math.max(
                500,
                Math.min(60000, (_b = opts.timeoutMs) !== null && _b !== void 0 ? _b : 8000),
              ),
            }),
          ];
        case 3:
          _c.sent();
          return [3 /*break*/, 5];
        case 4:
          err_5 = _c.sent();
          throw (0, pw_tools_core_shared_js_1.toAIFriendlyError)(err_5, ref);
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function pressKeyViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var key, page;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          key = String((_a = opts.key) !== null && _a !== void 0 ? _a : "").trim();
          if (!key) {
            throw new Error("key is required");
          }
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _c.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          return [
            4 /*yield*/,
            page.keyboard.press(key, {
              delay: Math.max(
                0,
                Math.floor((_b = opts.delayMs) !== null && _b !== void 0 ? _b : 0),
              ),
            }),
          ];
        case 2:
          _c.sent();
          return [2 /*return*/];
      }
    });
  });
}
function typeViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var text, page, ref, locator, timeout, err_6;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          text = String((_a = opts.text) !== null && _a !== void 0 ? _a : "");
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _c.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          (0, pw_session_js_1.restoreRoleRefsForTarget)({
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            page: page,
          });
          ref = (0, pw_tools_core_shared_js_1.requireRef)(opts.ref);
          locator = (0, pw_session_js_1.refLocator)(page, ref);
          timeout = Math.max(
            500,
            Math.min(60000, (_b = opts.timeoutMs) !== null && _b !== void 0 ? _b : 8000),
          );
          _c.label = 2;
        case 2:
          _c.trys.push([2, 10, , 11]);
          if (!opts.slowly) {
            return [3 /*break*/, 5];
          }
          return [4 /*yield*/, locator.click({ timeout: timeout })];
        case 3:
          _c.sent();
          return [4 /*yield*/, locator.type(text, { timeout: timeout, delay: 75 })];
        case 4:
          _c.sent();
          return [3 /*break*/, 7];
        case 5:
          return [4 /*yield*/, locator.fill(text, { timeout: timeout })];
        case 6:
          _c.sent();
          _c.label = 7;
        case 7:
          if (!opts.submit) {
            return [3 /*break*/, 9];
          }
          return [4 /*yield*/, locator.press("Enter", { timeout: timeout })];
        case 8:
          _c.sent();
          _c.label = 9;
        case 9:
          return [3 /*break*/, 11];
        case 10:
          err_6 = _c.sent();
          throw (0, pw_tools_core_shared_js_1.toAIFriendlyError)(err_6, ref);
        case 11:
          return [2 /*return*/];
      }
    });
  });
}
function fillFormViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, timeout, _i, _a, field, ref, type, rawValue, value, locator, checked, err_7, err_8;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _c.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          (0, pw_session_js_1.restoreRoleRefsForTarget)({
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            page: page,
          });
          timeout = Math.max(
            500,
            Math.min(60000, (_b = opts.timeoutMs) !== null && _b !== void 0 ? _b : 8000),
          );
          ((_i = 0), (_a = opts.fields));
          _c.label = 2;
        case 2:
          if (!(_i < _a.length)) {
            return [3 /*break*/, 11];
          }
          field = _a[_i];
          ref = field.ref.trim();
          type = field.type.trim();
          rawValue = field.value;
          value =
            typeof rawValue === "string"
              ? rawValue
              : typeof rawValue === "number" || typeof rawValue === "boolean"
                ? String(rawValue)
                : "";
          if (!ref || !type) {
            return [3 /*break*/, 10];
          }
          locator = (0, pw_session_js_1.refLocator)(page, ref);
          if (!(type === "checkbox" || type === "radio")) {
            return [3 /*break*/, 7];
          }
          checked = rawValue === true || rawValue === 1 || rawValue === "1" || rawValue === "true";
          _c.label = 3;
        case 3:
          _c.trys.push([3, 5, , 6]);
          return [4 /*yield*/, locator.setChecked(checked, { timeout: timeout })];
        case 4:
          _c.sent();
          return [3 /*break*/, 6];
        case 5:
          err_7 = _c.sent();
          throw (0, pw_tools_core_shared_js_1.toAIFriendlyError)(err_7, ref);
        case 6:
          return [3 /*break*/, 10];
        case 7:
          _c.trys.push([7, 9, , 10]);
          return [4 /*yield*/, locator.fill(value, { timeout: timeout })];
        case 8:
          _c.sent();
          return [3 /*break*/, 10];
        case 9:
          err_8 = _c.sent();
          throw (0, pw_tools_core_shared_js_1.toAIFriendlyError)(err_8, ref);
        case 10:
          _i++;
          return [3 /*break*/, 2];
        case 11:
          return [2 /*return*/];
      }
    });
  });
}
function evaluateViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var fnText, page, locator, elementEvaluator, browserEvaluator;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          fnText = String((_a = opts.fn) !== null && _a !== void 0 ? _a : "").trim();
          if (!fnText) {
            throw new Error("function is required");
          }
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _b.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          (0, pw_session_js_1.restoreRoleRefsForTarget)({
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            page: page,
          });
          if (!opts.ref) {
            return [3 /*break*/, 3];
          }
          locator = (0, pw_session_js_1.refLocator)(page, opts.ref);
          elementEvaluator = new Function(
            "el",
            "fnBody",
            '\n      "use strict";\n      try {\n        var candidate = eval("(" + fnBody + ")");\n        return typeof candidate === "function" ? candidate(el) : candidate;\n      } catch (err) {\n        throw new Error("Invalid evaluate function: " + (err && err.message ? err.message : String(err)));\n      }\n      ',
          );
          return [4 /*yield*/, locator.evaluate(elementEvaluator, fnText)];
        case 2:
          return [2 /*return*/, _b.sent()];
        case 3:
          browserEvaluator = new Function(
            "fnBody",
            '\n    "use strict";\n    try {\n      var candidate = eval("(" + fnBody + ")");\n      return typeof candidate === "function" ? candidate() : candidate;\n    } catch (err) {\n      throw new Error("Invalid evaluate function: " + (err && err.message ? err.message : String(err)));\n    }\n    ',
          );
          return [4 /*yield*/, page.evaluate(browserEvaluator, fnText)];
        case 4:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
function scrollIntoViewViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, timeout, ref, locator, err_9;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _a.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          (0, pw_session_js_1.restoreRoleRefsForTarget)({
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            page: page,
          });
          timeout = (0, pw_tools_core_shared_js_1.normalizeTimeoutMs)(opts.timeoutMs, 20000);
          ref = (0, pw_tools_core_shared_js_1.requireRef)(opts.ref);
          locator = (0, pw_session_js_1.refLocator)(page, ref);
          _a.label = 2;
        case 2:
          _a.trys.push([2, 4, , 5]);
          return [4 /*yield*/, locator.scrollIntoViewIfNeeded({ timeout: timeout })];
        case 3:
          _a.sent();
          return [3 /*break*/, 5];
        case 4:
          err_9 = _a.sent();
          throw (0, pw_tools_core_shared_js_1.toAIFriendlyError)(err_9, ref);
        case 5:
          return [2 /*return*/];
      }
    });
  });
}
function waitForViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, timeout, selector, url, fn;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _a.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          timeout = (0, pw_tools_core_shared_js_1.normalizeTimeoutMs)(opts.timeoutMs, 20000);
          if (!(typeof opts.timeMs === "number" && Number.isFinite(opts.timeMs))) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, page.waitForTimeout(Math.max(0, opts.timeMs))];
        case 2:
          _a.sent();
          _a.label = 3;
        case 3:
          if (!opts.text) {
            return [3 /*break*/, 5];
          }
          return [
            4 /*yield*/,
            page.getByText(opts.text).first().waitFor({
              state: "visible",
              timeout: timeout,
            }),
          ];
        case 4:
          _a.sent();
          _a.label = 5;
        case 5:
          if (!opts.textGone) {
            return [3 /*break*/, 7];
          }
          return [
            4 /*yield*/,
            page.getByText(opts.textGone).first().waitFor({
              state: "hidden",
              timeout: timeout,
            }),
          ];
        case 6:
          _a.sent();
          _a.label = 7;
        case 7:
          if (!opts.selector) {
            return [3 /*break*/, 9];
          }
          selector = String(opts.selector).trim();
          if (!selector) {
            return [3 /*break*/, 9];
          }
          return [
            4 /*yield*/,
            page.locator(selector).first().waitFor({ state: "visible", timeout: timeout }),
          ];
        case 8:
          _a.sent();
          _a.label = 9;
        case 9:
          if (!opts.url) {
            return [3 /*break*/, 11];
          }
          url = String(opts.url).trim();
          if (!url) {
            return [3 /*break*/, 11];
          }
          return [4 /*yield*/, page.waitForURL(url, { timeout: timeout })];
        case 10:
          _a.sent();
          _a.label = 11;
        case 11:
          if (!opts.loadState) {
            return [3 /*break*/, 13];
          }
          return [4 /*yield*/, page.waitForLoadState(opts.loadState, { timeout: timeout })];
        case 12:
          _a.sent();
          _a.label = 13;
        case 13:
          if (!opts.fn) {
            return [3 /*break*/, 15];
          }
          fn = String(opts.fn).trim();
          if (!fn) {
            return [3 /*break*/, 15];
          }
          return [4 /*yield*/, page.waitForFunction(fn, { timeout: timeout })];
        case 14:
          _a.sent();
          _a.label = 15;
        case 15:
          return [2 /*return*/];
      }
    });
  });
}
function takeScreenshotViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, type, locator, buffer_1, locator, buffer_2, buffer;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _b.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          (0, pw_session_js_1.restoreRoleRefsForTarget)({
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            page: page,
          });
          type = (_a = opts.type) !== null && _a !== void 0 ? _a : "png";
          if (!opts.ref) {
            return [3 /*break*/, 3];
          }
          if (opts.fullPage) {
            throw new Error("fullPage is not supported for element screenshots");
          }
          locator = (0, pw_session_js_1.refLocator)(page, opts.ref);
          return [4 /*yield*/, locator.screenshot({ type: type })];
        case 2:
          buffer_1 = _b.sent();
          return [2 /*return*/, { buffer: buffer_1 }];
        case 3:
          if (!opts.element) {
            return [3 /*break*/, 5];
          }
          if (opts.fullPage) {
            throw new Error("fullPage is not supported for element screenshots");
          }
          locator = page.locator(opts.element).first();
          return [4 /*yield*/, locator.screenshot({ type: type })];
        case 4:
          buffer_2 = _b.sent();
          return [2 /*return*/, { buffer: buffer_2 }];
        case 5:
          return [
            4 /*yield*/,
            page.screenshot({
              type: type,
              fullPage: Boolean(opts.fullPage),
            }),
          ];
        case 6:
          buffer = _b.sent();
          return [2 /*return*/, { buffer: buffer }];
      }
    });
  });
}
function screenshotWithLabelsViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page,
      type,
      maxLabels,
      viewport,
      refs,
      boxes,
      skipped,
      _i,
      refs_1,
      ref,
      box,
      x0,
      y0,
      x1,
      y1,
      vx0,
      vy0,
      vx1,
      vy1,
      _a,
      buffer;
    var _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _d.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          (0, pw_session_js_1.restoreRoleRefsForTarget)({
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            page: page,
          });
          type = (_b = opts.type) !== null && _b !== void 0 ? _b : "png";
          maxLabels =
            typeof opts.maxLabels === "number" && Number.isFinite(opts.maxLabels)
              ? Math.max(1, Math.floor(opts.maxLabels))
              : 150;
          return [
            4 /*yield*/,
            page.evaluate(function () {
              return {
                scrollX: window.scrollX || 0,
                scrollY: window.scrollY || 0,
                width: window.innerWidth || 0,
                height: window.innerHeight || 0,
              };
            }),
          ];
        case 2:
          viewport = _d.sent();
          refs = Object.keys((_c = opts.refs) !== null && _c !== void 0 ? _c : {});
          boxes = [];
          skipped = 0;
          ((_i = 0), (refs_1 = refs));
          _d.label = 3;
        case 3:
          if (!(_i < refs_1.length)) {
            return [3 /*break*/, 8];
          }
          ref = refs_1[_i];
          if (boxes.length >= maxLabels) {
            skipped += 1;
            return [3 /*break*/, 7];
          }
          _d.label = 4;
        case 4:
          _d.trys.push([4, 6, , 7]);
          return [4 /*yield*/, (0, pw_session_js_1.refLocator)(page, ref).boundingBox()];
        case 5:
          box = _d.sent();
          if (!box) {
            skipped += 1;
            return [3 /*break*/, 7];
          }
          x0 = box.x;
          y0 = box.y;
          x1 = box.x + box.width;
          y1 = box.y + box.height;
          vx0 = viewport.scrollX;
          vy0 = viewport.scrollY;
          vx1 = viewport.scrollX + viewport.width;
          vy1 = viewport.scrollY + viewport.height;
          if (x1 < vx0 || x0 > vx1 || y1 < vy0 || y0 > vy1) {
            skipped += 1;
            return [3 /*break*/, 7];
          }
          boxes.push({
            ref: ref,
            x: x0 - viewport.scrollX,
            y: y0 - viewport.scrollY,
            w: Math.max(1, box.width),
            h: Math.max(1, box.height),
          });
          return [3 /*break*/, 7];
        case 6:
          _a = _d.sent();
          skipped += 1;
          return [3 /*break*/, 7];
        case 7:
          _i++;
          return [3 /*break*/, 3];
        case 8:
          _d.trys.push([8, , 12, 14]);
          if (!(boxes.length > 0)) {
            return [3 /*break*/, 10];
          }
          return [
            4 /*yield*/,
            page.evaluate(function (labels) {
              var existing = document.querySelectorAll("[data-openclaw-labels]");
              existing.forEach(function (el) {
                return el.remove();
              });
              var root = document.createElement("div");
              root.setAttribute("data-openclaw-labels", "1");
              root.style.position = "fixed";
              root.style.left = "0";
              root.style.top = "0";
              root.style.zIndex = "2147483647";
              root.style.pointerEvents = "none";
              root.style.fontFamily =
                '"SF Mono","SFMono-Regular",Menlo,Monaco,Consolas,"Liberation Mono","Courier New",monospace';
              var clamp = function (value, min, max) {
                return Math.min(max, Math.max(min, value));
              };
              for (var _i = 0, labels_1 = labels; _i < labels_1.length; _i++) {
                var label = labels_1[_i];
                var box = document.createElement("div");
                box.setAttribute("data-openclaw-labels", "1");
                box.style.position = "absolute";
                box.style.left = "".concat(label.x, "px");
                box.style.top = "".concat(label.y, "px");
                box.style.width = "".concat(label.w, "px");
                box.style.height = "".concat(label.h, "px");
                box.style.border = "2px solid #ffb020";
                box.style.boxSizing = "border-box";
                var tag = document.createElement("div");
                tag.setAttribute("data-openclaw-labels", "1");
                tag.textContent = label.ref;
                tag.style.position = "absolute";
                tag.style.left = "".concat(label.x, "px");
                tag.style.top = "".concat(clamp(label.y - 18, 0, 20000), "px");
                tag.style.background = "#ffb020";
                tag.style.color = "#1a1a1a";
                tag.style.fontSize = "12px";
                tag.style.lineHeight = "14px";
                tag.style.padding = "1px 4px";
                tag.style.borderRadius = "3px";
                tag.style.boxShadow = "0 1px 2px rgba(0,0,0,0.35)";
                tag.style.whiteSpace = "nowrap";
                root.appendChild(box);
                root.appendChild(tag);
              }
              document.documentElement.appendChild(root);
            }, boxes),
          ];
        case 9:
          _d.sent();
          _d.label = 10;
        case 10:
          return [4 /*yield*/, page.screenshot({ type: type })];
        case 11:
          buffer = _d.sent();
          return [2 /*return*/, { buffer: buffer, labels: boxes.length, skipped: skipped }];
        case 12:
          return [
            4 /*yield*/,
            page
              .evaluate(function () {
                var existing = document.querySelectorAll("[data-openclaw-labels]");
                existing.forEach(function (el) {
                  return el.remove();
                });
              })
              .catch(function () {}),
          ];
        case 13:
          _d.sent();
          return [7 /*endfinally*/];
        case 14:
          return [2 /*return*/];
      }
    });
  });
}
function setInputFilesViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, inputRef, element, locator, err_10, handle, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _b.sent();
          (0, pw_session_js_1.ensurePageState)(page);
          (0, pw_session_js_1.restoreRoleRefsForTarget)({
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            page: page,
          });
          if (!opts.paths.length) {
            throw new Error("paths are required");
          }
          inputRef = typeof opts.inputRef === "string" ? opts.inputRef.trim() : "";
          element = typeof opts.element === "string" ? opts.element.trim() : "";
          if (inputRef && element) {
            throw new Error("inputRef and element are mutually exclusive");
          }
          if (!inputRef && !element) {
            throw new Error("inputRef or element is required");
          }
          locator = inputRef
            ? (0, pw_session_js_1.refLocator)(page, inputRef)
            : page.locator(element).first();
          _b.label = 2;
        case 2:
          _b.trys.push([2, 4, , 5]);
          return [4 /*yield*/, locator.setInputFiles(opts.paths)];
        case 3:
          _b.sent();
          return [3 /*break*/, 5];
        case 4:
          err_10 = _b.sent();
          throw (0, pw_tools_core_shared_js_1.toAIFriendlyError)(err_10, inputRef || element);
        case 5:
          _b.trys.push([5, 9, , 10]);
          return [4 /*yield*/, locator.elementHandle()];
        case 6:
          handle = _b.sent();
          if (!handle) {
            return [3 /*break*/, 8];
          }
          return [
            4 /*yield*/,
            handle.evaluate(function (el) {
              el.dispatchEvent(new Event("input", { bubbles: true }));
              el.dispatchEvent(new Event("change", { bubbles: true }));
            }),
          ];
        case 7:
          _b.sent();
          _b.label = 8;
        case 8:
          return [3 /*break*/, 10];
        case 9:
          _a = _b.sent();
          return [3 /*break*/, 10];
        case 10:
          return [2 /*return*/];
      }
    });
  });
}
