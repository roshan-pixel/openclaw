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
var __asyncValues =
  (this && this.__asyncValues) ||
  function (o) {
    if (!Symbol.asyncIterator) {
      throw new TypeError("Symbol.asyncIterator is not defined.");
    }
    var m = o[Symbol.asyncIterator],
      i;
    return m
      ? m.call(o)
      : ((o = typeof __values === "function" ? __values(o) : o[Symbol.iterator]()),
        (i = {}),
        verb("next"),
        verb("throw"),
        verb("return"),
        (i[Symbol.asyncIterator] = function () {
          return this;
        }),
        i);
    function verb(n) {
      i[n] =
        o[n] &&
        function (v) {
          return new Promise(function (resolve, reject) {
            ((v = o[n](v)), settle(resolve, reject, v.done, v.value));
          });
        };
    }
    function settle(resolve, reject, d, v) {
      Promise.resolve(v).then(function (v) {
        resolve({ value: v, done: d });
      }, reject);
    }
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.downloadLineMedia = downloadLineMedia;
var node_fs_1 = require("node:fs");
var node_path_1 = require("node:path");
var node_os_1 = require("node:os");
var bot_sdk_1 = require("@line/bot-sdk");
var globals_js_1 = require("../globals.js");
function downloadLineMedia(messageId_1, channelAccessToken_1) {
  return __awaiter(this, arguments, void 0, function (messageId, channelAccessToken, maxBytes) {
    var client,
      response,
      chunks,
      totalSize,
      _a,
      _b,
      _c,
      chunk,
      e_1_1,
      buffer,
      contentType,
      ext,
      tempDir,
      fileName,
      filePath;
    var _d, e_1, _e, _f;
    if (maxBytes === void 0) {
      maxBytes = 10 * 1024 * 1024;
    }
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          client = new bot_sdk_1.messagingApi.MessagingApiBlobClient({
            channelAccessToken: channelAccessToken,
          });
          return [4 /*yield*/, client.getMessageContent(messageId)];
        case 1:
          response = _g.sent();
          chunks = [];
          totalSize = 0;
          _g.label = 2;
        case 2:
          _g.trys.push([2, 7, 8, 13]);
          ((_a = true), (_b = __asyncValues(response)));
          _g.label = 3;
        case 3:
          return [4 /*yield*/, _b.next()];
        case 4:
          if (!((_c = _g.sent()), (_d = _c.done), !_d)) {
            return [3 /*break*/, 6];
          }
          _f = _c.value;
          _a = false;
          chunk = _f;
          totalSize += chunk.length;
          if (totalSize > maxBytes) {
            throw new Error(
              "Media exceeds ".concat(Math.round(maxBytes / (1024 * 1024)), "MB limit"),
            );
          }
          chunks.push(chunk);
          _g.label = 5;
        case 5:
          _a = true;
          return [3 /*break*/, 3];
        case 6:
          return [3 /*break*/, 13];
        case 7:
          e_1_1 = _g.sent();
          e_1 = { error: e_1_1 };
          return [3 /*break*/, 13];
        case 8:
          _g.trys.push([8, , 11, 12]);
          if (!(!_a && !_d && (_e = _b.return))) {
            return [3 /*break*/, 10];
          }
          return [4 /*yield*/, _e.call(_b)];
        case 9:
          _g.sent();
          _g.label = 10;
        case 10:
          return [3 /*break*/, 12];
        case 11:
          if (e_1) {
            throw e_1.error;
          }
          return [7 /*endfinally*/];
        case 12:
          return [7 /*endfinally*/];
        case 13:
          buffer = Buffer.concat(chunks);
          contentType = detectContentType(buffer);
          ext = getExtensionForContentType(contentType);
          tempDir = node_os_1.default.tmpdir();
          fileName = "line-media-".concat(messageId, "-").concat(Date.now()).concat(ext);
          filePath = node_path_1.default.join(tempDir, fileName);
          return [4 /*yield*/, node_fs_1.default.promises.writeFile(filePath, buffer)];
        case 14:
          _g.sent();
          (0, globals_js_1.logVerbose)(
            "line: downloaded media "
              .concat(messageId, " to ")
              .concat(filePath, " (")
              .concat(buffer.length, " bytes)"),
          );
          return [
            2 /*return*/,
            {
              path: filePath,
              contentType: contentType,
              size: buffer.length,
            },
          ];
      }
    });
  });
}
function detectContentType(buffer) {
  // Check magic bytes
  if (buffer.length >= 2) {
    // JPEG
    if (buffer[0] === 0xff && buffer[1] === 0xd8) {
      return "image/jpeg";
    }
    // PNG
    if (buffer[0] === 0x89 && buffer[1] === 0x50 && buffer[2] === 0x4e && buffer[3] === 0x47) {
      return "image/png";
    }
    // GIF
    if (buffer[0] === 0x47 && buffer[1] === 0x49 && buffer[2] === 0x46) {
      return "image/gif";
    }
    // WebP
    if (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    ) {
      return "image/webp";
    }
    // MP4
    if (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
      return "video/mp4";
    }
    // M4A/AAC
    if (buffer[0] === 0x00 && buffer[1] === 0x00 && buffer[2] === 0x00) {
      if (buffer[4] === 0x66 && buffer[5] === 0x74 && buffer[6] === 0x79 && buffer[7] === 0x70) {
        return "audio/mp4";
      }
    }
  }
  return "application/octet-stream";
}
function getExtensionForContentType(contentType) {
  switch (contentType) {
    case "image/jpeg":
      return ".jpg";
    case "image/png":
      return ".png";
    case "image/gif":
      return ".gif";
    case "image/webp":
      return ".webp";
    case "video/mp4":
      return ".mp4";
    case "audio/mp4":
      return ".m4a";
    case "audio/mpeg":
      return ".mp3";
    default:
      return ".bin";
  }
}
