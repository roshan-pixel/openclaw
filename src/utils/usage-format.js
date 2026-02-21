"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatTokenCount = formatTokenCount;
exports.formatUsd = formatUsd;
exports.resolveModelCostConfig = resolveModelCostConfig;
exports.estimateUsageCost = estimateUsageCost;
function formatTokenCount(value) {
  if (value === undefined || !Number.isFinite(value)) {
    return "0";
  }
  var safe = Math.max(0, value);
  if (safe >= 1000000) {
    return "".concat((safe / 1000000).toFixed(1), "m");
  }
  if (safe >= 1000) {
    return "".concat((safe / 1000).toFixed(safe >= 10000 ? 0 : 1), "k");
  }
  return String(Math.round(safe));
}
function formatUsd(value) {
  if (value === undefined || !Number.isFinite(value)) {
    return undefined;
  }
  if (value >= 1) {
    return "$".concat(value.toFixed(2));
  }
  if (value >= 0.01) {
    return "$".concat(value.toFixed(2));
  }
  return "$".concat(value.toFixed(4));
}
function resolveModelCostConfig(params) {
  var _a, _b, _c, _d, _e, _f, _g;
  var provider = (_a = params.provider) === null || _a === void 0 ? void 0 : _a.trim();
  var model = (_b = params.model) === null || _b === void 0 ? void 0 : _b.trim();
  if (!provider || !model) {
    return undefined;
  }
  var providers =
    (_e =
      (_d = (_c = params.config) === null || _c === void 0 ? void 0 : _c.models) === null ||
      _d === void 0
        ? void 0
        : _d.providers) !== null && _e !== void 0
      ? _e
      : {};
  var entry =
    (_g = (_f = providers[provider]) === null || _f === void 0 ? void 0 : _f.models) === null ||
    _g === void 0
      ? void 0
      : _g.find(function (item) {
          return item.id === model;
        });
  return entry === null || entry === void 0 ? void 0 : entry.cost;
}
var toNumber = function (value) {
  return typeof value === "number" && Number.isFinite(value) ? value : 0;
};
function estimateUsageCost(params) {
  var usage = params.usage;
  var cost = params.cost;
  if (!usage || !cost) {
    return undefined;
  }
  var input = toNumber(usage.input);
  var output = toNumber(usage.output);
  var cacheRead = toNumber(usage.cacheRead);
  var cacheWrite = toNumber(usage.cacheWrite);
  var total =
    input * cost.input +
    output * cost.output +
    cacheRead * cost.cacheRead +
    cacheWrite * cost.cacheWrite;
  if (!Number.isFinite(total)) {
    return undefined;
  }
  return total / 1000000;
}
