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
var __spreadArray =
  (this && this.__spreadArray) ||
  function (to, from, pack) {
    if (pack || arguments.length === 2) {
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar) ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.getImageMetadata = getImageMetadata;
exports.normalizeExifOrientation = normalizeExifOrientation;
exports.resizeToJpeg = resizeToJpeg;
exports.convertHeicToJpeg = convertHeicToJpeg;
exports.hasAlphaChannel = hasAlphaChannel;
exports.resizeToPng = resizeToPng;
exports.optimizeImageToPng = optimizeImageToPng;
var promises_1 = require("node:fs/promises");
var node_os_1 = require("node:os");
var node_path_1 = require("node:path");
var exec_js_1 = require("../process/exec.js");
function isBun() {
  return typeof process.versions.bun === "string";
}
function prefersSips() {
  return (
    process.env.OPENCLAW_IMAGE_BACKEND === "sips" ||
    (process.env.OPENCLAW_IMAGE_BACKEND !== "sharp" && isBun() && process.platform === "darwin")
  );
}
function loadSharp() {
  return __awaiter(this, void 0, void 0, function () {
    var mod, sharp;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [
            4 /*yield*/,
            Promise.resolve().then(function () {
              return require("sharp");
            }),
          ];
        case 1:
          mod = _b.sent();
          sharp = (_a = mod.default) !== null && _a !== void 0 ? _a : mod;
          return [
            2 /*return*/,
            function (buffer) {
              return sharp(buffer, { failOnError: false });
            },
          ];
      }
    });
  });
}
/**
 * Reads EXIF orientation from JPEG buffer.
 * Returns orientation value 1-8, or null if not found/not JPEG.
 *
 * EXIF orientation values:
 * 1 = Normal, 2 = Flip H, 3 = Rotate 180, 4 = Flip V,
 * 5 = Rotate 270 CW + Flip H, 6 = Rotate 90 CW, 7 = Rotate 90 CW + Flip H, 8 = Rotate 270 CW
 */
function readJpegExifOrientation(buffer) {
  // Check JPEG magic bytes
  if (buffer.length < 2 || buffer[0] !== 0xff || buffer[1] !== 0xd8) {
    return null;
  }
  var offset = 2;
  var _loop_1 = function () {
    // Look for marker
    if (buffer[offset] !== 0xff) {
      offset++;
      return "continue";
    }
    var marker = buffer[offset + 1];
    // Skip padding FF bytes
    if (marker === 0xff) {
      offset++;
      return "continue";
    }
    // APP1 marker (EXIF)
    if (marker === 0xe1) {
      var exifStart = offset + 4;
      // Check for "Exif\0\0" header
      if (
        buffer.length > exifStart + 6 &&
        buffer.toString("ascii", exifStart, exifStart + 4) === "Exif" &&
        buffer[exifStart + 4] === 0 &&
        buffer[exifStart + 5] === 0
      ) {
        var tiffStart = exifStart + 6;
        if (buffer.length < tiffStart + 8) {
          return { value: null };
        }
        // Check byte order (II = little-endian, MM = big-endian)
        var byteOrder = buffer.toString("ascii", tiffStart, tiffStart + 2);
        var isLittleEndian_1 = byteOrder === "II";
        var readU16 = function (pos) {
          return isLittleEndian_1 ? buffer.readUInt16LE(pos) : buffer.readUInt16BE(pos);
        };
        var readU32 = function (pos) {
          return isLittleEndian_1 ? buffer.readUInt32LE(pos) : buffer.readUInt32BE(pos);
        };
        // Read IFD0 offset
        var ifd0Offset = readU32(tiffStart + 4);
        var ifd0Start = tiffStart + ifd0Offset;
        if (buffer.length < ifd0Start + 2) {
          return { value: null };
        }
        var numEntries = readU16(ifd0Start);
        for (var i = 0; i < numEntries; i++) {
          var entryOffset = ifd0Start + 2 + i * 12;
          if (buffer.length < entryOffset + 12) {
            break;
          }
          var tag = readU16(entryOffset);
          // Orientation tag = 0x0112
          if (tag === 0x0112) {
            var value = readU16(entryOffset + 8);
            return { value: value >= 1 && value <= 8 ? value : null };
          }
        }
      }
      return { value: null };
    }
    // Skip other segments
    if (marker >= 0xe0 && marker <= 0xef) {
      var segmentLength = buffer.readUInt16BE(offset + 2);
      offset += 2 + segmentLength;
      return "continue";
    }
    // SOF, SOS, or other marker - stop searching
    if (marker === 0xc0 || marker === 0xda) {
      return "break";
    }
    offset++;
  };
  while (offset < buffer.length - 4) {
    var state_1 = _loop_1();
    if (typeof state_1 === "object") {
      return state_1.value;
    }
    if (state_1 === "break") {
      break;
    }
  }
  return null;
}
function withTempDir(fn) {
  return __awaiter(this, void 0, void 0, function () {
    var dir;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            promises_1.default.mkdtemp(
              node_path_1.default.join(node_os_1.default.tmpdir(), "openclaw-img-"),
            ),
          ];
        case 1:
          dir = _a.sent();
          _a.label = 2;
        case 2:
          _a.trys.push([2, , 4, 6]);
          return [4 /*yield*/, fn(dir)];
        case 3:
          return [2 /*return*/, _a.sent()];
        case 4:
          return [
            4 /*yield*/,
            promises_1.default.rm(dir, { recursive: true, force: true }).catch(function () {}),
          ];
        case 5:
          _a.sent();
          return [7 /*endfinally*/];
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
function sipsMetadataFromBuffer(buffer) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            withTempDir(function (dir) {
              return __awaiter(_this, void 0, void 0, function () {
                var input, stdout, w, h, width, height;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      input = node_path_1.default.join(dir, "in.img");
                      return [4 /*yield*/, promises_1.default.writeFile(input, buffer)];
                    case 1:
                      _a.sent();
                      return [
                        4 /*yield*/,
                        (0, exec_js_1.runExec)(
                          "/usr/bin/sips",
                          ["-g", "pixelWidth", "-g", "pixelHeight", input],
                          {
                            timeoutMs: 10000,
                            maxBuffer: 512 * 1024,
                          },
                        ),
                      ];
                    case 2:
                      stdout = _a.sent().stdout;
                      w = stdout.match(/pixelWidth:\s*([0-9]+)/);
                      h = stdout.match(/pixelHeight:\s*([0-9]+)/);
                      if (
                        !(w === null || w === void 0 ? void 0 : w[1]) ||
                        !(h === null || h === void 0 ? void 0 : h[1])
                      ) {
                        return [2 /*return*/, null];
                      }
                      width = Number.parseInt(w[1], 10);
                      height = Number.parseInt(h[1], 10);
                      if (!Number.isFinite(width) || !Number.isFinite(height)) {
                        return [2 /*return*/, null];
                      }
                      if (width <= 0 || height <= 0) {
                        return [2 /*return*/, null];
                      }
                      return [2 /*return*/, { width: width, height: height }];
                  }
                });
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function sipsResizeToJpeg(params) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            withTempDir(function (dir) {
              return __awaiter(_this, void 0, void 0, function () {
                var input, output;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      input = node_path_1.default.join(dir, "in.img");
                      output = node_path_1.default.join(dir, "out.jpg");
                      return [4 /*yield*/, promises_1.default.writeFile(input, params.buffer)];
                    case 1:
                      _a.sent();
                      return [
                        4 /*yield*/,
                        (0, exec_js_1.runExec)(
                          "/usr/bin/sips",
                          [
                            "-Z",
                            String(Math.max(1, Math.round(params.maxSide))),
                            "-s",
                            "format",
                            "jpeg",
                            "-s",
                            "formatOptions",
                            String(Math.max(1, Math.min(100, Math.round(params.quality)))),
                            input,
                            "--out",
                            output,
                          ],
                          { timeoutMs: 20000, maxBuffer: 1024 * 1024 },
                        ),
                      ];
                    case 2:
                      _a.sent();
                      return [4 /*yield*/, promises_1.default.readFile(output)];
                    case 3:
                      return [2 /*return*/, _a.sent()];
                  }
                });
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function sipsConvertToJpeg(buffer) {
  return __awaiter(this, void 0, void 0, function () {
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          return [
            4 /*yield*/,
            withTempDir(function (dir) {
              return __awaiter(_this, void 0, void 0, function () {
                var input, output;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      input = node_path_1.default.join(dir, "in.heic");
                      output = node_path_1.default.join(dir, "out.jpg");
                      return [4 /*yield*/, promises_1.default.writeFile(input, buffer)];
                    case 1:
                      _a.sent();
                      return [
                        4 /*yield*/,
                        (0, exec_js_1.runExec)(
                          "/usr/bin/sips",
                          ["-s", "format", "jpeg", input, "--out", output],
                          {
                            timeoutMs: 20000,
                            maxBuffer: 1024 * 1024,
                          },
                        ),
                      ];
                    case 2:
                      _a.sent();
                      return [4 /*yield*/, promises_1.default.readFile(output)];
                    case 3:
                      return [2 /*return*/, _a.sent()];
                  }
                });
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function getImageMetadata(buffer) {
  return __awaiter(this, void 0, void 0, function () {
    var sharp, meta, width, height, _a;
    var _b, _c;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          if (!prefersSips()) {
            return [3 /*break*/, 2];
          }
          return [
            4 /*yield*/,
            sipsMetadataFromBuffer(buffer).catch(function () {
              return null;
            }),
          ];
        case 1:
          return [2 /*return*/, _d.sent()];
        case 2:
          _d.trys.push([2, 5, , 6]);
          return [4 /*yield*/, loadSharp()];
        case 3:
          sharp = _d.sent();
          return [4 /*yield*/, sharp(buffer).metadata()];
        case 4:
          meta = _d.sent();
          width = Number((_b = meta.width) !== null && _b !== void 0 ? _b : 0);
          height = Number((_c = meta.height) !== null && _c !== void 0 ? _c : 0);
          if (!Number.isFinite(width) || !Number.isFinite(height)) {
            return [2 /*return*/, null];
          }
          if (width <= 0 || height <= 0) {
            return [2 /*return*/, null];
          }
          return [2 /*return*/, { width: width, height: height }];
        case 5:
          _a = _d.sent();
          return [2 /*return*/, null];
        case 6:
          return [2 /*return*/];
      }
    });
  });
}
/**
 * Applies rotation/flip to image buffer using sips based on EXIF orientation.
 */
function sipsApplyOrientation(buffer, orientation) {
  return __awaiter(this, void 0, void 0, function () {
    var ops;
    var _this = this;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ops = [];
          switch (orientation) {
            case 2: // Flip horizontal
              ops.push("-f", "horizontal");
              break;
            case 3: // Rotate 180
              ops.push("-r", "180");
              break;
            case 4: // Flip vertical
              ops.push("-f", "vertical");
              break;
            case 5: // Rotate 270 CW + flip horizontal
              ops.push("-r", "270", "-f", "horizontal");
              break;
            case 6: // Rotate 90 CW
              ops.push("-r", "90");
              break;
            case 7: // Rotate 90 CW + flip horizontal
              ops.push("-r", "90", "-f", "horizontal");
              break;
            case 8: // Rotate 270 CW
              ops.push("-r", "270");
              break;
            default:
              // Orientation 1 or unknown - no change needed
              return [2 /*return*/, buffer];
          }
          return [
            4 /*yield*/,
            withTempDir(function (dir) {
              return __awaiter(_this, void 0, void 0, function () {
                var input, output;
                return __generator(this, function (_a) {
                  switch (_a.label) {
                    case 0:
                      input = node_path_1.default.join(dir, "in.jpg");
                      output = node_path_1.default.join(dir, "out.jpg");
                      return [4 /*yield*/, promises_1.default.writeFile(input, buffer)];
                    case 1:
                      _a.sent();
                      return [
                        4 /*yield*/,
                        (0, exec_js_1.runExec)(
                          "/usr/bin/sips",
                          __spreadArray(
                            __spreadArray([], ops, true),
                            [input, "--out", output],
                            false,
                          ),
                          {
                            timeoutMs: 20000,
                            maxBuffer: 1024 * 1024,
                          },
                        ),
                      ];
                    case 2:
                      _a.sent();
                      return [4 /*yield*/, promises_1.default.readFile(output)];
                    case 3:
                      return [2 /*return*/, _a.sent()];
                  }
                });
              });
            }),
          ];
        case 1:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
/**
 * Normalizes EXIF orientation in an image buffer.
 * Returns the buffer with correct pixel orientation (rotated if needed).
 * Falls back to original buffer if normalization fails.
 */
function normalizeExifOrientation(buffer) {
  return __awaiter(this, void 0, void 0, function () {
    var orientation_1, _a, sharp, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          if (!prefersSips()) {
            return [3 /*break*/, 4];
          }
          _c.label = 1;
        case 1:
          _c.trys.push([1, 3, , 4]);
          orientation_1 = readJpegExifOrientation(buffer);
          if (!orientation_1 || orientation_1 === 1) {
            return [2 /*return*/, buffer]; // No rotation needed
          }
          return [4 /*yield*/, sipsApplyOrientation(buffer, orientation_1)];
        case 2:
          return [2 /*return*/, _c.sent()];
        case 3:
          _a = _c.sent();
          return [2 /*return*/, buffer];
        case 4:
          _c.trys.push([4, 7, , 8]);
          return [4 /*yield*/, loadSharp()];
        case 5:
          sharp = _c.sent();
          return [4 /*yield*/, sharp(buffer).rotate().toBuffer()];
        case 6:
          // .rotate() with no args auto-rotates based on EXIF orientation
          return [2 /*return*/, _c.sent()];
        case 7:
          _b = _c.sent();
          // Sharp not available or failed - return original buffer
          return [2 /*return*/, buffer];
        case 8:
          return [2 /*return*/];
      }
    });
  });
}
function resizeToJpeg(params) {
  return __awaiter(this, void 0, void 0, function () {
    var normalized, meta, maxDim, sharp;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!prefersSips()) {
            return [3 /*break*/, 6];
          }
          return [4 /*yield*/, normalizeExifOrientationSips(params.buffer)];
        case 1:
          normalized = _a.sent();
          if (!(params.withoutEnlargement !== false)) {
            return [3 /*break*/, 4];
          }
          return [4 /*yield*/, getImageMetadata(normalized)];
        case 2:
          meta = _a.sent();
          if (!meta) {
            return [3 /*break*/, 4];
          }
          maxDim = Math.max(meta.width, meta.height);
          if (!(maxDim > 0 && maxDim <= params.maxSide)) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            sipsResizeToJpeg({
              buffer: normalized,
              maxSide: maxDim,
              quality: params.quality,
            }),
          ];
        case 3:
          return [2 /*return*/, _a.sent()];
        case 4:
          return [
            4 /*yield*/,
            sipsResizeToJpeg({
              buffer: normalized,
              maxSide: params.maxSide,
              quality: params.quality,
            }),
          ];
        case 5:
          return [2 /*return*/, _a.sent()];
        case 6:
          return [4 /*yield*/, loadSharp()];
        case 7:
          sharp = _a.sent();
          return [
            4 /*yield*/,
            sharp(params.buffer)
              .rotate() // Auto-rotate based on EXIF before resizing
              .resize({
                width: params.maxSide,
                height: params.maxSide,
                fit: "inside",
                withoutEnlargement: params.withoutEnlargement !== false,
              })
              .jpeg({ quality: params.quality, mozjpeg: true })
              .toBuffer(),
          ];
        case 8:
          // Use .rotate() BEFORE .resize() to auto-rotate based on EXIF orientation
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
function convertHeicToJpeg(buffer) {
  return __awaiter(this, void 0, void 0, function () {
    var sharp;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          if (!prefersSips()) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, sipsConvertToJpeg(buffer)];
        case 1:
          return [2 /*return*/, _a.sent()];
        case 2:
          return [4 /*yield*/, loadSharp()];
        case 3:
          sharp = _a.sent();
          return [4 /*yield*/, sharp(buffer).jpeg({ quality: 90, mozjpeg: true }).toBuffer()];
        case 4:
          return [2 /*return*/, _a.sent()];
      }
    });
  });
}
/**
 * Checks if an image has an alpha channel (transparency).
 * Returns true if the image has alpha, false otherwise.
 */
function hasAlphaChannel(buffer) {
  return __awaiter(this, void 0, void 0, function () {
    var sharp, meta, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 3, , 4]);
          return [4 /*yield*/, loadSharp()];
        case 1:
          sharp = _b.sent();
          return [4 /*yield*/, sharp(buffer).metadata()];
        case 2:
          meta = _b.sent();
          // Check if the image has an alpha channel
          // PNG color types with alpha: 4 (grayscale+alpha), 6 (RGBA)
          // Sharp reports this via 'channels' (4 = RGBA) or 'hasAlpha'
          return [2 /*return*/, meta.hasAlpha === true || meta.channels === 4];
        case 3:
          _a = _b.sent();
          return [2 /*return*/, false];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
/**
 * Resizes an image to PNG format, preserving alpha channel (transparency).
 * Falls back to sharp only (no sips fallback for PNG with alpha).
 */
function resizeToPng(params) {
  return __awaiter(this, void 0, void 0, function () {
    var sharp, compressionLevel;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, loadSharp()];
        case 1:
          sharp = _b.sent();
          compressionLevel = (_a = params.compressionLevel) !== null && _a !== void 0 ? _a : 6;
          return [
            4 /*yield*/,
            sharp(params.buffer)
              .rotate() // Auto-rotate based on EXIF if present
              .resize({
                width: params.maxSide,
                height: params.maxSide,
                fit: "inside",
                withoutEnlargement: params.withoutEnlargement !== false,
              })
              .png({ compressionLevel: compressionLevel })
              .toBuffer(),
          ];
        case 2:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
function optimizeImageToPng(buffer, maxBytes) {
  return __awaiter(this, void 0, void 0, function () {
    var sides,
      compressionLevels,
      smallest,
      _i,
      sides_1,
      side,
      _a,
      compressionLevels_1,
      compressionLevel,
      out,
      size,
      _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          sides = [2048, 1536, 1280, 1024, 800];
          compressionLevels = [6, 7, 8, 9];
          smallest = null;
          ((_i = 0), (sides_1 = sides));
          _c.label = 1;
        case 1:
          if (!(_i < sides_1.length)) {
            return [3 /*break*/, 8];
          }
          side = sides_1[_i];
          ((_a = 0), (compressionLevels_1 = compressionLevels));
          _c.label = 2;
        case 2:
          if (!(_a < compressionLevels_1.length)) {
            return [3 /*break*/, 7];
          }
          compressionLevel = compressionLevels_1[_a];
          _c.label = 3;
        case 3:
          _c.trys.push([3, 5, , 6]);
          return [
            4 /*yield*/,
            resizeToPng({
              buffer: buffer,
              maxSide: side,
              compressionLevel: compressionLevel,
              withoutEnlargement: true,
            }),
          ];
        case 4:
          out = _c.sent();
          size = out.length;
          if (!smallest || size < smallest.size) {
            smallest = {
              buffer: out,
              size: size,
              resizeSide: side,
              compressionLevel: compressionLevel,
            };
          }
          if (size <= maxBytes) {
            return [
              2 /*return*/,
              {
                buffer: out,
                optimizedSize: size,
                resizeSide: side,
                compressionLevel: compressionLevel,
              },
            ];
          }
          return [3 /*break*/, 6];
        case 5:
          _b = _c.sent();
          return [3 /*break*/, 6];
        case 6:
          _a++;
          return [3 /*break*/, 2];
        case 7:
          _i++;
          return [3 /*break*/, 1];
        case 8:
          if (smallest) {
            return [
              2 /*return*/,
              {
                buffer: smallest.buffer,
                optimizedSize: smallest.size,
                resizeSide: smallest.resizeSide,
                compressionLevel: smallest.compressionLevel,
              },
            ];
          }
          throw new Error("Failed to optimize PNG image");
      }
    });
  });
}
/**
 * Internal sips-only EXIF normalization (no sharp fallback).
 * Used by resizeToJpeg to normalize before sips resize.
 */
function normalizeExifOrientationSips(buffer) {
  return __awaiter(this, void 0, void 0, function () {
    var orientation_2, _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          orientation_2 = readJpegExifOrientation(buffer);
          if (!orientation_2 || orientation_2 === 1) {
            return [2 /*return*/, buffer];
          }
          return [4 /*yield*/, sipsApplyOrientation(buffer, orientation_2)];
        case 1:
          return [2 /*return*/, _b.sent()];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, buffer];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
