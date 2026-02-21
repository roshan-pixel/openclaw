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
exports.DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES = exports.DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE = void 0;
exports.normalizeBrowserScreenshot = normalizeBrowserScreenshot;
var image_ops_js_1 = require("../media/image-ops.js");
exports.DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE = 2000;
exports.DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES = 5 * 1024 * 1024;
function normalizeBrowserScreenshot(buffer, opts) {
  return __awaiter(this, void 0, void 0, function () {
    var maxSide,
      maxBytes,
      meta,
      width,
      height,
      maxDim,
      qualities,
      sideStart,
      sideGrid,
      smallest,
      _i,
      sideGrid_1,
      side,
      _a,
      qualities_1,
      quality,
      out,
      best;
    var _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          maxSide = Math.max(
            1,
            Math.round(
              (_b = opts === null || opts === void 0 ? void 0 : opts.maxSide) !== null &&
                _b !== void 0
                ? _b
                : exports.DEFAULT_BROWSER_SCREENSHOT_MAX_SIDE,
            ),
          );
          maxBytes = Math.max(
            1,
            Math.round(
              (_c = opts === null || opts === void 0 ? void 0 : opts.maxBytes) !== null &&
                _c !== void 0
                ? _c
                : exports.DEFAULT_BROWSER_SCREENSHOT_MAX_BYTES,
            ),
          );
          return [4 /*yield*/, (0, image_ops_js_1.getImageMetadata)(buffer)];
        case 1:
          meta = _g.sent();
          width = Number(
            (_d = meta === null || meta === void 0 ? void 0 : meta.width) !== null && _d !== void 0
              ? _d
              : 0,
          );
          height = Number(
            (_e = meta === null || meta === void 0 ? void 0 : meta.height) !== null && _e !== void 0
              ? _e
              : 0,
          );
          maxDim = Math.max(width, height);
          if (
            buffer.byteLength <= maxBytes &&
            (maxDim === 0 || (width <= maxSide && height <= maxSide))
          ) {
            return [2 /*return*/, { buffer: buffer }];
          }
          qualities = [85, 75, 65, 55, 45, 35];
          sideStart = maxDim > 0 ? Math.min(maxSide, maxDim) : maxSide;
          sideGrid = [sideStart, 1800, 1600, 1400, 1200, 1000, 800]
            .map(function (v) {
              return Math.min(maxSide, v);
            })
            .filter(function (v, i, arr) {
              return v > 0 && arr.indexOf(v) === i;
            })
            .toSorted(function (a, b) {
              return b - a;
            });
          smallest = null;
          ((_i = 0), (sideGrid_1 = sideGrid));
          _g.label = 2;
        case 2:
          if (!(_i < sideGrid_1.length)) {
            return [3 /*break*/, 7];
          }
          side = sideGrid_1[_i];
          ((_a = 0), (qualities_1 = qualities));
          _g.label = 3;
        case 3:
          if (!(_a < qualities_1.length)) {
            return [3 /*break*/, 6];
          }
          quality = qualities_1[_a];
          return [
            4 /*yield*/,
            (0, image_ops_js_1.resizeToJpeg)({
              buffer: buffer,
              maxSide: side,
              quality: quality,
              withoutEnlargement: true,
            }),
          ];
        case 4:
          out = _g.sent();
          if (!smallest || out.byteLength < smallest.size) {
            smallest = { buffer: out, size: out.byteLength };
          }
          if (out.byteLength <= maxBytes) {
            return [2 /*return*/, { buffer: out, contentType: "image/jpeg" }];
          }
          _g.label = 5;
        case 5:
          _a++;
          return [3 /*break*/, 3];
        case 6:
          _i++;
          return [3 /*break*/, 2];
        case 7:
          best =
            (_f = smallest === null || smallest === void 0 ? void 0 : smallest.buffer) !== null &&
            _f !== void 0
              ? _f
              : buffer;
          throw new Error(
            "Browser screenshot could not be reduced below "
              .concat((maxBytes / (1024 * 1024)).toFixed(0), "MB (got ")
              .concat((best.byteLength / (1024 * 1024)).toFixed(2), "MB)"),
          );
      }
    });
  });
}
