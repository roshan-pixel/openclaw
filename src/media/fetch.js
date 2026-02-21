"use strict";
var __extends =
  (this && this.__extends) ||
  (function () {
    var extendStatics = function (d, b) {
      extendStatics =
        Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array &&
          function (d, b) {
            d.__proto__ = b;
          }) ||
        function (d, b) {
          for (var p in b) {
            if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p];
          }
        };
      return extendStatics(d, b);
    };
    return function (d, b) {
      if (typeof b !== "function" && b !== null) {
        throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
      }
      extendStatics(d, b);
      function __() {
        this.constructor = d;
      }
      d.prototype = b === null ? Object.create(b) : ((__.prototype = b.prototype), new __());
    };
  })();
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
exports.MediaFetchError = void 0;
exports.fetchRemoteMedia = fetchRemoteMedia;
var node_path_1 = require("node:path");
var mime_js_1 = require("./mime.js");
var MediaFetchError = /** @class */ (function (_super) {
  __extends(MediaFetchError, _super);
  function MediaFetchError(code, message) {
    var _this = _super.call(this, message) || this;
    _this.code = code;
    _this.name = "MediaFetchError";
    return _this;
  }
  return MediaFetchError;
})(Error);
exports.MediaFetchError = MediaFetchError;
function stripQuotes(value) {
  return value.replace(/^["']|["']$/g, "");
}
function parseContentDispositionFileName(header) {
  if (!header) {
    return undefined;
  }
  var starMatch = /filename\*\s*=\s*([^;]+)/i.exec(header);
  if (starMatch === null || starMatch === void 0 ? void 0 : starMatch[1]) {
    var cleaned = stripQuotes(starMatch[1].trim());
    var encoded = cleaned.split("''").slice(1).join("''") || cleaned;
    try {
      return node_path_1.default.basename(decodeURIComponent(encoded));
    } catch (_a) {
      return node_path_1.default.basename(encoded);
    }
  }
  var match = /filename\s*=\s*([^;]+)/i.exec(header);
  if (match === null || match === void 0 ? void 0 : match[1]) {
    return node_path_1.default.basename(stripQuotes(match[1].trim()));
  }
  return undefined;
}
function readErrorBodySnippet(res_1) {
  return __awaiter(this, arguments, void 0, function (res, maxChars) {
    var text, collapsed, _a;
    if (maxChars === void 0) {
      maxChars = 200;
    }
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          _b.trys.push([0, 2, , 3]);
          return [4 /*yield*/, res.text()];
        case 1:
          text = _b.sent();
          if (!text) {
            return [2 /*return*/, undefined];
          }
          collapsed = text.replace(/\s+/g, " ").trim();
          if (!collapsed) {
            return [2 /*return*/, undefined];
          }
          if (collapsed.length <= maxChars) {
            return [2 /*return*/, collapsed];
          }
          return [2 /*return*/, "".concat(collapsed.slice(0, maxChars), "\u2026")];
        case 2:
          _a = _b.sent();
          return [2 /*return*/, undefined];
        case 3:
          return [2 /*return*/];
      }
    });
  });
}
function fetchRemoteMedia(options) {
  return __awaiter(this, void 0, void 0, function () {
    var url,
      fetchImpl,
      filePathHint,
      maxBytes,
      fetcher,
      res,
      err_1,
      statusText,
      redirected,
      detail,
      snippet,
      contentLength,
      length_1,
      buffer,
      _a,
      _b,
      _c,
      fileNameFromUrl,
      parsed,
      base,
      headerFileName,
      fileName,
      filePathForMime,
      contentType,
      ext;
    return __generator(this, function (_d) {
      switch (_d.label) {
        case 0:
          ((url = options.url),
            (fetchImpl = options.fetchImpl),
            (filePathHint = options.filePathHint),
            (maxBytes = options.maxBytes));
          fetcher = fetchImpl !== null && fetchImpl !== void 0 ? fetchImpl : globalThis.fetch;
          if (!fetcher) {
            throw new Error("fetch is not available");
          }
          _d.label = 1;
        case 1:
          _d.trys.push([1, 3, , 4]);
          return [4 /*yield*/, fetcher(url)];
        case 2:
          res = _d.sent();
          return [3 /*break*/, 4];
        case 3:
          err_1 = _d.sent();
          throw new MediaFetchError(
            "fetch_failed",
            "Failed to fetch media from ".concat(url, ": ").concat(String(err_1)),
          );
        case 4:
          if (!!res.ok) {
            return [3 /*break*/, 8];
          }
          statusText = res.statusText ? " ".concat(res.statusText) : "";
          redirected = res.url && res.url !== url ? " (redirected to ".concat(res.url, ")") : "";
          detail = "HTTP ".concat(res.status).concat(statusText);
          if (!!res.body) {
            return [3 /*break*/, 5];
          }
          detail = "HTTP ".concat(res.status).concat(statusText, "; empty response body");
          return [3 /*break*/, 7];
        case 5:
          return [4 /*yield*/, readErrorBodySnippet(res)];
        case 6:
          snippet = _d.sent();
          if (snippet) {
            detail += "; body: ".concat(snippet);
          }
          _d.label = 7;
        case 7:
          throw new MediaFetchError(
            "http_error",
            "Failed to fetch media from ".concat(url).concat(redirected, ": ").concat(detail),
          );
        case 8:
          contentLength = res.headers.get("content-length");
          if (maxBytes && contentLength) {
            length_1 = Number(contentLength);
            if (Number.isFinite(length_1) && length_1 > maxBytes) {
              throw new MediaFetchError(
                "max_bytes",
                "Failed to fetch media from "
                  .concat(url, ": content length ")
                  .concat(length_1, " exceeds maxBytes ")
                  .concat(maxBytes),
              );
            }
          }
          if (!maxBytes) {
            return [3 /*break*/, 10];
          }
          return [4 /*yield*/, readResponseWithLimit(res, maxBytes)];
        case 9:
          _a = _d.sent();
          return [3 /*break*/, 12];
        case 10:
          _c = (_b = Buffer).from;
          return [4 /*yield*/, res.arrayBuffer()];
        case 11:
          _a = _c.apply(_b, [_d.sent()]);
          _d.label = 12;
        case 12:
          buffer = _a;
          try {
            parsed = new URL(url);
            base = node_path_1.default.basename(parsed.pathname);
            fileNameFromUrl = base || undefined;
          } catch (_e) {
            // ignore parse errors; leave undefined
          }
          headerFileName = parseContentDispositionFileName(res.headers.get("content-disposition"));
          fileName =
            headerFileName ||
            fileNameFromUrl ||
            (filePathHint ? node_path_1.default.basename(filePathHint) : undefined);
          filePathForMime =
            headerFileName && node_path_1.default.extname(headerFileName)
              ? headerFileName
              : filePathHint !== null && filePathHint !== void 0
                ? filePathHint
                : url;
          return [
            4 /*yield*/,
            (0, mime_js_1.detectMime)({
              buffer: buffer,
              headerMime: res.headers.get("content-type"),
              filePath: filePathForMime,
            }),
          ];
        case 13:
          contentType = _d.sent();
          if (fileName && !node_path_1.default.extname(fileName) && contentType) {
            ext = (0, mime_js_1.extensionForMime)(contentType);
            if (ext) {
              fileName = "".concat(fileName).concat(ext);
            }
          }
          return [
            2 /*return*/,
            {
              buffer: buffer,
              contentType: contentType !== null && contentType !== void 0 ? contentType : undefined,
              fileName: fileName,
            },
          ];
      }
    });
  });
}
function readResponseWithLimit(res, maxBytes) {
  return __awaiter(this, void 0, void 0, function () {
    var body, fallback, _a, _b, reader, chunks, total, _c, done, value, _d;
    return __generator(this, function (_e) {
      switch (_e.label) {
        case 0:
          body = res.body;
          if (!(!body || typeof body.getReader !== "function")) {
            return [3 /*break*/, 2];
          }
          _b = (_a = Buffer).from;
          return [4 /*yield*/, res.arrayBuffer()];
        case 1:
          fallback = _b.apply(_a, [_e.sent()]);
          if (fallback.length > maxBytes) {
            throw new MediaFetchError(
              "max_bytes",
              "Failed to fetch media from "
                .concat(res.url || "response", ": payload exceeds maxBytes ")
                .concat(maxBytes),
            );
          }
          return [2 /*return*/, fallback];
        case 2:
          reader = body.getReader();
          chunks = [];
          total = 0;
          _e.label = 3;
        case 3:
          _e.trys.push([3, , 13, 14]);
          _e.label = 4;
        case 4:
          if (!true) {
            return [3 /*break*/, 12];
          }
          return [4 /*yield*/, reader.read()];
        case 5:
          ((_c = _e.sent()), (done = _c.done), (value = _c.value));
          if (done) {
            return [3 /*break*/, 12];
          }
          if (!(value === null || value === void 0 ? void 0 : value.length)) {
            return [3 /*break*/, 11];
          }
          total += value.length;
          if (!(total > maxBytes)) {
            return [3 /*break*/, 10];
          }
          _e.label = 6;
        case 6:
          _e.trys.push([6, 8, , 9]);
          return [4 /*yield*/, reader.cancel()];
        case 7:
          _e.sent();
          return [3 /*break*/, 9];
        case 8:
          _d = _e.sent();
          return [3 /*break*/, 9];
        case 9:
          throw new MediaFetchError(
            "max_bytes",
            "Failed to fetch media from "
              .concat(res.url || "response", ": payload exceeds maxBytes ")
              .concat(maxBytes),
          );
        case 10:
          chunks.push(value);
          _e.label = 11;
        case 11:
          return [3 /*break*/, 4];
        case 12:
          return [3 /*break*/, 14];
        case 13:
          try {
            reader.releaseLock();
          } catch (_f) {}
          return [7 /*endfinally*/];
        case 14:
          return [
            2 /*return*/,
            Buffer.concat(
              chunks.map(function (chunk) {
                return Buffer.from(chunk);
              }),
              total,
            ),
          ];
      }
    });
  });
}
