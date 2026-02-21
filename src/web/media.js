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
exports.optimizeImageToPng = void 0;
exports.loadWebMedia = loadWebMedia;
exports.loadWebMediaRaw = loadWebMediaRaw;
exports.optimizeImageToJpeg = optimizeImageToJpeg;
var promises_1 = require("node:fs/promises");
var node_path_1 = require("node:path");
var node_url_1 = require("node:url");
var globals_js_1 = require("../globals.js");
var constants_js_1 = require("../media/constants.js");
var utils_js_1 = require("../utils.js");
var fetch_js_1 = require("../media/fetch.js");
var image_ops_js_1 = require("../media/image-ops.js");
Object.defineProperty(exports, "optimizeImageToPng", {
  enumerable: true,
  get: function () {
    return image_ops_js_1.optimizeImageToPng;
  },
});
var mime_js_1 = require("../media/mime.js");
var HEIC_MIME_RE = /^image\/hei[cf]$/i;
var HEIC_EXT_RE = /\.(heic|heif)$/i;
var MB = 1024 * 1024;
function formatMb(bytes, digits) {
  if (digits === void 0) {
    digits = 2;
  }
  return (bytes / MB).toFixed(digits);
}
function formatCapLimit(label, cap, size) {
  return ""
    .concat(label, " exceeds ")
    .concat(formatMb(cap, 0), "MB limit (got ")
    .concat(formatMb(size), "MB)");
}
function formatCapReduce(label, cap, size) {
  return ""
    .concat(label, " could not be reduced below ")
    .concat(formatMb(cap, 0), "MB (got ")
    .concat(formatMb(size), "MB)");
}
function isHeicSource(opts) {
  if (opts.contentType && HEIC_MIME_RE.test(opts.contentType.trim())) {
    return true;
  }
  if (opts.fileName && HEIC_EXT_RE.test(opts.fileName.trim())) {
    return true;
  }
  return false;
}
function toJpegFileName(fileName) {
  if (!fileName) {
    return undefined;
  }
  var trimmed = fileName.trim();
  if (!trimmed) {
    return fileName;
  }
  var parsed = node_path_1.default.parse(trimmed);
  if (!parsed.ext || HEIC_EXT_RE.test(parsed.ext)) {
    return node_path_1.default.format({
      dir: parsed.dir,
      name: parsed.name || trimmed,
      ext: ".jpg",
    });
  }
  return node_path_1.default.format({ dir: parsed.dir, name: parsed.name, ext: ".jpg" });
}
function logOptimizedImage(params) {
  if (!(0, globals_js_1.shouldLogVerbose)()) {
    return;
  }
  if (params.optimized.optimizedSize >= params.originalSize) {
    return;
  }
  if (params.optimized.format === "png") {
    (0, globals_js_1.logVerbose)(
      "Optimized PNG (preserving alpha) from "
        .concat(formatMb(params.originalSize), "MB to ")
        .concat(formatMb(params.optimized.optimizedSize), "MB (side\u2264")
        .concat(params.optimized.resizeSide, "px)"),
    );
    return;
  }
  (0, globals_js_1.logVerbose)(
    "Optimized media from "
      .concat(formatMb(params.originalSize), "MB to ")
      .concat(formatMb(params.optimized.optimizedSize), "MB (side\u2264")
      .concat(params.optimized.resizeSide, "px, q=")
      .concat(params.optimized.quality, ")"),
  );
}
function optimizeImageWithFallback(params) {
  return __awaiter(this, void 0, void 0, function () {
    var buffer, cap, meta, isPng, hasAlpha, _a, optimized_1, optimized;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          ((buffer = params.buffer), (cap = params.cap), (meta = params.meta));
          isPng =
            (meta === null || meta === void 0 ? void 0 : meta.contentType) === "image/png" ||
            ((_b = meta === null || meta === void 0 ? void 0 : meta.fileName) === null ||
            _b === void 0
              ? void 0
              : _b.toLowerCase().endsWith(".png"));
          _a = isPng;
          if (!_a) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, (0, image_ops_js_1.hasAlphaChannel)(buffer)];
        case 1:
          _a = _c.sent();
          _c.label = 2;
        case 2:
          hasAlpha = _a;
          if (!hasAlpha) {
            return [3 /*break*/, 4];
          }
          return [4 /*yield*/, (0, image_ops_js_1.optimizeImageToPng)(buffer, cap)];
        case 3:
          optimized_1 = _c.sent();
          if (optimized_1.buffer.length <= cap) {
            return [2 /*return*/, __assign(__assign({}, optimized_1), { format: "png" })];
          }
          if ((0, globals_js_1.shouldLogVerbose)()) {
            (0, globals_js_1.logVerbose)(
              "PNG with alpha still exceeds ".concat(
                formatMb(cap, 0),
                "MB after optimization; falling back to JPEG",
              ),
            );
          }
          _c.label = 4;
        case 4:
          return [4 /*yield*/, optimizeImageToJpeg(buffer, cap, meta)];
        case 5:
          optimized = _c.sent();
          return [2 /*return*/, __assign(__assign({}, optimized), { format: "jpeg" })];
      }
    });
  });
}
function loadWebMediaInternal(mediaUrl_1) {
  return __awaiter(this, arguments, void 0, function (mediaUrl, options) {
    var maxBytes,
      _a,
      optimizeImages,
      optimizeAndClampImage,
      clampAndFinalize,
      fetched,
      buffer,
      contentType,
      fileName_1,
      kind_1,
      data,
      mime,
      kind,
      fileName,
      ext;
    var _this = this;
    if (options === void 0) {
      options = {};
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          ((maxBytes = options.maxBytes),
            (_a = options.optimizeImages),
            (optimizeImages = _a === void 0 ? true : _a));
          // Use fileURLToPath for proper handling of file:// URLs (handles file://localhost/path, etc.)
          if (mediaUrl.startsWith("file://")) {
            try {
              mediaUrl = (0, node_url_1.fileURLToPath)(mediaUrl);
            } catch (_c) {
              throw new Error("Invalid file:// URL: ".concat(mediaUrl), { cause: _c });
            }
          }
          optimizeAndClampImage = function (buffer, cap, meta) {
            return __awaiter(_this, void 0, void 0, function () {
              var originalSize, optimized, contentType, fileName;
              return __generator(this, function (_a) {
                switch (_a.label) {
                  case 0:
                    originalSize = buffer.length;
                    return [
                      4 /*yield*/,
                      optimizeImageWithFallback({ buffer: buffer, cap: cap, meta: meta }),
                    ];
                  case 1:
                    optimized = _a.sent();
                    logOptimizedImage({ originalSize: originalSize, optimized: optimized });
                    if (optimized.buffer.length > cap) {
                      throw new Error(formatCapReduce("Media", cap, optimized.buffer.length));
                    }
                    contentType = optimized.format === "png" ? "image/png" : "image/jpeg";
                    fileName =
                      optimized.format === "jpeg" && meta && isHeicSource(meta)
                        ? toJpegFileName(meta.fileName)
                        : meta === null || meta === void 0
                          ? void 0
                          : meta.fileName;
                    return [
                      2 /*return*/,
                      {
                        buffer: optimized.buffer,
                        contentType: contentType,
                        kind: "image",
                        fileName: fileName,
                      },
                    ];
                }
              });
            });
          };
          clampAndFinalize = function (params) {
            return __awaiter(_this, void 0, void 0, function () {
              var cap, isGif, _a;
              var _b;
              return __generator(this, function (_c) {
                switch (_c.label) {
                  case 0:
                    cap =
                      maxBytes !== undefined
                        ? maxBytes
                        : (0, constants_js_1.maxBytesForKind)(params.kind);
                    if (!(params.kind === "image")) {
                      return [3 /*break*/, 2];
                    }
                    isGif = params.contentType === "image/gif";
                    if (isGif || !optimizeImages) {
                      if (params.buffer.length > cap) {
                        throw new Error(
                          formatCapLimit(isGif ? "GIF" : "Media", cap, params.buffer.length),
                        );
                      }
                      return [
                        2 /*return*/,
                        {
                          buffer: params.buffer,
                          contentType: params.contentType,
                          kind: params.kind,
                          fileName: params.fileName,
                        },
                      ];
                    }
                    _a = [{}];
                    return [
                      4 /*yield*/,
                      optimizeAndClampImage(params.buffer, cap, {
                        contentType: params.contentType,
                        fileName: params.fileName,
                      }),
                    ];
                  case 1:
                    return [2 /*return*/, __assign.apply(void 0, _a.concat([_c.sent()]))];
                  case 2:
                    if (params.buffer.length > cap) {
                      throw new Error(formatCapLimit("Media", cap, params.buffer.length));
                    }
                    return [
                      2 /*return*/,
                      {
                        buffer: params.buffer,
                        contentType:
                          (_b = params.contentType) !== null && _b !== void 0 ? _b : undefined,
                        kind: params.kind,
                        fileName: params.fileName,
                      },
                    ];
                }
              });
            });
          };
          if (!/^https?:\/\//i.test(mediaUrl)) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, (0, fetch_js_1.fetchRemoteMedia)({ url: mediaUrl })];
        case 1:
          fetched = _b.sent();
          ((buffer = fetched.buffer),
            (contentType = fetched.contentType),
            (fileName_1 = fetched.fileName));
          kind_1 = (0, constants_js_1.mediaKindFromMime)(contentType);
          return [
            4 /*yield*/,
            clampAndFinalize({
              buffer: buffer,
              contentType: contentType,
              kind: kind_1,
              fileName: fileName_1,
            }),
          ];
        case 2:
          return [2 /*return*/, _b.sent()];
        case 3:
          // Expand tilde paths to absolute paths (e.g., ~/Downloads/photo.jpg)
          if (mediaUrl.startsWith("~")) {
            mediaUrl = (0, utils_js_1.resolveUserPath)(mediaUrl);
          }
          return [4 /*yield*/, promises_1.default.readFile(mediaUrl)];
        case 4:
          data = _b.sent();
          return [4 /*yield*/, (0, mime_js_1.detectMime)({ buffer: data, filePath: mediaUrl })];
        case 5:
          mime = _b.sent();
          kind = (0, constants_js_1.mediaKindFromMime)(mime);
          fileName = node_path_1.default.basename(mediaUrl) || undefined;
          if (fileName && !node_path_1.default.extname(fileName) && mime) {
            ext = (0, mime_js_1.extensionForMime)(mime);
            if (ext) {
              fileName = "".concat(fileName).concat(ext);
            }
          }
          return [
            4 /*yield*/,
            clampAndFinalize({
              buffer: data,
              contentType: mime,
              kind: kind,
              fileName: fileName,
            }),
          ];
        case 6:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
function loadWebMedia(mediaUrl, maxBytes) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            loadWebMediaInternal(mediaUrl, {
              maxBytes: maxBytes,
              optimizeImages: true,
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function loadWebMediaRaw(mediaUrl, maxBytes) {
  return __awaiter(this, void 0, void 0, function () {
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            loadWebMediaInternal(mediaUrl, {
              maxBytes: maxBytes,
              optimizeImages: false,
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function optimizeImageToJpeg(buffer_1, maxBytes_1) {
  return __awaiter(this, arguments, void 0, function (buffer, maxBytes, opts) {
    var source,
      err_1,
      sides,
      qualities,
      smallest,
      _i,
      sides_1,
      side,
      _a,
      qualities_1,
      quality,
      out,
      size,
      _b;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          source = buffer;
          if (!isHeicSource(opts)) {
            return [3 /*break*/, 4];
          }
          _c.label = 1;
        case 1:
          _c.trys.push([1, 3, , 4]);
          return [4 /*yield*/, (0, image_ops_js_1.convertHeicToJpeg)(buffer)];
        case 2:
          source = _c.sent();
          return [3 /*break*/, 4];
        case 3:
          err_1 = _c.sent();
          throw new Error("HEIC image conversion failed: ".concat(String(err_1)));
        case 4:
          sides = [2048, 1536, 1280, 1024, 800];
          qualities = [80, 70, 60, 50, 40];
          smallest = null;
          ((_i = 0), (sides_1 = sides));
          _c.label = 5;
        case 5:
          if (!(_i < sides_1.length)) {
            return [3 /*break*/, 12];
          }
          side = sides_1[_i];
          ((_a = 0), (qualities_1 = qualities));
          _c.label = 6;
        case 6:
          if (!(_a < qualities_1.length)) {
            return [3 /*break*/, 11];
          }
          quality = qualities_1[_a];
          _c.label = 7;
        case 7:
          _c.trys.push([7, 9, , 10]);
          return [
            4 /*yield*/,
            (0, image_ops_js_1.resizeToJpeg)({
              buffer: source,
              maxSide: side,
              quality: quality,
              withoutEnlargement: true,
            }),
          ];
        case 8:
          out = _c.sent();
          size = out.length;
          if (!smallest || size < smallest.size) {
            smallest = { buffer: out, size: size, resizeSide: side, quality: quality };
          }
          if (size <= maxBytes) {
            return [
              2 /*return*/,
              {
                buffer: out,
                optimizedSize: size,
                resizeSide: side,
                quality: quality,
              },
            ];
          }
          return [3 /*break*/, 10];
        case 9:
          _b = _c.sent();
          return [3 /*break*/, 10];
        case 10:
          _a++;
          return [3 /*break*/, 6];
        case 11:
          _i++;
          return [3 /*break*/, 5];
        case 12:
          if (smallest) {
            return [
              2 /*return*/,
              {
                buffer: smallest.buffer,
                optimizedSize: smallest.size,
                resizeSide: smallest.resizeSide,
                quality: smallest.quality,
              },
            ];
          }
          throw new Error("Failed to optimize image");
      }
    });
  });
}
