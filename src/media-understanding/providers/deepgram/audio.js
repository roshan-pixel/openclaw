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
exports.DEFAULT_DEEPGRAM_AUDIO_MODEL = exports.DEFAULT_DEEPGRAM_AUDIO_BASE_URL = void 0;
exports.transcribeDeepgramAudio = transcribeDeepgramAudio;
var shared_js_1 = require("../shared.js");
exports.DEFAULT_DEEPGRAM_AUDIO_BASE_URL = "https://api.deepgram.com/v1";
exports.DEFAULT_DEEPGRAM_AUDIO_MODEL = "nova-3";
function resolveModel(model) {
  var trimmed = model === null || model === void 0 ? void 0 : model.trim();
  return trimmed || exports.DEFAULT_DEEPGRAM_AUDIO_MODEL;
}
function transcribeDeepgramAudio(params) {
  return __awaiter(this, void 0, void 0, function () {
    var fetchFn,
      baseUrl,
      model,
      url,
      _i,
      _a,
      _b,
      key,
      value,
      headers,
      body,
      res,
      detail,
      suffix,
      payload,
      transcript;
    var _c, _d, _e, _f, _g, _h, _j, _k, _l;
    return __generator(this, function (_m) {
      switch (_m.label) {
        case 0:
          fetchFn = (_c = params.fetchFn) !== null && _c !== void 0 ? _c : fetch;
          baseUrl = (0, shared_js_1.normalizeBaseUrl)(
            params.baseUrl,
            exports.DEFAULT_DEEPGRAM_AUDIO_BASE_URL,
          );
          model = resolveModel(params.model);
          url = new URL("".concat(baseUrl, "/listen"));
          url.searchParams.set("model", model);
          if ((_d = params.language) === null || _d === void 0 ? void 0 : _d.trim()) {
            url.searchParams.set("language", params.language.trim());
          }
          if (params.query) {
            for (_i = 0, _a = Object.entries(params.query); _i < _a.length; _i++) {
              ((_b = _a[_i]), (key = _b[0]), (value = _b[1]));
              if (value === undefined) {
                continue;
              }
              url.searchParams.set(key, String(value));
            }
          }
          headers = new Headers(params.headers);
          if (!headers.has("authorization")) {
            headers.set("authorization", "Token ".concat(params.apiKey));
          }
          if (!headers.has("content-type")) {
            headers.set(
              "content-type",
              (_e = params.mime) !== null && _e !== void 0 ? _e : "application/octet-stream",
            );
          }
          body = new Uint8Array(params.buffer);
          return [
            4 /*yield*/,
            (0, shared_js_1.fetchWithTimeout)(
              url.toString(),
              {
                method: "POST",
                headers: headers,
                body: body,
              },
              params.timeoutMs,
              fetchFn,
            ),
          ];
        case 1:
          res = _m.sent();
          if (!!res.ok) {
            return [3 /*break*/, 3];
          }
          return [4 /*yield*/, (0, shared_js_1.readErrorResponse)(res)];
        case 2:
          detail = _m.sent();
          suffix = detail ? ": ".concat(detail) : "";
          throw new Error(
            "Audio transcription failed (HTTP ".concat(res.status, ")").concat(suffix),
          );
        case 3:
          return [4 /*yield*/, res.json()];
        case 4:
          payload = _m.sent();
          transcript =
            (_l =
              (_k =
                (_j =
                  (_h =
                    (_g =
                      (_f = payload.results) === null || _f === void 0 ? void 0 : _f.channels) ===
                      null || _g === void 0
                      ? void 0
                      : _g[0]) === null || _h === void 0
                    ? void 0
                    : _h.alternatives) === null || _j === void 0
                  ? void 0
                  : _j[0]) === null || _k === void 0
                ? void 0
                : _k.transcript) === null || _l === void 0
              ? void 0
              : _l.trim();
          if (!transcript) {
            throw new Error("Audio transcription response missing transcript");
          }
          return [2 /*return*/, { text: transcript, model: model }];
      }
    });
  });
}
