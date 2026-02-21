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
exports.sanitizeContentBlocksImages = sanitizeContentBlocksImages;
exports.sanitizeImageBlocks = sanitizeImageBlocks;
exports.sanitizeToolResultImages = sanitizeToolResultImages;
var subsystem_js_1 = require("../logging/subsystem.js");
var image_ops_js_1 = require("../media/image-ops.js");
// Anthropic Messages API limitations (observed in OpenClaw sessions):
// - Images over ~2000px per side can fail in multi-image requests.
// - Images over 5MB are rejected by the API.
//
// To keep sessions resilient (and avoid "silent" WhatsApp non-replies), we auto-downscale
// and recompress base64 image blocks when they exceed these limits.
var MAX_IMAGE_DIMENSION_PX = 2000;
var MAX_IMAGE_BYTES = 5 * 1024 * 1024;
var log = (0, subsystem_js_1.createSubsystemLogger)("agents/tool-images");
function isImageBlock(block) {
  if (!block || typeof block !== "object") {
    return false;
  }
  var rec = block;
  return rec.type === "image" && typeof rec.data === "string" && typeof rec.mimeType === "string";
}
function isTextBlock(block) {
  if (!block || typeof block !== "object") {
    return false;
  }
  var rec = block;
  return rec.type === "text" && typeof rec.text === "string";
}
function inferMimeTypeFromBase64(base64) {
  var trimmed = base64.trim();
  if (!trimmed) {
    return undefined;
  }
  if (trimmed.startsWith("/9j/")) {
    return "image/jpeg";
  }
  if (trimmed.startsWith("iVBOR")) {
    return "image/png";
  }
  if (trimmed.startsWith("R0lGOD")) {
    return "image/gif";
  }
  return undefined;
}
function resizeImageBase64IfNeeded(params) {
  return __awaiter(this, void 0, void 0, function () {
    var buf,
      meta,
      width,
      height,
      overBytes,
      hasDimensions,
      qualities,
      maxDim,
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
      best,
      maxMb,
      gotMb;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          buf = Buffer.from(params.base64, "base64");
          return [4 /*yield*/, (0, image_ops_js_1.getImageMetadata)(buf)];
        case 1:
          meta = _c.sent();
          width = meta === null || meta === void 0 ? void 0 : meta.width;
          height = meta === null || meta === void 0 ? void 0 : meta.height;
          overBytes = buf.byteLength > params.maxBytes;
          hasDimensions = typeof width === "number" && typeof height === "number";
          if (
            hasDimensions &&
            !overBytes &&
            width <= params.maxDimensionPx &&
            height <= params.maxDimensionPx
          ) {
            return [
              2 /*return*/,
              {
                base64: params.base64,
                mimeType: params.mimeType,
                resized: false,
                width: width,
                height: height,
              },
            ];
          }
          if (
            hasDimensions &&
            (width > params.maxDimensionPx || height > params.maxDimensionPx || overBytes)
          ) {
            log.warn("Image exceeds limits; resizing", {
              label: params.label,
              width: width,
              height: height,
              maxDimensionPx: params.maxDimensionPx,
              maxBytes: params.maxBytes,
            });
          }
          qualities = [85, 75, 65, 55, 45, 35];
          maxDim = hasDimensions
            ? Math.max(
                width !== null && width !== void 0 ? width : 0,
                height !== null && height !== void 0 ? height : 0,
              )
            : params.maxDimensionPx;
          sideStart = maxDim > 0 ? Math.min(params.maxDimensionPx, maxDim) : params.maxDimensionPx;
          sideGrid = [sideStart, 1800, 1600, 1400, 1200, 1000, 800]
            .map(function (v) {
              return Math.min(params.maxDimensionPx, v);
            })
            .filter(function (v, i, arr) {
              return v > 0 && arr.indexOf(v) === i;
            })
            .toSorted(function (a, b) {
              return b - a;
            });
          smallest = null;
          ((_i = 0), (sideGrid_1 = sideGrid));
          _c.label = 2;
        case 2:
          if (!(_i < sideGrid_1.length)) {
            return [3 /*break*/, 7];
          }
          side = sideGrid_1[_i];
          ((_a = 0), (qualities_1 = qualities));
          _c.label = 3;
        case 3:
          if (!(_a < qualities_1.length)) {
            return [3 /*break*/, 6];
          }
          quality = qualities_1[_a];
          return [
            4 /*yield*/,
            (0, image_ops_js_1.resizeToJpeg)({
              buffer: buf,
              maxSide: side,
              quality: quality,
              withoutEnlargement: true,
            }),
          ];
        case 4:
          out = _c.sent();
          if (!smallest || out.byteLength < smallest.size) {
            smallest = { buffer: out, size: out.byteLength };
          }
          if (out.byteLength <= params.maxBytes) {
            log.info("Image resized", {
              label: params.label,
              width: width,
              height: height,
              maxDimensionPx: params.maxDimensionPx,
              maxBytes: params.maxBytes,
              originalBytes: buf.byteLength,
              resizedBytes: out.byteLength,
              quality: quality,
              side: side,
            });
            return [
              2 /*return*/,
              {
                base64: out.toString("base64"),
                mimeType: "image/jpeg",
                resized: true,
                width: width,
                height: height,
              },
            ];
          }
          _c.label = 5;
        case 5:
          _a++;
          return [3 /*break*/, 3];
        case 6:
          _i++;
          return [3 /*break*/, 2];
        case 7:
          best =
            (_b = smallest === null || smallest === void 0 ? void 0 : smallest.buffer) !== null &&
            _b !== void 0
              ? _b
              : buf;
          maxMb = (params.maxBytes / (1024 * 1024)).toFixed(0);
          gotMb = (best.byteLength / (1024 * 1024)).toFixed(2);
          throw new Error(
            "Image could not be reduced below ".concat(maxMb, "MB (got ").concat(gotMb, "MB)"),
          );
      }
    });
  });
}
function sanitizeContentBlocksImages(blocks_1, label_1) {
  return __awaiter(this, arguments, void 0, function (blocks, label, opts) {
    var maxDimensionPx,
      maxBytes,
      out,
      _i,
      blocks_2,
      block,
      data,
      inferredMimeType,
      mimeType,
      resized,
      err_1;
    var _a, _b;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          maxDimensionPx = Math.max(
            (_a = opts.maxDimensionPx) !== null && _a !== void 0 ? _a : MAX_IMAGE_DIMENSION_PX,
            1,
          );
          maxBytes = Math.max(
            (_b = opts.maxBytes) !== null && _b !== void 0 ? _b : MAX_IMAGE_BYTES,
            1,
          );
          out = [];
          ((_i = 0), (blocks_2 = blocks));
          _c.label = 1;
        case 1:
          if (!(_i < blocks_2.length)) {
            return [3 /*break*/, 6];
          }
          block = blocks_2[_i];
          if (!isImageBlock(block)) {
            out.push(block);
            return [3 /*break*/, 5];
          }
          data = block.data.trim();
          if (!data) {
            out.push({
              type: "text",
              text: "[".concat(label, "] omitted empty image payload"),
            });
            return [3 /*break*/, 5];
          }
          _c.label = 2;
        case 2:
          _c.trys.push([2, 4, , 5]);
          inferredMimeType = inferMimeTypeFromBase64(data);
          mimeType =
            inferredMimeType !== null && inferredMimeType !== void 0
              ? inferredMimeType
              : block.mimeType;
          return [
            4 /*yield*/,
            resizeImageBase64IfNeeded({
              base64: data,
              mimeType: mimeType,
              maxDimensionPx: maxDimensionPx,
              maxBytes: maxBytes,
              label: label,
            }),
          ];
        case 3:
          resized = _c.sent();
          out.push(
            __assign(__assign({}, block), {
              data: resized.base64,
              mimeType: resized.resized ? resized.mimeType : mimeType,
            }),
          );
          return [3 /*break*/, 5];
        case 4:
          err_1 = _c.sent();
          out.push({
            type: "text",
            text: "[".concat(label, "] omitted image payload: ").concat(String(err_1)),
          });
          return [3 /*break*/, 5];
        case 5:
          _i++;
          return [3 /*break*/, 1];
        case 6:
          return [2 /*return*/, out];
      }
    });
  });
}
function sanitizeImageBlocks(images_1, label_1) {
  return __awaiter(this, arguments, void 0, function (images, label, opts) {
    var sanitized, next;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (images.length === 0) {
            return [2 /*return*/, { images: images, dropped: 0 }];
          }
          return [4 /*yield*/, sanitizeContentBlocksImages(images, label, opts)];
        case 1:
          sanitized = _a.sent();
          next = sanitized.filter(isImageBlock);
          return [
            2 /*return*/,
            { images: next, dropped: Math.max(0, images.length - next.length) },
          ];
      }
    });
  });
}
function sanitizeToolResultImages(result_1, label_1) {
  return __awaiter(this, arguments, void 0, function (result, label, opts) {
    var content, next;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          content = Array.isArray(result.content) ? result.content : [];
          if (
            !content.some(function (b) {
              return isImageBlock(b) || isTextBlock(b);
            })
          ) {
            return [2 /*return*/, result];
          }
          return [4 /*yield*/, sanitizeContentBlocksImages(content, label, opts)];
        case 1:
          next = _a.sent();
          return [2 /*return*/, __assign(__assign({}, result), { content: next })];
      }
    });
  });
}
