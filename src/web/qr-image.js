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
exports.renderQrPngBase64 = renderQrPngBase64;
var node_zlib_1 = require("node:zlib");
var index_js_1 = require("qrcode-terminal/vendor/QRCode/index.js");
var QRErrorCorrectLevel_js_1 = require("qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel.js");
var QRCode = index_js_1.default;
var QRErrorCorrectLevel = QRErrorCorrectLevel_js_1.default;
function createQrMatrix(input) {
  var qr = new QRCode(-1, QRErrorCorrectLevel.L);
  qr.addData(input);
  qr.make();
  return qr;
}
function fillPixel(buf, x, y, width, r, g, b, a) {
  if (a === void 0) {
    a = 255;
  }
  var idx = (y * width + x) * 4;
  buf[idx] = r;
  buf[idx + 1] = g;
  buf[idx + 2] = b;
  buf[idx + 3] = a;
}
function crcTable() {
  var table = new Uint32Array(256);
  for (var i = 0; i < 256; i += 1) {
    var c = i;
    for (var k = 0; k < 8; k += 1) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[i] = c >>> 0;
  }
  return table;
}
var CRC_TABLE = crcTable();
function crc32(buf) {
  var crc = 0xffffffff;
  for (var i = 0; i < buf.length; i += 1) {
    crc = CRC_TABLE[(crc ^ buf[i]) & 0xff] ^ (crc >>> 8);
  }
  return (crc ^ 0xffffffff) >>> 0;
}
function pngChunk(type, data) {
  var typeBuf = Buffer.from(type, "ascii");
  var len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  var crc = crc32(Buffer.concat([typeBuf, data]));
  var crcBuf = Buffer.alloc(4);
  crcBuf.writeUInt32BE(crc, 0);
  return Buffer.concat([len, typeBuf, data, crcBuf]);
}
function encodePngRgba(buffer, width, height) {
  var stride = width * 4;
  var raw = Buffer.alloc((stride + 1) * height);
  for (var row = 0; row < height; row += 1) {
    var rawOffset = row * (stride + 1);
    raw[rawOffset] = 0; // filter: none
    buffer.copy(raw, rawOffset + 1, row * stride, row * stride + stride);
  }
  var compressed = (0, node_zlib_1.deflateSync)(raw);
  var signature = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  var ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // color type RGBA
  ihdr[10] = 0; // compression
  ihdr[11] = 0; // filter
  ihdr[12] = 0; // interlace
  return Buffer.concat([
    signature,
    pngChunk("IHDR", ihdr),
    pngChunk("IDAT", compressed),
    pngChunk("IEND", Buffer.alloc(0)),
  ]);
}
function renderQrPngBase64(input_1) {
  return __awaiter(this, arguments, void 0, function (input, opts) {
    var _a,
      scale,
      _b,
      marginModules,
      qr,
      modules,
      size,
      buf,
      row,
      col,
      startX,
      startY,
      y,
      pixelY,
      x,
      pixelX,
      png;
    if (opts === void 0) {
      opts = {};
    }
    return __generator(this, function (_c) {
      ((_a = opts.scale),
        (scale = _a === void 0 ? 6 : _a),
        (_b = opts.marginModules),
        (marginModules = _b === void 0 ? 4 : _b));
      qr = createQrMatrix(input);
      modules = qr.getModuleCount();
      size = (modules + marginModules * 2) * scale;
      buf = Buffer.alloc(size * size * 4, 255);
      for (row = 0; row < modules; row += 1) {
        for (col = 0; col < modules; col += 1) {
          if (!qr.isDark(row, col)) {
            continue;
          }
          startX = (col + marginModules) * scale;
          startY = (row + marginModules) * scale;
          for (y = 0; y < scale; y += 1) {
            pixelY = startY + y;
            for (x = 0; x < scale; x += 1) {
              pixelX = startX + x;
              fillPixel(buf, pixelX, pixelY, size, 0, 0, 0, 255);
            }
          }
        }
      }
      png = encodePngRgba(buf, size, size);
      return [2 /*return*/, png.toString("base64")];
    });
  });
}
