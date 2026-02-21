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
exports.minimaxUnderstandImage = minimaxUnderstandImage;
function coerceApiHost(params) {
  var _a, _b, _c, _d;
  var env = (_a = params.env) !== null && _a !== void 0 ? _a : process.env;
  var raw =
    ((_b = params.apiHost) === null || _b === void 0 ? void 0 : _b.trim()) ||
    ((_c = env.MINIMAX_API_HOST) === null || _c === void 0 ? void 0 : _c.trim()) ||
    ((_d = params.modelBaseUrl) === null || _d === void 0 ? void 0 : _d.trim()) ||
    "https://api.minimax.io";
  try {
    var url = new URL(raw);
    return url.origin;
  } catch (_e) {}
  try {
    var url = new URL("https://".concat(raw));
    return url.origin;
  } catch (_f) {
    return "https://api.minimax.io";
  }
}
function isRecord(value) {
  return Boolean(value && typeof value === "object" && !Array.isArray(value));
}
function pickString(rec, key) {
  var v = rec[key];
  return typeof v === "string" ? v : "";
}
function minimaxUnderstandImage(params) {
  return __awaiter(this, void 0, void 0, function () {
    var apiKey,
      prompt,
      imageDataUrl,
      host,
      url,
      res,
      traceId,
      body,
      trace,
      json,
      trace,
      baseResp,
      code,
      msg,
      trace,
      content,
      trace;
    var _a, _b;
    return __generator(this, function (_c) {
      switch (_c.label) {
        case 0:
          apiKey = params.apiKey.trim();
          if (!apiKey) {
            throw new Error("MiniMax VLM: apiKey required");
          }
          prompt = params.prompt.trim();
          if (!prompt) {
            throw new Error("MiniMax VLM: prompt required");
          }
          imageDataUrl = params.imageDataUrl.trim();
          if (!imageDataUrl) {
            throw new Error("MiniMax VLM: imageDataUrl required");
          }
          if (!/^data:image\/(png|jpeg|webp);base64,/i.test(imageDataUrl)) {
            throw new Error(
              "MiniMax VLM: imageDataUrl must be a base64 data:image/(png|jpeg|webp) URL",
            );
          }
          host = coerceApiHost({
            apiHost: params.apiHost,
            modelBaseUrl: params.modelBaseUrl,
          });
          url = new URL("/v1/coding_plan/vlm", host).toString();
          return [
            4 /*yield*/,
            fetch(url, {
              method: "POST",
              headers: {
                Authorization: "Bearer ".concat(apiKey),
                "Content-Type": "application/json",
                "MM-API-Source": "OpenClaw",
              },
              body: JSON.stringify({
                prompt: prompt,
                image_url: imageDataUrl,
              }),
            }),
          ];
        case 1:
          res = _c.sent();
          traceId = (_a = res.headers.get("Trace-Id")) !== null && _a !== void 0 ? _a : "";
          if (!!res.ok) {
            return [3 /*break*/, 3];
          }
          return [
            4 /*yield*/,
            res.text().catch(function () {
              return "";
            }),
          ];
        case 2:
          body = _c.sent();
          trace = traceId ? " Trace-Id: ".concat(traceId) : "";
          throw new Error(
            "MiniMax VLM request failed ("
              .concat(res.status, " ")
              .concat(res.statusText, ").")
              .concat(trace)
              .concat(body ? " Body: ".concat(body.slice(0, 400)) : ""),
          );
        case 3:
          return [
            4 /*yield*/,
            res.json().catch(function () {
              return null;
            }),
          ];
        case 4:
          json = _c.sent();
          if (!isRecord(json)) {
            trace = traceId ? " Trace-Id: ".concat(traceId) : "";
            throw new Error("MiniMax VLM response was not JSON.".concat(trace));
          }
          baseResp = isRecord(json.base_resp) ? json.base_resp : {};
          code = typeof baseResp.status_code === "number" ? baseResp.status_code : -1;
          if (code !== 0) {
            msg = ((_b = baseResp.status_msg) !== null && _b !== void 0 ? _b : "").trim();
            trace = traceId ? " Trace-Id: ".concat(traceId) : "";
            throw new Error(
              "MiniMax VLM API error ("
                .concat(code, ")")
                .concat(msg ? ": ".concat(msg) : "", ".")
                .concat(trace),
            );
          }
          content = pickString(json, "content").trim();
          if (!content) {
            trace = traceId ? " Trace-Id: ".concat(traceId) : "";
            throw new Error("MiniMax VLM returned no content.".concat(trace));
          }
          return [2 /*return*/, content];
      }
    });
  });
}
