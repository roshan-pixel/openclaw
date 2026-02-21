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
exports.describeImageWithModel = describeImageWithModel;
var pi_ai_1 = require("@mariozechner/pi-ai");
var pi_coding_agent_1 = require("@mariozechner/pi-coding-agent");
var model_auth_js_1 = require("../../agents/model-auth.js");
var models_config_js_1 = require("../../agents/models-config.js");
var minimax_vlm_js_1 = require("../../agents/minimax-vlm.js");
var image_tool_helpers_js_1 = require("../../agents/tools/image-tool.helpers.js");
function describeImageWithModel(params) {
  return __awaiter(this, void 0, void 0, function () {
    var authStorage,
      modelRegistry,
      model,
      apiKeyInfo,
      apiKey,
      base64,
      text_1,
      context,
      message,
      text;
    var _a, _b, _c, _d, _e, _f;
    return __generator(this, function (_g) {
      switch (_g.label) {
        case 0:
          return [
            4 /*yield*/,
            (0, models_config_js_1.ensureOpenClawModelsJson)(params.cfg, params.agentDir),
          ];
        case 1:
          _g.sent();
          authStorage = (0, pi_coding_agent_1.discoverAuthStorage)(params.agentDir);
          modelRegistry = (0, pi_coding_agent_1.discoverModels)(authStorage, params.agentDir);
          model = modelRegistry.find(params.provider, params.model);
          if (!model) {
            throw new Error("Unknown model: ".concat(params.provider, "/").concat(params.model));
          }
          if (!((_a = model.input) === null || _a === void 0 ? void 0 : _a.includes("image"))) {
            throw new Error(
              "Model does not support images: ".concat(params.provider, "/").concat(params.model),
            );
          }
          return [
            4 /*yield*/,
            (0, model_auth_js_1.getApiKeyForModel)({
              model: model,
              cfg: params.cfg,
              agentDir: params.agentDir,
              profileId: params.profile,
              preferredProfile: params.preferredProfile,
            }),
          ];
        case 2:
          apiKeyInfo = _g.sent();
          apiKey = (0, model_auth_js_1.requireApiKey)(apiKeyInfo, model.provider);
          authStorage.setRuntimeApiKey(model.provider, apiKey);
          base64 = params.buffer.toString("base64");
          if (!(model.provider === "minimax")) {
            return [3 /*break*/, 4];
          }
          return [
            4 /*yield*/,
            (0, minimax_vlm_js_1.minimaxUnderstandImage)({
              apiKey: apiKey,
              prompt: (_b = params.prompt) !== null && _b !== void 0 ? _b : "Describe the image.",
              imageDataUrl: "data:"
                .concat(
                  (_c = params.mime) !== null && _c !== void 0 ? _c : "image/jpeg",
                  ";base64,",
                )
                .concat(base64),
              modelBaseUrl: model.baseUrl,
            }),
          ];
        case 3:
          text_1 = _g.sent();
          return [2 /*return*/, { text: text_1, model: model.id }];
        case 4:
          context = {
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "text",
                    text:
                      (_d = params.prompt) !== null && _d !== void 0 ? _d : "Describe the image.",
                  },
                  {
                    type: "image",
                    data: base64,
                    mimeType: (_e = params.mime) !== null && _e !== void 0 ? _e : "image/jpeg",
                  },
                ],
                timestamp: Date.now(),
              },
            ],
          };
          return [
            4 /*yield*/,
            (0, pi_ai_1.complete)(model, context, {
              apiKey: apiKey,
              maxTokens: (_f = params.maxTokens) !== null && _f !== void 0 ? _f : 512,
            }),
          ];
        case 5:
          message = _g.sent();
          text = (0, image_tool_helpers_js_1.coerceImageAssistantText)({
            message: message,
            provider: model.provider,
            model: model.id,
          });
          return [2 /*return*/, { text: text, model: model.id }];
      }
    });
  });
}
