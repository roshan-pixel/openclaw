"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLinkUnderstandingBody = formatLinkUnderstandingBody;
function formatLinkUnderstandingBody(params) {
  var _a, _b;
  var outputs = params.outputs
    .map(function (output) {
      return output.trim();
    })
    .filter(Boolean);
  if (outputs.length === 0) {
    return (_a = params.body) !== null && _a !== void 0 ? _a : "";
  }
  var base = ((_b = params.body) !== null && _b !== void 0 ? _b : "").trim();
  if (!base) {
    return outputs.join("\n");
  }
  return "".concat(base, "\n\n").concat(outputs.join("\n"));
}
