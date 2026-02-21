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
exports.getFileExtension = getFileExtension;
exports.isAudioFileName = isAudioFileName;
exports.detectMime = detectMime;
exports.extensionForMime = extensionForMime;
exports.isGifMedia = isGifMedia;
exports.imageMimeFromFormat = imageMimeFromFormat;
exports.kindFromMime = kindFromMime;
var node_path_1 = require("node:path");
var file_type_1 = require("file-type");
var constants_js_1 = require("./constants.js");
// Map common mimes to preferred file extensions.
var EXT_BY_MIME = {
  "image/heic": ".heic",
  "image/heif": ".heif",
  "image/jpeg": ".jpg",
  "image/png": ".png",
  "image/webp": ".webp",
  "image/gif": ".gif",
  "audio/ogg": ".ogg",
  "audio/mpeg": ".mp3",
  "audio/x-m4a": ".m4a",
  "audio/mp4": ".m4a",
  "video/mp4": ".mp4",
  "video/quicktime": ".mov",
  "application/pdf": ".pdf",
  "application/json": ".json",
  "application/zip": ".zip",
  "application/gzip": ".gz",
  "application/x-tar": ".tar",
  "application/x-7z-compressed": ".7z",
  "application/vnd.rar": ".rar",
  "application/msword": ".doc",
  "application/vnd.ms-excel": ".xls",
  "application/vnd.ms-powerpoint": ".ppt",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document": ".docx",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": ".xlsx",
  "application/vnd.openxmlformats-officedocument.presentationml.presentation": ".pptx",
  "text/csv": ".csv",
  "text/plain": ".txt",
  "text/markdown": ".md",
};
var MIME_BY_EXT = __assign(
  __assign(
    {},
    Object.fromEntries(
      Object.entries(EXT_BY_MIME).map(function (_a) {
        var mime = _a[0],
          ext = _a[1];
        return [ext, mime];
      }),
    ),
  ),
  {
    // Additional extension aliases
    ".jpeg": "image/jpeg",
  },
);
var AUDIO_FILE_EXTENSIONS = new Set([
  ".aac",
  ".flac",
  ".m4a",
  ".mp3",
  ".oga",
  ".ogg",
  ".opus",
  ".wav",
]);
function normalizeHeaderMime(mime) {
  var _a;
  if (!mime) {
    return undefined;
  }
  var cleaned =
    (_a = mime.split(";")[0]) === null || _a === void 0 ? void 0 : _a.trim().toLowerCase();
  return cleaned || undefined;
}
function sniffMime(buffer) {
  return __awaiter(this, void 0, void 0, function () {
    var type, _a;
    var _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          if (!buffer) {
            return [2 /*return*/, undefined];
          }
          _c.label = 1;
        case 1:
          _c.trys.push([1, 3, , 4]);
          return [4 /*yield*/, (0, file_type_1.fileTypeFromBuffer)(buffer)];
        case 2:
          type = _c.sent();
          return [
            2 /*return*/,
            (_b = type === null || type === void 0 ? void 0 : type.mime) !== null && _b !== void 0
              ? _b
              : undefined,
          ];
        case 3:
          _a = _c.sent();
          return [2 /*return*/, undefined];
        case 4:
          return [2 /*return*/];
      }
    });
  });
}
function getFileExtension(filePath) {
  if (!filePath) {
    return undefined;
  }
  try {
    if (/^https?:\/\//i.test(filePath)) {
      var url = new URL(filePath);
      return node_path_1.default.extname(url.pathname).toLowerCase() || undefined;
    }
  } catch (_a) {
    // fall back to plain path parsing
  }
  var ext = node_path_1.default.extname(filePath).toLowerCase();
  return ext || undefined;
}
function isAudioFileName(fileName) {
  var ext = getFileExtension(fileName);
  if (!ext) {
    return false;
  }
  return AUDIO_FILE_EXTENSIONS.has(ext);
}
function detectMime(opts) {
  return detectMimeImpl(opts);
}
function isGenericMime(mime) {
  if (!mime) {
    return true;
  }
  var m = mime.toLowerCase();
  return m === "application/octet-stream" || m === "application/zip";
}
function detectMimeImpl(opts) {
  return __awaiter(this, void 0, void 0, function () {
    var ext, extMime, headerMime, sniffed;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          ext = getFileExtension(opts.filePath);
          extMime = ext ? MIME_BY_EXT[ext] : undefined;
          headerMime = normalizeHeaderMime(opts.headerMime);
          return [4 /*yield*/, sniffMime(opts.buffer)];
        case 1:
          sniffed = _a.sent();
          // Prefer sniffed types, but don't let generic container types override a more
          // specific extension mapping (e.g. XLSX vs ZIP).
          if (sniffed && (!isGenericMime(sniffed) || !extMime)) {
            return [2 /*return*/, sniffed];
          }
          if (extMime) {
            return [2 /*return*/, extMime];
          }
          if (headerMime && !isGenericMime(headerMime)) {
            return [2 /*return*/, headerMime];
          }
          if (sniffed) {
            return [2 /*return*/, sniffed];
          }
          if (headerMime) {
            return [2 /*return*/, headerMime];
          }
          return [2 /*return*/, undefined];
      }
    });
  });
}
function extensionForMime(mime) {
  if (!mime) {
    return undefined;
  }
  return EXT_BY_MIME[mime.toLowerCase()];
}
function isGifMedia(opts) {
  var _a;
  if (
    ((_a = opts.contentType) === null || _a === void 0 ? void 0 : _a.toLowerCase()) === "image/gif"
  ) {
    return true;
  }
  var ext = getFileExtension(opts.fileName);
  return ext === ".gif";
}
function imageMimeFromFormat(format) {
  if (!format) {
    return undefined;
  }
  switch (format.toLowerCase()) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "heic":
      return "image/heic";
    case "heif":
      return "image/heif";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return undefined;
  }
}
function kindFromMime(mime) {
  return (0, constants_js_1.mediaKindFromMime)(mime);
}
