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
exports.armFileUploadViaPlaywright = armFileUploadViaPlaywright;
exports.armDialogViaPlaywright = armDialogViaPlaywright;
exports.waitForDownloadViaPlaywright = waitForDownloadViaPlaywright;
exports.downloadViaPlaywright = downloadViaPlaywright;
var node_crypto_1 = require("node:crypto");
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var pw_session_js_1 = require("./pw-session.js");
var pw_tools_core_shared_js_1 = require("./pw-tools-core.shared.js");
function buildTempDownloadPath(fileName) {
  var id = node_crypto_1.default.randomUUID();
  var safeName = fileName.trim() ? fileName.trim() : "download.bin";
  return node_path_1.default.join("/tmp/openclaw/downloads", "".concat(id, "-").concat(safeName));
}
function createPageDownloadWaiter(page, timeoutMs) {
  var done = false;
  var timer;
  var handler;
  var cleanup = function () {
    if (timer) {
      clearTimeout(timer);
    }
    timer = undefined;
    if (handler) {
      page.off("download", handler);
      handler = undefined;
    }
  };
  var promise = new Promise(function (resolve, reject) {
    handler = function (download) {
      if (done) {
        return;
      }
      done = true;
      cleanup();
      resolve(download);
    };
    page.on("download", handler);
    timer = setTimeout(function () {
      if (done) {
        return;
      }
      done = true;
      cleanup();
      reject(new Error("Timeout waiting for download"));
    }, timeoutMs);
  });
  return {
    promise: promise,
    cancel: function () {
      if (done) {
        return;
      }
      done = true;
      cleanup();
    },
  };
}
function armFileUploadViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, state, timeout, armId;
    var _this = this;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _b.sent();
          state = (0, pw_session_js_1.ensurePageState)(page);
          timeout = Math.max(
            500,
            Math.min(120000, (_a = opts.timeoutMs) !== null && _a !== void 0 ? _a : 120000),
          );
          state.armIdUpload = (0, pw_tools_core_shared_js_1.bumpUploadArmId)();
          armId = state.armIdUpload;
          void page
            .waitForEvent("filechooser", { timeout: timeout })
            .then(function (fileChooser) {
              return __awaiter(_this, void 0, void 0, function () {
                var _a, input, _b, _c;
                var _d;
                return __generator(this, function (_e) {
                  switch (_e.label) {
                    case 0:
                      if (state.armIdUpload !== armId) {
                        return [2 /*return*/];
                      }
                      if (!!((_d = opts.paths) === null || _d === void 0 ? void 0 : _d.length)) {
                        return [3 /*break*/, 5];
                      }
                      _e.label = 1;
                    case 1:
                      _e.trys.push([1, 3, , 4]);
                      return [4 /*yield*/, page.keyboard.press("Escape")];
                    case 2:
                      _e.sent();
                      return [3 /*break*/, 4];
                    case 3:
                      _a = _e.sent();
                      return [3 /*break*/, 4];
                    case 4:
                      return [2 /*return*/];
                    case 5:
                      return [4 /*yield*/, fileChooser.setFiles(opts.paths)];
                    case 6:
                      _e.sent();
                      _e.label = 7;
                    case 7:
                      _e.trys.push([7, 13, , 14]);
                      if (!(typeof fileChooser.element === "function")) {
                        return [3 /*break*/, 9];
                      }
                      return [4 /*yield*/, Promise.resolve(fileChooser.element())];
                    case 8:
                      _b = _e.sent();
                      return [3 /*break*/, 10];
                    case 9:
                      _b = null;
                      _e.label = 10;
                    case 10:
                      input = _b;
                      if (!input) {
                        return [3 /*break*/, 12];
                      }
                      return [
                        4 /*yield*/,
                        input.evaluate(function (el) {
                          el.dispatchEvent(new Event("input", { bubbles: true }));
                          el.dispatchEvent(new Event("change", { bubbles: true }));
                        }),
                      ];
                    case 11:
                      _e.sent();
                      _e.label = 12;
                    case 12:
                      return [3 /*break*/, 14];
                    case 13:
                      _c = _e.sent();
                      return [3 /*break*/, 14];
                    case 14:
                      return [2 /*return*/];
                  }
                });
              });
            })
            .catch(function () {
              // Ignore timeouts; the chooser may never appear.
            });
          return [2 /*return*/];
      }
    });
  });
}
function armDialogViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, state, timeout, armId;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _a.sent();
          state = (0, pw_session_js_1.ensurePageState)(page);
          timeout = (0, pw_tools_core_shared_js_1.normalizeTimeoutMs)(opts.timeoutMs, 120000);
          state.armIdDialog = (0, pw_tools_core_shared_js_1.bumpDialogArmId)();
          armId = state.armIdDialog;
          void page
            .waitForEvent("dialog", { timeout: timeout })
            .then(function (dialog) {
              return __awaiter(_this, void 0, void 0, function () {
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      if (state.armIdDialog !== armId) {
                        return [2 /*return*/];
                      }
                      if (!opts.accept) {
                        return [3 /*break*/, 2];
                      }
                      return [4 /*yield*/, dialog.accept(opts.promptText)];
                    case 1:
                      _a.sent();
                      return [3 /*break*/, 4];
                    case 2:
                      return [4 /*yield*/, dialog.dismiss()];
                    case 3:
                      _a.sent();
                      _a.label = 4;
                    case 4:
                      return [2 /*return*/];
                  }
                });
              });
            })
            .catch(function () {
              // Ignore timeouts; the dialog may never appear.
            });
          return [2 /*return*/];
      }
    });
  });
}
function waitForDownloadViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page, state, timeout, armId, waiter, download, suggested, outPath, err_1;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _e.sent();
          state = (0, pw_session_js_1.ensurePageState)(page);
          timeout = (0, pw_tools_core_shared_js_1.normalizeTimeoutMs)(opts.timeoutMs, 120000);
          state.armIdDownload = (0, pw_tools_core_shared_js_1.bumpDownloadArmId)();
          armId = state.armIdDownload;
          waiter = createPageDownloadWaiter(page, timeout);
          _e.label = 2;
        case 2:
          _e.trys.push([2, 6, , 7]);
          return [4 /*yield*/, waiter.promise];
        case 3:
          download = _e.sent();
          if (state.armIdDownload !== armId) {
            throw new Error("Download was superseded by another waiter");
          }
          suggested =
            ((_a = download.suggestedFilename) === null || _a === void 0
              ? void 0
              : _a.call(download)) || "download.bin";
          outPath =
            ((_b = opts.path) === null || _b === void 0 ? void 0 : _b.trim()) ||
            buildTempDownloadPath(suggested);
          return [
            4 /*yield*/,
            promises_1.default.mkdir(node_path_1.default.dirname(outPath), { recursive: true }),
          ];
        case 4:
          _e.sent();
          return [
            4 /*yield*/,
            (_c = download.saveAs) === null || _c === void 0 ? void 0 : _c.call(download, outPath),
          ];
        case 5:
          _e.sent();
          return [
            2 /*return*/,
            {
              url:
                ((_d = download.url) === null || _d === void 0 ? void 0 : _d.call(download)) || "",
              suggestedFilename: suggested,
              path: node_path_1.default.resolve(outPath),
            },
          ];
        case 6:
          err_1 = _e.sent();
          waiter.cancel();
          throw err_1;
        case 7:
          return [2 /*return*/];
      }
    });
  });
}
function downloadViaPlaywright(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var page,
      state,
      timeout,
      ref,
      outPath,
      armId,
      waiter,
      locator,
      err_2,
      download,
      suggested,
      err_3;
    var _a, _b, _c, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          return [4 /*yield*/, (0, pw_session_js_1.getPageForTargetId)(opts)];
        case 1:
          page = _e.sent();
          state = (0, pw_session_js_1.ensurePageState)(page);
          (0, pw_session_js_1.restoreRoleRefsForTarget)({
            cdpUrl: opts.cdpUrl,
            targetId: opts.targetId,
            page: page,
          });
          timeout = (0, pw_tools_core_shared_js_1.normalizeTimeoutMs)(opts.timeoutMs, 120000);
          ref = (0, pw_tools_core_shared_js_1.requireRef)(opts.ref);
          outPath = String((_a = opts.path) !== null && _a !== void 0 ? _a : "").trim();
          if (!outPath) {
            throw new Error("path is required");
          }
          state.armIdDownload = (0, pw_tools_core_shared_js_1.bumpDownloadArmId)();
          armId = state.armIdDownload;
          waiter = createPageDownloadWaiter(page, timeout);
          _e.label = 2;
        case 2:
          _e.trys.push([2, 10, , 11]);
          locator = (0, pw_session_js_1.refLocator)(page, ref);
          _e.label = 3;
        case 3:
          _e.trys.push([3, 5, , 6]);
          return [4 /*yield*/, locator.click({ timeout: timeout })];
        case 4:
          _e.sent();
          return [3 /*break*/, 6];
        case 5:
          err_2 = _e.sent();
          throw (0, pw_tools_core_shared_js_1.toAIFriendlyError)(err_2, ref);
        case 6:
          return [4 /*yield*/, waiter.promise];
        case 7:
          download = _e.sent();
          if (state.armIdDownload !== armId) {
            throw new Error("Download was superseded by another waiter");
          }
          suggested =
            ((_b = download.suggestedFilename) === null || _b === void 0
              ? void 0
              : _b.call(download)) || "download.bin";
          return [
            4 /*yield*/,
            promises_1.default.mkdir(node_path_1.default.dirname(outPath), { recursive: true }),
          ];
        case 8:
          _e.sent();
          return [
            4 /*yield*/,
            (_c = download.saveAs) === null || _c === void 0 ? void 0 : _c.call(download, outPath),
          ];
        case 9:
          _e.sent();
          return [
            2 /*return*/,
            {
              url:
                ((_d = download.url) === null || _d === void 0 ? void 0 : _d.call(download)) || "",
              suggestedFilename: suggested,
              path: node_path_1.default.resolve(outPath),
            },
          ];
        case 10:
          err_3 = _e.sent();
          waiter.cancel();
          throw err_3;
        case 11:
          return [2 /*return*/];
      }
    });
  });
}
