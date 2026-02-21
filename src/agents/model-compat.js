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
Object.defineProperty(exports, "__esModule", { value: true });
exports.normalizeModelCompat = normalizeModelCompat;
function isOpenAiCompletionsModel(model) {
  return model.api === "openai-completions";
}
function normalizeModelCompat(model) {
  var _a, _b;
  var baseUrl = (_a = model.baseUrl) !== null && _a !== void 0 ? _a : "";
  var isZai = model.provider === "zai" || baseUrl.includes("api.z.ai");
  if (!isZai || !isOpenAiCompletionsModel(model)) {
    return model;
  }
  var openaiModel = model;
  var compat = (_b = openaiModel.compat) !== null && _b !== void 0 ? _b : undefined;
  if ((compat === null || compat === void 0 ? void 0 : compat.supportsDeveloperRole) === false) {
    return model;
  }
  openaiModel.compat = compat
    ? __assign(__assign({}, compat), { supportsDeveloperRole: false })
    : { supportsDeveloperRole: false };
  return openaiModel;
}
