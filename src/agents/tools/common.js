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
exports.createActionGate = createActionGate;
exports.readStringParam = readStringParam;
exports.readStringOrNumberParam = readStringOrNumberParam;
exports.readNumberParam = readNumberParam;
exports.readStringArrayParam = readStringArrayParam;
exports.readReactionParams = readReactionParams;
exports.jsonResult = jsonResult;
exports.imageResult = imageResult;
exports.imageResultFromFile = imageResultFromFile;
var promises_1 = require("node:fs/promises");
var mime_js_1 = require("../../media/mime.js");
var tool_images_js_1 = require("../tool-images.js");
function createActionGate(actions) {
  return function (key, defaultValue) {
    if (defaultValue === void 0) {
      defaultValue = true;
    }
    var value = actions === null || actions === void 0 ? void 0 : actions[key];
    if (value === undefined) {
      return defaultValue;
    }
    return value !== false;
  };
}
function readStringParam(params, key, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.required,
    required = _a === void 0 ? false : _a,
    _b = options.trim,
    trim = _b === void 0 ? true : _b,
    _c = options.label,
    label = _c === void 0 ? key : _c,
    _d = options.allowEmpty,
    allowEmpty = _d === void 0 ? false : _d;
  var raw = params[key];
  if (typeof raw !== "string") {
    if (required) {
      throw new Error("".concat(label, " required"));
    }
    return undefined;
  }
  var value = trim ? raw.trim() : raw;
  if (!value && !allowEmpty) {
    if (required) {
      throw new Error("".concat(label, " required"));
    }
    return undefined;
  }
  return value;
}
function readStringOrNumberParam(params, key, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.required,
    required = _a === void 0 ? false : _a,
    _b = options.label,
    label = _b === void 0 ? key : _b;
  var raw = params[key];
  if (typeof raw === "number" && Number.isFinite(raw)) {
    return String(raw);
  }
  if (typeof raw === "string") {
    var value = raw.trim();
    if (value) {
      return value;
    }
  }
  if (required) {
    throw new Error("".concat(label, " required"));
  }
  return undefined;
}
function readNumberParam(params, key, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.required,
    required = _a === void 0 ? false : _a,
    _b = options.label,
    label = _b === void 0 ? key : _b,
    _c = options.integer,
    integer = _c === void 0 ? false : _c;
  var raw = params[key];
  var value;
  if (typeof raw === "number" && Number.isFinite(raw)) {
    value = raw;
  } else if (typeof raw === "string") {
    var trimmed = raw.trim();
    if (trimmed) {
      var parsed = Number.parseFloat(trimmed);
      if (Number.isFinite(parsed)) {
        value = parsed;
      }
    }
  }
  if (value === undefined) {
    if (required) {
      throw new Error("".concat(label, " required"));
    }
    return undefined;
  }
  return integer ? Math.trunc(value) : value;
}
function readStringArrayParam(params, key, options) {
  if (options === void 0) {
    options = {};
  }
  var _a = options.required,
    required = _a === void 0 ? false : _a,
    _b = options.label,
    label = _b === void 0 ? key : _b;
  var raw = params[key];
  if (Array.isArray(raw)) {
    var values = raw
      .filter(function (entry) {
        return typeof entry === "string";
      })
      .map(function (entry) {
        return entry.trim();
      })
      .filter(Boolean);
    if (values.length === 0) {
      if (required) {
        throw new Error("".concat(label, " required"));
      }
      return undefined;
    }
    return values;
  }
  if (typeof raw === "string") {
    var value = raw.trim();
    if (!value) {
      if (required) {
        throw new Error("".concat(label, " required"));
      }
      return undefined;
    }
    return [value];
  }
  if (required) {
    throw new Error("".concat(label, " required"));
  }
  return undefined;
}
function readReactionParams(params, options) {
  var _a, _b;
  var emojiKey = (_a = options.emojiKey) !== null && _a !== void 0 ? _a : "emoji";
  var removeKey = (_b = options.removeKey) !== null && _b !== void 0 ? _b : "remove";
  var remove = typeof params[removeKey] === "boolean" ? params[removeKey] : false;
  var emoji = readStringParam(params, emojiKey, {
    required: true,
    allowEmpty: true,
  });
  if (remove && !emoji) {
    throw new Error(options.removeErrorMessage);
  }
  return { emoji: emoji, remove: remove, isEmpty: !emoji };
}
function jsonResult(payload) {
  return {
    content: [
      {
        type: "text",
        text: JSON.stringify(payload, null, 2),
      },
    ],
    details: payload,
  };
}
function imageResult(params) {
  return __awaiter(this, void 0, void 0, function () {
    var content, result;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          content = [
            {
              type: "text",
              text:
                (_a = params.extraText) !== null && _a !== void 0
                  ? _a
                  : "MEDIA:".concat(params.path),
            },
            {
              type: "image",
              data: params.base64,
              mimeType: params.mimeType,
            },
          ];
          result = {
            content: content,
            details: __assign({ path: params.path }, params.details),
          };
          return [
            4 /*yield*/,
            (0, tool_images_js_1.sanitizeToolResultImages)(result, params.label),
          ];
        case 1:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
function imageResultFromFile(params) {
  return __awaiter(this, void 0, void 0, function () {
    var buf, mimeType;
    var _a;
    return __generator(this, function (_b) {
      switch (_b.label) {
        case 0:
          return [4 /*yield*/, promises_1.default.readFile(params.path)];
        case 1:
          buf = _b.sent();
          return [4 /*yield*/, (0, mime_js_1.detectMime)({ buffer: buf.slice(0, 256) })];
        case 2:
          mimeType = (_a = _b.sent()) !== null && _a !== void 0 ? _a : "image/png";
          return [
            4 /*yield*/,
            imageResult({
              label: params.label,
              path: params.path,
              base64: buf.toString("base64"),
              mimeType: mimeType,
              extraText: params.extraText,
              details: params.details,
            }),
          ];
        case 3:
          return [2 /*return*/, _b.sent()];
      }
    });
  });
}
