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
exports.signalTypingIfNeeded =
  exports.finalizeWithFollowup =
  exports.createShouldEmitToolOutput =
  exports.createShouldEmitToolResult =
  exports.isAudioPayload =
    void 0;
var sessions_js_1 = require("../../config/sessions.js");
var mime_js_1 = require("../../media/mime.js");
var thinking_js_1 = require("../thinking.js");
var queue_js_1 = require("./queue.js");
var hasAudioMedia = function (urls) {
  return Boolean(
    urls === null || urls === void 0
      ? void 0
      : urls.some(function (url) {
          return (0, mime_js_1.isAudioFileName)(url);
        }),
  );
};
var isAudioPayload = function (payload) {
  var _a;
  return hasAudioMedia(
    (_a = payload.mediaUrls) !== null && _a !== void 0
      ? _a
      : payload.mediaUrl
        ? [payload.mediaUrl]
        : undefined,
  );
};
exports.isAudioPayload = isAudioPayload;
var createShouldEmitToolResult = function (params) {
  var _a, _b;
  // Normalize verbose values from session store/config so false/"false" still means off.
  var fallbackVerbose =
    (_b = (0, thinking_js_1.normalizeVerboseLevel)(
      String((_a = params.resolvedVerboseLevel) !== null && _a !== void 0 ? _a : ""),
    )) !== null && _b !== void 0
      ? _b
      : "off";
  return function () {
    var _a;
    if (!params.sessionKey || !params.storePath) {
      return fallbackVerbose !== "off";
    }
    try {
      var store = (0, sessions_js_1.loadSessionStore)(params.storePath);
      var entry = store[params.sessionKey];
      var current = (0, thinking_js_1.normalizeVerboseLevel)(
        String(
          (_a = entry === null || entry === void 0 ? void 0 : entry.verboseLevel) !== null &&
            _a !== void 0
            ? _a
            : "",
        ),
      );
      if (current) {
        return current !== "off";
      }
    } catch (_b) {
      // ignore store read failures
    }
    return fallbackVerbose !== "off";
  };
};
exports.createShouldEmitToolResult = createShouldEmitToolResult;
var createShouldEmitToolOutput = function (params) {
  var _a, _b;
  // Normalize verbose values from session store/config so false/"false" still means off.
  var fallbackVerbose =
    (_b = (0, thinking_js_1.normalizeVerboseLevel)(
      String((_a = params.resolvedVerboseLevel) !== null && _a !== void 0 ? _a : ""),
    )) !== null && _b !== void 0
      ? _b
      : "off";
  return function () {
    var _a;
    if (!params.sessionKey || !params.storePath) {
      return fallbackVerbose === "full";
    }
    try {
      var store = (0, sessions_js_1.loadSessionStore)(params.storePath);
      var entry = store[params.sessionKey];
      var current = (0, thinking_js_1.normalizeVerboseLevel)(
        String(
          (_a = entry === null || entry === void 0 ? void 0 : entry.verboseLevel) !== null &&
            _a !== void 0
            ? _a
            : "",
        ),
      );
      if (current) {
        return current === "full";
      }
    } catch (_b) {
      // ignore store read failures
    }
    return fallbackVerbose === "full";
  };
};
exports.createShouldEmitToolOutput = createShouldEmitToolOutput;
var finalizeWithFollowup = function (value, queueKey, runFollowupTurn) {
  (0, queue_js_1.scheduleFollowupDrain)(queueKey, runFollowupTurn);
  return value;
};
exports.finalizeWithFollowup = finalizeWithFollowup;
var signalTypingIfNeeded = function (payloads, typingSignals) {
  return __awaiter(void 0, void 0, void 0, function () {
    var shouldSignalTyping;
    return __generator(this, function (_a) {
      switch (_a.label) {
        case 0:
          shouldSignalTyping = payloads.some(function (payload) {
            var _a;
            var trimmed = (_a = payload.text) === null || _a === void 0 ? void 0 : _a.trim();
            if (trimmed) {
              return true;
            }
            if (payload.mediaUrl) {
              return true;
            }
            if (payload.mediaUrls && payload.mediaUrls.length > 0) {
              return true;
            }
            return false;
          });
          if (!shouldSignalTyping) {
            return [3 /*break*/, 2];
          }
          return [4 /*yield*/, typingSignals.signalRunStart()];
        case 1:
          _a.sent();
          _a.label = 2;
        case 2:
          return [2 /*return*/];
      }
    });
  });
};
exports.signalTypingIfNeeded = signalTypingIfNeeded;
