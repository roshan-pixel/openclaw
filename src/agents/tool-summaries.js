"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.buildToolSummaryMap = buildToolSummaryMap;
function buildToolSummaryMap(tools) {
  var _a, _b;
  var summaries = {};
  for (var _i = 0, tools_1 = tools; _i < tools_1.length; _i++) {
    var tool = tools_1[_i];
    var summary =
      ((_a = tool.description) === null || _a === void 0 ? void 0 : _a.trim()) ||
      ((_b = tool.label) === null || _b === void 0 ? void 0 : _b.trim());
    if (!summary) {
      continue;
    }
    summaries[tool.name.toLowerCase()] = summary;
  }
  return summaries;
}
